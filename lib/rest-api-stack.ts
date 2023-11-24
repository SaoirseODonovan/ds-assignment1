import * as cdk from "aws-cdk-lib";
import * as lambdanode from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as custom from "aws-cdk-lib/custom-resources";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { generateBatch } from "../shared/util";
import * as apig from "aws-cdk-lib/aws-apigateway";
import { movies, movieReviews} from "../seed/movies";
// import { Aws } from "aws-cdk-lib";
// import * as node from "aws-cdk-lib/aws-lambda-nodejs";

// type AppApiProps = {
//   userPoolId: string;
//   userPoolClientId: string;
// };

// export class RestAPIStack extends Construct {
//   constructor(scope: Construct, id: string, props: AppApiProps) {
//     super(scope, id);

export class RestAPIStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // const appApi = new apig.RestApi(this, "AppApi", {
    //   description: "App RestApi",
    //   endpointTypes: [apig.EndpointType.REGIONAL],
    //   defaultCorsPreflightOptions: {
    //     allowOrigins: apig.Cors.ALL_ORIGINS,
    //   },
    // });

    // const appCommonFnProps = {
    //   architecture: lambda.Architecture.ARM_64,
    //   timeout: cdk.Duration.seconds(10),
    //   memorySize: 128,
    //   runtime: lambda.Runtime.NODEJS_16_X,
    //   handler: "handler",
    //   environment: {
    //     USER_POOL_ID: props.userPoolId,
    //     CLIENT_ID: props.userPoolClientId,
    //     REGION: cdk.Aws.REGION,
    //   },
    // };

    // Tables 
    const moviesTable = new dynamodb.Table(this, "MoviesTable", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "movieId", type: dynamodb.AttributeType.NUMBER },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName: "Movies",
    });

    const movieReviewsTable = new dynamodb.Table(this, "MovieReviewsTable", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "movieId", type: dynamodb.AttributeType.NUMBER },
      sortKey: { name: "reviewDate", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName: "MovieReview",
    });
    
    // Functions 
    const getMovieByIdFn = new lambdanode.NodejsFunction(
      this,
      "GetMovieByIdFn",
      {
        architecture: lambda.Architecture.ARM_64,
        runtime: lambda.Runtime.NODEJS_16_X,
        entry: `${__dirname}/../lambdas/getMovieById.ts`,
        timeout: cdk.Duration.seconds(10),
        memorySize: 128,
        environment: {
          TABLE_NAME: moviesTable.tableName,
          REGION: 'eu-west-1',
        },
      }
      );

      const getReviewByIdFn = new lambdanode.NodejsFunction(
        this,
        "GetReviewsByIdFn",
        {
          architecture: lambda.Architecture.ARM_64,
          runtime: lambda.Runtime.NODEJS_16_X,
          entry: `${__dirname}/../lambdas/getReviewById.ts`,
          timeout: cdk.Duration.seconds(10),
          memorySize: 128,
          environment: {
            TABLE_NAME: movieReviewsTable.tableName,
            REGION: 'eu-west-1',
          },
        }
        );
      
      const getAllMoviesFn = new lambdanode.NodejsFunction(
        this,
        "GetAllMoviesFn",
        {
          architecture: lambda.Architecture.ARM_64,
          runtime: lambda.Runtime.NODEJS_16_X,
          entry: `${__dirname}/../lambdas/getAllMovies.ts`,
          timeout: cdk.Duration.seconds(10),
          memorySize: 128,
          environment: {
            TABLE_NAME: moviesTable.tableName,
            REGION: 'eu-west-1',
          },
        }
        );

        const addMovieReviewsFn = new lambdanode.NodejsFunction(
          this,
          "AddMovieReviewsFn",
          {
            architecture: lambda.Architecture.ARM_64,
            runtime: lambda.Runtime.NODEJS_16_X,
            entry: `${__dirname}/../lambdas/addMovieReviews.ts`,
            timeout: cdk.Duration.seconds(10),
            memorySize: 128,
            environment: {
              TABLE_NAME: movieReviewsTable.tableName,
              REGION: "eu-west-1",
            },
          }
        );

        const getReviewByReviewerNameFn = new lambdanode.NodejsFunction(
          this,
          "GetReviewByReviewerNameFn",
          {
            architecture: lambda.Architecture.ARM_64,
            runtime: lambda.Runtime.NODEJS_16_X,
            entry: `${__dirname}/../lambdas/getReviewByReviewerName.ts`,
            timeout: cdk.Duration.seconds(10),
            memorySize: 128,
            environment: {
              TABLE_NAME: movieReviewsTable.tableName,
              REGION: 'eu-west-1',
            },
          }
        );

        const getAllReviewsByReviewerFn = new lambdanode.NodejsFunction(
          this,
          "GetAllReviewsByReviewerFn",
          {
            architecture: lambda.Architecture.ARM_64,
            runtime: lambda.Runtime.NODEJS_16_X,
            entry: `${__dirname}/../lambdas/getAllReviewsByReviewer.ts`,
            timeout: cdk.Duration.seconds(10),
            memorySize: 128,
            environment: {
              TABLE_NAME: movieReviewsTable.tableName,
              REGION: 'eu-west-1',
            },
          }
        );

        const getReviewsByMovieFn = new lambdanode.NodejsFunction(
          this,
          "GetReviewsByMovieFn",
          {
            architecture: lambda.Architecture.ARM_64,
            runtime: lambda.Runtime.NODEJS_16_X,
            entry: `${__dirname}/../lambdas/getReviewsByMovie.ts`,
            timeout: cdk.Duration.seconds(10),
            memorySize: 128,
            environment: {
              TABLE_NAME: movieReviewsTable.tableName,
              REGION: 'eu-west-1',
            },
          }
        );

        const updateReviewContentFn = new lambdanode.NodejsFunction(
          this,
          "UpdateReviewContentFn",
          {
            architecture: lambda.Architecture.ARM_64,
            runtime: lambda.Runtime.NODEJS_16_X,
            entry: `${__dirname}/../lambdas/putReviewContent.ts`,
            timeout: cdk.Duration.seconds(10),
            memorySize: 128,
            environment: {
              TABLE_NAME: movieReviewsTable.tableName,
              REGION: 'eu-west-1',
            },
          }
        );
        

        new custom.AwsCustomResource(this, "moviesddbInitData", {
          onCreate: {
            service: "DynamoDB",
            action: "batchWriteItem",
            parameters: {
              RequestItems: {
                [movieReviewsTable.tableName]: generateBatch(movieReviews),
                [moviesTable.tableName]: generateBatch(movies),
              },
            },
            physicalResourceId: custom.PhysicalResourceId.of("moviesddbInitData"), //.of(Date.now().toString()),
          },
          policy: custom.AwsCustomResourcePolicy.fromSdkCalls({
            resources: [moviesTable.tableArn, movieReviewsTable.tableArn],
          }),
        });

        const newMovieFn = new lambdanode.NodejsFunction(this, "AddMovieFn", {
          architecture: lambda.Architecture.ARM_64,
          runtime: lambda.Runtime.NODEJS_16_X,
          entry: `${__dirname}/../lambdas/addMovie.ts`,
          timeout: cdk.Duration.seconds(10),
          memorySize: 128,
          environment: {
            TABLE_NAME: moviesTable.tableName,
            REGION: "eu-west-1",
          },
        });

        const deleteMovieFn = new lambdanode.NodejsFunction(this, "DeleteMovieFn", {
          architecture: lambda.Architecture.ARM_64,
          runtime: lambda.Runtime.NODEJS_16_X,
          entry: `${__dirname}/../lambdas/deleteMovie.ts`,
          timeout: cdk.Duration.seconds(10),
          memorySize: 128,
          environment: {
            TABLE_NAME: moviesTable.tableName,
            REGION: "eu-west-1",
          },
        });
        
        // Permissions 
        moviesTable.grantReadData(getMovieByIdFn)
        moviesTable.grantReadData(getAllMoviesFn)
        moviesTable.grantReadWriteData(newMovieFn)
        moviesTable.grantReadWriteData(deleteMovieFn)
        movieReviewsTable.grantReadWriteData(addMovieReviewsFn)
        movieReviewsTable.grantReadWriteData(getReviewByIdFn)
        movieReviewsTable.grantReadWriteData(getReviewByReviewerNameFn)
        movieReviewsTable.grantReadWriteData(getAllReviewsByReviewerFn)
        movieReviewsTable.grantReadWriteData(getReviewsByMovieFn)
        movieReviewsTable.grantReadWriteData(updateReviewContentFn)

            // REST API 
    const api = new apig.RestApi(this, "RestAPI", {
      description: "demo api",
      deployOptions: {
        stageName: "dev",
      },
      // 👇 enable CORS
      defaultCorsPreflightOptions: {
        allowHeaders: ["Content-Type", "X-Amz-Date"],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowCredentials: true,
        allowOrigins: ["*"],
      },
    });

    const moviesEndpoint = api.root.addResource("movies");
    moviesEndpoint.addMethod(
      "GET",
      new apig.LambdaIntegration(getAllMoviesFn, { proxy: true })
    );

    // const authorizerFn = new node.NodejsFunction(this, "AuthorizerFn", {
    //   ...appCommonFnProps,
    //   entry: "./lambdas/auth/authorizer.ts",
    // });

    // const requestAuthorizer = new apig.RequestAuthorizer(
    //   this,
    //   "RequestAuthorizer",
    //   {
    //     identitySources: [apig.IdentitySource.header("cookie")],
    //     handler: authorizerFn,
    //     resultsCacheTtl: cdk.Duration.minutes(0),
    //   }
    // );
    
    //post and get for movies/reviews
    const allMovieReviewsEndpoint = moviesEndpoint.addResource("reviews");
    allMovieReviewsEndpoint.addMethod(
      "POST",
      new apig.LambdaIntegration(addMovieReviewsFn, { proxy: true })
    );
    allMovieReviewsEndpoint.addMethod(
      "GET",
      new apig.LambdaIntegration(getReviewsByMovieFn, { proxy: true })
    );

    const allReviewersEndpoint = allMovieReviewsEndpoint.addResource("{reviewerName}")
        allReviewersEndpoint.addMethod(
      "GET",
      new apig.LambdaIntegration(getAllReviewsByReviewerFn, { proxy: true })
    )

    const movieEndpoint = moviesEndpoint.addResource("{movieId}");
    movieEndpoint.addMethod(
      "GET",
      new apig.LambdaIntegration(getMovieByIdFn, { proxy: true })
    );
    moviesEndpoint.addMethod(
      "POST",
      new apig.LambdaIntegration(newMovieFn, { proxy: true })
    );
    movieEndpoint.addMethod(
      "DELETE",
      new apig.LambdaIntegration(deleteMovieFn, { proxy: true })
    );

    //post and get reviews to /movies/{movieId}
    const movieReviewsEndpoint = movieEndpoint.addResource("reviews");
    movieReviewsEndpoint.addMethod(
      "POST",
      new apig.LambdaIntegration(addMovieReviewsFn, { proxy: true })
    );
    movieReviewsEndpoint.addMethod(
      "GET",
      new apig.LambdaIntegration(getReviewByIdFn, { proxy: true })
    );

    // const movieReviewersNameEndpoint = movieReviewsEndpoint.addResource("{reviewerName}");
    const movieReviewersNameEndpoint = movieReviewsEndpoint.addResource("{reviewerName}");
    movieReviewersNameEndpoint.addMethod(
      "GET",
      new apig.LambdaIntegration(getReviewByReviewerNameFn, { proxy: true })
    );
    movieReviewersNameEndpoint.addMethod(
      "PUT",
      new apig.LambdaIntegration(updateReviewContentFn, { proxy: true })
    );

    // movieReviewersNameEndpoint.addMethod(
    //   "GET",
    //   new apig.LambdaIntegration(getReviewByReviewerNameFn, { proxy: true })
    // );
        
      }
    }
    
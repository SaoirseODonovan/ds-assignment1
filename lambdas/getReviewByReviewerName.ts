import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommandInput, QueryCommand } from "@aws-sdk/lib-dynamodb";

const ddbDocClient = createDDbDocClient();

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  try {
    console.log("Event: ", event);

    const movieId = parseInt(event?.pathParameters?.movieId ?? "");
    const category = event?.pathParameters?.reviewerName ? event?.pathParameters?.reviewerName : undefined;
    //regex used to determine if a year is present
    //https://support.abbyy.com/hc/en-us/articles/360017269980-Regular-expressions
    const regex = new RegExp("20[0-9][0-9]")

    if (!movieId || !category) {
      return {
        statusCode: 404,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ Message: "Invalid movie Id or review category" }),
      };
    }

  let commandInput: QueryCommandInput={
    TableName: process.env.TABLE_NAME,
}

if (regex.test(category)){
    commandInput = {   
        ...commandInput,       
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: "movieId = :m and begins_with(reviewDate, :y)",
        ExpressionAttributeValues: {
            ":m": movieId,
            ":y": category
        },
    }
}else{
     commandInput = {   
        ...commandInput,       
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: "movieId = :m",
        FilterExpression: "reviewerName = :r",
        ExpressionAttributeValues: {
            ":m": movieId,
            ":r": category
        },
    }
}

    const commandOutput = await ddbDocClient.send(
        new QueryCommand(commandInput)
        );

    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        data: commandOutput.Items,
      }),
    };
  } catch (error: any) {
    console.log(JSON.stringify(error));
    return {
      statusCode: 500,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ error }),
    };
  }
};

function createDDbDocClient() {
  const ddbClient = new DynamoDBClient({ region: process.env.REGION });
  const marshallOptions = {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  };
  const unmarshallOptions = {
    wrapNumbers: false,
  };
  const translateConfig = { marshallOptions, unmarshallOptions };
  return DynamoDBDocumentClient.from(ddbClient, translateConfig);
}

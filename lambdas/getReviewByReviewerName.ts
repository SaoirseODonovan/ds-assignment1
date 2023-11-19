import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const ddbDocClient = createDDbDocClient();

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  try {
    console.log("Event: ", event);
    
const movieId = parseInt(event?.pathParameters?.movieId ?? "");
const reviewerName = event?.pathParameters?.reviewerName;

if (!movieId || !reviewerName) {
  return {
    statusCode: 404,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ Message: "Invalid movie Id or entered reviewer name" }),
  };
}

    const commandInput = {
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: "movieId = :m and reviewerName = :r",
      ExpressionAttributeValues: {
        ":m": movieId,
        ":r": reviewerName,
      },
    };

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
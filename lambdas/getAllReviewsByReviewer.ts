import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {  DynamoDBDocumentClient, ScanCommand  } from "@aws-sdk/lib-dynamodb";

const ddbDocClient = createDDbDocClient();

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  try {
    console.log("Event: ", event);
    
const reviewerName = event?.pathParameters?.reviewerName;

if (!reviewerName) {
  return {
    statusCode: 404,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ Message: "Invalid reviewer name" }),
  };
}

    const commandOutput = await ddbDocClient.send(
        new ScanCommand({
        TableName: process.env.TABLE_NAME,
        FilterExpression: "reviewerName = :r",
        ExpressionAttributeValues: {
            ":r": reviewerName
        },
      })
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
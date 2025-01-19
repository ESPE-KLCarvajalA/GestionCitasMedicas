const AWS = require("aws-sdk");

exports.getCita = async (event) => {
    const dynamodb = new AWS.DynamoDB.DocumentClient();

    const result = await dynamodb.scan({
        TableName: "CitaTable",
    }).promise();
    const citas = result.Items;
    return {
        status: 200,
        body: {citas, },
    };
};
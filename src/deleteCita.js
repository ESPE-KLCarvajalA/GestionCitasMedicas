const AWS = require("aws-sdk");

exports.deleteCita = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { id } = event.pathParameters;

  try {
    await dynamodb
      .delete({
        TableName: "CitaTable",
        Key: { id },
      })
      .promise();

    return {
      statusCode: 200, 
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ message: "Cita eliminada satisfactoriamente" }), 
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error al eliminar la cita." }),
    };
  }
};

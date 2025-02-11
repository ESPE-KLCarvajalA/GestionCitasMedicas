const AWS = require("aws-sdk");

exports.updateCita = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { id } = event.pathParameters;
  const { date, reason, status } = JSON.parse(event.body);

  if (!date && !reason && !status) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 
        "Al menos un campo debe ser actualizado." }),
    };
  }

  let updateExpression = "set";
  let expressionAttributeValues = {};
  let expressionAttributeNames = {}; 

  if (date) {
    updateExpression += " #dt = :date,";
    expressionAttributeValues[":date"] = date;
    expressionAttributeNames["#dt"] = "date";
  }
  if (reason) {
    updateExpression += " #rsn = :reason,";
    expressionAttributeValues[":reason"] = reason;
    expressionAttributeNames["#rsn"] = "reason";
  }
  if (status) {
    updateExpression += " #st = :status,";
    expressionAttributeValues[":status"] = status;
    expressionAttributeNames["#st"] = "status";
  }

  updateExpression = updateExpression.slice(0, -1);

  try {
    const updatedCita = await dynamodb
      .update({
        TableName: "CitaTable",
        Key: { id },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames,
        ReturnValues: "ALL_NEW",
      })
      .promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        message: "Cita actualizada satisfactoriamente",
        updatedCita: updatedCita.Attributes, 
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error al actualizar la cita." }),
    };
  }
};

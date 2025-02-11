const { v4 } = require("uuid");
const AWS = require("aws-sdk");

exports.createCita = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { patientId, doctorId, date, reason } = JSON.parse(event.body);

  if (!patientId || !doctorId || !date || !reason) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Todos los campos son obligatorios." }),
    };
  }

  const createdAt = new Date().toISOString();
  const id = v4();

  const newCita = {
    id,
    patientId,
    doctorId,
    date,
    reason,
    status: "scheduled", 
    createdAt,
  };

  try {
    await dynamodb
      .put({
        TableName: "CitaTable",
        Item: newCita,
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify(newCita),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error al crear la cita." }),
    };
  }
};

require("dotenv").config();
const express = require("express");
const AWS = require("aws-sdk");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configure AWS
AWS.config.update({ region: process.env.AWS_REGION });

const sagemakerRuntime = new AWS.SageMakerRuntime();
const endpointName = process.env.SAGEMAKER_ENDPOINT;

// API Route for Predictions
app.post("/predict", async (req, res) => {
  try {
    const payload = {
      instances: req.body.instances, // Expecting past target values
    };

    console.log(payload)

    const params = {
      EndpointName: endpointName,
      Body: JSON.stringify(payload),
      ContentType: "application/json",
    };

    const response = await sagemakerRuntime.invokeEndpoint(params).promise();
    const result = JSON.parse(response.Body.toString());

    res.json({ forecast: result });
  } catch (error) {
    console.error("Error calling SageMaker:", error);
    res.status(500).json({ error: "Prediction failed" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

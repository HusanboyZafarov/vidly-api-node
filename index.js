const winston = require("winston");
const express = require("express");
const config = require("config");
const app = express();

// Setup logging first (winston)
require("./startup/logging")();

// Load Joi validation and ObjectId validator
require("./startup/validation")();

// Connect to the database
require("./startup/db")();

// Load routes
require("./startup/routes")(app);

// Ensure app configuration is valid
require("./startup/config")();

// Set up CORS
require("./startup/cors")(app);

// Port configuration
const port = process.env.PORT || config.get("port");

// Start the server
const server = app.listen(port, () => {
  winston.info(`Listening on port ${port}...`);
});

// Handle uncaught exceptions and unhandled rejections
winston.exceptions.handle(
  new winston.transports.Console({ format: winston.format.simple() }),
  new winston.transports.File({ filename: "exceptions.log" })
);

// Gracefully shut down the server on unhandled promise rejections
process.on("unhandledRejection", (ex) => {
  throw ex; // Let winston handle the exception
});

// Gracefully shutdown on SIGTERM or SIGINT (e.g., Ctrl+C or kill)
process.on("SIGTERM", () => {
  winston.info("SIGTERM signal received. Shutting down gracefully...");
  server.close(() => {
    winston.info("Process terminated.");
  });
});

process.on("SIGINT", () => {
  winston.info("SIGINT signal received. Shutting down gracefully...");
  server.close(() => {
    winston.info("Process terminated.");
  });
});

// Export the server for testing
module.exports = server;

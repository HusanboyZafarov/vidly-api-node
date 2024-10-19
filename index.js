const winston = require("winston");
const express = require("express");
const config = require("config");
const cors = require("cors");
const app = express();

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

require("./startup/cors")(app);

// Setup logging (winston)
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

// Port configuration
const PORT = process.env.PORT || 3900;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});

// Gracefully handle shutdowns
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
});

// Handle uncaught exceptions and unhandled rejections
winston.exceptions.handle(
  new winston.transports.Console({ format: winston.format.simple() }),
  new winston.transports.File({ filename: "exceptions.log" })
);

process.on("unhandledRejection", (ex) => {
  throw ex; // Let winston handle the exception
});

// Export the server for testing
module.exports = server;

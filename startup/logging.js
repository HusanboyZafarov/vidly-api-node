const winston = require("winston");
require("express-async-errors"); // For handling async errors

module.exports = function () {
  // Create a new Winston logger instance
  const logger = winston.createLogger({
    transports: [
      new winston.transports.File({ filename: "logfile.log" }), // Logfile transport
      new winston.transports.Console({
        // Console transport with pretty print
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.prettyPrint(),
          winston.format.simple()
        ),
      }),
    ],
    exceptionHandlers: [
      new winston.transports.Console({ format: winston.format.simple() }),
      new winston.transports.File({ filename: "uncaughtExceptions.log" }),
    ],
    rejectionHandlers: [
      // Handle unhandled rejections
      new winston.transports.File({ filename: "unhandledRejections.log" }),
    ],
  });

  // Handle unhandled promise rejections globally
  process.on("unhandledRejection", (ex) => {
    throw ex; // Handled by the Winston rejectionHandlers
  });

  // If you want to export the logger instance for use in other parts of your app
  return logger;
};

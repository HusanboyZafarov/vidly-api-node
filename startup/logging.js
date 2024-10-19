const winston = require("winston");
require("express-async-errors");

module.exports = function () {
  winston.createLogger({
    transports: [
      new winston.transports.File({ filename: "logfile.log" }),
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
    ],
    exceptionHandlers: [
      new winston.transports.File({ filename: "uncaughtExceptions.log" }),
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    ],
    rejectionHandlers: [
      new winston.transports.File({ filename: "unhandledRejections.log" }),
    ],
  });
};

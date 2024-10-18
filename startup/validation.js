const Joi = require("joi");
const objectId = require("joi-objectid");

module.exports = function () {
  Joi.objectId = objectId(Joi);
};

const Joi = require("joi");
const mongoose = require("mongoose");

// Mongoose schema definition for Genre
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

// Mongoose model for Genre
const Genre = mongoose.model("Genre", genreSchema);

// Function to validate Genre input using Joi
function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });

  return schema.validate(genre); // Correct use of schema.validate()
}

// Exporting the schema, model, and validate function
exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenre;

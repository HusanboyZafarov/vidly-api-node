const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

// Mongoose schema definition for Movie
const Movie = mongoose.model(
  "Movies",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 255,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
  })
);

// Function to validate Movie input using Joi
function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    genreId: Joi.objectId().required(), // Validate genreId as an objectId
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  });

  return schema.validate(movie); // Correct use of schema.validate()
}

// Exporting the Movie model and validation function
exports.Movie = Movie;
exports.validate = validateMovie;

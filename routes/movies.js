const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const moment = require("moment");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// Get all movies
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().select("-__v").sort("name");
    res.send(movies);
  } catch (ex) {
    res.status(500).send("Something went wrong.");
  }
});

// Create a new movie
router.post("/", [auth], async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genre.");

    const movie = new Movie({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
      publishDate: moment().toJSON(),
    });
    await movie.save();

    res.send(movie);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

// Update an existing movie
router.put("/:id", [auth], async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genre.");

    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: genre.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
      },
      { new: true }
    );

    if (!movie)
      return res.status(404).send("The movie with the given ID was not found.");

    res.send(movie);
  } catch (ex) {
    res.status(500).send("Something failed during movie update.");
  }
});

// Delete a movie
router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid movie ID.");
    }

    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie)
      return res.status(404).send("The movie with the given ID was not found.");

    res.send(movie);
  } catch (ex) {
    console.error("Something failed during movie deletion:", ex); // Logging the error for better debugging
    res.status(500).send("Something failed during movie deletion.");
  }
});

// Get a single movie by ID
router.get("/:id", validateObjectId, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).select("-__v");

    if (!movie)
      return res.status(404).send("The movie with the given ID was not found.");

    res.send(movie);
  } catch (ex) {
    res.status(500).send("Something went wrong.");
  }
});

module.exports = router;

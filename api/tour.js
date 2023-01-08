const express = require("express");
const router = express.Router();

const { getTours, getTour, createTour, deleteTour, updateTour } = require("../controllers/tourController");

// GET all tours
router.get("/", getTours);

// GET single tour
router.get("/:id", getTour);

// POST new tour
router.post("/", createTour);

// DELETE a tour
router.delete("/:id", deleteTour);

// PUT a tour
router.put("/:id", updateTour);

module.exports = router;

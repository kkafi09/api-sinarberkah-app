const { default: mongoose } = require("mongoose");
const Tour = require("../models/tourModel");

const getTours = async (req, res) => {
  const tours = await Tour.find({});

  return res.status(200).json({ tours, message: "get all tours" });
};

const getTour = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No tour found" });
  }

  const tour = await Tour.findById(id);

  if (!tour) {
    return res.status(400).json({ error: "No tour found" });
  }

  return res.status(200).json({ tour, message: "get single tour" });
};

const createTour = async (req, res) => {
  const { name, image, location, price, vtour } = req.body;

  try {
    const tour = await Tour.create({ name, image, location, price, vtour });
    return res.status(200).json({ tour, message: "success add new tour" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const deleteTour = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No tour found" });
  }

  const tour = await Tour.findOneAndDelete({ _id: id });

  if (!tour) {
    return res.status(400).json({ error: "Tour tidak ditemukan" });
  }

  return res.status(200).json({ message: "Sukses menghapus tour" });
};

const updateTour = async (req, res) => {
  const { id } = req.params;

  const result = await Tour.findOneAndUpdate({ _id: id }, { ...req.body });

  if (!result) {
    return res.status(200).json({ message: "No data updated" });
  }

  return res.status(200).json({ message: "Sukses update tour" });
};

module.exports = { getTours, getTour, createTour, deleteTour, updateTour };

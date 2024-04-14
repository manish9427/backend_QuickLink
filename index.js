// Require necessary packages
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Define schema and model for heading and paragraph
const { Schema } = mongoose;

const headingParagraphSchema = new Schema({
  heading: String,
  paragraph: String,
});

const HeadingParagraph = mongoose.model(
  "HeadingParagraph",
  headingParagraphSchema
);

// CRUD routes
app.post("/heading-paragraph", async (req, res) => {
  try {
    const { heading, paragraph } = req.body;
    const newHeadingParagraph = new HeadingParagraph({ heading, paragraph });
    await newHeadingParagraph.save();
    res.status(201).json(newHeadingParagraph);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/heading-paragraph", async (req, res) => {
  try {
    const headingParagraphs = await HeadingParagraph.find();
    res.json(headingParagraphs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific heading and paragraph by ID
app.get("/heading-paragraph/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const headingParagraph = await HeadingParagraph.findById(id);
    if (!headingParagraph) {
      return res
        .status(404)
        .json({ message: "Heading and paragraph not found" });
    }
    res.json(headingParagraph);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/heading-paragraph/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedHeadingParagraph = await HeadingParagraph.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.json(updatedHeadingParagraph);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/heading-paragraph/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await HeadingParagraph.findByIdAndDelete(id);
    res.json({ message: "Heading and paragraph deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

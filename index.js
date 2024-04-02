const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const itemRouter = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

// Middleware
app.use(express.json());

// Routes
app.use("/api", itemRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});


const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

// Load environment variables from config/.env
dotenv.config({ path: "./config/.env" });

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.DB_URI);
const db = mongoose.connection;

// Handle MongoDB connection errors
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB successfully");
});

// Middleware for parsing JSON in requests
app.use(express.json());

// Define routes

// GET: Return all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST: Add a new user to the database
app.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT: Edit a user by ID
app.put("/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// DELETE: Remove a user by ID

app.delete('/users/:id', async (req, res) => {
    const userId = req.params.id; // Ensure you are using 'id' here, not 'user_id'

    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        res.json(deletedUser);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Start the Express app
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Task = require("./models/Task");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/todo-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB error:", err));

// Routes
app.get("/api/tasks", async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

app.post("/api/tasks", async (req, res) => {
    const { text } = req.body;
    const task = new Task({ text });
    await task.save();
    res.json(task);
});

app.put("/api/tasks/:id", async (req, res) => {
    const { completed } = req.body;
    await Task.findByIdAndUpdate(req.params.id, { completed });
    res.sendStatus(200);
});

app.delete("/api/tasks/:id", async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

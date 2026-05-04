const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

// get tasks
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
});

// add task
router.post("/", auth, async (req, res) => {
  const newTask = new Task({
    userId: req.user.id,
    title: req.body.title
  });
  await newTask.save();
  res.json(newTask);
});

// delete task
router.delete("/:id", auth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

module.exports = router;
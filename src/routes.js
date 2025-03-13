import express from "express";
import { DatabaseStorageStrategy } from "./DatabaseStorageStrategy.js";

const router = express.Router();
const dbStorage = new DatabaseStorageStrategy();

router.get("/", async (req, res) => {
  try {
    const tasks = await dbStorage.getAll();
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

router.post("/", async (req, res) => {
  try {
    const task = await dbStorage.save(req.body);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to save task" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await dbStorage.update({ ...req.body, id: req.params.id });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await dbStorage.delete({ id: req.params.id });
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;

import { TaskDataValidator } from "./TaskDataValidator.js";
import "./types.js";

export class Task {
  /**
   * Creates a new Task instance.
   * @param {TaskData} taskData - The taskData object.
   * @throws {Error} If validation fails.
   */
  constructor(taskData) {
    TaskDataValidator.validate(taskData);
    const {
      description,
      completed,
      id,
      priority,
      createdDate,
      completedDate,
      projects,
      contexts,
    } = taskData;
    this.description = description;
    this.completed = completed;
    this.id = id || Date.now();
    this.createdDate = createdDate || null;
    this.completedDate = completedDate || null;
    this.priority = priority || null;
  }
}

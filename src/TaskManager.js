import { Task } from "./Task.js";
import { StorageStrategy } from "./StorageStrategy.js";
import "./types.js";

export class TaskManager {
  /**
   * @param {StorageStrategy}
   */
  constructor(storageStrategy) {
    /** @type {StorageStrategy} */
    this.storageStrategy = storageStrategy;
  }

  /**
   * @param {TaskData} taskData
   */
  async addTask(taskData) {
    const createdDate =
      taskData.createdDate ?? new Date().toISOString().split("T")[0];
    taskData.createdDate = createdDate;
    const task = new Task(taskData);
    await this.storageStrategy.save(task);
  }

  async getTasks() {
    return this.storageStrategy.getAll();
  }

  async updateTask(task) {
    await this.storageStrategy.update(task);
  }

  async deleteTask(task) {
    await this.storageStrategy.delete(task);
  }
}

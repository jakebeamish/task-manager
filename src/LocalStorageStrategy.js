import { StorageStrategy } from "./StorageStrategy.js";
import { Task } from "./Task.js";
import "./types.js";

export class LocalStorageStrategy extends StorageStrategy {
  /**
   * Helper method to get tasks from localStorage.
   * @private
   * @returns {Task[]}
   */
  _getTasksFromStorage() {
    const tasks = localStorage.getItem("tasks");
    return tasks ? JSON.parse(tasks).map((t) => new Task(t)) : [];
  }

  /**
   * Helper method to set tasks to localStorage.
   * @private
   */
  _setTasksToStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  async save(task) {
    const tasks = this._getTasksFromStorage();
    tasks.push(task);
    this._setTasksToStorage(tasks);
  }

  async getAll() {
    return this._getTasksFromStorage();
  }

  /**
   * Update an existing task in tasks.
   * Identifies the task to update by checking its `id`, and replaces
   * it with the given task.
   * @param {Task} task
   */
  async update(task) {
    const tasks = this._getTasksFromStorage();
    const index = tasks.findIndex((t) => t.id === task.id);
    if (index !== -1) {
      tasks[index] = task;
      this._setTasksToStorage(tasks);
    }
  }

  async delete(task) {
    const tasks = this._getTasksFromStorage();
    const updatedTasks = tasks.filter((t) => t.id !== task.id);
    this._setTasksToStorage(updatedTasks);
  }
}

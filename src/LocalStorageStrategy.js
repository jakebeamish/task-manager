import { StorageStrategy } from './StorageStrategy.js';
import { Task } from './Task.js';
import './types.js';

export class LocalStorageStrategy extends StorageStrategy {

  /**
   * Helper method to get tasks from localStorage.
   * @private
   * @returns {Task[]}
   */
  _getTasksFromStorage() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  }

  /**
   * Helper method to set tasks to localStorage.
   * @private
   */
  _setTasksToStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  async save(task) {
    const tasks = this._getTasksFromStorage();
    tasks.push(task);
    this._setTasksToStorage(tasks);
  }

  async getAll() {
    return this._getTasksFromStorage();
  }

  async update(task) {
    const tasks = this._getTasksFromStorage();
    const index = tasks.findIndex(t => t.description === task.description);
    if (index !== -1) {
      tasks[index] = task;
      this._setTasksToStorage(tasks);
    }
  }

  async delete(task) {
    const tasks = this._getTasksFromStorage();
    const updatedTasks = tasks.filter(t => t.description !== task.description);
    this._setTasksToStorage(updatedTasks);
  }
}

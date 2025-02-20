import { TaskDataValidator } from './TaskDataValidator.js'

/** @typedef {Object} TaskData
 * @property {string} description - Task description (required).
 * @property {boolean} completed - Completion status (required).
 */

export class Task {
  /**
   * Creates a new Task instance.
   * @param {TaskData} taskData - The taskData object.
   * @throws {Error} If validation fails.
   */
  constructor({ description, completed }) {
    TaskDataValidator.validate({ description, completed });
    this.description = description;
    this.completed = completed;
  }
}


import { TaskDataValidator } from './TaskDataValidator.js';
import './types.js';

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


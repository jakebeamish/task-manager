import './types.js';

export class TaskDataValidator {
  /** Validates a TaskData object.
   * @param {TaskData} taskData - The taskData object to validate.
   * @throws {Error} If validation fails.
   */
  static validate(taskData) {
    const { description, completed } = taskData;
    if (typeof description !== "string" || description === "") {
      throw new Error("Description must be a non-empty string.");
    }

    if (typeof completed !== "boolean") {
      throw new Error("Completed must be a boolean.");
    }
  }
}


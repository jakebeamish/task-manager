import './types.js';

export class TaskDataValidator {
  /** Validates a TaskData object.
   * @param {TaskData} taskData - The taskData object to validate.
   * @throws {Error} If validation fails.
   */
  static validate(taskData) {
    const { description, completed, priority } = taskData;
    if (typeof description !== "string" || description === "") {
      throw new Error("Description must be a non-empty string.");
    }

    if (typeof completed !== "boolean") {
      throw new Error("Completed must be a boolean.");
    }

    if (priority && (priority.charCodeAt(0) < 65 || priority.charCodeAt(0) > 90)) {
      throw new Error("Priority must be an uppercase letter.");
    }
  }
}


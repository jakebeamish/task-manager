import "./types.js";

export class TaskDataValidator {
  /** Validates a TaskData object.
   * @param {TaskData} taskData - The taskData object to validate.
   * @throws {Error} If validation fails.
   */
  static validate(taskData) {
    TaskDataValidator.validateDescription(taskData);
    TaskDataValidator.validateCompleted(taskData);
    TaskDataValidator.validatePriority(taskData);
  }

  /**
   * @param {TaskData} taskData
   */
  static validateDescription(taskData) {
    const { description } = taskData;
    if (typeof description !== "string" || description === "") {
      throw new Error("Description must be a non-empty string.");
    }
  }

  /**
   * @param {TaskData} taskData
   */
  static validateCompleted(taskData) {
    const { completed } = taskData;
    if (typeof completed !== "boolean") {
      throw new Error("Completed must be a boolean.");
    }
  }

  /**
   * @param {TaskData} taskData
   */
  static validatePriority(taskData) {
    const { priority } = taskData;
    if (
      priority &&
      (priority.charCodeAt(0) < 65 || priority.charCodeAt(0) > 90)
    ) {
      throw new Error("Priority must be an uppercase letter.");
    }
  }
}

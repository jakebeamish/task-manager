import "./types.js";

/**
 * Helper class for validating {@link TaskData}.
 */
export class TaskDataValidator {
  /** Validates a TaskData object.
   * @param {TaskData} taskData - The taskData object to validate.
   * @throws {Error} If validation fails.
   */
  static validate(taskData) {
    const { description, completed, priority = null, createdDate = null, completedDate = null } = taskData;
    this.validateDescription(description);
    this.validateCompleted(completed);
    this.validatePriority(priority);
    this.validateDate(createdDate);
    this.validateCompletedDate(taskData);
  }

  /**
   * @param {string} description
   */
  static validateDescription(description) {
    if (typeof description !== "string" || description === "") {
      throw new Error("Description must be a non-empty string.");
    }
  }

  /**
   * @param {boolean} completed
   */
  static validateCompleted(completed) {
    if (typeof completed !== "boolean") {
      throw new Error("Completed must be a boolean.");
    }
  }

  /**
   * @param {string | undefined} priority
   */
  static validatePriority(priority) {
    if (
      priority &&
      (typeof priority !== "string" ||
        priority.charCodeAt(0) < 65 ||
        priority.charCodeAt(0) > 90)
    ) {
      throw new Error("Priority must be an uppercase letter.");
    }
  }

  /**
   * @param {string } date
   */
  static validateDate(date) {
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error("Date must be in the format YYYY-MM-DD.");
    }
  }

  static validateCompletedDate({ createdDate, completedDate, completed }) {
    if (completed !== true && completedDate) {
      throw new Error(
        "Completed must be true for a Task to have a completed date."
      );
    }

    if (createdDate > completedDate) {
      throw new Error("Completed date cannot be before created date.");
    }
  }
}

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
    if (typeof description !== "string" || description === "") {
      throw new Error("Description must be a non-empty string.");
    }

    if (typeof completed !== "boolean") {
      throw new Error("Completed must be a boolean.");
    }

    this.description = description;
    this.completed = completed;
  }
}

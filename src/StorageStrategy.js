/**
 * Abstract class representing a storage strategy for tasks.
 * Concrete implementations must provide methods for saving,
 * retrieving, updating and deleting tasks.
 */
export class StorageStrategy {
  /**
   * Save a task to storage.
   * @param {Object} task - The task to save.
   * @returns {Promise<void>} - The saved task.
   * @throws {Error} If not implemented.
   */
  async save(task) {
    throw new Error("Method 'save' should be implemented.")
  }

  /**
   * Get all tasks from storage.
   * @returns {Promise<Task[]>} An array of all tasks.
   * @throws {Error} If not implemented.
   */
  async getAll() {
    throw new Error("Method 'getAll' should be implemented.")
  }

  /**
   * Update a task.
   * @param {Task} task
   * @returns {Promise<void>}
   * @throws {Error} If not implemented.
   */
  async update(task) {
    throw new Error("Method 'update' should be implemented.")
  }

  /**
   * Delete a task.
   * @param {Task} task
   * @returns {Promise<void>}
   * @throws {Error} If not implemented.
   */
  async delete(task) {
    throw new Error("Method 'delete' should be implemented.")
  }
}


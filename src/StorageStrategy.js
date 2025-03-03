export class StorageStrategy {
  /**
   * Save a task to storage.
   * @param {Task} task
   * @returns {Promise<void>}
   */
  async save(task) {
    throw new Error("Method 'save' should be implemented.")
  }

  /**
   * Get all tasks from storage.
   * @returns {Promise<Task[]>} An array of all tasks.
   */
  async getAll() {
    throw new Error("Method 'getAll' should be implemented.")
  }

  /**
   * Update a task.
   * @param {Task} task
   * @returns {Promise<void>}
   */
  async update(task) {
    throw new Error("Method 'update' should be implemented.")
  }

  /**
   * Delete a task.
   * @param {Task} task
   * @returns {Promise<void>}
   */
  async delete(task) {
    throw new Error("Method 'delete' should be implemented.")
  }
}


export class Task {
  /**
   * @param {string} text - The task description.
   * @param {number} [id=Date.now()] - A unique task ID (default: current timestamp).
   * @param {boolean} [completed=false] - Task completion status (default: false).
   */
  constructor(text, id = Date.now(), completed = false) {
    this.text = text;
    this.id = id;
    this.completed = completed;
  }

  toggle() {
    this.completed = !this.completed;
  }
}

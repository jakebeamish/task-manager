import { Task } from "../src/Task.js";

describe("Task", () => {
  describe("constructor", () => {
    it("should successfully create a task if TaskData is valid", () => {
      const task = new Task({
        description: "Buy oat milk",
        completed: false
      });

      expect(task instanceof Task).toBeTruthy();
      expect(task.description).toBe("Buy oat milk");
      expect(task.completed).toBe(false);
    })
  });
});


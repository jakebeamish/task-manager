import { Task } from "../src/Task.js";

describe("Task", () => {
  describe("constructor", () => {
    it("should throw an error if description is not a string", () => {
      expect(() => {
        new Task({
          description: 1,
        });
      }).toThrow("Description must be a non-empty string.");
    });

    it("should throw an error if description is an empty string", () => {
      expect(() => {
        new Task({
          description: "",
        });
      }).toThrow("Description must be a non-empty string.");
    });

    it("should throw an error if completion status is not a boolean", () => {
      expect(() => {
        new Task({
          description: "Valid task body",
          completed: "yes",
        });
      }).toThrow("Completed must be a boolean.");
    });

    it("should successfully create a task if TaskData is valid", () => {
      const task = new Task({
        description: "Buy oat milk",
        completed: false
      });

      expect(task instanceof Task).toBeTruthy();
    })
  });
});

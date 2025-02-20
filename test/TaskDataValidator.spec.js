import { TaskDataValidator } from "../src/TaskDataValidator"

describe("TaskDataValidator", () => {
    it("should throw an error if description is not a string", () => {
      expect(() => {
        TaskDataValidator.validate({
          description: 1,
        });
      }).toThrow("Description must be a non-empty string.");
    });

    it("should throw an error if description is an empty string", () => {
      expect(() => {
        TaskDataValidator.validate({
          description: "",
        });
      }).toThrow("Description must be a non-empty string.");
    });

    it("should throw an error if completion status is not a boolean", () => {
      expect(() => {
        TaskDataValidator.validate({
          description: "Valid task body",
          completed: "yes",
        });
      }).toThrow("Completed must be a boolean.");
    });
});

import { TaskDataValidator } from "../src/TaskDataValidator";

describe("TaskDataValidator", () => {
  describe("validateDescription", () => {
    it("should throw an error if description is not a string", () => {
      expect(() => {
        TaskDataValidator.validateDescription({
          description: 1,
        });
      }).toThrow("Description must be a non-empty string.");
    });

    it("should throw an error if description is an empty string", () => {
      expect(() => {
        TaskDataValidator.validateDescription({
          description: "",
        });
      }).toThrow("Description must be a non-empty string.");
    });
  });

  describe("validateCompleted", () => {
    it("should throw an error if completion status is not a boolean", () => {
      expect(() => {
        TaskDataValidator.validateCompleted({
          description: "Valid task body",
          completed: "yes",
        });
      }).toThrow("Completed must be a boolean.");
    });
  });

  describe("validatePriority", () => {
    it("should throw an error if priority is 'a'", () => {
      expect(() => {
        TaskDataValidator.validatePriority({
          description: "Valid task body",
          completed: false,
          priority: "a",
        });
      }).toThrow("Priority must be an uppercase letter.");
    });

    it("should throw an error if priority is '1'", () => {
      expect(() => {
        TaskDataValidator.validatePriority({
          description: "Valid task body",
          completed: false,
          priority: "1",
        });
      }).toThrow("Priority must be an uppercase letter.");
    });
  });
});

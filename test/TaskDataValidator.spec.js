import { TaskDataValidator } from "../src/TaskDataValidator";

describe("TaskDataValidator", () => {
  describe("validateDescription", () => {
    it("should throw an error if description is not a string", () => {
      expect(() => {
        TaskDataValidator.validateDescription(1);
      }).toThrow("Description must be a non-empty string.");
    });

    it("should throw an error if description is an empty string", () => {
      expect(() => {
        TaskDataValidator.validateDescription("");
      }).toThrow("Description must be a non-empty string.");
    });
  });

  describe("validateCompleted", () => {
    it("should throw an error if completion status is not a boolean", () => {
      expect(() => {
        TaskDataValidator.validateCompleted("yes");
      }).toThrow("Completed must be a boolean.");
    });
  });

  describe("validatePriority", () => {
    it("should throw an error if priority is 'a'", () => {
      expect(() => {
        TaskDataValidator.validatePriority("a");
      }).toThrow("Priority must be an uppercase letter.");
    });

    it("should throw an error if priority is '1'", () => {
      expect(() => {
        TaskDataValidator.validatePriority("1");
      }).toThrow("Priority must be an uppercase letter.");
    });

    it("should throw an error if priority is 1", () => {
      expect(() => {
        TaskDataValidator.validatePriority(1);
      }).toThrow("Priority must be an uppercase letter.");
    });
  });

  describe("validateDate", () => {
    it("should throw an error if date string is '2025-01'", () => {
      expect(() => {
        TaskDataValidator.validateDate('2025-01');
      }).toThrow("Date must be in the format YYYY-MM-DD.");
    });

    it("should throw an error if date string is '2025/01/05'", () => {
      expect(() => {
        TaskDataValidator.validateDate('2025/01/05');
      }).toThrow("Date must be in the format YYYY-MM-DD.");
    });

    it("should throw an error if date string is '2025-01'", () => {
      expect(() => {
        TaskDataValidator.validateDate('2025-01');
      }).toThrow("Date must be in the format YYYY-MM-DD.");
    });

  });
});

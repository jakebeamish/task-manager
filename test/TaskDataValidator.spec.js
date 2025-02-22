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
    it("should throw an error if input is '2025-01'", () => {
      expect(() => {
        TaskDataValidator.validateDate("2025-01");
      }).toThrow("Date must be in the format YYYY-MM-DD.");
    });

    it("should throw an error if input is '2025/01/05'", () => {
      expect(() => {
        TaskDataValidator.validateDate("2025/01/05");
      }).toThrow("Date must be in the format YYYY-MM-DD.");
    });

    it("should throw an error if input is 'Thursday'", () => {
      expect(() => {
        TaskDataValidator.validateDate("Thursday");
      }).toThrow("Date must be in the format YYYY-MM-DD.");
    });

    it("should throw an error if input is 20250101", () => {
      expect(() => {
        TaskDataValidator.validateDate(20250101);
      }).toThrow("Date must be in the format YYYY-MM-DD.");
    });
  });

  describe("validateCompletedDate", () => {
    it("should throw an error if completed is false", () => {
      expect(() => {
        TaskDataValidator.validateCompletedDate({
          completed: false,
          createdDate: "2025-01-01",
          completedDate: "2025-01-02",
        });
      }).toThrow("Completed must be true for a Task to have a completed date.");
    });

    it("should throw an error if completed is not true", () => {
      expect(() => {
        TaskDataValidator.validateCompletedDate({
          createdDate: "2025-01-01",
          completedDate: "2025-01-02",
        });
      }).toThrow("Completed must be true for a Task to have a completed date.");
    });

    it("should throw an error if completed date is before created date", () => {
      expect(() => {
        TaskDataValidator.validateCompletedDate({
          completed: true,
          createdDate: "2025-01-01",
          completedDate: "2024-12-31",
        });
      }).toThrow("Completed date cannot be before created date.");
    });
  });
});

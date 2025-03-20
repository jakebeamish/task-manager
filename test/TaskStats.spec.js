import { TaskStats } from "../src/TaskStats.js";

describe("TaskStats", () => {
  const tasks = [
    {
      description: "Task one",
      projects: ["+foo", "+bar"],
      contexts: ["@home"],
      priority: "A",
    },
    {
      description: "Task two",
      projects: ["+baz"],
      contexts: ["@work"],
      priority: "C",
    },
  ];

  const tasksWithoutProps = [
    { description: "This task is project-less" },
    { description: "There is no context" },
    { description: "Nor is there priority" },
  ];

  describe("getProjects", () => {
    it("returns an array of distinct projects given an array of tasks", () => {
      const result = TaskStats.getProjects(tasks);
      expect(result).toEqual(["+foo", "+bar", "+baz"]);
    });

    it("returns an empty array if given an array of tasks without projects", () => {
      const result = TaskStats.getProjects(tasksWithoutProps);
      expect(result).toEqual([]);
    });
  });

  describe("getContexts", () => {
    it("returns an array of distinct contexts given an array of tasks", () => {
      const result = TaskStats.getContexts(tasks);
      expect(result).toEqual(["@home", "@work"]);
    });

    it("returns an empty array if given an array of tasks without contexts", () => {
      const result = TaskStats.getContexts(tasksWithoutProps);
      expect(result).toEqual([]);
    });
  });

  describe("getPriorities", () => {
    it("returns an array of distinct priorities given an array of tasks", () => {
      const result = TaskStats.getPriorities(tasks);
      expect(result).toEqual(["A", "C"]);
    });

    it("returns an empty array if given an array of tasks without priorities", () => {
      const result = TaskStats.getPriorities(tasksWithoutProps);
      expect(result).toEqual([]);
    });
  });

  describe("getNumberOfTasksCreatedToday", () => {
    it("returns the number of tasks where createdDate is today", () => {
    const today = new Date().toISOString().split("T")[0];
      const tasks = [
        {
          description: "This is a task from today",
          createdDate: today
        },
        {
          description: "This task is not created today",
          createdDate: "2000-01-01"
        },
        {
          description: "This task has no creation date"
        }
      ];

      expect(TaskStats.getNumberOfTasksCreatedToday(tasks)).toEqual(1);
    });

  });

  describe("getNumberOfTasksCompletedToday", () => {
    it("returns the number of tasks where completedDate is today", () => {
      const today = new Date().toISOString().split("T")[0];
      const tasks = [ 
        {
          completed: true,
          completedDate: today
        },
        {
          completed: true,
          completedDate: "2000-01-01"
        },
        {
          completed: true,
          completedDate: "2025-01-01"
        }
      ];

      expect(TaskStats.getNumberOfTasksCompletedToday(tasks)).toEqual(1);
    });
  });

  describe("getAverageCompletedPerDay", () => {
    const tasksOneCompletedPerDay = [
      {
        description: "One",
        completed: true,
        createdDate: "2000-01-01",
        completedDate: "2000-01-01",
      },
      {
        description: "Two",
        completed: true,
        createdDate: "2000-01-02",
        completedDate: "2000-01-02",
      },
      {
        description: "Three",
        completed: true,
        createdDate: "2000-01-03",
        completedDate: "2000-01-03",
      },
    ];
    it("returns the average number of completed tasks per day", () => {
      const result = TaskStats.getAverageCompletedPerDay(
        tasksOneCompletedPerDay
      );
      expect(result).toEqual(1);
    });

    it("returns zero if no tasks are completed", () => {
      const result = TaskStats.getAverageCompletedPerDay(tasksWithoutProps);
      expect(result).toEqual(0);
    });
  });

  describe("getTotalNumberOfTasks", () => {
    it("returns the total number of tasks in an array", () => {
      const result = TaskStats.getTotalNumberOfTasks(tasks);
      expect(result).toEqual(2);
    });
  });

  describe("getNumberOfCompletedTasks", () => {
    it("returns zero if given an array of tasks where none are completed", () => {
      const result = TaskStats.getNumberOfCompletedTasks(tasks);
      expect(result).toEqual(0);
    });
  });

  describe("getNumberOfIncompletedTasks", () => {
    it("returns the total number of tasks in an array where completed is false", () => {
      const result = TaskStats.getNumberOfIncompletedTasks(tasks);
      expect(result).toEqual(2);
    });
  });
});

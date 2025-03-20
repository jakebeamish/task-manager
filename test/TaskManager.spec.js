import { TaskManager } from "../src/TaskManager.js";

describe("TaskManager", () => {
  describe("constructor", () => {
    it("returns a TaskManager instance if creation is successful", () => {
      const taskManager = new TaskManager();
      expect(taskManager instanceof TaskManager).toBeTruthy();
    });
  });
});

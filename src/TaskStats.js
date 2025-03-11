export class TaskStats {
  constructor(taskManager) {
    this.taskManager = taskManager;
  }

  async getProjects() {
    const tasks = await this.taskManager.getTasks();
    const projects = [...new Set(tasks.flatMap(task => task.projects))];
    return projects;
  }

  async getContexts() {
    const tasks = await this.taskManager.getTasks();
    const contexts = [...new Set(tasks.flatMap(task => task.contexts))];
    return contexts;
  }

  async getStats() {
    const tasks = await this.taskManager.getTasks();
    return {
      total: tasks.length,
      completed: tasks.filter(task => task.completed).length,
      pending: tasks.filter(task => !task.completed).length,
      createdToday: tasks.filter(task => {
        return task.createdDate === (new Date().toISOString().split("T")[0]);
      }).length,
      completedToday: tasks.filter(task => {
        return task.completed && task.completedDate === (new Date().toISOString().split("T")[0])
      }).length
    }
  }
}

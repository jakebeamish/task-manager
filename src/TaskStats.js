export class TaskStats {
  constructor(taskManager) {
    this.taskManager = taskManager;
  }

  async getStats() {
    const tasks = await this.taskManager.getTasks();
    console.table(tasks)
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

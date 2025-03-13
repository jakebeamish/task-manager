import "./types.js";

export class TaskStats {
  constructor(taskManager) {
    this.taskManager = taskManager;
  }

  getProjects(tasks) {
    const projects = [...new Set(tasks.flatMap((task) => task.projects))];
    return projects || [];
  }

  getContexts(tasks) {
    const contexts = [...new Set(tasks.flatMap((task) => task.contexts))];
    return contexts || [];
  }

  getPriorities(tasks) {
    const priorities = [...new Set(tasks.map((task) => task.priority))];
    return priorities || [];
  }

  getAverageCompletedPerDay(tasks) {
    const completedTasks = tasks.filter((task) => task.completed);
    if (completedTasks.length === 0) return 0;

    const completedDates = completedTasks.map((task) => task.completedDate);
    const sortedDates = completedDates.sort();
    const earliestDate = sortedDates[0];
    const latestDate = sortedDates[sortedDates.length - 1];
    const totalDays =
      Math.ceil(
        (new Date(latestDate) - new Date(earliestDate)) / (1000 * 3600 * 24)
      ) + 1;
    const averageCompletedPerDay = completedTasks.length / totalDays;
    return averageCompletedPerDay;
  }

  getStats(tasks) {
    const stats = {
      total: tasks.length,
      completed: tasks.filter((task) => task.completed).length,
      pending: tasks.filter((task) => !task.completed).length,
      createdToday: tasks.filter((task) => {
        return task.createdDate === new Date().toISOString().split("T")[0];
      }).length,
      completedToday: tasks.filter((task) => {
        return (
          task.completed &&
          task.completedDate === new Date().toISOString().split("T")[0]
        );
      }).length,
      averageCompletedPerDay: this.getAverageCompletedPerDay(tasks),
      projects: (this.getProjects(tasks)),
      contexts: this.getContexts(tasks),
      priorities: this.getPriorities(tasks)
    };

    return stats;
  }
}

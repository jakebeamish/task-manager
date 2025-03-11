import { Task } from "./Task.js";
import { LocalStorageStrategy } from "./LocalStorageStrategy.js";
import { TaskManager } from "./TaskManager.js";
import { TaskStats } from "./TaskStats.js";
import { TodoTxtParser } from "./TodoTxtParser.js";
import "./types.js";

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const statsContainer = document.getElementById("statsContainer");

const storageStrategy = new LocalStorageStrategy();
const taskManager = new TaskManager(storageStrategy);
const taskStats = new TaskStats(taskManager);

const renderTasks = async () => {
  /** @type {Task[]} */
  const tasks = await taskManager.getTasks();
  const stats = await taskStats.getStats();
  renderStats(stats);

  taskList.innerHTML = "";

  tasks.toReversed().forEach((task) => {
    const li = document.createElement("li");
    li.classList.add("task-item");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    li.appendChild(checkbox);

    checkbox.addEventListener("change", async () => {
      task.completed = checkbox.checked;
      task.completedDate = task.completed
        ? new Date().toISOString().split("T")[0]
        : null;
      taskManager.updateTask(task);
      renderTasks();
    });

    const taskContentSpan = document.createElement("span");
    taskContentSpan.classList.add("task-content-span");
    const priority = task.priority ? `${task.priority} ` : "";
    const createdDate = task.createdDate ? `${task.createdDate} ` : "";
    const completedDate = task.completedDate ? `${task.completedDate} ` : "";

    const prioritySpan = document.createElement("span");
    prioritySpan.classList.add("priority");
    prioritySpan.textContent = priority;

    const createdDateSpan = document.createElement("span");
    createdDateSpan.classList.add("date", "created-date");
    createdDateSpan.textContent = createdDate;

    const completedDateSpan = document.createElement("span");
    completedDateSpan.classList.add("date", "completed-date");
    completedDateSpan.textContent = completedDate;

    const descriptionSpan = document.createElement("span");
    descriptionSpan.textContent = `${task.description}`;

    taskContentSpan.append(
      prioritySpan,
      createdDateSpan,
      completedDateSpan,
      descriptionSpan
    );

    li.appendChild(taskContentSpan);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", async () => {
      await taskManager.deleteTask(task);
      renderTasks();
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
};

taskInput.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const description = taskInput.value.trim();
    if (description) {
      const task = TodoTxtParser.parseLine(description);
      await taskManager.addTask(task);
      taskInput.value = "";
      renderTasks();
    }
  }
});

addTaskBtn.addEventListener("click", async () => {
  const description = taskInput.value.trim();
  if (description) {
    const task = TodoTxtParser.parseLine(description);
    await taskManager.addTask(task);
    taskInput.value = "";
    renderTasks();
  }
});

const renderStats = (stats) => {
  statsContainer.innerHTML = "";

  const totalPending = document.createElement("p");
  totalPending.innerText = `Total pending: ${stats.pending}`;

  const totalCompleted = document.createElement("p");
  totalCompleted.innerText = `Total completed: ${stats.completed}`;

  const totalCompletePercent = document.createElement("p");
  totalCompletePercent.innerText = `Total: ${Math.round((stats.completed / stats.total) * 100)}%`;

  const createdToday = document.createElement("p");
  createdToday.innerText = `Created today: ${stats.createdToday}`;

  const completedToday = document.createElement("p");
  completedToday.innerText = `Completed today: ${stats.completedToday}`;

  const completedDailyAverage = document.createElement("p");
  completedDailyAverage.innerText = `Average completed per day:`;

  const completedWeeklyAverage = document.createElement("p");
  completedWeeklyAverage.innerText = `Average completed per week:`;

  statsContainer.append(
    totalPending,
    totalCompleted,
    totalCompletePercent,
    createdToday,
    completedToday,
    completedDailyAverage
  );
};

renderTasks();

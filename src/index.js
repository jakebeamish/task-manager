import { Task } from "./Task.js";
import { LocalStorageStrategy } from "./LocalStorageStrategy.js";
import { TaskManager } from "./TaskManager.js";
import { TaskStats } from "./TaskStats.js";
import "./types.js";

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const statsContainer = document.getElementById("statsContainer");

const storageStrategy = new LocalStorageStrategy();
const taskManager = new TaskManager(storageStrategy);
const taskStats = new TaskStats(taskManager);

const renderTasks = async () => {
  const tasks = await taskManager.getTasks();
  const stats = await taskStats.getStats();
  renderStats(stats);

  taskList.innerHTML = "";

  tasks.forEach((task) => {
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

    const span = document.createElement("span");

    span.textContent = `${task.createdDate} ${task.completedDate ? task.completedDate : ""} ${task.description}`;
    li.appendChild(span);

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
      await taskManager.addTask({ description, completed: false });
      taskInput.value = "";
      renderTasks();
    }
  }
});

addTaskBtn.addEventListener("click", async () => {
  const description = taskInput.value.trim();
  if (description) {
    await taskManager.addTask({ description, completed: false });
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

  const createdToday = document.createElement("p");
  createdToday.innerText = `Created today: ${stats.createdToday}`;

  const completedToday = document.createElement("p");
  completedToday.innerText = `Completed today: ${stats.completedToday}`;

  statsContainer.append(
    totalPending,
    totalCompleted,
    createdToday,
    completedToday
  );
};

renderTasks();

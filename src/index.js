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
const optionsContainer = document.getElementById("optionsContainer");

const storageStrategy = new LocalStorageStrategy();
const taskManager = new TaskManager(storageStrategy);
const taskStats = new TaskStats(taskManager);

let toastContainer;

const elements = {
  filtersContainer: document.getElementById("filtersContainer"),
};

const filters = {
  projects: new Set(),
  contexts: new Set(),
  priorities: new Set(),
};

const createFilterList = (items, filterSet) => {
  const list = document.createElement("ul");
  list.classList.add("filter-list");

  items.forEach((item) => {
    if (!item) return;

    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = item;
    checkbox.checked = filterSet.has(item);

    checkbox.addEventListener("click", () => {
      if (checkbox.checked) filterSet.add(item);
      else filterSet.delete(item);
      renderTasks();
      li.classList.toggle("selected-filter", checkbox.checked);
    });

    const label = document.createElement("label");
    label.htmlFor = item;
    label.textContent = item;

    li.append(checkbox, label);
    list.append(li);
  });
  return list;
};

const renderOptions = () => {
  optionsContainer.innerHTML = "";

  const createOption = (id, textContent) => {
    const optionContainer = document.createElement("div");
    optionContainer.classList.add("option-container");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = id;
    checkbox.id = id;
    checkbox.addEventListener("click", () => {
      renderTasks();
    });

    const label = document.createElement("label");
    label.htmlFor = id;
    label.innerText = textContent;

    optionContainer.append(checkbox, label);
    return optionContainer;
  };

  optionsContainer.append(
    createOption("hideCompletedTasks", "Hide completed tasks")
  );
  optionsContainer.append(
    createOption("hideDatesInTasks", "Hide dates in tasks")
  );

  const closeButton = document.createElement("button");
  closeButton.innerText = "X";
  closeButton.classList.add("close-btn");
  optionsContainer.append(closeButton);
  closeButton.addEventListener("click", () => {
    toggleOptions();
  });
};

renderOptions();

const renderFilters = (stats) => {
  elements.filtersContainer.innerHTML = "";
  elements.filtersContainer.append(
    createFilterList(stats.projects, filters.projects, "project"),
    createFilterList(stats.contexts, filters.contexts, "context"),
    createFilterList(stats.priorities, filters.priorities, "priority")
  );
};

const initialiseFilters = async () => {
  const tasks = await taskManager.getTasks();
  const stats = taskStats.getStats(tasks);
  renderFilters(stats);
};

const toaster = (message) => {
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.classList.add("toast-container");

    const appContainer = document.querySelector(".app-container")
    appContainer.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.innerText = message;
  toastContainer.prepend(toast);

  setTimeout(() => toast.classList.add("open"), 10);
  setTimeout(() => toast.classList.remove("open"), 3000);
  setTimeout(() => toastContainer.removeChild(toast), 3500);
}


const renderTasks = async () => {
  /** @type {Task[]} */
  const tasks = await taskManager.getTasks();
  const stats = taskStats.getStats(tasks);
  renderStats(stats);

  /** @type {boolean} */
  const hideCompletedTasks =
    document.getElementById("hideCompletedTasks").checked;
  /** @type {boolean} */
  const hideDatesInTasks = document.getElementById("hideDatesInTasks").checked;
  taskList.innerHTML = "";

  tasks.toReversed().forEach((task) => {
    if (hideCompletedTasks && task.completed) return;

    // If a task does not have any project in filters.projects, skip it
    if (
      filters.projects.size > 0 &&
      (!task.projects ||
        !task.projects.some((project) => filters.projects.has(project)))
    ) {
      return;
    }

    if (
      filters.contexts.size > 0 &&
      (!task.contexts ||
        !task.contexts.some((context) => filters.contexts.has(context)))
    ) {
      return;
    }

    if (
      filters.priorities.size > 0 &&
      (!task.priority || !filters.priorities.has(task.priority))
    ) {
      return;
    }

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
      if (checkbox.checked) {
        toaster("Task completed")
      }
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

    taskContentSpan.append(prioritySpan);
    if (!hideDatesInTasks)
      taskContentSpan.append(createdDateSpan, completedDateSpan);

    taskContentSpan.append(descriptionSpan);
    li.appendChild(taskContentSpan);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", async () => {
      await taskManager.deleteTask(task);
      toaster("Task deleted")
      renderTasks();
      initialiseFilters();
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
      toaster("Task created");
      renderTasks();
      initialiseFilters();
    }
  }
});

addTaskBtn.addEventListener("click", async () => {
  const description = taskInput.value.trim();
  if (description) {
    const task = TodoTxtParser.parseLine(description);
    await taskManager.addTask(task);
    taskInput.value = "";
    toaster("Task created");
    renderTasks();
    initialiseFilters();
  }
});

const renderStats = (stats) => {
  statsContainer.innerHTML = "";

  const totalPending = document.createElement("p");
  totalPending.innerText = `Total pending: ${stats.pending}`;

  const totalCompleted = document.createElement("p");
  totalCompleted.innerText = `Total completed: ${stats.completed}`;

  const totalCompletePercent = document.createElement("p");
  totalCompletePercent.innerText = `Total: ${Math.round((stats.completed / stats.total) * 100) || 0}%`;

  const createdToday = document.createElement("p");
  createdToday.innerText = `Created today: ${stats.createdToday}`;

  const completedToday = document.createElement("p");
  completedToday.innerText = `Completed today: ${stats.completedToday}`;

  const completedDailyAverage = document.createElement("p");
  completedDailyAverage.innerText = `Average completed per day: ${Math.round(stats.averageCompletedPerDay * 100) / 100}`;

  const completedWeeklyAverage = document.createElement("p");
  completedWeeklyAverage.innerText = `Average completed per week:`;

  [
    totalPending,
    totalCompleted,
    totalCompletePercent,
    createdToday,
    completedToday,
    completedDailyAverage,
  ].forEach((item) => {
    const statContainer = document.createElement("div");
    statContainer.classList.add("stat-container");
    statContainer.append(item);
    statsContainer.append(statContainer);
  });
  const closeButton = document.createElement("button");
  closeButton.innerText = "X";
  closeButton.classList.add("close-btn");
  statsContainer.append(closeButton);
  closeButton.addEventListener("click", () => {
    toggleStats();
  });
};

initialiseFilters();
renderTasks();

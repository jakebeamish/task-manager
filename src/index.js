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
const filtersContainer = document.getElementById("filtersContainer");

const storageStrategy = new LocalStorageStrategy();
const taskManager = new TaskManager(storageStrategy);
const taskStats = new TaskStats(taskManager);

const renderOptions = () => {
  optionsContainer.innerHTML = "";

  let optionContainer = document.createElement("div");
  optionContainer.classList.add("option-container");

  const hideCompletedTasksCheckbox = document.createElement("input");
  hideCompletedTasksCheckbox.type = "checkbox";
  hideCompletedTasksCheckbox.name = "hideCompletedTasks";
  hideCompletedTasksCheckbox.id = "hideCompletedTasks";
  hideCompletedTasksCheckbox.addEventListener("click", () => {
    renderTasks();
  });
  const hideCompletedTasksLabel = document.createElement("label");
  hideCompletedTasksLabel.innerText = "Hide completed tasks";
  hideCompletedTasksLabel.htmlFor = hideCompletedTasksCheckbox.id;
  optionContainer.append(hideCompletedTasksCheckbox, hideCompletedTasksLabel);
  optionsContainer.append(optionContainer);

  optionContainer = document.createElement("div");
  optionContainer.classList.add("option-container");
  const hideDatesInTasksCheckbox = document.createElement("input");
  hideDatesInTasksCheckbox.type = "checkbox";
  hideDatesInTasksCheckbox.name = "hideDatesInTasks";
  hideDatesInTasksCheckbox.id = "hideDatesInTasks";
  hideDatesInTasksCheckbox.addEventListener("click", () => {
    renderTasks();
  });
  const hideDatesInTasksLabel = document.createElement("label");
  hideDatesInTasksLabel.innerText = "Hide dates in tasks";
  hideDatesInTasksLabel.htmlFor = hideDatesInTasksCheckbox.id;
  optionContainer.append(hideDatesInTasksCheckbox, hideDatesInTasksLabel);
  optionsContainer.append(optionContainer);
};

renderOptions();

const projectsFilter = new Set();
const contextsFilter = new Set();
const prioritiesFilter = new Set();

const renderFilters = async () => {
  filtersContainer.innerHTML = "";

  const projects = await taskStats.getProjects();
  const projectsList = document.createElement("ul");
  projectsList.classList.add("filter-list");
  projects.forEach((project) => {
    if (!project) return;
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = project;
    if (projectsFilter.has(project)) {
      checkbox.checked = true;
    }

    checkbox.addEventListener("click", () => {
      if (checkbox.checked) {
        projectsFilter.add(project);
        li.classList.add("selected-project");
      } else {
        projectsFilter.delete(project);
        li.classList.remove("selected-project");
      }
      renderTasks();
    });
    const label = document.createElement("label");
    label.htmlFor = project;
    label.textContent = project;
    label.classList.add("project-label");
    li.append(checkbox, label);
    projectsList.append(li);
  });

  const contexts = await taskStats.getContexts();
  const contextsList = document.createElement("ul");
  contextsList.classList.add("filter-list");
  contexts.forEach((context) => {
    if (!context) return;
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = context;
    if (contextsFilter.has(context)) checkbox.checked = true;
    checkbox.addEventListener("click", () => {
      if (checkbox.checked) {
        contextsFilter.add(context);
        li.classList.add("selected-context");
      } else {
        contextsFilter.delete(context);
        li.classList.remove("selected-context");
      }
      renderTasks();
    });
    const label = document.createElement("label");
    label.htmlFor = context;
    label.textContent = context;
    li.append(checkbox, label);
    contextsList.append(li);
  });

  const priorities = await taskStats.getPriorities();
  const prioritiesList = document.createElement("ul");
  prioritiesList.classList.add("filter-list");
  priorities.forEach((priority) => {
    if (!priority) return;
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = priority;
    if (prioritiesFilter.has(priority)) checkbox.checked = true;
    checkbox.addEventListener("click", () => {
      if (checkbox.checked) {
        prioritiesFilter.add(priority);
        li.classList.add("selected-priority");
      } else {
        prioritiesFilter.delete(priority);
        li.classList.remove("selected-priority")
      }
      renderTasks();
    });
    const label = document.createElement("label");
    label.htmlFor = priority;
    label.textContent = priority;
    li.append(checkbox, label);
    prioritiesList.append(li);
  });

  filtersContainer.append(projectsList, contextsList, prioritiesList);
};

renderFilters();

const renderTasks = async () => {
  /** @type {Task[]} */
  const tasks = await taskManager.getTasks();
  const stats = await taskStats.getStats();
  renderStats(stats);

  /** @type {boolean} */
  const hideCompletedTasks =
    document.getElementById("hideCompletedTasks").checked;
  /** @type {boolean} */
  const hideDatesInTasks = document.getElementById("hideDatesInTasks").checked;
  taskList.innerHTML = "";

  tasks.toReversed().forEach((task) => {
    if (hideCompletedTasks && task.completed) return;

    let valid = true;
    if (projectsFilter.size > 0) {
      if (task.projects === null) return;
      valid = false;
      for (let project of task.projects) {
        if (projectsFilter.has(project)) {
          valid = true;
        }
      }
    }

    if (contextsFilter.size > 0) {
      if (task.contexts === null) return;
      valid = false;
      for (let context of task.contexts) {
        if (contextsFilter.has(context)) {
          valid = true;
        }
      }
    }

    if (prioritiesFilter.size > 0) {
      if (task.priority === null) return;
      valid = false;
      if (prioritiesFilter.has(task.priority)) {
        valid = true;
      }
    }

    if (!valid) return;
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

    taskContentSpan.append(prioritySpan);
    if (!hideDatesInTasks)
      taskContentSpan.append(createdDateSpan, completedDateSpan);

    taskContentSpan.append(descriptionSpan);
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
      renderFilters();
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

const renderStats = async (stats) => {
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
  const avg = await taskStats.getAverageCompletedPerDay();
  completedDailyAverage.innerText = `Average completed per day: ${Math.round(avg * 100)/100}`;

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

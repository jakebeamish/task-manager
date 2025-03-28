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

const createSortingDropdown = () => {
  const sortingContainer = document.createElement("div");
  sortingContainer.classList.add("sorting-container");

  const label = document.createElement("label");
  label.textContent = "Sort by:";
  label.htmlFor = "sortTasks";

  const select = document.createElement("select");
  select.id = "sortTasks";

  const options = [
    { value: "createdDateOldest", text: "Created Date (Oldest first)" },
    { value: "createdDateNewest", text: "Created Date (Newest first)" },
    // { value: "completedDate", text: "Completed Date" },
    { value: "priority", text: "Priority" },
    // { value: "description", text: "Description (A-Z)" }
  ];

  options.forEach(({ value, text }) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = text;
    select.appendChild(option);
  });

  select.addEventListener("change", () => renderTasks());

  sortingContainer.append(label, select);
  optionsContainer.append(sortingContainer);
};

const createGroupByDropdown = () => {
  const groupByContainer = document.createElement("div");
  groupByContainer.classList.add("groupby-container");

  const label = document.createElement("label");
  label.textContent = "Group by:";
  label.htmlFor = "groupTasks";
  const select = document.createElement("select");
  select.id = "groupTasks";

  const options = [
    { value: "none", text: "none" },
    { value: "priority", text: "Priority" },
    { value: "project", text: "Project" },
    { value: "context", text: "Context" },
  ];

  options.forEach(({ value, text }) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = text;
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    renderTasks();
  });

  groupByContainer.append(label, select);
  optionsContainer.append(groupByContainer);
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

  createSortingDropdown();
  createGroupByDropdown();

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
  const stats = TaskStats.getStats(tasks);
  renderFilters(stats);
};

const toaster = (message, extraClasses = []) => {
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.classList.add("toast-container");

    const appContainer = document.querySelector(".app-container");
    appContainer.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.classList.add("toast");
  for (let extraClass of extraClasses) {
    toast.classList.add(extraClass);
  }
  toast.innerText = message;
  toastContainer.prepend(toast);

  setTimeout(() => toast.classList.add("open"), 10);
  setTimeout(() => toast.classList.remove("open"), 3000);
  setTimeout(() => toastContainer.removeChild(toast), 3500);
};

const getGroupKey = (task, groupBy) => {
  switch (groupBy) {
    case "priority":
      return task.priority || "No priority";
      break;
    case "project":
      return task.projects?.length ? task.projects.join(", ") : "No Project";
      break;
    case "context":
      return task.contexts?.length ? task.contexts.join(", ") : "No Context";
    default:
      return "Ungrouped";
  }
};

const renderTaskGroup = (groupName, tasks, hideDatesInTasks) => {
  if (tasks.length === 0) return;

  const groupContainer = document.createElement("div");
  groupContainer.classList.add("task-group");

  const groupHeader = document.createElement("h3");
  groupHeader.textContent = `${groupName} (${tasks.length})`;
  groupHeader.classList.add("group-header");
  groupContainer.appendChild(groupHeader);

  groupHeader.addEventListener("click", () => {
    groupContainer.classList.toggle("collapsed");
  });

  const groupList = document.createElement("ul");
  groupList.classList.add("group-task-list");

  tasks.toReversed().forEach((task) => {
    const li = document.createElement("li");
    li.classList.add("task-item");
    li.classList.toggle("completed", task.completed);
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
        toaster("Task completed", ["success"]);
      }
      taskManager.updateTask(task);
      renderTasks();
    });

    const taskContentSpan = document.createElement("span");
    taskContentSpan.classList.add("task-content-span");

    const createdDate = task.createdDate ? `${task.createdDate} ` : "";
    const completedDate = task.completedDate ? `${task.completedDate} ` : "";

    const prioritySpan = document.createElement("span");
    prioritySpan.classList.add("priority");
    prioritySpan.textContent = task.priority ? `${task.priority} ` : "";

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
    deleteBtn.dataset.taskId = task.id;

    deleteBtn.addEventListener("click", async (e) => {
      e.stopPropagation(); // Prevent event bubbling

      await taskManager.deleteTask(task);
      toaster("Task deleted");
      renderTasks();
      initialiseFilters();
    });

    li.appendChild(deleteBtn);
    groupList.appendChild(li);
  });

  groupContainer.appendChild(groupList);
  taskList.appendChild(groupContainer);

  setTimeout(() => {
    groupContainer.style.opacity = 1;
  }, 900);
};

const renderTasks = async () => {
  /** @type {Task[]} */
  let tasks = await taskManager.getTasks();
  const stats = TaskStats.getStats(tasks);
  renderStats(stats);

  /** @type {boolean} */
  const hideCompletedTasks =
    document.getElementById("hideCompletedTasks").checked;
  /** @type {boolean} */
  const hideDatesInTasks = document.getElementById("hideDatesInTasks").checked;
  taskList.innerHTML = "";

  const sortBy = document.getElementById("sortTasks")?.value || "createdDate";
  const groupBy = document.getElementById("groupTasks")?.value || "none";

  let filteredTasks = tasks.filter((task) => {
    if (hideCompletedTasks && task.completed) return false;

    // If a task does not have any project in filters.projects, skip it
    if (
      filters.projects.size > 0 &&
      (!task.projects ||
        !task.projects.some((project) => filters.projects.has(project)))
    ) {
      return false;
    }

    if (
      filters.contexts.size > 0 &&
      (!task.contexts ||
        !task.contexts.some((context) => filters.contexts.has(context)))
    ) {
      return false;
    }

    if (
      filters.priorities.size > 0 &&
      (!task.priority || !filters.priorities.has(task.priority))
    ) {
      return false;
    }

    return true;
  });

  filteredTasks = filteredTasks.sort((a, b) => {

    const dateA = new Date(a.createdDate);
    const dateB = new Date(b.createdDate);

    switch (sortBy) {
      case "createdDateOldest":
        return dateB - dateA;
      case "createdDateNewest":
        return dateA - dateB;
      case "priority":
        return (b.priority ?? "Z").localeCompare(a.priority ?? "Z");
      default:
        return 0;
    }
  });

  const groupedTasks = {};
  if (groupBy !== "none") {
    filteredTasks.forEach((task) => {
      let groupKey = getGroupKey(task, groupBy);

      if (!groupedTasks[groupKey]) {
        groupedTasks[groupKey] = [];
      }

      groupedTasks[groupKey].push(task);
    });

    const sortedGroupKeys = Object.keys(groupedTasks).sort((a, b) => {
      if (a.startsWith("No ") && !b.startsWith("No ")) return 1;
      if (!a.startsWith("No ") && b.startsWith("No ")) return -1;

      return a.localeCompare(b);
    });

    for (const groupKey of sortedGroupKeys) {
      renderTaskGroup(groupKey, groupedTasks[groupKey], hideDatesInTasks);
    }
  } else {
    renderTaskGroup("All Tasks", filteredTasks, hideDatesInTasks);
  }
};

taskInput.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const description = taskInput.value.trim();
    if (description) {
      const task = TodoTxtParser.parseLine(description);
      await taskManager.addTask(task);
      taskInput.value = "";
      toaster("Task added");
      renderTasks();
      initialiseFilters();
    }
  }
});
// Prevent default drag behaviors
["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  taskInput.addEventListener(eventName, preventDefaults, false);
  document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}
taskInput.addEventListener("drop", handleDrop, false);

async function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;

  if (files.length > 0) {
    const file = files[0];
    if (file.name.endsWith(".txt") || file.type === "text/plain") {
      try {
        const content = await readFile(file);
        await importTasksFromTodoTxt(content);
        toaster(`Imported ${file.name} successfully`, ["success"]);
      } catch (error) {
        toaster("Error importing file", ["error"]);
      }
    } else {
      toaster("Please drop a .txt file", ["error"]);
    }
  }
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}

async function importTasksFromTodoTxt(content) {
  const lines = content.split("\n").filter((line) => line.trim() !== "");

  for (const line of lines) {
    const task = TodoTxtParser.parseLine(line);
    await taskManager.addTask(task);
  }

  renderTasks();
  initialiseFilters();
}

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

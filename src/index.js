import { Task } from "./Task.js";
import { LocalStorageStrategy } from "./LocalStorageStrategy.js";
import { TaskManager } from "./TaskManager.js";
import "./types.js";

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const storageStrategy = new LocalStorageStrategy();

const taskManager = new TaskManager(storageStrategy);

const renderTasks = async () => {
  const tasks = await taskManager.getTasks();
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
      taskManager.updateTask(task);
      // renderTasks();
    });

    const span = document.createElement("span");

    span.textContent = `${task.createdDate} ${task.description}`;
    li.appendChild(span)

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

addTaskBtn.addEventListener("click", async () => {
  const description = taskInput.value.trim();
  if (description) {
    await taskManager.addTask({ description, completed: false });
    taskInput.value = "";
    renderTasks();
  }
});

renderTasks();

class Task {
	/**
	 * @param {string} text - The task description.
	 * @param {number} [id=Date.now()] - A unique task ID (default: current timestamp).
	 * @param {boolean} [completed=false] - Task completion status (default: false).
	 */
	constructor(text, id = Date.now(), completed = false) {
		this.text = text;
		this.id = id;
		this.completed = completed;
	}

	toggle() {
		this.completed = !this.completed;
	}
}

class TaskManager {
	constructor() {
		/** @type {Task[]} */
		this.tasks = [];

		const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
		this.tasks = storedTasks.map((t) => Object.assign(new Task(), t));
	}

	save() {
		localStorage.setItem("tasks", JSON.stringify(this.tasks));
	}

	/**
	 * Adds a new task based on user input.
	 */
	addTask(text) {
		const task = new Task(text);
		this.tasks.push(task);
		this.save();
	}

	toggleTask(id) {
		const task = this.tasks.find((t) => t.id === id);
		if (task) {
			task.toggle();
			this.save();
		}
	}

	removeTask(id) {
		this.tasks = this.tasks.filter((t) => t.id !== id);
		this.save();
		document.getElementById(`task-${id}`)?.remove();
	}
}

class UIManager {
	constructor(taskManager) {
		this.taskManager = taskManager;
		this.container = document.getElementById("container");

		this.taskInput = document.createElement("input");
		this.taskInput.id = "taskInput";
		this.taskInput.type = "text";
		this.container.appendChild(this.taskInput);

		this.addButton = document.createElement("button");
		this.addButton.id = "addButton";
		this.addButton.textContent = "Add";
		this.container.appendChild(this.addButton);

		this.taskListElement = document.createElement("ul");
		this.taskListElement.id = "taskList";
		this.container.appendChild(this.taskListElement);

		this.hideCompletedCheckbox = document.createElement("input");
		this.hideCompletedCheckbox.type = "checkbox";
		this.hideCompletedCheckbox.id = "hideCompletedTasks";
		this.hideCompletedCheckbox.checked = false;
		this.container.appendChild(this.hideCompletedCheckbox);

		const hideCompletedLabel = document.createElement("label");
		hideCompletedLabel.setAttribute("for", "hideCompletedTasks");
		hideCompletedLabel.textContent = "Hide completed tasks";
		this.container.appendChild(hideCompletedLabel);

		// Event Listeners
		this.addButton.addEventListener("click", () => this.handleAddTask());
		this.hideCompletedCheckbox.addEventListener("change", () =>
			this.renderTasks()
		);

		this.renderTasks();
	}

	handleAddTask() {
		const text = this.taskInput.value.trim();
		if (!text) return;

		this.taskManager.addTask(text);
		this.taskInput.value = "";
		this.renderTasks();
	}

	renderTasks() {
		this.taskListElement.innerHTML = "";
		this.taskManager.tasks.forEach((task) => {
			if (task.completed && this.hideCompletedCheckbox.checked) return;
			this.taskListElement.appendChild(this.createTaskElement(task));
		});
	}

	/**
	 * Creates a list item DOM element for a task.
	 * @param {Task} task
	 * @returns {HTMLElement} The created list item.
	 */
	createTaskElement(task) {
		const li = document.createElement("li");
		li.id = `task-${task.id}`;

		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.checked = task.completed;
		checkbox.addEventListener("click", () => {
			this.taskManager.toggleTask(task.id);
			this.renderTasks();
		});

		const span = document.createElement("span");
		span.textContent = task.text;
		span.style.textDecoration = task.completed ? "line-through" : "none";

		const editButton = document.createElement("button");
		editButton.classList.add("editButton");
		editButton.innerText = "Edit";

		const deleteButton = document.createElement("button");
		deleteButton.classList.add("deleteButton");
		deleteButton.innerText = "Delete";

		deleteButton.addEventListener("click", () => {
			this.taskManager.removeTask(task.id);
			this.renderTasks();
		});

		li.append(checkbox, span, editButton, deleteButton);
		return li;
	}

	/**
	 * Updates the visual state of a task in the UI.
	 * @param {Task} task
	 */
	updateTaskElement(task) {
		const taskElement = document.getElementById(`task-${task.id}`);
		if (taskElement) {
			taskElement.replaceWith(this.createTaskElement(task));
		}
	}
}

const taskManager = new TaskManager();
const uiManager = new UIManager(taskManager);

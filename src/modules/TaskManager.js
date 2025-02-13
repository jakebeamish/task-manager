import { Task } from "./Task.js"

export class TaskManager {

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


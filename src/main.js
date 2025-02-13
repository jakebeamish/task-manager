import { Task } from "./modules/Task.js";
import { TaskManager } from "./modules/TaskManager.js";
import { UIManager } from "./modules/UIManager.js";

const taskManager = new TaskManager();
const uiManager = new UIManager(taskManager);

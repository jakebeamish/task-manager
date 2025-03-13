import  { StorageStrategy } from './StorageStrategy.js'

export class RemoteStorageStrategy extends StorageStrategy {
  async save(task) {
    const response = await fetch("https://task-manager-vkv2.onrender.com/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task)
    });
    return response.json();
  }

  async getAll() {
    const response = await fetch("https://task-manager-vkv2.onrender.com/api/tasks");
    return response.json();
  }

  async update(task) {
    const response = await fetch(`https://task-manager-vkv2.onrender.com/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    return response.json();
  }

  async delete(task) {
    await fetch(`https://task-manager-vkv2.onrender.com/api/tasks/${task.id}`, { method: "DELETE"});
  }
}

// test-crud.js
import { DatabaseStorageStrategy } from './DatabaseStorageStrategy.js';

const storageStrategy = new DatabaseStorageStrategy();

async function testCRUD() {
    // Create a task
    const newTask = {
        description: 'Test task',
        completed: false,
        priority: 'A',
        createdDate: '2023-10-05',
        completedDate: null,
        projects: ['project1'],
        contexts: ['context1'],
    };
    const createdTask = await storageStrategy.save(newTask);
    console.log('Created Task:', createdTask);

    // Read all tasks
    const tasks = await storageStrategy.getAll();
    console.log('All Tasks:', tasks);

   // Update the task
    createdTask.completed = true;
    const updatedTask = await storageStrategy.update(createdTask);
    console.log('Updated Task:', updatedTask);
 //   Delete the task
    await storageStrategy.delete(updatedTask);
    console.log('Task deleted.');
}

testCRUD();

import pool from "./db.js";
import { Task } from "./Task.js";
import { StorageStrategy } from "./StorageStrategy.js";
import "./types.js";

export class DatabaseStorageStrategy extends StorageStrategy {
  async save(task) {
    const query = `
    INSERT INTO tasks (description, completed, priority, created_date, completed_date, projects, contexts)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
    `;
    const values = [
      task.description,
      task.completed,
      task.priority,
      task.createdDate,
      task.completedDate,
      task.projects,
      task.contexts,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async getAll() {
    const query = `SELECT
    id,
    description,
    completed,
    priority,
    TO_CHAR(created_date, 'YYYY-MM-DD') AS "createdDate",
    TO_CHAR(completed_date, 'YYYY-MM-DD') AS "completedDate",
    projects,
    contexts
    FROM tasks;`;
    const result = await pool.query(query);

    console.log("RAW DB:", result.rows);
    return result.rows.map(
      (row) =>
        new Task({
          ...row,
        })
    );
  }

  async update(task) {
    const query = `
    UPDATE tasks
    SET description = $1, completed = $2, priority = $3, created_date = $4, completed_date = $5, projects = $6, contexts = $7
    WHERE id = $8
    RETURNING *;
    `;
    const values = [
      task.description,
      task.completed,
      task.priority,
      task.createdDate,
      task.completedDate,
      task.projects,
      task.contexts,
      task.id,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async delete(task) {
    const query = `DELETE FROM tasks WHERE id = $1;`;
    await pool.query(query, [task.id]);
  }
}

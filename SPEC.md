# Todo App Specification


- todo-app should automatically handle creation date and completion date.
  However, if tasks are imported from a todo.txt file, how should tasks without
  those dates be handled?

---

## Task Object Specification

### Properties

| Property      | Type     | Required | Description      |
|---------------|----------|----------|------------------|
| description   | string   | Y        | Non-empty string |
| completed     | boolean  | Y        |                  |
| createdDate   | string   | N        | ISO date string  |
| completedDate | string   | N        | ISO date string  |
| priority      | string   | N        | A-Z              |
| projects      | string[] | N        |                  |
| contexts      | string[] | N        |                  |

### Validation Rules

1. Description must be a non-empty string.
2. Created date and completed date must be ISO date strings (`YYYY-MM-DD`).
3. Completed date (if provided) must not be before created date.
4. Priority must be an uppercase letter (`A...Z`).

#### Draft rules

- Incomplete tasks should not have completed dates.
- Created and completed dates should not be in the future.


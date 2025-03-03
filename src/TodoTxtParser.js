export class TodoTxtParser {
  static parse(text) {
    const lines = text.split("\n");
    let tasks = [];
    for (let line of lines) {
      if (!line) continue;
      tasks.push(this.parseLine(line));
    }
    return tasks;
  }

  static parseLine(line) {
    const completed = this.parseCompletion(line);
    const priority = this.parsePriority(line);
    const { createdDate, completedDate } = this.parseDates(
      line,
      completed,
      priority,
    );
    const description = this.parseDescription(
      line,
      completed,
      priority,
      createdDate,
      completedDate,
    );
    const projects = this.parseProjects(line);
    const contexts = this.parseContexts(line);
    return {
      priority,
      completed,
      createdDate,
      completedDate,
      description,
      projects,
      contexts,
    };
  }

  /**
   * @TODO
   * Simplify the regex and pass completed as argument instead
   */
  static parsePriority(line) {
    // Matches a capital letter inside parentheses
    // Must be followed by a space
    // Optionally starts with a "x "
    const regex = /^(x\s)?\(([A-Z])\)\s/;
    const match = line.match(regex);
    const priority = match ? match[2] : null;
    return priority;
  }

  static parseProjects(line) {
    const regex = /(?<=\s|^)\+\w+(?=\s|$)/g;
    const match = line.match(regex);
    return match;
  }

  static parseContexts(line) {
    const regex = /(?<=\s|^)@\w+(?=\s|$)/g;
    const match = line.match(regex);
    return match;
  }

  static parseCompletion(line) {
    // Matches "x " at the start of the string
    const regex = /^x\s/;
    return regex.test(line);
  }

  static parseDescription(
    line,
    completed,
    priority,
    completedDate,
    createdDate,
  ) {
    let parts = line.split(" ");
    if (completed) {
      parts.shift();
    }
    if (priority) {
      parts.shift();
    }
    if (completedDate) {
      parts.shift();
    }
    if (createdDate) {
      parts.shift();
    }
    const description = parts.join(" ").trim();
    return description;
  }

  static parseDates(line, completed, priority) {
    let createdDate = null;
    let completedDate = null;
    let parts = line.split(" ");

    if (completed) parts.shift();
    if (priority) parts.shift();

    // A single ISO date string = [ creation date ]
    if (isISODate(parts[0]) && !isISODate(parts[1])) {
      createdDate = parts[0];
    }

    // Two ISO date strings = [ completion date, creation date ]
    if (isISODate(parts[0]) && isISODate(parts[1])) {
      completedDate = parts[0];
      createdDate = parts[1];
    }

    return {
      createdDate,
      completedDate,
    };
  }
}

function isISODate(string) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(string);
}

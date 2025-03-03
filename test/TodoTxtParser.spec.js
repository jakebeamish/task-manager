import { TodoTxtParser } from "../src/TodoTxtParser.js";
import { Task } from "../src/Task.js"

describe("TodoTxtParser", () => {
  describe("parseCompletion", () => {
    test.each([
      ["x ", true],
      ["x Download Todo.txt mobile app @Phone", true],
      ["x x x ", true],
      ["x 12345", true],
      ["xx", false],
      ["Remember the milk", false],
      ["X not complete", false],
      [" x not complete", false],
      ["xNot complete", false],
    ])("%p returns %p", (input, result) => {
      expect(TodoTxtParser.parseCompletion(input)).toBe(result);
    });
  });

  describe("parsePriority", () => {
    test.each([
      ["(A) Do the thing", "A"],
      ["(B) Walk the dog", "B"],
      ["x (A) Final done", "A"],
      ["(Z) is a letter!", "Z"],
      ["(3) Not a number", null],
      ["(-) Not a symbol", null],
      ["(`) Not a symbol", null],
      ["[A] No square Bs", null],
      ["(A)_Need a space", null],
    ])("%p returns %p", (input, result) => {
      expect(TodoTxtParser.parsePriority(input)).toEqual(result);
    });
  });

  describe("parseDates", () => {
    test.each([
      [
        "x (A) complete task",
        { createdDate: null, completedDate: null },
        true,
        "A",
      ],
      [
        "x (B) 2000-01-01 2000-01-01",
        { createdDate: "2000-01-01", completedDate: "2000-01-01" },
        true,
        "B",
      ],
      [
        "2026-05-20 2026-04-30",
        { createdDate: "2026-04-30", completedDate: "2026-05-20" },
        false,
        null,
      ],
      [
        "(C) 2024-01-01 2020-01-01 do the +project @context",
        { createdDate: "2020-01-01", completedDate: "2024-01-01" },
        false,
        "C",
      ],
      [
        "x 1999-12-31 2024-09-01 wrong way round",
        { createdDate: "2024-09-01", completedDate: "1999-12-31" },
        true,
        null,
      ],
      [
        "0001-01-01",
        { createdDate: "0001-01-01", completedDate: null },
        false,
        null,
      ],
    ])("%p returns %p", (input, expected, completed, priority) => {
      expect(TodoTxtParser.parseDates(input, completed, priority)).toEqual(
        expected,
      );
    });
  });

  describe("parseDescription", () => {
    test.each([
      ["x ", ""],
      ["", ""],
      ["2024-01-01 Do all the washing up", "Do all the washing up"],
      ["2024-01-01 2023-01-01 it is done", "it is done"],
      ["This task has a long description", "This task has a long description"],
      ["x Done task with +prj & @context", "Done task with +prj & @context"],
      ["x (A) 1999-12-31 1999-01-01 test", "test"],
    ])("%p returns %p", (input, expected) => {
      const completed = TodoTxtParser.parseCompletion(input);
      const priority = TodoTxtParser.parsePriority(input);
      const dates = TodoTxtParser.parseDates(input, completed, priority);
      const result = TodoTxtParser.parseDescription(
        input,
        completed,
        priority,
        dates.completedDate,
        dates.createdDate,
      );
      expect(result).toEqual(expected);
    });
  });

  describe("parseContexts", () => {
    test.each([
      ["x Done task without contexts", null],
      ["Send email to joe@bloggs.com", null],
      ["Remember the milk @ the shop", null],
      ["This is not a good @!context", null],
      ["Contexts cant have @'quotes'", null],
      ["Cannot be nested @tag/subtag", null],
      ["Tidy up all the things @home", ["@home"]],
      ["Ask Sherlock at @221BBakerSt", ["@221BBakerSt"]],
      ["@phone Joe Bloggs re: @thing", ["@phone", "@thing"]],
      ["x 2024-01-01  @foo @bar @baz", ["@foo", "@bar", "@baz"]],
      ["Task with +proj and @context", ["@context"]],
    ])("%p returns %p", (input, expected) => {
      expect(TodoTxtParser.parseContexts(input)).toEqual(expected);
    });
  });

  describe("parseProjects", () => {
    test.each([
      ["x Done task without projects", null],
      ["Do maths quiz homework 1+1=2", null],
      ["Remember to buy milk + flour", null],
      ["This is not a good +/project", null],
      ["Cannot be nested +prj/thingy", null],
      ["x Do the project work +maths", ["+maths"]],
      ["Start up a satanic cult +666", ["+666"]],
      ["Kill two birds +this & +that", ["+this", "+that"]],
      ["Task with +proj and @context", ["+proj"]],
    ])("%p returns %p", (input, expected) => {
      expect(TodoTxtParser.parseProjects(input)).toEqual(expected);
    });
  });

  describe("parseLine", () => {
    test.each([
      [
        "(A) Call Mom @Phone +Family",
        {
          completed: false,
          priority: "A",
          createdDate: null,
          completedDate: null,
          description: "Call Mom @Phone +Family",
          projects: ["+Family"],
          contexts: ["@Phone"],
        },
      ],
      [
        "(A) Schedule annual checkup +Health",
        {
          completed: false,
          priority: "A",
          createdDate: null,
          completedDate: null,
          description: "Schedule annual checkup +Health",
          projects: ["+Health"],
          contexts: null,
        },
      ],
      [
        "(B) Outline chapter 5 +Novel @Computer",
        {
          completed: false,
          priority: "B",
          createdDate: null,
          completedDate: null,
          description: "Outline chapter 5 +Novel @Computer",
          projects: ["+Novel"],
          contexts: ["@Computer"],
        },
      ],
      [
        "(C) Add cover sheets @Office +TPSReports",
        {
          completed: false,
          priority: "C",
          createdDate: null,
          completedDate: null,
          description: "Add cover sheets @Office +TPSReports",
          projects: ["+TPSReports"],
          contexts: ["@Office"],
        },
      ],
      [
        "Plan backyard herb garden @Home",
        {
          completed: false,
          priority: null,
          createdDate: null,
          completedDate: null,
          description: "Plan backyard herb garden @Home",
          projects: null,
          contexts: ["@Home"],
        },
      ],
      [
        "Pick up milk @GroceryStore",
        {
          completed: false,
          priority: null,
          createdDate: null,
          completedDate: null,
          description: "Pick up milk @GroceryStore",
          projects: null,
          contexts: ["@GroceryStore"],
        },
      ],
      [
        "Research self-publishing services +Novel @Computer",
        {
          completed: false,
          priority: null,
          createdDate: null,
          completedDate: null,
          description: "Research self-publishing services +Novel @Computer",
          projects: ["+Novel"],
          contexts: ["@Computer"],
        },
      ],
      [
        "x Download Todo.txt mobile app @Phone",
        {
          completed: true,
          priority: null,
          createdDate: null,
          completedDate: null,
          description: "Download Todo.txt mobile app @Phone",
          projects: null,
          contexts: ["@Phone"],
        },
      ],
    ])("%p is parsed correctly", (input, expected) => {
      expect(TodoTxtParser.parseLine(input)).toEqual(expected);
    });
  });
});

import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";

import { render } from "test/react";
import { formatDate } from "utils/dateTime";
import Day from "./Day";

jest.mock("components/shared/Droppable", () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

jest.mock("components/shared/Draggable", () => ({
  __esModule: true,
  default: ({ children, index }) => <div key={index}>{children}</div>,
}));

jest.mock("components/Task", () => ({
  __esModule: true,
  Task: ({ task }) => <span data-testid="task">{task.task}</span>,
}));

jest.mock("components/AddTask", () => ({
  __esModule: true,
  default: () => <input type="text" />,
}));

jest.mock("utils/dateTime", () => ({
  formatDate: jest.fn((_date) => {}),
}));

const fakeTasks = [
  {
    _id: "1",
    task: "Go To Market",
    completed: false,
  },
  {
    _id: "2",
    task: "Go To Gym",
    completed: false,
  },
];

const fakeTaskList = {
  day: "Monday",
  date: "2020-02-28",
  tasks: fakeTasks,
};

const mockOnAddTask = jest.fn(() => {});
const mockOnRemove = jest.fn(() => {});
const mockOnComplete = jest.fn(() => {});

test("render without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Day
      taskList={fakeTaskList}
      onAddTask={mockOnAddTask}
      onRemove={mockOnRemove}
      onComplete={mockOnComplete}
    />,
    div
  );
});

test("render day, date and tasks correctly", () => {
  (formatDate as jest.Mock).mockReturnValue("February 28");

  const { getByTestId, getAllByTestId } = render(
    <Day
      taskList={fakeTaskList}
      onAddTask={mockOnAddTask}
      onRemove={mockOnRemove}
      onComplete={mockOnComplete}
    />
  );

  expect(getByTestId("day").innerHTML).toBe("Monday");
  expect(getByTestId("date").innerHTML).toBe("February 28");
  expect(getAllByTestId("task").length).toBe(2);
  expect(getAllByTestId("task")[0].innerHTML).toBe(fakeTasks[0].task);
  expect(getAllByTestId("task")[1].innerHTML).toBe(fakeTasks[1].task);
});

test("snapshot matches", () => {
  const tree = renderer
    .create(
      <Day
        taskList={fakeTaskList}
        onAddTask={mockOnAddTask}
        onRemove={mockOnRemove}
        onComplete={mockOnComplete}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

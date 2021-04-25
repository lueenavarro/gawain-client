import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";

import { cleanup, render } from "test/react";
import { Task } from "./Task";

const mockOnRemove = jest.fn((_id: string) => {});
const mockOnComplete = jest.fn(() => {});

let fakeTask;
beforeEach(()=> {
  fakeTask = { _id: "1234", task: "Go To Market", completed: true };
  mockOnRemove.mockClear();
  mockOnComplete.mockClear()
})
afterEach(cleanup);

test("render without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Task
      task={fakeTask}
      onRemove={mockOnRemove}
      onComplete={mockOnComplete}
    />,
    div
  );
});

test("render task correctly", () => {
  const { getByTestId } = render(
    <Task
      task={fakeTask}
      onRemove={mockOnRemove}
      onComplete={mockOnComplete}
    />
  );
  expect(getByTestId("task")).toHaveTextContent("Go To Market");
});

test("call onRemove when x is clicked", () => {
  const { getByTestId } = render(
    <Task
      task={fakeTask}
      onRemove={mockOnRemove}
      onComplete={mockOnComplete}
    />
  );
  getByTestId("remove").click();
  expect(mockOnRemove).toBeCalledWith("1234");
});

test("change of style whent task completed", () => {
  fakeTask.completed = true;
  const { getByTestId } = render(
    <Task
      task={fakeTask}
      onRemove={mockOnRemove}
      onComplete={mockOnComplete}
    />
  );
  ;
  expect(getByTestId("task").className).toBe("task__text task--completed");
});

test("snapshot matches", () => {
  const tree = renderer
    .create(
      <Task
        task={fakeTask}
        onRemove={mockOnRemove}
        onComplete={mockOnComplete}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";

import { cleanup, render } from "test/react";
import Task from "./Task";

const mockOnRemove = jest.fn((_id: string) => {});
const mockOnComplete = jest.fn(() => {});
const fakeTask = { _id: "1234", task: "Go To Market" };
const fakeSnapshot = { isDragging: false };

afterEach(cleanup);

test("render without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Task
      task={fakeTask}
      onRemove={mockOnRemove}
      snapshot={fakeSnapshot}
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
      snapshot={fakeSnapshot}
      onComplete={mockOnComplete}
    />
  );
  expect(getByTestId("task")).toHaveTextContent("Go To Market");
});

test("set active class", () => {
  fakeSnapshot.isDragging = true;
  const { getByTestId } = render(
    <Task
      task={fakeTask}
      onRemove={mockOnRemove}
      snapshot={fakeSnapshot}
      onComplete={mockOnComplete}
    />
  );
  expect(getByTestId("taskBg").className).toBe("task task--active");
});

test("call onRemove when x is clicked", () => {
  const { getByTestId } = render(
    <Task
      task={fakeTask}
      onRemove={mockOnRemove}
      snapshot={fakeSnapshot}
      onComplete={mockOnComplete}
    />
  );
  getByTestId("remove").click();
  expect(mockOnRemove).toBeCalledWith("1234");
});

test("snapshot matches", () => {
  const tree = renderer
    .create(
      <Task
        task={fakeTask}
        onRemove={mockOnRemove}
        snapshot={fakeSnapshot}
        onComplete={mockOnComplete}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

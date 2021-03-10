import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import userEvent from "@testing-library/user-event";

import { cleanup, render } from "test/react";
import AddTask from "./AddTask";

const mockOnAddTask = jest.fn((_value, _callback) => {});

beforeEach(() => {
  mockOnAddTask.mockClear();
  cleanup();
});

test("render without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<AddTask onAddTask={mockOnAddTask} />, div);
});

test("call onAddTask when input is blurred", () => {
  const { getByTestId } = render(<AddTask onAddTask={mockOnAddTask} />);
  userEvent.type(getByTestId("addTaskInput"), "Go To Market");
  expect(mockOnAddTask).not.toBeCalled();
  getByTestId("addTaskInput").blur();
  expect(mockOnAddTask).toBeCalledWith("Go To Market", expect.anything());
});

test("don't call onAddTask when input is blurred but empty", () => {
  const { getByTestId } = render(<AddTask onAddTask={mockOnAddTask} />);
  userEvent.type(getByTestId("addTaskInput"), "");
  getByTestId("addTaskInput").blur();
  expect(mockOnAddTask).not.toBeCalled();
});

test("call onAddTask when enter key is pressed", () => {
  const { getByTestId } = render(<AddTask onAddTask={mockOnAddTask} />);
  userEvent.type(getByTestId("addTaskInput"), "Go To Market{enter}");
  expect(mockOnAddTask).toBeCalledWith("Go To Market", expect.anything());
});

test("don't call onAddTask when enter key is pressed but input is empty", () => {
  const { getByTestId } = render(<AddTask onAddTask={mockOnAddTask} />);
  userEvent.type(getByTestId("addTaskInput"), "{enter}");
  expect(mockOnAddTask).not.toBeCalled();
});

test("snapshot matches", () => {
  const tree = renderer.create(<AddTask onAddTask={mockOnAddTask} />).toJSON();
  expect(tree).toMatchSnapshot();
});

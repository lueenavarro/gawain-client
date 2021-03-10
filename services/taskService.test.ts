import task from "./taskService";
import httpService from "./httpService";
import * as arrayUtil from "utils/array";

jest.mock("./httpService", () => ({
  __esModule: true,
  default: {
    get: jest.fn((_url: string) => {}),
    post: jest.fn((_url: string, _data: any) => {}),
    put: jest.fn((_url: string, _data: any) => {}),
    patch: jest.fn((_url: string, _data: any) => {}),
    delete: jest.fn((_url: string) => {}),
  },
}));

test("call to add task endpoint", async () => {
  await task.add("Go To Market", "2021-02-28");

  expect(httpService.post).toHaveBeenCalledWith("/tasks", {
    task: "Go To Market",
    date: "2021-02-28",
  });
});

test("call to current endpoint", async () => {
  (httpService.get as jest.Mock).mockReturnValue(
    Promise.resolve({ data: "mockData" })
  );

  const data = await task.current(
    new Date("2021-02-28"),
    new Date("2021-03-01")
  );

  expect(httpService.get).toHaveBeenCalledWith(
    "/tasks?start=2021-02-28&end=2021-03-01"
  );
  expect(data).toBe("mockData");
});

test("call to move endpoint", async () => {
  const mockMoveTask = {
    destination: { droppableId: 1, index: 0 },
    source: { droppableId: 1, index: 2 },
    draggableId: "1234",
  };
  await task.move(mockMoveTask);

  expect(httpService.post).toBeCalledWith("/tasks/move", {
    source: { date: 1, index: 2 },
    destination: {
      date: 1,
      index: 0,
    },
    _id: "1234",
  });
});

test("optimistic move", async () => {
  const mockTaskList = {
    "2021-02-28": {
      date: "2021-02-28",
      day: "Sunday",
      tasks: [
        {
          _id: "1234",
          task: "Go To Market",
        },
      ],
    },
    "2021-03-01": {
      date: "2021-03-01",
      day: "Monday",
      tasks: [
        {
          _id: "4567",
          task: "Go To Gym",
        },
      ],
    },
  };

  const insertSpy = jest.spyOn(arrayUtil, "insert");
  insertSpy.mockReturnValue([
    mockTaskList["2021-02-28"].tasks[0],
    ...mockTaskList["2021-03-01"].tasks,
  ]);

  const results = await task.optimisticMove(mockTaskList, {
    source: { droppableId: "2021-02-28", index: 0 },
    destination: { droppableId: "2021-03-01", index: 0 },
  });

  expect(results).toStrictEqual({
    "2021-02-28": {
      date: "2021-02-28",
      day: "Sunday",
      tasks: [],
    },
    "2021-03-01": {
      date: "2021-03-01",
      day: "Monday",
      tasks: [
        {
          _id: "1234",
          task: "Go To Market",
        },
        {
          _id: "4567",
          task: "Go To Gym",
        },
      ],
    },
  });
});

test("call to remove task endpoint", async () => {
  await task.remove("1234");
  expect(httpService.delete).toBeCalledWith("/tasks/1234");
});

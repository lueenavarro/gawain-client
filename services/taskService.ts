import { cloneDeep } from "lodash";
import { createObjectID } from "mongo-object-reader";

import httpService from "./httpService";
import { insert } from "utils/array";
import { formatDateForApi } from "utils/dateTime";
import { DragEndResult, KeyString, ITaskList, ITask } from "types";

const add = async (newTask: ITask, date: string) => {
  await httpService.post("/tasks", {
    _id: newTask._id,
    task: newTask.task,
    date,
  });
};

const optimisticAdd = (
  taskLists: KeyString<ITaskList>,
  task: string,
  date: string
) => {
  const dataClone = cloneDeep(taskLists);
  const newTask = {
    _id: createObjectID(),
    task,
    completed: false,
  };
  dataClone[date].tasks.push(newTask);
  return { task: newTask, taskLists: dataClone };
};

const current = (start: Date, end: Date) => {
  const startStr = formatDateForApi(start);
  const endStr = formatDateForApi(end);

  return httpService
    .get<KeyString<ITaskList>>(`/tasks?start=${startStr}&end=${endStr}`)
    .then((res) => res.data);
};

const move = async ({ destination, source, draggableId }: DragEndResult) => {
  await httpService.post("/tasks/move", {
    source: { date: source.droppableId, index: source.index },
    destination: {
      date: destination.droppableId,
      index: destination.index,
    },
    _id: draggableId,
  });
};

const optimisticMove = (
  taskLists: KeyString<ITaskList>,
  { destination, source }: Partial<DragEndResult>
) => {
  const dataClone = cloneDeep(taskLists);
  const task = dataClone[source.droppableId].tasks.splice(source.index, 1);
  dataClone[destination.droppableId].tasks = insert(
    dataClone[destination.droppableId].tasks,
    destination.index,
    task
  );
  return dataClone;
};

const remove = async (_id: string) => {
  await httpService.delete(`/tasks/${_id}`);
};

const optimisticRemove = (
  taskLists: KeyString<ITaskList>,
  _id: string,
  date: string
) => {
  const dataClone = cloneDeep(taskLists);
  const index = dataClone[date].tasks.findIndex((task) => task._id === _id);
  dataClone[date].tasks.splice(index, 1);

  return dataClone;
};

const complete = async (_id: string, completed: boolean) => {
  await httpService.patch(`/tasks/complete/${_id}`, { completed });
};

const optimisticComplete = (
  data: KeyString<ITaskList>,
  _id: string,
  completed: boolean,
  date: string
) => {
  const dataClone = cloneDeep(data);
  const index = dataClone[date].tasks.findIndex((task) => task._id == _id);
  dataClone[date].tasks[index].completed = completed;
  return dataClone;
};

export default {
  add,
  optimisticAdd,
  current,
  move,
  optimisticMove,
  remove,
  optimisticRemove,
  complete,
  optimisticComplete,
};

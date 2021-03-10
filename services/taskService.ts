import httpService from "./httpService";
import { insert } from "utils/array";
import { formatDateForApi } from "utils/dateTime";
import { DragEndResult, KeyString, ITaskList, ITask } from "types";
import { cloneDeep } from "lodash";

const add = async (task: string, date: string) => {
  await httpService.post("/tasks", {
    date,
    task,
  });
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
  data: KeyString<ITaskList>,
  { destination, source }: Partial<DragEndResult>
) => {
  const dataClone = cloneDeep(data);
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
  data: KeyString<ITaskList>,
  _id: string,
  date: string
) => {
  const dataClone = cloneDeep(data);
  const index = dataClone[date].tasks.findIndex((task) => task._id === _id);
  dataClone[date].tasks.splice(index, 1);

  return dataClone;
};

const complete = async (_id: string, completed: boolean) => {
  await httpService.patch(`/tasks/complete/${_id}`, { completed });
};

export default {
  add,
  current,
  move,
  optimisticMove,
  remove,
  optimisticRemove,
  complete,
};

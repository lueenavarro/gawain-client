import httpService from "./httpService";
import { insert } from "utils/array";
import { formatDateForApi } from "utils/dateTime";
import { DragEndResult, KeyString, ITaskList } from "types";

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
    .get<ITaskList>(`/tasks?start=${startStr}&end=${endStr}`)
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
  const task = data[source.droppableId].tasks.splice(source.index, 1);
  data[destination.droppableId].tasks = insert(
    data[destination.droppableId].tasks,
    destination.index,
    task
  );
  return data;
};

const remove = async (_id: string) => {
  await httpService.delete(`/tasks/${_id}`);
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
  complete,
};

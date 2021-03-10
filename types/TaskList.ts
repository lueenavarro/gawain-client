import { ITask } from "./Task";

export interface ITaskList {
  date: string;
  day: string;
  tasks: ITask[];
}

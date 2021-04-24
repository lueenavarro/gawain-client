import React from "react";

import AddTask from "components/AddTask";
import { Task, TaskClone } from "components/Task";
import IDraggable from "shared/components/Draggable";
import IDroppable from "shared/components/Droppable";
import { formatDate } from "utils/dateTime";
import { ITaskList } from "types";

import styles from "./Day.module.scss";

interface DayProps {
  taskList: ITaskList;
  onAddTask: Function;
  onRemove: Function;
  onComplete: Function;
}

const Day = ({ taskList, onAddTask, onRemove, onComplete }: DayProps) => (
  <div className={styles.day}>
    <h3 className={styles["day__name"]} data-testid="day">
      {taskList.day}
    </h3>
    <h5 className={styles["day__date"]} data-testid="date">
      {formatDate(taskList.date)}
    </h5>
    <div className={styles["day__bg"]}>
      <IDroppable
        droppableId={taskList.date}
        clone={{
          list: taskList.tasks,
          parent: TaskClone
        }}
      >
        {taskList.tasks.map((task, index) => (
          <IDraggable key={task._id} draggableId={task._id} index={index}>
            <Task
              task={task}
              onRemove={(...args) => onRemove(...args, taskList.date)}
              onComplete={(...args) => onComplete(...args, taskList.date)}
            />
          </IDraggable>
        ))}
        <AddTask onAddTask={(...args) => onAddTask(...args, taskList.date)} />
      </IDroppable>
    </div>
  </div>
);

export default Day;

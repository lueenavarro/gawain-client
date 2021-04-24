import React from "react";

import AddTask from "components/AddTask";
import { Task, TaskClone } from "components/Task";
import IDraggable from "shared/components/Draggable";
import IDroppable from "shared/components/Droppable";
import { formatDate } from "utils/dateTime";
import { ITask } from "types";

import styles from "./Day.module.scss";

const Day = ({ taskList, onAddTask, onRemove, onComplete }) => (
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
        list={taskList.tasks}
        cloneParent={TaskClone}
      >
        {taskList.tasks.map((task: ITask, index: number) => (
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

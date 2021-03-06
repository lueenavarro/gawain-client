import React from "react";

import { ITask } from "types";

import styles from "./Task.module.scss";

interface TaskProps {
  task: ITask;
  onRemove: Function;
  onComplete: Function;
}

export const Task = ({ task, onRemove, onComplete }: TaskProps) => {
  const taskClass = () =>
    `${styles["task__text"]} ${
      task.completed ? styles["task--completed"] : ""
    }`;

  return (
    <div
      onClick={() => onComplete(task._id, !task.completed)}
      data-testid="taskBg"
      className={styles.task}
    >
      <div className={styles["task__wrapper"]}>
        <span className={taskClass()} data-testid="task">
          {task.task}
        </span>
        {task.completed && (
          <div
            className={styles["task__delete"]}
            onClick={(e) => {
              e.stopPropagation();
              onRemove(task._id);
            }}
            data-testid="remove"
          >
            x
          </div>
        )}
      </div>
    </div>
  );
};

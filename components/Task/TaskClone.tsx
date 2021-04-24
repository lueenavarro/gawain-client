import React from "react";

import { ParentCloneProps, ITask } from "types";

import styles from "./Task.module.scss";
import cloneStyles from "./TaskClone.module.scss";

interface TaskCloneProps extends ParentCloneProps<ITask> {
  item: ITask;
}

export const TaskClone = ({ item: task }: TaskCloneProps) => {
  const taskClass = () =>
    `${styles["task__text"]} ${
      task.completed ? styles["task--completed"] : ""
    }`;

  return (
    <div className={styles.task}>
      <div
        className={`${styles["task__wrapper"]} ${cloneStyles["task__wrapper"]}`}
      >
        <span className={taskClass()} data-testid="task">
          {task.task}
        </span>
      </div>
    </div>
  );
};

import React from "react";

import styles from "./Task.module.scss";
import cloneStyles from "./TaskClone.module.scss";

export const TaskClone = ({ item: task }) => {
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

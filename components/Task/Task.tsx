import React from "react";
import PropTypes from "prop-types";

import styles from "./Task.module.scss";

const Task = (props) => {
  const { task, onRemove, onComplete, snapshot } = props;

  const taskBgClass = () =>
    `${styles.task} ${snapshot.isDragging ? styles["task--active"] : ""}`;
  const taskClass = () => `${styles["task__text"]} ${task.completed ? styles["task--completed"] : ""}`;

  return (
    <div
      className={taskBgClass()}
      onClick={() => onComplete(task._id, !task.completed)}
      data-testid="taskBg"
    >
      <div className={styles["task__wrapper"]}>
      <span className={taskClass()} data-testid="task">
        {task.task}
      </span>
      <div
        className={styles["task__delete"]}
        onClick={(e) => {e.stopPropagation(); onRemove(task._id)}}
        data-testid="remove"
      >
        x
      </div>
      </div>
    </div>
  );
};

Task.propTypes = {
  task: PropTypes.any.isRequired,
  onRemove: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  snapshot: PropTypes.any,
};

export default Task;

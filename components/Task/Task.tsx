import React from "react";
import PropTypes from "prop-types";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import styles from "./Task.module.scss";

const Task = (props) => {
  const { task, onRemove, onComplete } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const taskClass = () =>
    `${styles["task__text"]} ${
      task.completed ? styles["task--completed"] : ""
    }`;

  return (
    <div
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      data-testid="taskBg"
      className={styles.task}
    >
      <div className={styles["task__wrapper"]}>
        <span className={taskClass()} data-testid="task">
          {task._id}
        </span>
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

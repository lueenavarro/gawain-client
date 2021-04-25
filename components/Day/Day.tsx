import React from "react";
import PropTypes from "prop-types";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";

import Task from "components/Task";
import AddTask from "components/AddTask";
import { formatDate } from "utils/dateTime";
import { ITask } from "types";

import styles from "./Day.module.scss";
import { useDroppable } from "@dnd-kit/core";

const Day = ({ taskList, onAddTask, onRemove, onComplete }) => {
  const { setNodeRef } = useDroppable({
    id: taskList.date,
  });
  return (
    <div className={styles.day}>
      <h3 className={styles["day__name"]} data-testid="day">
        {taskList.day}
      </h3>
      <h5 className={styles["day__date"]} data-testid="date">
        {formatDate(taskList.date)}
      </h5>
      <SortableContext items={taskList.tasks.map((task: ITask) => task._id)} strategy={rectSortingStrategy}>
        <div ref={setNodeRef} className={styles["day__bg"]}>
          {taskList.tasks.map((task: ITask) => (
            <Task
              key={task._id}
              task={task}
              onRemove={(...args) => onRemove(...args, taskList.date)}
              onComplete={(...args) => onComplete(...args, taskList.date)}
            />
          ))}
          <AddTask onAddTask={(...args) => onAddTask(...args, taskList.date)} />
        </div>
      </SortableContext>
    </div>
  );
};

Day.propTypes = {
  taskList: PropTypes.any.isRequired,
  onAddTask: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default Day;

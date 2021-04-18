import React from "react";
import PropTypes from "prop-types";
import {  SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

import Task from "components/Task";
import AddTask from "components/AddTask";
import { formatDate } from "utils/dateTime";
import { ITask } from "types";

import styles from "./Day.module.scss";

const Day = ({ taskList, onAddTask, onRemove, onComplete }) => {
  return (
    <div className={styles.day}>
      <h3 className={styles["day__name"]} data-testid="day">
        {taskList.day}
      </h3>
      <h5 className={styles["day__date"]} data-testid="date">
        {formatDate(taskList.date)}
      </h5>
      <SortableContext items={taskList.tasks} strategy={verticalListSortingStrategy}>
        <div className={styles["day__bg"]}>
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

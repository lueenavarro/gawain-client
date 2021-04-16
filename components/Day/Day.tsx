import React from "react";
import PropTypes from "prop-types";

import Task from "components/Task";
import AddTask from "components/AddTask";
import { formatDate } from "utils/dateTime";
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
          {taskList.tasks.map((task, index) => (
              <Task
                key={index}
                task={task}
                onRemove={(...args) => onRemove(...args, taskList.date)}
                onComplete={(...args) => onComplete(...args, taskList.date)}
              />
          ))}
          <AddTask onAddTask={(...args) => onAddTask(...args, taskList.date)} />
      </div>
    </div>
);

Day.propTypes = {
  taskList: PropTypes.any.isRequired,
  onAddTask: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default Day;

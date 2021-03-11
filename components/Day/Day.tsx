import React from "react";
import PropTypes from "prop-types";

import Task from "components/Task";
import AddTask from "components/AddTask";
import Droppable from "shared/components/Droppable";
import Draggable from "shared/components/Draggable";
import { formatDate } from "utils/dateTime";
import styles from "./Day.module.scss";

const Day = ({ day, date, tasks, onAddTask, onRemove, onComplete }) => {
  return (
    <div className={styles.day}>
      <h3 className={styles["day__name"]} data-testid="day">
        {day}
      </h3>
      <h5 className={styles["day__date"]} data-testid="date">
        {formatDate(date)}
      </h5>
      <div className={styles["day__bg"]}>
        <Droppable droppableId={date}>
          {tasks.map((task, index: number) => (
            <Draggable key={task._id} draggableId={task._id} index={index}>
              <Task
                task={task}
                onRemove={(...args) => onRemove(...args, date)}
                onComplete={(...args) => onComplete(...args, date)}
              />
            </Draggable>
          ))}
          <AddTask onAddTask={(...args) => onAddTask(...args, date)} />
        </Droppable>
      </div>
    </div>
  );
};

Day.propTypes = {
  day: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  tasks: PropTypes.any.isRequired,
  onAddTask: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default Day;

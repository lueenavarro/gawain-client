import React, { useEffect, useState } from "react";

import AddTask from "components/AddTask";
import { Task, TaskClone } from "components/Task";
import IDraggable from "components/shared/Draggable";
import IDroppable from "components/shared/Droppable";
import { useWindowDimensions } from "hooks/useWindowDimension";
import { usePrevious } from "hooks/usePrevious";
import { formatDate } from "utils/dateTime";
import { ITaskList } from "types";

import styles from "./Day.module.scss";

interface DayProps {
  taskList: ITaskList;
  onAddTask: Function;
  onRemove: Function;
  onComplete: Function;
}

const Day = ({ taskList, onAddTask, onRemove, onComplete }: DayProps) => {
  const windowsDimension = useWindowDimensions();
  const previousDimension = usePrevious(windowsDimension);
  const [tasksHeight, setTasksHeight] = useState(0);
  const taskHeight = 30;

  useEffect(() => {
    if (windowsDimension.height !== previousDimension?.height) {
      const absoluteMinHeight = 210;
      const offsetFactor = 2.2;
      const minHeight = windowsDimension.height / offsetFactor;
      const minHeightRounded = minHeight - (minHeight % taskHeight);
      setTasksHeight(
        minHeightRounded > absoluteMinHeight
          ? minHeightRounded
          : absoluteMinHeight
      );
    }
  }, [windowsDimension]);

  return (
    <div className={styles.day}>
      <h3 className={styles["day__name"]} data-testid="day">
        {taskList.day}
      </h3>
      <h5 className={styles["day__date"]} data-testid="date">
        {formatDate(taskList.date)}
      </h5>
      <div
        className={styles["day__bg"]}
        style={{ minHeight: tasksHeight }}
      >
        <IDroppable
          droppableId={taskList.date}
          clone={{
            list: taskList.tasks,
            parent: TaskClone,
          }}
        >
          {taskList.tasks.map((task, index) => (
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
};

export default Day;

import React, { useEffect, useState } from "react";
import { cloneDeep } from "lodash";
import SwiperCore, { Navigation, Controller } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import Day from "components/Day";
import DragDropContext from "shared/components/DragDropContext";
import Loading from "shared/components/Loading";
import task from "services/taskService";
import { DragEndResult, ITaskList, KeyString } from "types";
import { addDays } from "utils/dateTime";

import styles from "./Days.module.scss";

SwiperCore.use([Controller, Navigation]);

const Days = () => {
  const [taskLists, setTaskLists] = useState<KeyString<ITaskList>>({});
  const [taskListArray, setTaskListArray] = useState<ITaskList[]>([]);
  const [swiperInstance, setSwiperInstance] = useState<SwiperCore>(null);
  
  const initialFirstDay = addDays(new Date(), -2);
  const [dates, setDates] = useState({
    start: initialFirstDay,
    end: addDays(initialFirstDay, 7),
  });

  useEffect(() => {
    task.current(dates.start, dates.end).then((tasks) => {
      setTaskListArray([...taskListArray, ...Object.values(tasks)]);
      setTaskLists({ ...taskLists, ...tasks });
    });
  }, [dates]);

  const handleAddTask = async (
    newTask: string,
    next: Function,
    date: string
  ) => {
    const oldTasks = cloneDeep(taskLists);
    const { task: newTaskObj, taskLists: newTaskLists } = task.optimisticAdd(
      taskLists,
      newTask,
      date
    );
    setTaskLists(newTaskLists);
    next();

    try {
      await task.add(newTaskObj, date);
    } catch (error) {
      setTaskLists(oldTasks);
    }
  };

  const handleMoveTask = async (result: DragEndResult) => {
    if (result.destination) {
      const oldTasks = cloneDeep(taskLists);
      setTaskLists(task.optimisticMove(taskLists, result));

      try {
        await task.move(result);
      } catch (error) {
        setTaskLists(oldTasks);
      }
    }
  };

  const handleRemoveTask = async (_id: string, date: string) => {
    const oldTasks = cloneDeep(taskLists);
    setTaskLists(task.optimisticRemove(taskLists, _id, date));

    try {
      await task.remove(_id);
    } catch (error) {
      setTaskLists(oldTasks);
    }
  };

  const handleCompleteTask = async (
    _id: string,
    completed: boolean,
    date: string
  ) => {
    const oldTasks = cloneDeep(taskLists);
    setTaskLists(task.optimisticComplete(taskLists, _id, completed, date));

    try {
      await task.complete(_id, completed);
    } catch (error) {
      setTaskLists(oldTasks);
    }
  };

  const handleReachEnd = () => {
    const newStartDate = addDays(dates.end, 1);
    setDates({
      start: newStartDate,
      end: addDays(newStartDate, 7),
    });
  };

  return (
    <>
      {taskListArray.length === 0 && <Loading />}
      {taskListArray.length > 0 && (
        <section className={styles.days}>
          <div
            className={styles.prev}
            onClick={() => swiperInstance.slidePrev()}
          >
            <div className={styles.arrow}></div>
          </div>
          <div className={styles["days__slide"]}>
            <DragDropContext onDragEnd={handleMoveTask}>
              <Swiper controller={{ control: swiperInstance }}></Swiper>
                <Swiper
                  slidesPerView={5}
                  spaceBetween={0}
                  noSwiping={true}
                  allowTouchMove={false}
                  initialSlide={1}
                  onReachEnd={() => handleReachEnd()}
                  onSwiper={(swiper) => setSwiperInstance(swiper)}
                  onSlideChange={() => console.log("slide change")}
                >
                  {taskListArray.map((taskList: ITaskList) => (
                    <SwiperSlide key={taskList.date}>
                      <Day
                        onAddTask={handleAddTask}
                        onRemove={handleRemoveTask}
                        onComplete={handleCompleteTask}
                        {...taskList}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
            </DragDropContext>
          </div>
          <div
            className={styles.next}
            onClick={() => swiperInstance.slideNext()}
          >
            <div className={styles.arrow}></div>
          </div>
        </section>
      )}
    </>
  );
};

export default Days;

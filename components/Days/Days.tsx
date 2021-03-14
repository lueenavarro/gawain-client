import React, { useEffect, useRef, useState } from "react";
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
  const [taskDates, setTaskDates] = useState<KeyString<ITaskList>>({});
  const [taskArray, setTaskArray] = useState<ITaskList[]>([]);
  const swiperInstance = useRef<SwiperCore>(null);
  const [dates, setDates] = useState(() => {
    return {
      start: addDays(new Date(), -30),
      end: addDays(new Date(), 30),
      addToEnd: true,
    };
  });

  useEffect(() => {
    task.current(dates.start, dates.end).then((tasks) => {
      setTaskDates(tasks);
    });
  }, [dates]);

  useEffect(() => {
    setTaskArray((state) =>
      dates.addToEnd
        ? state.concat(Object.values(taskDates))
        : Object.values(taskDates).concat(state)
    );
  }, [taskDates]);

  useEffect(() => {
    if (!dates.addToEnd) {
      swiperInstance.current?.slideTo(7, 0);
    }
  }, [taskArray]);

  const handleAddTask = async (
    newTask: string,
    next: Function,
    date: string
  ) => {
    const oldTasks = cloneDeep(taskDates);
    const { task: newTaskObj, taskLists: newTaskLists } = task.optimisticAdd(
      taskDates,
      newTask,
      date
    );
    setTaskDates(newTaskLists);
    next();

    try {
      await task.add(newTaskObj, date);
    } catch (error) {
      setTaskDates(oldTasks);
    }
  };

  const handleMoveTask = async (result: DragEndResult) => {
    if (result.destination) {
      const oldTasks = cloneDeep(taskDates);
      setTaskDates(task.optimisticMove(taskDates, result));
      setTaskArray(Object.values(task.optimisticMove(taskDates, result)));

      try {
        await task.move(result);
      } catch (error) {
        setTaskDates(oldTasks);
      }
    }
  };

  const handleRemoveTask = async (_id: string, date: string) => {
    const oldTasks = cloneDeep(taskDates);
    setTaskDates(task.optimisticRemove(taskDates, _id, date));

    try {
      await task.remove(_id);
    } catch (error) {
      setTaskDates(oldTasks);
    }
  };

  const handleCompleteTask = async (
    _id: string,
    completed: boolean,
    date: string
  ) => {
    const oldTasks = cloneDeep(taskDates);
    setTaskDates(task.optimisticComplete(taskDates, _id, completed, date));

    try {
      await task.complete(_id, completed);
    } catch (error) {
      setTaskDates(oldTasks);
    }
  };

  const next = () => {
    swiperInstance.current.slideNext();
    if (swiperInstance.current.isEnd) {
      const newStartDate = addDays(
        new Date(taskArray[swiperInstance.current?.slides.length - 1].date),
        1
      );
      setDates({
        start: newStartDate,
        end: addDays(newStartDate, 7),
        addToEnd: true,
      });
    }
  };

  const prev = () => {
    swiperInstance.current.slidePrev();
    if (swiperInstance.current.isBeginning) {
      const newEndDate = addDays(new Date(taskArray[0].date), -1);
      setDates({
        start: addDays(newEndDate, -7),
        end: newEndDate,
        addToEnd: false,
      });
    }
  };

  return (
    <>
      {taskArray.length === 0 && <Loading />}
      {taskArray.length > 0 && (
        <section className={styles.days}>
          <div className={styles.prev} onClick={() => prev()}>
            <div className={styles.arrow}></div>
          </div>
          <div className={styles["days__slide"]}>
            <DragDropContext onDragEnd={handleMoveTask}>
              <Swiper controller={{ control: swiperInstance.current }}></Swiper>
              <Swiper
                slidesPerView={5}
                spaceBetween={0}
                noSwiping={true}
                allowTouchMove={false}
                onSwiper={(swiper) => {
                  swiper.slideTo(29, 0);
                  swiperInstance.current = swiper;
                }}
                onSlideChange={() => console.log("slide change")}
              >
                {taskArray.map((taskList: ITaskList) => (
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
          <div className={styles.next} onClick={() => next()}>
            <div className={styles.arrow}></div>
          </div>
        </section>
      )}
    </>
  );
};

export default Days;

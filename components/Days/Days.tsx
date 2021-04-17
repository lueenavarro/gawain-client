import React, { useEffect, useRef, useState } from "react";
import { cloneDeep } from "lodash";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Controller } from "swiper";

import Day from "components/Day";
import Loading from "shared/components/Loading";
import task from "services/taskService";
import { DragEndResult, ITaskList, KeyString } from "types";
import { addDays } from "utils/dateTime";
import { sliceObjects } from "utils/objects";
import { useCustomState } from "hooks/useCustomState";

import styles from "./Days.module.scss";

SwiperCore.use([Controller, Navigation]);

const daysToAdd = 20;
const breakpoints = {
  320: { slidesPerView: 1 },
  480: { slidesPerView: 2 },
  640: { slidesPerView: 3 },
  768: { slidesPerView: 4 },
  1024: { slidesPerView: 5 },
};

const Days = () => {
  const firstDay = addDays(new Date(), -1);
  const [dates, setDates] = useState({
    start: addDays(firstDay, -daysToAdd),
    end: addDays(firstDay, daysToAdd),
  });
  const [taskLists, setTaskLists] = useCustomState<KeyString<ITaskList>>(null);
  const swiper = useRef<SwiperCore>(null);

  useEffect(() => {
    task.current(dates.start, dates.end).then((data) => setTaskLists(data));
  }, []);

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

  const handleEndReached = async () => {
    if (swiper.current?.isEnd) {
      setDates((dates) => {
        const start = addDays(dates.end, 1);
        const end = addDays(dates.end, daysToAdd);

        task.current(start, end).then((data) => {
          setTaskLists(
            (taskLists) => {
              const newTaskLists = sliceObjects(taskLists, 0, daysToAdd);
              return { ...newTaskLists, ...data };
            },
            () => {
              const numberOfVisibleSlides =
                swiper.current.currentBreakpoint === "max"
                  ? 1
                  : breakpoints[swiper.current.currentBreakpoint].slidesPerView;
              swiper.current.slideTo(daysToAdd - numberOfVisibleSlides + 1, 0);
            }
          );
        });

        return { start, end };
      });
    }
  };

  const handleBeginningReached = async () => {
    if (swiper.current?.isBeginning) {
      setDates((dates) => {
        const start = addDays(dates.start, -daysToAdd);
        const end = addDays(dates.start, -1);

        task.current(start, end).then((data) => {
          setTaskLists(
            (taskLists) => {
              const newTaskLists = sliceObjects(
                taskLists,
                swiper.current.slides.length - daysToAdd
              );
              return { ...data, ...newTaskLists };
            },
            () => swiper.current.slideTo(daysToAdd, 0)
          );
        });

        return { start, end };
      });
    }
  };

  return (
    <>
      {!taskLists && <Loading />}
      {taskLists && (
        <section className={styles.days}>
          <div
            className={styles.prev}
            onClick={() => swiper.current.slidePrev()}
          >
            <div className={styles.arrow}></div>
          </div>
          <Swiper controller={{ control: swiper.current }}></Swiper>
          <Swiper
            breakpoints={breakpoints}
            initialSlide={daysToAdd + 1}
            allowTouchMove={false}
            onSwiper={(swiperCore) => (swiper.current = swiperCore)}
            onSlidePrevTransitionEnd={handleBeginningReached}
            onSlideNextTransitionEnd={handleEndReached}
          >
            {Object.values(taskLists).map((taskList: ITaskList) => (
              <SwiperSlide key={taskList.date}>
                <Day
                  onAddTask={handleAddTask}
                  onRemove={handleRemoveTask}
                  onComplete={handleCompleteTask}
                  taskList={taskList}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div
            className={styles.next}
            onClick={() => swiper.current.slideNext()}
          >
            <div className={styles.arrow}></div>
          </div>
        </section>
      )}
    </>
  );
};

export default Days;

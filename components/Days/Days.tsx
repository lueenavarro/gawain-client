import React, { useEffect, useRef, useState } from "react";
import { cloneDeep } from "lodash";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Controller } from "swiper";

import Day from "components/Day";
import Loading from "shared/components/Loading";
import IDragDropContext from "shared/components/DragDropContext";
import task from "services/taskService";
import { DragEndResult, ITaskList, KeyString } from "types";
import { addDays } from "utils/dateTime";
import { spliceObject } from "utils/objects";
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
    task
      .current(dates.start, dates.end)
      .then((data) =>
        setTaskLists(data, () => swiper.current.slideTo(daysToAdd + 1, 0))
      );
  }, []);

  const handleAddTask = async (
    newTask: string,
    next: () => void,
    date: string
  ) => {
    const oldTasks = cloneDeep(taskLists);
    const { task: newTaskObj, taskLists: newTaskLists } = task.optimisticAdd(
      taskLists,
      newTask,
      date
    );
    setTaskLists(newTaskLists, next);

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

  const handleEndReached = () => {
    if (swiper.current?.isEnd)
      setDates((dates) => {
        const start = addDays(dates.end, 1);
        const end = addDays(dates.end, daysToAdd);
        task.current(start, end).then(pushTaskLists);
        return { start, end };
      });
  };

  const pushTaskLists = (data: KeyString<ITaskList>) =>
    setTaskLists(
      (taskLists) => ({ ...spliceObject(taskLists, 0, daysToAdd), ...data }),
      () => {
        const visibleSlidesCount =
          breakpoints[swiper.current.currentBreakpoint]?.slidesPerView || 1;
        swiper.current.slideTo(daysToAdd - visibleSlidesCount + 1, 0);
      }
    );

  const handleBeginningReached = () => {
    if (swiper.current?.isBeginning)
      setDates((dates) => {
        const start = addDays(dates.start, -daysToAdd);
        const end = addDays(dates.start, -1);

        task.current(start, end).then(prependTaskLists);
        return { start, end };
      });
  };

  const prependTaskLists = (data: KeyString<ITaskList>) =>
    setTaskLists(
      (taskLists) => ({
        ...data,
        ...spliceObject(taskLists, swiper.current.slides.length - daysToAdd),
      }),
      () => swiper.current.slideTo(daysToAdd, 0)
    );

  return (
    <React.Fragment>
      {!taskLists && <Loading />}
      <section className={styles.days}>
        {taskLists && (
          <div
            className={styles.prev}
            onClick={() => swiper.current.slidePrev()}
          >
            <div className={styles.arrow}></div>
          </div>
        )}
        <IDragDropContext onDragEnd={(result) => handleMoveTask(result)}>
          <Swiper controller={{ control: swiper.current }}></Swiper>
          <Swiper
            breakpoints={breakpoints}
            allowTouchMove={false}
            onSwiper={(swiperCore) => (swiper.current = swiperCore)}
            onSlidePrevTransitionEnd={handleBeginningReached}
            onSlideNextTransitionEnd={handleEndReached}
          >
            {taskLists &&
              Object.values(taskLists).map((taskList: ITaskList) => (
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
        </IDragDropContext>
        {taskLists && (
          <div
            className={styles.next}
            onClick={() => swiper.current.slideNext()}
          >
            <div className={styles.arrow}></div>
          </div>
        )}
      </section>
    </React.Fragment>
  );
};

export default Days;

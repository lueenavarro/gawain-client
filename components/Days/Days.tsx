import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Controller } from "swiper";
import { cloneDeep, range } from "lodash";

import Day from "components/Day";
import Loading from "shared/components/Loading";
import task from "services/taskService";
import { DragEndResult, ITaskList } from "types";
import { addDays } from "utils/dateTime";

import styles from "./Days.module.scss";

SwiperCore.use([Controller, Navigation]);

const Days = () => {
  const firstDay = addDays(new Date(), -1);
  const daysToAdd = 7
  const [dates, setDates] = useState({
    start: addDays(firstDay, -daysToAdd),
    end: addDays(firstDay, daysToAdd),
  });
  const [taskLists, setTaskLists] = useState(null);
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

  const next = () => {
    swiper.current.slideNext()
    onEndReached();
  };

  useEffect(()=> {

  }, [taskLists])

  const onEndReached = async () => {
    if (swiper.current.isEnd) {
      const start = addDays(dates.end, 1);
      const end = addDays(start, daysToAdd);

      const data = await task.current(start, end);
      await setTaskLists({ ...taskLists, ...data });
      swiper.current.removeSlide(range(0, daysToAdd));
      setDates({ start, end });
    }
  }

  const prev = async () => {
    swiper.current.slidePrev()
    handleBeginningReached();
  };

  const handleBeginningReached = async () => {
    if (swiper.current.activeIndex === 1) {
      const start = addDays(dates.start, -daysToAdd);
      const end = addDays(dates.start, -1);

      const data = await task.current(start, end);
      await setTaskLists({ ...data, ...taskLists });
      swiper.current.slideTo(daysToAdd + 1, 0);
      swiper.current.removeSlide(range(
        swiper.current.slides.length - daysToAdd, 
        swiper.current.slides.length));
      setDates({ start, end });
    }
  }

  const breakpoints = {
    480: { slidesPerView: 1 },
    640: { slidesPerView: 2 },
    768: { slidesPerView: 4 },
    1024: { slidesPerView: 5 },
  }

  return (
    <>
      {!taskLists && <Loading />}
      {taskLists && (
        <section className={styles.days}>
          <div className={styles.prev} onClick={prev}>
            <div className={styles.arrow}></div>
          </div>
          <Swiper controller={{ control: swiper.current }}></Swiper>
          <Swiper
            breakpoints={breakpoints}
            initialSlide={daysToAdd + 1}
            onSwiper={(swiperCore) => swiper.current = swiperCore}
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
          <div className={styles.next} onClick={next}>
            <div className={styles.arrow}></div>
          </div>
        </section>
      )}
    </>
  );
};

export default Days;

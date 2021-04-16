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
  const [dates, setDates] = useState({
    start: addDays(firstDay, -7),
    end: addDays(firstDay, 7),
  });
  const [taskLists, setTaskLists] = useState(null);
  const swiperInstance = useRef<SwiperCore>(null);

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
    swiperInstance.current.slideNext()
    onEndReached();
  };

  useEffect(()=> {

  }, [taskLists])

  const onEndReached = async () => {
    if (swiperInstance.current.isEnd) {
      const numberOfDaysToAdd = 7;
      const start = addDays(dates.end, 1);
      const end = addDays(start, numberOfDaysToAdd);

      const data = await task.current(start, end);
      await setTaskLists({ ...taskLists, ...data });
      swiperInstance.current.removeSlide(range(0, numberOfDaysToAdd));
      setDates({ start, end });
    }
  }

  const prev = async () => {
    swiperInstance.current.slidePrev()
    handleBeginningReached();
  };

  const handleBeginningReached = async () => {
    if (swiperInstance.current.activeIndex === 1) {
      const numberOfDaysToAdd = 7;
      const start = addDays(dates.start, -numberOfDaysToAdd);
      const end = addDays(dates.start, -1);

      const data = await task.current(start, end);
      await setTaskLists({ ...data, ...taskLists });
      swiperInstance.current.slideTo(numberOfDaysToAdd + 1, 0);
      swiperInstance.current.removeSlide(range(
        swiperInstance.current.slides.length - numberOfDaysToAdd, 
        swiperInstance.current.slides.length));
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
          <Swiper controller={{ control: swiperInstance.current }}></Swiper>
          <Swiper
            breakpoints={breakpoints}
            onSwiper={(swiper) => swiperInstance.current = swiper}
            initialSlide={8}
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

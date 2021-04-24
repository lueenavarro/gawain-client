import React, { useState } from "react";
import PropTypes from "prop-types";

import { CharCodes } from "../../constants";
import styles from "./AddTask.module.scss";

interface AddTaskProps {
  onAddTask: Function;
}

const AddTask = ({ onAddTask }: AddTaskProps) => {
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = () => {
    onAddTask(value, () => setValue(""));
  };

  const handleBlur = () => {
    if (value) {
      handleSubmit();
    }
  };

  const handleKeypress = (event) => {
    if (value && event.charCode === CharCodes.ENTER) {
      handleSubmit();
    }
  };

  return (
    <input
      className={styles["add-task"]}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyPress={handleKeypress}
      data-testid="addTaskInput"
    />
  );
};

AddTask.propTypes = {
  onAddTask: PropTypes.func.isRequired,
};

export default AddTask;

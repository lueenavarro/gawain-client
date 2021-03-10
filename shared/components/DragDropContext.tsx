import React from "react";
import PropTypes from "prop-types";
import { DragDropContext } from "react-beautiful-dnd";

const IDragDropContext = ({ onDragStart, onDragEnd, children }) => {
  return <DragDropContext onDragEnd={onDragEnd}> {children}</DragDropContext>;
};

IDragDropContext.propTypes = {
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func.isRequired,
};

export default IDragDropContext;

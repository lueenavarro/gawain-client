import React from "react";
import PropTypes from "prop-types";
import { Droppable } from "react-beautiful-dnd";

const IDroppable = ({ droppableId, children }) => {
  return (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          style={{ height: "100%" }}
          {...provided.droppableProps}
        >
          {children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

IDroppable.propTypes = {
  droppableId: PropTypes.string.isRequired,
};

export default IDroppable;

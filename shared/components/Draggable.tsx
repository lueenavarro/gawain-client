import React from "react";
import PropTypes from "prop-types";
import { Draggable } from "react-beautiful-dnd";

const IDraggable = ({ draggableId, index, children }) => {
  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {React.cloneElement(children, { snapshot })}
        </div>
      )}
    </Draggable>
  );
};

IDraggable.propTypes = {
  draggableId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

export default IDraggable;

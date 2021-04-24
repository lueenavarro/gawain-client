import React from "react";
import { Droppable } from "react-beautiful-dnd";

const IDroppable = ({
  droppableId,
  list,
  cloneParent: CloneParent,
  children,
}) => {
  return (
    <Droppable
      droppableId={droppableId}
      renderClone={(provided, _, rubric) => {
        return (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <CloneParent item={list[rubric.source.index]}></CloneParent>
          </div>
        );
      }}
    >
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

export default IDroppable;

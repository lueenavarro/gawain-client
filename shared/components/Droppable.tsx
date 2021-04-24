import React from "react";
import { Droppable } from "react-beautiful-dnd";

interface DroppablePropType {
  droppableId: string;
  list: Array<any>
  cloneParent: React.ElementType,
  children: React.ReactNode
}

const IDroppable = ({
  droppableId,
  list,
  cloneParent: CloneParent = undefined,
  children,
}: DroppablePropType) => {
  let renderCloneProps = {};
  if (CloneParent) {
    renderCloneProps = {
      renderClone: (provided, _, rubric) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <CloneParent item={list[rubric.source.index]}></CloneParent>
        </div>
      ),
    };
  }

  return (
    <Droppable droppableId={droppableId} {...renderCloneProps}>
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

import React from "react";
import { Droppable } from "react-beautiful-dnd";

interface DroppablePropType {
  droppableId: string;
  clone?: {
    list: Array<any>;
    parent: React.ElementType;
  };
  children: React.ReactNode;
}

const IDroppable = ({
  droppableId,
  clone: Clone,
  children,
}: DroppablePropType) => {
  let renderCloneProps = {};
  if (Clone) {
    renderCloneProps = {
      renderClone: (provided, _, rubric) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Clone.parent item={Clone.list[rubric.source.index]}></Clone.parent>
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

import React from "react";
import { Draggable } from "react-beautiful-dnd";

interface IDraggableProps {
  draggableId: string;
  index: number;
  children: React.ReactNode;
}

const IDraggable = ({ draggableId, index, children }: IDraggableProps) => {
  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {children}
        </div>
      )}
    </Draggable>
  );
};

export default IDraggable;

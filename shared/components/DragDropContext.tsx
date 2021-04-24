import React from "react";
import PropTypes from "prop-types";
import { DragDropContext } from "react-beautiful-dnd";
import { DragEndResult } from "types";

interface IDragDropContextProps {
  onDragStart?: () => any;
  onDragEnd: (result: DragEndResult) => any;
  children: React.ReactNode;
}

const IDragDropContext = ({
  onDragStart,
  onDragEnd,
  children,
}: IDragDropContextProps) => {
  return (
    <DragDropContext
      onDragStart={onDragStart}
      onDragEnd={(result) => onDragEnd(result as DragEndResult)}
    >
      {children}
    </DragDropContext>
  );
};

IDragDropContext.propTypes = {
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func.isRequired,
};

export default IDragDropContext;

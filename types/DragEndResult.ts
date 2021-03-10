interface DroppableIdentifier {
  droppableId: any;
  index: number;
}

export interface DragEndResult {
  destination: DroppableIdentifier;
  source: DroppableIdentifier;
  draggableId: any;
}

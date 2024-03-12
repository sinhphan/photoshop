import { FC } from "react";
import { useDesign1 } from "./useDesign";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DragDropLayer from "./DragDropLayer";

type LayersProps = {};

const Layers: FC<LayersProps> = ({ }) => {

  return (<div className="w-full border">
    <div className="border-b px-3 py-2 w-full">
      Layers
    </div>
    <DndProvider backend={HTML5Backend}>
      <DragDropLayer />
    </DndProvider>
  </div>)
}

export default Layers
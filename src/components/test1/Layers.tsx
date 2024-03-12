import { FC } from "react";
import { useDesign1 } from "./useDesign";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DragDropLayer from "./DragDropLayer";

type LayersProps = {};

const Layers: FC<LayersProps> = ({ }) => {
  const { histories , addImageLayer} = useDesign1()
  const handleUndo = ()=>{
    histories?.undo?.()
  }

  const handleRedo = ()=>{
    histories?.redo?.()
  }

  const handleAddLayer = ()=>{
    addImageLayer?.()
  }

  return (<div className="w-full border">
    <div className="border-b px-3 py-2 w-full flex justify-between">
      <p>Layers</p>
      <div className="flex gap-2">
        <button onClick={handleAddLayer}>Add</button>
        <button onClick={handleUndo}>undo</button>
        <button onClick={handleRedo}>redo</button>
      </div>
    </div>
    <DndProvider backend={HTML5Backend}>
      <DragDropLayer />
    </DndProvider>
  </div>)
}

export default Layers
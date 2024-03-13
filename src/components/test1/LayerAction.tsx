import { ChangeEvent, FC, useRef } from "react";
import { useDesign1 } from "./useDesign";
import { fabric } from "fabric"
import ImageAction from "./ImageAction";
import TextAction from "./TextAction";
import OptionSetting from "./OptionSetting";

type LayerActionProps = {};

const LayerAction: FC<LayerActionProps> = ({ }) => {
  const { canvas, currentLayer, template, setLayers, layers, setCurrentLayer } = useDesign1()


  const handleFitToCanvas = () => {
    const activeObject = canvas?.getActiveObject() as fabric.Image;
    activeObject.set({
      top: template?.top,
      left: template?.left,
      'scaleX': (template?.width || 0) / (activeObject.width || 0),
      'scaleY': (template?.height || 0) / (activeObject.height || 0),
    })
    canvas?.renderAll()
  }

  const handleAlignTop = () => {
    const activeObject = canvas?.getActiveObject() as fabric.Image;
    activeObject.set({
      top: template?.top
    })
    canvas?.renderAll()
  }
  const handleAlignBottom = () => {
    const activeObject = canvas?.getActiveObject() as fabric.Image;
    activeObject.set({
      top: (template?.top || 0) + ((template?.height || 0) - (activeObject.getScaledHeight() || 0))
    })
    canvas?.renderAll()
  }

  const handleItemCenter = () => {
    const activeObject = canvas?.getActiveObject() as fabric.Image;
    activeObject.set({
      top: (template?.top || 0) + ((template?.height || 0) - (activeObject.getScaledHeight() || 0)) / 2
    })
    canvas?.renderAll()
  }
  const handleJustifyCenter = () => {
    const activeObject = canvas?.getActiveObject() as fabric.Image;
    activeObject.set({
      left: (template?.left || 0) + ((template?.width || 0) - (activeObject.getScaledWidth() || 0)) / 2
    })
    canvas?.renderAll()
  }

  const handleAlignLeft = () => {
    const activeObject = canvas?.getActiveObject() as fabric.Image;
    activeObject.set({
      left: template?.left
    })
    canvas?.renderAll()
  }

  const handleAlignRight = () => {
    const activeObject = canvas?.getActiveObject() as fabric.Image;
    activeObject.set({
      left: (template?.left || 0) + (template?.width || 0) - (activeObject.getScaledWidth() || 0)
    })
    canvas?.renderAll()
  }

  const handleDeleteLayer = () => {
    const newLayers = layers?.filter(layer => layer?.id !== currentLayer?.id);
    setCurrentLayer?.()
    setLayers?.(newLayers)
    const currentObject = canvas?.getObjects()?.find(obj => obj.name === currentLayer?.id)
    if (currentObject) { canvas?.remove(currentObject) }
  }

  return (<div className="w-full flex flex-col gap-3">
    <div className="w-full flex justify-between bg-[#efefef] px-3 py-2 ">
      <div>Image Selection</div>
      <div className="flex gap-2" >
        <button onClick={handleFitToCanvas}>Fit to canvas</button>
        <button onClick={handleAlignTop}>Align top</button>
        <button onClick={handleItemCenter}>Align items center</button>
        <button onClick={handleAlignBottom}>Align bottom</button>
        <button onClick={handleAlignLeft}>Align Left</button>
        <button onClick={handleJustifyCenter}>Align justify center</button>
        <button onClick={handleAlignRight}>Align Right</button>
      </div>
    </div>
    {currentLayer?.type === "image" &&
      <ImageAction />
    }
    {currentLayer?.type === "text" &&
      <TextAction />
    }
    <OptionSetting />
    <div>
      <button onClick={handleDeleteLayer}>Delete</button>
    </div>
  </div>)
}

export default LayerAction
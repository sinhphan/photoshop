"use client"
import { useState } from "react";
import { responseData2 } from "@/data/data";
import './style.css'
import { useDesign } from "@/hook/useDesign";
import Layer from "./Layer";
import Upload from "./Upload";
import Text from "./Text";
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { DndContext, DragEndEvent, DragStartEvent, KeyboardSensor, MouseSensor, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableItem } from "./SortableItem";

export default function PhotoShop() {
  const { addRect, config, setConfig, currentTemplateInfo, layers, currentPrintArea, setLayers, canvas } = useDesign()
  const sensors = useSensors(
    useSensor(MouseSensor, {
      onActivation: (event) => {console.log("onActivation", event)}, // Here!
      activationConstraint: { distance: 5 },
  }),useSensor(TouchSensor, {
    onActivation: (event) => {console.log("onActivation", event)}, // Here!
    activationConstraint: { distance: 5 },
}))
  const data = responseData2
  const [img, setImg] = useState<string>()
  const availablePlacements = Object.entries(data.printFileData.available_placements)

  const handleUploadClick = () => {
    setConfig?.({ ...config, currentMenu: 'upload' })
  }

  const handleLayerClick = () => {
    setConfig?.({ ...config, currentMenu: 'layer' })

  }

  const handleTextClick = () => {
    setConfig?.({ ...config, currentMenu: 'text' })
    // const dataUrl = canvas?.toDataURL({
    //   format: 'jpeg',
    //   quality: 0.8
    // })
    // setImg(dataUrl)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    const oldIndex = layers.findIndex((layer) => layer.id === active?.id);
    const newIndex = layers.findIndex((layer) => layer.id === over?.id);
    if(newIndex > oldIndex){
      for(let i = oldIndex; i < newIndex; i++){
        layers[oldIndex]?.metadata?.object?.sendBackwards()
      }
    }else {
      for(let i = newIndex; i < oldIndex; i++){
        layers[oldIndex]?.metadata?.object?.bringForward()
      }
    }
    const newLayers = arrayMove<DESIGN.Layer>(layers, oldIndex, newIndex);

    setLayers?.(newLayers);
  }
  

  const handleDragOver = (event: DragStartEvent) => {
    const { active } = event;
    const startIndex = layers.findIndex((layer) => layer.id === active?.id);
    if (layers?.[startIndex]?.metadata?.object) {
      canvas?.setActiveObject(layers[startIndex]?.metadata?.object as fabric.Object)
    }
  }
  
  return <div className="design-main">
    <div className="design-container">
      <div className="design-sidebar" >
        <div className="design-sidebar-menu">
          <div className="design-sidebar-menu-item">
            <div
              className={`design-sidebar-menu-item-action ${config?.currentMenu === 'layer' ? "active" : ""}`}
              onClick={handleLayerClick}
            >
              <i className="fa-solid fa-layer-group"></i>
              <p>Layer</p>
            </div>
            <div style={{ marginTop: '8px', width: '100%', height: '1px' }}>
              <div className="design-divide"></div>
            </div>
            <div
              className={`design-sidebar-menu-item-action ${config?.currentMenu === 'upload' ? "active" : ""}`}
              onClick={handleUploadClick}
            >
              <i className="fa-solid fa-upload"></i>
              <p>Upload</p>
            </div>
            <div
              className={`design-sidebar-menu-item-action ${config?.currentMenu === 'text' ? "active" : ""}`}
              onClick={handleTextClick}
            >
              <i className="fa-solid fa-t"></i>
              <p>Text</p>
            </div>
          </div>
        </div>

        <div className="design-sidebar-content">
          {config?.currentMenu === 'layer' &&
            <DndContext
              onDragEnd={handleDragEnd}
              onDragStart={handleDragOver}
              sensors={sensors}
            >
              <SortableContext items={layers} >
                {layers?.map((layer) => {
                  return <SortableItem key={layer.id} id={layer.id} data-id={layer.id}>
                    <Layer layer={layer} />
                  </SortableItem>
                })}
              </SortableContext>
            </DndContext>
          }
          {config?.currentMenu === 'upload' && <Upload />}
          {config?.currentMenu === 'text' && <Text />}
        </div>
      </div>

      <div className="design-canvas">
        <div>
          <canvas id="canvas" />
        </div>
      </div>
      <div style={{ width: '100%' }}>
        <img src={img} alt="" />
      </div>
    </div>
  </div>

}

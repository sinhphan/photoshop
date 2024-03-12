import { useDesign } from "@/hook/useDesign";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

type TextProps = {};

const Text: FC<TextProps> = ({ }) => {
  const { layers, setLayers, canvas, currentTemplateInfo, config, currentPrintArea, addRect } = useDesign();
  const [id, setId] = useState('-1');
  const [textConfig, setTextConfig] = useState({
    color: 'white',
    background: "black",
  })
  const handleAdd = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    if (id === '-1') {
      const textCanvas = new fabric.Text(text, {
        fontSize: 30,
        left: (currentTemplateInfo?.print_area_left || 0) * config.zoom,
        top: (currentTemplateInfo?.print_area_top || 0) * config.zoom,
        fill: textConfig.color,
        textBackgroundColor: textConfig.background,
        clipPath: new fabric.Rect({
          absolutePositioned: true,
          width: (currentTemplateInfo?.print_area_width || 0) * config.zoom,
          height: (currentTemplateInfo?.print_area_height || 0) * config.zoom,
          left: (currentTemplateInfo?.print_area_left || 0) * config.zoom,
          top: (currentTemplateInfo?.print_area_top || 0) * config.zoom
        }),
      })
      setId(layers?.length?.toString());
      const newLayers: DESIGN.Layer[] = [...layers]
      newLayers?.unshift({
        id: layers?.length?.toString(),
        image: '',
        metadata: {
          object: textCanvas
        },
        title: text,
        type: "text",
      })
      setLayers?.(newLayers)

      textCanvas.on("selected", () => {
        currentPrintArea.visible = true
      })

      textCanvas.on("deselected", () => {
        currentPrintArea.visible = false
      })
      canvas?.add(textCanvas);
      canvas?.renderAll()
    } else {
      updateObject(text);
    }
  }

  const updateObject = (text?: string) => {
    const currentLayerIndex = layers?.findIndex(layer => layer.id === id);
    const currentLayer = layers?.[currentLayerIndex]
    const textObject = currentLayer?.metadata?.object as fabric.Text;
    if (!text) {
      textObject.set({
        fill: textConfig.color,
        textBackgroundColor: textConfig.background
      });
    }

    if (text) {
      textObject.set('text', text)
    }
    canvas?.renderAll();
    if (text) {
      const newLayers = [...layers]
      newLayers[currentLayerIndex] = { ...newLayers[currentLayerIndex], title: text }
      setLayers?.(newLayers);
    }
  }

  useEffect(() => {
    if (!currentPrintArea) {
      addRect?.({
        width: (currentTemplateInfo?.print_area_width || 0) * config?.zoom,
        height: (currentTemplateInfo?.print_area_height || 0) * config?.zoom,
        left: (currentTemplateInfo?.print_area_left || 0) * config?.zoom,
        top: (currentTemplateInfo?.print_area_top || 0) * config?.zoom
      })
    }
  }, [])

  useEffect(() => {
    if (id !== "-1") {
      updateObject()
    }
  }, [textConfig])

  return (
    <div className="design-sidebar-layer">
      <textarea
        style={{ width: '100%' }}
        placeholder="Input text"
        rows={5}
        onChange={handleAdd}
      />
      <div className="design-sidebar-layer-item">
        Text color: <input type="color" onChange={(e) => { setTextConfig({ ...textConfig, color: e.target.value }) }} />
      </div>
      <div className="design-sidebar-layer-item">
        Text background color: <input type="color" onChange={(e) => { setTextConfig({ ...textConfig, background: e.target.value }) }} />
      </div>
    </div>
  )
}

export default Text
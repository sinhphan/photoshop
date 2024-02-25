import { useDesign } from "@/hook/useDesign";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

type TextProps = {};

const Text: FC<TextProps> = ({ }) => {
  const { layers, setLayers, canvas, currentTemplateInfo, config, currentPrintArea, addRect } = useDesign();
  const [id, setId] = useState(-1);
  const [textConfig, setTextConfig] = useState({
    color: 'white',
    background: "black",
  })
  const handleAdd = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    if (id === -1) {
      const textCanvas = new fabric.Text(text, {
        fontSize: 30,
        left: (currentTemplateInfo?.print_area_left || 0) * config.ratio,
        top: (currentTemplateInfo?.print_area_top || 0) * config.ratio,
        fill: textConfig.color,
        textBackgroundColor: textConfig.background,
        clipPath: new fabric.Rect({
          absolutePositioned: true,
          width: (currentTemplateInfo?.print_area_width || 0) * config.ratio,
          height: (currentTemplateInfo?.print_area_height || 0) * config.ratio,
          left: (currentTemplateInfo?.print_area_left || 0) * config.ratio,
          top: (currentTemplateInfo?.print_area_top || 0) * config.ratio
        }),
      })
      setId(layers?.length);
      setLayers?.([...layers, {
        image: '',
        metadata: {
          object: textCanvas
        },
        title: text,
        type: "text",
      }])

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
    const currentLayer = layers[id];
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
      newLayers[id] = { ...newLayers[id], title: text }
      setLayers?.(newLayers);
    }
  }

  useEffect(() => {
    if (!currentPrintArea) {
      addRect?.({
        width: (currentTemplateInfo?.print_area_width || 0) * config?.ratio,
        height: (currentTemplateInfo?.print_area_height || 0) * config?.ratio,
        left: (currentTemplateInfo?.print_area_left || 0) * config?.ratio,
        top: (currentTemplateInfo?.print_area_top || 0) * config?.ratio
      })
    }
  }, [])

  useEffect(() => {
    if (id !== -1) {
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
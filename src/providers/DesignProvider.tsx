'use client'
import { responseData2 } from "@/data/data";
import { fabric } from 'fabric';
import { ReactElement, createContext, useEffect, useRef, useState } from "react";

export type DesignContextType = {
  layers: DESIGN.Layer[]
  config: DESIGN.Config
  setConfig?: (config: DESIGN.Config) => void
  setLayers?: (layers: DESIGN.Layer[]) => void
  currentTemplateInfo?: DESIGN.Template
  setCurrentTemplateInfo?: (e: DESIGN.Template) => void
  currentPrintArea?: any,
  canvas?: fabric.Canvas,
  addRect?: ({height, left, top, width}:{ left: number, top: number, width: number, height: number }) => void
}

export const DesignContext = createContext<DesignContextType>({
  config: {
    color: 'Black',
    placement: 'front',
    color_code: '#000000',
    zoom: 0.75,
    currentMenu: 'layer'
  },
  layers: [],
})

const DesignProvider = ({ children }: { children: ReactElement }) => {
  const [layers, setLayers] = useState<DESIGN.Layer[]>([])
  const [config, setConfig] = useState({
    color: 'Black',
    placement: 'front',
    color_code: '#000000',
    zoom: 0.75,
    currentMenu: 'layer'
  })
  const data = responseData2
  const templates = data.templateData.templates;
  const printFiles = data.printFileData.printfiles;
  const variantMapping = data.templateData.variant_mapping;
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const [currentTemplateInfo, setCurrentTemplateInfo] = useState<any>(null)
  const [currentPrintArea, setCurrentPrintArea] = useState<fabric.Rect>();

  const addRect = ({ width, height, left, top }: { width: number, height: number, left: number, top: number }) => {
    const rect = new fabric.Rect({
      left,
      height,
      width,
      top,
      stroke: "#2BEBC8",
      selectable: false,
      evented: false,
      strokeWidth: 2,
      fill: 'rgba(0, 0, 0, 0)',
      strokeDashArray: [5, 5]
    });
    rect.visible = false
    canvas?.add(rect);
    setCurrentPrintArea(rect)
  };


  useEffect(() => {
    const currentVariant = variantMapping?.find(v => v.color === config.color)
    const currentTemplate = currentVariant?.templates?.find(t => t.placement === config.placement)
    const templateInfo = templates?.find(t => t.template_id === currentTemplate?.template_id);
    setCurrentTemplateInfo(templateInfo);
    const currentRatio = 750 / (templateInfo?.template_width || 750);
    setConfig({ ...config, zoom: currentRatio })
    const c = new fabric.Canvas("canvas", {
      height: (templateInfo?.template_height || 1000) * currentRatio,
      width: (templateInfo?.template_width || 1000) * currentRatio,
      backgroundColor: config?.color_code,
      
    });

    // settings for all canvas in the app
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = "#2BEBC8";
    fabric.Object.prototype.cornerStyle = "rect";
    fabric.Object.prototype.cornerStrokeColor = "#2BEBC8";
    fabric.Object.prototype.cornerSize = 6;

    fabric.Image.fromURL(templateInfo?.image_url || '', function (img) {
      img.scale(0.75)
      // Adjust the image properties as needed
      img.set({
        selectable: false, // Make the image not selectable
        evented: false, // Make the image not trigger events
      });
      c.add(img); // Add the image to the canvas
    });

    setCanvas(c);
    return () => {
      c.dispose();
    };
  }, [config.color, config.color_code])

  return (
    <DesignContext.Provider value={{ layers: layers, setLayers, config, setConfig, currentTemplateInfo, setCurrentTemplateInfo, currentPrintArea , canvas, addRect}}>
      {children}
    </DesignContext.Provider>
  )
}
export default DesignProvider
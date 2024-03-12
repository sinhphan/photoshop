import { responseData2 } from "@/data/data";
import { fabric } from 'fabric';
import { ReactElement, createContext, useEffect, useRef, useState } from "react";
import { WHToPx } from "./convert";

export type Design1ContextType = {
  layers: DESIGN.Layer[]
  config: DESIGN.Config
  setConfig?: (config: DESIGN.Config) => void
  setLayers?: (layers: any) => void
  canvas?: fabric.Canvas,
  setTemplate?: (mm: number, ppt: number) => void
}

export const Design1Context = createContext<Design1ContextType>({
  config: {
    color: 'Black',
    placement: 'front',
    color_code: '#000000',
    zoom: 0,
    currentMenu: 'layer'
  },
  layers: [],
})

const Design1Provider = ({ children }: { children: ReactElement }) => {
  const [layers, setLayers] = useState<DESIGN.Layer[]>([
    { id: '0', image: "", metadata: {}, title: "print Area", type: "react" },
    { id: '1', image: "", metadata: {}, title: "print Area", type: "react" },
  ])
  const [config, setConfig] = useState({
    color: 'Black',
    placement: 'front',
    color_code: '#000000',
    zoom: 0,
    currentMenu: 'layer'
  })

  const [canvas, setCanvas] = useState<fabric.Canvas>()

  const addTemplate = (width: number, height: number, type = 'mm', ppt = 300) => {
    if (window) {
      const container = window.document.getElementById("container-c");
      const canvasH = (container?.offsetHeight || 30) - 30;
      const canvasW = (container?.offsetWidth || 30) - 30
      const templateW = WHToPx(width, type, ppt);
      const templateH = WHToPx(height, type, ppt);
      const zoom = (canvasW / templateW > canvasH / templateH) ? canvasH / templateH : canvasW / templateW

      const c = new fabric.Canvas("canvas", {
        height: canvasH,
        width: canvasW,
        backgroundColor: '#fff',
      });
      var rect = new fabric.Rect({
        top: (canvasH - templateH) / 2,
        left: (canvasW - templateW) / 2,
        width: templateW,
        height: templateH,
      });
      var rect1 = new fabric.Rect({
        top: (canvasH - templateH) / 2,
        left: (canvasW - templateW) / 2,
        width: templateW,
        height: templateH,
      });
      c.zoomToPoint({ x: canvasW / 2, y: canvasH / 2 }, zoom);
      c.clipPath = rect;
      c.add(rect1);
      c.on('mouse:wheel', function (opt) {
        var delta = opt.e.deltaY;
        var zoom = c.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        c.zoomToPoint({ x: canvasW / 2, y: canvasH / 2 }, zoom);
        setConfig({ ...config, zoom: zoom })
        opt.e.preventDefault();
        opt.e.stopPropagation();
      });
      setConfig({ ...config, zoom: zoom })
      setCanvas(c)
    }
  }

  useEffect(() => {
    addTemplate(100, 50)
  }, [])
  return (
    <Design1Context.Provider value={{ layers: layers, setLayers, config, setConfig, canvas }}>
      {children}
    </Design1Context.Provider>
  )
}
export default Design1Provider
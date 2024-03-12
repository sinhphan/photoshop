import { fabric } from 'fabric';
import { ReactElement, createContext, useEffect, useRef, useState } from "react";
import { WHToPx } from "./convert";

export type TemplateType = {
  width: number;
  height: number;
  top: number;
  left: number;
}

export type Histories = {
  current: number;
  data: any[];
  undo?: () => void;
  redo?: () => void;
}

export type Design1ContextType = {
  layers: DESIGN.Layer[]
  currentLayer?: DESIGN.Layer
  setCurrentLayer?: (e?: DESIGN.Layer) => void
  config: DESIGN.Config
  setConfig?: (config: DESIGN.Config) => void
  setLayers?: (layers: any) => void
  canvas?: fabric.Canvas,
  setCanvas?: (canvas: fabric.Canvas) => void
  template?: TemplateType;
  setTemplate?: (e: TemplateType) => void
  createRootCanvas?: (mm: number, ppt: number) => void
  histories?: Histories;
  addImageLayer?: (url?: string, c?: any, currentTemplate?: any) => void
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
  const [layers, setLayers] = useState<DESIGN.Layer[]>([])
  console.log("🚀 => Design1Provider => layers:", layers)
  const [template, setTemplate] = useState<TemplateType>()
  const [currentLayer, setCurrentLayer] = useState<DESIGN.Layer>()
  const [histories, setHistories] = useState<Histories>({ current: 0, data: [] })
  const [config, setConfig] = useState({
    color: 'Black',
    placement: 'front',
    color_code: '#000000',
    zoom: 0,
    currentMenu: 'layer'
  })

  const [canvas, setCanvas] = useState<fabric.Canvas>()
  const loadState = (json: any) => {
    canvas?.loadFromJSON(json, function () {
      canvas.getObjects()?.forEach((obj, i) => {
        obj.name = i.toString()
      })
      canvas?.renderAll();
      setCanvas(canvas);
    });
  }
  const undo = () => {
    if (histories.current > 0) {
      const current = histories.current - 1;
      loadState(histories?.data[current]);
      setHistories({ ...histories, current })
    }
  }

  const redo = () => {
    if (histories.current < histories.data.length - 1) {
      const current = histories.current + 1;
      loadState(histories?.data[current]);
      setHistories({ ...histories, current })
    }
  }

  const addImageLayer = (url = "/instagram2.webp", c = canvas, currentTemplate = template) => {
    const newLayer: DESIGN.Layer = {
      id: layers?.length?.toString() || '0' ,
      image: url,
      title: "Print area",
      metadata: {},
      type: 'image',
      top: currentTemplate?.top,
      left: currentTemplate?.left,
    }
    fabric.Image.fromURL(url, (res) => {
      const image = res.set({ name: "0", top: newLayer.top, left: newLayer.left });
      newLayer.objectId = image.name
      setLayers([...layers, newLayer])
      c?.add(image);
      c?.renderAll()
      const newHistories = { ...histories }
      newHistories.data.push(c?.toJSON());
      setHistories(newHistories)
    })
  }

  const createRootCanvas = (width: number, height: number, type = 'mm', ppt = 300) => {
    if (window) {
      canvas?.clear()
      const container = window.document.getElementById("container-c");
      const canvasH = (container?.offsetHeight || 30) - 30;
      const canvasW = (container?.offsetWidth || 30) - 30
      const templateW = WHToPx(width, type, ppt);
      const templateH = WHToPx(height, type, ppt);
      const templateTop = (canvasH - templateH) / 2;
      const templateLeft = (canvasW - templateW) / 2;
      const zoom = (canvasW / templateW > canvasH / templateH) ? canvasH / templateH : canvasW / templateW

      const c = new fabric.Canvas("canvas", {
        height: canvasH,
        width: canvasW,
        backgroundColor: '#fff',
      });
      var rect = new fabric.Rect({
        top: templateTop,
        left: templateLeft,
        width: templateW,
        height: templateH,
      });
      c.zoomToPoint({ x: canvasW / 2, y: canvasH / 2 }, zoom);
      c.clipPath = rect;
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
      const newTemplate = { width: templateW, height: templateH, top: templateTop, left: templateLeft }
      addImageLayer("/instagram2.webp", c, newTemplate)

      setConfig({ ...config, zoom: zoom })
      setCanvas(c)
      setTemplate(newTemplate)
    }
  }

  useEffect(() => {
    createRootCanvas(100, 50)
  }, [])

  useEffect(() => {
    canvas?.on('object:modified', () => {
      setCanvas(canvas);
      const newHistories = { ...histories }
      newHistories.data = newHistories?.data?.slice(0, histories.current + 1)
      if (histories?.data?.length < 10) {
        newHistories.current = newHistories.data.length;
        newHistories.data.push(canvas?.toJSON());
        setHistories(newHistories);
      } else {
        newHistories?.data?.shift();
        newHistories.data?.push(canvas?.toJSON());
        setHistories(newHistories);
      }
    })
  }, [histories])

  useEffect(() => {
    canvas?.on('selection:created', (e) => {
      const selected = e.selected?.[0]
      console.log("🚀 => canvas?.on => selected:", selected)
      const layer = layers?.find(l => l?.objectId === selected?.name)
      setCurrentLayer(layer)
    })
  }, [layers])

  useEffect(() => {
    canvas?.on('selection:cleared', (e) => {
      const deselected = e.deselected?.[0]
      if (currentLayer?.objectId === deselected?.name) {
        setCurrentLayer?.(undefined);
      }
    })
  }, [currentLayer])

  useEffect(() => {
    canvas?.on('selection:updated', (e) => {
      const selected = e.selected?.[0]
      const layer = layers?.find(l => l?.objectId === selected?.name)
      setCurrentLayer(layer)
    })
  }, [layers])
  return (
    <Design1Context.Provider value={{
      layers: layers, setLayers, config, setConfig, canvas, setCanvas,
      currentLayer, setCurrentLayer, createRootCanvas, histories: { ...histories, undo, redo },
      template,
      addImageLayer
    }}>
      {children}
    </Design1Context.Provider>
  )
}
export default Design1Provider
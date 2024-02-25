"use client"
import { useEffect, useRef, useState } from "react";
import { fabric } from 'fabric';
import { responseData, responseData2 } from "@/data/data";
import { useDesign } from "@/hook/useDesign";

export default function Home() {
  const data = responseData2
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const templates = data.templateData.templates;
  const printFiles = data.printFileData.printfiles;
  const variantMapping = data.templateData.variant_mapping;
  const [file, setFile] = useState<FileList | null>(null)
  const [url, setUrl] = useState<string | null>(null)
  const currentImage = useRef<any>(null)
  const currentPrintArea = useRef<any>(null)
  const [currentTemplateInfo, setCurrentTemplateInfo] = useState<any>(null)
  const [ ratio, setRatio] = useState(0.75)

  const availablePlacements = Object.entries(data.printFileData.available_placements)
  const [config, setConfig] = useState({
    color: 'Black',
    placement: 'front',
    color_code: '#000000',
  })
  useEffect(() => {
    const currentVariant = variantMapping?.find(v => v.color === config.color)
    const currentTemplate = currentVariant?.templates?.find(t => t.placement === config.placement)
    const templateInfo = templates?.find(t => t.template_id === currentTemplate?.template_id);
    setCurrentTemplateInfo(templateInfo);
    const currentRatio = 750/(templateInfo?.template_width || 750);
    setRatio(currentRatio)
    const c = new fabric.Canvas("canvas", {
      height: (templateInfo?.template_height || 1000) * currentRatio,
      width: (templateInfo?.template_width || 1000) * currentRatio,
      backgroundColor: config.color_code,
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
}, [config]);

useEffect(() => {
  canvas?.remove(currentImage.current);
  fabric.Image.fromURL(url || '', (img) => {
    img.scale(ratio);
    img.set({
      left: currentTemplateInfo?.print_area_left * ratio,
      top: currentTemplateInfo?.print_area_top * ratio,
      clipPath: new fabric.Rect({
        absolutePositioned: true,
        width: (currentTemplateInfo?.print_area_width || 0) * ratio, 
        height: (currentTemplateInfo?.print_area_height || 0) * ratio, 
        left: (currentTemplateInfo?.print_area_left || 0) * ratio,
        top: (currentTemplateInfo?.print_area_top || 0) * ratio
      }),
    })

    addRect({
      canvas: canvas,
      width: (currentTemplateInfo?.print_area_width || 0) * ratio, 
      height: (currentTemplateInfo?.print_area_height || 0) * ratio, 
      left: (currentTemplateInfo?.print_area_left || 0) * ratio,
      top: (currentTemplateInfo?.print_area_top || 0) * ratio
    })
    
    img.on("selected",()=>{
      currentPrintArea.current.visible = true
    })

    img.on("deselected",()=>{
      currentPrintArea.current.visible = false
    })
    canvas?.add(img)
    canvas?.requestRenderAll()
    currentImage.current = img;
  })
}, [url])

const addRect = ({ canvas, width, height, left, top }: { canvas?: fabric.Canvas, width: number, height: number, left: number, top: number }) => {
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
  });
  rect.visible = false
  canvas?.add(rect);
  canvas?.requestRenderAll();
  currentPrintArea.current = rect
  return rect
};

return <div className="w-full h-screen grid grid-cols-2 gap-2" >
  <div className="flex items-center justify-center bg-black">
    <div>
      <canvas id="canvas" />
    </div>
  </div>
  <div >
    <div className="w-full flex items-start justify-start flex-wrap py-3 gap-2">
      <div className="w-full flex gap-2 items-center">
        <p>Options: </p>
        {
          availablePlacements.map(place => {
            return <button className="border rounded-md p-2 px-3" onClick={() => {
              console.log(place[0])
              setConfig({ ...config, placement: place[0] })
            }} key={place[0]}>{place[1]}</button>
          })
        }
      </div>
      <div className="w-full flex gap-2 items-center">
        <p>Colors: </p>
        {
          variantMapping.map(variant => {
            return <button className="border rounded-md p-2 px-3" onClick={() => {
              console.log(variant.color)
              setConfig({ ...config, color: variant.color, color_code: variant?.color_code || '' })
            }}>{variant.color}</button>
          })
        }
      </div>
      <div className="w-full flex gap-2 items-center">
        <input type="file" onChange={(e) => {
          setFile(e.currentTarget.files)
          if (e?.currentTarget?.files?.[0]) { setUrl(URL.createObjectURL(e.currentTarget.files[0])) }
        }} />

      </div>
      <div className="w-full flex gap-2 items-center">
        <p>Upload Images: </p>
        {!!file && <img className="w-100 h-100" src={url || ''} />}
      </div>
    </div>
  </div>
</div>;
}

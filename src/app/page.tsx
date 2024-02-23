"use client"
import { useEffect, useRef, useState } from "react";
import { fabric } from 'fabric';
import { responseOne } from "@/data/data";

export default function Home() {
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const options = responseOne.data.printFileData.options;
  const variant_mapping = responseOne.data.templateData.variant_mapping;
  const templates = responseOne.data.templateData.templates;
  const [config, setConfig] = useState({
    color: 'Black',
    placement: "Front"
  })



  useEffect(() => {
    console.log("🚀 => useEffect => config:", config)
    const currentVariant = variant_mapping.find(variant => variant.color === config.color);
    console.log("🚀 => useEffect => currentVariant:", currentVariant)
    const currentTemplate = currentVariant?.templates.find(template => template.placement.toLocaleLowerCase() === config.placement.toLocaleLowerCase());
    console.log("🚀 => useEffect => currentTemplate:", currentTemplate)
    const currentTemplateInfo = templates?.find(template => template.template_id === currentTemplate?.template_id);
    console.log("🚀 => useEffect => currentTemplateInfo:", currentTemplateInfo)
    const c = new fabric.Canvas("canvas", {
      height: currentTemplateInfo?.template_height,
      width: currentTemplateInfo?.template_width,
      backgroundColor: "white",
    });

    // settings for all canvas in the app
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = "#2BEBC8";
    fabric.Object.prototype.cornerStyle = "rect";
    fabric.Object.prototype.cornerStrokeColor = "#2BEBC8";
    fabric.Object.prototype.cornerSize = 6;

    fabric.Image.fromURL(currentTemplateInfo?.image_url || '', function (img) {
      c.clear()
      if(c?.width && c?.height && img?.width && img?.height){
        c.setBackgroundImage(img, c.renderAll.bind(c), {
          // Adjust options as needed
          scaleX: 1,
          scaleY: 1
        });
      }
    });

    setCanvas(c);

    return () => {
      c.dispose();
    };
  }, [config]);

  return <div className="w-full h-screen grid grid-cols-4 gap-4" >
    <div className="h-screen w-full flex items-center col-span-3 justify-center border bg-black">
      <canvas id="canvas" />
    </div>
    <div className="py-4 flex flex-wrap gap-2 items-start justify-start">
      <div className="w-full flex flex-wrap gap-2 items-center">
        <p>Options: </p>
        {
          options.map(option => {
            return <button
              key={option}
              onClick={() => setConfig({ ...config, placement: option })}
              className="border bg-black text-white py-1 px-3 rounded">
              {option}
            </button>
          })
        }
      </div>

      <div className="w-full flex flex-wrap gap-2 items-center">
        <p>Color: </p>
        {
          variant_mapping.map(variant => {
            return <button
              key={variant.variant_id}
              onClick={() => setConfig({ ...config, color: variant.color })}
              className="border bg-black text-white py-1 px-3 rounded">
              {variant.color}
            </button>
          })
        }
      </div>
    </div>
  </div>;
}

"use client"
import React, { useEffect, useRef, useState } from "react";
import { fabric } from 'fabric';
import { responseData } from "@/data/data";
import { Group, Image, Layer, Rect, Stage, Transformer } from "react-konva";
import Cropper from "cropperjs";

const addRatio = (data?: number) => {
  return (data || 0) * 0.75
}

export default function Konva() {
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const templates = responseData.templateData.templates;
  const printFiles = responseData.printFileData.printfiles;
  const variantMapping = responseData.templateData.variant_mapping;
  const [file, setFile] = useState<FileList | null>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [image, setImage] = useState<HTMLImageElement>();
  const [customImage, setCustomImage] = useState<HTMLImageElement>();
  const currentPrintArea = useRef<any>(null)
  const [currentTemplateInfo, setCurrentTemplateInfo] = useState<any>()

  const transformerRef = useRef<any>();
  const imageRef = useRef<any>();
  const cropImgRef = useRef<any>();
  console.log("🚀 => Konva => imageRef:", imageRef)
  console.log("🚀 => Home => file:", file)

  const availablePlacements = Object.entries(responseData.printFileData.available_placements)
  const [config, setConfig] = useState({
    color: 'Black',
    placement: 'front'
  })
  useEffect(() => {
    const currentVariant = variantMapping?.find(v => v.color === config.color)
    console.log("🚀 => useEffect => currentVariant:", currentVariant)
    const currentTemplate = currentVariant?.templates?.find(t => t.placement === config.placement)
    console.log("🚀 => useEffect => currentTemplate:", currentTemplate)
    const templateInfo = templates?.find(t => t.template_id === currentTemplate?.template_id);
    console.log("🚀 => useEffect => templateInfo:", templateInfo)
    setCurrentTemplateInfo(templateInfo);
    const img = new window.Image();
    img.src = templateInfo?.image_url || '';
    img.onload = () => {
      setImage(img);
    };
  }, [config]);

  useEffect(() => {
    const img = new window.Image();
    img.src = url || '';
    img.onload = () => {
      setCustomImage(img);
    };
  }, [url])

  const handleSelect = (e: any) => {
    transformerRef.current.nodes([imageRef.current]);
  };

  const handleCrop = () => {
    const cropper = new Cropper(cropImgRef.current, {
      aspectRatio: 16 / 9, // Set your desired aspect ratio
      dragMode: 'move', // Set the drag mode (e.g., 'move', 'crop', etc.)
      // Other Cropper.js options...
    });

    // Get the cropped canvas
    const croppedCanvas = cropper.getCroppedCanvas();
    // Convert to data URL or use as needed
    document.body.appendChild(croppedCanvas)
    const croppedImageDataURL = croppedCanvas.toDataURL('image/png');
    setUrl(croppedImageDataURL)
    // Display the cropped image or save it
    // ...
  };

  return <div className="w-full h-screen grid grid-cols-2 gap-2" >
    <div className="flex items-center justify-center bg-black">
      <Stage width={addRatio(currentTemplateInfo?.template_width)} height={addRatio(currentTemplateInfo?.template_height)} >
        <Layer>
          <Image
            image={image}
            scale={{ x: 0.75, y: 0.75 }}
            draggable={false}
          />
          <Group
            x={addRatio(currentTemplateInfo?.print_area_left)}
            y={addRatio(currentTemplateInfo?.print_area_top)}
            clipFunc={function (ctx) {
              ctx.rect(0, 0, addRatio(currentTemplateInfo?.print_area_width), addRatio(currentTemplateInfo?.print_area_height));
            }}
          >
            {/* <Rect
              width={addRatio(currentTemplateInfo?.print_area_width)}
              height={addRatio(currentTemplateInfo?.print_area_height)}
              fill="transparent" // Set fill to transparent
              stroke="blue" // Set stroke color
              strokeWidth={1} // Set stroke width
            /> */}
            {!!url &&
              <>
                <Image
                  ref={imageRef}
                  image={customImage}
                  scale={{ x: 0.75, y: 0.75 }}
                  draggable
                  onClick={handleSelect}
                />
                <Transformer ref={transformerRef} />
              </>}
          </Group>
        </Layer>
      </Stage>
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
                setConfig({ ...config, color: variant.color })
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
          {!!file && <img ref={cropImgRef} className="w-100 h-100" src={url || ''} />}
        </div>
        <div className="w-full flex gap-2 items-center">
          <button className="border rounded-md p-2 px-3" onClick={() => {
            handleCrop()
          }}>crop</button>
        </div>
      </div>
    </div>
  </div>;
}

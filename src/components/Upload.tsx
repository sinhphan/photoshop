import { useDesign } from "@/hook/useDesign";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { fabric } from 'fabric';

type UploadProps = {};

const Upload: FC<UploadProps> = ({ }) => {
  const { layers, setLayers, setConfig, config, canvas, currentTemplateInfo, currentPrintArea, addRect } = useDesign();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    var _URL = window.URL || window.webkitURL;
    if (files?.length) {
      const imageUrl = _URL.createObjectURL(files?.[0])
      fabric.Image.fromURL(imageUrl || '', (img) => {
        img.scale(config.ratio);
        img.set({
          left: (currentTemplateInfo?.print_area_left || 0) * config.ratio,
          top: (currentTemplateInfo?.print_area_top || 0) * config.ratio,
          clipPath: new fabric.Rect({
            absolutePositioned: true,
            width: (currentTemplateInfo?.print_area_width || 0) * config.ratio,
            height: (currentTemplateInfo?.print_area_height || 0) * config.ratio,
            left: (currentTemplateInfo?.print_area_left || 0) * config.ratio,
            top: (currentTemplateInfo?.print_area_top || 0) * config.ratio
          }),
        })

        img.on("selected", () => {
          currentPrintArea.visible = true
        })

        img.on("deselected", () => {
          currentPrintArea.visible = false
        })


        canvas?.add(img)
        canvas?.requestRenderAll()

        const newLayers: DESIGN.Layer[] = [...layers, {
          image: imageUrl,
          title: files[0]?.name,
          type: 'File',
          metadata: {
            file: files[0],
            object: img
          }
        }]

        setLayers?.(newLayers);
        setConfig?.({ ...config, currentMenu: 'layer' });
      })
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

  return (<div className="design-sidebar-layer">
    <div style={{ maxWidth: 300 }}>
      <input type="file" onChange={handleChange} style={{ flexGrow: 1 }} />
    </div>
  </div>)
}

export default Upload
"use client"
import { useEffect, useState } from "react";
import { responseData2 } from "@/data/data";
import './style.css'
import { useDesign } from "@/hook/useDesign";
import Layer from "./Layer";
import Upload from "./Upload";
import Text from "./Text";

export default function PhotoShop() {
  const { addRect, config, setConfig, currentTemplateInfo, layers, currentPrintArea } = useDesign()
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
          {config?.currentMenu === 'layer' && layers?.map((layer, i) => {
            return <Layer layer={layer} key={layer?.title + i} />
          })}

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

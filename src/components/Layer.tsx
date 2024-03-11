import { useDesign } from "@/hook/useDesign";
import { FC } from "react";

type Layer = {
  layer: DESIGN.Layer
};

const Layer: FC<Layer> = ({ layer }) => {

  return (<div className="design-sidebar-layer">
    <div className="design-sidebar-left">
      <div className="design-sidebar-left-image">
        <img src={layer.image} alt="" />
      </div>
    </div>
    <div className="design-sidebar-center">
      <div>
        <span className="design-sidebar-center-type">{layer?.type}</span>
      </div>
      <p className="design-sidebar-center-title">
        {layer?.title}
      </p>
      {/* <p className="design-sidebar-center-description">
        <span >Width: </span> {layer?.width}
        <span >Height: </span> {layer?.height}
      </p> */}
    </div>
    <div className="design-sidebar-right">
      <button className="layer-menu-btn" onClick={()=>{ console.log('click') }}>
        <i className="fa-solid fa-trash"></i>
      </button>
    </div>
  </div>)
}

export default Layer
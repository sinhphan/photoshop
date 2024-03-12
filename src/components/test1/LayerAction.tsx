import { ChangeEvent, FC, useRef } from "react";
import { useDesign1 } from "./useDesign";
import { fabric } from "fabric"
import ImageSelection from "./ImageSelection";

type LayerActionProps = {};

const LayerAction: FC<LayerActionProps> = ({ }) => {
  const { currentLayer } = useDesign1()


  return (<>
    { currentLayer?.type === "image" && <ImageSelection />}
  </>)
}

export default LayerAction
"use client"
import { FC } from "react";
import { useDesign1 } from "./useDesign";
import Layers from "./Layers";
import LayerAction from "./LayerAction";

type CreateCustomProductBaseProps = {
  open: boolean,
  onOpenChange: (data: boolean) => void
};

const CreateCustomProductBase: FC<CreateCustomProductBaseProps> = ({ open, onOpenChange }) => {
  const { canvas, config, currentLayer } = useDesign1()

  return (
    <div className="w-full grid grid-cols-2 gap-4 h-screen">
      <div className="w-full h-full flex justify-center items-center bg-fuchsia-300 overflow-auto relative" id="container-c">
        <canvas id="canvas" className="overflow-auto"></canvas>
        <div className="absolute border p-3 bottom-5 right-5 w-[80px] text-center bg-white font-bold">{(config.zoom * 100).toFixed(0)} %</div>
      </div>

      <div className="w-full p-5 flex gap-5 flex-col items-start ">
        <Layers />
        {!!currentLayer && <LayerAction />}
      </div>
    </div>)
}

export default CreateCustomProductBase
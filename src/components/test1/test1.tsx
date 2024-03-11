"use client" 
import { FC } from "react";
import { useDesign1 } from "./useDesign";

type CreateCustomProductBaseProps = {
  open: boolean,
  onOpenChange: (data: boolean) => void
};

const CreateCustomProductBase: FC<CreateCustomProductBaseProps> = ({ open, onOpenChange }) => {
  const {canvas} = useDesign1()
 
  return (
    <div className="w-full grid grid-cols-2 gap-4 h-screen ">
      <div className="w-full h-full flex justify-center items-center bg-fuchsia-300 overflow-auto" id="container-c">
        <canvas id="canvas" className="overflow-auto"></canvas>
      </div>

      <div>
        <button onClick={()=>{}}>resize</button>
      </div>
    </div>)
}

export default CreateCustomProductBase
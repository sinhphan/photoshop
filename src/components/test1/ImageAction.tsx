import { ChangeEvent, FC, useRef } from "react";
import { useDesign1 } from "./useDesign";

type ImageActionProps = {};

const ImageAction: FC<ImageActionProps> = ({ }) => {
  const { canvas } = useDesign1()

  const inputRef = useRef<HTMLInputElement>(null)
  const handleUploadClick = () => {
    inputRef.current?.click();
  }

  const handleChangeInputFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0]
    var _URL = window.URL || window.webkitURL;
    if (file) {
      const imageUrl = _URL.createObjectURL(file);
      const activeObject = canvas?.getActiveObject() as fabric.Image;
      activeObject.setSrc(imageUrl, () => { canvas?.renderAll() })
    }
  }
  return (<div>
    <button className="border p-2" onClick={handleUploadClick}> Upload Image</button>
    <input ref={inputRef} type="file" name="file" id="image" placeholder="Upload Image" hidden onChange={handleChangeInputFile} accept="image/*" />
  </div>)
}

export default ImageAction 
import React, { useRef } from "react";
import CanvasDraw from "react-canvas-draw";
import img from "./test.jpeg";

const Test = () => {
  const save = () => {
    const url = aaa.current.getDataURL();
    const result = base64toFile(url);
    console.log("aaa", result);
  };
  const base64toFile = (dataurl, filename = "file") => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const suffix = mime.split("/")[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], `${filename}.${suffix}`, {
      type: mime,
    });
  };
  const aaa = useRef(null);
  return (
    <div style={{ backgroundColor: "#ccc" }}>
      <CanvasDraw
        ref={aaa}
        canvasWidth={800}
        canvasHeight={800}
        brushRadius={2}
        brushColor="red"
        catenaryColor="red"
        hideGrid={true}
        enablePanAndZoom={true}
        imgSrc={img}
      />
      <div onClick={save}>保存</div>
    </div>
  );
};

export default Test;

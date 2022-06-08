import React, { useRef } from "react";
import Draw from "../draw";

const Index = () => {
  const drawRef = useRef();
  const src = "./test.jpeg";
  const save = () => {
    // console.log("drawref", drawRef);
    const r = drawRef.current.getFile();
    console.log("r", r);
  };
  return (
    <>
      <Draw
        width={400}
        height={400}
        color="red"
        brushRadius={2}
        imgSrc={src}
        type="square"
        ref={drawRef}
        fileName="111"
      />
      <div onClick={save}>保存</div>
    </>
  );
};

export default Index;

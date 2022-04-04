import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import "./index.css";

const Draw = (
  { width, height, brushRadius, color, imgSrc, type, fileName },
  ref
) => {
  const canvasElem = useRef();
  const hiddenElem = useRef();
  let writingCtx;
  let hiddenCtx;
  let isDrawingShape = false;
  let coordinateScaleX;
  let coordinateScaleY;
  let mouseDownX;
  let mouseDownY;

  const drawRect = (e) => {
    const { offsetX, offsetY } = e;
    const positionX = mouseDownX / coordinateScaleX;
    const positionY = mouseDownY / coordinateScaleY;
    const dataX = (offsetX - mouseDownX) / coordinateScaleX;
    const dataY = (offsetY - mouseDownY) / coordinateScaleY;
    writingCtx.clearRect(0, 0, width, height);
    writingCtx.beginPath();
    writingCtx.strokeRect(positionX, positionY, dataX, dataY);
  };

  const drawCircle = (e) => {
    const { offsetX, offsetY } = e;
    const rx = (offsetX - mouseDownX) / 2;
    const ry = (offsetY - mouseDownY) / 2;
    const radius = Math.sqrt(rx * rx + ry * ry);
    const centreX = rx + mouseDownX;
    const centreY = ry + mouseDownY;
    writingCtx.clearRect(0, 0, width, height);
    writingCtx.beginPath();
    writingCtx.arc(
      centreX / coordinateScaleX,
      centreY / coordinateScaleY,
      radius,
      0,
      Math.PI * 2
    );
    writingCtx.stroke();
  };

  const drawEllipse = (e) => {
    const { offsetX, offsetY } = e;
    const radiusX = Math.abs(offsetX - mouseDownX) / 2;
    const radiusY = Math.abs(offsetY - mouseDownY) / 2;
    const centreX =
      offsetX >= mouseDownX ? radiusX + mouseDownX : radiusX + offsetX;
    const centreY =
      offsetY >= mouseDownY ? radiusY + mouseDownY : radiusY + offsetY;
    const positionX = centreX / coordinateScaleX;
    const positionY = centreY / coordinateScaleY;
    const dataX = radiusX / coordinateScaleX;
    const dataY = radiusY / coordinateScaleY;
    writingCtx.clearRect(0, 0, width, height);
    writingCtx.beginPath();
    writingCtx.ellipse(positionX, positionY, dataX, dataY, 0, 0, Math.PI * 2);
    writingCtx.stroke();
  };

  const handleMouseDown = (e) => {
    isDrawingShape = true;
    if (canvasElem.current !== undefined) {
      coordinateScaleX = canvasElem.current.clientWidth / width;
      coordinateScaleY = canvasElem.current.clientHeight / height;
    }
    writingCtx.lineWidth = brushRadius / coordinateScaleX;
    writingCtx.strokeStyle = color;
    const { offsetX, offsetY } = e;
    mouseDownX = offsetX;
    mouseDownY = offsetY;
  };

  const handleMouseMove = (e) => {
    if (isDrawingShape) {
      switch (type) {
        case "square":
          drawRect(e);
          break;
        case "circle":
          drawCircle(e);
          break;
        case "ellipse":
          drawEllipse(e);
          break;
        default:
          console.log("no type");
      }
    }
  };

  const handleMouseUp = () => {
    isDrawingShape = false;
    writingCtx.save();
  };

  const base64toFile = (dataurl) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const suffix = mime.split("/")[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], `${fileName}.${suffix}`, {
      type: mime,
    });
  };

  useImperativeHandle(ref, () => ({
    getFile() {
      hiddenCtx.drawImage(canvasElem.current, 0, 0);
      const result = base64toFile(hiddenElem.current.toDataURL());
      return result;
    },
    getDataURL() {
      hiddenCtx.drawImage(canvasElem.current, 0, 0);
      const result = hiddenElem.current.toDataURL();
      return result;
    },
  }));

  useEffect(() => {
    writingCtx = canvasElem.current.getContext("2d");
    hiddenCtx = hiddenElem.current.getContext("2d");
    const img = new Image();
    img.src = imgSrc;
    img.crossOrigin = "anonymous";
    img.onload = function () {
      img.width = width;
      img.height = height;
      hiddenCtx.drawImage(img, 0, 0, width, height);
    };

    if (canvasElem.current) {
      canvasElem.current.addEventListener("mousedown", handleMouseDown);
      canvasElem.current.addEventListener("mousemove", handleMouseMove);
      canvasElem.current.addEventListener("mouseup", handleMouseUp);
    }
  }, []);

  return (
    <>
      <canvas width={width} height={height} className="draw" ref={canvasElem} />
      <canvas
        width={width}
        height={height}
        style={{ display: "none" }}
        ref={hiddenElem}
      />
    </>
  );
};

export default forwardRef(Draw);

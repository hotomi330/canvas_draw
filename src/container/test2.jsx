import React, { Component } from "react";
import "./index.css";

class DrawShape extends Component {
  state = {};

  componentDidMount() {
    const { canvasElem, hiddenElem } = this;
    this.writingCtx = canvasElem.getContext("2d");
    this.hiddenCtx = hiddenElem.getContext("2d");

    const img = new Image();
    const _this = this;

    img.src =
      "http://ow-prod.oss-cn-beijing.aliyuncs.com/platform_id_957/app_id_975/roled_user_id_46526/type_0/6960de0aeaea427abcc62e4c348a1b2c.jpeg";
    img.crossOrigin = "anonymous";
    img.onload = function () {
      img.width = 300;
      img.height = 300;
      _this.hiddenCtx.drawImage(img, 0, 0, 300, 300);
    };

    if (canvasElem) {
      canvasElem.addEventListener("mousedown", this.handleMouseDown);
      canvasElem.addEventListener("mousemove", this.handleMouseMove);
      canvasElem.addEventListener("mouseup", this.handleMouseUp);
      canvasElem.addEventListener("mouseout", this.handleMouseOut);
    }
  }

  componentWillUnmount() {
    const { canvasElem } = this;
    if (canvasElem) {
      canvasElem.removeEventListener("mousedown", this.handleMouseDown);
      canvasElem.removeEventListener("mousemove", this.handleMouseMove);
      canvasElem.removeEventListener("mouseup", this.handleMouseUp);
      canvasElem.removeEventListener("mouseout", this.handleMouseOut);
    }
  }

  handleMouseDown = (e) => {
    this.isDrawingShape = true;
    if (this.canvasElem !== undefined) {
      this.coordinateScaleX = this.canvasElem.clientWidth / 300;
      this.coordinateScaleY = this.canvasElem.clientHeight / 300;
    }
    this.writingCtx.lineWidth = 2 / this.coordinateScaleX;
    this.writingCtx.strokeStyle = "red";
    const { offsetX, offsetY } = e;
    this.mouseDownX = offsetX;
    this.mouseDownY = offsetY;
  };

  handleMouseMove = (e) => {
    if (this.isDrawingShape) {
      this.drawRect(e);
    }
  };

  // onAddShape = (props) => {
  //   console.log("props", props);
  // };
  handleMouseUp = () => {
    this.isDrawingShape = false;
    // this.onAddShape({
    //   type: "aa",
    //   color: "red",
    //   width: this.squeezePathX(300 / this.coordinateScaleX),
    //   positionX: this.squeezePathX(this.positionX),
    //   positionY: this.squeezePathY(this.positionY),
    //   dataX: this.squeezePathX(this.dataX),
    //   dataY: this.squeezePathY(this.dataY),
    // });
    this.writingCtx.save();
    // console.log("draw", this.canvasElem.toDataURL());
  };

  handleMouseOut = (e) => {
    this.handleMouseUp(e);
  };

  drawRect = (e) => {
    const { offsetX, offsetY } = e;
    this.positionX = this.mouseDownX / this.coordinateScaleX;
    this.positionY = this.mouseDownY / this.coordinateScaleY;
    this.dataX = (offsetX - this.mouseDownX) / this.coordinateScaleX;
    this.dataY = (offsetY - this.mouseDownY) / this.coordinateScaleY;
    this.writingCtx.clearRect(0, 0, 300, 300);
    this.writingCtx.beginPath();
    this.writingCtx.strokeRect(
      this.positionX,
      this.positionY,
      this.dataX,
      this.dataY
    );
  };

  drawCircle = (e) => {
    const { offsetX, offsetY } = e;
    const rx = (offsetX - this.mouseDownX) / 2;
    const ry = (offsetY - this.mouseDownY) / 2;
    const radius = Math.sqrt(rx * rx + ry * ry);
    const centreX = rx + this.mouseDownX;
    const centreY = ry + this.mouseDownY;
    this.writingCtx.clearRect(0, 0, 300, 300);
    this.writingCtx.beginPath();
    this.writingCtx.arc(
      centreX / this.coordinateScaleX,
      centreY / this.coordinateScaleY,
      radius,
      0,
      Math.PI * 2
    );
    this.writingCtx.stroke();
  };

  drawEllipse = (e) => {
    const { offsetX, offsetY } = e;
    const radiusX = Math.abs(offsetX - this.mouseDownX) / 2;
    const radiusY = Math.abs(offsetY - this.mouseDownY) / 2;
    const centreX =
      offsetX >= this.mouseDownX
        ? radiusX + this.mouseDownX
        : radiusX + offsetX;
    const centreY =
      offsetY >= this.mouseDownY
        ? radiusY + this.mouseDownY
        : radiusY + offsetY;
    this.positionX = centreX / this.coordinateScaleX;
    this.positionY = centreY / this.coordinateScaleY;
    this.dataX = radiusX / this.coordinateScaleX;
    this.dataY = radiusY / this.coordinateScaleY;
    this.writingCtx.clearRect(0, 0, 300, 300);
    this.writingCtx.beginPath();
    this.writingCtx.ellipse(
      this.positionX,
      this.positionY,
      this.dataX,
      this.dataY,
      0,
      0,
      Math.PI * 2
    );
    this.writingCtx.stroke();
  };

  // 将需要存储的数据根据canvas分辨率压缩至[0，1]之间的数值
  squeezePathX(value) {
    return value / 300;
  }

  squeezePathY(value) {
    return value / 300;
  }

  save() {
    this.hiddenCtx.drawImage(this.canvasElem, 0, 0);
    const r = this.hiddenElem.toDataURL();
    console.log("result", r);
  }

  canvasElem;
  hiddenElem;

  writingCtx;

  hiddenCtx;

  isDrawingShape = false;

  coordinateScaleX;

  coordinateScaleY;

  mouseDownX = 0; // mousedown时的横坐标

  mouseDownY = 0; // mousedown时的纵坐标

  positionX; // 存储形状数据的x

  positionY; // 存储形状数据的y

  dataX; // 存储形状数据的宽

  dataY; // 存储形状数据的高

  render() {
    return (
      <>
        <canvas
          width={300}
          height={300}
          style={{ backgroundColor: "#ccc" }}
          className="draw"
          ref={(r) => {
            this.canvasElem = r;
          }}
        />
        <canvas
          width={300}
          height={300}
          style={{ display: "none" }}
          ref={(c) => {
            this.hiddenElem = c;
          }}
        />

        <div
          onClick={() => {
            this.save();
          }}
        >
          保存
        </div>
      </>
    );
  }
}

export default DrawShape;

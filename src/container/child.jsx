import React, { memo } from "react";

const Child = ({ name, changeName }) => {
  console.log("child start---");
  return (
    <div
      onClick={() => {
        changeName("bobozai");
      }}
    >
      child comps: {name}
    </div>
  );
};

export default memo(Child);

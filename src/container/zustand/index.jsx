import { pick } from "lodash-es";
import React from "react";
import store from "./store";
import Add from "./add";

const Zus = () => {
  console.log("store", store);
  const { bears } = store((state) => pick(state, ["bears"]));
  return (
    <div>
      <Add />
      <div>🐻: {bears}</div>
    </div>
  );
};

export default Zus;

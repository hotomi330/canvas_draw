import React from "react";
import store from "./store";
import { pick } from "lodash-es";

const Add = () => {
  const { increasePopulation } = store((state) =>
    pick(state, ["increasePopulation"])
  );
  return (
    <div>
      <div onClick={increasePopulation}>点🐻，一直点一直加</div>
    </div>
  );
};

export default Add;

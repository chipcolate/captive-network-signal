import React from "react";
import { black, black0, black1, black2 } from "./assets";

const Loading = () => {
  return (
    <div className="container">
      <img src={black0} className="image image1-animate" alt="image1" />
      <img src={black1} className="image image2-animate" alt="image2" />
      <img src={black2} className="image image3-animate" alt="image3" />
      <img src={black} className="image image4-animate" alt="image4" />
      <h2 className="nowrap">Loading...</h2>
    </div>
  );
};

export default Loading;

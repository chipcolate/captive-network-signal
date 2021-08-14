import React from "react";
import { agrorobotica } from "./assets";

const Footer = () => {
  return (
    <footer
      className="footer"
      style={{
        backgroundImage: process.env.REACT_APP_COLOR
          ? `linear-gradient(-90deg, ${process.env.REACT_APP_COLOR}, white)`
          : "",
        color: process.env.REACT_APP_TEXT ? process.env.REACT_APP_TEXT : "",
      }}
    >
      <img
        src={
          process.env.REACT_APP_LOGO ? process.env.REACT_APP_LOGO : agrorobotica
        }
        className="logo"
        alt="logo"
      />
    </footer>
  );
};

export default Footer;

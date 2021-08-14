import React from "react";

const Header = () => {
  return (
    <header
      className="header"
      style={{
        background: process.env.REACT_APP_COLOR
          ? process.env.REACT_APP_COLOR
          : "",
        color: process.env.REACT_APP_TEXT ? process.env.REACT_APP_TEXT : "",
      }}
    >
      Network Captive Portal
    </header>
  );
};

export default Header;

import React from "react";
import { useQuery } from "react-query";
import "./App.css";
import {
  black,
  black0,
  black1,
  black2,
  agrorobotica,
  green,
  low_green,
  low_red,
} from "./assets";
import { useEffect } from "react";
import { useTimer } from "use-timer";

const NETWORK_LEVEL = "modem.generic.signal-quality.value";
const NETWORK_OPERATOR = "modem.3gpp.operator-name";
const NETWORK_TYPE = "modem.generic.access-technologies.value[1]";

const networkTypes = {
  gsm: "2G",
  gprs: "2.5G",
  umts: "3G",
  lte: "4G",
};

const fetchSignal = async () => {
  if (process.env.NODE_ENV === "development") {
    return new Promise((res, rej) => {
      res({
        [NETWORK_LEVEL]: Math.floor(Math.random() * 100),
        [NETWORK_OPERATOR]: "TIM",
        [NETWORK_TYPE]: "umts",
      });
    });
  }
  const resp = await fetch(
    process.env.REACT_APP_NETWORK
      ? process.env.REACT_APP_NETWORK
      : "http://192.168.42.1:8080/v1/modem" // default DHCP server local ip
      
  );
  return await resp.json();
};

function App() {
  const { status, data, error, refetch } = useQuery("signal", fetchSignal);
  const { start, reset } = useTimer({
    initialTime: process.env.REACT_APP_REFRESH
      ? process.env.REACT_APP_REFRESH
      : 30,
    timerType: "DECREMENTAL",
    endTime: 0,
    onTimeOver: async () => {
      reset();
      start();
      await refetch();
    },
  });

  useEffect(() => {
    start();
  }, [start]);

  return (
    <div
      className="app"
      style={{
        background: process.env.REACT_APP_BACKGROUND
          ? process.env.REACT_APP_BACKGROUND
          : "",
        color: process.env.REACT_APP_TEXT ? process.env.REACT_APP_TEXT : "",
      }}
    >
      <Header />
      {status === "loading" ? (
        <Loading />
      ) : status === "error" ? (
        <span>Error: {error?.message}</span>
      ) : status === "success" ? (
        <div className="container">
          {data[NETWORK_LEVEL] > 60 ? (
            <img src={green} className="image" alt="green" />
          ) : data[NETWORK_LEVEL] > 40 ? (
            <img src={low_green} className="image" alt="low_green" />
          ) : (
            <img src={low_red} className="image" alt="red" />
          )}
          <h2
            style={{ color: data[NETWORK_LEVEL] > 40 ? "darkseagreen" : "red" }}
            className="text"
          >{`Signal level: ${data[NETWORK_LEVEL]}`}</h2>
          <h4 className="text" style={{ bottom: "-3rem" }}>{`${
            data[NETWORK_OPERATOR]
          } - ${networkTypes[data[NETWORK_TYPE]]}`}</h4>
        </div>
      ) : (
        <span>Error</span>
      )}
      <Footer />
    </div>
  );
}

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
      Network Level
    </header>
  );
};

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
        src={process.env.REACT_APP_LOGO ? process.env.REACT_APP_LOGO : agrorobotica}
        className="logo"
        alt="logo"
      />
    </footer>
  );
};

const Loading = () => {
  return (
    <div className="container">
      <img src={black0} className="image image1-animate" alt="image1" />
      <img src={black1} className="image image2-animate" alt="image2" />
      <img src={black2} className="image image3-animate" alt="image3" />
      <img src={black} className="image image4-animate" alt="image4" />
      <h2 className="text">Loading...</h2>
    </div>
  );
};

export default App;

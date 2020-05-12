import React from "react";
import { useQuery } from "react-query";
import "./App.css";
import {
  black,
  black0,
  black1,
  black2,
  uspace,
  green,
  low_green,
  low_red,
} from "./assets";
import { useEffect } from "react";
import { useTimer } from "use-timer";

const fetchSignal = async () => {
  // return await fetch("/");
  return new Promise((res, rej) => {
    res({ level: Math.floor(Math.random() * 100) });
  });
};

function App() {
  const { status, data, error, refetch } = useQuery("signal", fetchSignal);
  const { start, reset } = useTimer({
    // initialTime: 180,
    initialTime: 2,
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
    <div className="app">
      <Header />
      {status === "loading" ? (
        <Loading />
      ) : status === "error" ? (
        <span>Error: {error?.message}</span>
      ) : status === "success" ? (
        <div className="container">
          {data.level > 60 ? (
            <img src={green} className="image" alt="green" />
          ) : data.level > 40 ? (
            <img src={low_green} className="image" alt="low_green" />
          ) : (
            <img src={low_red} className="image" alt="red" />
          )}
          <h2
            style={{ color: data.level > 40 ? "darkseagreen" : "red" }}
            className="text"
          >{`Signal level: ${data.level}`}</h2>
        </div>
      ) : (
        <span>Error</span>
      )}
      <Footer />
    </div>
  );
}

const Header = () => {
  return <header className="header">Network Level</header>;
};

const Footer = () => {
  return (
    <footer className="footer">
      <img src={uspace} className="logo" alt="logo" />
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

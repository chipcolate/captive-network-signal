import React, { useMemo } from "react";
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
        modem: {
          "3gpp": {
            "enabled-locks": [],
            eps: {
              "initial-bearer": {
                "dbus-path": "--",
                settings: {
                  apn: "--",
                  "ip-type": "--",
                  password: "--",
                  user: "--",
                },
              },
              "ue-mode-operation": "--",
            },
            imei: "867648043678091",
            "operator-code": "22201",
            "operator-name": "--",
            pco: "--",
            "registration-state": "idle",
          },
          cdma: {
            "activation-state": "--",
            "cdma1x-registration-state": "--",
            esn: "--",
            "evdo-registration-state": "--",
            meid: "--",
            nid: "--",
            sid: "--",
          },
          "dbus-path": "/org/freedesktop/ModemManager1/Modem/0",
          generic: {
            "access-technologies": [],
            bearers: [],
            "carrier-configuration": "default",
            "carrier-configuration-revision": "--",
            "current-bands": [
              "egsm",
              "dcs",
              "utran-1",
              "utran-8",
              "eutran-1",
              "eutran-3",
              "eutran-7",
              "eutran-8",
              "eutran-20",
              "eutran-28",
            ],
            "current-capabilities": ["gsm-umts, lte"],
            "current-modes": "allowed: 2g, 3g, 4g; preferred: 4g",
            device: "/sys/devices/platform/soc/3f980000.usb/usb1/1-1/1-1.3",
            "device-identifier": "b11776b4562b297911729d29a96e7256240619ad",
            drivers: ["qmi_wwan"],
            "equipment-identifier": "867648043678091",
            "hardware-revision": "10000",
            manufacturer: "QUALCOMM INCORPORATED",
            model: "QUECTEL Mobile Broadband Module",
            "own-numbers": [],
            plugin: "quectel",
            ports: ["cdc-wdm0 (qmi)", "wwan0 (net)"],
            "power-state": "on",
            "primary-port": "cdc-wdm0",
            revision: "EG91EXGAR08A03M1G",
            "signal-quality": { recent: "no", value: "0" },
            sim: "/org/freedesktop/ModemManager1/SIM/0",
            state: "enabled",
            "state-failed-reason": "--",
            "supported-bands": [
              "egsm",
              "dcs",
              "utran-1",
              "utran-8",
              "eutran-1",
              "eutran-3",
              "eutran-7",
              "eutran-8",
              "eutran-20",
              "eutran-28",
            ],
            "supported-capabilities": ["gsm-umts, lte"],
            "supported-ip-families": ["ipv4", "ipv6", "ipv4v6"],
            "supported-modes": [
              "allowed: 2g; preferred: none",
              "allowed: 3g; preferred: none",
              "allowed: 4g; preferred: none",
              "allowed: 2g, 3g; preferred: 3g",
              "allowed: 2g, 3g; preferred: 2g",
              "allowed: 2g, 4g; preferred: 4g",
              "allowed: 2g, 4g; preferred: 2g",
              "allowed: 3g, 4g; preferred: 4g",
              "allowed: 3g, 4g; preferred: 3g",
              "allowed: 2g, 3g, 4g; preferred: 4g",
              "allowed: 2g, 3g, 4g; preferred: 3g",
              "allowed: 2g, 3g, 4g; preferred: 2g",
            ],
            "unlock-required": "sim-pin2",
            "unlock-retries": [
              "sim-pin (3)",
              "sim-pin2 (3)",
              "sim-puk (10)",
              "sim-puk2 (10)",
            ],
          },
        },
      });
    });
  }
  const resp = await fetch(
    process.env.REACT_APP_NETWORK
      ? process.env.REACT_APP_NETWORK
      : "http://192.168.42.1:8080/v1/read" // default DHCP server local ip
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

  const networkLevel = useMemo(() => {
    return data.modem.generic["signal-quality"].value;
  }, [data]);

  const operator = useMemo(() => {
    return data.modem["3gpp"]["operator-name"];
  }, [data]);

  const networkType = useMemo(() => {
    return networkTypes[data.modem.generic["access-technologies"].value[1]];
  }, [data]);

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
          {networkLevel > 60 ? (
            <img src={green} className="image" alt="green" />
          ) : networkLevel > 40 ? (
            <img src={low_green} className="image" alt="low_green" />
          ) : (
            <img src={low_red} className="image" alt="red" />
          )}
          <h2
            style={{ color: networkLevel > 40 ? "darkseagreen" : "red" }}
            className="text"
          >{`Signal level: ${networkLevel}`}</h2>
          <h4
            className="text"
            style={{ bottom: "-3rem" }}
          >{`${operator} - ${networkType}`}</h4>
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
        src={
          process.env.REACT_APP_LOGO ? process.env.REACT_APP_LOGO : agrorobotica
        }
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

import cx from "classnames";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useTimer } from "use-timer";
import "./App.css";
import { green, low_green, low_red } from "./assets";
import Button from "./Button.js";
import Footer from "./Footer.js";
import Header from "./Header.js";
import "./keyframes.css";
import Loading from "./Loading.js";
import Modal from "./Modal.js";

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
    return new Promise((res, _) => {
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
      : "http://192.168.42.1:8080/v1/read" // default DHCP server local ip
  );
  return await resp.json();
};

const fetchDeviceName = async () => {
  if (process.env.NODE_ENV === "development") {
    return new Promise((res, _) => {
      res({ name: "AgroDevice", uuid: "6bf33ccdbf9971dbb95e38657336756b" });
    });
  }
  const resp = await fetch(
    process.env.REACT_APP_DEVICE_NAME
      ? process.env.REACT_APP_DEVICE_NAME
      : "http://192.168.42.1:8080/v1/name" // default DHCP server local ip
  );
  return await resp.json();
};

const setDeviceInstalled = async (body) => {
  if (process.env.NODE_ENV === "development") {
    return new Promise((res, _) => {
      res("Ok");
    });
  }
  const resp = await fetch(
    process.env.REACT_APP_INSTALLED
      ? process.env.REACT_APP_INSTALLED
      : "http://192.168.42.1:8080/v1/installed", // default DHCP server local ip
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  return await resp.json();
};

function App() {
  const {
    status: nameStatus,
    data: nameData,
    error: nameError,
  } = useQuery("name", fetchDeviceName);
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
  const installing = useMutation((body) => setDeviceInstalled(body));
  const [open, setOpen] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [failed, setFailed] = useState("");

  useEffect(() => {
    start();
  }, [start]);

  useEffect(() => {
    if (installing.isLoading) {
      setFailed("");
    } else if (installing.isSuccess && !installed) {
      setInstalled(true);
      setOpen(false);
    } else if (installing.isError) {
      setFailed(installing.error);
    }
  }, [installing, installed]);

  const toggleModal = useCallback(() => setOpen(!open), [open]);

  const networkLevel = useMemo(() => {
    if (data) return data[NETWORK_LEVEL];
  }, [data]);

  const operator = useMemo(() => {
    if (data) return data[NETWORK_OPERATOR];
  }, [data]);

  const networkType = useMemo(() => {
    // if (data) return networkTypes[data.modem.generic["access-technologies"].value[1]];
    if (data) return networkTypes[data[NETWORK_TYPE]];
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

      <ConfirmModal
        isOpen={open}
        loading={installing.isLoading}
        title={"Device installed"}
        subtitle={
          "Are you sure the trap is correctly installed? You won't be able to restart install process from this portal"
        }
        onExit={toggleModal}
        action={() => installing.mutate()}
        failed={failed}
        failedMessage={`Something went wrong, retry and contact our support if error persists. Error: ${failed}`}
      />

      <div className="container">
        {installed ? (
          <div className={cx("flex-column", "center")}>
            <h1 className="title">{`${nameData?.name} Installed`}</h1>
            <h4 className="subtitle">
              Thanks, the device is correctly installed. The device will now
              restart and this portal will no longer be available. You can
              re-enable this portal or monitor the device from SpyFly App.
            </h4>
            <a
              href="https://play.google.com/store/apps/details?id=com.agrorobotica.agrorobotica"
              className="download"
            >
              <img
                src="https://opirescue.com/images/PlayStoreButton.gif"
                alt="download"
                style={{ width: "100%" }}
              />
            </a>
          </div>
        ) : (
          <>
            <div className={cx("flex-column", "center")}>
              {nameStatus === "loading" ? (
                false
              ) : nameStatus === "error" ? (
                <h3>{nameError}</h3>
              ) : (
                <>
                  <h3 className="title">{nameData.name}</h3>
                  <h4 className="subtitle">{nameData.uuid}</h4>
                </>
              )}
            </div>

            <div className={cx("image-container", "flex-column", "center")}>
              {status === "loading" ? (
                <Loading />
              ) : status === "error" ? (
                <span>Error: {error?.message}</span>
              ) : status === "success" ? (
                <>
                  {networkLevel > 60 ? (
                    <img src={green} className="image" alt="green" />
                  ) : networkLevel > 40 ? (
                    <img src={low_green} className="image" alt="low_green" />
                  ) : (
                    <img src={low_red} className="image" alt="red" />
                  )}

                  <h2
                    style={{
                      color: networkLevel > 40 ? "darkseagreen" : "red",
                    }}
                    className={cx("nowrap", "title")}
                  >{`Signal level: ${networkLevel}`}</h2>
                  <h4
                    className={cx("nowrap", "subtitle")}
                  >{`${operator} - ${networkType}`}</h4>
                </>
              ) : (
                <span>Error</span>
              )}
            </div>

            <Button onClick={() => setOpen(true)}>Installed</Button>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

const ConfirmModal = (props) => {
  return (
    <Modal
      isOpen={props.isOpen}
      onBackgroundClick={props.onExit}
      onEscapeKeydown={props.onExit}
    >
      <div className={cx("flex-column", "center", "modal-container")}>
        {props.loading ? (
          <Loading />
        ) : (
          <>
            <h2>{props.title}</h2>
            <p>{props.subtitle}</p>

            {props.failed && <p className={"failed"}>{props.failedMessage}</p>}

            <div className="modal-buttons">
              <button
                onClick={props.onExit}
                className={cx("modal-button", "cancel")}
              >
                Cancel
              </button>
              <button
                onClick={props.action}
                className={cx("modal-button", "confirm")}
              >
                Confirm
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default App;

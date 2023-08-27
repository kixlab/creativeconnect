import React, { useState } from "react";
import colorStyles from "../style/color.module.css";
import useItem from "../hook/useItem";
import { addLog } from "../api/log";
import { Modal } from "react-bootstrap";
import { initialUnderwaterData, initialUniverseData } from "../config/initialStageData";

type HeaderProps = {
  showModal: () => void;
};

const Header: React.FC<HeaderProps> = ({ showModal }) => {
  const { stageData, initializeItems, clearItems } = useItem();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <header
        style={{ height: "40px" }}
        className={[colorStyles.darkTheme, "p-0 d-flex flex-column align-items-start"].join(" ")}
      >
        <div className="w-100 d-flex justify-content-between align-items-center">
          <div style={{ padding: "0.5rem" }}>
            <i
              style={{ cursor: "pointer" }}
              className="bi bi-question-circle"
              onClick={showModal}
            ></i>
          </div>
          <div style={{ padding: "0.5rem" }}>
            <i style={{ cursor: "pointer" }} className="bi bi-star-fill" onClick={handleShow}></i>
          </div>
          <div style={{ padding: "0.5rem" }}>
            <i
              style={{ cursor: "pointer" }}
              className="bi bi-arrow-clockwise"
              onClick={clearItems}
            ></i>
          </div>
          <div
            onClick={() => {
              console.log(stageData);
            }}
          >
            <i className="bi bi-cloud-download-fill"></i>
          </div>
          <div
            onClick={() => {
              initializeItems(initialUnderwaterData);
            }}
          >
            <i className="bi bi-droplet-fill"></i>
            <i className="bi bi-tree-fill"></i>
          </div>
          <div
            onClick={() => {
              initializeItems(initialUniverseData);
            }}
          >
            <i className="bi bi-moon-stars-fill"></i>
            <i className="bi bi-binoculars-fill"></i>
          </div>
        </div>
      </header>
      <Modal show={show} onHide={handleClose} style={{ marginTop: "20vh" }}>
        <Modal.Body className="text-center">
          <p className="w-100">How useful was the tool for generating your sketch?</p>
          <div className="input-group mb-3 text-center w-100 justify-content-center">
            {Array.from(Array(7).keys()).map((key) => (
              <button
                type="button"
                className="btn btn-outline-secondary"
                style={{ width: "50px" }}
                onClick={() => {
                  addLog("finishSketch", {
                    rate: key + 1,
                  });
                  handleClose();
                }}
              >
                {key + 1}
              </button>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Header;

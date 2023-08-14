import React from "react";
import colorStyles from "../style/color.module.css";

type HeaderProps = {
  showModal: () => void;
};

const Header: React.FC<HeaderProps> = ({ showModal }) => (
  <header
    className={[colorStyles.darkTheme, "p-0 h-100 d-flex flex-column align-items-start"].join(" ")}
  >
    <div className="w-100 d-flex justify-content-between align-items-center">
      <div style={{ padding: "0.5rem" }}>
        <i style={{ cursor: "pointer" }} className="bi bi-question-circle" onClick={showModal}></i>
      </div>
    </div>
  </header>
);

export default Header;

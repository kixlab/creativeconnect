import React from "react";
import colorStyles from "../style/color.module.css";
import useItem from "../hook/useItem";

type HeaderProps = {
  showModal: () => void;
};

const Header: React.FC<HeaderProps> = ({ showModal }) => {
  const { clearItems } = useItem();
  return (
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
          <i
            style={{ cursor: "pointer" }}
            className="bi bi-arrow-clockwise"
            onClick={clearItems}
          ></i>
        </div>
      </div>
    </header>
  );
};

export default Header;

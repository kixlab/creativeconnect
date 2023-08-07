import React, { useState } from "react";
import { Container } from "react-bootstrap";
import colorStyles from "../style/color.module.css";
import "./layout.css";
import ImageWidget from "../settingBar/ImageWidget";

type LayoutProps = {
  header?: React.ReactNode;
  navBar?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

function Layout(data: LayoutProps) {
  const [showSettingBar, setShowSettingBar] = useState(false);
  const handleClick = () => {
    setShowSettingBar(!showSettingBar);
  };

  return (
    <Container fluid className="overflow-hidden">
      {data.header}
      <div className={[colorStyles.lightTheme, "position-relative z-1 h-100"].join(" ")}>
        <div className="h-100">{data.children}</div>
        {showSettingBar && (
          <div className="settingBar">
            <ImageWidget />
          </div>
        )}
        <div className="buttonWrapper">
          <a
            className={showSettingBar ? "importbutton importbutton-rotate" : "importbutton"}
            onClick={handleClick}
            href="#"
          >
            <i className="bi bi-plus"></i>
          </a>
        </div>
      </div>
    </Container>
  );
}

export default Layout;

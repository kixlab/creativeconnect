import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import colorStyles from "../style/color.module.css";
import ImageWidget from "../widgets/ImageWidget";
import MergeWidget from "../widgets/MergeWidget";

import "./layout.css";
import StarredWidget from "../widgets/StarredWidget";
import ExpandWidget from "../widgets/ExpandWidget";

type LayoutProps = {
  header?: React.ReactNode;
  navBar?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

type WidgetProps = {
  name: "image" | "merge" | "starred";
  icon: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className: string;
  widget: React.ReactNode;
};

const widgets: WidgetProps[] = [
  {
    name: "image",
    icon: "bi bi-plus",
    position: "bottom-left",
    className: "imageWidget",
    widget: <ImageWidget />,
  },
  {
    name: "merge",
    icon: "bi bi-union",
    position: "top-right",
    className: "mergeWidget",
    widget: <MergeWidget />,
  },
  {
    name: "starred",
    icon: "bi bi-star-fill",
    position: "bottom-right",
    className: "starredWidget",
    widget: <StarredWidget />,
  },
];

function Layout(data: LayoutProps) {
  const [shownWidget, setShownWidget] = useState<"image" | "merge" | "starred" | "">("");

  const handleButtonClick = (name: "image" | "merge" | "starred") => {
    if (shownWidget === name) setShownWidget("");
    else setShownWidget(name);
  };

  return (
    <div
      className="position-relative d-flex flex-column"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      {data.header}
      <div
        className={[colorStyles.lightTheme, "position-relative z-1"].join(" ")}
        style={{ flex: 1 }}
      >
        {data.children}

        {widgets.map((widget: WidgetProps) => (
          <div className={"wrapper-" + widget.position} style={{ zIndex: 1 }}>
            <a
              className={
                shownWidget === widget.name
                  ? "btn btn-custom-round-icon btn-custom-round-icon-selected"
                  : "btn btn-custom-round-icon"
              }
              onClick={handleButtonClick.bind(null, widget.name)}
              href="#"
            >
              <i className={widget.icon}></i>
            </a>

            <div
              className={"custom-widget " + widget.className}
              style={{
                visibility: shownWidget === widget.name ? "visible" : "hidden",
              }}
            >
              {widget.widget}
            </div>
          </div>
        ))}

        <div
          className="position-fixed bottom-0"
          style={{ left: "50%", transform: "translateX(-50%)" }}
        >
          <ExpandWidget />
        </div>
      </div>
    </div>
  );
}

export default Layout;

import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import colorStyles from "../style/color.module.css";
import ImageWidget from "../widgets/ImageWidget";
import MergeWidget from "../widgets/MergeWidget";

import "./layout.css";
import StarredWidget from "../widgets/StarredWidget";
import ExpandWidget from "../widgets/ExpandWidget";
import CustomKeywordWidget from "../widgets/CustomKeywordWidget";

type LayoutProps = {
  header?: React.ReactNode;
  navBar?: React.ReactNode;
  footer?: React.ReactNode;
  selectedItems: any[];
  children: React.ReactNode;
};

type WidgetProps = {
  name: "image" | "merge" | "starred";
  icon: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className: string;
  widget: React.ReactNode;
};

function Layout(data: LayoutProps) {
  const [sidebarMenu, setSidebarMenu] = useState<"merge" | "starred">("merge");
  const [shownWidget, setShownWidget] = useState<"image" | "merge" | "starred" | "">("");

  const handleButtonClick = (name: "image" | "merge" | "starred") => {
    if (shownWidget === name) setShownWidget("");
    else setShownWidget(name);
  };

  return (
    <>
      {data.header}
      <div className="d-flex w-100">
        <div style={{ background: "white", width: "360px" }}>
          <ImageWidget selectedItems={data.selectedItems} />
          <hr />
          <CustomKeywordWidget />
        </div>

        <div
          className="position-relative d-flex flex-column"
          style={{ flex: 1, height: "100vh", overflow: "hidden" }}
        >
          <div
            className={[colorStyles.lightTheme, "position-relative z-1"].join(" ")}
            style={{ flex: 1 }}
          >
            {data.children}
            <div
              className="position-fixed bottom-0"
              style={{ left: "50%", transform: "translateX(-50%)" }}
            >
              <ExpandWidget />
            </div>
          </div>
        </div>
        <div style={{ background: "white", width: "400px" }}>
          <div className="d-flex align-items-center justify-content-center">
            <div
              className={
                sidebarMenu === "merge" ? "sidebar-menu sidebar-menu-selected" : "sidebar-menu"
              }
              onClick={() => setSidebarMenu("merge")}
            >
              Merge Keywords
            </div>
            <div
              className={
                sidebarMenu === "starred" ? "sidebar-menu sidebar-menu-selected" : "sidebar-menu"
              }
              onClick={() => setSidebarMenu("starred")}
            >
              Starred Images
            </div>
          </div>

          <div
            style={{
              visibility: sidebarMenu === "merge" ? "visible" : "hidden",
              display: sidebarMenu === "merge" ? "block" : "none",
            }}
          >
            <MergeWidget />
          </div>
          <div
            style={{
              visibility: sidebarMenu === "starred" ? "visible" : "hidden",
              display: sidebarMenu === "starred" ? "block" : "none",
            }}
          >
            <StarredWidget />
          </div>
        </div>
      </div>
    </>
  );
}

export default Layout;

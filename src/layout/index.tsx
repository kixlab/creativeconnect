import React, { useState } from "react";
import colorStyles from "../style/color.module.css";
import ImageWidget from "../widgets/ImageWidget";
import MergeWidget from "../widgets/MergeWidget";

import "./layout.css";
import StarredWidget from "../widgets/StarredWidget";
import ExpandWidget from "../widgets/ExpandWidget";
import CustomKeywordWidget from "../widgets/CustomKeywordWidget";
import DiffusionWidget from "../widgets/DiffusionWidget";

type LayoutProps = {
  header?: React.ReactNode;
  navBar?: React.ReactNode;
  footer?: React.ReactNode;
  selectedItems: any[];
  children: React.ReactNode;
};

const urlParams = new URLSearchParams(window.location.search);
const CONDITION = urlParams.get("c") === "C" ? "CONTROL" : "TREATMENT";

function Layout(data: LayoutProps) {
  const [sidebarMenu, setSidebarMenu] = useState<"merge" | "starred" | "diffusion">(
    CONDITION === "CONTROL" ? "diffusion" : "merge"
  );

  return (
    <>
      {data.header}
      <div className="d-flex w-100" style={{ height: "calc(100vh - 40px)" }}>
        <div
          style={{ background: "white", width: "360px", maxHeight: "100%", overflowY: "scroll" }}
          className="hide-scrollbar d-flex flex-column"
        >
          <ImageWidget selectedItems={data.selectedItems} />
          <hr />
          <CustomKeywordWidget />
        </div>

        <div
          className="position-relative d-flex flex-column"
          style={{ flex: 1, maxHeight: "100%", overflow: "hidden" }}
        >
          <div
            className={[colorStyles.lightTheme, "position-relative z-1"].join(" ")}
            style={{ flex: 1 }}
          >
            {data.children}
            <div
              className="position-fixed bottom-0"
              style={{ left: "50%", transform: "translateX(-55%)" }}
            >
              {CONDITION === "CONTROL" ? <></> : <ExpandWidget />}
            </div>
          </div>
        </div>
        <div
          style={{ background: "white", width: "500px", maxHeight: "100%", overflowY: "scroll" }}
          className="hide-scrollbar"
        >
          <div className="d-flex align-items-center justify-content-center">
            {CONDITION === "CONTROL" ? (
              <div
                className={
                  sidebarMenu === "diffusion"
                    ? "sidebar-menu sidebar-menu-selected"
                    : "sidebar-menu"
                }
                onClick={() => setSidebarMenu("diffusion")}
              >
                Generate skteches
              </div>
            ) : (
              <div
                className={
                  sidebarMenu === "merge" ? "sidebar-menu sidebar-menu-selected" : "sidebar-menu"
                }
                onClick={() => setSidebarMenu("merge")}
              >
                Merge Keywords
              </div>
            )}

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
              visibility: sidebarMenu === "diffusion" ? "visible" : "hidden",
              display: sidebarMenu === "diffusion" ? "block" : "none",
            }}
          >
            <DiffusionWidget />
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

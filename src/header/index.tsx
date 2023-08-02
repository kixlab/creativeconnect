import React from "react";
import { Col, Row } from "react-bootstrap";
import colorStyles from "../style/color.module.css";
import { TabKind, TabProps } from "./tab/Tab";
import TabGroup from "./tab";

type HeaderProps = {
  onClickTab: TabProps["onClickTab"];
  onCreateTab: () => void;
  onDeleteTab: (tabId: string) => void;
  tabList: TabKind[];
  showModal: () => void;
};

const Header: React.FC<HeaderProps> = ({
  onClickTab,
  tabList,
  onCreateTab,
  onDeleteTab,
  showModal,
}) => (
  <header
    className={[colorStyles.darkTheme, "p-0 h-100 d-flex flex-column align-items-start"].join(" ")}
  >
    <div className="w-100 d-flex justify-content-between align-items-center">
      <TabGroup
        onClickTab={onClickTab}
        tabList={tabList}
        onCreateTab={onCreateTab}
        onDeleteTab={onDeleteTab}
      />
      <div style={{ padding: "0.5rem" }}>
        <i style={{ cursor: "pointer" }} className="bi bi-question-circle" onClick={showModal}></i>
      </div>
    </div>
  </header>
);

export default Header;

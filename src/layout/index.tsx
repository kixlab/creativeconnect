import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import colorStyles from "../style/color.module.css";
import ImageWidget from "../widgets/ImageWidget";
import useLabelSelection from "../hook/useLabelSelection";
import MergeWidget from "../widgets/MergeWidget";

import "./layout.css";

type LayoutProps = {
  header?: React.ReactNode;
  navBar?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

function Layout(data: LayoutProps) {
  const [showImageWidget, setShowImageWidget] = useState(false);
  const [showMergeWidget, setShowMergeWidget] = useState(false);

  const handleImportClick = () => {
    setShowImageWidget(!showImageWidget);
    setShowMergeWidget(false);
  };

  const handleMergeClick = () => {
    setShowMergeWidget(!showMergeWidget);
    setShowImageWidget(false);
  };

  const { getAllSelectedLabel } = useLabelSelection();
  const allSelectedLabel = getAllSelectedLabel();
  useEffect(() => {
    if (allSelectedLabel.length === 0) {
      setShowImageWidget(true);
      setShowMergeWidget(false);
    } else {
      setShowImageWidget(false);
      setShowMergeWidget(true);
    }
  }, [allSelectedLabel]);

  return (
    <Container fluid className="overflow-hidden">
      {data.header}
      <div className={[colorStyles.lightTheme, "position-relative z-1 h-100"].join(" ")}>
        <div className="h-100">{data.children}</div>
        {showImageWidget && (
          <div className="imageWidget">
            <ImageWidget />
          </div>
        )}
        <div className="bottomButtonWrapper">
          <a
            className={showImageWidget ? "customButton customButton-selected" : "customButton"}
            onClick={handleImportClick}
            href="#"
          >
            <i className="bi bi-plus"></i>
          </a>
        </div>
        {showMergeWidget && (
          <div className="mergeWidget">
            <MergeWidget />
          </div>
        )}
        <div className="topButtonWrapper">
          <a
            className={showMergeWidget ? "customButton customButton-selected" : "customButton"}
            onClick={handleMergeClick}
            href="#"
          >
            <i className="bi bi-union"></i>
          </a>
        </div>
      </div>
    </Container>
  );
}

export default Layout;

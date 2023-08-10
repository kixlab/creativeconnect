import React from "react";
import "./MergeWidget.css";
import { Button, Col, Row } from "react-bootstrap";
import useLabelSelection from "../../hook/useLabelSelection";
import ElementSelectButton from "../util/elements";

const MergeWidget: React.FC = () => {
  const { getAllSelectedLabel } = useLabelSelection();
  const allSelectedLabel = getAllSelectedLabel();

  return (
    <Col className="mergeWidgetWrapper">
      <div className="d-flex flex-wrap justify-content-center">
        {allSelectedLabel.map((label) => (
          <ElementSelectButton
            id={label.fileid + "-" + label.type + "-" + label.keyword}
            key={label.fileid + "-" + label.type + "-" + label.keyword}
            elementName={label.keyword}
            elementType={label.type}
            onChange={(e) => {}}
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
            button={false}
          />
        ))}
      </div>
      <hr />

      <div className="d-flex mt-3">
        <Button className="w-100 me-1" size="sm" disabled={allSelectedLabel.length === 0}>
          Expand
        </Button>
        <Button className="w-100 ms-1" size="sm" disabled={allSelectedLabel.length === 0}>
          Merge
        </Button>
      </div>
    </Col>
  );
};

export default MergeWidget;

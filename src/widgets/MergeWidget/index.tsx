import React, { useState } from "react";
import "./MergeWidget.css";
import { Button, Col, Row } from "react-bootstrap";
import useLabelSelection from "../../hook/useLabelSelection";
import ElementSelectButton from "../util/elements";
import { sendElement } from "../../api/ImageElementAPI";

const MergeWidget: React.FC = () => {
  const [isLoading, setLoading] = useState(false);

  const { getAllSelectedLabel } = useLabelSelection();
  const allSelectedLabel = getAllSelectedLabel();

  // Send api request with allSelectedLabel in the body
  const handleMergeClick = () => {
    setLoading(true);
    sendElement({ elements: allSelectedLabel }).then((res: any) => {
      setLoading(false);
      console.log(res);
    });
  };

  return (
    <Col className="mergeWidgetWrapper">
      <div className="d-flex flex-wrap justify-content-center">
        {allSelectedLabel.map((label) => (
          <ElementSelectButton
            filename={label.fileid}
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
        <Button
          className="w-100 me-1"
          size="sm"
          disabled={allSelectedLabel.length === 0}
          onClick={() => {
            console.log("Expand");
          }}
        >
          Expand
        </Button>
        <Button
          className="w-100 ms-1"
          size="sm"
          onClick={!isLoading ? handleMergeClick : () => {}}
          disabled={allSelectedLabel.length === 0 || isLoading}
        >
          {!isLoading ? "Merge keywords" : "Merging..."}
        </Button>
      </div>
    </Col>
  );
};

export default MergeWidget;

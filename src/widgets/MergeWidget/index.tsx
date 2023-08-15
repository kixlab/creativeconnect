import React, { useState } from "react";
import "./MergeWidget.css";
import { Col } from "react-bootstrap";
import useLabelSelection from "../../hook/useLabelSelection";
import ElementSelectButton from "../util/elements";
import { getDescriptions } from "../../api/ImageElementAPI";
import LayoutDrawer from "./layoutDrawer";

const MergeWidget: React.FC = () => {
  const [isLoading, setLoading] = useState(false);
  const [descriptions, setDescriptions] = useState<any[]>([]);
  const [selectedDescription, setSelectedDescription] = useState<any | null>(null);

  const { getAllSelectedLabel } = useLabelSelection();
  const allSelectedLabel = getAllSelectedLabel();

  // Send api request with allSelectedLabel in the body
  const handleMergeClick = () => {
    setLoading(true);
    getDescriptions({ elements: allSelectedLabel }).then((res: any) => {
      setLoading(false);
      setDescriptions(res.data.descriptions);
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

      <div className="text-center my-3">
        <button
          className="btn btn-custom-round-icon m-auto"
          onClick={!isLoading ? handleMergeClick : () => {}}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
              <span className="visually-hidden" role="status">
                Loading...
              </span>
            </>
          ) : (
            <img
              width={25}
              height={25}
              src={`${process.env.PUBLIC_URL}/assets/merge-icon.svg`}
              alt="merge"
            />
          )}
        </button>
        <hr style={{ marginTop: "-20px" }} />
      </div>
      {descriptions.length > 0 && (
        <div className="mt-5">
          <h6>Merge results : Select the one you like</h6>
          {descriptions.map((des) => (
            <button
              className={
                selectedDescription === des
                  ? "btn btn-custom text-start my-1"
                  : "btn btn-outline-custom text-start my-1"
              }
              onClick={() => setSelectedDescription(des)}
            >
              <div style={{ fontSize: "small" }}>
                <b>Background</b>: {des.background} <br />
                {des.objects.map((obj: any) => (
                  <>
                    <b>{obj.object}</b>: {obj.detail} <br />
                  </>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}
      {selectedDescription && <LayoutDrawer description={selectedDescription} />}
    </Col>
  );
};

export default MergeWidget;

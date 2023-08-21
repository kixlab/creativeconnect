import React, { useState } from "react";
import "./MergeWidget.css";
import { Col } from "react-bootstrap";
import useLabelSelection from "../../hook/useLabelSelection";
import ElementSelectButton from "../util/elements";
import { getDescriptions, getImage } from "../../api/ImageElementAPI";
import LayoutDrawer from "./layoutDrawer";
import useStarredImageList from "../../hook/useStarredImageList";

const MergeWidget: React.FC = () => {
  const [isLoading, setLoading] = useState(false);
  const [descriptions, setDescriptions] = useState<any[]>([]);
  const [selectedDescription, setSelectedDescription] = useState<any | null>(null);
  const [imageId, setImageId] = useState<string>("");
  const [imageData, setImageData] = useState<any | null>(null);
  const [imageSrc, setImageSrc] = useState<string>("");

  const { getAllSelectedLabel } = useLabelSelection();
  const { addStarredImage, removeStarredImage, findStarredImage } = useStarredImageList();
  const allSelectedLabel = getAllSelectedLabel();

  const handleMergeClick = () => {
    setLoading(true);
    getDescriptions({ elements: allSelectedLabel }).then((res: any) => {
      setLoading(false);
      setDescriptions(res.data.descriptions);
    });
  };

  const onSubmit = (data: any) => {
    setImageData(data);
    getImage(data).then((res: any) => {
      console.log(res);
      const url = URL.createObjectURL(res.data);
      setImageSrc(url);
      setImageId(new Date().getTime().toString());
    });
  };

  const handleStarClick = () => {
    if (findStarredImage(imageId)) removeStarredImage(imageId);
    else
      addStarredImage({
        id: imageId,
        src: imageSrc,
        data: imageData,
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
                <b>Scene</b>: {des.scene} <br />
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
      {selectedDescription && (
        <>
          <LayoutDrawer description={selectedDescription} onSubmit={onSubmit} />
          {imageSrc && (
            <div
              className="position-relative w-50"
              style={{
                borderRadius: "0.25rem",
              }}
            >
              <button
                type="button"
                className="btn btn-lg position-absolute top-0 end-0"
                style={{ color: "#FFC107" }}
                onClick={handleStarClick}
              >
                {findStarredImage(imageId) ? (
                  <i className="bi bi-star-fill"></i>
                ) : (
                  <i className="bi bi-star"></i>
                )}
              </button>
              <img
                className="w-100"
                style={{
                  borderRadius: "0.25rem",
                }}
                alt="result"
                src={imageSrc}
                id={imageId}
              />
            </div>
          )}
        </>
      )}
    </Col>
  );
};

export default MergeWidget;

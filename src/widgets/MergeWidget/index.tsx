import React, { useEffect, useState } from "react";
import "./MergeWidget.css";
import { Col, Modal } from "react-bootstrap";
import useLabelSelection from "../../hook/useLabelSelection";
import ElementSelectButton from "../util/elements";
import { BACKEND_BASEURL, getDescriptions, getImage } from "../../api/ImageElementAPI";
import LayoutDrawer from "./layoutDrawer";
import useStarredImageList from "../../hook/useStarredImageList";

const MergeWidget: React.FC = () => {
  const [isLoading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [descriptions, setDescriptions] = useState<any[]>([]);
  const [selectedDescription, setSelectedDescription] = useState<any | null>(null);
  const [imageSrcs, setImageSrcs] = useState<string[]>([]);

  // Modal
  const [show, setShow] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState<string>("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { selectedLabelList } = useLabelSelection();
  const { addStarredImage, removeStarredImage, findStarredImage } = useStarredImageList();

  useEffect(() => {
    setDescriptions([]);
    setSelectedDescription(null);
  }, [selectedLabelList]);

  const handleMergeClick = () => {
    setLoading(true);
    getDescriptions(selectedLabelList)
      .then((res: any) => {
        setLoading(false);
        setDescriptions(res.data.descriptions);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const onSubmit = (data: any) => {
    setRegenerating(true);
    getImage(data).then((res: any) => {
      setImageSrcs(res.data.image_path_sketch);
      setRegenerating(false);
    });
  };

  const handleStarClick = (imageId: string) => {
    if (findStarredImage(imageId)) removeStarredImage(imageId);
    else
      addStarredImage({
        id: imageId,
        src: BACKEND_BASEURL + imageId,
      });
  };

  return (
    <Col className="mergeWidgetWrapper">
      <div className="d-flex flex-wrap justify-content-center">
        {selectedLabelList.map((label) => (
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
            <div className="d-flex align-items-center">
              <div className="position-relative" style={{ width: "150px", marginRight: "1rem" }}>
                <button
                  type="button"
                  className="btn btn-lg position-absolute top-0 end-0"
                  style={{ color: "#FFC107" }}
                  onClick={() => handleStarClick(des.image_path_sketch[0])}
                >
                  {findStarredImage(des.image_path_sketch[0]) ? (
                    <i className="bi bi-star-fill"></i>
                  ) : (
                    <i className="bi bi-star"></i>
                  )}
                </button>
                <img
                  style={{ width: "150px" }}
                  src={BACKEND_BASEURL + des.image_path_sketch[0]}
                  alt="result"
                  onClick={() => {
                    setModalImageSrc(BACKEND_BASEURL + des.image_path_sketch[0]);
                    handleShow();
                  }}
                />
              </div>

              <div style={{ fontSize: "small" }}>
                <p>{des.caption}</p>
                <button
                  onClick={() => setSelectedDescription(des)}
                  className="btn btn-custom btn-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedDescription && (
        <>
          <LayoutDrawer
            description={selectedDescription}
            onSubmit={onSubmit}
            loading={regenerating}
          />
          <div className="d-flex">
            {imageSrcs.map((src) => (
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
                  onClick={() => handleStarClick(src)}
                >
                  {findStarredImage(src) ? (
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
                  src={BACKEND_BASEURL + src}
                  id={src}
                  onClick={() => {
                    setModalImageSrc(BACKEND_BASEURL + src);
                    handleShow();
                  }}
                />
              </div>
            ))}
          </div>
        </>
      )}
      <Modal show={show} onHide={handleClose} style={{ marginTop: "20vh" }}>
        <Modal.Body>
          <img className="w-100" src={modalImageSrc} alt="modal" />
        </Modal.Body>
      </Modal>
    </Col>
  );
};

export default MergeWidget;

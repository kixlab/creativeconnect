import React, { useState } from "react";
import "../MergeWidget/MergeWidget.css";
import { Col, Modal } from "react-bootstrap";
import { BACKEND_BASEURL, getImage } from "../../api/ImageElementAPI";
import LayoutDrawer from "../MergeWidget/layoutDrawer";
import useStarredImageList from "../../hook/useStarredImageList";
import { addLog } from "../../api/log";

const DiffusionWidget: React.FC = () => {
  const [isLoading, setLoading] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState<any | null>({
    layout: [["object1", [0.42, 0.29, 0.198, 0.318]]],
    objects: {
      object1: "Example object",
    },
    caption: "Example caption",
  });
  // const [imageId, setImageId] = useState<string>("");
  // const [imageSrc, setImageSrc] = useState<string>("");
  const [sketches, setSketches] = useState<any[]>([]);

  // Modal
  const [show, setShow] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState<string>("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { addStarredImage, removeStarredImage, findStarredImage } = useStarredImageList();

  const onSubmit = (data: any) => {
    setLoading(true);
    addLog("generateImageManually", {
      layout: data.layout,
      objects: data.objects,
      caption: data.caption,
    });
    getImage(data).then((res: any) => {
      setLoading(false);
      setSketches(res.data.image_path_sketch);
      // setImageSrc(BACKEND_BASEURL + res.data.image_path_sketch[0]);
      // setImageId(new Date().getTime().toString());
    });
  };

  const handleStarClick = (filename: string) => {
    addLog("starImgae", {
      filename: filename,
    });
    if (findStarredImage(filename)) removeStarredImage(filename);
    else
      addStarredImage({
        id: filename,
        src: BACKEND_BASEURL + filename,
      });
  };

  return (
    <Col className="mergeWidgetWrapper">
      <LayoutDrawer description={selectedDescription} onSubmit={onSubmit} loading={isLoading} />

      {sketches.map((filename) => (
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
            onClick={() => handleStarClick(filename)}
          >
            {findStarredImage(filename) ? (
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
            src={BACKEND_BASEURL + filename}
            id={filename}
            onClick={() => {
              setModalImageSrc(BACKEND_BASEURL + filename);
              handleShow();
            }}
          />
        </div>
      ))}
      <Modal show={show} onHide={handleClose} style={{ marginTop: "20vh" }}>
        <Modal.Body>
          <img className="w-100" src={modalImageSrc} alt="modal" />
        </Modal.Body>
      </Modal>
    </Col>
  );
};

export default DiffusionWidget;

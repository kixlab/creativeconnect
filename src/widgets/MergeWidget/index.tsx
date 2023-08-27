import React, { useEffect, useState } from "react";
import "./MergeWidget.css";
import { Col, Modal } from "react-bootstrap";
import useLabelSelection from "../../hook/useLabelSelection";
import ElementSelectButton from "../util/elements";
import {
  BACKEND_BASEURL,
  getDescriptions,
  getImage,
  getImageFromDescription,
  getLayout,
  getMoreSketches,
} from "../../api/ImageElementAPI";
// import LayoutDrawer from "./layoutDrawer";
import useStarredImageList from "../../hook/useStarredImageList";
import { addLog } from "../../api/log";

const MergeWidget: React.FC = () => {
  const [isLoading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [descriptions, setDescriptions] = useState<any[]>([]);

  const [sketches, setSketches] = useState(new Array(3).fill(null));
  const [originalLayout, setOriginalLayout] = useState([]);
  const [moresketches, setMoreSketches] = useState<string[]>([]);
  const [generatingMore, setGeneratingMore] = useState(false);

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
    setMoreSketches([]);
  }, [selectedLabelList]);

  useEffect(() => {
    let layoutReferenceImages = selectedLabelList.filter(
      (keyword) => keyword.type === "Arrangement"
    );
    if (layoutReferenceImages.length === 0) setOriginalLayout([]);
    else {
      let layoutImage =
        layoutReferenceImages[Math.floor(Math.random() * layoutReferenceImages.length)].fileid;
      getLayout(layoutImage).then((res) => {
        setOriginalLayout(res.data.bboxes);
      });
    }
  }, [selectedLabelList]);

  const handleMergeClick = () => {
    addLog("mergeKeywords", {
      keywords: selectedLabelList.map((label) => label.type + ":" + label.keyword),
    });

    setLoading(true);
    getDescriptions(selectedLabelList)
      .then((res: any) => {
        setLoading(false);
        setDescriptions(res.data.descriptions);
        setSketches(new Array(res.data.descriptions.length).fill(null));

        const fetchImagesSequentially = async () => {
          for (let i = 0; i < res.data.descriptions.length; i++) {
            const des = res.data.descriptions[i];
            const response = await getImageFromDescription(des);
            setSketches((prev) => {
              const newSketches = [...prev];
              newSketches[i] = response.data.image_path_sketch[0];
              return newSketches;
            });
          }
        };
        fetchImagesSequentially();
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
    addLog("starImgae", {
      filename: imageId,
    });
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
          {descriptions.map((des, i) => (
            <div className="d-flex align-items-center">
              <div className="position-relative" style={{ width: "150px", marginRight: "1rem" }}>
                {sketches[i] ? (
                  <>
                    <button
                      type="button"
                      className="btn btn-lg position-absolute top-0 end-0"
                      style={{ color: "#FFC107" }}
                      onClick={() => handleStarClick(sketches[i])}
                    >
                      {findStarredImage(sketches[i]) ? (
                        <i className="bi bi-star-fill"></i>
                      ) : (
                        <i className="bi bi-star"></i>
                      )}
                    </button>
                    <img
                      style={{ width: "150px" }}
                      src={BACKEND_BASEURL + sketches[i]}
                      alt="result"
                      onClick={() => {
                        setModalImageSrc(BACKEND_BASEURL + sketches[i]);
                        handleShow();
                      }}
                    />
                  </>
                ) : (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ width: "150px" }}
                  >
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ fontSize: "small" }}>
                <p>{des.caption}</p>
                <button
                  onClick={() => {
                    addLog("getMoreSketches", {
                      description: des,
                    });
                    setGeneratingMore(true);
                    getMoreSketches(des, originalLayout).then((res: any) => {
                      setMoreSketches(res.data.image_path_sketch);
                      setGeneratingMore(false);
                    });
                  }}
                  disabled={generatingMore}
                  className="btn btn-custom btn-sm"
                >
                  More sketches
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <hr />
      <div className="d-flex flex-wrap">
        {moresketches.map((src) => (
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
      {/* {selectedDescription && (
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
      )} */}
      <Modal show={show} onHide={handleClose} style={{ marginTop: "20vh" }}>
        <Modal.Body>
          <img className="w-100" src={modalImageSrc} alt="modal" />
        </Modal.Body>
      </Modal>
    </Col>
  );
};

export default MergeWidget;

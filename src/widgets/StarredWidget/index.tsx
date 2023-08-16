import React from "react";
import { Col } from "react-bootstrap";

import "./starredWidget.css";
import useStarredImageList from "../../hook/useStarredImageList";

const StarredWidget: React.FC = () => {
  const { removeStarredImage, getAllStarredImage } = useStarredImageList();
  const starredImages = getAllStarredImage();

  return (
    <Col className="starredWidgetWrapper">
      <h6>Starred Recombinations</h6>
      <div className="d-flex flex-wrap justify-content-center">
        {starredImages.map((image) => (
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
              onClick={() => removeStarredImage(image.id)}
            >
              <i className="bi bi-star-fill"></i>
            </button>
            <img
              className="w-100"
              style={{
                borderRadius: "0.25rem",
              }}
              alt="result"
              src={image.src}
              id={image.id}
            />
          </div>
        ))}
      </div>
    </Col>
  );
};

export default StarredWidget;

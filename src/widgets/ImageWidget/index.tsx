import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { nanoid } from "nanoid";
import Drag from "../../util/Drag";
import TRIGGER from "../../config/trigger";
import { sendImage } from "../../api/ImageElementAPI";
import { onnxMaskToImage } from "../../util/maskUtils";
import ElementSelectButton from "../util/elements";

import "./ImageWidget.css";

type UploadedImage = {
  id: string;
  keywords?: any[];
  filename: string;
  src: string;
};

const ImageWidget: React.FC = () => {
  const [isLoading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);

  const uploadImage = () => {
    const fileReader = new FileReader();
    fileReader.onloadend = (e) => {
      setLoading(true);
      const fileContent = e.target?.result;
      sendImage({ image: fileContent }).then((res: any) => {
        console.log(res);
        setUploadedImage({
          id: nanoid(),
          src: fileReader.result as string,
          keywords: res.data.keywords,
          filename: res.data.filename,
        });
        setLoading(false);
      });
    };
    const file = document.createElement("input");
    file.type = "file";
    file.accept = "image/png, image/jpeg";
    file.onchange = (e) => {
      const event = e;
      if (event.target && (event.target as HTMLInputElement).files) {
        Object.values((event.target as HTMLInputElement).files!).forEach((file) => {
          fileReader.readAsDataURL(file);
        });
      }
    };
    file.click();
  };

  return (
    <Col className="imageWidgetWrapper">
      <Button
        className="w-100 mb-3"
        size="sm"
        onClick={!isLoading ? uploadImage : () => {}}
        disabled={isLoading}
      >
        <i className="bi-plus" />
        {!isLoading ? "Upload Image" : "Uploading..."}
      </Button>

      <Row xs={1}>
        {uploadedImage && (
          <ImageThumbnail key={`image-thumbnail-${uploadedImage.id}`} data={uploadedImage} />
        )}
      </Row>
    </Col>
  );
};

export default ImageWidget;

const ImageThumbnail: React.FC<{
  data: Omit<UploadedImage, "image">;
}> = ({ data: { id, filename, ...data } }) => {
  const [selectedKeywords, setSelectedKeywords] = useState<any[]>([]);
  const [segmentMask, setSegmentMask] = useState<HTMLImageElement | null>(null);
  return (
    <div>
      <Form>
        <Drag
          dragType="copyMove"
          dragSrc={{
            trigger: TRIGGER.INSERT.IMAGE,
            "data-item-type": "image",
            src: data.src.startsWith("data:")
              ? data.src
              : `${process.env.PUBLIC_URL}/assets/image/${data.src}`,
            keywords: selectedKeywords,
            filename: filename,
          }}
        >
          <div className="position-relative">
            <img
              alt={id}
              style={{ maxHeight: "300px", objectFit: "contain" }}
              className="w-100"
              src={
                data.src.startsWith("data:")
                  ? data.src
                  : `${process.env.PUBLIC_URL}/assets/image/${data.src}`
              }
            />
            {segmentMask && (
              <img
                alt={id}
                style={{
                  maxHeight: "300px",
                  objectFit: "contain",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
                className="w-100"
                src={segmentMask.src}
              />
            )}
          </div>
        </Drag>
        <h5 className="my-3">Select why you liked this reference</h5>

        {data.keywords?.map((keyword) => (
          <ElementSelectButton
            filename={filename}
            key={filename + "-" + keyword.type + "-" + keyword.keyword}
            elementName={keyword.keyword}
            elementType={keyword.type}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedKeywords((prev) => [...prev, keyword]);
              } else
                setSelectedKeywords((prev) =>
                  prev.filter((prevKeyword) => prevKeyword !== keyword)
                );
            }}
            onMouseEnter={() => {
              if (keyword.mask)
                setSegmentMask(
                  onnxMaskToImage(keyword.mask.flat(), keyword.mask.length, keyword.mask[0].length)
                );
            }}
            onMouseLeave={() => {
              setSegmentMask(null);
            }}
            button={true}
          />
        ))}
      </Form>
      <hr />
    </div>
  );
};

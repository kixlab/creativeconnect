import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { nanoid } from "nanoid";
import { ImageItemKind } from "../../view/object/image";
import Drag from "../../util/Drag";
import TRIGGER from "../../config/trigger";
import useImageAsset from "../../hook/useImageAsset";
import colorMapping from "../../config/colorMapping";
import "./ImageWidget.css";
import { sendImage } from "../../api/ImageElementAPI";
import { onnxMaskToImage } from "../../util/maskUtils";

export const IMAGE_LIST_KEY = "importedImage";

const ImageWidget: React.FC = () => {
  const [isLoading, setLoading] = useState(false);
  const { setImageAsset, getAllImageAsset } = useImageAsset();
  const [imageAssetList, setImageAssetList] = useState(() => {
    if (getAllImageAsset().length) {
      return [...getAllImageAsset()!];
    }
    return [];
  });

  const uploadImage = () => {
    const fileReader = new FileReader();
    fileReader.onloadend = (e) => {
      setLoading(true);
      const fileContent = e.target?.result;
      sendImage({ image: fileContent }).then((res: any) => {
        console.log(res);
        setImageAssetList((prev) => {
          const result = [
            {
              type: "image",
              id: nanoid(),
              name: res.data.filename,
              src: fileReader.result as string,
              keywords: res.data.keywords,
            },
            ...prev,
          ];
          setImageAsset(result);
          return result;
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
        {imageAssetList.map((_data) => (
          <ImageThumbnail
            key={`image-thumbnail-${_data.id}`}
            data={{
              id: _data.id,
              src: _data.src ?? `find:${_data.id}`,
              name: _data.name,
              keywords: _data.keywords,
              "data-item-type": _data.type,
            }}
          />
        ))}
      </Row>
    </Col>
  );
};

export default ImageWidget;

const ImageThumbnail: React.FC<{
  data: Omit<ImageItemKind, "image">;
}> = ({ data: { id, ...data } }) => {
  const [selectedKeywords, setSelectedKeywords] = useState<any[]>([]);
  const [segmentMask, setSegmentMask] = useState<HTMLImageElement | null>(null);
  return (
    <div>
      <Form>
        <Drag
          dragType="copyMove"
          dragSrc={{
            trigger: TRIGGER.INSERT.IMAGE,
            "data-item-type": data["data-item-type"],
            src: data.src.startsWith("data:")
              ? data.src
              : `${process.env.PUBLIC_URL}/assets/image/${data.src}`,
            keywords: selectedKeywords,
          }}
        >
          <div className="position-relative">
            <img
              alt={data.name}
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
                alt={data.name}
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
            id={id}
            key={id + "-" + keyword.type + "-" + keyword.keyword}
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
          />
        ))}
      </Form>
      <hr />
    </div>
  );
};

const ElementSelectButton: React.FC<{
  id: string;
  elementType: string;
  elementName: string | undefined;
  onChange: (e: any) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}> = ({ id, elementType, elementName, onChange, onMouseEnter, onMouseLeave }) => {
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);
  const handleChange = (e: any) => {
    setSelected(e.target.checked);
    onChange(e);
  };
  const color = colorMapping[elementType];
  return (
    <>
      <input
        type="checkbox"
        className="btn-check"
        id={id + "-" + elementType + "-" + elementName}
        onChange={handleChange}
        autoComplete="off"
        checked={selected}
      />
      <label
        className="btn btn-outline-primary btn-sm me-1 mb-1"
        htmlFor={id + "-" + elementType + "-" + elementName}
        onMouseEnter={() => {
          setHovered(true);
          onMouseEnter();
        }}
        onMouseLeave={() => {
          setHovered(false);
          onMouseLeave();
        }}
        style={{
          color: selected || hovered ? "white" : color,
          borderColor: color,
          backgroundColor: selected || hovered ? color : "transparent",
        }}
      >
        {elementType + ": " + elementName}
      </label>
    </>
  );
};

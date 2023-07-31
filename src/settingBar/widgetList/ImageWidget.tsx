import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { nanoid } from "nanoid";
import presetImageList from "../../config/image.json";
import { ImageItemKind } from "../../view/object/image";
import sizeStyles from "../../style/size.module.css";
import Drag from "../../util/Drag";
import TRIGGER from "../../config/trigger";
import useImageAsset from "../../hook/useImageAsset";
import useI18n from "../../hook/usei18n";
import colorMapping from "../../config/colorMapping";

export const IMAGE_LIST_KEY = "importedImage";

const ImageWidget: React.FC = () => {
  const { setImageAsset, getAllImageAsset } = useImageAsset();
  const { getTranslation } = useI18n();
  const [imageAssetList, setImageAssetList] = useState(() => {
    if (getAllImageAsset().length) {
      return [...getAllImageAsset()!];
    }
    setImageAsset(presetImageList);
    return [...presetImageList];
  });

  const getKeywordList = (image: any) => {
    return [
      {
        type: "action",
        keyword: "running",
        position: {
          x: 0.4,
          y: 0.3,
        },
      },
      {
        type: "object",
        keyword: "butterfly",
        position: {
          x: 0.4,
          y: 0.3,
        },
      },
      {
        type: "layout",
        position: {
          x: 0.4,
          y: 0.3,
        },
      },
    ];
  };

  const uploadImage = () => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const keywordList = getKeywordList(fileReader.result);
      setImageAssetList((prev) => {
        const result = [
          {
            type: "image",
            id: nanoid(),
            name: "imported image",
            src: fileReader.result as string,
            keywords: keywordList,
          },
          ...prev,
        ];
        setImageAsset(result);
        return result;
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
    <Col className={[sizeStyles["mx-h-50vh"]].join(" ")}>
      <Button className="w-100 mb-3" size="sm" onClick={uploadImage}>
        <i className="bi-plus" />
        Import Image
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
            maxPx={200}
          />
        ))}
      </Row>
    </Col>
  );
};

export default ImageWidget;

const ImageThumbnail: React.FC<{
  maxPx: number;
  data: Omit<ImageItemKind, "image">;
}> = ({ data: { id, ...data }, maxPx }) => {
  const { getImageAssetSrc } = useImageAsset();
  const [selectedKeywords, setSelectedKeywords] = useState<any[]>([]);
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
          <img
            alt={data.name}
            style={{ maxWidth: `${maxPx}px`, maxHeight: `${maxPx}px` }}
            src={
              data.src.startsWith("data:")
                ? data.src
                : `${process.env.PUBLIC_URL}/assets/image/${data.src}`
            }
          />
        </Drag>
        <h5 className="mt-3">Select why you liked this reference</h5>

        {data.keywords?.map((keyword) => (
          <Form.Check
            type="checkbox"
            id={id + "-" + keyword.type + "-" + keyword.keyword}
            key={id + "-" + keyword.type + "-" + keyword.keyword}
            label={keyword.type + ":" + keyword.keyword}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedKeywords((prev) => [...prev, keyword]);
              } else
                setSelectedKeywords((prev) =>
                  prev.filter((prevKeyword) => prevKeyword !== keyword)
                );
            }}
            style={{ color: colorMapping[keyword.type], fontWeight: "bold" }}
          />
        ))}
      </Form>
      <hr />
    </div>
  );
};

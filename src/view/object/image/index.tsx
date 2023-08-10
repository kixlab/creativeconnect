import Konva from "konva";
import React, { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { Image as KonvaImage, Label, Tag, Text } from "react-konva";
import useDragAndDrop from "../../../hook/useDragAndDrop";
import { OverrideItemProps } from "../../../hook/useItem";
import useStage from "../../../hook/useStage";
import { StageData } from "../../../redux/currentStageData";
import { decimalUpToSeven } from "../../../util/decimalUpToSeven";
import colorMapping from "../../../config/colorMapping";
import useLabelSelection from "../../../hook/useLabelSelection";
import { SelectedLabelListItem } from "../../../redux/selectedLabelList";

export type ImageItemKind = {
  "data-item-type": string;
  id: string;
  name: string;
  src: string;
  keywords?: {
    type: string;
    keyword?: string;
    position?: {
      x: number;
      y: number;
    };
    mask: boolean[][];
  }[];
  image: typeof Image;
};

export type ImageItemProps = OverrideItemProps<{
  data: StageData;
  e?: DragEvent;
}>;

const ImageItem: React.FC<ImageItemProps> = ({ data, e, onSelect }) => {
  const { attrs } = data;
  const imageRef = useRef() as RefObject<Konva.Image>;
  const [imageSrc, setImageSrc] = useState<CanvasImageSource>(new Image());

  const stage = useStage();
  const { onDragMoveFrame, onDragEndFrame, checkIsInFrame } = useDragAndDrop(
    stage.stageRef,
    stage.dragBackgroundOrigin
  );

  useEffect(() => {
    const newImage = new Image();
    newImage.onload = () => {
      setImageSrc(newImage);
    };
    newImage.crossOrigin = "Anonymous";
    let source;
    if (attrs.src.startsWith("find:")) {
      source = attrs.src;
    } else {
      source = attrs.src;
    }
    if (source.startsWith("data:")) {
      Konva.Image.fromURL(source, (imageNode: Konva.Image) => {
        let width;
        let height;
        if (imageNode.width() > imageNode.height()) {
          width = decimalUpToSeven(512);
          height = decimalUpToSeven(width * (imageNode.height() / imageNode.width()));
        } else {
          height = decimalUpToSeven(512);
          width = decimalUpToSeven(height * (imageNode.width() / imageNode.height()));
        }
        imageNode.width(width);
        imageNode.height(height);
        const newBase64 = imageNode.toDataURL({
          x: 0,
          y: 0,
          width,
          height,
          pixelRatio: 5,
        });
        newImage.src = newBase64;
      });
      return;
    }
    newImage.src = source;
  }, [attrs.src]);

  useEffect(() => {
    if (imageRef.current) {
      stage.setStageRef(imageRef.current!.getStage()!);
      imageRef.current.brightness(data.attrs.brightness);
      checkIsInFrame(imageRef.current);
      imageRef.current.cache();
    }
  }, [imageSrc, data]);

  useEffect(() => {
    imageRef.current!.cache();
  }, []);

  const objectKeywords = data.keywords?.filter((keyword) => keyword.type === "object");
  const otherKeywords = data.keywords?.filter((keyword) => keyword.type !== "object");

  return (
    <>
      <KonvaImage
        ref={imageRef}
        image={imageSrc}
        onClick={onSelect}
        name="label-target"
        data-item-type="image"
        data-frame-type="image"
        id={data.id}
        x={attrs.x}
        y={attrs.y}
        width={attrs.width}
        height={attrs.height}
        scaleX={attrs.scaleX}
        scaleY={attrs.scaleY}
        fill={attrs.fill ?? "transparent"}
        opacity={attrs.opacity ?? 1}
        rotation={attrs.rotation ?? 0}
        draggable
        onDragMove={onDragMoveFrame}
        onDragEnd={onDragEndFrame}
      />
      {objectKeywords?.map((keyword) => {
        const xpos =
          (imageRef.current?.x() ?? 0) +
          keyword.position.x * (imageRef.current?.width() ?? 0) * (imageRef.current?.scaleX() ?? 0);
        const ypos =
          (imageRef.current?.y() ?? 0) +
          keyword.position.y *
            (imageRef.current?.height() ?? 0) *
            (imageRef.current?.scaleY() ?? 0);
        return (
          <ImageLabel
            xpos={xpos}
            ypos={ypos}
            imageId={data.id}
            type={keyword.type}
            keyword={keyword.keyword ?? ""}
          />
        );
      })}
      {otherKeywords?.map((keyword, i) => {
        const xpos = imageRef.current?.x() ?? 0;
        const ypos =
          (imageRef.current?.y() ?? 0) +
          (imageRef.current?.height() ?? 0) * (imageRef.current?.scaleY() ?? 0) +
          30 * i +
          20;
        return (
          <ImageLabel
            xpos={xpos}
            ypos={ypos}
            imageId={data.id}
            type={keyword.type}
            keyword={keyword.keyword ?? ""}
          />
        );
      })}
    </>
  );
};

const ImageLabel: React.FC<{
  xpos: number;
  ypos: number;
  imageId: string;
  type: string;
  keyword: string;
}> = ({ xpos, ypos, imageId, type, keyword }) => {
  const { addSelectedLabel, removeSelectedLabel, getAllSelectedLabel } = useLabelSelection();
  const allSelectedLabel = getAllSelectedLabel();
  const isSelected = useMemo(() => {
    return allSelectedLabel.some((label) => {
      return label.id === imageId + "-" + type + "-" + keyword;
    });
  }, [allSelectedLabel, imageId, type, keyword]);

  const labelEntity: SelectedLabelListItem = {
    id: imageId + "-" + type + "-" + keyword,
    type,
    fileid: imageId,
    keyword,
  };

  return (
    <Label
      x={xpos}
      y={ypos}
      key={imageId + "-" + type + ": " + keyword}
      onClick={() => {
        if (isSelected) removeSelectedLabel(labelEntity.id);
        else addSelectedLabel(labelEntity);
      }}
    >
      <Tag
        name="label-tag"
        pointerDirection="left"
        fill={isSelected ? colorMapping[type] : "transparent"}
        strokeWidth={1}
        stroke={colorMapping[type]}
        cornerRadius={5}
      />
      <Text
        text={type + ": " + keyword}
        name="label-text"
        fontSize={14}
        lineHeight={1.2}
        padding={6}
        fill={isSelected ? "white" : colorMapping[type]}
      />
    </Label>
  );
};

export default ImageItem;

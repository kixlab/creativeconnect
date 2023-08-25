import Konva from "konva";
import { Vector2d } from "konva/lib/types";
import { MutableRefObject, useCallback } from "react";
import { nanoid } from "nanoid";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { Group } from "konva/lib/Group";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { decimalUpToSeven } from "../util/decimalUpToSeven";
import { getFramePos } from "../view/frame";
import useItem from "./useItem";

import TRIGGER from "../config/trigger";
import { DropCallback } from "../util/eventHandler/dragAndDrop";
import { StageData } from "../redux/currentStageData";

const useDragAndDrop = (
  stageRef: MutableRefObject<Konva.Stage>,
  dragBackgroudOrigin: MutableRefObject<Vector2d>
) => {
  const { createItem, updateItem } = useItem();

  const insertImage = (e: DragEvent, data: { [key: string]: any }) => {
    const imageSrc = new Image();
    let source = data.src;

    source = data.src;

    imageSrc.onload = () => {
      let width;
      let height;
      if (imageSrc.width > imageSrc.height) {
        width = decimalUpToSeven(512);
        height = decimalUpToSeven(width * (imageSrc.height / imageSrc.width));
      } else {
        height = decimalUpToSeven(512);
        width = decimalUpToSeven(height * (imageSrc.width / imageSrc.height));
      }
      const position = getFramePos(stageRef!.current!, e, width, height);
      const newImage: StageData = {
        id: nanoid(),
        attrs: {
          name: "label-target",
          "data-item-type": "image",
          x: position.x,
          y: position.y,
          width,
          height,
          src: data.src,
          zIndex: 0,
          brightness: 0,
          _filters: ["Brighten"],
          updatedAt: Date.now(),
        },
        children: [],
        keywords: data.keywords,
        allKeywords: data.allKeywords,
        filename: data.filename,
      };

      createItem(newImage);
    };
    imageSrc.src = source;
  };

  const insertKeyword = (e: DragEvent, data: { [key: string]: any }) => {
    const position = getFramePos(stageRef!.current!, e, 0, 0);
    const newKeyword: StageData = {
      id: nanoid(),
      attrs: {
        name: "label-target",
        "data-item-type": "keyword",
        x: position.x,
        y: position.y,
        zIndex: 0,
        brightness: 0,
        updatedAt: Date.now(),
      },
      children: [],
      keyword: data.keyword,
    };

    createItem(newKeyword);
  };

  const onDropOnStage: DropCallback = (dragSrc, e) => {
    if (!stageRef.current) {
      return;
    }
    const { trigger, ...data } = dragSrc;

    data.id = nanoid();
    console.log("trigger", trigger);
    switch (trigger) {
      case TRIGGER.INSERT.IMAGE:
        return insertImage(e, data);
      case TRIGGER.INSERT.KEYWORD:
        return insertKeyword(e, data);
      default:
    }
  };

  const getItemsInThisFrame = (frame: Node<NodeConfig>) => {
    const stage = frame.getStage();
    if (!stage) {
      return;
    }
    const items = stage
      .getChildren()[0]
      .getChildren(
        (_item) => _item.attrs.name === "label-target" && _item.attrs["data-item-type"] !== "frame"
      )
      .filter((_item) => isInFrame(frame, _item));
    return items;
  };

  const checkIsInFrame = (item: Node<NodeConfig>) => {
    const stage = item.getStage();
    if (!stage) {
      return;
    }
    const frameGroups = stage
      .getChildren()[0]
      .getChildren((_item) => _item.attrs.name === "label-group");
    const frame = frameGroups.find((_item) => {
      const targetFrame = (_item as Group).findOne("Rect");
      if (!targetFrame) {
        return false;
      }
      return isInFrame(targetFrame, item);
    });
    if (frame) {
      (frame as Group).add(item as Shape<ShapeConfig>);
      (frame as Group).getLayer()?.batchDraw();
      return true;
    }
    return false;
  };

  const moveToLayer = (item: Shape<ShapeConfig>) => {
    const newParent = item.getLayer();
    item.getParent().children =
      (item.getParent().children as Node<NodeConfig>[])?.filter(
        (_item) => _item.id() !== item.id()
      ) ?? item.getParent().children;
    if (newParent) {
      newParent.add(item);
    }
    item.getLayer()?.batchDraw();
  };

  const onDragMoveFrame = useCallback((e: KonvaEventObject<DragEvent>) => {
    if (checkIsInFrame(e.target)) {
      return;
    }
    if (e.target.getLayer() !== e.target.getParent()) {
      moveToLayer(e.target as Shape<ShapeConfig>);
    }
  }, []);

  const onDragEndFrame = (e: KonvaEventObject<DragEvent>) => {
    e.evt.preventDefault();
    e.evt.stopPropagation();
    updateItem(e.target.id(), () => ({
      ...e.target.attrs,
    }));
    e.target.getLayer()?.batchDraw();
  };

  return {
    onDropOnStage,
    checkIsInFrame,
    getItemsInThisFrame,
    onDragMoveFrame,
    onDragEndFrame,
    moveToLayer,
  };
};

export default useDragAndDrop;

const isInFrame = (targetFrame: Node<NodeConfig>, item: Node<NodeConfig>) => {
  const x = item.position().x;
  const y = item.position().y;
  const width = item.size().width;
  const height = item.size().height;
  const position = {
    x,
    y,
  };
  const size = {
    width: width * item.scaleX(),
    height: height * item.scaleY(),
  };

  return (
    (position.x >= targetFrame.x() &&
      position.x <= targetFrame.x() + targetFrame.width() &&
      position.y >= targetFrame.y() &&
      position.y <= targetFrame.y() + targetFrame.height()) ||
    (position.x + size.width >= targetFrame.x() &&
      position.x + size.width <= targetFrame.x() + targetFrame.width() &&
      position.y + size.height >= targetFrame.y() &&
      position.y + size.height <= targetFrame.y() + targetFrame.height()) ||
    (position.x >= targetFrame.x() &&
      position.x <= targetFrame.x() + targetFrame.width() &&
      position.y + size.height >= targetFrame.y() &&
      position.y + size.height <= targetFrame.y() + targetFrame.height()) ||
    (position.x + size.width >= targetFrame.x() &&
      position.x + size.width <= targetFrame.x() + targetFrame.width() &&
      position.y >= targetFrame.y() &&
      position.y <= targetFrame.y() + targetFrame.height()) ||
    (position.x + size.width / 2 >= targetFrame.x() &&
      position.x + size.width / 2 <= targetFrame.x() + targetFrame.width() &&
      position.y + size.height / 2 >= targetFrame.y() &&
      position.y + size.height / 2 <= targetFrame.y() + targetFrame.height())
  );
};

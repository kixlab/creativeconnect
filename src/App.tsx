import React, { useEffect, useMemo, useState } from "react";
import { Transformer } from "react-konva";
import { Node, NodeConfig } from "konva/lib/Node";
import { useHotkeys } from "react-hotkeys-hook";
import { nanoid } from "nanoid";
import { Button, Col, Modal, Row } from "react-bootstrap";
import Layout from "./layout";
import View from "./view";
import { StageData } from "./redux/currentStageData";
import useItem from "./hook/useItem";
import useStageDataList from "./hook/useStageDataList";
import ImageItem, { ImageItemProps } from "./view/object/image";
import useSelection from "./hook/useSelection";
import useTransformer from "./hook/useTransformer";
import useStage from "./hook/useStage";
import TextItem, { TextItemProps } from "./view/object/text";
import hotkeyList from "./config/hotkey.json";
import useHotkeyFunc from "./hook/useHotkeyFunc";
import useWorkHistory from "./hook/useWorkHistory";
import useI18n from "./hook/usei18n";
import Header from "./header";

export type FileKind = {
  "file-id": string;
  title: string;
  data: Record<string, any>[];
};

export type FileData = Record<string, FileKind>;

function App() {
  const [past, setPast] = useState<StageData[][]>([]);
  const [future, setFuture] = useState<StageData[][]>([]);
  const { goToFuture, goToPast } = useWorkHistory(past, future, setPast, setFuture);
  const transformer = useTransformer();
  const { selectedItems, onSelectItem, setSelectedItems, clearSelection } =
    useSelection(transformer);
  const { stageData } = useItem();
  const stage = useStage();
  const { deleteItems, copyItems, selectAll, pasteItems, layerDown, layerUp } = useHotkeyFunc();
  const { getTranslation } = useI18n();
  const [clipboard, setClipboard] = useState<StageData[]>([]);
  const [showHotkeyModal, setShowHotkeyModal] = useState(false);
  const createStageDataObject = (item: Node<NodeConfig>): StageData => {
    const { id } = item.attrs;
    const target = item.attrs["data-item-type"] === "frame" ? item.getParent() : item;
    return {
      id: nanoid(),
      attrs: {
        ...(stageData.find((_item) => _item.attrs.id === id)?.attrs ?? {}),
      },
      className: target.getType(),
      children: [],
    };
  };

  const sortedStageData = useMemo(
    () =>
      stageData.sort((a, b) => {
        if (a.attrs.zIndex === b.attrs.zIndex) {
          if (a.attrs.zIndex < 0) {
            return b.attrs.updatedAt - a.attrs.updatedAt;
          }
          return a.attrs.updatedAt - b.attrs.updatedAt;
        }
        return a.attrs.zIndex - b.attrs.zIndex;
      }),
    [stageData]
  );

  const hotkeyModal = (
    <Modal show={showHotkeyModal} onHide={() => setShowHotkeyModal(false)}>
      <Modal.Header closeButton />
      <Modal.Body>
        {hotkeyList.map((hotkey) => (
          <div key={hotkey.name} className="d-flex justify-content-between mb-2">
            <h6>{getTranslation("hotkey", hotkey.id, "name")}</h6>
            <Row className="justify-content-end" xs={4}>
              {hotkey.keys.map((key, idx) => (
                <React.Fragment key={hotkey.name + key}>
                  {idx !== 0 && "+"}
                  <Col xs="auto" className="align-items-center">
                    <Button variant="success" disabled size="sm">
                      {key}
                    </Button>
                  </Col>
                </React.Fragment>
              ))}
            </Row>
          </div>
        ))}
      </Modal.Body>
    </Modal>
  );

  const renderObject = (item: StageData) => {
    switch (item.attrs["data-item-type"]) {
      case "image":
        return (
          <ImageItem
            key={`image-${item.id}`}
            data={item as ImageItemProps["data"]}
            onSelect={onSelectItem}
          />
        );
      case "text":
        return (
          <TextItem
            key={`text-${item.id}`}
            data={item as TextItemProps["data"]}
            transformer={transformer}
            onSelect={onSelectItem}
          />
        );
      default:
        return null;
    }
  };

  useHotkeys(
    "shift+up",
    (e) => {
      e.preventDefault();
      layerUp(selectedItems);
    },
    {},
    [selectedItems]
  );

  useHotkeys(
    "shift+down",
    (e) => {
      e.preventDefault();
      layerDown(selectedItems);
    },
    {},
    [selectedItems]
  );

  useHotkeys(
    "ctrl+c",
    (e) => {
      e.preventDefault();
      copyItems(selectedItems, setClipboard, createStageDataObject);
    },
    {},
    [selectedItems, stageData, clipboard]
  );

  useHotkeys(
    "ctrl+a",
    (e) => {
      e.preventDefault();
      selectAll(stage, onSelectItem);
    },
    {},
    [selectedItems]
  );

  useHotkeys(
    "ctrl+v",
    (e) => {
      e.preventDefault();
      pasteItems(clipboard);
    },
    {},
    [clipboard]
  );

  useHotkeys(
    "ctrl+z",
    (e) => {
      e.preventDefault();
      goToPast();
    },
    {},
    [goToPast]
  );

  useHotkeys(
    "ctrl+y",
    (e) => {
      e.preventDefault();
      goToFuture();
    },
    {},
    [goToFuture]
  );

  useHotkeys(
    "backspace",
    (e) => {
      e.preventDefault();
      deleteItems(selectedItems, setSelectedItems, transformer.transformerRef);
    },
    { enabled: Boolean(selectedItems.length) },
    [selectedItems, transformer.transformerRef.current]
  );

  useEffect(() => {
    window.addEventListener("beforeunload", (e) => {
      e.preventDefault();
      e.returnValue = "";
    });
    stage.stageRef.current.setPosition({
      x: Math.max(Math.ceil(stage.stageRef.current.width() - 1280) / 2, 0),
      y: Math.max(Math.ceil(stage.stageRef.current.height() - 760) / 2, 0),
    });
    stage.stageRef.current.batchDraw();
  }, []);

  return (
    <Layout header={<Header showModal={() => setShowHotkeyModal(true)} />}>
      {hotkeyModal}
      <View onSelect={onSelectItem} stage={stage}>
        {stageData.length ? sortedStageData.map((item) => renderObject(item)) : null}
        <Transformer
          ref={transformer.transformerRef}
          keepRatio
          shouldOverdrawWholeArea
          boundBoxFunc={(_, newBox) => newBox}
          onTransformEnd={transformer.onTransformEnd}
        />
      </View>
    </Layout>
  );
}

export default App;

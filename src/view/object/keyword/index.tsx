import Konva from "konva";
import React, { useMemo } from "react";
import { Label, Tag, Text } from "react-konva";
import { OverrideItemProps } from "../../../hook/useItem";
import { StageData } from "../../../redux/currentStageData";
import colorMapping from "../../../config/keywordTypes";
import useLabelSelection from "../../../hook/useLabelSelection";
import { SelectedLabelListItem } from "../../../redux/selectedLabelList";

export type KeywordItemProps = OverrideItemProps<{
  data: StageData;
  e?: DragEvent;
}>;

const KeywordItem: React.FC<KeywordItemProps> = ({ data, e }) => {
  const { attrs, keyword } = data;

  const labelEntity: SelectedLabelListItem = {
    id: "custom-" + keyword.type + ": " + keyword.keyword,
    type: keyword.type,
    fileid: "custom",
    keyword: keyword.keyword,
  };

  const { addSelectedLabel, removeSelectedLabel, selectedLabelList } = useLabelSelection();
  const isSelected = useMemo(() => {
    return selectedLabelList.some((label) => {
      return label.id === labelEntity.id;
    });
  }, [selectedLabelList, labelEntity.id]);

  return (
    <KeywordLabel
      key={labelEntity.id}
      xpos={attrs.x}
      ypos={attrs.y}
      onClick={() => {
        if (isSelected) removeSelectedLabel(labelEntity.id);
        else addSelectedLabel(labelEntity);
      }}
      isSelected={isSelected}
      type={labelEntity.type}
      text={
        labelEntity.type === "Arrangement"
          ? labelEntity.type
          : labelEntity.type + ": " + labelEntity.keyword
      }
      draggable={true}
    />
  );
};

export const KeywordLabel: React.FC<{
  key: string;
  xpos: number;
  ypos: number;
  onClick?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  isSelected?: boolean;
  type: string;
  text: string;
  draggable?: boolean;
}> = ({ key, xpos, ypos, onClick, isSelected, type, text, draggable }) => {
  return (
    <Label x={xpos} y={ypos} key={key} onClick={onClick} draggable={draggable}>
      <Tag
        name="label-tag"
        pointerDirection="left"
        fill={isSelected ? colorMapping[type] : "transparent"}
        strokeWidth={1}
        stroke={colorMapping[type]}
        cornerRadius={4}
      />
      <Text
        text={text}
        name="label-text"
        fontSize={14}
        fontFamily={"Noto Sans"}
        lineHeight={1}
        padding={8}
        fill={isSelected ? "white" : colorMapping[type]}
      />
    </Label>
  );
};

export default KeywordItem;

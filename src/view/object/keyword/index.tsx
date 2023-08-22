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
    mask: undefined,
  };

  const { addSelectedLabel, removeSelectedLabel, selectedLabelList } = useLabelSelection();
  const isSelected = useMemo(() => {
    return selectedLabelList.some((label) => {
      return label.id === labelEntity.id;
    });
  }, [selectedLabelList, labelEntity.id]);

  return (
    <Label
      x={attrs.x}
      y={attrs.y}
      key={labelEntity.id}
      onClick={() => {
        if (isSelected) removeSelectedLabel(labelEntity.id);
        else addSelectedLabel(labelEntity);
      }}
      draggable
    >
      <Tag
        name="label-tag"
        pointerDirection="left"
        fill={isSelected ? colorMapping[labelEntity.type] : "transparent"}
        strokeWidth={1}
        stroke={colorMapping[labelEntity.type]}
        cornerRadius={5}
      />
      <Text
        text={labelEntity.type + ": " + labelEntity.keyword}
        name="label-text"
        fontSize={14}
        lineHeight={1.2}
        padding={6}
        fill={isSelected ? "white" : colorMapping[labelEntity.type]}
      />
    </Label>
  );
};

export default KeywordItem;

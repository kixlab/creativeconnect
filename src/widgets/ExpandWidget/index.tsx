import React, { useEffect, useState } from "react";
import useLabelSelection from "../../hook/useLabelSelection";
import { expandElements } from "../../api/ImageElementAPI";
import Drag from "../../util/Drag";
import TRIGGER from "../../config/trigger";
import useItem from "../../hook/useItem";
import colorMapping from "../../config/colorMapping";

const ExpandWidget: React.FC = () => {
  const { getAllSelectedLabel } = useLabelSelection();

  const { stageData } = useItem();
  const allKeywords = stageData.reduce<string[]>((acc, item) => {
    if (item.attrs["data-item-type"] === "keyword") {
      acc.push(item.keyword);
    } else if (item.attrs["data-item-type"] === "image") {
      if (item.keywords) acc = acc.concat(item.keywords);
    }
    return acc;
  }, []);

  const [expandedAllElements, setExpandedAllElements] = useState<any[] | "loading" | "error">([]);
  useEffect(() => {
    if (allKeywords.length > 2) {
      setExpandedAllElements("loading");
      expandElements(allKeywords)
        .then((res) => {
          setExpandedAllElements(res.data.descriptions);
        })
        .catch((err) => {
          setExpandedAllElements("error");
        });
    }
  }, []);

  // Get all selected keywords
  const allSelectedLabel = getAllSelectedLabel();
  const [expandedSelectedElements, setExpandedSelectedElements] = useState<
    any[] | "loading" | "error"
  >([]);
  useEffect(() => {
    if (allSelectedLabel.length > 2) {
      setExpandedSelectedElements("loading");
      expandElements(allSelectedLabel)
        .then((res) => {
          setExpandedSelectedElements(res.data.descriptions);
        })
        .catch((err) => {
          setExpandedSelectedElements("error");
        });
    }
  }, [allSelectedLabel]);

  return (
    <div
      className="d-flex align-items-start justify-content-center text-center m-auto pt-3"
      style={{
        width: "80vw",
        maxWidth: "900px",
        height: "180px",
        background: "white",
        borderRadius: "10px 10px 0 0",
        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
      }}
    >
      <KeywordPanel
        name="your"
        originalElements={allKeywords}
        expandedElements={expandedAllElements}
      />

      <div
        style={{
          width: "1px",
          height: "100%",
          background: "black",
          margin: "0 20px",
        }}
      />

      <KeywordPanel
        name="selected"
        originalElements={allSelectedLabel}
        expandedElements={expandedSelectedElements}
      />
    </div>
  );
};

const KeywordPanel: React.FC<{
  name: string;
  originalElements: any[];
  expandedElements: any[] | "loading" | "error";
}> = ({ name, originalElements, expandedElements }) => {
  return (
    <div style={{ width: "50%", padding: "1rem" }}>
      <h6 className="pb-2">
        Related to {name} keywords ({originalElements.length})
      </h6>

      <div className="d-flex flex-wrap justify-content-center">
        {expandedElements === "loading" ? (
          <div className="mt-1" style={{ color: "var(--color-main)" }}>
            <div className="spinner-grow" role="status"></div>
            <div>Loading</div>
          </div>
        ) : expandedElements === "error" ? (
          <div className="mt-1" style={{ color: "var(--color-main)" }}>
            <div>Something went wrong. Please try again later.</div>
          </div>
        ) : originalElements.length < 3 ? (
          <span>Select more keywords to see suggestions</span>
        ) : (
          expandedElements.map((element) => (
            <Drag
              key={element.keyword}
              dragType="copyMove"
              dragSrc={{
                trigger: TRIGGER.INSERT.KEYWORD,
                "data-item-type": "image",
                keyword: {
                  keyword: element.keyword,
                  type: element.type,
                },
              }}
            >
              <div
                className="mx-2"
                style={{ color: colorMapping[element.type], fontWeight: "400", fontSize: "0.9rem" }}
              >
                {element.keyword}
              </div>
            </Drag>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpandWidget;

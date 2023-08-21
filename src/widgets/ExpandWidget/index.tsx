import React, { useEffect, useState } from "react";
import useLabelSelection from "../../hook/useLabelSelection";
import { expandElements } from "../../api/ImageElementAPI";
import Drag from "../../util/Drag";
import TRIGGER from "../../config/trigger";
import useItem from "../../hook/useItem";
import colorMapping from "../../config/colorMapping";

const ExpandWidget: React.FC = () => {
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
      <KeywordPanel2 name="your" />

      <div
        style={{
          width: "1px",
          height: "100%",
          background: "black",
          margin: "0 20px",
        }}
      />

      <KeywordPanel name="selected" />
    </div>
  );
};

const KeywordPanel: React.FC<{
  name: string;
}> = ({ name }) => {
  const { selectedLabelList } = useLabelSelection();

  const allSelectedLabel = selectedLabelList.filter((k) => k.type !== "Layout");
  const [expandedElements, setExpandedElements] = useState<any[] | "loading" | "error">([]);

  const getNewKeywords = () => {
    setExpandedElements("loading");
    console.log("allSelectedLabel", allSelectedLabel);
    expandElements(allSelectedLabel)
      .then((res) => {
        setExpandedElements(res.data.descriptions);
      })
      .catch((err) => {
        console.log(err);
        setExpandedElements("error");
      });
  };

  useEffect(() => {
    if (allSelectedLabel.length > 2) {
      getNewKeywords();
    }
  }, [selectedLabelList]);

  return (
    <div style={{ width: "50%", padding: "1rem" }}>
      <h6 className="pb-2">
        Related to {name} keywords ({allSelectedLabel.length})
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
        ) : allSelectedLabel.length < 3 ? (
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

const KeywordPanel2: React.FC<{
  name: string;
}> = ({ name }) => {
  const { stageData } = useItem();
  const allKeywords = stageData.reduce<string[]>((acc, item) => {
    if (item.attrs["data-item-type"] === "keyword") {
      acc.push(item.keyword);
    } else if (item.attrs["data-item-type"] === "image") {
      if (item.keywords) acc = acc.concat(item.keywords.filter((k) => k.type !== "Layout"));
    }
    return acc;
  }, []);

  const [expandedElements, setExpandedElements] = useState<any[] | "loading" | "error">([]);
  const getNewKeywords = () => {
    setExpandedElements("loading");
    console.log("allKeywords", allKeywords);
    expandElements(allKeywords)
      .then((res) => {
        setExpandedElements(res.data.descriptions);
      })
      .catch((err) => {
        console.log(err);
        setExpandedElements("error");
      });
  };

  return (
    <div style={{ width: "50%", padding: "1rem" }}>
      <h6 className="pb-2">
        Related to {name} keywords ({allKeywords.length})
        {expandedElements.length > 0 && (
          <button
            style={{ color: "var(--color-main)" }}
            className="btn ms-1 my-0 py-0"
            onClick={getNewKeywords}
          >
            <i className="bi bi-arrow-clockwise"></i>
          </button>
        )}
      </h6>

      <div className="d-flex flex-wrap justify-content-center">
        {expandedElements.length === 0 ? (
          <button
            className="btn mt-1"
            style={{ color: "var(--color-main)" }}
            onClick={getNewKeywords}
          >
            <i className="bi bi-binoculars-fill"></i>
            <div>
              Click here to <br /> search for new keywords
            </div>
          </button>
        ) : expandedElements === "loading" ? (
          <div className="mt-1" style={{ color: "var(--color-main)" }}>
            <div className="spinner-grow" role="status"></div>
            <div>Loading</div>
          </div>
        ) : expandedElements === "error" ? (
          <div className="mt-1" style={{ color: "var(--color-main)" }}>
            <div>Something went wrong. Please try again later.</div>
          </div>
        ) : allKeywords.length < 3 ? (
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

import React, { useEffect, useState } from "react";
import useLabelSelection from "../../hook/useLabelSelection";
import { expandElements } from "../../api/ImageElementAPI";
import Drag from "../../util/Drag";
import TRIGGER from "../../config/trigger";
import useItem from "../../hook/useItem";
import colorMapping from "../../config/keywordTypes";

const ExpandWidget: React.FC = () => {
  const { stageData } = useItem();
  const allKeywords = stageData.reduce<string[]>((acc, item) => {
    if (item.attrs["data-item-type"] === "keyword") {
      acc.push(item.keyword);
    } else if (item.attrs["data-item-type"] === "image") {
      if (item.keywords) acc = acc.concat(item.keywords.filter((k) => k.type !== "Layout"));
    }
    return acc;
  }, []);

  const { selectedLabelList } = useLabelSelection();
  const allSelectedLabel = selectedLabelList.filter((k) => k.type !== "Layout");
  return (
    <div
      className="d-flex align-items-start justify-content-center text-center m-auto pt-2"
      style={{
        width: "calc(100vw - 900px)",
        height: "180px",
        background: "white",
        borderRadius: "10px 10px 0 0",
        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
      }}
    >
      <KeywordPanel name="your" keywords={allKeywords} />

      <div
        style={{
          width: "1px",
          height: "100%",
          background: "black",
          margin: "0 20px",
        }}
      />

      <KeywordPanel name="selected" keywords={allSelectedLabel} />
    </div>
  );
};

const KeywordPanel: React.FC<{
  name: string;
  keywords: any[];
}> = ({ name, keywords }) => {
  const [usedKeywords, setUsedKeywords] = useState<string[]>([]);
  const [needReload, setNeedReload] = useState(false);
  const [expandedElements, setExpandedElements] = useState<any[] | "loading" | "error">([]);

  const getNewKeywords = () => {
    setExpandedElements("loading");
    setUsedKeywords(keywords);
    expandElements(keywords)
      .then((res) => {
        setExpandedElements(res.data.suggestedKeywords);
        setNeedReload(false);
      })
      .catch((err) => {
        console.log(err);
        setExpandedElements("error");
      });
  };

  useEffect(() => {
    if (usedKeywords.length !== keywords.length) {
      setNeedReload(true);
    } else {
      for (let i = 0; i < keywords.length; i++) {
        if (usedKeywords[i] !== keywords[i]) {
          setNeedReload(true);
          break;
        }
      }
    }
  }, [keywords]);

  return (
    <div style={{ width: "50%", padding: "1rem" }}>
      <h6 className="pb-2">
        Related to {name} keywords ({keywords.length})
        {needReload && (
          <button className="btn btn-custom btn-sm ms-3 my-0 py-0" onClick={getNewKeywords}>
            reload
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
              <label
                className="btn btn-outline-primary btn-sm me-1 mb-1"
                style={{
                  color: colorMapping[element.type],
                  borderColor: colorMapping[element.type],
                  backgroundColor: "transparent",
                }}
              >
                {element.keyword}
              </label>
            </Drag>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpandWidget;

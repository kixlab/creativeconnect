import React, { useState } from "react";
import "../MergeWidget/MergeWidget.css";
import Drag from "../../util/Drag";
import colorMapping from "../../config/keywordTypes";
import trigger from "../../config/trigger";

const CustomKeywordWidget: React.FC = () => {
  const [keywordList, setKeywordList] = useState<any[]>([]);

  const handleCustomInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const keyword = (document.getElementById("keywordName") as HTMLInputElement).value;
    const type = (document.getElementById("keywordType") as HTMLInputElement).value;
    if (type && keyword) {
      setKeywordList((prev) => [...prev, { keyword, type }]);
    }
  };

  return (
    <div className="imageWidgetWrapper">
      <h5 className="mb-4">Add notes</h5>
      <div className="mb-2">
        {keywordList.map((keyword) => (
          <Drag
            key={keyword.keyword}
            dragType="copyMove"
            dragSrc={{
              trigger: trigger.INSERT.KEYWORD,
              "data-item-type": "image",
              keyword: {
                keyword: keyword.keyword,
                type: keyword.type,
              },
            }}
          >
            <label
              className="btn btn-outline-primary btn-sm me-1 mb-1"
              style={{
                color: colorMapping[keyword.type],
                borderColor: colorMapping[keyword.type],
                backgroundColor: "transparent",
              }}
            >
              {keyword.keyword}
            </label>
          </Drag>
        ))}
      </div>
      <form
        style={{ display: "inline-block", width: "100%" }}
        onSubmit={(e) => handleCustomInputSubmit(e)}
      >
        <div className="input-group input-group-sm mb-3">
          <select id="keywordType" className="form-select" aria-label="Default select example">
            <option value="Subject matter">Subject matter</option>
            <option value="Action & pose">Action & pose</option>
            <option value="Theme & mood">Theme & mood</option>
          </select>
          <input
            id="keywordName"
            type="text"
            className="form-control"
            style={{ borderColor: "gray" }}
          />
          <button className="btn btn-outline-secondary" type="submit">
            +
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomKeywordWidget;

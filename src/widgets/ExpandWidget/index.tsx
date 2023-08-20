import React, { useEffect, useState } from "react";
import useLabelSelection from "../../hook/useLabelSelection";
import { expandElements } from "../../api/ImageElementAPI";
import ElementSelectButton from "../util/elements";

const ExpandWidget: React.FC = () => {
  const { getAllSelectedLabel } = useLabelSelection();
  const allSelectedLabel = getAllSelectedLabel();
  const [expandedElements, setExpandedElements] = useState<any[]>([]);
  useEffect(() => {
    if (allSelectedLabel.length > 2)
      expandElements(allSelectedLabel).then((res) => {
        console.log(res.data.descriptions);
        setExpandedElements(res.data.descriptions);
      });
  }, [allSelectedLabel]);
  return (
    <div className="d-flex align-items-center justify-content-center">
      <div style={{ width: "30vw" }}>
        <h6>Related Keyword</h6>
        <div className="d-flex flex-wrap justify-content-center">
          {expandedElements.map((element) => (
            <ElementSelectButton
              filename={undefined}
              key={"suggested-" + element.type + "-" + element.keyword}
              elementName={element.keyword}
              elementType={element.type}
              onChange={(e) => {}}
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
              button={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpandWidget;

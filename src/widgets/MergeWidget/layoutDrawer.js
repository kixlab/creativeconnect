import React, { useEffect, useState } from "react";
import { Layer, Rect, Stage, Transformer } from "react-konva";
import { getLayout, getSuggestedLayout } from "../../api/ImageElementAPI";
import useLabelSelection from "../../hook/useLabelSelection";

const Rectangle = ({ shapeProps, isSelected, onSelect, onChange, draggable }) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable={draggable}
        onDragEnd={(e) => {
          const node = e.target;
          var x = node.x();
          var y = node.y();
          if (node.x() < 0) x = 0;
          if (node.y() < 0) y = 0;
          if (node.x() + node.width() > 200) x = 200 - node.width();
          if (node.y() + node.height() > 200) y = 200 - node.height();
          onChange({
            ...shapeProps,
            x,
            y,
          });
          node.position({ x, y });
        }}
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={false}
          keepRatio={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.x < 0) {
              newBox.x = 0;
              newBox.width = oldBox.width;
            }
            if (newBox.y < 0) {
              newBox.y = 0;
              newBox.height = oldBox.height;
            }
            if (newBox.x + newBox.width > 200) {
              newBox.width = 200 - newBox.x;
            }
            if (newBox.y + newBox.height > 200) {
              newBox.height = 200 - newBox.y;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

const colors = [
  {
    id: 0,
    color: "#6C7059",
  },
  {
    id: 1,
    color: "red",
  },
  {
    id: 2,
    color: "green",
  },
  {
    id: 3,
    color: "blue",
  },
  {
    id: 4,
    color: "yellow",
  },
  {
    id: 5,
    color: "gray",
  },
  {
    id: 6,
    color: "#F5C6AA",
  },
  {
    id: 7,
    color: "#FFAE03",
  },
];

const LayoutDrawer = ({ description, onSubmit, loading }) => {
  const [caption, setCaption] = useState(description.caption);
  const [objects, setObjects] = useState([]);
  const [selectedId, selectShape] = useState(null);

  const [originalLayout, setOriginalLayout] = useState([]);
  const [suggestedLayouts, setSuggestedLayouts] = useState([]);
  const [shownLayout, setShownLayout] = useState(0);

  const { selectedLabelList } = useLabelSelection();

  useEffect(() => {
    let layoutReferenceImages = selectedLabelList.filter(
      (keyword) => keyword.type === "Arrangement"
    );
    if (layoutReferenceImages.length === 0) return;
    else {
      let layoutImage =
        layoutReferenceImages[Math.floor(Math.random() * layoutReferenceImages.length)].fileid;
      getLayout(layoutImage).then((res) => {
        setOriginalLayout(res.data.bboxes);
        getSuggestedLayout(res.data.bboxes, objects.length).then((res) => {
          let adjustedLayouts = res.data.layouts.map((layout) => {
            return layout.map((item) => ({
              x: (item[0] * 200) / 512,
              y: (item[1] * 200) / 512,
              width: (item[2] * 200) / 512,
              height: (item[3] * 200) / 512,
            }));
          });
          setSuggestedLayouts(adjustedLayouts);
          setShownLayout(0);
        });
      });
    }
  }, [selectedLabelList, objects.length]);

  useEffect(() => {
    setCaption(description.caption);

    const newObjects = description.layout.map((l, i) => {
      let object = l[0];
      let bbox = l[1];
      let detail = description.objects[object];

      return {
        id: i,
        object: object,
        detail: detail,
        color: colors.find((c) => c.id === i).color,
        rectangle: {
          x: bbox[0] * 200,
          y: bbox[1] * 200,
          width: bbox[2] * 200,
          height: bbox[3] * 200,
          stroke: colors.find((c) => c.id === i).color,
          strokeWidth: 2,
          id: i,
        },
      };
    });

    setObjects(newObjects);
  }, [description]);

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      objects: objects,
      caption: caption,
    };
    onSubmit(data);
  };

  return (
    <div className="mt-3">
      <h6>Edit details</h6>
      <div className="d-flex mt-1 mb-5">
        <div className="me-2" style={{ width: "200px", height: "200px" }}>
          <Stage
            width={200}
            height={200}
            style={{ backgroundColor: "#fef7ef" }}
            onMouseDown={checkDeselect}
            onTouchStart={checkDeselect}
          >
            <Layer>
              {/* {originalLayout?.map((bbox, i) => {
                const shapeProps = {
                  x: bbox[0],
                  y: bbox[1],
                  width: bbox[2],
                  height: bbox[3],
                  stroke: "gray",
                  strokeWidth: 2,
                };
                return (
                  <Rectangle
                    key={"custom"}
                    shapeProps={shapeProps}
                    isSelected={false}
                    onSelect={() => {}}
                    onChange={() => {}}
                    draggable={false}
                  />
                );
              })} */}
              {suggestedLayouts[shownLayout]?.map((bbox, i) => {
                const shapeProps = {
                  x: bbox.x,
                  y: bbox.y,
                  width: bbox.width,
                  height: bbox.height,
                  stroke: "#F5C6AA",
                  strokeWidth: 2,
                };
                return (
                  <Rectangle
                    key={`custom-${i}`}
                    shapeProps={shapeProps}
                    isSelected={false}
                    onSelect={() => {}}
                    onChange={() => {}}
                    draggable={false}
                  />
                );
              })}
              {objects.map((obj, i) => {
                const rect = obj.rectangle;
                return (
                  <Rectangle
                    key={i}
                    shapeProps={rect}
                    isSelected={rect.id === selectedId}
                    onSelect={() => {
                      selectShape(rect.id);
                    }}
                    onChange={(newAttrs) => {
                      setObjects(
                        objects.map((obj) => {
                          return obj.id === rect.id ? { ...obj, rectangle: newAttrs } : obj;
                        })
                      );
                    }}
                    draggable={true}
                  />
                );
              })}
            </Layer>
          </Stage>
          <button
            className="btn"
            onClick={() => {
              setShownLayout((shownLayout + 1) % suggestedLayouts.length);
            }}
          >
            <i class="bi bi-arrow-left-short"></i>
          </button>
          Other Layouts
          <button
            className="btn"
            onClick={() => {
              setShownLayout((shownLayout + 1) % suggestedLayouts.length);
            }}
          >
            <i class="bi bi-arrow-right-short"></i>
          </button>
        </div>
        <div className="w-100">
          <form onSubmit={handleSubmit}>
            <InputOnImage
              key={"caption"}
              name={"Caption"}
              color={"white"}
              value={caption}
              onChange={(e) => {
                setCaption(e.target.value);
              }}
            />
            {objects.map((obj) => {
              return (
                <InputOnImage
                  key={obj.id}
                  name={obj.object}
                  color={obj.color}
                  value={obj.detail}
                  onChange={(e) => {
                    setObjects(
                      objects.map((o) => {
                        return o.id === obj.id ? { ...o, detail: e.target.value } : o;
                      })
                    );
                  }}
                />
              );
            })}

            <button type="submit" className="btn btn-custom mt-3" disabled={loading}>
              {loading ? "Generating..." : "Generate sketch"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const InputOnImage = ({ key, name, color, value, onChange }) => {
  return (
    <div key={key} className="mb-2">
      <div className="d-flex align-items-center mb-2">
        <div
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            marginRight: "4px",
            backgroundColor: color,
          }}
        ></div>
        <div style={{ fontSize: "0.9rem" }}>{name}</div>
      </div>
      <input
        type="text"
        className="form-control"
        style={{ fontSize: "0.8rem" }}
        id={key}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default LayoutDrawer;

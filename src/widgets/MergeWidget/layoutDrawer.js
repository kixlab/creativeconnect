import React, { useEffect, useState } from "react";
import { Layer, Rect, Stage, Transformer } from "react-konva";

const Rectangle = ({ shapeProps, isSelected, onSelect, onChange }) => {
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
        draggable
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
  {
    id: 8,
    color: "#6C7059",
  },
];

const LayoutDrawer = ({ description, onSubmit }) => {
  const [scene, setScene] = useState(description.scene);
  const [background, setBackground] = useState(description.background);
  const [objects, setObjects] = useState([]);
  const [selectedId, selectShape] = useState(null);

  useEffect(() => {
    setScene(description.scene);
    setBackground(description.background);
    function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }

    const newObjects = description.objects.map((obj) => ({
      ...obj,
      color: colors.find((c) => c.id === obj.id).color,
      rectangle: {
        x: getRandomInt(120),
        y: getRandomInt(120),
        width: getRandomInt(40) + 40,
        height: getRandomInt(40) + 40,
        stroke: colors.find((c) => c.id === obj.id).color,
        strokeWidth: 2,
        id: obj.id,
      },
    }));
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
      background: background,
      objects: objects,
      scene: scene,
    };

    onSubmit(data);
  };

  return (
    <div className="mt-3">
      <h6>Add details</h6>
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
                  />
                );
              })}
            </Layer>
          </Stage>
        </div>
        <div className="w-100">
          <form onSubmit={handleSubmit}>
            {objects.map((obj) => {
              return (
                <div key={obj.id} className="mt-2">
                  <div className="d-flex align-items-center mb-2">
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        marginRight: "4px",
                        backgroundColor: obj.color,
                      }}
                    ></div>
                    <div style={{ fontWeight: "bold" }}>{obj.object}</div>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    style={{ fontSize: "0.9rem" }}
                    id={obj.id}
                    value={obj.detail}
                    onChange={(e) => {
                      setObjects(
                        objects.map((o) => {
                          return o.id === obj.id ? { ...o, detail: e.target.value } : o;
                        })
                      );
                    }}
                  />
                </div>
              );
            })}
            <button type="submit" className="btn btn-custom mt-3">
              Generate sketch
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LayoutDrawer;

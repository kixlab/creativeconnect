import React, { useState } from "react";
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

const LayoutDrawer = ({ description }) => {
  const [rectangles, setRectangles] = React.useState([]);
  const [selectedId, selectShape] = React.useState(null);

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const addRectangle = () => {
    const unusedColor = colors.find((c) => !rectangles.find((r) => r.id === c.id));
    if (unusedColor === undefined) return;
    console.log("Adding " + unusedColor);
    setRectangles([
      ...rectangles,
      {
        x: 20,
        y: 20,
        width: 80,
        height: 80,
        stroke: unusedColor.color,
        strokeWidth: 2,
        id: unusedColor.id,
      },
    ]);
  };

  // TODO: Add a button to remove a rectangle

  return (
    <div className="mt-3">
      <h6>Draw arrangement of your drawing</h6>
      <div style={{ width: "200px", height: "200px", margin: "10px 0" }}>
        <Stage
          width={200}
          height={200}
          style={{ backgroundColor: "#fef7ef" }}
          onMouseDown={checkDeselect}
          onTouchStart={checkDeselect}
        >
          <Layer>
            {rectangles.map((rect, i) => {
              return (
                <Rectangle
                  key={i}
                  shapeProps={rect}
                  isSelected={rect.id === selectedId}
                  onSelect={() => {
                    selectShape(rect.id);
                  }}
                  onChange={(newAttrs) => {
                    const rects = rectangles.slice();
                    rects[i] = newAttrs;
                    setRectangles(rects);
                  }}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
      <button className="btn btn-outline-dark btn-sm" onClick={addRectangle}>
        +
      </button>
      <button className="btn btn-outline-dark btn-sm" onClick={() => setRectangles([])}>
        Clear
      </button>
    </div>
  );
};

export default LayoutDrawer;

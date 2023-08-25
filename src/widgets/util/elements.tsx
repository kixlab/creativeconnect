import React, { useState } from "react";
import colorMapping from "../../config/keywordTypes";

export const CustomSelectButton: React.FC<{
  id: string;
  name: string | undefined;
  type: string;
  selected: boolean;
  onChange: (e: any) => void;
}> = ({ id, name, type, selected, onChange }) => {
  const [hovered, setHovered] = useState(false);
  const color = colorMapping[type];

  return (
    <>
      <input
        type="checkbox"
        className="btn-check"
        id={id}
        onChange={onChange}
        autoComplete="off"
        checked={selected}
      />
      <label
        className="btn btn-outline-primary btn-sm me-1 mb-1"
        htmlFor={id}
        onMouseEnter={() => {
          setHovered(true);
        }}
        onMouseLeave={() => {
          setHovered(false);
        }}
        style={{
          color: selected || hovered ? "white" : color,
          borderColor: color,
          backgroundColor: selected || hovered ? color : "transparent",
        }}
      >
        {name}
      </label>
    </>
  );
};

const ElementSelectButton: React.FC<{
  filename: string | undefined;
  elementType: string;
  elementName: string | undefined;
  onChange: (e: any) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  button: boolean;
}> = ({ filename, elementType, elementName, onChange, onMouseEnter, onMouseLeave, button }) => {
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);
  const handleChange = (e: any) => {
    setSelected(e.target.checked);
    onChange(e);
  };
  const color = colorMapping[elementType];
  return (
    <>
      <input
        type="checkbox"
        className="btn-check"
        id={filename + "-" + elementType + "-" + elementName}
        onChange={handleChange}
        autoComplete="off"
        checked={selected}
        disabled={!button}
      />
      <label
        className="btn btn-outline-primary btn-sm me-1 mb-1"
        htmlFor={filename + "-" + elementType + "-" + elementName}
        onMouseEnter={() => {
          setHovered(true);
          onMouseEnter();
        }}
        onMouseLeave={() => {
          setHovered(false);
          onMouseLeave();
        }}
        style={{
          color: selected || hovered || !button ? "white" : color,
          borderColor: color,
          backgroundColor: selected || hovered || !button ? color : "transparent",
        }}
      >
        {elementType + ": " + elementName}
      </label>
    </>
  );
};

export default ElementSelectButton;

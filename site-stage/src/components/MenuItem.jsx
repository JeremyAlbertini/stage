import { useState } from "react";

export default function MenuItem({ item, onItemClick }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (item.onClick) {
      item.onClick();
    }
    if (onItemClick) {
      onItemClick(item);
    }
  };

  return (
    <button
      className="menu-item"
      style={{
        backgroundColor: isHovered ? item.hoverColor : item.backgroundColor,
        color: item.textColor || "white",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {item.icon && <span>{item.icon}</span>}
      <span>{item.label}</span>
    </button>
  );
}
import MenuItem from './MenuItem';

export default function DropdownMenu({ items, isVisible, onItemClick }) {
  const validItems = items.filter(item => item && item.label);

  return (
    <div
      className="dropdown-menu"
      style={{
        maxHeight: isVisible ? `${validItems.length * 60}px` : "0",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(-10px)",
      }}
    >
      {validItems.map((item, index) => (
        <MenuItem 
          key={item.id || index} 
          item={item} 
          onItemClick={onItemClick}
        />
      ))}
    </div>
  );
}
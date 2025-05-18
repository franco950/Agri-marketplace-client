import  { useState } from "react";
export  enum usertypes{
    buyer='buyer',
    farmer='farmer',
    supplier='supplier',
    guest='guest'
    
 }
interface DropdownProps {
  value: usertypes;
  onChange: (value: usertypes) => void;
}

const Dropdown = ({ value, onChange }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = Object.values(usertypes).filter(type => type !== usertypes.guest);

  const handleSelect = (option: usertypes) => {
    onChange(option); 
    setIsOpen(false);
  };

  return (
    <div style={{ position: "relative", display: "inline-block", marginBottom: "1rem" }}>
      <button onClick={() => setIsOpen(!isOpen)}>
        {value === usertypes.guest ? "Select user type ▼" : `${value} ▼`}
      </button>
      {isOpen && (
        <ul
        style={{
            position: "absolute",
            top: "100%",
            left: 0,
            color:"black",
            backgroundColor: "#fff", 
            border: "1px solid #ccc",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", 
            padding: "0.5rem",
            margin: 0,
            listStyle: "none",
            zIndex: 1000, 
            width: "150px",
          }}
        >
          {options.map((option) => (
            <li
              key={option}
              style={{ padding: "0.5rem", cursor: "pointer" }}
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;

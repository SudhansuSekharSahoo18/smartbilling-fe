import React, { useState } from 'react';
import './Dropdown.css';

const Dropdown = ({ label, options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (e) => {
    onSelect(e.target.value);
  };

  return (
    <div className="dropdown">
      <label>{label} </label>
      <select id="month" name="month" onChange={handleOptionClick}>
        {options.map((option) => (
          <option
            value={option.value}
            onClick={() => handleOptionClick(option)}
            className="dropdown-item"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
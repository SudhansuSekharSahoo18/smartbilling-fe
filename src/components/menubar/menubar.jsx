import React from 'react';
import './MenuBar.css';

const MenuBar = () => {
  return (
    <div className="menu-bar">
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </div>
  );
};

export default MenuBar;

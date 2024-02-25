// Navbar.js
import React, { useState } from 'react';

const Navbar = ({ onSelect }) => {
  const [selectedButton, setSelectedButton] = useState(null);

  const handleButtonClick = (button) => {
    setSelectedButton(button);
    onSelect(button);
  };

  return (
    <div>
      <button onClick={() => handleButtonClick('Recipient')}>Recipient</button>
      <button onClick={() => handleButtonClick('Presenter')}>Presenter</button>
      <button onClick={() => handleButtonClick('Event')}>Event</button>
    </div>
  );
};

export default Navbar;

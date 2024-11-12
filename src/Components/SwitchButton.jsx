import React, { useState } from 'react';
import './index.css';

const SwitchButton = ({ isEnabled = false, onToggle = () => {}, label = '', loader }) => {
  const [isSwitchOn, setIsSwitchOn] = useState(isEnabled);

  const toggleSwitch = () => {
    setIsSwitchOn(prevState => !prevState);
    onToggle(!isSwitchOn);
  };

  return (
    <div className="switch-container">
      {label && <span className="switch-label">{label}</span>}
      <button disabled={loader} className={`switch ${isSwitchOn ? 'switch-on' : ''}`} onClick={toggleSwitch}>
        <div className={`switch-circle ${isSwitchOn ? 'circle-on' : ''}`} />
      </button>
    </div>
  );
};

export default SwitchButton;

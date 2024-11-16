// CustomArrows.js
import React from 'react';
import "./index.css";


// Next Arrow Button
export const NextArrow = ({ onClick }) => (
  <button
    className="slick-next addGlassMor"
    onClick={onClick}
    style={{
      color: 'black',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      border: 'none',
    }}
  >
      <div className='zrsiqhfduhduq'>
      <i className='fa-solid fa-arrow-right' ></i>
    </div>
  </button>
);

// Prev Arrow Button
export const PrevArrow = ({ onClick }) => (
  <button
    className="slick-prev addGlassMor"
    onClick={onClick}
    style={{
      color: 'black',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      border: 'none',
    }}
  >
    <div className='zrsiqhfduhduq'>
      <i className='fa-solid fa-arrow-left' ></i>
    </div>
  </button>
);

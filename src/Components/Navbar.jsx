import React from 'react'
import "./index.css";
import { useNavigate } from 'react-router-dom';


const NavBar = () => {

  const navigate = useNavigate();



  return (
    <div className='NavBar'>
        <div 
          className="logo"   
          onClick={()=>{
            navigate(0);
          }}
        >
          <span className="spanLogo1" >
            PEST
          </span>
          <span className="spanLogo2" >
            &nbsp;ID
          </span> 
        </div>
        <div className="options">

          <button 
            className='eosvnowdc'
          >
            <i className="fa-regular fa-bell"></i>          
          </button>
          <div className="erovuson">
            <img 
              className='isfivs'
              src="https://res.cloudinary.com/dqprleeyt/image/upload/v1702216550/akram_tp6iku.jpg" 
              alt="VBFISBIS" 
            />
            <div
              className='ziuvfzuo'
            >
              <i className="fa-solid fa-caret-down"></i>
            </div>
          </div>
        </div>
    </div>
  )
}

export default NavBar

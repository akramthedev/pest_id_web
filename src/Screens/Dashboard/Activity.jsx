import React from 'react'
import "./index.css";
import NavBar from '../../Components/Navbar';
import SideBar from '../../Components/SideBar';


const Activity = () => {
  return (
    <div className='Dashboard'>
      <NavBar /> 
      <SideBar />
      <div className="containerDash">
      Activity
      </div>
    </div>
  )
}

export default Activity

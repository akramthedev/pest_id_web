import React from 'react'
import "./index.css";
import NavBar from '../../Components/Navbar';
import SideBar from '../../Components/SideBar';


const Fermes = () => {
  return (
    <div className='Dashboard'>
      <NavBar /> 
      <SideBar />
      <div className="containerDash">
      Fermes
      </div>
    </div>
  )
}

export default Fermes

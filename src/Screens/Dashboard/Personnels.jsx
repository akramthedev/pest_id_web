import React from 'react'
import "./index.css";
import NavBar from '../../Components/Navbar';
import SideBar from '../../Components/SideBar';


const Personnels = () => {
  return (
    <div className='Dashboard'>
      <NavBar /> 
      <SideBar />
      <div className="containerDash">
      Personnels 
      </div>
    </div>
  )
}

export default Personnels

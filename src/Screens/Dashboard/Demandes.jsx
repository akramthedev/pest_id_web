import React from 'react'
import "./index.css";
import NavBar from '../../Components/Navbar';
import SideBar from '../../Components/SideBar';


const Demandes = () => {
  return (
    <div className='Dashboard'>
      <NavBar /> 
      <SideBar />
      <div className="containerDash">
      Demandes Clients  
      </div>
    </div>
  )
}

export default Demandes

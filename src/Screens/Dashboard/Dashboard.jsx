import React from 'react'
import "./index.css";
import NavBar from '../../Components/Navbar';
import SideBar from '../../Components/SideBar';

const Dashboard = () => {
  return (
    <div className='Dashboard'>
      <NavBar /> 
      <SideBar />
      <div className="containerDash">
        
      </div>
    </div>
  )
}

export default Dashboard;
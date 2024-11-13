import React, { useEffect } from 'react'
import "./index.css";
import { ENDPOINT_API } from "../../endpoint";
import NavBar from '../../Components/Navbar';
import SideBar from '../../Components/SideBar';
import axios from 'axios';


const Dashboard = () => {



  useEffect(()=>{

    const checkBroadCast = async()=>{
      try{
        const resp = await axios.get(`${ENDPOINT_API}user/${parseInt(localStorage.getItem('userId'))}`,{
          headers : {
            Authorization : `Bearer ${localStorage.getItem('token')}`
          }
        });
        if(resp.status === 200){
          if(resp.data.isNoticeOfBroadCastSeen === 0 || resp.data.isNoticeOfBroadCastSeen === "0" || resp.data.isNoticeOfBroadCastSeen === false){
            localStorage.setItem('isNoticeOfBroadCastSeen',"notseen");
          }
          else{
            localStorage.setItem('isNoticeOfBroadCastSeen',"seen");
          }
        }
      }
      catch(e){
        console.log(e.message)
      }
    } 
    checkBroadCast();

  },[localStorage.getItem('isNoticeOfBroadCastSeen')]);



  return (
    <div className='Dashboard'>
      <NavBar /> 
      <SideBar />
      <div className="containerDash">
      Dashboard
      </div>
    </div>
  )
}

export default Dashboard;
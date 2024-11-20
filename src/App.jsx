import './App.css';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Screens/Home/Home";
import Tracking from './Screens/Tracking';
import Page404 from './Screens/Page404'
import BookDemo from "./Screens/Home/BookDemo"
import Contact from './Screens/Home/Contact';
import Login from "./Screens/Auth/Login";
import Todo from './Todo';
import CheckOTP from './Screens/Auth/CheckOTP';
import OtherProfile from './Screens/Profile/OtherProfile';
import PasswordConfig from './Screens/PasswordConfig/PasswordConfig';
import Profile from "./Screens/Profile/MyProfile";
import Register from "./Screens/Auth/Register";
import Dashboard from './Screens/Dashboard/Dashboard';
import Clients from "./Screens/Dashboard/Clients";
import Demandes from "./Screens/Dashboard/Demandes";
import Personnels from "./Screens/Dashboard/Personnels";
import Calculations from "./Screens/Dashboard/Calculations";
import Fermes from "./Screens/Dashboard/Fermes";
import Broadcast from "./Screens/Broadcast/Broadcast";
import Activity from "./Screens/Activity/Activity";
import Reservations from './Screens/Dashboard/Reservations';
import NewPassword from './Screens/Auth/NewPassword';
import ForgotPassword from "./Screens/Auth/ForgotPassword";
import About from "./Screens/About/About";
import Setting from './Screens/Setting/Setting';
import DashboardFromViewOfSuperAdmin from "./Screens/Dashboard/DashboardFromViewOfSuperAdmin";
import React, { useState, useEffect } from 'react';
import { ENDPOINT_API } from "./endpoint";



function App() {

  const isAuthenticated = localStorage.getItem('token') !== null;

  const [newDemandes, setNewDemandes] = useState(0);
  const [newReservations, setNewReservations] = useState(0);






  const fetchNouvellesDemandes = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const userIdNum = parseInt(userId);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${ENDPOINT_API}users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200 ) {

        let i = 0;
        let counter = 0;

        if(response.data.users.length === 0){
          setNewDemandes(0);
        }
        else{
          for(i=0;i<response.data.users.length;i++){
            if( response.data.users[i].id !== userIdNum && response.data.users[i].canAccess === 0 && response.data.users[i].isEmailVerified === 0 && response.data.users[i].isSeen === 0){
              counter++;
            }
          }
          setNewDemandes(counter);
        }
      }
      else{
        setNewDemandes(0);
      }
    } catch (error) {
      setNewDemandes(0);
    } 
  };
  
  
  const fetchNouvellesReservations = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const userIdNum = parseInt(userId);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${ENDPOINT_API}getAllDemos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200 ) {

        let i = 0;
        let counter = 0;

        if(response.data.length === 0){
          setNewReservations(0);
        }
        else{
          for(i = 0;i<response.data.length;i++){
            if( response.data[i].isSeen === 0){
              counter ++;
            }
          }
          setNewReservations(counter);
        }


      }
      else{
        setNewReservations(0);
      }
  
    } catch (error) {
        setNewReservations(0);
    } 
  };
   


  useEffect(() => {
    fetchNouvellesDemandes();
    fetchNouvellesReservations();
    
    const interval = setInterval(() => {
      fetchNouvellesDemandes();
      fetchNouvellesReservations();
    }, 5000);

    return () => clearInterval(interval);
  }, []);




  return (

      <BrowserRouter>

        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Home />} />
          <Route path="/become-member" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/book-demo" element={ <BookDemo /> } />
          <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
          <Route path="/about" element={<About />} />
          <Route path="/ForgotPassword" element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/" />}  />
          <Route path="/CheckOTP" element={!isAuthenticated ? <CheckOTP /> : <Navigate to="/" />}  />
          <Route path="/NewPassword" element={!isAuthenticated ? <NewPassword /> : <Navigate to="/" />}  />
          <Route path="/contact" element={  <Contact /> }  />

          <Route path="/dashboard" element={isAuthenticated ? <Dashboard  newReservations={newReservations} setNewReservations={setNewReservations}  newDemandes={newDemandes} setNewDemandes={setNewDemandes} /> : <Navigate to="/login" />} />
          <Route path="/dash/u/:IDUSERDASHBAORD/:nameClient/:typeClient" element={isAuthenticated ? <DashboardFromViewOfSuperAdmin newReservations={newReservations} setNewReservations={setNewReservations}  newDemandes={newDemandes} setNewDemandes={setNewDemandes} /> : <Navigate to="/login" />} />
          <Route path="/clients" element={isAuthenticated ? <Clients newReservations={newReservations} setNewReservations={setNewReservations}  newDemandes={newDemandes} setNewDemandes={setNewDemandes} /> : <Navigate to="/login" />} />
          <Route path="/demandes" element={isAuthenticated ? <Demandes newReservations={newReservations} setNewReservations={setNewReservations}  newDemandes={newDemandes} setNewDemandes={setNewDemandes}  /> : <Navigate to="/login" />} />
          <Route path="/reservations" element={isAuthenticated ? <Reservations  newReservations={newReservations} setNewReservations={setNewReservations}   newDemandes={newDemandes} setNewDemandes={setNewDemandes}   /> : <Navigate to="/login" />} />
          <Route path="/personnels" element={isAuthenticated ? <Personnels newReservations={newReservations} setNewReservations={setNewReservations}  newDemandes={newDemandes} setNewDemandes={setNewDemandes}/> : <Navigate to="/login" />} />
          <Route path="/calculations" element={isAuthenticated ? <Calculations newReservations={newReservations} setNewReservations={setNewReservations}  newDemandes={newDemandes} setNewDemandes={setNewDemandes} /> : <Navigate to="/login" />} />
          <Route path="/fermes" element={isAuthenticated ? <Fermes newReservations={newReservations} setNewReservations={setNewReservations}  newDemandes={newDemandes} setNewDemandes={setNewDemandes} /> : <Navigate to="/login" />} />
          <Route path="/broadcast" element={isAuthenticated ? <Broadcast  /> : <Navigate to="/login" />} />
          <Route path="/activity" element={isAuthenticated ? <Activity /> : <Navigate to="/login" />} />
          <Route path="/setting" element={isAuthenticated ? <Setting /> : <Navigate to="/login" />} />
          <Route path="/profile/:id" element={isAuthenticated ? <OtherProfile /> : <Navigate to="/login" />} />
          <Route path="/my-profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/password-configuration/:id/:from/:name" element={isAuthenticated ? <PasswordConfig /> : <Navigate to="/login" />} />

          <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;

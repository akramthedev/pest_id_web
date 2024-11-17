import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Home from "./Screens/Home/Home";
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

import NewPassword from './Screens/Auth/NewPassword';
import ForgotPassword from "./Screens/Auth/ForgotPassword";


import About from "./Screens/About/About";
import Setting from './Screens/Setting/Setting';
import DashboardFromViewOfSuperAdmin from "./Screens/Dashboard/DashboardFromViewOfSuperAdmin";


function App() {

   const isAuthenticated = localStorage.getItem('token') !== null;

  return (
    <BrowserRouter>
      <Routes>

        

        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Home />} />
        <Route path="/become-member" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/about" element={<About />} />
        <Route path="/ForgotPassword" element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/" />}  />
        <Route path="/CheckOTP" element={!isAuthenticated ? <CheckOTP /> : <Navigate to="/" />}  />
        <Route path="/NewPassword" element={!isAuthenticated ? <NewPassword /> : <Navigate to="/" />}  />

        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/DashboardFromViewOfSuperAdmin/:IDUSERDASHBAORD/:nameClient/:typeClient" element={isAuthenticated ? <DashboardFromViewOfSuperAdmin /> : <Navigate to="/login" />} />
        <Route path="/clients" element={isAuthenticated ? <Clients /> : <Navigate to="/login" />} />
        <Route path="/demandes" element={isAuthenticated ? <Demandes /> : <Navigate to="/login" />} />
        <Route path="/personnels" element={isAuthenticated ? <Personnels /> : <Navigate to="/login" />} />
        <Route path="/calculations" element={isAuthenticated ? <Calculations /> : <Navigate to="/login" />} />
        <Route path="/fermes" element={isAuthenticated ? <Fermes /> : <Navigate to="/login" />} />
        <Route path="/broadcast" element={isAuthenticated ? <Broadcast /> : <Navigate to="/login" />} />
        <Route path="/activity" element={isAuthenticated ? <Activity /> : <Navigate to="/login" />} />
        <Route path="/setting" element={isAuthenticated ? <Setting /> : <Navigate to="/login" />} />
        <Route path="/profile/:id" element={isAuthenticated ? <OtherProfile /> : <Navigate to="/login" />} />
        <Route path="/my-profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/password-configuration/:id/:from/:name" element={isAuthenticated ? <PasswordConfig /> : <Navigate to="/login" />} />

        <Route path="/to-do" element={<Todo />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

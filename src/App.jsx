import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Home from "./Screens/Home/Home";
import Login from "./Screens/Auth/Login";
import Register from "./Screens/Auth/Register";
import Dashboard from './Screens/Dashboard/Dashboard';
import Clients from "./Screens/Dashboard/Clients";
import Demandes from "./Screens/Dashboard/Demandes";
import Personnels from "./Screens/Dashboard/Personnels";
import Calculations from "./Screens/Dashboard/Calculations";
import Fermes from "./Screens/Dashboard/Fermes";
import Broadcast from "./Screens/Dashboard/Broadcast";
import Activity from "./Screens/Dashboard/Activity";


function App() {

   const isAuthenticated = localStorage.getItem('token') !== null;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Home />} />
        <Route path="/become-member" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />


        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/clients" element={isAuthenticated ? <Clients /> : <Navigate to="/login" />} />
        <Route path="/demandes" element={isAuthenticated ? <Demandes /> : <Navigate to="/login" />} />
        <Route path="/personnels" element={isAuthenticated ? <Personnels /> : <Navigate to="/login" />} />
        <Route path="/calculations" element={isAuthenticated ? <Calculations /> : <Navigate to="/login" />} />
        <Route path="/fermes" element={isAuthenticated ? <Fermes /> : <Navigate to="/login" />} />
        <Route path="/broadcast" element={isAuthenticated ? <Broadcast /> : <Navigate to="/login" />} />
        <Route path="/activity" element={isAuthenticated ? <Activity /> : <Navigate to="/login" />} />


        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

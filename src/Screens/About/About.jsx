import React from 'react'
import './index.css';
import {useNavigate} from "react-router-dom"

const About = () => {

  const navigate = useNavigate();

  return (
    <div
      className='home'
    >
      <div className="navHome">
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
        <div className="navCont">
          <button 
            onClick={()=>{
              navigate("/");
            }}
            className="navContBtn">
            Acceuil
          </button>
          <button 
            onClick={()=>{
              navigate("/about");
            }}
            className="navContBtn" >
            À propos
          </button>
          <button 
            onClick={()=>{
              navigate("/contact");
            }}
            className="navContBtn" >
            Contact
          </button>
        </div>
        <div className="btnCont">
          <button 
            onClick={()=>{
              navigate("/login");
            }}
            className="btnConexion" >
            Connexion
          </button>
          <button 
            onClick={()=>{
              navigate("/become-member");
            }}
            className="btnCréerCpt" >
            Créer un compte
          </button>
        </div>
      </div>
      <div className="contHome2">
        
      </div>
      <div className="footer">
        Une solution signée&nbsp;
        <a href="https://pcs-agri.com/" target='_blank' >PCS AGRI</a>
        &nbsp;© 2024
      </div>
    </div>
  )
}

export default About

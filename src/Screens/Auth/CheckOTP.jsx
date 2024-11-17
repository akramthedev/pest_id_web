import React, { useState } from 'react';
import './login.css';
import axios from 'axios';
import { ENDPOINT_API } from "../../endpoint";
import { useNavigate } from "react-router-dom";
import ErrorSuccess from '../../Components/ErrorSuccess';
import CryptoJS from 'crypto-js';



function CheckOTP() {

  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showItResponse, setshowItResponse] = useState(false);
  const [isErrorResponse, setisErrorResponse] = useState(false);
  const [messageResponse, setmessageResponse] = useState(null);

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;



  const handleInputChange = (e, field) => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));

    if (field === 'email') {
      setEmail(e.target.value);
    } else if (field === 'password') {
      setPassword(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    if (email.length !== 6 || email === null || email === undefined || email === '' ) {
    validationErrors.email = 'Le code saisi est invalide';
}
    
   
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      if(!showItResponse){
      setisErrorResponse(true);
      setmessageResponse("Le code saisi est invalide");
      setshowItResponse(true);
      setTimeout(()=>{          
        setshowItResponse(false);
      }, 4500);}
      return;
    }
    try {
      setLoader(true);
      const resp = await axios.post(`${ENDPOINT_API}password/otp`, {
        email : localStorage.getItem("EmailOfRecup"),
        otp : parseInt(email)
      });
      if(resp.status === 200){
        setEmail('')
        navigate('/NewPassword');
      }
      else{
        if(!showItResponse){
        setisErrorResponse(true);
        setmessageResponse(`Le code saisi est invalide.`);
        setshowItResponse(true);
        setTimeout(()=>{          
          setshowItResponse(false);
        }, 4500);}
      }
    } catch (error) {
      console.log(error);
      
      if(!showItResponse){
      setisErrorResponse(true);
        setmessageResponse("Une erreur est survenue...");
        setshowItResponse(true);
        setTimeout(()=>{          
          setshowItResponse(false);
        }, 4500);}

    } finally{
      setLoader(false);
    }
  };

  return (
    <div className="login-container">
      <ErrorSuccess  
        isError={isErrorResponse}
        showIt={showItResponse}
        message={messageResponse}  
      />
      <h2 className="login-title">Vérification du code</h2>
      <p className="login-subtitle">&nbsp;Veuillez saisir le code à 6 chiffres que vous avez reçu par e-mail pour vérifier votre identité.</p><br /><br />
      <form className="login-form" onSubmit={handleSubmit}>
        
        <label className="login-label" htmlFor="email">Code OTP </label>
        <input
          id="email"
          className={`login-input ${errors.email ? 'input-error' : ''}`}
          placeholder="XXXXXX"
          maxLength={6}
          value={email}
          onChange={(e) => handleInputChange(e, 'email')}
        />
       
        
        

        <button 
          disabled={loader}
          type="submit" 
          className={`login-button ${loader ? 'disabled-button' : ''}`}
          >
        {
          loader ? "Envoi en cours..." : "Vérifier le code"  
        }
        </button>
        <br />        
        <p className="login-subtitle2" onClick={() => navigate('/ForgotPassword')}>
          Code OTP non reçu ? 
        </p>
      </form>
    </div>
  );
}

export default CheckOTP;
import React, { useState } from 'react';
import './login.css';
import axios from 'axios';
import { ENDPOINT_API } from "../../endpoint";
import { useNavigate } from "react-router-dom";
import ErrorSuccess from '../../Components/ErrorSuccess';
import CryptoJS from 'crypto-js';



function ForgotPassword() {

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
    if (!emailRegex.test(email)) {
    validationErrors.email = 'Veuillez saisir une adresse email valide';
}
    
   
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      if(!showItResponse){
      setisErrorResponse(true);
      setmessageResponse("Veuillez saisir une adresse email valide");
      setshowItResponse(true);
      setTimeout(()=>{          
        setshowItResponse(false);
      }, 4500);}
      return;
    }
    try {
      setLoader(true);
      const resp = await axios.post(`${ENDPOINT_API}password/email`, {
        email : email
      });
      if(resp.status === 200){
        
        localStorage.setItem("EmailOfRecup", email);
        setEmail('')

        if(!showItResponse){
          setisErrorResponse(false);
          setmessageResponse(`Un code à 6 chiffre a été envoyé à votre adresse email !`);
          setshowItResponse(true);
          setTimeout(()=>{          
            setshowItResponse(false);
            navigate('/CheckOTP');
          }, 4500);} 
      }
      else{
        if(!showItResponse){
        setisErrorResponse(true);
        setmessageResponse(`${resp.message}`);
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
      <h2 className="login-title">Réinitialisation</h2>
      <p className="login-subtitle">&nbsp;Un code à 6 chiffres sera envoyé à votre email.</p><br /><br />
      <form className="login-form" onSubmit={handleSubmit}>
        
        <label className="login-label" htmlFor="email">Adresse Email</label>
        <input
          id="email"
          className={`login-input ${errors.email ? 'input-error' : ''}`}
          placeholder="your@email.com"
          value={email}
          onChange={(e) => handleInputChange(e, 'email')}
        />
       
        
        

        <button 
          disabled={loader}
          type="submit" 
          className={`login-button ${loader ? 'disabled-button' : ''}`}
          >
        {
          loader ? "Envoi en cours..." : "Recevoir le code OTP"  
        }
        </button>
        <br />        
        <p className="login-subtitle2" onClick={() => navigate('/become-member')}>
          Nouveau ici ? Inscrivez-vous
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;
import React, { useState } from 'react';
import './login.css';
import axios from 'axios';
import { ENDPOINT_API } from "../../endpoint";
import { useNavigate } from "react-router-dom";
import ErrorSuccess from '../../Components/ErrorSuccess';
import CryptoJS from 'crypto-js';



function NewPassword() {

  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confpassword: '' });

  const [showItResponse, setshowItResponse] = useState(false);
  const [isErrorResponse, setisErrorResponse] = useState(false);
  const [messageResponse, setmessageResponse] = useState(null);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    specialChar: false,
  });



  

  const [responseInfo, setResponseInfo] = useState({ show: false, isError: false, message: '' });





  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));

    if (name === 'password') {
      setPasswordValidation({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        digit: /[0-9]/.test(value),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      });
    }
  };


  const validateForm = () => {
    const validationErrors = {};
    const { password, confpassword } = formData;

    if (password !==confpassword) {
      validationErrors.password = 'Les mot de passes ne sont pas identiques.';
    } 
    if (!password || password.length < 8) {
      validationErrors.password = 'Le mot de passe doit correspondre aux normes citées.';
    }  
      if (!/[A-Z]/.test(password))  validationErrors.password = 'Le mot de passe doit correspondre aux normes citées.';
      if (!/[a-z]/.test(password))  validationErrors.password = 'Le mot de passe doit correspondre aux normes citées.';
      if (!/[0-9]/.test(password))  validationErrors.password = 'Le mot de passe doit correspondre aux normes citées.';
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) validationErrors.password = 'Le mot de passe doit correspondre aux normes citées.';
  

    return validationErrors;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      if(!showItResponse){
        setisErrorResponse(true);
        setmessageResponse(validationErrors.password);
        setshowItResponse(true);
        setTimeout(()=>{          
          setshowItResponse(false);
        }, 4500);}
      return;
    }
 
    
   
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      if(!showItResponse){
      setisErrorResponse(true);
      setmessageResponse("Vos mot de passes sont invalides.");
      setshowItResponse(true);
      setTimeout(()=>{          
        setshowItResponse(false);
      }, 4500);}
      return;
    }
    try {
      setLoader(true);
      console.log(formData.confpassword);
      console.log(formData.password);
      const resp = await axios.post(`${ENDPOINT_API}updatePassword2`, {
        email : localStorage.getItem("EmailOfRecup"),
        nouveau : formData.password
      });
      if(resp.status === 200){
        
        if(!showItResponse){
          setisErrorResponse(false);
          setmessageResponse(`Succès ! Vous pouvez vous connecter maintenant.`);
          setshowItResponse(true);
          setTimeout(()=>{          
            setshowItResponse(false);
            navigate('/login');
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
      <h2 className="login-title">Nouveau mot de passe</h2>
      <p className="login-subtitle">&nbsp;Saisissez votre nouveau mot de passe et confirmez-le pour mettre à jour votre compte.</p><br />
      <form className="login-form" onSubmit={handleSubmit}>
      {['password', 'confpassword'].map((field) => (
          <div key={field}>
            <label className="login-label" htmlFor={field}>
              {field === 'password' && 'Mot de passe'}
              {field === 'confpassword' && 'Confirmer le mot de passe'}
            </label>
            <input
              id={field}
              name={field}
              type={field === 'password' ? 'password' : 'password'}
              maxLength={field === 'mobile' ? 20 : 100}
              className={`login-input ${errors[field] ? 'input-error' : ''}`}
              placeholder={
                field === 'fullName'
                  ? 'Votre Nom et Prénom'
                  : field === 'email'
                  ? 'your@email.com'
                  : field === 'mobile'
                  ? '+212 XXX XXX XXX'
                  : field === 'password' ? 
                   'Votre Mot de passe' : "Ressaisir votre mot de passe"
              }
              value={formData[field]}
              onChange={handleInputChange}
            />
          </div>
        ))}
        {formData.password && (
          <div className="password-helper">
            {Object.entries(passwordValidation).map(([key, isValid]) => (
              <p key={key} className={isValid ? 'valid' : 'invalid'}>
                {key === 'length' && '• Au moins 8 caractères'}
                {key === 'uppercase' && '• Une lettre majuscule'}
                {key === 'lowercase' && '• Une lettre minuscule'}
                {key === 'digit' && '• Un chiffre'}
                {key === 'specialChar' && '• Un caractère spécial'}
              </p>
            ))}
          </div>
        )}

        <button 
          disabled={loader}
          type="submit" 
          className={`login-button ${loader ? 'disabled-button' : ''}`}
          >
        {
          loader ? "Modification en cours..." : "Modifier le mot de passe"  
        }
        </button>
        <br />        
        <p className="login-subtitle2" onClick={() => navigate('/')}>
          Retour à la page d'acceuil 
        </p>
      </form>
    </div>
  );
}

export default NewPassword;
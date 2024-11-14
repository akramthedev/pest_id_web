import React, { useState } from 'react';
import './login.css';
import axios from 'axios';
import { ENDPOINT_API } from "../../endpoint";
import { useNavigate } from "react-router-dom";
import ErrorSuccess from '../../Components/ErrorSuccess';
import CryptoJS from 'crypto-js';



function Login() {

  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showItResponse, setshowItResponse] = useState(false);
  const [isErrorResponse, setisErrorResponse] = useState(false);
  const [messageResponse, setmessageResponse] = useState(null);

 
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
    if (email.length <= 4) {
      
      validationErrors.email = 'Adresse email invalide';
      
    
    }
    if (!password || password.length < 5) {
      validationErrors.password = 'Le mot de passe doit contenir au moins 5 caractères';
    }
   
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      if(!showItResponse){
      setisErrorResponse(true);
      setmessageResponse("Les informations fournies sont incorrectes.");
      setshowItResponse(true);
      setTimeout(()=>{          
        setshowItResponse(false);
      }, 4500);}
      return;
    }
    try {
      setLoader(true);
      const response = await axios.post(`${ENDPOINT_API}login`, { email, password });
      if(response.data.message === "Votre accès à l'application est restreint."){
        
        if(!showItResponse){
        setisErrorResponse(true);
        setmessageResponse("L'accès vous est refusé en raison de restrictions sur votre compte.");
        setshowItResponse(true);
        setTimeout(()=>{          
          setshowItResponse(false);
        }, 4500);}
      }
      if (response.status === 200) {
        const token = response.data.token;
        const user = response.data.user;
        localStorage.setItem('token', token);

        localStorage.setItem('userId', user.id);
        localStorage.setItem('type', user.type);
        localStorage.setItem('image', user.image ? user.image : "---");
        localStorage.setItem('mobile', user.mobile ? user.mobile : "---");
        localStorage.setItem('fullName', user.fullName ? user.fullName : "---");
        localStorage.setItem('email', user.email ? user.email : "---");
        localStorage.setItem('created_at', user.created_at ? user.created_at : "---");
        
        const secretKey = "PCSAGRI3759426586252";
        if (!secretKey) {
          alert("Secret key is undefined. Make sure REACT_APP_SECRET_KEY_ONE is defined in the .env file.");
        }
        const encryptedData = CryptoJS.AES.encrypt(response.data.user.type, secretKey).toString();
        localStorage.setItem('typeEncrypted', encryptedData);

        localStorage.setItem('isNoticeOfBroadCastSeen', user.isNoticeOfBroadCastSeen === 1 ? "seen" : "notseen")
        localStorage.setItem('is_np', user.is_np === 1 ? "activated" : "desactivated");
        localStorage.setItem('is_an', user.is_an === 1 ? "activated" : "desactivated");
        localStorage.setItem('is_maj', user.is_maj === 1 ? "activated" : "desactivated");
        localStorage.setItem('is_ja', user.is_ja === 1 ? "activated" : "desactivated");
 
        if(user.type !== "staff"){
          const resp = await axios.get(`${ENDPOINT_API}getadmin/${user.id}`,{
            headers : {
              Authorization : `Bearer ${response.data.token}`
            }
          });
          if(resp.status === 200){
            localStorage.setItem('company_mobile', resp.data.company_mobile ? resp.data.company_mobile : "---");
            localStorage.setItem('company_name', resp.data.company_name ? resp.data.company_name : "---");
            localStorage.setItem('company_email', resp.data.company_email ? resp.data.company_email : "---");
            localStorage.setItem('adminId', resp.data.id);
          }
          else{
            localStorage.setItem('adminId', "---");
            localStorage.setItem('company_mobile', "---");
            localStorage.setItem('company_name', "---");
            localStorage.setItem('company_email', "---");
          }
        }
        
        navigate(0);
      }
      else{
        
        if(!showItResponse){
        setisErrorResponse(true);
        setmessageResponse("Une erreur est survenue lors de la connexion.");
        setshowItResponse(true);
        setTimeout(()=>{          
          setshowItResponse(false);
        }, 4500);}
      }
    } catch (error) {
      console.log(error);
      
      
      if(!showItResponse){
      setisErrorResponse(true);
        setmessageResponse("Une erreur est survenue lors de la connexion.");
        setshowItResponse(true);
        setTimeout(()=>{          
          setshowItResponse(false);
        }, 4500);}

      console.error("Erreur lors de la connexion", error);
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
      <h2 className="login-title">Accéder à votre compte</h2>
      <p className="login-subtitle">&nbsp;</p>
      <form className="login-form" onSubmit={handleSubmit}>
        
        <label className="login-label" htmlFor="email">Adresse Email</label>
        <input
          id="email"
          className={`login-input ${errors.email ? 'input-error' : ''}`}
          placeholder="your@email.com"
          value={email}
          onChange={(e) => handleInputChange(e, 'email')}
        />
        
        <label className="login-label" htmlFor="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          className={`login-input ${errors.password ? 'input-error' : ''}`}
          placeholder="Votre Mot de passe"
          value={password}
          onChange={(e) => handleInputChange(e, 'password')}
        />
        
        {errors.general && <p className="error-message">{errors.general}</p>}

        <button 
          disabled={loader}
          type="submit" 
          className={`login-button ${loader ? 'disabled-button' : ''}`}
          >
        {
          loader ? "Connexion en cours..." : "Se connecter"  
        }
        </button>        
        <p className="login-subtitle2" onClick={() => navigate('/become-member')}>
          Nouveau ici ? Inscrivez-vous
        </p>
      </form>
    </div>
  );
}

export default Login;
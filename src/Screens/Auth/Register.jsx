import React, { useState } from 'react';
import './login.css';
import axios from 'axios';
import { ENDPOINT_API } from "../../endpoint";
import { useNavigate } from 'react-router-dom';
import ErrorSuccess from '../../Components/ErrorSuccess';



function Register() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setmobile] = useState('');
  const [errors, setErrors] = useState({});
  const [showItResponse, setshowItResponse] = useState(false);
  const [isErrorResponse, setisErrorResponse] = useState(false);
  const [messageResponse, setmessageResponse] = useState(null);

 
  const handleInputChange = (e, field) => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));

    if (field === 'name') {
      setName(e.target.value);
    } else if (field === 'email') {
      setEmail(e.target.value);
    } else if (field === 'password') {
      setPassword(e.target.value);
    }
      else if (field === 'mobile') {
        setmobile(e.target.value);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!name) validationErrors.name = 'Nom et prénom requis';
    if (!email || !/\S+@\S+\.\S+/.test(email)) validationErrors.email = 'Adresse email invalide';
    if (!password || password.length < 5) validationErrors.password = 'Au moins 5 caractères';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      if(
!showItResponse){     setisErrorResponse(true);
        setmessageResponse("Les informations fournies sont incorrectes.");
        setshowItResponse(true);
        setTimeout(()=>{          
          setshowItResponse(false);
        }, 4500);}
      return;
    }

    try {
      setLoader(true);
      const response = await axios.post(`${ENDPOINT_API}register`, { fullName : name,email : email,password : password, mobile : mobile });
      if (response.status === 201) {
        setEmail('');
        setPassword('');
        setName('');
        setmobile('');
        setisErrorResponse(false);
        setmessageResponse("Inscription confirmée. Nous procéderons à l'examen de votre profil et vous recevrez un email dans les 24 heures pour la prochaine étape.");
        setshowItResponse(true);
        setTimeout(()=>{          
          setshowItResponse(false);
        }, 30000);
      }
      else if(response.status === 205) {
        if(
!showItResponse){       setisErrorResponse(true);
        setmessageResponse("Une erreur est survenue lors de l'inscription. Veuillez réessayer !");
        setshowItResponse(true);
        setTimeout(()=>{          
          setshowItResponse(false);
        }, 4500);}
      }
    } catch (error) {
      if( !showItResponse){
      setisErrorResponse(true);
        setmessageResponse("Une erreur est survenue lors de l'inscription. Veuillez réessayer !");
        setshowItResponse(true);
        setTimeout(()=>{          
          setshowItResponse(false);
        }, 4500);}
      console.log(error);
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
      <h2 className="login-title">Rejoignez-nous !</h2>
      <p className="login-subtitle3">Rejoignez notre communauté dès maintenant et découvrez tous nos avantages !</p>
      <form className="login-form" onSubmit={handleSubmit}>
        
        <label className="login-label" htmlFor="name">
          Nom et prénom 
          {errors.name && <p className="error-message">{errors.name}</p>}

        </label>
        <input
          id="name"
          className={`login-input ${errors.name ? 'input-error' : ''}`}
          placeholder="Votre Nom et Prénom"
          value={name}
          maxLength={100}
          onChange={(e) => handleInputChange(e, 'name')}
        />
        
        <label className="login-label" htmlFor="email">
          Adresse Email 
          {errors.email && <p className="error-message">{errors.email}</p>}

        </label>
        <input
          id="email"
          maxLength={100}
          className={`login-input ${errors.email ? 'input-error' : ''}`}
          placeholder="your@email.com"
          value={email}
          onChange={(e) => handleInputChange(e, 'email')}
        />

        <label className="login-label" htmlFor="mobile">
          Numéro de téléphone 

        </label>
        <input
          id="mobile"
          maxLength={20}
          className={`login-input`}
          placeholder="+212 XXX XXX XXX"
          value={mobile}
          onChange={(e) => handleInputChange(e, 'mobile')}
        />
        
        <label className="login-label" htmlFor="pass">
          Mot de passe 
          {errors.password && <p className="error-message">{errors.password}</p>}
        </label>
        <input
          type="password"
          id="pass"
          className={`login-input ${errors.password ? 'input-error' : ''}`}
          placeholder="Votre Mot de passe"
          value={password}
          onChange={(e) => handleInputChange(e, 'password')}
        />
        
        <button 
          disabled={loader}
          type="submit"
          className={`login-button ${loader ? 'disabled-button' : ''}`}
        >
        {
          loader ? "Création du compte en cours..." : "S’inscrire"  
        }
        </button>
        <p className="login-subtitle2" onClick={() => navigate('/login')}>
          Déjà inscrit ? Connectez-vous
        </p>
      </form>
    </div>
  );
}

export default Register;
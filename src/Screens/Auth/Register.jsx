import React, { useState } from 'react';
import './login.css';
import axios from 'axios';
import { ENDPOINT_API } from "../../endpoint";
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleInputChange = (e, field) => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));

    if (field === 'name') {
      setName(e.target.value);
    } else if (field === 'email') {
      setEmail(e.target.value);
    } else if (field === 'password') {
      setPassword(e.target.value);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!name) validationErrors.name = 'Nom et prénom requis';
    if (!email || !/\S+@\S+\.\S+/.test(email)) validationErrors.email = 'Adresse email invalide';
    if (!password || password.length < 6) validationErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoader(true);
      const response = await axios.post(`${ENDPOINT_API}register`, { fullName : name,email : email,password : password });
      if (response.status === 201) {
        setEmail('');
        setPassword('');
        setName('');
        alert("Inscription réussie, Nous allons examiner votre profil et vous recevrez un email dans un délai de 24 heures pour la prochaine étape.")
      }
      else if(response.status === 205) {
        alert("Échec de l'inscription");
      }
    } catch (error) {
      alert("Échec de l'inscription");
      console.log(error);
    } finally{
      setLoader(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Rejoignez-nous !</h2>
      <p className="login-subtitle3">Rejoignez notre communauté dès maintenant et découvrez tous nos avantages !</p>
      <form className="login-form" onSubmit={handleSubmit}>
        
        <label className="login-label" htmlFor="name">
          Nom et prénom 
        </label>
        <input
          id="name"
          className={`login-input ${errors.name ? 'input-error' : ''}`}
          placeholder="Votre Nom et Prénom"
          value={name}
          onChange={(e) => handleInputChange(e, 'name')}
        />
        
        <label className="login-label" htmlFor="email">
          Adresse Email 
        </label>
        <input
          id="email"
          className={`login-input ${errors.email ? 'input-error' : ''}`}
          placeholder="your@email.com"
          value={email}
          onChange={(e) => handleInputChange(e, 'email')}
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
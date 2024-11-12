import React, { useState } from 'react';
import './login.css';
import axios from 'axios';
import { ENDPOINT_API } from "../../endpoint";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

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
    if (!email || !/\S+@\S+\.\S+/.test(email)) validationErrors.email = 'Adresse email invalide';
    if (!password || password.length < 6) validationErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      setLoader(true);
      const response = await axios.post(`${ENDPOINT_API}login`, { email, password });
      if(response.data.message === "Votre accès à l'application est restreint."){
        alert(`Votre accès à l'application est restreint.`);
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
        alert('Erreur lors de la connexion');
      }
    } catch (error) {
      alert('Erreur lors de la connexion');
      console.error("Erreur lors de la connexion", error);
    } finally{
      setLoader(false);
    }
  };

  return (
    <div className="login-container">
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
import React, { useState } from 'react';
import './login.css';
import axios from 'axios';
import { ENDPOINT_API } from "../../endpoint";
import { useNavigate } from 'react-router-dom';
import ErrorSuccess from '../../Components/ErrorSuccess';

function Register() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', mobile: '' });
  const [errors, setErrors] = useState({});
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
    const { fullName, email, mobile, password } = formData;

    if (!fullName) validationErrors.fullName = 'Nom et prénom requis';
    if (fullName.length <= 2) validationErrors.fullName = 'Nom et prénom invalide';
    if (!email || !/\S+@\S+\.\S+/.test(email)) validationErrors.email = 'Adresse email invalide';

    if (!password || password.length < 8) {
      validationErrors.password = 'Mot de passe invalide.';
    }  
      if (!/[A-Z]/.test(password))  validationErrors.password = 'Mot de passe invalide.';
      if (!/[a-z]/.test(password))  validationErrors.password = 'Mot de passe invalide.';
      if (!/[0-9]/.test(password))  validationErrors.password = 'Mot de passe invalide.';
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) validationErrors.password = 'Mot de passe invalide.';
  

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setResponseInfo({ show: true, isError: true, message: 'Les informations fournies sont incorrectes.' });
      setTimeout(() => setResponseInfo({ ...responseInfo, show: false }), 4500);
      return;
    }

    try {
      setLoader(true);
      const response = await axios.post(`${ENDPOINT_API}register`, formData);
      if (response.status === 201) {
        setFormData({ fullName: '', email: '', password: '', mobile: '' });
        setResponseInfo({
          show: true,
          isError: false,
          message: "Inscription réussie. Vous recevrez un email sous 24 heures pour la prochaine étape.",
        });
        setTimeout(() => setResponseInfo({ ...responseInfo, show: false }), 30000);
      } else {
        setResponseInfo({
          show: true,
          isError: true,
          message: "Une erreur est survenue lors de l'inscription. Veuillez réessayer !",
        });
        setTimeout(() => setResponseInfo({ ...responseInfo, show: false }), 4500);
      }
    } catch (error) {
      setResponseInfo({
        show: true,
        isError: true,
        message: "Une erreur est survenue. Veuillez réessayer plus tard.",
      });
      setTimeout(() => setResponseInfo({ ...responseInfo, show: false }), 4500);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="login-container">
      <ErrorSuccess isError={responseInfo.isError} showIt={responseInfo.show} message={responseInfo.message} />
      <h2 className="login-title">Rejoignez-nous !</h2>
      <p className="login-subtitle3">Rejoignez notre communauté dès maintenant et découvrez tous nos avantages !</p>
      <form className="login-form" onSubmit={handleSubmit}>
        {['fullName', 'email', 'mobile', 'password'].map((field) => (
          <div key={field}>
            <label className="login-label" htmlFor={field}>
              {field === 'fullName' && 'Nom et prénom'}
              {field === 'email' && 'Adresse Email'}
              {field === 'mobile' && 'Numéro de téléphone'}
              {field === 'password' && 'Mot de passe'}
              {errors[field] && <p className="error-message">{errors[field]}</p>}
            </label>
            <input
              id={field}
              name={field}
              type={field === 'password' ? 'password' : 'text'}
              maxLength={field === 'mobile' ? 20 : 100}
              className={`login-input ${errors[field] ? 'input-error' : ''}`}
              placeholder={
                field === 'fullName'
                  ? 'Votre Nom et Prénom'
                  : field === 'email'
                  ? 'your@email.com'
                  : field === 'mobile'
                  ? '+212 XXX XXX XXX'
                  : 'Votre Mot de passe'
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
        <button disabled={loader} type="submit" className={`login-button ${loader ? 'disabled-button' : ''}`}>
          {loader ? 'Création du compte en cours...' : 'S’inscrire'}
        </button>
        <p className="login-subtitle2" onClick={() => navigate('/login')}>
          Déjà inscrit ? Connectez-vous
        </p>
      </form>
    </div>
  );
}

export default Register;

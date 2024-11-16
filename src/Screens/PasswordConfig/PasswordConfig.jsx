import { useParams, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import './index.css';
import NavBar from '../../Components/Navbar';
import axios from 'axios';
import LVG from '../Dashboard/Loader.gif';
import { ENDPOINT_API } from '../../endpoint';
import PopUp from '../../Components/PopUp';
import ErrorSuccess from '../../Components/ErrorSuccess';

const PasswordConfig = () => {
  const { id, from, name } = useParams();
  const navigate = useNavigate();
  const [isModifierMotDePasseClicked, setisModifierMotDePasseClicked] = useState(true);
  const [password, setpassword] = useState('');
  const [confirmpassword, setconfirmpassword] = useState('');
  const [loadingModification, setLoadingModification] = useState(false);
  const [showItResponse, setshowItResponse] = useState(false);
  const [isErrorResponse, setisErrorResponse] = useState(false);
  const [messageResponse, setmessageResponse] = useState(null);
  const [isDone, setisDone] = useState(true);
  const [passwordVisibility, setPasswordVisibility] = useState(false);  

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility); 
  };

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    specialChar: false,
  });

  const handlePasswordChange = (value) => {
    setpassword(value);
    setPasswordValidation({
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      digit: /[0-9]/.test(value),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    });
  };

  const handleUpdatePassword = async () => {
    if (id && name) {
      if (password !== confirmpassword) {
        setResponseMessage('Les mots de passe ne correspondent pas.', true);
        return;
      }
      if (Object.values(passwordValidation).includes(false)) {
        setResponseMessage('Le mot de passe ne remplit pas tous les critères.', true);
        return;
      }

      try {
        setLoadingModification(true);
        const token = localStorage.getItem('token');
        const userIdNum = parseInt(id);
        const dataPss = {
          nouveau: password,
          confirmnouveau: confirmpassword,
        };
        const resp = await axios.post(`${ENDPOINT_API}updatePasswordByAdmin/${userIdNum}`, dataPss, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (resp.status === 200) {
          resetFields();
          setResponseMessage('Le mot de passe a été modifié avec succès.', false);
        } else {
          setResponseMessage('Une erreur est survenue lors de la modification.', true);
        }
      } catch (e) {
        setResponseMessage('Une erreur est survenue lors de la modification.', true);
      } finally {
        setLoadingModification(false);
      }
    }
  };

  const setResponseMessage = (message, isError) => {
    setisErrorResponse(isError);
    setmessageResponse(message);
    setshowItResponse(true);
    setTimeout(() => setshowItResponse(false), 4500);
  };

  const resetFields = () => {
    setpassword('');
    setconfirmpassword('');
    setisDone(true);
    setPasswordValidation({
      length: false,
      uppercase: false,
      lowercase: false,
      digit: false,
      specialChar: false,
    });
  };

  return (
    <>
      <NavBar />
      <PopUp />
      <ErrorSuccess isError={isErrorResponse} showIt={showItResponse} message={messageResponse} />
      <div className={loadingModification ? 'popUp6666 showpopUp' : 'popUp6666'}>
        <span>
          <img src={LVG} alt="..." height={21} width={21} />
          &nbsp;&nbsp;Modification en cours...
        </span>
      </div>
      <div className="profile">
        <div className="ofs22">
          <span className='zsirfddhf'>Mot de passe&nbsp;&nbsp;</span><span>/&nbsp;&nbsp;Réinitialisation</span>
        </div>
        <div className="usfuovuoousuov">
          <div className="sfovwdsfovwd sfovwdsfovwd2 sfovwdsfovwd33">
            <div className="OFSUV7934NF">
              Utilisateur désigné&nbsp;&nbsp;:&nbsp;&nbsp;{name}
            </div>
          </div>
          <div className="sfovwdsfovwd sfovwdsfovwd2 sfovwdsfovwd33">
            <div className="OFSUV7934NF">Nouveau mot de passe</div>
            <div className="ivz7979n">
              <input
                onChange={(e) => handlePasswordChange(e.target.value)}
                value={password}
                type={passwordVisibility ? 'text' : 'password'}
                disabled={loadingModification}
                placeholder="Veuillez saisir votre nouveau mot de passe..."
              />
              <div className="showOrHIde" onClick={togglePasswordVisibility}>
              {
                passwordVisibility ? <i className='fa-solid fa-eye-slash'></i> : <i className='fa-solid fa-eye'></i>
              }
              </div>
            </div>
          </div>
        
          <div className="sfovwdsfovwd sfovwdsfovwd2 sfovwdsfovwd33">
            <div className="OFSUV7934NF">Confirmer le mot de passe</div>
            <div className="ivz7979n">
              <input
                onChange={(e) => setconfirmpassword(e.target.value)}
                value={confirmpassword}
                type={passwordVisibility ? 'text' : 'password'}
                disabled={loadingModification}
                placeholder="Veuillez re-saisir votre nouveau mot de passe..."
              />
                 <div className="showOrHIde" onClick={togglePasswordVisibility}>
              {
                passwordVisibility ? <i className='fa-solid fa-eye-slash'></i> : <i className='fa-solid fa-eye'></i>
              }
              </div>
            </div>
          </div>

          {password && (
              <div className="password-helper">
                <p className={passwordValidation.length ? 'valid' : 'invalid'}>• Au moins 8 caractères</p>
                <p className={passwordValidation.uppercase ? 'valid' : 'invalid'}>• Une lettre majuscule</p>
                <p className={passwordValidation.lowercase ? 'valid' : 'invalid'}>• Une lettre minuscule</p>
                <p className={passwordValidation.digit ? 'valid' : 'invalid'}>• Un chiffre</p>
                <p className={passwordValidation.specialChar ? 'valid' : 'invalid'}>• Un caractère spécial</p>
              </div>
            )}

          <div
            className={isModifierMotDePasseClicked ? "sfovwdsfovwd modifierMotDePasse8modifierMotDePasse8" : "sfovwdsfovwd"}
          >
            <button
              className="modifierMotDePasse8"
              disabled={loadingModification}
              onClick={() => navigate(from === "someToken" ? '/personnels' : '/clients')}
            >
              {isDone ? "Retour" : "Annuler"}
            </button>
            <button className="modifierMotDePasse8" disabled={loadingModification} onClick={handleUpdatePassword}>
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordConfig;

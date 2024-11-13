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

  const {id, from, name} = useParams();
  const navigate = useNavigate();
  const [isModifierMotDePasseClicked,setisModifierMotDePasseClicked] = useState(true);
  const [password,setpassword] = useState("");
  const [confirmpassword,setconfirmpassword] = useState("");
  const [loadingModification, setLoadingModification] = useState(false);
  const [showItResponse, setshowItResponse] = useState(false);
  const [isErrorResponse, setisErrorResponse] = useState(false);
  const [messageResponse, setmessageResponse] = useState(null);

 

  
  const handleUpdatePassword = async()=>{
    if(id && name){
      if((password !== confirmpassword) && (password.length !== confirmpassword.length)){
        alert("le mot de passe et la confirmation ne sont pas identiques.");
        return;
      }
      else if(confirmpassword.length <5 || password.length < 5){
        alert('Le mot de passe doit contenir au moins 5 caracteres ! ');
        return;
      }
      try{
        setLoadingModification(true);
        const token = localStorage.getItem('token'); 
        const userIdNum = parseInt(id);
        let dataPss = {
          nouveau : password, 
          confirmnouveau : confirmpassword
        }
        const resp = await axios.post(`${ENDPOINT_API}updatePasswordByAdmin/${userIdNum}`,dataPss, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if(resp.status === 200){
          setpassword("");
          setconfirmpassword('');
          setLoadingModification(false);
         
          
          if(!showItResponse){
          setisErrorResponse(false);
          
          setmessageResponse("Le mot de passe a été modifié avec succès.");
          setshowItResponse(true);
          setTimeout(()=>{          
            setshowItResponse(false);
          }, 4500);}

          
        }
        else{
          setLoadingModification(false);
          if(!showItResponse){ 
          setisErrorResponse(true);
        setmessageResponse("Une erreur est survenue lors de la modification du mot de passe.");
        setshowItResponse(true);
        setTimeout(()=>{          
          setshowItResponse(false);
        }, 4500);}
        }
      }
      catch(e){
        if(!showItResponse){ 
        setisErrorResponse(true);
        setmessageResponse("Une erreur est survenue lors de la modification du mot de passe.");
        setshowItResponse(true);
        setTimeout(()=>{          
          setshowItResponse(false);
        }, 4500);}
        console.log(e.message);
      }
      finally{
        setLoadingModification(false);
      }
    }
  }

  return (
    <>
      <NavBar />
      <PopUp/>

      <ErrorSuccess  
        isError={isErrorResponse}
        showIt={showItResponse}
        message={messageResponse}  
      />

      
      <div className={loadingModification ? 'popUp6666 showpopUp' : 'popUp6666'}>
        <span style={{
          fontSize: '16px', 
          fontWeight: '500',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}>
          <img src={LVG} alt="..." height={21} width={21} />
          &nbsp;&nbsp;Modification en cours...
        </span>
      </div>
      <div className="profile">
        <div className="ofs">
          <div><span>Mot de passe&nbsp;</span><span>&nbsp;&nbsp;/&nbsp;&nbsp;Réinitialisation</span></div>
        </div>
        <div className="usfuovuoousuov">
          
          <div  className="sfovwdsfovwd sfovwdsfovwd2 sfovwdsfovwd33">
            <div className="OFSUV7934NF">
              Utilisateur désigné&nbsp;&nbsp;:&nbsp;&nbsp;{name && name}
            </div>
          </div>
          <div  className="sfovwdsfovwd sfovwdsfovwd2 sfovwdsfovwd33">
            <div className="OFSUV7934NF">Nouveau mot de passe</div>
            <div className="ivz7979n">
              <input 
                onChange={(e)=>{
                  setpassword(e.target.value);
                }}
                value={password}
                type="password" 
                disabled={loadingModification}
                placeholder='Veuillez saisir votre nouveau mot de passe...'  
              />
            </div>
          </div>
          <div  className="sfovwdsfovwd sfovwdsfovwd2 sfovwdsfovwd33">
            <div className="OFSUV7934NF">Confirmer le mot de passe </div>
            <div className="ivz7979n">
              <input    
                onChange={(e)=>{
                  setconfirmpassword(e.target.value);
                }}
                value={confirmpassword}
                type="password" 
                disabled={loadingModification}
                placeholder='Veuillez re-saisir votre nouveau mot de passe...'  
              />
            </div>
          </div>
          <div  className={isModifierMotDePasseClicked ? "sfovwdsfovwd modifierMotDePasse8modifierMotDePasse8" : "sfovwdsfovwd"}>
            <button className='modifierMotDePasse8'
              disabled={loadingModification}
              onClick={()=>{
                setisModifierMotDePasseClicked(false);
                if(from === "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjM0NTY3ODkwLCJ1c2VyX25hbWUiOiJKb2huIERvZSIsImV4cCI6MTY1Mzk0MjAwMH0.YXZhdGVnaW9uZW5vZGVibG9nYXMak8ab8ac890moplaimfok666"){
                  navigate('/personnels')
                }
                else{
                  navigate('/clients');
                }
              }}
            >
              Annuler
            </button>
            <button className='modifierMotDePasse8'
              disabled={loadingModification}
              onClick={()=>{
                handleUpdatePassword();
              }}
            >
              Enregistrer les modifications 
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordConfig;
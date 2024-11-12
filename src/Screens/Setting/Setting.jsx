import React, { useEffect, useState } from 'react';
import './index.css';
import NavBar from '../../Components/Navbar';
import axios from 'axios';
import LVG from '../Dashboard/Loader.gif';
import { ENDPOINT_API } from '../../endpoint';
import SwitchButton from '../../Components/SwitchButton';

const Setting = () => {
  const [type, setType] = useState(null);
  const [token, setToken] = useState(null);
  
  // Separate states for each switch
  const [isNotificationsPush, setIsNotificationsPush] = useState(false);
  const [isAbbonnement, setIsAbbonnement] = useState(false);
  const [isMiseAJour, setIsMiseAJour] = useState(false);
  const [isJournalisation, setIsJournalisation] = useState(false);
  const [loadRefresh, setloadRefresh] = useState(false);
  const [isModifierMotDePasseClicked,setisModifierMotDePasseClicked] = useState(false);
  const [password,setpassword] = useState("");
  const [confirmpassword,setconfirmpassword] = useState("");
  
  const [loader, setLoader] = useState(false);
  const [loadingModification, setLoadingModification] = useState(false);

  const fetchInfosUser = () => {   
    setLoader(true);
    let typeUser = localStorage.getItem('type');
    let tokenUser = localStorage.getItem('token');

    setIsNotificationsPush(localStorage.getItem('is_np') === 'activated'? true : false);
    setIsAbbonnement(localStorage.getItem('is_an') === 'activated' ? true : false);
    setIsMiseAJour(localStorage.getItem('is_maj') === 'activated' ? true : false);
    setIsJournalisation(localStorage.getItem('is_ja') === 'activated' ? true : false);

    setType(typeUser);
    setToken(tokenUser);
    
    setLoader(false);
  };




  const handleUpdatePassword = async()=>{
    
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
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token'); 
      const userIdNum = parseInt(userId);
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
        setisModifierMotDePasseClicked(false);
        setTimeout(()=>{
          alert('Votre mot de passe a été mis à jour avec succès ! ');
        }, 400);
      }
      else{
        setLoadingModification(false);
        alert("Oops, une erreur s'est produite ! ");
      }

    }
    catch(e){
      alert("Oops, une erreur s'est produite ! ");
      console.log(e.message);
    }
    finally{
      setLoadingModification(false);
    }
  }


  const refreshParams = async ()=>{
    setloadRefresh(true);
    setTimeout(()=>{
      localStorage.setItem("is_np", "activated");
      localStorage.setItem("is_an", "activated");
      localStorage.setItem("is_maj", "activated");
      localStorage.setItem("is_ja", "activated");
    }, 400);

    try{
      
      await axios.get(`${ENDPOINT_API}refreshAllParams/${parseInt(localStorage.getItem('userId'))}`, {
        headers : {
          Authorization : `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchInfosUser();
      setloadRefresh(false);
    }
    catch(e){
      console.log(e.message);
      setloadRefresh(false);
    }
    setloadRefresh(false);
  }





  useEffect(() => {
    fetchInfosUser();
  }, []);

  return (
    <>
      <NavBar />

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


      <div className={loadRefresh ? 'popUp6666 showpopUp' : 'popUp6666'}>
        <span style={{
          fontSize: '16px', 
          fontWeight: '500',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}>
          <img src={LVG} alt="..." height={21} width={21} />
          &nbsp;&nbsp;Réinitialisation en cours...
        </span>
      </div>

      <div className="profile">
        <div className="ofs">
          <div><span>Mes&nbsp;</span><span>Paramètres&nbsp;&nbsp;{isModifierMotDePasseClicked && <>/&nbsp;&nbsp;Mot de passe</>}</span></div>
          {
            isModifierMotDePasseClicked === false  && 
            <button
              onClick={()=>{
                refreshParams();
              }}
              disabled={loader || loadRefresh}
              className={loader || loadRefresh ? 'disabled oefbbofoufzuofzs' : 'oefbbofoufzuofzs'}
            >
              <i className="fa-solid fa-arrows-rotate"></i>
              {
                !loadRefresh &&
                <div className="tooltip">Réinitialiser les paramètres</div> 
              }
            </button>
          }
        </div>
        
        <div className="usfuovuoousuov">
        
        {
          !isModifierMotDePasseClicked ?
          <>
          <div className="sfovwdsfovwd">
            <div className="OFSUV7934NF">Notifications Push</div>
            <div className="ivz7979n">
              <SwitchButton
                loader={loader}
                isEnabled={isNotificationsPush}
                onToggle={(newState) => setIsNotificationsPush(newState)}
                label="Recevez des alertes en temps réel pour rester informé de toute nouvelle activité."
              />
            </div>
          </div>

          <div className="sfovwdsfovwd">
            <div className="OFSUV7934NF">Abonnement à la Newsletter</div>
            <div className="ivz7979n">
              <SwitchButton
                loader={loader}
                isEnabled={isAbbonnement}
                onToggle={(newState) => setIsAbbonnement(newState)}
                label="Inscrivez-vous ou désabonnez-vous des newsletters pour recevoir des informations sur les nouveautés et offres."
              />
            </div>
          </div>

          <div className="sfovwdsfovwd">
            <div className="OFSUV7934NF">Mise à jour automatique</div>
            <div className="ivz7979n">
              <SwitchButton
                loader={loader}
                isEnabled={isMiseAJour}
                onToggle={(newState) => setIsMiseAJour(newState)}
                label="Permettez à l’application de télécharger et d’installer automatiquement les nouvelles mises à jour."
              />
            </div>
          </div>

          <div  className="sfovwdsfovwd">
            <div className="OFSUV7934NF">Journalisation des Activités</div>
            <div className="ivz7979n">
              <SwitchButton
                isEnabled={isJournalisation}
                loader={loader}
                onToggle={(newState) => setIsJournalisation(newState)}
                label="Enregistrez un historique de toutes vos actions pour faciliter le suivi et les rapports d’utilisation."
              />
            </div>
          </div>
          </>
          :
          <>
           
          <div  className="sfovwdsfovwd sfovwdsfovwd2 sfovwdsfovwd33">
            <div className="OFSUV7934NF">Nouveau mot de passe</div>
            <div className="ivz7979n">
              <input 
                onChange={(e)=>{
                  setpassword(e.target.value);
                }}
                value={password}
                type="password" 
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
                placeholder='Veuillez re-saisir votre nouveau mot de passe...'  
              />
            </div>
          </div>
          </>
        }
        
          <div  className={isModifierMotDePasseClicked ? "sfovwdsfovwd modifierMotDePasse8modifierMotDePasse8" : "sfovwdsfovwd"}>
            {
            !isModifierMotDePasseClicked ?
            <div className='usovfduc9779 usovfduc9779usovfduc9779'>
            <div className="OFSUV7934NF">
              Mot de passe
              <p>
              Changez votre mot de passe pour sécuriser davantage votre compte.
            </p>
            </div>
            <button className="modifierMotDePasse8"
              disabled={loadingModification}
              onClick={()=>{
                setisModifierMotDePasseClicked(true)
              }}
            >
              Modifier le mot de passe
            </button>
            </div>
            :
            <>
            <button className='modifierMotDePasse8'
              disabled={loadingModification}
              onClick={()=>{
                setisModifierMotDePasseClicked(false);
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
            </> 
            }
          </div>



        </div>
      </div>
    </>
  );
};

export default Setting;

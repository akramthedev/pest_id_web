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
  
  const [loader, setLoader] = useState(false);
  const [loadingModification, setLoadingModification] = useState(false);

  const fetchInfosUser = () => {
    setLoader(true);
    let typeUser = localStorage.getItem('type');
    let tokenUser = localStorage.getItem('token');

    setIsNotificationsPush(localStorage.getItem('is_np') === 'true');
    setIsAbbonnement(localStorage.getItem('is_an') === 'true');
    setIsMiseAJour(localStorage.getItem('is_maj') === 'true');
    setIsJournalisation(localStorage.getItem('is_ja') === 'true');

    setType(typeUser);
    setToken(tokenUser);
    
    setLoader(false);
  };

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

      <div className="profile">
        <div className="ofs">
          <div><span>Mes&nbsp;</span><span>Paramètres</span></div>
          <button
            disabled={loader || loadingModification}
            className={loader || loadingModification ? 'disabled oefbbofoufzuofzs' : 'oefbbofoufzuofzs'}
          >
            <i className="fa-solid fa-arrows-rotate"></i>
            <div className="tooltip">Réinitialiser les paramètres</div>
          </button>
        </div>
        
        <div className="usfuovuoousuov">
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
        </div>
      </div>
    </>
  );
};

export default Setting;

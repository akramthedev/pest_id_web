import React, { useEffect, useState } from 'react';
import './index.css';
import axios from 'axios';
import { ENDPOINT_API } from '../endpoint';


const SwitchButton = ({ isEnabled = false, onToggle = () => {}, label = '', loader }) => {
  const [isSwitchOn, setIsSwitchOn] = useState(isEnabled);
  const [STOP, setSTOP] = useState(false);



  useEffect(() => {
    setIsSwitchOn(isEnabled);
  }, [isEnabled]);

  const toggleSwitch = async () => {
    setSTOP(true);
    if(label !== ""){
      setIsSwitchOn(prevState => !prevState);
      onToggle(!isSwitchOn);
      const token = localStorage.getItem('token');
      const idUserCurrent = parseInt(localStorage.getItem('userId'))
      try{
        if(isEnabled === false){
          // activate it
          if(label === "Recevez des alertes en temps réel pour rester informé de toute nouvelle activité." ){
            localStorage.setItem("is_np", "activated");
            await axios.get(`${ENDPOINT_API}activate-np/${idUserCurrent}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });setSTOP(false);
          }
          else if(label === "Inscrivez-vous ou désabonnez-vous des newsletters pour recevoir des informations sur les nouveautés et offres." ){
            localStorage.setItem("is_an", "activated");
            await axios.get(`${ENDPOINT_API}activate-an/${idUserCurrent}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });setSTOP(false);
          }
          else if(label === "Permettez à l’application de télécharger et d’installer automatiquement les nouvelles mises à jour." ){
            localStorage.setItem("is_maj", "activated");
            await axios.get(`${ENDPOINT_API}activate-maj/${idUserCurrent}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });setSTOP(false);
          }
          else if(label === "Enregistrez un historique de toutes vos actions pour faciliter le suivi et les rapports d’utilisation." ){
            localStorage.setItem("is_ja", "activated");
            await axios.get(`${ENDPOINT_API}activate-ja/${idUserCurrent}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });setSTOP(false);
          }
        }
        else{
          // desactivate it
          if(label === "Recevez des alertes en temps réel pour rester informé de toute nouvelle activité." ){
            localStorage.setItem("is_np", "desactivated");
            await axios.get(`${ENDPOINT_API}desactivate-np/${idUserCurrent}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });setSTOP(false);
          }
          else if(label === "Inscrivez-vous ou désabonnez-vous des newsletters pour recevoir des informations sur les nouveautés et offres." ){
            localStorage.setItem("is_an", "desactivated");
            await axios.get(`${ENDPOINT_API}desactivate-an/${idUserCurrent}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });setSTOP(false);
          }
          else if(label === "Permettez à l’application de télécharger et d’installer automatiquement les nouvelles mises à jour." ){
            localStorage.setItem("is_maj", "desactivated");
            const resp = await axios.get(`${ENDPOINT_API}desactivate-maj/${idUserCurrent}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            console.log(resp.data);
            setSTOP(false);
          }
          else if(label === "Enregistrez un historique de toutes vos actions pour faciliter le suivi et les rapports d’utilisation." ){
            localStorage.setItem("is_ja", "desactivated");
            await axios.get(`${ENDPOINT_API}desactivate-ja/${idUserCurrent}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            setSTOP(false);
          }
        }
      }
      catch(e){
        console.log(e.message);
        setSTOP(false);
      }
    }
    setSTOP(false);
  };

  return (
    <div className="switch-container">
      <div className="tooltip">Activer/ Désactiver</div> 
      {label && <span className="switch-label">{label}</span>}
      <button disabled={loader || STOP} className={` oefbbofoufzuofzs666 switch ${isSwitchOn ? 'switch-on oefbbofoufzuofzs666' : ' oefbbofoufzuofzs666'}`} onClick={toggleSwitch}>
        <div className={`switch-circle ${isSwitchOn ? 'circle-on' : ''}`} />
      </button>
    </div>
  );
};

export default SwitchButton;

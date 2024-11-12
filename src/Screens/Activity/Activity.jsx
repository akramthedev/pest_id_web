import React, { useEffect, useState} from 'react'
import "./index.css";
import NavBar from '../../Components/Navbar';
import axios from 'axios';
import formatDateForCreatedAt from '../../Helpers/formatCreatedAt';
import formatPhoneNumber from '../../Helpers/formatMobile';
import LVG from '../Dashboard/Loader.gif'
import { ENDPOINT_API } from "../../endpoint";
import { useNavigate } from 'react-router-dom';


const Activity = () => {

  const [type, settype] = useState(null);   
  const [JA, setJA] = useState(null);   
  const [loaderDelete, setloaderDelete] = useState(null);
  const [loading, setloading] = useState(null);
  const [dataHistory, setdataHistory] = useState(null);
  const nav = useNavigate();


 

    const fetchAllHistory = ()=>{
      setloading(true);
      let pp = localStorage.getItem("type");
      let ja = localStorage.getItem("is_ja");
      settype(pp);
      setJA(ja);
      setloading(false);

    }



    const handleDeleteAllHistory = async ()=>{
      if(dataHistory){
        if(dataHistory.length === 0){
          return;
        }
        else{
          //delete all history data
        }
      } 
      else{
        return;
      }
    }


  useEffect(()=>{
    fetchAllHistory();
  }, []);


  return (
    <>
      <NavBar /> 

      <div className={loaderDelete ? "popUp6666 showpopUp" : "popUp6666"}>
        <span style={{
          fontSize : '16px', 
          fontWeight : "500",
          display : "flex", 
          alignItems : "center", 
          justifyContent :"center"
        }}>
          <img src={LVG} alt="..." height={21} width={21} />
          &nbsp;&nbsp;Modification en cours...
        </span>
      </div>


      <div className='profile profileiioioioj'>
          <div className="ofs">
            <div>
              <span>
                Historique
                &nbsp;
              </span>
              <span>
                d'activité
              </span>
            </div>
          
            <button
              disabled={loaderDelete || loading}
              className={loaderDelete ? "disabled disabledX oefbbofoufzuofzs" : "oefbbofoufzuofzs disabledX"}
              onClick={()=>{
                handleDeleteAllHistory();
              }}
            >
              <div className="tooltip">Supprimer tout l'historique</div>
              <i className='fa-solid fa-trash-can' ></i>
            </button>
        </div>
        <div className="usfhuvhushuf">
          <div className="info">
          Votre suivi d'activité est actuellement désactivé. <br /> Activez-le à tout moment dans la page des paramètres.
          </div>
          <button
            onClick={()=>{
              nav("/setting");
            }}
          >
            <i className='fa-solid fa-gear'></i>&nbsp;
            Accéder aux paramètres
          </button>
        </div>
        <div className="usfhuvhushuf2">
         
          
          
          
        <div className="itemomomo">
            <div className="siufhusdc">
              <div>
                <i className='fa-solid fa-check' ></i>
              </div>
              <div>
                Une erreu survenue lors de la création de la ferme et la serre. .
              </div>
            </div>
            <span>
              19/11/2024
            </span>
          </div>


 



        </div>
      </div>
    </>
  )
}

export default Activity;
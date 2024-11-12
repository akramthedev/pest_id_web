import React, { useEffect, useState} from 'react'
import "./index.css";
import NavBar from '../../Components/Navbar';
import axios from 'axios';
import formatDateForCreatedAt from '../../Helpers/formatCreatedAt';
import LVG from '../Dashboard/Loader.gif'
import { ENDPOINT_API } from "../../endpoint";
import { useNavigate } from 'react-router-dom';


const Activity = () => {

  const [type, settype] = useState(null);   
  const [JA, setJA] = useState(null);   
  const [loaderDelete, setloaderDelete] = useState(false);
  const [loading, setloading] = useState(null);
  const [dataHistory, setdataHistory] = useState(null);
  const [isNull, setisNull] = useState(false);
  const nav = useNavigate();


 

    const fetchAllHistory = async ()=>{
      setloading(true);
      let pp = localStorage.getItem("type");
      let ja = localStorage.getItem("is_ja");
      settype(pp);
      setJA(ja);
      
      try{
          const userId = localStorage.getItem('userId');
          const userIdNum = parseInt(userId);
          const token = localStorage.getItem('token');
      
          const resp = await axios.get(`${ENDPOINT_API}getAllActivitiesByUser/${userIdNum}`, {
              headers: {
              'Authorization': `Bearer ${token}`
              }
          });
          if(resp.status === 200){
              setdataHistory(resp.data);
              if(resp.data.length === 0){
                setisNull(true);
              }
              else{
                setisNull(false);
              }
          }
          else{
              setdataHistory([]);
              setisNull(true);
          }
          console.warn(resp.status);
      }     
      catch(e){
          setdataHistory([]);
          setisNull(true);
          console.log(e.message);
      } finally{
        setloading(false);
      }
      
    }



    const handleDeleteAllHistory = async ()=>{
      try{
        if(dataHistory){
          if(dataHistory.length === 0){
            return;
          }
          else{
            setloaderDelete(true);
            const resp = await axios.delete(`${ENDPOINT_API}deleteAllActivityByUser/${parseInt(localStorage.getItem('userId'))}`, {
                headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if(resp.status === 200){
              setdataHistory([]);
            }
            setloaderDelete(false);
          }
        } 
        else{
          return;
        }
      }
      catch(e){
        console.log(e.message);
      } finally{
        setloaderDelete(false);
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
          &nbsp;&nbsp;Suppression en cours...
        </span>
      </div>


      <div className='profile profileiioioioj'>
          <div className="ofs">
            <div>
              <span>
                Historique
                &nbsp;
              </span>
              <span >
                d'activité&nbsp;&nbsp;&nbsp;{loading && <img src={LVG} alt="..." height={25} width={25} />}
              </span>
            </div>
          
            <button
              disabled={loaderDelete || loading || isNull}
              className={loaderDelete || loading || isNull ? "disabled disabledX oefbbofoufzuofzs" : "oefbbofoufzuofzs"}
              onClick={()=>{
                handleDeleteAllHistory();
              }}
            >
              <div className="tooltip">Supprimer tout l'historique</div>
              <i className='fa-solid fa-trash-can' ></i>
            </button>
        </div>
        {
          JA !== null && JA !== undefined && 
          <>
          {
            JA === "desactivated" && 
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
          }
          </>
        }



        {
          loading ? 

          <div className="usfhuvhushuf2 uzsorfvshfvohsfuvhosfhv uzsfuvuosfuosqfoud">
            <img src={LVG} alt="..." height={20} width={20} />&nbsp;&nbsp;Chargement des données...
          </div>

          :


            <div className={`usfhuvhushuf2 ${JA && JA === "desactivated" ? "uzsorfvshfvohsfuvhosfhv" : ""}`}>

                {
                  JA !== null && JA !== undefined &&
                  <>
                  {
                    JA === "desactivated" && 
                    <div className="ousuofozofvs793794" />
                  }
                  </>
                }


                {
                  dataHistory && 
                  <>
                  {
                    dataHistory.length === 0 ? 
                    <div className="zovuoizovzufvnuoznfvous">
                      Aucune donnée
                    </div>
                    :
                    <>
                    {
                      dataHistory.map((data, index)=>{
                        if(data.isDanger === 1 || data.isDanger === "1" || data.isDanger === true){
                          return(
                            <div className="itemomomo">
                  
                            <div className="siufhusdc">
                                <div className='eushfvofs eushfvofs2'>
                                  <i className='fa-solid fa-xmark' ></i>
                                </div>
                                <div>
                                {
                                  data.action
                                }
                                </div>
                              </div>
                              <span>
                              {
                                formatDateForCreatedAt(data.created_at)
                              }
                              </span>
                            </div>

                          )
                        }
                        else{
                          return(
                            <div className="itemomomo">
                  
                              <div className="siufhusdc">
                                <div className='eushfvofs'>
                                  <i className='fa-solid fa-check' ></i>
                                </div>
                                <div>
                                {
                                  data.action
                                }
                                </div>
                              </div>
                              <span>
                              {
                                formatDateForCreatedAt(data.created_at)
                              }
                              </span>
                            </div>

                          )
                        }
                      })
                    }
                    </>
                  }
                  </>
                }



              </div>
        }
      </div>
    </>
  )
}

export default Activity;
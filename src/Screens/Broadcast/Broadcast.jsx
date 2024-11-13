import React, { useEffect, useState} from 'react'
import "./index.css";
import NavBar from '../../Components/Navbar';
import axios from 'axios';
import formatDateForCreatedAt from '../../Helpers/formatCreatedAt';
import formatPhoneNumber from '../../Helpers/formatMobile';
import LVG from '../Dashboard/Loader.gif'
import { ENDPOINT_API } from "../../endpoint";
import PopUp from '../../Components/PopUp';
import ErrorSuccess from '../../Components/ErrorSuccess';





const Broadcast = () => {


  const isNoticeOfBroadCastSeen = localStorage.getItem('isNoticeOfBroadCastSeen');

  const [DataBroadCast, setDataBroadCast] = useState(null);
  const [Title, setTitle] = useState(null);
  const [Description, setDescription] = useState(null);
  const [dataCurrentUser, setdataCurrentUser] = useState(null);
  const [isSuperAdministrator, setisSuperAdministrator] = useState(false);
  const [loading, setloading] = useState(true);
  const [isModifiedCLikec, setisModifiedCLikec] = useState(false);
  const [loaderModification, setloaderModification] = useState(false);
  const [noBroadcastYet, setnoBroadcastYet] = useState(null);
  const [deleteLoader, setdeleteLoader] = useState(false);
  const [isDeleteClicked, setisDeleteClicked] =useState(false);
  const [showItResponse, setshowItResponse] = useState(false);
  const [isErrorResponse, setisErrorResponse] = useState(false);
  const [messageResponse, setmessageResponse] = useState(null);

 
 

    const fetchDataBroadCastWithUser = async ()=>{
      setloading(true);
      try{

        const token = localStorage.getItem('token');
        const userId = parseInt(localStorage.getItem('userId'));

        const resp = await axios.get(`${ENDPOINT_API}user/${userId}`, {
          headers : {
            Authorization : `Bearer ${token}`
          }
        });

        if(resp.status === 200){
          setdataCurrentUser(resp.data);
          if(resp.data.type === "superadmin"){
            setisSuperAdministrator(true);
          }
          else{
            setisSuperAdministrator(false);
          }
        }
        else{
          setdataCurrentUser({})
        }
        const respBroad = await axios.get(`${ENDPOINT_API}broadcast`, {
          headers : {
            Authorization : `Bearer ${token}`
          }
        });

        if(respBroad.status === 200){
          console.log(respBroad.data);
          setDataBroadCast(respBroad.data);
          setTitle(respBroad.data.title);
          setDescription(respBroad.data.description);
          setnoBroadcastYet(false);
        }
        else{
          setDataBroadCast({});
          setnoBroadcastYet(true);
        }
      }
      catch(e){
        setDataBroadCast({});
        setdataCurrentUser({});
        setnoBroadcastYet(true);
        setisSuperAdministrator(false);
        console.log(e.message);
        
        if(!showItResponse){
        setisErrorResponse(true);
        setmessageResponse("Une erreur est survenue lors de la récupération du Broadcast.");
        setshowItResponse(true);
          setTimeout(()=>{          
            setshowItResponse(false);
          }, 4500);

        }
      } finally{
        setloading(false);
      }
    }



    const handleModification = async ()=>{
      if(Title.length <= 10){
        
        if(!showItResponse){
        setisErrorResponse(true);
        setmessageResponse("La description doit contenir un minimum de 10 caractères.");
        setshowItResponse(true);
          setTimeout(()=>{          
            setshowItResponse(false);
          }, 4500);

        }
        return;
      }
      else if(Description.length <= 20 ){
        
        if(!showItResponse){
        setisErrorResponse(true);
              setmessageResponse("La description doit contenir un minimum de 20 caractères.");
              setshowItResponse(true);
                setTimeout(()=>{          
                  setshowItResponse(false);
                }, 4500);

              }
        return
      }
      else{
        try{
          setloaderModification(true);
          const token = localStorage.getItem('token');
            
          let data = {
            title : Title,
            description : Description
          }
  
          if(noBroadcastYet === true){
            const resp = await axios.post(`${ENDPOINT_API}broadcast`, data ,{
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
    
            if(resp.status === 200){
              fetchDataBroadCastWithUser();
              setisModifiedCLikec(false);
              
              if(!showItResponse){
              setisErrorResponse(false);
              setmessageResponse("Le broadcast a été créé avec succès.");
              setshowItResponse(true);
                setTimeout(()=>{          
                  setshowItResponse(false);
                }, 4500);

              }
            }
            else{
              
              if(!showItResponse){
              setisErrorResponse(true);
                setmessageResponse("Une erreur est survenue lors de la création du broadcast.");
                setshowItResponse(true);
                setTimeout(()=>{          
                  setshowItResponse(false);
                }, 4500);

              }
            }
            setloaderModification(false);
          }
          else{
            if(Title === DataBroadCast.title && Description === DataBroadCast.description){
              setisModifiedCLikec(false);
              setloaderModification(false);
            }
            else{
              const resp = await axios.patch(`${ENDPOINT_API}broadcast`, data ,{
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
      
              if(resp.status === 200){
                fetchDataBroadCastWithUser();
                setisModifiedCLikec(false);
                
                if(!showItResponse){
                setisErrorResponse(false);
                setmessageResponse("Le broadcast a été modifié avec succès.");
                setshowItResponse(true);
                setTimeout(()=>{          
                  setshowItResponse(false);
                }, 4500);

              }
              }
              else{
                
                if(!showItResponse){
                setisErrorResponse(true);
                setmessageResponse("Une erreur est survenue lors de la modification du broadcast.");
                setshowItResponse(true);
                setTimeout(()=>{          
                  setshowItResponse(false);
                }, 4500);

              }
              }
              setloaderModification(false);
            }
          }
  
        }
        catch(e){
          
          if(!showItResponse){
          setisErrorResponse(true);
          setmessageResponse("Une erreur est survenue lors de la modification du broadcast.");
          setshowItResponse(true);
          setTimeout(()=>{          
            setshowItResponse(false);
          }, 4500);

        }
          console.log(e.message);
        } finally{
          setloaderModification(false);
        }
      }
    }


    const handleDelete = async()=>{
      setisDeleteClicked(false);
      setdeleteLoader(true);
      try{

        const token = localStorage.getItem('token');

        const resp = await axios.delete(`${ENDPOINT_API}broadcast` ,{
            headers: {
            'Authorization': `Bearer ${token}`
            }
        });
        if(resp.status === 200){
          fetchDataBroadCastWithUser();
          setDescription("");
          setTitle('');
          setdeleteLoader(false);
          setdeleteLoader(false);
          
          if(!showItResponse){
          setisErrorResponse(false);
        setmessageResponse("Le broadcast a été supprimé avec succès.");
        setshowItResponse(true);
        setTimeout(()=>{          
          setshowItResponse(false);
        }, 4500);

      }
        }
        else{
          fetchDataBroadCastWithUser();
          setdeleteLoader(false);
          
          if(!showItResponse){
          setisErrorResponse(true);
        setmessageResponse("Une erreur est survenue lors de la suppression du broadcast.");
        setshowItResponse(true);
        setTimeout(()=>{          
          setshowItResponse(false);
        }, 4500);

      }
        }
      }
      catch(e){
        setdeleteLoader(false);
        
        if(!showItResponse){
        setisErrorResponse(true);
        setmessageResponse("Une erreur est survenue lors de la suppression du broadcast.");
        setshowItResponse(true);
        setTimeout(()=>{          
          setshowItResponse(false);
        }, 4500);

      }
        console.log(e.message);
      }
    }

    const handleAnnuler = async()=>{
      setisModifiedCLikec(false);
      setDescription(DataBroadCast ? DataBroadCast.description : "");
      setTitle(DataBroadCast ? DataBroadCast.title : "");
    }


    useEffect(()=>{

      const checkHaveSeenTheBroadCast = async()=>{
        try{
          localStorage.setItem('isNoticeOfBroadCastSeen', "seen");
           await axios.get(`${ENDPOINT_API}userHaveSeenBroadCast/${parseInt(localStorage.getItem('userId'))}`,{
            headers : {
              Authorization : `Bearer ${localStorage.getItem('token')}`
            }
          });
        }
        catch(e){
          console.log(e.message)
        }
      } 
      checkHaveSeenTheBroadCast();
  
    },[]);


  useEffect(()=>{
    fetchDataBroadCastWithUser();
  }, []);


  return (
    <>
      <NavBar /> 
      <ErrorSuccess  
        isError={isErrorResponse}
        showIt={showItResponse}
        message={messageResponse}  
      />
      
      <div className={loaderModification ? "popUp6666 showpopUp" : "popUp6666"}>
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



      <div className={deleteLoader ? "popUp6666 showpopUp" : "popUp6666"}>
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




      <div className={isDeleteClicked ? "popUp666689 showpopUp" : "popUp666689"}>
      <div className="contPopUp popUp1 popUp1popUp1popUp12  popUp1popUp1popUp12345">
          <div className="caseD11">
            <span className='svowdjc'><i class="fa-solid fa-triangle-exclamation fa-triangle-exclamation2"></i>&nbsp;&nbsp;Confirmer&nbsp;</span><span className='svowdjc'>&nbsp;la suppression</span>
          </div>
          <div className="uzuovsououzv">
            <br />
            &nbsp;&nbsp;La suppression de ce Broadcast est irréversible et entraînera la perte définitive de ses données ! 
          </div>
          <div className="rowInp rowInpModified">
              <button 
                className='jofzvno' 
                disabled={deleteLoader} 
                onClick={()=>{
                  setisDeleteClicked(false);
                }} 
              >
                Annuler
              </button>
              <button 
                disabled={deleteLoader}
                onClick={()=>{
                  handleDelete();
                }}
                className={deleteLoader ? "efvofvz22 efvofvz2" : "efvofvz22"}
              >
              {
                deleteLoader ? "Traitement en cours..."
                :
                "Oui, je confirme"
              }
              </button>
          </div>
        </div>
      </div>
      


      <div className='profile'> 
        <div className="ofs">
          <div><span>Station&nbsp;</span><span>Broadcast{isModifiedCLikec && <>&nbsp;&nbsp;/&nbsp;&nbsp;Modification</>}</span></div>
          {
            isSuperAdministrator === true && 
            <>
              {
                isModifiedCLikec ? 
                <div className='uoezsrqdvc'>
                  <button
                    className={ loading || loaderModification ? "disabled oefbbofoufzuofzs" : "oefbbofoufzuofzs"}
                    disabled={loading || loaderModification}
                    onClick={()=>{
                      handleModification();
                    }}
                  >
                    <div className="tooltip">Sauvegarder les modifications</div>
                    <i className='fa-solid fa-check' ></i>
                  </button>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <button
                    disabled={loading || loaderModification}
                    className={loading || loaderModification ? "disabled oefbbofoufzuofzs" : "oefbbofoufzuofzs"}
                    onClick={()=>{
                      handleAnnuler();
                    }}
                  >
                    <div className="tooltip">Annuler les modifications</div>
                    <i className='fa-solid fa-xmark' ></i>
                  </button>
                </div>
                :
                <div className="ensembleBtn6">
                  {
                    noBroadcastYet !== null && 
                    <>
                    {
                      noBroadcastYet === false && 
                      <>
                        <button
                          disabled={loading || loaderModification || deleteLoader}
                          className={loading || loaderModification || deleteLoader ? "disabled oefbbofoufzuofzs" : "oefbbofoufzuofzs"}
                          onClick={()=>{
                            setisDeleteClicked(true);
                          }}
                        >
                          <div className="tooltip">Supprimer le Broadcast</div>
                          <i className='fa-solid fa-trash-can' ></i>
                        </button>
                        &nbsp;&nbsp;&nbsp;
                      </>
                    }
                    </>
                  }
                  <button
                    disabled={loading || loaderModification}
                    className={loading || loaderModification ? "disabled oefbbofoufzuofzs" : "oefbbofoufzuofzs"}
                    onClick={()=>{
                      setisModifiedCLikec(true);
                    }}
                  >
                    <div className="tooltip">Modifier le Broadcast</div>
                    <i className='fa-solid fa-pen' ></i>
                  </button>
                </div>
              }
            </>
          }
        </div>
        <div className="sfovwd">
        {
          loading ? 
          <div className='zufuozfhzrfozrf'>
            <img width={20} height={20} src={LVG} alt="" />&nbsp;&nbsp;Chargement...
          </div>
          :
          <div className='ozusv98ç'>
          {
            isModifiedCLikec ? 
            <div className="modifying866842">
              <div className="title">
                <div className="uzpkd2">
                  Titre 
                </div>
                <input 
                  type="text" 
                  value={Title}
                  onChange={(e)=>{
                    setTitle(e.target.value);
                  }}
                  placeholder='Veuillez saisir le titre du broadcast...'
                />
              </div>
              <div className="description">
                <div className="uzpkd">
                  Description 
                </div>
                <textarea 
                  value={Description}
                  aria-multiline={true}
                  placeholder='Veuillez saisir la description du broadcast...'
                  onChange={(e)=>{
                    setDescription(e.target.value);
                  }}
                ></textarea>
              </div>
            </div>
            :
            <div className="notmodifying866842">
              {noBroadcastYet ? (
                <div className="zufuozfhzrfozrf zufuozfhzrfozrf2">
                  Aucun broadcast en ce moment.
                  <br />
                  <br />
                  {isSuperAdministrator
                    ? "Pour informer les utilisateurs d'une mise à jour, créez un broadcast."
                    : " Vous recevrez une notification lorsqu'un broadcast sera disponible !"}
                </div>
              ) : (
                DataBroadCast && 
                <div className="modifying866842">
                  <div className="title title2">
                  {
                    DataBroadCast.title ? DataBroadCast.title : "---" 
                  }
                  </div>
                  <div className="description description2">
                  {
                    DataBroadCast.description ? DataBroadCast.description : "---" 
                  }
                  </div>
                  <div className="description3">
                  {
                    DataBroadCast.created_at ? <>Diffusé le :  {formatDateForCreatedAt(DataBroadCast.created_at)}</> : "---" 
                  }
                  </div>
                </div>
              )}
            </div>

          }
          </div>
        }
        </div>
      </div>
    </>
  )
}

export default Broadcast;
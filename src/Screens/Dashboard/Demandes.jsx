import React, { useState, useEffect } from 'react';
import "./index.css";
import NavBar from '../../Components/Navbar';
import SideBar from '../../Components/SideBar';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import axios from 'axios'
import { ENDPOINT_API } from "../../endpoint";
import LVG from './Loader.gif'
import formatDateForCreatedAt from '../../Helpers/formatCreatedAt';
import PopUp from '../../Components/PopUp';





const actionTemplate = (params, isRefusedClicked, setisRefusedClicked, isAcceptedClicked, setisAcceptedClicked, setparamClicked) => {
  
  
  return (
    <div className='uefuvzou'>
      <button className='uoersf'   onClick={()=>{
        setparamClicked(params);
        setisAcceptedClicked(true);
      }}  >
        <i class="fa-solid fa-check"></i>
      </button>
      <button    className='uoersf'  onClick={()=>{
        setparamClicked(params);
        setisRefusedClicked(true);
      }}  >
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  );
};


const Demandes = () => {

  const [nouvellesDemandes, setNouvellesDemandes] = useState([]);
  const [loadingNouvDem, setLoadingNouvDem] = useState(true);
  const [isAcceptedClicked,setisAcceptedClicked] = useState(false);
  const [isRefusedClicked,setisRefusedClicked] = useState(false);
  const [paramClicked,setparamClicked] = useState(null);
  const [refresh,setRefresh] = useState(null);
  const [loadingAccepte, setloadingAccepte] = useState(false);
  const [loadingRefuse, setloadingRefuse] = useState(false);

  const isNoticeOfBroadCastSeen = localStorage.getItem('isNoticeOfBroadCastSeen');


  const fetchNouvellesDemandes = async () => {
    try {
      setLoadingNouvDem(true);
      const userId = localStorage.getItem('userId');
      const userIdNum = parseInt(userId);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${ENDPOINT_API}users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200 ) {
        console.warn(response.data.users);
        let i = 0;
        const transformedData = response.data.users
          .filter(user => user.id !== userIdNum && user.canAccess === 0 && user.isEmailVerified === 0)
          .map(user => {
            i++; 
            let createdAt = formatDateForCreatedAt(user.created_at);
            return {
              idInc: i,
              id: user.id,
              fullName: user.fullName ? user.fullName : "---",
              password: user.password ? user.password : "---",
              type: user.type ? user.type : "---",
              idUser: user.id ? user.id : "---",
              image: user.image ? user.image : "---",
              email: user.email ? user.email : "---",
              mobile: user.mobile ? user.mobile : "---",
              created_at: user.created_at ? createdAt : "---",
            };
          });
        setNouvellesDemandes(transformedData);

      }
      else{
        setNouvellesDemandes([]);
      }
  
    } catch (error) {
      setNouvellesDemandes([]);
      console.error('Erreur:', error.message);
    } finally {
      setLoadingNouvDem(false);
    }
  };
   


  useEffect(() => {
    fetchNouvellesDemandes();
  }, [refresh]);

 

 
  const handleAccepter = async()=>{
    if(paramClicked){
      setloadingAccepte(true);
      try{
        
        const token = localStorage.getItem('token');
        const response = await axios.post(`${ENDPOINT_API}accept/${parseInt(paramClicked.row.id)}`);

        if(response.status ===200){
          const response2 = await axios.get(`${ENDPOINT_API}admin/${parseInt(paramClicked.row.id)}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if(response2){
            setloadingAccepte(false);
            setNouvellesDemandes(prevnouvellesDemandes => 
              prevnouvellesDemandes.filter(item => item.id !== paramClicked.id)
            );
            setisAcceptedClicked(false);
          }
          else{
            setloadingAccepte(false);
            setisAcceptedClicked(false);
            alert('Oops, Error ! ');
          }
        }
        else{
          setloadingAccepte(false);
          setisAcceptedClicked(false);
          alert('Oops, Error ! ');
        }
        
      }
      catch(e){
        console.log(e.message);
        setloadingAccepte(false);
       setisAcceptedClicked(false);
        alert('Oops, Error ! ');
      }
       
    }
    else{
      alert("Oups, Erorr ! ");
      return;
    }
  }


  const handleRefuser = async()=>{
    if(paramClicked){
      setloadingRefuse(true);
      try{
        const token = localStorage.getItem('token');
      
        const response = await axios.post(`${ENDPOINT_API}refuse/${parseInt(paramClicked.row.id)}`);

        if(response.status ===200){
          setloadingRefuse(false);
          setNouvellesDemandes(prevnouvellesDemandes => 
            prevnouvellesDemandes.filter(item => item.id !== paramClicked.id)
          );
          setisRefusedClicked(false);
        }
        else{
          setloadingRefuse(false);
          setisRefusedClicked(false);
          alert('Oops, Error ! ');
        }
        
      }
      catch(e){
        console.log(e.message);
        setloadingRefuse(false);
        setisRefusedClicked(false);
        alert('Oops, Error ! ');
      }
       
    }
    else{
      alert("Oups, Erorr ! ");
      return;
    }
  }


  const handleRefuser2 = async () => {
    /*
    setNouvellesDemandes(prevnouvellesDemandes => 
      prevnouvellesDemandes.filter(item => item.id !== params.row.id)
    );
    try{

      const token = localStorage.getItem('token');

      const response = await axios.delete(`${ENDPOINT_API}deleteUserStaffNotAdmin/${parseInt(params.row.idUser)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if(response.status === 200){
      }
      else{
        alert('Not deleted');
        setRefresh(!refresh);
      }
     
    }
    catch(e){
      alert('Not deleted');
      setRefresh(!refresh);
      console.log(e.message);
    }
    */
  };


 

  const columns = [
    { 
      field: 'id', 
      headerName: 'idReal', 
      width: 130, 
      headerAlign: 'center', 
      align: 'center',
      hide: true  
    },
    { 
      field: 'idInc', 
      headerName: 'ID', 
      width: 100, 
      headerAlign: 'center', 
      align: 'center' 
    },
    { 
      field: 'fullName', 
      headerName: 'Nom et prénom', 
      minWidth: 350, 
      headerAlign: 'center', 
      align: 'center',
      flex: 1 
    },
    { 
      field: 'password', 
      headerName: 'Password', 
      minWidth: 0, 
      headerAlign: 'center', 
      align: 'center',
      flex: 1 
    },
    { 
      field: 'email', 
      headerName: 'Adresse Email', 
      minWidth: 350, 
      headerAlign: 'center', 
      align: 'center',
      flex: 1 
    },
    { 
      field: 'mobile', 
      headerName: 'Téléphone', 
      minWidth: 250, 
      headerAlign: 'center', 
      align: 'center',
      flex: 1 
    },
    { 
      field: 'created_at', 
      headerName: 'Date création', 
      width: 200, 
      headerAlign: 'center', 
      align: 'center',
      flex: 1 
    },
    { 
      field: 'actions', 
      renderCell: (params) => actionTemplate(params, isRefusedClicked, setisRefusedClicked, isAcceptedClicked, setisAcceptedClicked, setparamClicked), 
      headerName: 'Actions', 
      minWidth: 100, 
      headerAlign: 'center', 
      align: 'center',
      flex: 1  
    }
  ];
  
    
    



    

  return (
    <div className='Dashboard'>
      <NavBar /> 
      <SideBar />
      <PopUp/>

      <div className={isAcceptedClicked ? "popUp  showpopUp" : "popUp "}>
        <div className="contPopUp popUp1 popUp1popUp1popUp12">
          <div className="caseD11">
            <span className='zufshvwo'>Confirmer&nbsp;</span><span  className='zufshvwo'>&nbsp;l'adhésion&nbsp;{paramClicked && <>:&nbsp;{paramClicked.row.fullName}</>}</span>
          </div>
          <div className="uzuovsououzv">
            En acceptant, cet utilisateur deviendra membre avec accès complet à la plateforme.
          </div>
          <div className="rowInp rowInpModified">
              <button 
                className='jofzvno' 
                disabled={loadingAccepte} 
                onClick={()=>{
                  setisAcceptedClicked(false);
                  setparamClicked(null);
                }} 
              >
                Annuler
              </button>
              <button 
                disabled={loadingAccepte}
                onClick={()=>{
                  handleAccepter();
                }}
                className={loadingAccepte ? "efvofvz efvofvz2  efvofvz3795" : "efvofvz efvofvz3795"}
              >
              {
                loadingAccepte ? "Traitement en cours..."
                :
                "Oui, je confirme"
              }
              </button>
          </div>
        </div>
      </div>







      <div className={isRefusedClicked ? "popUp  showpopUp" : "popUp "}>
        <div className="contPopUp popUp1 popUp1popUp1popUp12">
          <div className="caseD11">
            <span className='svowdjc'>Refuser&nbsp;</span><span className='svowdjc'>&nbsp;l'adhésion&nbsp;{paramClicked && <>:&nbsp;{paramClicked.row.fullName}</>}</span>
          </div>
          <div className="uzuovsououzv">
          Le refus empêchera cet utilisateur de devenir membre et d'accéder à la plateforme.
          </div>
          <div className="rowInp rowInpModified">
              <button 
                className='jofzvno' 
                disabled={loadingRefuse} 
                onClick={()=>{
                  setisRefusedClicked(false);
                  setparamClicked(null);
                }} 
              >
                Annuler
              </button>
              <button 
                disabled={loadingRefuse}
                onClick={()=>{
                  handleRefuser();
                }}
                className={loadingRefuse ? "efvofvz22 efvofvz2" : "efvofvz22"}
              >
              {
                loadingRefuse ? "Traitement en cours..."
                :
                "Oui, je refuse"
              }
              </button>
          </div>
        </div>
      </div>





       
 

      <div className="containerDash">
          <div className="rowD1">
            <div className="caseD1">
              <span>Nouvelles</span><span>&nbsp;Demandes</span>
              {
                loadingNouvDem ? 
                <>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src={LVG} alt="..." height={23} width={23} />
                </>
                :
                <>
                &nbsp;&nbsp;
                {
                  nouvellesDemandes && <span className="iyzsiyvqdc">:&nbsp;&nbsp;{nouvellesDemandes.length}</span>
                }
                </>
              }
            </div>
            <div className="caseD2">
              <button  disabled={loadingNouvDem}  className='eofvouszfv00 oefbbofoufzuofzs' onClick={()=>{setRefresh(!refresh)}} ><div className="tooltipXX">Actualiser</div><i className='fa-solid fa-arrows-rotate' ></i></button>
              <button   className='eofvouszfv22'><i className='fa-solid fa-download' ></i>&nbsp;Exporter</button>
            </div>
          </div>
          {
            nouvellesDemandes !== null && 
            
            <Box  
              sx={{ 
                height: "calc(100% - 120px)", 
                width: '100%', 
                outline: "none",
                borderRadius: "20px !important",
              }}
            >
              <DataGrid
                columns={columns.filter(column => !['id','idInc', 'password'].includes(column.field))}
                hideFooter 
                rows={nouvellesDemandes}
                loading={loadingNouvDem}
                disableSelectionOnClick
                className='euosvuouof'
                experimentalFeatures={{ newEditingApi: false  }}
                components={{
                  NoRowsOverlay: () => <div>Aucune donnée</div>,  
                }}
                sx={{
                  '& .Mui-selected': {
                    backgroundColor: 'white !important',
                    outline: 'none',
                    '&:hover': {
                      backgroundColor: 'white !important', 
                    },
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: 'white',  
                  },
                  '& .MuiDataGrid-cell:focus': {
                    outline: 'none',  
                  },
                }}
              />
            </Box>
          }
      </div>
    </div>
  )
}

export default Demandes;

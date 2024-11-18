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
import ErrorSuccess from '../../Components/ErrorSuccess';







const actionTemplate = (params, isRefusedClicked, setisRefusedClicked, isFinalised, setisFinalised, setparamClicked,showItResponse, setisErrorResponse,  setshowItResponse, setmessageResponse) => {
  
  
  return (
    <div className='uefuvzou'>
    {
      params.row.isDone === "En cours" ? 
      <button className='uoersf'   onClick={()=>{
        setparamClicked(params);
        setisFinalised(true);
      }}  >
        <i class="fa-solid fa-check"></i>
      </button>
      :
      <em>---</em>
    }
    </div>
  );
};


const Reservations = () => {

  const [nouvellesDemandes, setNouvellesDemandes] = useState([]);
  const [loadingNouvDem, setLoadingNouvDem] = useState(true);
  const [isFinalised,setisFinalised] = useState(false);
  const [isRefusedClicked,setisRefusedClicked] = useState(false);
  const [paramClicked,setparamClicked] = useState(null);
  const [refresh,setRefresh] = useState(null);
  const [loadingAccepte, setloadingAccepte] = useState(false);
  const [loadingRefuse, setloadingRefuse] = useState(false);
  const [showItResponse, setshowItResponse] = useState(false);
  const [isErrorResponse, setisErrorResponse] = useState(false);
  const [messageResponse, setmessageResponse] = useState(null);

 


  const fetchNouvellesDemandes = async () => {
    try {
      setLoadingNouvDem(true);
      const userId = localStorage.getItem('userId');
      const userIdNum = parseInt(userId);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${ENDPOINT_API}getAllDemos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200 ) {
        console.warn(response.data);
        const transformedData = response.data
          .map(user => {
            return {
              identification: user.identification,
              id: user.id,
              fullName: user.fullName ? user.fullName : "---",
              email: user.email ? user.email : "---",
              mobile: user.mobile ? user.mobile : "---",
              date: user.date ? user.date : "---",
              time: user.time ? user.time : "---",
              isDone: user.isDone === 1 ? "Finalisée" : "En cours" ,
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

 

  
 
    const columns = [
    { 
      field: 'id', 
      headerName: 'id', 
      width: 150, 
      headerAlign: 'center', 
      align: 'center',
      hide: true  
    },
    { 
      field: 'identification', 
      headerName: 'Identification', 
      width: 250, 
      headerAlign: 'center', 
      align: 'center' 
    },
    { 
      field: 'fullName', 
      headerName: 'Nom et prénom', 
      minWidth: 200, 
      headerAlign: 'center', 
      align: 'center',
      flex: 1 
    },
    { 
      field: 'email', 
      headerName: 'Adresse Email', 
      minWidth: 200, 
      headerAlign: 'center', 
      align: 'center',
      flex: 1 
    },
    { 
      field: 'mobile', 
      headerName: 'Téléphone', 
      minWidth: 180, 
      headerAlign: 'center', 
      align: 'center',
      flex: 1 
    },
    { 
      field: 'date', 
      headerName: 'Date', 
      width: 150, 
      headerAlign: 'center', 
      align: 'center',
      flex: 1 
    },
    { 
      field: 'time', 
      headerName: 'Heure', 
      width: 70, 
      headerAlign: 'center', 
      align: 'center',
      flex: 1 
    },
    { 
      field: 'isDone', 
      headerName: 'Statut', 
      width: 100, 
      headerAlign: 'center', 
      align: 'center',
      flex: 1 ,
      renderCell: (params) => {
        const isAuthorized = params.value === 'Finalisée';
        return (
          <div
             
          >
            <span
              style={{
                backgroundColor: isAuthorized ? '#e0ffc1' : '#f7eaff',
                color : isAuthorized ? '#477a14' : '#9d00ff',
                padding : "0.3rem 1rem", 
                borderRadius : "3rem", 
                fontWeight : "500"
              }}
            >
              {params.value}
            </span>
          </div>
        );
      },
    },
    { 
      field: 'actions', 
      renderCell: (params) => actionTemplate(params, isRefusedClicked, setisRefusedClicked, isFinalised, setisFinalised, setparamClicked,showItResponse, setisErrorResponse,  setshowItResponse, setmessageResponse), 
      headerName: 'Actions', 
      minWidth: 100, 
      headerAlign: 'center', 
      align: 'center',
      flex: 1  
    }
  ];
  
    
    

  const handleMarkAsFinalised = async()=>{
    try{  

      setloadingAccepte(true);
      console.warn(paramClicked.row);

      const resp = await axios.get(`${ENDPOINT_API}markAsDone/${paramClicked.row.id}`, {
        headers : {
          Authorization : `Bearer ${localStorage.getItem('token')}`
        }
      });

      if(resp.status === 200){
        setloadingAccepte(false);
        
        setNouvellesDemandes((prevNouvellesDemandes) =>
          prevNouvellesDemandes.map((item) =>
            item.id === paramClicked.row.id ? { ...item, isDone: "Finalisée" } : item
          )
        );
        
        setisFinalised(false);
      }
      else{
        setloadingAccepte(false);
      }
      setloadingAccepte(false);
    }
    catch(e){
      console.log(e.message);
      setloadingAccepte(false);
    }
  }



    

  return (
    <div className='Dashboard'>
      <NavBar /> 
      <SideBar />
      <PopUp/>
      <ErrorSuccess  
        isError={isErrorResponse}
        showIt={showItResponse}
        message={messageResponse}  
      />

      <div className={isFinalised ? "popUp  showpopUp" : "popUp "}>
        <div className="contPopUp popUp1 popUp1popUp1popUp12">
          <div className="caseD11">
            <span className='zufshvwo'>Confirmation &nbsp;</span><span className='zufshvwo'>de&nbsp;&nbsp;finalisation&nbsp;</span>
          </div>
          <div className="uzuovsououzv">
            Êtes-vous sûr de vouloir marquer cette réservation comme finalisée ? Cette action est irréversible.
          </div>
          <div className="rowInp rowInpModified">
              <button 
                className='jofzvno' 
                disabled={loadingAccepte} 
                onClick={()=>{
                  setisFinalised(false);
                  setparamClicked(null);
                }} 
              >
                Annuler
              </button>
              <button 
                disabled={loadingAccepte}
                onClick={()=>{
                  handleMarkAsFinalised();
                }}
                className={loadingAccepte ? "efvofvz efvofvz2  efvofvz3795" : "efvofvz efvofvz3795"}
              >
              {
                loadingAccepte ? "Traitement en cours..."
                :
                "Confirmer"
              }
              </button>
          </div>
        </div>
      </div>



      

      <div className="containerDash">
          <div className="rowD1">
            <div className="caseD1">
              <span>Demandes </span><span>&nbsp;de Réservations</span>
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
              <button  disabled={loadingNouvDem}  className='eofvouszfv00 oefbbofoufzuofzs oefbbofoufzuofzsoefbbofoufzuofzs2' onClick={()=>{setRefresh(!refresh)}} > <i className='fa-solid fa-arrows-rotate' ></i></button>
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
                columns={columns.filter(column => !['id'].includes(column.field))}
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

export default Reservations;

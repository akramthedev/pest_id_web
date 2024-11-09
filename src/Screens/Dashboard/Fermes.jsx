import React, { useState, useEffect } from 'react';
import "./index.css";
import NavBar from '../../Components/Navbar';
import formatDateForCreatedAt from '../../Helpers/formatCreatedAt';
import SideBar from '../../Components/SideBar';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import Select from 'react-select';
import 'primeflex/primeflex.css';
import axios from 'axios'
import { ENDPOINT_API } from "../../endpoint";
import LVG from './Loader.gif'



const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];


const actionTemplate = (params, setFermes, setRefresh, refresh,seteditClicked, editClicked , setcalcul_to_Edited) => {
  
  
  const handleEdit = () => {
    console.log('Edit:', params.row);
    setcalcul_to_Edited(params.row);
    seteditClicked(!editClicked);
  };


  const handleView = async () => {
    console.log('View:', params.row);
    // we show just images
  };


  const handleDelete = async () => {
    setFermes(prevFermes => 
      prevFermes.filter(item => item.id !== params.row.id)
    );
    try{
      const token = localStorage.getItem('token');
      
      const response = await axios.delete(`${ENDPOINT_API}predictions/${params.row.id}`,{
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
  };

  return (
    <div className='uefuvzou'>
      <button className='uoersf'   onClick={handleView}  >
        <i class="fa-solid fa-eye"></i>
      </button>
      <button className='uoersf'   onClick={handleEdit}  >
      <i class="fa-solid fa-pencil"></i>
      </button>
      <button    className='uoersf'  onClick={handleDelete}  >
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  );
};


const Fermes = () => {

  const [refresh,setRefresh] = useState(false);
  const [Appelation,setAppelation] = useState("");
  const [Fermes, setFermes] = useState([]);
  const [addClicked, setaddClicked] = useState(false);
  const [editClicked, seteditClicked] = useState(false);
  const [calcul_to_Edited, setcalcul_to_Edited] = useState(null);
  const [localisation, setLocalisation] = useState(null);
  const [Size, setSize] = useState("");
  const [loadingCreation, setloading] = useState(false);
  const [loadingAllFarms, setloadingAllFarms] = useState(true);
  const [loadingEdit, setloadingEdit] = useState(false);


  const handleChange = (option) => {
    setLocalisation(option);
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      height : "45px",
      border: '1px solid #ccc',     
      boxShadow: state.isFocused ? 'none' : 'none', 
      '&:hover': { border: '1px solid #ccc' } 
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#5fa21b' : '#fff',
      color: state.isSelected ? '#fff' : '#333',
      '&:hover': state.isSelected ? { backgroundColor: '#5fa21b', color: '#fff' } : { backgroundColor: '#c9ff93' },
    }),
  };


 




  const fetchDataPrediction = async () => {
    try {
      setloadingAllFarms(true);
      const userId = localStorage.getItem('userId');
      const userIdNum = parseInt(userId);
      const token = localStorage.getItem('token'); 

      const response = await axios.get(`${ENDPOINT_API}farms/${userIdNum}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        let i = 0;
        const transformedData = response.data.map(item => {
          i++;
          let createdAt = formatDateForCreatedAt(item.created_at)
          console.warn(createdAt);
          return {
            idInc : i,
            id : item.id,
            name : item.name ? item.name : "---", 
            location : item.location ? item.location : "---", 
            size : item.size ? item.size : "---", 
            created_at:  item.created_at ? createdAt : "---",
          };
        });
        setFermes(transformedData);
      }
      
      else {
        alert('Oops, something went wrong ! ');
      }
    } catch (error) {
      alert('Oops, something went wrong ! ');
      console.error('Erreur :', error.message);
    } finally {
      setloadingAllFarms(false);
    }
  };



  useEffect(() => {
    fetchDataPrediction();
  }, [refresh]);

    

    const handleSauvegarde = async ()=> {
      if(Appelation.length <= 2){
        alert("Le nom de la ferme ne peut pas être vide.");
      }
      else{
        try{  
          setloading(true);

          const token = localStorage.getItem('token');
          const userIdNum =  localStorage.getItem('userId');

          let dataX = {
            user_id : userIdNum, 
            name : Appelation, 
            location : localisation, 
            size : parseInt(Size),
          }

          const resp0 = await axios.post(`${ENDPOINT_API}farms`, dataX, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if(resp0.status === 201){
            setRefresh(!refresh);
            setaddClicked(false);
            setLocalisation("");
            setSize("");
            setAppelation("");
          }        
          else{
            alert('Oops, somethign went wrong ! ');
          }    
        }
        catch(e){
          alert('Oops, somethign went wrong ! ');
          console.log(e.message);
        }finally{
          setloading(false);
        }

      }
    }
 




    
    const columns = [
      { field: 'id', headerName: 'idReal', width: 100, headerAlign: 'center', align: 'center',hide: true  },
      { field: 'idInc', headerName: 'ID', width: 100, headerAlign: 'center', align: 'center' },
      { field: 'name', headerName: 'Appelation', minWidth: 350, editable: false, headerAlign: 'center', align: 'center' },
      { field: 'location', headerName: 'Localisation', minWidth: 350, editable: false, headerAlign: 'center', align: 'center' },
      { field: 'size', headerName: 'Mesure en m²', minWidth: 150, editable: false, headerAlign: 'center', align: 'center' },
      { field: 'created_at', headerName: 'Date création', width: 200, editable: false, headerAlign: 'center', align: 'center' },
      { 
        field: 'actions', 
        renderCell: (params) => actionTemplate(params, setFermes, setRefresh, refresh, seteditClicked, editClicked, setcalcul_to_Edited), 
        headerName: 'Actions', 
        minWidth: 200, 
        editable: false, 
        headerAlign: 'center', 
        align: 'center',
      }
    ];
    
    



    

  return (
    <div className='Dashboard'>
      <NavBar /> 
      <SideBar />

      {/*   edit Calculation    */}
      
        <div className={editClicked ? "popUp  showpopUp" : "popUp "}>
          <div className="contPopUp popUp1">
            <div className="caseD11">
              <span>Modifier&nbsp;le</span><span>&nbsp;Calcul</span>
            </div>
            {
            calcul_to_Edited !== null && 
              <>
                <div className="rowInp">
                  <label>ID Plaque</label>
                  <input 
                    onChange={(e)=>{setAppelation(e.target.value)}}
                    type="text"
                    value={calcul_to_Edited.plaque_id}
                    className='idplaque' 
                    placeholder="Veuillez saisir l'id de la plaque..."
                  />
                </div>
                 
                 
              </>
            }
            <div className="rowInp rowInpModified">
              <button className='jofzvno' disabled={loadingEdit} onClick={()=>{seteditClicked(false);setcalcul_to_Edited(null);}} >Annuler</button>
              <button 
                disabled={loadingEdit}
                onClick={()=>{
                  handleSauvegarde();
                }}
                className={loadingEdit ? "efvofvz efvofvz2" : "efvofvz"}
              >
              {
                loadingEdit ? "Sauvegarde en cours..."
                :
                "Sauvegarder les modifications"
              }
              </button>
            </div>
          </div>
        </div>
      

      {/*   Add new Calculation    */}
      <div className={addClicked ? "popUp showpopUp" : "popUp"}>
        <div className="contPopUp">
          <div className="caseD11">
            <span>Nouvelle</span><span>&nbsp;&nbsp;Ferme</span>
          </div>
          <div className="rowInp">
            <label>Appelation</label>
            <input 
              onChange={(e)=>{setAppelation(e.target.value)}}
              type="text"
              value={Appelation}
              className='idplaque' 
              placeholder="Veuillez saisir le nom de la ferme..."
            />
          </div>
          <div className="rowInp">
            <label>Localisation</label>
            <input 
              onChange={(e)=>{setLocalisation(e.target.value)}}
              type="text"
              value={localisation}
              className='idplaque' 
              placeholder="Veuillez saisir la location de la ferme..."
            />
          </div>
          <div className="rowInp">
            <label>Mesure en m²</label>
            <input 
              onChange={(e)=>{setSize(e.target.value)}}
              type="text"
              maxLength={5}
              value={Size}
              className='idplaque' 
              placeholder="Veuillez saisir la mesure de la ferme..."
            />
          </div>
         
          
          <div className="rowInp rowInpModified">
            <button className='jofzvno' disabled={loadingCreation} onClick={()=>{setaddClicked(false);setSize("");setLocalisation("");setAppelation("");}} >Annuler</button>
            <button 
              disabled={loadingCreation}
              onClick={()=>{
                handleSauvegarde();
              }}
              className={loadingCreation ? "efvofvz efvofvz2" : "efvofvz"}
            >
            {
              loadingCreation ? "Sauvegarde en cours..."
              :
              "Sauvegarder la ferme"
            }
            </button>
          </div>
        </div>
      </div>
      <div className="containerDash">
          <div className="rowD1">
            <div className="caseD1">
              <span>Mes</span><span>&nbsp;Fermes</span>
              {
                loadingAllFarms && 
                <>
                  &nbsp;&nbsp;&nbsp;<img src={LVG} alt="..." height={23} width={23} />
                </>
              }
            </div>
            <div className="caseD2">
              <button  title='Rafraîchir la page' className='eofvouszfv00' onClick={()=>{setRefresh(!refresh)}} ><i class="fa-solid fa-rotate-right"></i></button>
              <button  className='eofvouszfv11'  onClick={()=>{setaddClicked(true);}} ><i className='fa-solid fa-plus' ></i>&nbsp;Ajouter une ferme</button>
              <button   className='eofvouszfv22'><i className='fa-solid fa-download' ></i>&nbsp;Exporter</button>
            </div>
          </div>
          {
            Fermes !== null && 
            <Box sx={{ height: "calc(100% - 120px)", width: '100%', outline: "none" }}>
              <DataGrid
                columns={columns.filter(column => column.field !== 'id')}
                hideFooter 
                rows={Fermes}
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: false  }}
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

export default Fermes

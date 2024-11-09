import React, { useState, useEffect } from 'react';
import "./index.css";
import NavBar from '../../Components/Navbar';
import SideBar from '../../Components/SideBar';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import Select from 'react-select';
import 'primeflex/primeflex.css';
import axios from 'axios'
import { ENDPOINT_API } from "../../endpoint";
import LVG from './Loader.gif'
import formatDateForCreatedAt from '../../Helpers/formatCreatedAt';



const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];


const actionTemplate = (params, setCalculations, setRefresh, refresh,seteditClicked, editClicked , setcalcul_to_Edited) => {
  
  
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
    setCalculations(prevCalculations => 
      prevCalculations.filter(item => item.id !== params.row.id)
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


const Calculations = () => {

  const [refresh,setRefresh] = useState(false);
  const [IDplaque,setIDplaque] = useState("");
  const [Calculations, setCalculations] = useState([]);
  const [addClicked, setaddClicked] = useState(false);
  const [editClicked, seteditClicked] = useState(false);
  const [calcul_to_Edited, setcalcul_to_Edited] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [imageFile, setImageFile] = useState('');
  const [imageName, setImageName] = useState('');
  const [loading, setloading] = useState(false);
  const [loadingAllPred, setloadingAllPred] = useState(true);
  const [loadingEdit, setloadingEdit] = useState(false);


  const handleChange = (option) => {
    setSelectedOption(option);
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



  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file); 
      setImageName(file.name); 
    } else {
      setImageFile(""); 
      setImageName(''); 
    }
  };




  const fetchDataPrediction = async () => {
    try {
      setloadingAllPred(true);
      const userId = localStorage.getItem('userId');
      const userIdNum = parseInt(userId);
      const token = localStorage.getItem('token'); 

      const predictionsResponse = await axios.get(`${ENDPOINT_API}users/${userIdNum}/predictions/with/images`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (predictionsResponse.status === 200) {
        let i = 0;
        const transformedData = predictionsResponse.data.map(item => {
          i++;
          let createdAt = formatDateForCreatedAt(item.created_at)
          return {
            idInc : i,
            id : item.id,
            farm_id : item.farm_id ? item.farm_id : "---", 
            serre_id : item.serre_id ? item.serre_id : "---", 
            plaque_id : item.plaque_id ? item.plaque_id : "---", 
            result : `${item.result}%` ? item.result : "---", 
            class_A : item.images[0].class_A ? item.images[0].class_A : "---", 
            class_B : item.images[0].class_B ? item.images[0].class_B : "---", 
            class_C : item.images[0].class_C ? item.images[0].class_C : "---", 
            image : item.images[0].name ? item.images[0].name : "---",
            created_at:  item.created_at ? createdAt : "---",
          };
        });
        setCalculations(transformedData);
      }
      
      else {
        alert('Oops, something went wrong ! ');
      }
    } catch (error) {
      alert('Oops, something went wrong ! ');
      console.error('Erreur :', error.message);
    } finally {
      setloadingAllPred(false);
    }
  };



  useEffect(() => {
    fetchDataPrediction();
  }, [refresh]);

    

    const handleSauvegarde = async ()=> {
      if (imageFile === undefined || imageFile === null || imageFile === ""){
        alert('Image can not be empty ! ');
      }
      else{
        try{  
          setloading(true);

          const token = localStorage.getItem('token');
          const userIdNum =  localStorage.getItem('userId');

          let formData = {
            image : imageFile, 
            user_id : parseInt(userIdNum), 
            plaque_id : IDplaque, 
            created_at : new Date().toISOString().slice(0, 19).replace('T', ' '),
            serre_id : null,
            farm_id : null
          };

          const response = await axios.post(`${ENDPOINT_API}create_prediction`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          });

          if(response.status === 201){
            setRefresh(!refresh);
            setaddClicked(false);
            setImageName(null);
            setSelectedOption(null);
            setIDplaque("");
            setImageFile("");
            setaddClicked(false);
          }        
          else{
            alert('Oops, somethign went wrong ! ');
          }    
        }
        catch(e){
          alert('Oops, somethign went wrong ! ');
          console.log(e.message);
          console.log(e.message);
        }finally{
          setloading(false);
        }
      }
    }
 




    
    const columns = [
      { field: 'id', headerName: 'idReal', width: 100, headerAlign: 'center', align: 'center',hide: true  },
      { field: 'idInc', headerName: 'ID', width: 100, headerAlign: 'center', align: 'center' },
      { field: 'farm_id', headerName: 'Ferme', minWidth: 200, editable: false, headerAlign: 'center', align: 'center' },
      { field: 'serre_id', headerName: 'Serre', minWidth: 200, editable: false, headerAlign: 'center', align: 'center' },
      { field: 'plaque_id', headerName: 'ID Plaque', minWidth: 100, editable: false, headerAlign: 'center', align: 'center' },
      { field: 'result', headerName: 'Résultat', width: 100, editable: false, headerAlign: 'center', align: 'center' },
      { field: 'class_A', headerName: 'Mouches', width: 100, editable: false, headerAlign: 'center', align: 'center' },
      { field: 'class_B', headerName: 'Mineuses', width: 100, editable: false, headerAlign: 'center', align: 'center' },
      { field: 'class_C', headerName: 'Thrips', width: 100, editable: false, headerAlign: 'center', align: 'center' },
      { field: 'created_at', headerName: 'Date création', width: 120, editable: false, headerAlign: 'center', align: 'center' },
      { 
        field: 'actions', 
        renderCell: (params) => actionTemplate(params, setCalculations, setRefresh, refresh, seteditClicked, editClicked, setcalcul_to_Edited), 
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
                    onChange={(e)=>{setIDplaque(e.target.value)}}
                    type="text"
                    value={calcul_to_Edited.plaque_id}
                    className='idplaque' 
                    placeholder="Veuillez saisir l'id de la plaque..."
                  />
                </div>
                <div className="rowInp">
                  <label>Ferme</label>
                  <Select
                    value={selectedOption}
                    onChange={handleChange}
                    options={options}
                    placeholder="Choisissez une option"
                    isClearable
                    styles={customStyles}
                  />
                </div>
                <div className="rowInp">
                  <label>Serre</label>
                  <Select
                    value={selectedOption}
                    onChange={handleChange}
                    options={options}
                    placeholder="Choisissez une option"
                    isClearable
                    styles={customStyles}
                  />
                </div>
              </>
            }
            <div className="rowInp rowInpModified">
              <button className='jofzvno' disabled={loading} onClick={()=>{seteditClicked(false);setcalcul_to_Edited(null);}} >Annuler</button>
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
            <span>Nouveau</span><span>&nbsp;&nbsp;Calcul</span>
          </div>
          <div className="rowInp">
            <label>ID Plaque</label>
            <input 
              onChange={(e)=>{setIDplaque(e.target.value)}}
              type="text"
              value={IDplaque}
              className='idplaque' 
              placeholder="Veuillez saisir l'id de la plaque..."
            />
          </div>
          <div className="rowInp">
            <label>Ferme</label>
            <Select
              value={selectedOption}
              onChange={handleChange}
              options={options}
              placeholder="Choisissez une option"
              isClearable
              styles={customStyles}
            />
          </div>
          <div className="rowInp">
            <label>Serre</label>
            <Select
              value={selectedOption}
              onChange={handleChange}
              options={options}
              placeholder="Choisissez une option"
              isClearable
              styles={customStyles}
            />
          </div>
          <div className="rowInp">
            <label
            className='ofnov'
              style={{
                display: 'inline-block',
                height : "45px",
                borderWidth : "1px",
                borderColor : "gainsboro",
                display : "flex",
                alignItems : "center",
                justifyContent : "center",
                cursor: 'pointer',
                borderRadius: '4px',
                textAlign: 'center',
              }}
            >
              {imageName ? `Image séléctionnée : ${imageName}` : 'Choisir une image'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}   
              />
            </label>
          </div>
          <div className="rowInp rowInpModified">
            <button className='jofzvno' disabled={loading} onClick={()=>{setaddClicked(false);setImageName(null);setImageFile(null);setSelectedOption(null);setIDplaque("");}} >Annuler</button>
            <button 
              disabled={loading}
              onClick={()=>{
                handleSauvegarde();
              }}
              className={loading ? "efvofvz efvofvz2" : "efvofvz"}
            >
            {
              loading ? "Sauvegarde en cours..."
              :
              "Sauvegarder le calcul"
            }
            </button>
          </div>
        </div>
      </div>
      <div className="containerDash">
          <div className="rowD1">
            <div className="caseD1">
              <span>Mes</span><span>&nbsp;Calculations</span>
              {
                loadingAllPred && 
                <>
                  &nbsp;&nbsp;&nbsp;<img src={LVG} alt="..." height={23} width={23} />
                </>
              }
            </div>
            <div className="caseD2">
              <button  title='Rafraîchir la page' className='eofvouszfv00' onClick={()=>{setRefresh(!refresh)}} ><i class="fa-solid fa-rotate-right"></i></button>
              <button  className='eofvouszfv11'  onClick={()=>{setaddClicked(true);}} ><i className='fa-solid fa-plus' ></i>&nbsp;Ajouter un calcul</button>
              <button   className='eofvouszfv22'><i className='fa-solid fa-download' ></i>&nbsp;Exporter</button>
            </div>
          </div>
          {
            Calculations !== null && 
            <Box sx={{ height: "calc(100% - 120px)", width: '100%', outline: "none" }}>
              <DataGrid
                columns={columns.filter(column => column.field !== 'id')}
                hideFooter 
                rows={Calculations}
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

export default Calculations

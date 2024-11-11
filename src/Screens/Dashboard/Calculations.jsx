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





const actionTemplate = (params, setCalculations, setRefresh, refresh, seteditClicked, editClicked, setCalculToEdit, calculToEdit, setshowClicked, showClicked , setSelectedGreenhouse, setSelectedFarm,farms,setGreenhouses) => {
  
  
  const handleEdit = () => {
    console.log('Edit:', params.row);

    if(params.row.farm_id !== null && params.row.farm_id !== "---"){
      setSelectedFarm({ 
        value : params.row.farm_id,
        label : params.row.farm_name
      });
      setCalculToEdit({
        ...calculToEdit, 
        farm_id : params.row.farm_id,
        farm_name : params.row.farm_name
      });

        
      const selectedFarmX = farms.find(farm => farm.id === params.row.farm_id);
      if (selectedFarmX) {
        const greenhouseOptions = selectedFarmX.serres.map(serre => ({
          value: serre.id,
          label: serre.name
        }));
        setGreenhouses(greenhouseOptions);
      } else {
        setGreenhouses([]);
      }


      if(params.row.serre_id !== null && params.row.serre_id !== "---"){
        setSelectedGreenhouse({
          value : params.row.serre_id,
          label : params.row.serre_name
        });
        setCalculToEdit({
          ...calculToEdit, 
          serre_id : params.row.serre_id,
          serre_name : params.row.serre_name
        });
      }
    }
    setCalculToEdit(params.row);
    seteditClicked(!editClicked);
  };


  
  const handleView = async () => {

    if(params.row.farm_id !== null && params.row.farm_id !== "---"){
      setSelectedFarm({ 
        value : params.row.farm_id,
        label : params.row.farm_name
      });
      setCalculToEdit({
        ...calculToEdit, 
        farm_id : params.row.farm_id,
        farm_name : params.row.farm_name
      });


      const selectedFarmX = farms.find(farm => farm.id === params.row.farm_id);
      if (selectedFarmX) {
        const greenhouseOptions = selectedFarmX.serres.map(serre => ({
          value: serre.id,
          label: serre.name
        }));
        setGreenhouses(greenhouseOptions);
      } else {
        setGreenhouses([]);
      }


      if(params.row.serre_id !== null && params.row.serre_id !== "---"){
        setSelectedGreenhouse({
          value : params.row.serre_id,
          label : params.row.serre_name
        });
        setCalculToEdit({
          ...calculToEdit, 
          serre_id : params.row.serre_id,
          serre_name : params.row.serre_name
        });
      }
    }

    setCalculToEdit(params.row);
    setshowClicked(!showClicked);

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
  const [calculToEdit, setCalculToEdit] = useState(null);
  const [imageFile, setImageFile] = useState('');
  const [imageName, setImageName] = useState('');
  const [loading, setloading] = useState(false);
  const [loadingAllPred, setloadingAllPred] = useState(true);
  const [loadingAllFarms, setloadingAllFarms] = useState(true);
  const [loadingEdit, setloadingEdit] = useState(false);
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState('');
  const [greenhouses, setGreenhouses] = useState([]);
  const [selectedGreenhouse, setSelectedGreenhouse] = useState('');
  const [options, setoptions] = useState([]);
  const [showClicked,setshowClicked] = useState(false);



  

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
  
      // Fetch the predictions data
      const predictionsResponse = await axios.get(`${ENDPOINT_API}users/${userIdNum}/p_with_image_version_two`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      
      if (predictionsResponse.status === 200) {
        let i = 0;
        const transformedData = await Promise.all(
          predictionsResponse.data.map(async (item, index) => {
            i++;
            let createdAt = formatDateForCreatedAt(item.created_at);
      
            console.log("---------");
            console.warn(item);
      
            return {
              idInc: index + 1,
              id: item.id,
              farm_id: item.farm_id || "---",
              serre_id: item.serre_id || "---",
              plaque_id: item.plaque_id || "---",
              result: item.result ? `${item.result}%` : "---",
              class_A: item.images[0]?.class_A || "---",
              class_B: item.images[0]?.class_B || "---",
              class_C: item.images[0]?.class_C || "---",
              image: item.images[0]?.name || "---",
              created_at: createdAt || "---",
              farm_name: item.farm ? item.farm.name : "---",
              serre_name: item.serre ? item.serre.name : "---",
            };


          })
        );
      
        setCalculations(transformedData);
      }
      
      
      else {
        alert('Oops, something went wrong!');
      }
  
    } catch (error) {
      alert('Oops, something went wrong!');
      console.error('Erreur:', error.message);
    } finally {
      setloadingAllPred(false);
    }
  };
  

  


  const fetchDataFarmsWithSerres = async () => {
    try {
      setloadingAllFarms(true);
      setoptions([]);
      const userId = localStorage.getItem('userId');
      const userIdNum = parseInt(userId);
      const token = localStorage.getItem('token'); 

      const response = await axios.get(`${ENDPOINT_API}getFarmsWithGreenhouses/${userIdNum}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 200) {
          console.log(response.data);
          setFarms(response.data);
          console.log(response.data);
      
          const newOptions = response.data.map((farm) => ({
              value: farm.id,
              label: farm.name,
          }));
      
          setoptions(newOptions);
      }
      else{
        console.log("Not Fetched All Farms With Their Serres");
      }
    } catch (error) {
      console.error('Erreur :', error.message);
    } finally {
      setloadingAllFarms(false);
    }
  };

  


  useEffect(() => {
    fetchDataPrediction();
  }, [refresh]);


  useEffect(() => {
    fetchDataFarmsWithSerres();
  }, []);




  const handleFarmChange = (farmId) => {

      setSelectedGreenhouse(null);

      if(farmId.value !== null){
        setSelectedFarm(farmId);
        const selectedFarm = farms.find(farm => farm.id === farmId.value);

        if (selectedFarm) {
          const greenhouseOptions = selectedFarm.serres.map(serre => ({
            value: serre.id,
            label: serre.name
          }));
          setGreenhouses(greenhouseOptions);
        } else {
          setGreenhouses([]);
        }
      }
      else{
        setSelectedFarm([]);
        setGreenhouses([]);
      }
  };


    const handleSauvegardeModifications = async()=>{
      try{
        setloadingEdit(true);
        const token = localStorage.getItem('token');

        let dataJOJO = {
          plaque_id : calculToEdit.plaque_id,
          farm_id : selectedFarm && selectedFarm.value, 
          serre_id : selectedGreenhouse && selectedGreenhouse.value
        }
        const response = await axios.patch(`${ENDPOINT_API}predictions/${parseInt(calculToEdit.id)}`, dataJOJO , {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if(response.status === 200){
          seteditClicked(false);
          setCalculToEdit(null);
          setSelectedFarm(null);
          setSelectedGreenhouse(null);
          fetchDataPrediction();
        }
        else{
          alert('Oops, something went wrong !');
        }

      }
      catch(e){
        console.log(e.message);
        alert('Oops, something went wrong !');
      } finally{
        setloadingEdit(false);
      }
    }

    

    const handleSauvegarde = async ()=> {
      if (imageFile === undefined || imageFile === null || imageFile === ""){
        alert('Image can not be empty ! ');
      }
      else{
        try{  
          setloading(true);

          const token = localStorage.getItem('token');
          const userIdNum =  localStorage.getItem('userId');

          let idFarm = selectedFarm ? parseInt(selectedFarm.value) : null;
          let idSerre = selectedGreenhouse ? parseInt(selectedGreenhouse.value) : null;

          let formData = {
            image : imageFile, 
            user_id : parseInt(userIdNum), 
            plaque_id : IDplaque, 
            created_at : new Date().toISOString().slice(0, 19).replace('T', ' '),
            serre_id : idSerre,
            farm_id : idFarm
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
            setSelectedFarm(null);
            setSelectedGreenhouse(null);
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
      { 
        field: 'id', 
        headerName: 'idReal', 
        width: 100, 
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
        field: 'farm_id', 
        headerName: 'FermeID', 
        minWidth: 200, 
        headerAlign: 'center', 
        align: 'center', 
        hide: true  
      },
      { 
        field: 'serre_id', 
        headerName: 'SerreID', 
        minWidth: 200, 
        headerAlign: 'center', 
        align: 'center', 
        hide: true  
      },
      { 
        field: 'farm_name', 
        headerName: 'Ferme', 
        minWidth: 200, 
        headerAlign: 'center', 
        align: 'center',
        flex: 1 // Allow the column to stretch
      },
      { 
        field: 'serre_name', 
        headerName: 'Serre', 
        minWidth: 200, 
        headerAlign: 'center', 
        align: 'center',
        flex: 1 // Allow the column to stretch
      },
      { 
        field: 'plaque_id', 
        headerName: 'ID Plaque', 
        minWidth: 100, 
        headerAlign: 'center', 
        align: 'center',
        flex: 1 // Allow the column to stretch
      },
      { 
        field: 'result', 
        headerName: 'Résultat', 
        width: 100, 
        headerAlign: 'center', 
        align: 'center',
        flex: 1 // Allow the column to stretch
      },
      { 
        field: 'class_A', 
        headerName: 'Mouches', 
        width: 100, 
        headerAlign: 'center', 
        align: 'center',
        flex: 1 // Allow the column to stretch
      },
      { 
        field: 'class_B', 
        headerName: 'Mineuses', 
        width: 100, 
        headerAlign: 'center', 
        align: 'center',
        flex: 1 // Allow the column to stretch
      },
      { 
        field: 'class_C', 
        headerName: 'Thrips', 
        width: 100, 
        headerAlign: 'center', 
        align: 'center',
        flex: 1 // Allow the column to stretch
      },
      { 
        field: 'created_at', 
        headerName: 'Date création', 
        width: 120, 
        headerAlign: 'center', 
        align: 'center',
        flex: 1 // Allow the column to stretch
      },
      { 
        field: 'actions', 
        renderCell: (params) => actionTemplate(params, setCalculations, setRefresh, refresh, seteditClicked, editClicked, setCalculToEdit, calculToEdit, setshowClicked, showClicked , setSelectedGreenhouse, setSelectedFarm, farms,setGreenhouses), 
        headerName: 'Actions', 
        minWidth: 200, 
        headerAlign: 'center', 
        align: 'center',
        flex: 1 // Allow the column to stretch
      }
    ];
    
    






    

  return (
    <div className='Dashboard'>
      <NavBar /> 
      <SideBar />




      {/*   edit Calculation    */}

        <div className={editClicked ? "popUp po showpopUp" : "popUp po"}>
          <div className="contPopUp popUp1 popUp1popUp1popUp1">
            <div className="caseD11">
              <span>Modifier&nbsp;le</span><span>&nbsp;Calcul</span>
            </div>
            {
            calculToEdit !== null && 
              <>
                <div className="rowInp">
                  <label>ID Plaque</label>
                  <input 
                    onChange={(e)=>{
                      setCalculToEdit({
                        ...calculToEdit,
                        plaque_id : e.target.value
                      })
                    }}
                    type="text"
                    value={calculToEdit.plaque_id}
                    className='idplaque' 
                    placeholder="Veuillez saisir l'id de la plaque..."
                  />
                </div>
                <div className="rowInp">
                  <label>Ferme</label>
                  <Select
                    value={selectedFarm}
                    onChange={(itemValue) => handleFarmChange(itemValue)}
                    options={options}
                    disabled={loadingAllFarms}
                    placeholder="Choisissez une option"
                    styles={customStyles}
                  />
                </div>
                <div className="rowInp">
                  <label>Serre</label>
                  <Select
                    value={selectedGreenhouse}
                    onChange={(itemValue) => setSelectedGreenhouse(itemValue)}
                    options={greenhouses}
                    disabled={!selectedFarm}
                    placeholder="Choisissez une option"
                    styles={customStyles}
                  />
                </div>
              </>
            }
            <div className="rowInp rowInpModified">
              <button className='jofzvno' disabled={loading} onClick={()=>{seteditClicked(false);setCalculToEdit(null);setSelectedFarm(null);setSelectedGreenhouse(null);}} >Annuler</button>
              <button 
                disabled={loadingEdit}
                onClick={()=>{
                  handleSauvegardeModifications();
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
      




        {/*   show Calculation    */}
              
        <div className={showClicked ? "popUp  showpopUp" : "popUp "}>
                  <div className="contPopUp popUp1 popUp1popUp1popUp1">
            <div className="caseD11">
              <span>Informations&nbsp;du</span><span>&nbsp;Calcul</span>
            </div>
            {
            calculToEdit !== null && 
              <>
                <div className="rowInp rowInp1">
                  <label>
                    Ferme
                  </label>
                  <label>
                    {
                      calculToEdit.farm_name
                    }
                  </label>
                </div>
                <div className="rowInp rowInp1">
                  <label>
                    Serre
                  </label>
                  <label>
                    {
                      calculToEdit.serre_name
                    }
                  </label>
                </div>
                <div className="rowInp rowInp1">
                  <label>
                    ID plaque
                  </label>
                  <label>
                    {
                      calculToEdit.plaque_id
                    }
                  </label>
                </div>
                <div className="rowInp rowInp1">
                  <label>
                    Résultat
                  </label>
                  <label>
                    {
                      calculToEdit.result
                    }
                  </label>
                </div>
                <div className="rowInp rowInp1">
                  <label>
                    Effectif des Mouches
                  </label>
                  <label>
                    {
                      calculToEdit.class_A
                    }
                  </label>
                </div>
                <div className="rowInp rowInp1">
                  <label>
                    Effectif des Mineuses
                  </label>
                  <label>
                    {
                      calculToEdit.class_B
                    }
                  </label>
                </div>
                <div className="rowInp rowInp1">
                  <label>
                    Effectif des Thrips
                  </label>
                  <label>
                    {
                      calculToEdit.class_C
                    }
                  </label>
                </div>
                <div className="rowInp rowInp1">
                  <label>
                   Image du calcul
                  </label>
                  <button 
                    style={{
                      cursor : "pointer", 
                      background : "#f4f4f4",
                      border : "1px solid #dbdbdb", 
                      height : "24px", 
                      padding : "0 1rem", 
                      alignItems : "center", 
                      justifyContent : "center", 
                      display : "center"
                    }}
                  >
                    Voir l'image
                  </button>
                </div>
              </>
            }
            <div className="rowInp rowInpModified">
              <button className='jofzvno'  onClick={()=>{setshowClicked(false);setCalculToEdit(null);}} >Fermer</button>
              <button 
                onClick={()=>{
                  setshowClicked(false);
                  seteditClicked(true);
                }}
                className={loadingEdit ? "efvofvz efvofvz2" : "efvofvz"}
              >
               Modifier le calcul
              </button>
            </div>
          </div>
        </div>
      





      {/*   Add new Calculation    */}
      <div className={addClicked ? "popUp showpopUp" : "popUp"}>
        <div className="contPopUp popUp1popUp1popUp1">
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
                    value={selectedFarm}
                    onChange={(itemValue) => handleFarmChange(itemValue)}
                    options={options}
                    disabled={loadingAllFarms}
                    placeholder="Choisissez une option"
                    
                    styles={customStyles}
                  />
                </div>
                <div className="rowInp">
                  <label>Serre</label>
                  <Select
                    value={selectedGreenhouse}
                    onChange={(itemValue) => setSelectedGreenhouse(itemValue)}
                    options={greenhouses}
                    disabled={!selectedFarm}
                    placeholder="Choisissez une option"
                    
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
            <button className='jofzvno' disabled={loading} onClick={()=>{setaddClicked(false);setImageName(null);setImageFile(null);setIDplaque(""); setSelectedFarm(null);setSelectedGreenhouse(null);}} >Annuler</button>
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
                loadingAllPred ? 
                <>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src={LVG} alt="..." height={23} width={23} />
                </>
                :
                <>
                &nbsp;&nbsp;
                {
                  Calculations && <span className="iyzsiyvqdc">:&nbsp;&nbsp;{Calculations.length}</span>
                }
                </>
              }
            </div>
            <div className="caseD2">
              <button  disabled={loadingAllPred} title='Rafraîchir la page' className='eofvouszfv00' onClick={()=>{setRefresh(!refresh)}} ><i class="fa-solid fa-rotate-right"></i></button>
              <button  className='eofvouszfv11'  onClick={()=>{setaddClicked(true);}} ><i className='fa-solid fa-plus' ></i>&nbsp;Ajouter un calcul</button>
              <button   className='eofvouszfv22'><i className='fa-solid fa-download' ></i>&nbsp;Exporter</button>
            </div>
          </div>
          {
            Calculations !== null && 
            <Box  
              sx={{ 
                height: "calc(100% - 120px)", 
                width: '100%', 
                outline: "none",
                borderRadius: "20px !important",
              }}
            >
              <DataGrid
                columns={columns.filter(column => !['id','idInc', 'farm_id', 'serre_id'].includes(column.field))}
                hideFooter 
                rows={Calculations}
                loading={loadingAllPred}
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

export default Calculations

import React, { useState, useEffect } from 'react';
import "./index.css";
import NavBar from '../../Components/Navbar';
import formatDateForCreatedAt from '../../Helpers/formatCreatedAt';
import SideBar from '../../Components/SideBar';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import Select from 'react-select';
 import axios from 'axios'
import { ENDPOINT_API } from "../../endpoint";
import LVG from './Loader.gif'
import PopUp from '../../Components/PopUp';
import ErrorSuccess from '../../Components/ErrorSuccess';





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


const actionTemplate = (params, setFermes, setRefresh, refresh, seteditClicked, editClicked, setFarmToEdit, showClicked, setshowClicked,  setFarmToShow,showItResponse, setisErrorResponse,  setshowItResponse, setmessageResponse) => {
  
  
  const handleEdit = () => {
    console.log('Edit:', params.row);
    setFarmToEdit(params.row);
    seteditClicked(!editClicked);
  };


  const handleView = async () => {

    setFarmToShow(params.row);
    setFarmToEdit(params.row);
    setshowClicked(!showClicked);

  };


  const handleDelete = async () => {
    setFermes(prevFermes => 
      prevFermes.filter(item => item.id !== params.row.id)
    );
    try{
      const token = localStorage.getItem('token');
      
      const response = await axios.delete(`${ENDPOINT_API}farms/${params.row.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if(response.status === 200){
      }
      else{
         if(!showItResponse){
              setisErrorResponse(true);
              setmessageResponse("Une erreur est survenue lors de la suppression de la ferme.");
              setshowItResponse(true);
              setTimeout(()=>{          
                setshowItResponse(false);
              }, 4500);
            }
        setRefresh(!refresh);
      }
    }
    catch(e){
       if(!showItResponse){
              setisErrorResponse(true);
              setmessageResponse("Une erreur est survenue lors de la suppression de la ferme.");
              setshowItResponse(true);
              setTimeout(()=>{          
                setshowItResponse(false);
              }, 4500);
            }
      setRefresh(!refresh);
      console.log(e.message);
    }
  };

  return (
    <div className='uefuvzou'>
      <button className='uoersf'   onClick={handleView}  >
        <i class="fa-solid fa-plus"></i>
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
  const [showClicked,setshowClicked] = useState(false);
  const [Appelation,setAppelation] = useState("");
  const [Appelation2,setAppelation2] = useState("");
  const [Fermes, setFermes] = useState([]);
  const [addClicked, setaddClicked] = useState(false);
  const [addClicked2, setaddClicked2] = useState(false);
  const [editClicked, seteditClicked] = useState(false);
  const [FarmToEdit, setFarmToEdit] = useState(null);
  const [FarmToShow, setFarmToShow] = useState(null);
  const [localisation, setLocalisation] = useState(null);
  const [Size, setSize] = useState("");
  const [loadingCreation, setloading] = useState(false);
  const [loadingCreationOf_New_Serre, setloadingCreationOf_New_Serre] = useState(false);
  const [loadingAllFarms, setloadingAllFarms] = useState(true);
  const [loadingEdit, setloadingEdit] = useState(false);
  const [dataSerre, setDataSerre] = useState(null);
  const [addNewSerreClick, setaddNewSerreClick] = useState(false);
  const [nameS, setNameS] = useState(null);
  const [sizeS, setSizeS] = useState(null);
  const [loaderDelete, setloaderDelete] = useState(false);
  const [showItResponse, setshowItResponse] = useState(false);
  const [isErrorResponse, setisErrorResponse] = useState(false);
  const [messageResponse, setmessageResponse] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);
  const [rowsWithChildren, setRowsWithChildren] = useState([]);

  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [greenhouses, setGreenhouses] = useState([]);
  const [selectedGreenhouse, setSelectedGreenhouse] = useState(null);
  const [options, setoptions] = useState([]);
  const [LoadingCreatingNewPlaque, setLoadingCreatingNewPlaque] = useState(false);

 
 
  
 


  const fetchDataAllFarmsX = async () => {
    try {
  
      setloadingAllFarms(true);
      const userId = localStorage.getItem('userId');
      const userIdNum = parseInt(userId);
      const token = localStorage.getItem('token'); 

      const response = await axios.get(`${ENDPOINT_API}getAllFarmsWithTheirSerres/${userIdNum}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      
      if (response.status === 200) {


        setFarms(response.data);
        
        const newOptions = response.data.map((farm) => ({
          value: farm.id,
          label: farm.name,
        }));
        
        setoptions(newOptions);

        let i = 0;
      
        // Transformation des données des fermes
        const transformedData = response.data.map((item) => {
          i++;
          let createdAt = formatDateForCreatedAt(item.created_at);
          return {
            idInc: i,
            id: item.id,
            name: item.name ? item.name : "---",
            serres: item.serres,
            location: item.location ? item.location : "---",
            size: item.size ? item.size : "---",
            created_at: item.created_at ? createdAt : "---",
          };
        });
      
        
        // Initialisation des lignes parent (fermes)
        const initialRowsWithChildren = transformedData.map((farm) => ({
          ...farm,
          isChild: false,  // Lignes parents ont `isChild: false`
        }));
      


        // Ajouter les lignes enfants (serres)
        transformedData.forEach((farm) => {
          if (expandedRows.includes(farm.id)) {
            farm.serres.forEach((serre) => {
              // Ajouter les serres comme lignes enfants
              initialRowsWithChildren.push({
                id: `${farm.id}-${serre.id}`,  // Identifier la serre avec l'ID de la ferme + celui de la serre
                name: serre.name,  // Afficher le nom de la serre
                size: serre.size,  // Taille de la serre
                location: farm.location,   // Valeur par défaut pour la localisation
                isChild: true,     // Marquer cette ligne comme enfant
              });
            });
          }
        });
      
        // Mettre à jour les états avec les données transformées
        setFermes(transformedData);
        setRowsWithChildren(initialRowsWithChildren);
      }
      
      
      else {
        if(!showItResponse){
              setisErrorResponse(true);
              setmessageResponse("Une erreur est survenue lors de la récupération des données .");
              setshowItResponse(true);
              setTimeout(()=>{          
                setshowItResponse(false);
              }, 4500);
            }
      }
    } catch (error) {
      if(!showItResponse){
              setisErrorResponse(true);
              setmessageResponse("Une erreur est survenue lors de la récupération des données .");
              setshowItResponse(true);
              setTimeout(()=>{          
                setshowItResponse(false);
              }, 4500);
            }
      console.error('Erreur :', error.message);
    } finally {
      setloadingAllFarms(false);
    }
  };



  useEffect(() => {
    fetchDataAllFarmsX();
  }, [refresh]);

    


  const handleCreatedNewSerre =  async()=>{
    if(nameS.length <= 2){
      if(!showItResponse){
        setisErrorResponse(true);
        setmessageResponse("Le nom de la serre ne peut pas etre vide.");
        setshowItResponse(true);
        setTimeout(()=>{          
          setshowItResponse(false);
        }, 4500);
      }
      return;
    }
    else{
      setloadingCreationOf_New_Serre(true);
      try{
         
        const token = localStorage.getItem('token');
        
        const resp0 = await axios.post(`${ENDPOINT_API}serres2`,
          {
            farm_id : FarmToShow.id,
            name : nameS ? nameS : "Serre X", 
            size : sizeS ? parseInt(sizeS) : 0,
          },{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if(resp0.status === 201){
          setloadingCreationOf_New_Serre(false);
          setshowClicked(false);
          setNameS('');
          setSizeS('');
          setExpandedRows([]);
          setRowsWithChildren([]);
          fetchDataAllFarmsX();
         }
        else{
          setloadingCreationOf_New_Serre(false);
          setshowClicked(false);
           if(!showItResponse){
            setisErrorResponse(true);
            setmessageResponse("Une erreur est survenue lors de la création de la serre .");
            setshowItResponse(true);
            setTimeout(()=>{          
              setshowItResponse(false);
            }, 4500);
          }
        }
      }
      catch(e){
        if(!showItResponse){
          setisErrorResponse(true);
          setmessageResponse("Une erreur est survenue lors de la création de la serre .");
          setshowItResponse(true);
          setTimeout(()=>{          
            setshowItResponse(false);
          }, 4500);
        }
        console.log(e.message);
        setloadingCreationOf_New_Serre(false);
        setaddNewSerreClick(false);
        setshowClicked(true);
      }
    }
  }



    const handleSauvegarde = async ()=> {
      if(Appelation.length <= 2){
        if(!showItResponse){
          setisErrorResponse(true);
          setmessageResponse("Le nom de la ferme ne peut pas etre vide.");
          setshowItResponse(true);
          setTimeout(()=>{          
            setshowItResponse(false);
          }, 4500);
        }
        return;
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
            if(!showItResponse){
          setisErrorResponse(true);
          setmessageResponse("Une erreur est survenue lors de la création de la ferme.");
          setshowItResponse(true);
          setTimeout(()=>{          
            setshowItResponse(false);
          }, 4500);
        }
          }    
        }
        catch(e){
          if(!showItResponse){
          setisErrorResponse(true);
          setmessageResponse("Une erreur est survenue lors de la création de la ferme.");
          setshowItResponse(true);
          setTimeout(()=>{          
            setshowItResponse(false);
          }, 4500);
        }
          console.log(e.message);
        }finally{
          setloading(false);
        }

      }
    }






    const handleSauvegardeModifications = async ()=> {
      if(FarmToEdit.name.length <= 2){
        if(!showItResponse){
          setisErrorResponse(true);
          setmessageResponse("Le nom de la ferme ne peut pas etre vide.");
          setshowItResponse(true);
          setTimeout(()=>{          
            setshowItResponse(false);
          }, 4500);
        }
      }
      else{
        try{  
          setloadingEdit(true);

          const token = localStorage.getItem('token');

          console.log(FarmToEdit);

          let dataX = {
            name : FarmToEdit.name, 
            size : parseInt(FarmToEdit.size),
            location : FarmToEdit.location, 
          }

          const resp0 = await axios.patch(`${ENDPOINT_API}farms/${FarmToEdit.id}`, dataX, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if(resp0.status === 200){
            setRefresh(!refresh);
            setFarmToEdit(null);
            setFarmToShow(null);
            seteditClicked(false);
          }        
          else{
            if(!showItResponse){
          setisErrorResponse(true);
          setmessageResponse("Une erreur est survenue lors de la modification de la ferme.");
          setshowItResponse(true);
          setTimeout(()=>{          
            setshowItResponse(false);
          }, 4500);
        }
          }    
        }
        catch(e){
          if(!showItResponse){
          setisErrorResponse(true);
          setmessageResponse("Une erreur est survenue lors de la modification de la ferme.");
          setshowItResponse(true);
          setTimeout(()=>{          
            setshowItResponse(false);
          }, 4500);
        }
          console.log(e.message);
        }finally{
          setloadingEdit(false);
        }

      }
    }
 





    const toggleRow = (farmId) => {
      setRowsWithChildren((prev) => {
        const isExpanded = expandedRows.includes(farmId);
    
        if (isExpanded) {
          // Collapse: Remove child rows for the farm
          return prev.filter((row) => {
            // Ensure the row.id is treated as a string before checking with startsWith
            return !(String(row.id).startsWith(`${farmId}-`));
          });
        } else {
          // Expand: Add child rows for the farm
          const farm = Fermes.find((f) => f.id === farmId);
          const childRows = farm.serres.map((serre) => {
            let createdAt = formatDateForCreatedAt(serre.created_at);
            return{
              id: `${farmId}-${serre.id}`, // Unique ID for child row
              name: `${serre.name}`,
              size: serre.size,
              location: farm.location,
              created_at: createdAt ? createdAt : "---"
            }  
          });
    
          const farmIndex = prev.findIndex((row) => row.id === farmId);
    
          return [
            ...prev.slice(0, farmIndex + 1),
            ...childRows,
            ...prev.slice(farmIndex + 1),
          ];
        }
      });
    
      // Update expanded rows
      setExpandedRows((prev) =>
        prev.includes(farmId) ? prev.filter((id) => id !== farmId) : [...prev, farmId]
      );
    };
    
    


    
    const columns = [
      {
        field: 'expand',
        headerName: 'Voir Serres',
        width: 130,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => {

          const hasChildren = params.row.serres && params.row.serres.length > 0;  

          if (!hasChildren) {
            return null;  
          }

          const isChildRow = String(params.row.id).includes('-');    
          if (isChildRow) {
            return null;
          }
         
          const isExpanded = expandedRows.includes(params.row.id);
          return (
            <button
              className={`esuorhuzhvuosrhsuovozshfov ${isExpanded ? "jackIsChan" : "jackisNotCHan"}`}
              variant="contained"
              onClick={() => toggleRow(params.row.id)}  
            >
              {isExpanded ? <i className='fa-solid fa-minus' ></i> : <i className='fa-solid fa-plus' ></i>} 
            </button>
          );
        },
        sortable: false,
        filterable: false,
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
        field: 'name', 
        headerName: 'Ferme / Serre', 
        minWidth: 350, 
        headerAlign: 'center', 
        align: 'center',
        flex: 1 // Allow the column to stretch
      },
      { 
        field: 'location', 
        headerName: 'Localisation', 
        minWidth: 350, 
        headerAlign: 'center', 
        align: 'center',
        flex: 1 // Allow the column to stretch
      },
      { 
        field: 'size', 
        headerName: 'Mesure en m²', 
        minWidth: 150, 
        headerAlign: 'center', 
        align: 'center',
        flex: 1 // Allow the column to stretch
      },
      { 
        field: 'actions', 
        renderCell: (params) => actionTemplate(params, setFermes, setRefresh, refresh, seteditClicked, editClicked, setFarmToEdit, showClicked, setshowClicked,  setFarmToShow,showItResponse, setisErrorResponse,  setshowItResponse, setmessageResponse), 
        headerName: 'Actions', 
        minWidth: 200, 
        headerAlign: 'center', 
        align: 'center',
        flex: 1 // Allow the column to stretch
      }
    ];

    
   
    
    
    const Created_New_Plaque = async ()=> {
      if(Appelation2=== "" || Appelation2 === null){
        if(!showItResponse){
          setisErrorResponse(true);
          setmessageResponse("Le nom de la plaque ne peut pas etre vide.");
          setshowItResponse(true);
          setTimeout(()=>{          
            setshowItResponse(false);
          }, 4500);
        }
        return;
      }
      if(selectedFarm  === null || selectedFarm === ''){
        if(!showItResponse){
          setisErrorResponse(true);
          setmessageResponse("Vous devez obligatoirement choisir une ferme, ainsi qu'une serre.");
          setshowItResponse(true);
          setTimeout(()=>{          
            setshowItResponse(false);
          }, 4500);
        }
        return;
      }
      if(selectedGreenhouse  === null || selectedGreenhouse === ''){
        if(!showItResponse){
          setisErrorResponse(true);
          setmessageResponse("Vous devez obligatoirement choisir une serre.");
          setshowItResponse(true);
          setTimeout(()=>{          
            setshowItResponse(false);
          }, 4500);
        }
        return;
      }
      else{
        try{  
          setLoadingCreatingNewPlaque(true);

          let IDGreenHouse = parseInt(selectedGreenhouse.value);
          let IDFarm = parseInt(selectedFarm.value);
          
          console.log("IDFarm : "+IDFarm);
          console.log("IDGreenHouse : "+IDGreenHouse);

          const token = localStorage.getItem('token');


          let dataX = {
            name : Appelation2, 
            idSerre : IDGreenHouse,
            idFarm : IDFarm, 
          }

          const resp0 = await axios.post(`${ENDPOINT_API}createPlaque`, dataX, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if(resp0.status === 201){
            
            setaddClicked2(false);
            setRefresh(!refresh);
            setFarmToEdit(null);
            setFarmToShow(null);
            seteditClicked(false);
            setAppelation2('');
            setSelectedGreenhouse(null);
            setSelectedFarm(null);

          }        
          else{
            if(!showItResponse){
          setisErrorResponse(true);
          setmessageResponse("Une erreur est survenue lors de la création de la plaque.");
          setshowItResponse(true);
          setTimeout(()=>{          
            setshowItResponse(false);
          }, 4500);
        }
          }    
        }
        catch(e){
          if(!showItResponse){
          setisErrorResponse(true);
          setmessageResponse("Une erreur est survenue lors de la création de la plaque.");
          setshowItResponse(true);
          setTimeout(()=>{          
            setshowItResponse(false);
          }, 4500);
        }
          console.log(e.message);
        }finally{
          setLoadingCreatingNewPlaque(false);
        }

      }
    }
 

    


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




  

    const deleteSingleSerre = async (IdSerre, idFarm)=>{
      try{
        setloaderDelete(true);

        setDataSerre(prevData => prevData.filter(item => item.id !== IdSerre));

        const token = localStorage.getItem('token');
        const resp = await axios.delete(`${ENDPOINT_API}serres/${parseInt(IdSerre)}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if(resp.status === 200){
           
        }
        else{
           alert('Oops, something went wrong ! ');
        }
      }
      catch(e){
         alert('Oops, something went wrong ! ');
        console.log(e.message);
      } finally{
        setloaderDelete(false);
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
      {/*   edit Farm    */}
        <div className={editClicked ? "popUp  showpopUp" : "popUp "}>
          <div className="contPopUp popUp1 popUp1popUp1popUp1">
            <div className="caseD11">
              <span>Modifier&nbsp;la</span><span>&nbsp;Ferme</span>
            </div>
            {
            
              FarmToEdit !== null &&
              <>
                <div className="rowInp">
                  <label>Appelation</label>
                  <input 
                    onChange={(e)=>{setFarmToEdit({
                      ...FarmToEdit, 
                      name : e.target.value
                    })}}
                    maxLength={60}
                    type="text"
                    value={FarmToEdit.name}
                    className='idplaque' 
                    placeholder="Veuillez saisir le nom de la ferme..."
                  />
                </div>
                <div className="rowInp">
                  <label>Localisation</label>
                  <input 
                     onChange={(e)=>{setFarmToEdit({
                      ...FarmToEdit, 
                      location : e.target.value
                    })}}
                    maxLength={60}
                    type="text"
                    value={FarmToEdit.location}
                    className='idplaque' 
                    placeholder="Veuillez saisir la localisation de la ferme..."
                  />
                </div>
                <div className="rowInp">
                  <label>Mesure en m²</label>
                  <input 
                     onChange={(e)=>{setFarmToEdit({
                      ...FarmToEdit, 
                      size : e.target.value
                    })}}
                    type="text"
                    maxLength={6}
                    value={FarmToEdit.size.toString()}
                    className='idplaque' 
                    placeholder="Veuillez saisir la mesure de la ferme..."
                  />
                </div>
              </>
              
            }            
            <div className="rowInp rowInpModified">
              <button className='jofzvno' disabled={loadingEdit} onClick={()=>{seteditClicked(false);setFarmToEdit(null);setFarmToShow(null);}} >Annuler</button>
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
      

 




      {/*   Add new Farm    */}
      <div className={addClicked ? "popUp showpopUp" : "popUp"}>
        <div className="contPopUp popUp1popUp1popUp1">
          {
            addClicked && 
            <>
            <div className="caseD11">
            <span>Nouvelle</span><span>&nbsp;&nbsp;Ferme</span>
          </div>
          <div className="rowInp">
            <label>Appelation</label>
            <input 
              onChange={(e)=>{setAppelation(e.target.value)}}
              type="text"
              value={Appelation}
              maxLength={60}
              className='idplaque' 
              placeholder="Veuillez saisir le nom de la ferme..."
            />
          </div>
          <div className="rowInp">
            <label>Localisation</label>
            <input 
              onChange={(e)=>{setLocalisation(e.target.value)}}
              type="text"
              maxLength={60}
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
              maxLength={6}
              value={Size}
              className='idplaque' 
              placeholder="Veuillez saisir la mesure de la ferme..."
            />
          </div>
         
            </>
          }
          
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
              loadingCreation ? "Création en cours..."
              :
              "Créer la nouvelle ferme"
            }
            </button>
          </div>
        </div>
      </div>






        {/*   Add new Plaque    */}
        <div className={addClicked2 ? "popUp showpopUp" : "popUp"}>
        <div className="contPopUp popUp1popUp1popUp1">
          <div className="caseD11">
            <span>Nouvelle</span><span>&nbsp;&nbsp;Plaque</span>
          </div>
          <div className="rowInp">
            <label>Appelation</label>
            <input 
              onChange={(e)=>{setAppelation2(e.target.value)}}
              type="text"
              value={Appelation2}
              maxLength={60}
              className='idplaque' 
              placeholder="Veuillez saisir le nom de la plaque..."
            />
          </div>
  


          {
            addClicked2 && 
            <>
            
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
            <button className='jofzvno' disabled={LoadingCreatingNewPlaque} onClick={()=>{setaddClicked2(false);setSelectedFarm(null);setSelectedGreenhouse(null);setAppelation2("");}} >Annuler</button>
            <button 
              disabled={LoadingCreatingNewPlaque}
              onClick={()=>{
                Created_New_Plaque();
              }}
              className={LoadingCreatingNewPlaque ? "efvofvz efvofvz2" : "efvofvz"}
            >
            {
              LoadingCreatingNewPlaque ? "Création en cours..."
              :
              "Créer la nouvelle plaque"
            }
            </button>
          </div>
        </div>
      </div>







       {/*   Add new Serre    */}
       <div className={showClicked ? "popUp popUpX showpopUp" : "popUp popUpX"}>
        {
          showClicked &&
        <div className="contPopUp contPopUpcontPopUp">
          <div className="caseD11">
            <span>Nouvelle</span><span>&nbsp;&nbsp;Serre</span>
          </div>
          <div className="rowInp">
            <label>Appelation</label>
            <input 
              onChange={(e)=>{setNameS(e.target.value);}}
              type="text"
              value={nameS}
              maxLength={60}
              className='idplaque' 
              placeholder="Veuillez saisir le nom de la serre..."
            />
          </div>
          <div className="rowInp">
            <label>Mesure en m²</label>
            <input 
              onChange={(e)=>{setSizeS(e.target.value);}}
              type="text"
              value={sizeS}
              maxLength={5}
              className='idplaque' 
              placeholder="Veuillez saisir la mesure de la serre..."
            />
          </div>
          <div className="rowInp rowInpModified">
            <button className='jofzvno' disabled={loadingCreationOf_New_Serre} onClick={()=>{
                setshowClicked(false);
                setNameS("");
                setSizeS('');
              }} 
            >
              Annuler
            </button>
            <button 
              disabled={loadingCreationOf_New_Serre}
              onClick={()=>{
                handleCreatedNewSerre();
              }}
              className={loadingCreationOf_New_Serre ? "efvofvz efvofvz2" : "efvofvz"}
            >
            {
              loadingCreationOf_New_Serre ? "Sauvegarde en cours..."
              :
              "Sauvegarder la serre"
            }
            </button>
          </div>
        </div>
        }
      </div>







      <div className="containerDash">
          <div className="rowD1">
            <div className="caseD1">
              <span>Mes</span><span>&nbsp;Fermes</span>
              {
                loadingAllFarms ? 
                <>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src={LVG} alt="..." height={23} width={23} />
                </>
                :
                <>
                &nbsp;&nbsp;
                {
                  Fermes && <span className="iyzsiyvqdc">:&nbsp;&nbsp;{Fermes.length}</span>
                }
                </>
              }
            </div>
            <div className="caseD2 caseD22222">
              <button  className='eofvouszfv11'  onClick={()=>{setaddClicked(true);}} ><i className='fa-solid fa-plus' ></i>&nbsp;Ajouter une ferme</button>
              <button  className=' eofvouszfv112'  onClick={()=>{setaddClicked2(true);}} ><i className='fa-solid fa-plus' ></i>&nbsp;Ajouter une plaque</button>
            </div>
          </div>
          {
            Fermes !== null && 
            <Box  
              sx={{ 
                height: "calc(100% - 120px)", 
                width: '100%', 
                outline: "none",
                borderRadius: "20px !important"
              }}
            >
              <DataGrid
                columns={columns.filter(column => !['id','idInc'].includes(column.field))}
                hideFooter 
                rows={rowsWithChildren}
                getRowClassName={(params) => {
                  const rowId = String(params.row.id);  
                  return rowId.includes('-') ? 'child-row' : 'parent-row';
                }}
                className='euosvuouof'
                loading={loadingAllFarms}
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
          <div className="clickeici">
            <i className='fa-solid fa-question-circle'></i>&nbsp;&nbsp;En appuyant sur le bouton plus de la colonne `<em>Voir Serres</em>`, vos serres s'afficheront.
          </div>
      </div>
    </div>
  )
}

export default Fermes

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
  { value: 'fruit', label: "Fruit" },
  { value: 'vegetable', label: 'Légume' },
  { value: 'flower', label: 'Fleur' },
];



const actionTemplate = (params, setFermes, setRefresh, refresh, seteditClicked, editClicked, setFarmToEdit, showClicked, setshowClicked,  setFarmToShow,fetchSerresByFarm) => {
  
  
  const handleEdit = () => {
    console.log('Edit:', params.row);
    setFarmToEdit(params.row);
    seteditClicked(!editClicked);
  };


  const handleView = async () => {

    setFarmToShow(params.row);
    setFarmToEdit(params.row);
    setshowClicked(!showClicked);
    fetchSerresByFarm(params.row.id);

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
  const [showClicked,setshowClicked] = useState(false);
  const [Appelation,setAppelation] = useState("");
  const [Fermes, setFermes] = useState([]);
  const [addClicked, setaddClicked] = useState(false);
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
  const [loadingdataSerre, setLoadingDataSerre] = useState(false);
  const [addNewSerreClick, setaddNewSerreClick] = useState(false);
  const [nameS, setNameS] = useState(null);
  const [sizeS, setSizeS] = useState(null);
  const [loaderDelete, setloaderDelete] = useState(false);
  


 
  const fetchSerresByFarm = async(id)=>{
    setDataSerre(null);
      try{
        setLoadingDataSerre(true);
        
        const token = localStorage.getItem('token');
        const response2 = await axios.get(`${ENDPOINT_API}serres-per-farm/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (response2.status === 200) {
          setDataSerre(response2.data);
        }
        else{
          setDataSerre([]);
        }
      }
      catch(e){
        setDataSerre([]);
        console.log(e.message);
      } finally{
        setLoadingDataSerre(false);
      }
    
  }
 


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
        console.log(response.data);
        const transformedData = response.data.map(item => {
          i++;
          let createdAt = formatDateForCreatedAt(item.created_at)
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

    


  const handleCreatedNewSerre =  async()=>{
    if(nameS.length <= 2){
      alert("Le nom de la serre ne peut pas être vide.");
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
          setaddNewSerreClick(false);
          setshowClicked(true);
          setNameS('');
          setSizeS('');
          fetchSerresByFarm(FarmToShow.id);
        }
        else{
          setloadingCreationOf_New_Serre(false);
          setaddNewSerreClick(false);
          setshowClicked(true);
          alert('Oops, not created ! ');
        }
      }
      catch(e){
        alert('Oops, not created ! ')
        console.log(e.message);
        setloadingCreationOf_New_Serre(false);
        setaddNewSerreClick(false);
        setshowClicked(true);
      }
    }
  }



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






    const handleSauvegardeModifications = async ()=> {
      if(FarmToEdit.name.length <= 2){
        alert("Le nom de la ferme ne peut pas être vide.");
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
            alert('Oops, somethign went wrong ! ');
          }    
        }
        catch(e){
          alert('Oops, somethign went wrong ! ');
          console.log(e.message);
        }finally{
          setloadingEdit(false);
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
        field: 'name', 
        headerName: 'Appelation', 
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
        field: 'created_at', 
        headerName: 'Date création', 
        width: 200, 
        headerAlign: 'center', 
        align: 'center',
        flex: 1 // Allow the column to stretch
      },
      { 
        field: 'actions', 
        renderCell: (params) => actionTemplate(params, setFermes, setRefresh, refresh, seteditClicked, editClicked, setFarmToEdit, showClicked, setshowClicked,  setFarmToShow,fetchSerresByFarm), 
        headerName: 'Actions', 
        minWidth: 200, 
        headerAlign: 'center', 
        align: 'center',
        flex: 1 // Allow the column to stretch
      }
    ];

    
   
    
    
    

  

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
          fetchSerresByFarm(parseInt(idFarm));
          alert('Oops, something went wrong ! ');
        }
      }
      catch(e){
        fetchSerresByFarm(parseInt(idFarm));
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
      



      {/*   show a Farm    */}
      <div className={showClicked ? "popUp  showpopUp" : "popUp "}>
          <div className="popUp12">
            <div className="caseD11">
              <span>Informations&nbsp;de la</span><span>&nbsp;Ferme</span>
            </div>
            {
            FarmToShow !== null && 
              <>
                <div className="rowInp rowInp1">
                  <label>
                    Appelation
                  </label>
                  <label>
                    {
                      FarmToShow.name
                    }
                  </label>
                </div>
                <div className="rowInp rowInp1">
                  <label>
                    Localisation
                  </label>
                  <label>
                    {
                      FarmToShow.location
                    }
                  </label>
                </div>
                <div className="rowInp rowInp1">
                  <label>
                    Mesure en m²
                  </label>
                  <label>
                    {
                      FarmToShow.size
                    }
                  </label>
                </div>
                <div className="rowInp rowInp1">
                  <label>
                    Date de création
                  </label>
                  <label>
                    {
                      FarmToShow.created_at
                    }
                  </label>
                </div>
                <div className="rowInp rowInp1 rowInp122">
                  <label>
                    Serres associées&nbsp;<>{!loadingdataSerre && dataSerre && <>{dataSerre.length === 0 ? ": 0" : `: ${dataSerre.length}`}</>}</>
                  </label>
                    <button
                      className='eionfv'
                      onClick={()=>{
                        setshowClicked(false);
                        setaddNewSerreClick(!addNewSerreClick);
                      }}
                    > 
                      <i className='fa-solid fa-plus' ></i>&nbsp;Ajouter une serre
                    </button>
                </div>
                {
                  loadingdataSerre && !dataSerre ? 
                  <div className="rowInp123">
                    <div className="rowSerre1">
                      Chargement...
                    </div> 
                  </div>
                  :
                  <div className="rowInp123">
                  {
                    dataSerre && 
                    dataSerre.length === 0 ?
                    <div className="rowSerre1">
                      Aucune donnée
                    </div> 
                    : 
                    dataSerre.map((serre)=>{
                      return(
                        <div key={serre.id} className="rowSerre">
                          <div className="casej1">
                          {
                            serre.name
                          }
                          </div>
                          <div className="casej1">
                          {
                            serre.size
                          }&nbsp;m²                           
                          </div>
                          <div className="casej1">
                          {
                            formatDateForCreatedAt(serre.created_at)
                          } 
                          </div>
                          <div className="casej1">
                            <button
                              disabled={loaderDelete}
                              onClick={()=>{
                                deleteSingleSerre(serre.id, serre.farm_id);
                              }}
                            >
                              <i class="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </div> 
                      )
                    })
                  }
                  </div>
                }
              </>
            }
            <div className="rowInp rowInpModified2">
              <button className='jofzvno'  onClick={()=>{setshowClicked(false);setFarmToShow(null);setFarmToEdit(null);}} >Fermer</button>
              <button 
                onClick={()=>{
                  setshowClicked(false);
                  seteditClicked(true);
                }}
                className="efvofvz"
              >
                Modifier la ferme
              </button>
            </div>
          </div>
        </div>
      




      {/*   Add new Farm    */}
      <div className={addClicked ? "popUp showpopUp" : "popUp"}>
        <div className="contPopUp popUp1popUp1popUp1">
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







       {/*   Add new Serre    */}
       <div className={addNewSerreClick ? "popUp popUpX showpopUp" : "popUp popUpX"}>
        {
          addNewSerreClick &&
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
                setaddNewSerreClick(false);
                setNameS("");
                setSizeS('');
                setshowClicked(true);
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
            <div className="caseD2">
              <button  title='Rafraîchir la page' className='eofvouszfv00' onClick={()=>{setRefresh(!refresh)}} disabled={loadingAllFarms} ><i class="fa-solid fa-rotate-right"></i></button>
              <button  className='eofvouszfv11'  onClick={()=>{setaddClicked(true);}} ><i className='fa-solid fa-plus' ></i>&nbsp;Ajouter une ferme</button>
              <button   className='eofvouszfv22'><i className='fa-solid fa-download' ></i>&nbsp;Exporter</button>
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
                className='euosvuouof'
                loading={loadingAllFarms}
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

import React, { useState, useEffect } from 'react';
import "./index.css";
import ImageCarousel from '../../Components/ImageCarousel';
import NavBar from '../../Components/Navbar';
import SideBar from '../../Components/SideBar';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import Select from 'react-select';
import axios from 'axios'
import { ENDPOINT_API } from "../../endpoint";
import LVG from './Loader.gif'
import formatDateForCreatedAt from '../../Helpers/formatCreatedAt';
import PopUp from '../../Components/PopUp';
import ErrorSuccess from '../../Components/ErrorSuccess';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const actionTemplate = (params, 
    setCalculations, 
    setRefresh, 
    refresh, 
    seteditClicked, 
    editClicked,
    setCalculToEdit,
    calculToEdit,
    setshowClicked,
    showClicked , 
    setSelectedGreenhouse, 
    setSelectedFarm, 
    farms,setplaques,
    setGreenhouses, 
    showItResponse, setisErrorResponse,  setshowItResponse, setmessageResponse,
    doFctOne
  ) => {
  
 



    const handleEdit = () => {
      console.log("Edit:", params.row);
    
      let updatedCalcul = { ...params.row }; // Start with the row's data
    
      // Handle farm selection
      if (params.row.farm_id && params.row.farm_id !== "---") {
        setSelectedFarm({
          value: params.row.farm_id,
          label: params.row.farm_name,
        });
    
        updatedCalcul = {
          ...updatedCalcul,
          farm_id: params.row.farm_id,
          farm_name: params.row.farm_name,
        };
    
        const selectedFarmX = farms.find((farm) => farm.id === params.row.farm_id);
    
        if (selectedFarmX) {
          // Populate greenhouses
          const greenhouseOptions = selectedFarmX.serres.map((serre) => ({
            value: serre.id,
            label: serre.name,
          }));
          setGreenhouses(greenhouseOptions);
     
          const selectedGreenhouseJack = selectedFarmX.serres.find(
            (serre) => serre.id === params.row.serre_id
          );
    
          if (selectedGreenhouseJack) {
            console.warn(selectedGreenhouseJack);
            // Populate plaques
            const plaquesOptions = selectedGreenhouseJack.plaques.map((plaque) => ({
              value: plaque.id,
              label: plaque.name,
            }));
            console.warn(plaquesOptions);
            setplaques(plaquesOptions);
           } else {
            setplaques([]); // Clear plaques if no greenhouse matches
          }
        } else {
          setGreenhouses([]); // Clear greenhouses if no farm matches
          setplaques([]);
        }
      }
    

      console.log("Data Of Edit : "+params.row);

      if (params.row.serre_id && params.row.serre_id !== "---") {
        console.log("Entering the part : Greenhouse");
        setSelectedGreenhouse({
          value: params.row.serre_id,
          label: params.row.serre_name,
        });
    
        updatedCalcul = {
          ...updatedCalcul,
          serre_id: params.row.serre_id,
          serre_name: params.row.serre_name,
        };
    

      }
 
      doFctOne();
      // Final updates
      setCalculToEdit(updatedCalcul);
      seteditClicked(!editClicked);
    };

    




  
  const handleView = async () => {
    if(params.row.farm_id !== null && params.row.farm_id !== "---"){
      setCalculToEdit(params.row);
      setshowClicked(!showClicked);
    };
  }






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
       if(!showItResponse){
                setisErrorResponse(true);
                setmessageResponse("Une erreur est survenue lors de la suppression du calcul.");
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
      setmessageResponse("Une erreur est survenue lors de la suppression du calcul.");
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


const Calculations = ({newDemandes,setNewDemandes, newReservations, setNewReservations}) => {


  const [refresh,setRefresh] = useState(false);
  const [IDplaque,setIDplaque] = useState("");
  const [Calculations, setCalculations] = useState([]);
  const [addClicked, setaddClicked] = useState(false);
  const [editClicked, seteditClicked] = useState(false);
  const [calculToEdit, setCalculToEdit] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);   
  const [imageName, setImageName] = useState('');
  const [loading, setloading] = useState(false);
  const [loadingAllPred, setloadingAllPred] = useState(true);
  const [loadingAllFarms, setloadingAllFarms] = useState(true);
  const [loadingEdit, setloadingEdit] = useState(false);
  
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);

  const [greenhouses, setGreenhouses] = useState([]);
  const [selectedGreenhouse, setSelectedGreenhouse] = useState(null);

  const [plaques, setplaques] = useState([]);
  const [selectedPlaque, setselectedPlaque] = useState(null);
  
  const [options, setoptions] = useState([]);
  const [showClicked,setshowClicked] = useState(false);
  const [showItResponse, setshowItResponse] = useState(false);
  const [isErrorResponse, setisErrorResponse] = useState(false);
  const [messageResponse, setmessageResponse] = useState(null);
  const [IsImageToSeenClicked, setIsImageToSeenClicked] = useState(null);


  const [ExporterClicked, setExporterClicked] = useState(false);



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
      const filex = Array.from(event.target.files);  
      if (filex.length > 0) {
        console.log(filex)
        setImageFiles(filex);  
      } else {
        setImageFiles([]);   
      }
  };




  

  const fetchDataPrediction = async () => {
    try {
      setloadingAllPred(true);
      const userId = localStorage.getItem('userId');
      const userIdNum = parseInt(userId);
      const token = localStorage.getItem('token');
  
       const predictionsResponse = await axios.get(`${ENDPOINT_API}users/${userIdNum}/p_with_image_version_two`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      
      if (predictionsResponse.status === 200) {
        console.log(predictionsResponse.data);
        let i = 0;
        const transformedData = await Promise.all(
          predictionsResponse.data.map(async (item, index) => {
            let createdAt = formatDateForCreatedAt(item.created_at);
        
            const totalClassA = item.images.reduce((acc, image) => acc + (image.class_A || 0), 0);
            const totalClassB = item.images.reduce((acc, image) => acc + (image.class_B || 0), 0);
        
            return {
              idInc: index + 1,
              id: item.id,
              farm_id: item.farm_id || "---",
              serre_id: item.serre_id || "---",
              plaque_id: item.plaque_id || "---",
              plaque_name: item.plaque ? item.plaque.name : "---",
              result: item.result ? `${item.result}%` : "---",
              class_A: totalClassA || 0,  // Somme de class_A
              class_B: totalClassB || 0,  // Somme de class_B
              images: item.images.map(image => ({
                class_A: image.class_A,
                class_B: image.class_B,
                name: image.name  
              })) || [],
              created_at: createdAt || "---",
              created_at_notmodified: item.created_at,
              farm_name: item.farm ? item.farm.name : "---",
              serre_name: item.serre ? item.serre.name : "---",
            };
          })
        );
        
        
      
        setCalculations(transformedData);
      }
      
      
      else {
        if(!showItResponse){
                setisErrorResponse(true);
                setmessageResponse("Une erreur est survenue lors de la récupération des calculs.");
                setshowItResponse(true);
                setTimeout(()=>{          
                  setshowItResponse(false);
                }, 4500);
              }
      }
  
    } catch (error) {
      if(!showItResponse){
                setisErrorResponse(true);
                setmessageResponse("Une erreur est survenue lors de la récupération des calculs.");
                setshowItResponse(true);
                setTimeout(()=>{          
                  setshowItResponse(false);
                }, 4500);
              }
      console.error('Erreur:', error.message);
    } finally {
      setloadingAllPred(false);
    }
  };
  

  


  const fetchDataFarmsWithSerresWithPlaquess = async () => {
    try {
      setloadingAllFarms(true);
      setoptions([]);
      const userId = localStorage.getItem('userId');
      const type = localStorage.getItem('type');
      const token = localStorage.getItem('token'); 

      let userIdNum = null

      if(type === "staff"){
        
        const responseAdminId = await axios.get(`${ENDPOINT_API}getUserByIdAndHisStaffData/${parseInt(userId)}`, {
        
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if(responseAdminId.status === 200){
          userIdNum = responseAdminId.data.staffs[0].admin_id;
        }
        else{ 
          setloadingAllFarms(false);
          return;
        }

      }
      else{
        userIdNum = userId;
      }

      
      const response = await axios.get(`${ENDPOINT_API}getFarmsWithGreenhousesWithPlaques/${parseInt(userIdNum)}/${localStorage.getItem('type')}`, {
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
    fetchDataFarmsWithSerresWithPlaquess();
  }, []);




  




  const handleSelectionChange = (type, selectedOption) => {
    if (type === "farm") {
      // Handle farm selection
      setSelectedGreenhouse(null);  // Clear previously selected greenhouse
      setselectedPlaque(null);      // Clear previously selected plaque
  
      if (selectedOption !== null) {
        setSelectedFarm(selectedOption);
  
        // Find the selected farm in the farms array
        const selectedFarm = farms.find(farm => farm.id === selectedOption.value);
  
        if (selectedFarm) {
          // Populate greenhouses
          const greenhouseOptions = selectedFarm.serres.map((serre) => ({
            value: serre.id,
            label: serre.name,
          }));
          setGreenhouses(greenhouseOptions);
        } else {
          setGreenhouses([]); // Clear greenhouses if no farm matches
          setplaques([]);     // Clear plaques
        }
      } else {
        // If no farm is selected, reset everything
        setSelectedFarm(null);
        setGreenhouses([]);
        setplaques([]);
      }
    } else if (type === "greenhouse") {
      // Handle greenhouse selection
      setselectedPlaque(null);  // Clear previously selected plaque
  
      if (selectedOption !== null) {
        setSelectedGreenhouse(selectedOption);
  
        // Find the selected greenhouse in the farms array
        const selectedFarm = farms.find(farm =>
          farm.serres.some(serre => serre.id === selectedOption.value)
        );
  
        const selectedGreenhouseX = selectedFarm?.serres.find(
          serre => serre.id === selectedOption.value
        );
  
        if (selectedGreenhouseX) {
          // Extract the plaques for the selected greenhouse
          const plaqueOptions = selectedGreenhouseX.plaques.map(plaque => ({
            value: plaque.id,
            label: plaque.name,
          }));
          setplaques(plaqueOptions); // Set plaques
        } else {
          setplaques([]); // Clear plaques if no greenhouse matches
        }
      } else {
        // If no greenhouse is selected, reset plaques
        setSelectedGreenhouse(null);
        setplaques([]);
        setselectedPlaque(null);
      }
    }
  };
  







  




  


    const handleSauvegardeModifications = async()=>{
      try{
        setloadingEdit(true);
        const token = localStorage.getItem('token');

        let dataJOJO = {
          plaque_id : selectedPlaque && selectedPlaque.value,
          farm_id : selectedFarm && selectedFarm.value, 
          serre_id : selectedGreenhouse && selectedGreenhouse.value, 
          created_at : calculToEdit.created_at_notmodified
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
          setImageFiles([]);
          setImageName(null);
          setSelectedGreenhouse(null);
          setselectedPlaque(null);
          fetchDataPrediction();
        }
        else{
          if(!showItResponse){
                setisErrorResponse(true);
                setmessageResponse("Une erreur est survenue lors de la modification du calcul");
                setshowItResponse(true);
                setTimeout(()=>{          
                  setshowItResponse(false);
                }, 4500);
              }
        }

      }
      catch(e){
        console.log(e.message);
        if(!showItResponse){
                setisErrorResponse(true);
                setmessageResponse("Une erreur est survenue lors de la modification du calcul");
                setshowItResponse(true);
                setTimeout(()=>{          
                  setshowItResponse(false);
                }, 4500);
              }
      } finally{
        setloadingEdit(false);
      }
    }





    

    const handleSauvegarde = async ()=> {
      if (imageFiles.length === 0) {
        if (!showItResponse) {
            setisErrorResponse(true);
            setmessageResponse("L'image du calcul ne peut pas être vide.");
            setshowItResponse(true);
            setTimeout(() => {
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

          let idFarm = selectedFarm ? parseInt(selectedFarm.value) : null;
          let idSerre = selectedGreenhouse ? parseInt(selectedGreenhouse.value) : null;
          let idPlaque = selectedPlaque ? parseInt(selectedPlaque.value) : null;

          let formData = new FormData();
            
          imageFiles.forEach((file) => {
            formData.append('images[]', file);
          });
 
          formData.append('user_id', parseInt(userIdNum));
          if(idPlaque){
            formData.append('plaque_id', idPlaque);
          }
          formData.append('created_at', new Date().toISOString().slice(0, 19).replace('T', ' '));
          if(idSerre){
            formData.append('serre_id', idSerre);
          }
          if(idFarm){
            formData.append('farm_id', idFarm);
          }


          const response = await axios.post(`${ENDPOINT_API}create_prediction`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          });

          if(response.status === 201){
            document.querySelector('input[type="file"]').value = '';
            setRefresh(!refresh);
            setaddClicked(false);
            setImageName(null);
            setSelectedFarm(null);
            setSelectedGreenhouse(null);
            setIDplaque(null);
            setselectedPlaque(null);
            setImageFiles([]);
            setaddClicked(false);
          }        
          else{
           if(!showItResponse){
          setisErrorResponse(true);
          setmessageResponse("Une erreur est survenue lors de la création du calcul.");
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
          setmessageResponse("Une erreur est survenue lors de la création du calcul.");
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
 



    const doFctOne = ()=>{
      
     if(calculToEdit){
      console.log("Render fct : DoFctOne");
      console.log(calculToEdit);
        setselectedPlaque({
          value: calculToEdit.plaque_id,
          label: calculToEdit.plaque_name,
        });
     }
    }

    useEffect(()=>{
      doFctOne();
    },[editClicked]);


    
    
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
        field: 'created_at', 
        headerName: 'Date création', 
        width: 120, 
        headerAlign: 'center', 
        align: 'center',
        flex: 1 // Allow the column to stretch
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
        minWidth: 260, 
        headerAlign: 'center', 
        align: 'center',
        flex: 1 // Allow the column to stretch
      },
      { 
        field: 'serre_name', 
        headerName: 'Serre', 
        minWidth: 260, 
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
        field: 'plaque_name', 
        headerName: 'Plaque', 
        minWidth: 260, 
        headerAlign: 'center', 
        align: 'center',
        flex: 1 // Allow the column to stretch
      },
      { 
        field: 'class_A', 
        headerName: 'Mouches', 
        width: 50, 
        headerAlign: 'center', 
        align: 'center',
        flex: 1 // Allow the column to stretch
      },
      { 
        field: 'class_B', 
        headerName: 'Tuta', 
        width: 50, 
        headerAlign: 'center', 
        align: 'center',
        flex: 1 // Allow the column to stretch
      },
      { 
        field: 'actions', 
        renderCell: (params) => actionTemplate(params, setCalculations, setRefresh, refresh, seteditClicked, editClicked, setCalculToEdit, calculToEdit, setshowClicked, showClicked , setSelectedGreenhouse, setSelectedFarm, farms,setplaques,setGreenhouses, showItResponse, isErrorResponse, setisErrorResponse, setshowItResponse, setmessageResponse ,doFctOne),
        headerName: 'Actions', 
        minWidth: 200, 
        headerAlign: 'center', 
        align: 'center',
        flex: 1 // Allow the column to stretch
      }
    ];
    
    


    const [loading2OfPredictions, setloading2OfPredictions] = useState(false);
    const [loading2OfPredictions2, setloading2OfPredictions2] = useState(false);







    const fetchDataPredictionsForExcel = async (fileName = 'data.xlsx') => {
      try {
        setloading2OfPredictions(true);
        const userId = localStorage.getItem('userId');
        const userIdNum = parseInt(userId);
        const token = localStorage.getItem('token');
    
         const predictionsResponse = await axios.get(`${ENDPOINT_API}users/${userIdNum}/p_with_image_version_two`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
    
        
        if (predictionsResponse.status === 200) {
          console.log(predictionsResponse.data);
          let i = 0;
          const transformedData = await Promise.all(
            predictionsResponse.data.map(async (item, index) => {
              let createdAt = formatDateForCreatedAt(item.created_at);
          
              const totalClassA = item.images.reduce((acc, image) => acc + (image.class_A || 0), 0);
              const totalClassB = item.images.reduce((acc, image) => acc + (image.class_B || 0), 0);
          
              return {
                Index: index + 1,
                Ferme: item.farm ? item.farm.name : "---",
                Serre: item.serre ? item.serre.name : "---",
                Plaque: item.plaque ? item.plaque.name : "---",
                Mouches: totalClassA || 0,  // Somme de class_A
                Tuta: totalClassB || 0,  // Somme de class_B
                Date: createdAt || "---",
              };
            })
          );
          
          
          
          const worksheet = XLSX.utils.json_to_sheet(transformedData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
          XLSX.writeFile(workbook, fileName);




          
        }
        
        
        else {
          if(!showItResponse){
                  setisErrorResponse(true);
                  setmessageResponse("Une erreur est survenue lors de la récupération des calculs.");
                  setshowItResponse(true);
                  setTimeout(()=>{          
                    setshowItResponse(false);
                  }, 4500);
                }
        }
    
      } catch (error) {
        if(!showItResponse){
                  setisErrorResponse(true);
                  setmessageResponse("Une erreur est survenue lors de la récupération des calculs.");
                  setshowItResponse(true);
                  setTimeout(()=>{          
                    setshowItResponse(false);
                  }, 4500);
                }
        console.error('Erreur:', error.message);
      } finally {
        setloading2OfPredictions(false);
      }
    };




    const fetchDataPredictionsForPDF = async (fileName = 'data.xlsx') => {
      try {
        setloading2OfPredictions2(true);
        const userId = localStorage.getItem('userId');
        const userIdNum = parseInt(userId);
        const token = localStorage.getItem('token');
    
         const predictionsResponse = await axios.get(`${ENDPOINT_API}users/${userIdNum}/p_with_image_version_two`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
    
        
        if (predictionsResponse.status === 200) {
          console.log(predictionsResponse.data);
          let i = 0;

          let predictionWithMaximumValues = null;
          
          const transformedData = await Promise.all(
            predictionsResponse.data.map(async (item, index) => {
              let createdAt = formatDateForCreatedAt(item.created_at);
          
              const totalClassA = item.images.reduce((acc, image) => acc + (image.class_A || 0), 0);
              const totalClassB = item.images.reduce((acc, image) => acc + (image.class_B || 0), 0);
          
              return {
                Index: index + 1,
                Ferme: item.farm ? item.farm.name : "---",
                Serre: item.serre ? item.serre.name : "---",
                Plaque: item.plaque ? item.plaque.name : "---",
                Mouches: totalClassA || 0,  // Somme de class_A
                Tuta: totalClassB || 0,  // Somme de class_B
                Date: createdAt || "---",
              };
            })
          );
          
          
          const columns = [
            { headerName: "Index", field: "Index" },
            { headerName: "Ferme", field: "Ferme" },
            { headerName: "Serre", field: "Serre" },
            { headerName: "Plaque", field: "Plaque" },
            { headerName: "Mouches", field: "Mouches" },
            { headerName: "Tuta", field: "Tuta" },
            { headerName: "Date", field: "Date" },
          ];

          const doc = new jsPDF();


          const tableColumn = columns.map(col => col.headerName); // Array of column headers
          const tableRows = transformedData.map(row => 
            columns.map(col => row[col.field]) // Map fields to row data
          );

          doc.text('PEST ID / Calculs', 14, 15);
          doc.autoTable({
            head: [tableColumn], // Add headers
            body: tableRows, // Add rows
            startY: 20, // Start below the title
            headStyles: {
              fillColor: [95, 162, 27],  
              textColor: [255, 255, 255],
              fontSize: 12, // Optional: Adjust font size
              halign: 'center', // Center-align header text
            },
          });
        
          doc.save(fileName);

          

        }
        
        
        else {
          if(!showItResponse){
                  setisErrorResponse(true);
                  setmessageResponse("Une erreur est survenue lors de la récupération des calculs.");
                  setshowItResponse(true);
                  setTimeout(()=>{          
                    setshowItResponse(false);
                  }, 4500);
                }
        }
    
      } catch (error) {
        if(!showItResponse){
                  setisErrorResponse(true);
                  setmessageResponse("Une erreur est survenue lors de la récupération des calculs.");
                  setshowItResponse(true);
                  setTimeout(()=>{          
                    setshowItResponse(false);
                  }, 4500);
                }
        console.error('Erreur:', error.message);
      } finally {
        setloading2OfPredictions2(false);
      }
    };


    

  return (
    <>
    <PopUp/>
    <div className='Dashboard'>
      <NavBar /> 
      <SideBar newReservations={newReservations} setNewReservations={setNewReservations}  newDemandes={newDemandes} setNewDemandes={setNewDemandes} />
      <ErrorSuccess  
        isError={isErrorResponse}
        showIt={showItResponse}
        message={messageResponse}  
      />


 

      <div className={ExporterClicked ? "popUp  showpopUp kakakakakak1" : "popUp kakakakakak1"}>
        <div className="kakakakakak1kakakakakak1kakakakakak1kakakakakak1kakakakakak1">
              <div className="rowOn9i">
                <span>Exporter les données</span>
              </div>
              <br />
              <div className="rowOn9i">
                <button disabled={loading2OfPredictions} className='jackichann' onClick={() => fetchDataPredictionsForExcel('calculs.xlsx')} >
                  <i className='fa-solid fa-file-excel'></i>&nbsp;&nbsp;&nbsp;
                  {
                    loading2OfPredictions ? "Traitement en cours..." : "Sous format Excel"
                  }
                </button>
              </div>
              <div className="rowOn9ii" />
              <div className="rowOn9i">
                <button disabled={loading2OfPredictions2} onClick={() => fetchDataPredictionsForPDF('calculs.pdf')}   className='jackichannS'>
                <i className='fa-solid fa-file-pdf'></i>&nbsp;&nbsp;&nbsp;{
                    loading2OfPredictions2 ? "Traitement en cours..." : "Sous format PDF"
                  }
                </button>
              </div>
              <button 
                className='srhfduihsuidfwhqhdwfuoqdwhfuo'
                onClick={()=>{
                  setExporterClicked(false);
                }} 
              >
                <i className='fa-solid fa-xmark'></i>
              </button>
        </div>
      </div>



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
                  <label>Ferme</label>
                  <Select
                    value={selectedFarm}
                    onChange={(itemValue) => handleSelectionChange("farm", itemValue)} // Use the combined function
                    options={options}
                    isDisabled={loadingAllFarms}
                    placeholder="Choisissez une option"
                    styles={customStyles}
                  />
                </div>
                <div className="rowInp">
                  <label>Serre</label>
                  <Select
                    value={selectedGreenhouse}
                    onChange={(itemValue) => handleSelectionChange("greenhouse", itemValue)} // Use the combined function
                    options={greenhouses}
                    isDisabled={!selectedFarm}
                    placeholder="Choisissez une option"
                    styles={customStyles}
                  />
                </div>
                <div className="rowInp">
                  <label>Plaque</label>
                  <Select
                    value={selectedPlaque}
                    onChange={(value) => setselectedPlaque(value)} // This remains direct as plaques are independent of further changes
                    options={plaques}
                    isDisabled={!selectedGreenhouse}
                    placeholder="Choisissez une option"
                    styles={customStyles}
                  />
                </div>


              </>
            }
            <div className="rowInp rowInpModified">
              <button className='jofzvno' disabled={loading} onClick={()=>{seteditClicked(false);setCalculToEdit(null);setselectedPlaque(null);setSelectedFarm(null);setSelectedGreenhouse(null);setplaques(null)}} >Annuler</button>
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
      




        {/*   show Calculation Images    */}
              
        <div className={showClicked ? "popUp  showpopUp" : "popUp "}>
          {
            calculToEdit !== null && 
              <div className="contPopUp2798326">
                <button
                  className='fermeTaGeule'
                  onClick={()=>{
                    setshowClicked(false);                    
                    setCalculToEdit(null);
                  }}
                >
                  <i className='fa-solid fa-xmark' ></i>
                </button>
                <div className="caseD11 caseD11caseD11">
                  <span>Images&nbsp;du</span><span>&nbsp;Calcul</span>
                </div>
                <div className="sudiwfh">
                  {
                    calculToEdit.images.length === 0 ? 
                    <div className="casAks casAks2"> 
                      <span>Aucune donnée</span>
                    </div>
                    :
                    <div className="casAks">
                      <ImageCarousel images={calculToEdit.images} />
                    </div>
                  }
                  <div className="casAkDs">
                    <div className="zirsqfd">
                      <div className="rowInFoS">
                        <span>Ferme :</span> <span>{calculToEdit.farm_name}</span>
                      </div>
                      <div className="rowInFoS">
                        <span>Serre :</span> <span>{calculToEdit.serre_name}</span>
                      </div>
                      <div className="rowInFoS">
                        <span>Plaque :</span> <span>{calculToEdit.plaque_name}</span>
                      </div>
                      <div className="rowInFoS">
                        <span className='eyvfyrziyiyzfiyfz'>Nombre de Tuta :</span> <span className='eyvfyrziyiyzfiyfz'>{calculToEdit.class_B}</span>
                      </div>
                      <div className="rowInFoS">
                        <span className='eyvfyrziyiyzfiyfz2'>Nombre de Mouche :</span> <span className='eyvfyrziyiyzfiyfz2'>{calculToEdit.class_A}</span>
                      </div>
                    </div>
                  </div>
                </div>                
              </div>
          }
        </div>
      





      {/*   Add new Calculation    */}
      <div className={addClicked ? "popUp showpopUp" : "popUp"}>
        <div className="contPopUp popUp1popUp1popUp1">
          <div className="caseD11">
            <span>Nouveau</span><span>&nbsp;&nbsp;Calcul</span>
          </div>
           

              
          <div className="rowInp">
            <label>Ferme</label>
            <Select
              value={selectedFarm}
              onChange={(itemValue) => handleSelectionChange("farm", itemValue)} // Trigger combined handler for farm
              options={options} // Farm options
              isDisabled={loadingAllFarms}
              placeholder="Choisissez une option"
              styles={customStyles}
            />
          </div>

          <div className="rowInp">
            <label>Serre</label>
            <Select
              value={selectedGreenhouse}
              onChange={(itemValue) => handleSelectionChange("greenhouse", itemValue)} // Trigger combined handler for greenhouse
              options={greenhouses} // Greenhouse options based on selected farm
              isDisabled={!selectedFarm} // Disable unless a farm is selected
              placeholder="Choisissez une option"
              styles={customStyles}
            />
          </div>

          <div className="rowInp">
            <label>Plaque</label>
            <Select
              value={selectedPlaque}
              onChange={(itemValue) => setselectedPlaque(itemValue)} // Directly update the selected plaque
              options={plaques} // Plaque options based on selected greenhouse
              isDisabled={!selectedGreenhouse} // Disable unless a greenhouse is selected
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
            {
              imageFiles !== null && 
              <>
              {
                imageFiles.length >=1 ? 
                  `${imageFiles.length} image${imageFiles.length>1 ? "s" : ""} ${imageFiles.length>1 ? "ont" : "a"} été séléctionnée${imageFiles.length>1 ? "s" : "" }` 
                  : 
                  'Choisir des images'
              }
              </>
            }
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                style={{ display: 'none' }}   
              />
            </label>
          </div>
          <div className="rowInp rowInpModified">
            <button className='jofzvno' disabled={loading} onClick={()=>{setaddClicked(false);setImageName(null);setImageFiles([]);setselectedPlaque(null); setSelectedGreenhouse(null);setSelectedFarm(null);}} >Annuler</button>
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
              <span>Mes</span><span>&nbsp;Calculs</span>
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
              <button  disabled={loadingAllPred}  className='eofvouszfv00 oefbbofoufzuofzs' onClick={()=>{setRefresh(!refresh)}} >
                <i className='fa-solid fa-arrows-rotate'></i>
                <div className="tooltipXX">Actualiser</div>
              </button>
              <button  className='eofvouszfv11'  onClick={()=>{setaddClicked(true);}} ><i className='fa-solid fa-plus' ></i>&nbsp;Ajouter un calcul</button>
              <button  onClick={()=>{setExporterClicked(true);}}  className='eofvouszfv22'><i className='fa-solid fa-download' ></i>&nbsp;Exporter</button>
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
                columns={columns.filter(column => !['id','idInc', 'farm_id', 'serre_id', 'plaque_id'].includes(column.field))}
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
    </>
  )
}

export default Calculations

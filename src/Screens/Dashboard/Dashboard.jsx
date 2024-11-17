import React, { useEffect, useState } from 'react'
import "./index.css";
import { ENDPOINT_API } from "../../endpoint";
import formatDateForCreatedAt from '../../Helpers/formatCreatedAt';
import NavBar from '../../Components/Navbar';
import SideBar from '../../Components/SideBar';
import PopUp from '../../Components/PopUp';
import axios from 'axios';
import ErrorSuccess from '../../Components/ErrorSuccess';
import LVG from './Loader.gif'
import { LineChart, Line,Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar, AreaChart } from 'recharts';
import CryptoJS from 'crypto-js';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';


const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', width : "200px" }}>
        <div style={{ color: 'black', width : "100%", display : "flex", alignItems : "center", justifyContent : "space-between" }}><span style={{ color : "#" ,fontWeight : "500", }} >Date :</span>{`${label}`}</div>
        <div style={{ color: '#ffae00', width : "100%", display : "flex", alignItems : "center", justifyContent : "space-between" }}><span style={{ color : "#ffae00" ,fontWeight : "500", }} >Mouches :</span> {` ${payload.find(p => p.dataKey === 'Mouches')?.value || 0}`}</div>
        <div style={{ color: '#5fa21b', width : "100%", display : "flex", alignItems : "center", justifyContent : "space-between" }}><span style={{ color : "#5fa21b" ,fontWeight : "500", }} >Tuta :</span> {` ${payload.find(p => p.dataKey === 'Tuta')?.value || 0}`}</div>
       </div>
    );
  }

  return null;
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




const Dashboard = () => {

  const [showItResponse, setshowItResponse] = useState(false);
  const [isErrorResponse, setisErrorResponse] = useState(false);
  const [messageResponse, setmessageResponse] = useState(null);
  const [refresh, setRefresh] = useState(true);
  const [isSuperAdministrator, setisSuperAdministrator] = useState(null);
  const [loadingType, setloading] = useState(true);


  const navigate = useNavigate();

  //! card & charts
  const [loading1, setLoading1] = useState(true);
  const [Loading2,setLoading2] = useState(true);
  const [Loading3,setLoading3] = useState(true);

  const [Loading4,setLoading4] = useState(true);


  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [data3, setData3] = useState(null);

  const [ChartData, setChartData] =useState(null);
  const [chartData2, setChartData2] =useState(null);
  const [chartData3, setChartData3] =useState(null);
  const [chartData4, setChartData4] =useState(null);



  const [voirMouches, setvoirMouches] = useState(true);
  const [voirTuta, setvoirTuta] = useState(true);
 


  useEffect(()=>{

    const checkBroadCast = async()=>{
      try{
        const resp = await axios.get(`${ENDPOINT_API}user/${parseInt(localStorage.getItem('userId'))}`,{
          headers : {
            Authorization : `Bearer ${localStorage.getItem('token')}`
          }
        });
        if(resp.status === 200){
          if(resp.data.isNoticeOfBroadCastSeen === 0 || resp.data.isNoticeOfBroadCastSeen === "0" || resp.data.isNoticeOfBroadCastSeen === false){
            localStorage.setItem('isNoticeOfBroadCastSeen',"notseen");
          }
          else{
            localStorage.setItem('isNoticeOfBroadCastSeen',"seen");
          }
        }
      }
      catch(e){
        console.log(e.message)
      }
    } 
    checkBroadCast();

  },[localStorage.getItem('isNoticeOfBroadCastSeen')]);






  const fetchTypeOfUser = async ()=>{
    setisSuperAdministrator(null);
    setloading(true);
    
    const typeEncryptedToCheck = localStorage.getItem('typeEncrypted');
    if (!typeEncryptedToCheck){ 
        setisErrorResponse(true);
        setmessageResponse("Vous n'avez pas le droit d'accès à cette page au moment.");
        setshowItResponse(true);
        setLoading1(false);
        setLoading2(false);
        setLoading3(false);
        setloading(false);
        return;
    }else{
      const bytes = CryptoJS.AES.decrypt(typeEncryptedToCheck, "PCSAGRI3759426586252");
      let realType = bytes.toString(CryptoJS.enc.Utf8);
      setisSuperAdministrator(realType);
    }
    
    setloading(false);
  }





  const fetch_data_data1 = async () => {
    try {
      setChartData(null);
      setLoading1(true);
      setData1(null);
      const userId = localStorage.getItem('userId');
      const userIdNum = parseInt(userId);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${ENDPOINT_API}users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200 ) {
  
        if(response.data.length === 0){
          setData1([]);
        }
        else{

        const transformedData = response.data.users
          .filter(user => user.id !== userIdNum)
          .map(user => {
            return {
              id: user.id,
              type: user.type && user.type,
              created_at: user.created_at && user.created_at
            };
          });
          setData1(transformedData);

  
        const allDates = transformedData.map(user => new Date(user.created_at).toISOString().split('T')[0]);

        if (allDates.length === 0) return;
        
        const firstDate = new Date(Math.min(...allDates.map(date => new Date(date).getTime()))).toISOString().split('T')[0];
        const lastDate = new Date(Math.max(...allDates.map(date => new Date(date).getTime()))).toISOString().split('T')[0];
        
        
  
        const UtilisateursPerDay = allDates.reduce((acc, date) => {
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});
  
        const chartData = [];
        let currentDate = new Date(firstDate);
  
        while (currentDate <= new Date(lastDate)) {
          const dateString = currentDate.toISOString().split('T')[0];
          
          // Add data points to close the gap if the days between current and next are too long
          if (chartData.length > 0) {
            const previousDate = new Date(chartData[chartData.length - 1].date);
            const daysBetween = Math.floor((currentDate - previousDate) / (1000 * 60 * 60 * 24));
            
            // If gap is larger than 7 days, we reduce it to only two points
            if (daysBetween > 7) {
              const intermediateDays = 2; // Add only two intermediate days for large gaps
              
              // Add two intermediate dates with 0 users to smooth out the line
              for (let i = 1; i <= intermediateDays; i++) {
                const intermediateDate = new Date(previousDate);
                intermediateDate.setDate(previousDate.getDate() + Math.floor(i * daysBetween / (intermediateDays + 1)));
                chartData.push({
                  date: intermediateDate.toISOString().split('T')[0],
                  Utilisateurs: 0
                });
              }
            }
          }
  
          // Push the current date's data to chartData
          chartData.push({
            date: dateString,
            Utilisateurs: UtilisateursPerDay[dateString] || 0,
          });
  
          currentDate.setDate(currentDate.getDate() + 1);
        }
  
        setChartData(chartData);}
  
      } else {
        setData1([]);
      }
    } catch (error) {
      setData1([]);
      if(!showItResponse){
        setisErrorResponse(true);
        setmessageResponse("Une erreur est survenue lors de la récupération des données.");
        setshowItResponse(true);
        setTimeout(()=>{          
          setshowItResponse(false);
        }, 4500);
      }
      console.error('Erreur:', error.message);
    } finally {
      setLoading1(false);
    }
  };
  









  const fetch_data_Images_Traites = async () => {
    try {
      setChartData2(null);
      setLoading2(true);
      setData2(null);
      const userId = localStorage.getItem('userId');
      const userIdNum = parseInt(userId);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${ENDPOINT_API}getAllImages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200 ) {
  
        if(response.data.length === 0){
          setData2([]);
        }
        else{
          setData2(response.data);

        
        const transformedData = response.data
          .map(image => {
            return {
              id: image.id,
              created_at: image.created_at && image.created_at
            };
          });
  
        const allDates = transformedData.map(image => new Date(image.created_at).toISOString().split('T')[0]);
        const firstDate = new Date(Math.min(...allDates.map(date => new Date(date).getTime()))).toISOString().split('T')[0];
        const lastDate = new Date(Math.max(...allDates.map(date => new Date(date).getTime()))).toISOString().split('T')[0];
  
        const ImagesPerDay = allDates.reduce((acc, date) => {
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});
  
        const chartData = [];
        let currentDate = new Date(firstDate);
  
        while (currentDate <= new Date(lastDate)) {
          const dateString = currentDate.toISOString().split('T')[0];
          
          if (chartData.length > 0) {
            const previousDate = new Date(chartData[chartData.length - 1].date);
            const daysBetween = Math.floor((currentDate - previousDate) / (1000 * 60 * 60 * 24));
            
            if (daysBetween > 7) {
              const intermediateDays = 2; 
              
              for (let i = 1; i <= intermediateDays; i++) {
                const intermediateDate = new Date(previousDate);
                intermediateDate.setDate(previousDate.getDate() + Math.floor(i * daysBetween / (intermediateDays + 1)));
                chartData.push({
                  date: intermediateDate.toISOString().split('T')[0],
                  Images: 0
                });
              }
            }
          }
  
          chartData.push({
            date: dateString,
            Images: ImagesPerDay[dateString] || 0,
          });
  
          currentDate.setDate(currentDate.getDate() + 1);
        }
  
        setChartData2(chartData);

        
      }
  
      } else {
        setData2([]);
      }
    } catch (error) {
      setData2([]);
      if(!showItResponse){
        setisErrorResponse(true);
        setmessageResponse("Une erreur est survenue lors de la récupération des données.");
        setshowItResponse(true);
        setTimeout(()=>{          
          setshowItResponse(false);
        }, 4500);
      }
      console.error('Erreur:', error.message);
    } finally {
      setLoading2(false);
    }
  };






  
  const fetch_All_Farms_For_SuperAdmin = async () => {
    try {
      setChartData3(null);
      setLoading3(true);
      setData3(null);
      const userId = localStorage.getItem('userId');
      const userIdNum = parseInt(userId);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${ENDPOINT_API}getAllFarmsDashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200 ) {

        
        if(response.data.length === 0){
          setData3([]);
        }
        else{
          setData3(response.data);

          

        const transformedData = response.data
          .map(prediction => {
            return {
              id: prediction.id,
              created_at: prediction.created_at && prediction.created_at
            };
          });
  
        const allDates = transformedData.map(prediction => new Date(prediction.created_at).toISOString().split('T')[0]);
        const firstDate = new Date(Math.min(...allDates.map(date => new Date(date).getTime()))).toISOString().split('T')[0];
        const lastDate = new Date(Math.max(...allDates.map(date => new Date(date).getTime()))).toISOString().split('T')[0];
  
        const FarmsPerDay = allDates.reduce((acc, date) => {
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});
  
        const chartData = [];
        let currentDate = new Date(firstDate);
  
        while (currentDate <= new Date(lastDate)) {
          const dateString = currentDate.toISOString().split('T')[0];
          
          if (chartData.length > 0) {
            const previousDate = new Date(chartData[chartData.length - 1].date);
            const daysBetween = Math.floor((currentDate - previousDate) / (1000 * 60 * 60 * 24));
            
            if (daysBetween > 7) {
              const intermediateDays = 2; 
              
              for (let i = 1; i <= intermediateDays; i++) {
                const intermediateDate = new Date(previousDate);
                intermediateDate.setDate(previousDate.getDate() + Math.floor(i * daysBetween / (intermediateDays + 1)));
                chartData.push({
                  date: intermediateDate.toISOString().split('T')[0],
                  Fermes: 0
                });
              }
            }
          }
  
          chartData.push({
            date: dateString,
            Fermes: FarmsPerDay[dateString] || 0,
          });
  
          currentDate.setDate(currentDate.getDate() + 1);
        }
  
        setChartData3(chartData);
        }
      } else {
        setData3([]);
      }
    } catch (error) {
      setData3([]);
      if(!showItResponse){
        setisErrorResponse(true);
        setmessageResponse("Une erreur est survenue lors de la récupération des données.");
        setshowItResponse(true);
        setTimeout(()=>{          
          setshowItResponse(false);
        }, 4500);
      }
      console.error('Erreur:', error.message);
    } finally {
      setLoading3(false);
    }
  };









  const fetchFarms = async () => {
    try {
      setLoading1(true);
      setChartData(null);
      setData1(null);

      const userId = localStorage.getItem('userId');
      const type = localStorage.getItem('type');
      let userIdNum = null;
      const token = localStorage.getItem('token');


      if(type === "staff"){
        
        const respX = await axios.get(`${ENDPOINT_API}getUserByIdAndHisStaffData/${parseInt(userId)}`, {
        
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if(respX.status === 200){
          userIdNum = respX.data.staffs[0].admin_id;
        }
        else{
          setLoading1(false);
          alert('Une erreur est survenue lors de la récupération des données.');
        }

      }
      else{
        userIdNum = parseInt(userId);
      }
      
      const response = await axios.get(`${ENDPOINT_API}farms/${parseInt(userIdNum)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200 ) {
  
        if(response.data.length === 0){
          setData1([]);

        }
        else{

        const transformedData = response.data
          .map(farm => {
            return {
              id: farm.id,
              created_at: farm.created_at && farm.created_at
            };
          });
          setData1(transformedData);

  
        const allDates = transformedData.map(farm => new Date(farm.created_at).toISOString().split('T')[0]);
        const firstDate = new Date(Math.min(...allDates.map(date => new Date(date).getTime()))).toISOString().split('T')[0];
        const lastDate = new Date(Math.max(...allDates.map(date => new Date(date).getTime()))).toISOString().split('T')[0];
        
        
  
        const FarmsX = allDates.reduce((acc, date) => {
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});
  
        const chartData = [];
        let currentDate = new Date(firstDate);
  
        while (currentDate <= new Date(lastDate)) {
          const dateString = currentDate.toISOString().split('T')[0];
          
          // Add data points to close the gap if the days between current and next are too long
          if (chartData.length > 0) {
            const previousDate = new Date(chartData[chartData.length - 1].date);
            const daysBetween = Math.floor((currentDate - previousDate) / (1000 * 60 * 60 * 24));
            
            // If gap is larger than 7 days, we reduce it to only two points
            if (daysBetween > 7) {
              const intermediateDays = 2; // Add only two intermediate days for large gaps
              
              // Add two intermediate dates with 0 users to smooth out the line
              for (let i = 1; i <= intermediateDays; i++) {
                const intermediateDate = new Date(previousDate);
                intermediateDate.setDate(previousDate.getDate() + Math.floor(i * daysBetween / (intermediateDays + 1)));
                chartData.push({
                  date: intermediateDate.toISOString().split('T')[0],
                  Fermes: 0
                });
              }
            }
          }
  
          // Push the current date's data to chartData
          chartData.push({
            date: dateString,
            Fermes: FarmsX[dateString] || 0,
          });
  
          currentDate.setDate(currentDate.getDate() + 1);
        }
  
        setChartData(chartData);}
  
      } else {
        setData1([]);
      }
    } catch (error) {
      setData1([]);
      if(!showItResponse){
        setisErrorResponse(true);
        setmessageResponse("Une erreur est survenue lors de la récupération des données.");
        setshowItResponse(true);
        setTimeout(()=>{          
          setshowItResponse(false);
        }, 4500);
      }
      console.error('Erreur:', error.message);
    } finally {
      setLoading1(false);
    }
  };


  



  const [showDateModal, setShowDateModal] = useState(false);
  const [showDateModal2, setshowDateModal2] = useState(false);


  const [defaultStartDate, setDefaultStartDate] = useState(null);
  const [defaultEndDate, setDefaultEndDate] = useState(null);
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null); 
  
  const [dailySumsX, setDailySumsX] = useState({});
  const [all_Farms, setall_Farms] = useState([]);
  
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [selectedSerre, setSelectedSerre] = useState(null);
  const [selectedPlaque, setSelectedPlaque] = useState(null);

  const [Serres, setSerres] = useState(null);
  const [Plaques, setPlaques] = useState(null);
  
  const [loadingAllFarms, setloadingAllFarms] = useState(true);
  const [options, setoptions] = useState([]);




  const handleSelectionChange = (type, selectedOption) => {
    if(all_Farms && all_Farms.length !== 0){
      if (type === "farm") {
        // Handle farm selection
        setSelectedSerre(null);  // Clear previously selected greenhouse
        setSelectedPlaque(null);      // Clear previously selected plaque
    
        if (selectedOption !== null) {
          setSelectedFarm(selectedOption);
    
          // Find the selected farm in the farms array
          const selectedFarm = all_Farms.find(farm => farm.id === selectedOption.value);
    
          if (selectedFarm) {
            // Populate greenhouses
            const greenhouseOptions = selectedFarm.serres.map((serre) => ({
              value: serre.id,
              label: serre.name,
            }));
            setSerres(greenhouseOptions);
          } else {
            setSerres([]); // Clear greenhouses if no farm matches
            setPlaques([]);     // Clear plaques
          }
        } else {
          // If no farm is selected, reset everything
          setSelectedFarm(null);
          setSerres([]);
          setPlaques([]);
        }
      } else if (type === "serre") {
        // Handle greenhouse selection
        setSelectedPlaque(null);  // Clear previously selected plaque
    
        if (selectedOption !== null) {
          setSelectedSerre(selectedOption);
    
          // Find the selected greenhouse in the farms array
          const selectedFarm = all_Farms.find(farm =>
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
            setPlaques(plaqueOptions); // Set plaques
          } else {
            setPlaques([]); // Clear plaques if no greenhouse matches
          }
        } else {
          // If no greenhouse is selected, reset plaques
          setSelectedSerre(null);
          setPlaques([]);
          setSelectedPlaque(null);
        }
      }
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
        setall_Farms(response.data);
      
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

  
  useEffect(()=>{
    fetchDataFarmsWithSerresWithPlaquess();
  },[]);
 



  const filterBasedOnFarmsSerresPlaques = (data)=>{
    return data.filter(prediction => {
      const farmMatches = selectedFarm ? prediction.farm_id === selectedFarm.value : true;
      const serreMatches = selectedSerre ? prediction.serre_id === selectedSerre.value : true;
      const plaqueMatches = selectedPlaque ? prediction.plaque_id === selectedPlaque.value : true;
      return farmMatches && serreMatches && plaqueMatches;
    });
  }



  const fetch____data____second_chart = async () => {
    try {
      setLoading4(true);
      setChartData4(null);

      const userId = localStorage.getItem('userId');
      const userIdNum = parseInt(userId);
      const token = localStorage.getItem('token');
  
      const response = await axios.get(`${ENDPOINT_API}users/${userIdNum}/p_with_image_version_two`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.status === 200) {
        if (response.data.length === 0) {
          setChartData4(null);
        } else {

          const transformedData = await Promise.all(
            response.data.map(async (prediction, index) => {
          
              const totalClassA = prediction.images.reduce((acc, image) => acc + (image.class_A || 0), 0);
              const totalClassB = prediction.images.reduce((acc, image) => acc + (image.class_B || 0), 0);
          
              return {
                id: prediction.id,
                farm_id: prediction.farm_id || "---",
                serre_id: prediction.serre_id || "---",
                plaque_id: prediction.plaque_id || "---",
                plaque_name: prediction.plaque ? prediction.plaque.name : "---",
                Mouches: totalClassA || 0,  // Somme de class_A
                Tuta: totalClassB || 0,  // Somme de class_B
                created_at: prediction.created_at ,
                farm_name: prediction.farm ? prediction.farm.name : "---",
                serre_name: prediction.serre ? prediction.serre.name : "---",
              };
            })
          );

          console.log("--- Before");
          console.log(transformedData);
          console.log("--- After");
          
          const filteredData = filterBasedOnFarmsSerresPlaques(transformedData);  

          console.log(filteredData);
          console.log("___________________");


          const dailySums = filteredData.reduce((acc, prediction) => {
            const date = new Date(prediction.created_at).toISOString().split('T')[0];
  
            if (!acc[date]) {
              acc[date] = { Mouches: 0, Tuta: 0};
            }
  
            acc[date].Mouches += prediction.Mouches || 0;
            acc[date].Tuta += prediction.Tuta || 0;
  
            return acc;
          }, {});
  
          const allDates = Object.keys(dailySums);
          const firstDate = new Date(Math.min(...allDates.map(date => new Date(date).getTime()))).toISOString().split('T')[0];
          const lastDate = new Date(Math.max(...allDates.map(date => new Date(date).getTime()))).toISOString().split('T')[0];
  
          setDefaultStartDate(firstDate);
          setDefaultEndDate(lastDate);
          setCustomStartDate(firstDate);
          setCustomEndDate(lastDate);

          setDailySumsX(dailySums);

          const chartData = generateChartData(dailySums, firstDate, lastDate);
          setChartData4(chartData);
        }
      } else {
        setChartData4(null);
      }
    } catch (error) {
      console.error('Erreur:', error.message);
      setChartData4(null);
    } finally {
      setLoading4(false);
    }
  };



  const generateChartData = (dailySums, startDate, endDate) => {
    const chartData = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      const dateString = currentDate.toISOString().split('T')[0];
      chartData.push({
        date: dateString,
        Mouches: dailySums[dateString]?.Mouches || 0,
        Tuta: dailySums[dateString]?.Tuta || 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return chartData;
  };






  const handleApplyDateRange = () => {
    const correctedStartDate = new Date(customStartDate) > new Date(customEndDate) ? customEndDate : customStartDate;
    const correctedEndDate = new Date(customStartDate) > new Date(customEndDate) ? customStartDate : customEndDate;
    const newChartData = generateChartData(dailySumsX, correctedStartDate, correctedEndDate);
    setChartData4(newChartData);
    setShowDateModal(false);
  };
  






 










  

  const fetch_predictions_of_admin = async () => {
    try {
      setLoading2(true);
      setLoading3(true);
      setChartData2(null);
      setChartData3(null);
      setData2(null);
      setData3(null);
      const userId = localStorage.getItem('userId');
      const userIdNum = parseInt(userId);
      const token = localStorage.getItem('token');
  
      const response = await axios.get(`${ENDPOINT_API}users/${userIdNum}/p_with_image_version_two`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.status === 200) {
        if (response.data.length === 0) {
          setData2(0);
          setData3(0);
        } else {
          let predictionWithMaximumValues = null;
  

         console.warn(response.data);
          const transformedData = await Promise.all(
            response.data.map(async (item, index) => {
          
              const totalClassA = item.images.reduce((acc, image) => acc + (image.class_A || 0), 0);
              const totalClassB = item.images.reduce((acc, image) => acc + (image.class_B || 0), 0);
          

              return {
                Index: index + 1,
                id: item.id,
                plaque_id: item.plaque_id,
                plaque_name: item.plaque ? item.plaque.name : '---',
                serre_id: item.serre_id,
                farm_id: item.farm_id,
                class_A: totalClassA || 0,  // Somme de class_A
                class_B: totalClassB || 0,  // Somme de class_B
                created_at: item.created_at,  // Somme de class_B
              };
            })
          );

          
  
          // No filtering for the last 7 days; we now use the entire data set
          const totalInsects = transformedData.reduce((sum, prediction) => {
            const classA = typeof prediction.class_A === 'number' ? prediction.class_A : 0;
            const classB = typeof prediction.class_B === 'number' ? prediction.class_B : 0;
             return sum + classA + classB;
          }, 0);
  
          const moyenne = transformedData.length > 0 ? totalInsects / transformedData.length : 0;
          predictionWithMaximumValues = transformedData.reduce((max, prediction) => {
            const sum = (prediction.class_A || 0) + (prediction.class_B || 0);
            if (sum > (max.sum || 0)) {
              return { ...prediction, sum };
            }
            return max;
          }, {});
  
          setData3(predictionWithMaximumValues);
          console.warn(predictionWithMaximumValues);
          setData2(moyenne);
  
          // Calculating daily sums over all dates, without filtering to last 7 days
          const dailySums = transformedData.reduce((acc, prediction) => {
            const date = new Date(prediction.created_at).toISOString().split('T')[0];
            const sum = (prediction.class_A || 0) + (prediction.class_B || 0) ;
            if (acc[date]) {
              acc[date] += sum;
            } else {
              acc[date] = sum;
            }
            return acc;
          }, {});
  
          const allDates = Object.keys(dailySums);
          const firstDate = new Date(Math.min(...allDates.map(date => new Date(date).getTime()))).toISOString().split('T')[0];
          const lastDate = new Date(Math.max(...allDates.map(date => new Date(date).getTime()))).toISOString().split('T')[0];
  
          const chartData = [];
          let currentDate = new Date(firstDate);
          while (currentDate <= new Date(lastDate)) {
            const dateString = currentDate.toISOString().split('T')[0];
            chartData.push({
              date: dateString,
              Insectes: dailySums[dateString] || 0,
            });
  
            currentDate.setDate(currentDate.getDate() + 1);
          }
  
          setChartData2(chartData);
          setChartData3(predictionWithMaximumValues);
        }
      } else {
        setData2(0);
        setChartData3(null);
          setData3(0);
      }
    } catch (error) {
      setData2(0);
      setChartData3(null);
          setData3(0);
      if (!showItResponse) {
        setisErrorResponse(true);
        setmessageResponse("Une erreur est survenue lors de la récupération des données.");
        setshowItResponse(true);
        setTimeout(() => {
          setshowItResponse(false);
        }, 4500);
      }
      console.error('Erreur:', error.message);
    } finally {
      setLoading2(false);
      setLoading3(false);
    }
  };
  








  


  useEffect(()=>{
    fetchTypeOfUser();
  }, [refresh]);

  useEffect(()=>{
    if(isSuperAdministrator){
      if(isSuperAdministrator === "superadmin"){
        //superadmin
        fetch_data_data1();
        fetch_All_Farms_For_SuperAdmin();
        fetch_data_Images_Traites();
        fetch____data____second_chart();
      }
      else if(isSuperAdministrator === "admin"){
        //admin
        fetchFarms();
        fetch_predictions_of_admin();
        fetch____data____second_chart();
      }
      else{
        //staff
        fetchFarms();
        fetch_predictions_of_admin();
        fetch____data____second_chart();
      }
    }
  }, [refresh, isSuperAdministrator]);
  
 

  useEffect(() => {
    if (selectedFarm === null && selectedPlaque === null && selectedSerre === null) {
      fetch____data____second_chart();
    }
  }, [selectedFarm, selectedPlaque, selectedSerre]);



  return (
    <div className='Dashboard'>


      <div className={showDateModal2 ? "popUp  showpopUp" : "popUp "}>
        <div className="contPopUp popUp1 popUp1popUp1popUp12    popUp1popUp1popUp12345 popUp6666Modifi7 popUp6666Modifi7999 popUp6666Modifi79990909">
          <div className="caseD11 caseD111">
            <span className='svowdjc svowdjccolors'>Sélectionner la plage de dates&nbsp;</span><span className='svowdjc'>&nbsp;</span>
          </div>
              <div className="rowInp">
                <label>Ferme</label>
                  <Select
                    value={selectedFarm}
                    onChange={(itemValue) => handleSelectionChange("farm", itemValue)} 
                    options={options}
                    isDisabled={loadingAllFarms}
                    placeholder="Choisissez une option"
                    styles={customStyles}
                  />
              </div>
              <div className="rowInp">
                  <label>Serre</label>
                  <Select
                    value={selectedSerre}
                    onChange={(itemValue) => handleSelectionChange("serre", itemValue)} 
                    options={Serres}
                    isDisabled={!selectedFarm}
                    placeholder="Choisissez une option"
                    styles={customStyles}
                  />
              </div>
              <div className="rowInp">
                  <label>Plaque</label>
                  <Select
                    value={selectedPlaque}
                    onChange={(value) => setSelectedPlaque(value)} 
                    options={Plaques}
                    isDisabled={!selectedSerre}
                    placeholder="Choisissez une option"
                    styles={customStyles}
                  />
              </div>
            <div className="rowInp rowInpModified">
                <button 
                  disabled={loadingAllFarms || Loading4}
                  className='jofzvno' 
                  onClick={()=>{
                    setshowDateModal2(false);
                  }} 
                >
                  Fermer
                </button>
                <button 
                  disabled={loadingAllFarms || Loading4}
                  onClick={()=>{
                    fetch____data____second_chart();
                    setshowDateModal2(false);
                  }}
                  className={ "efvofvz22 efvofvz22efvofvz22efvofvz2288"} 
                >
                {
                  "Enregistrer la modification"
                }
                </button>
            </div>
        </div>
      </div>



      <div className={showDateModal ? "popUp  showpopUp" : "popUp "}>
        <div className="contPopUp popUp1 popUp1popUp1popUp12    popUp1popUp1popUp12345 popUp6666Modifi7 popUp6666Modifi7999">
          <div className="caseD11 caseD111">
            <span className='svowdjc svowdjccolors'>Sélectionner la plage de dates&nbsp;</span><span className='svowdjc'>&nbsp;</span>
          </div>
          <div className="zroshrvhsfv">
            <input
              type="date"
              className='hsrfvhzsvhso'
              value={customStartDate}
              min={defaultStartDate}
              max={defaultEndDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
            />
          </div>
          <div className="zroshrvhsfv">
          <input
            type="date"
            className='hsrfvhzsvhso'
            value={customEndDate}
            min={defaultStartDate}
            max={defaultEndDate}
            onChange={(e) => setCustomEndDate(e.target.value)}
          />
          </div>
          <div className="rowInp rowInpModified">
              <button 
                className='jofzvno' 
                onClick={()=>{
                  setShowDateModal(false);
                }} 
              >
                Fermer
              </button>
              <button 
                onClick={()=>{
                  handleApplyDateRange()
                }}
                className={ "efvofvz22 efvofvz22efvofvz22efvofvz2288"} 
              >
              {
                "Enregistrer la modification"
              }
              </button>
          </div>
        </div>
      </div>

      
      <NavBar /> 
      <SideBar />
      <PopUp />
      <ErrorSuccess  
        isError={isErrorResponse}
        showIt={showItResponse}
        message={messageResponse}  
      />
     

      {
        loadingType ? 
        <>
          <div className="containerDash containerDashCustomized1">
              <div className="rowD1">
                <div className="caseD1 caseD1mod">
                  <span>Tableau</span><span>&nbsp;de Board</span>
                  {
                      loadingType || loading1 || Loading2 || Loading3 || loadingAllFarms ?
                      <>
                        <img style={{marginLeft : "1.3rem"}} src={LVG} alt="..." height={23} width={23} />
                      </>
                      :
                      <button className='isbvdussofbvsuofbvousf' onClick={()=>{navigate(0);}}  disabled={loadingType || Loading2 || Loading3 || loading1} ><i className='fa-solid fa-arrows-rotate' ></i></button>
                  }
                </div>
              </div>

          </div>
        </>
        :
        <>
        {
          isSuperAdministrator === "superadmin" ? 
            <>
            <div className="containerDash containerDashCustomized1">
              <div className="rowD1">
                <div className="caseD1 caseD1mod">
                  <span>Tableau</span><span>&nbsp;de Board</span>
                  {
                      loadingType || loading1 || Loading2 || Loading3 ?
                      <>
                        <img style={{marginLeft : "1.3rem"}} src={LVG} alt="..." height={23} width={23} />
                      </>
                      :
                      <button className='isbvdussofbvsuofbvousf' onClick={()=>{navigate(0);}}  disabled={loadingType || Loading2 || Loading3 || loading1} ><i className='fa-solid fa-arrows-rotate' ></i></button>
                  }
                </div>
              </div>
              <div className="rowD2ab">
              <div className="cardX">
                  <div className="rowCardX">
                    <i className='fa-solid fa-user'></i>&nbsp;&nbsp;Total des utilisateurs
                  </div>
                  <div className="rowCardX2">
                    <div className="NOSD7IO9">
                    {
                      data1 ? data1.length : ""
                    }
                    </div>
                    <div className="NOSD7I9999">
                    {
                      loading1 ? 
                      <div className='odosfvoufnosfovefsouv'>
                        <img src={LVG} alt="..." height={16} width={16} />&nbsp;&nbsp;Chargement...
                    </div>
                      :
                      <>
                      {
                      ChartData ? 
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={ChartData}>
                            <defs>
                              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#8cd83f" stopOpacity={1} />
                                <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="none" />
                            <XAxis dataKey="date" hide={true} />
                            <YAxis hide={true} />
                            <Tooltip />
                            <Area
                              type="monotone"
                              dataKey="Utilisateurs"
                              stroke="#67c10c"
                              fill="url(#gradient)" // Applying the gradient here
                              strokeWidth={1.8}
                            />
                          </AreaChart>
                        </ResponsiveContainer>

                      :
                      <div className='odosfvoufnosfovefsouv'>
                      Aucune donnée pour tracer le graphique.
                      </div>
                    }
                      </>
                    }
                    </div>
                  </div>
                </div>
                <div className="cardX">
                  <div className="rowCardX">
                    <i className='fa-regular fa-image'></i>&nbsp;&nbsp;Total des images traitées
                  </div>
                  <div className="rowCardX2">
                    <div className="NOSD7IO9NOSD7IO9">
                    {
                      data2 ? data2.length : ""
                    }
                    </div>
                    <div className="NOSD7I9999">
                    <>
                    {
                      Loading2 ? 
                      <div className='odosfvoufnosfovefsouv'>
                        <img src={LVG} alt="..." height={16} width={16} />&nbsp;&nbsp;Chargement...
                      </div>                :
                      <>
                      {
                      chartData2 ? 
                      <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData2}>
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#8cd83f" stopOpacity={1} />
                            <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="none" />
                        <XAxis dataKey="date" hide={true} />
                        <YAxis hide={true} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="Images"
                          stroke="#67c10c"
                          fill="url(#gradient)" // Applying the gradient here
                          strokeWidth={1.8}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                    
                      :
                      <div className='odosfvoufnosfovefsouv'>
                      Aucune donnée pour tracer le graphique.
                      </div>
                    }
                      </>
                    }
                    </>
                    </div>
                  </div>
                </div>
                <div className="cardX">
                  <div className="rowCardX">
                    <i class="fa-solid fa-seedling"></i>&nbsp;&nbsp;Total des fermes
                  </div>
                  <div className="rowCardX2">
                    <div className="NOSD7IO9">
                    {
                      data3 ? data3.length : ""
                    }
                    </div>
                    <div className="NOSD7I9999">
                    <>
                    {
                      Loading2 ? 
                      <div className='odosfvoufnosfovefsouv'>
                        <img src={LVG} alt="..." height={16} width={16} />&nbsp;&nbsp;Chargement...
                      </div>                :
                      <>
                      {
                      chartData3 ? 
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData3}>
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#8cd83f" stopOpacity={1} />
                              <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="none" />
                          <XAxis dataKey="date" hide={true} />
                          <YAxis hide={true} />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="Fermes"
                            stroke="#67c10c"
                            fill="url(#gradient)" // Gradient fill applied here
                            strokeWidth={1.8}
                          />
                        </AreaChart>
                      </ResponsiveContainer>

                        :
                      <div className='odosfvoufnosfovefsouv'>
                      Aucune donnée pour tracer le graphique.
                      </div>
                    }
                      </>
                    }
                    </>
                     
                    </div>
                  </div>
                </div>
              </div>
              <div className="rowD3ab">
                {
                  Loading4 === false && 
                  <>
                   
                      <div className="colorss">
                    <div className="case9887253">
                      <div className="iosfvijsv89435">
                        <div className="caro"
                          onClick={()=>{
                               setvoirMouches(!voirMouches);
                          
                          }}
                        >
                        {
                          voirMouches && <i className='fa-solid fa-check'></i>
                        }
                        </div>
                        <div className="meaningCARO1">
                          Mouches
                        </div>
                      </div>
                      <div className="iosfvijsv89435">
                        <div className="caro2"
                          onClick={()=>{
                            setvoirTuta(!voirTuta);
                          }}
                        >
                        {
                          voirTuta && <i className='fa-solid fa-check'></i>
                        }
                        </div>
                        <div className="meaningCARO2">
                          Tuta
                        </div>
                      </div>
                    </div>
                    <div className="case8243527">
                      <button
                        onClick={()=>{
                          setSelectedFarm(null);
                          setSelectedPlaque(null);
                          setSelectedSerre(null);
                          setChartData4(null);
                          setDailySumsX(null);
                          setCustomEndDate(null);
                          setCustomStartDate(null); 
                          setDefaultEndDate(null);
                          setDefaultStartDate(null);
                          fetch____data____second_chart();
                        }}    
                      >
                        <i className='fa-solid fa-arrows-rotate'></i>&nbsp;&nbsp;Rafraîchir
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <button
                        onClick={() => setshowDateModal2(true)}
                      >
                        <i className='fa-solid fa-leaf'></i>&nbsp;&nbsp;Filtrer par Ferme
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <button
                         onClick={() => setShowDateModal(true)}
                      >
                        <i className='fa-solid fa-calendar-days'></i>&nbsp;&nbsp;Filtrer par Date
                      </button>
                    </div>
                </div>
                    
                
                  </>
                }
              {
                      Loading4 ? 
                      <div className='odosfvoufnosfovefsouv'>
                        <img src={LVG} alt="..." height={16} width={16} />&nbsp;&nbsp;Chargement...
                      </div>                
                      :
                      <div className='surfvhuoshfovhsofuhvoush'>
                      {
                      chartData4 ? 
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart 
                            isAnimationActive={true}
                            data={chartData4}
                            tick={{ fontSize: 14 }}
                          >
                            <defs>
                              <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#ffae00" stopOpacity={1} />
                                <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
                              </linearGradient>
                              <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#5fa21b" stopOpacity={1} />
                                <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
                              </linearGradient>
                              <linearGradient id="gradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#67c10c" stopOpacity={1} />
                                <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="2.5 2.5"  />
                            <Tooltip content={<CustomTooltip />} />
                          


                            




                           


                            

                            {
                              voirTuta && 
                              <>
                              {/* class_B Area */}
                              <Area
                                animationEasing="ease-in-out"
                                animationDuration={1500}
                                type="monotone"
                                dataKey="Tuta"
                                stroke="#5fa21b"
                                fill="url(#gradient2)"
                                strokeWidth={1.8}
                              />
                              </>
                            }
   

   {
                              voirMouches && 
                              <>
                              {/* class_A Area */}
                                <Area
                                  animationEasing="ease-in-out"
                                  animationDuration={1500}
                                  type="monotone"
                                  dataKey="Mouches"
                                  stroke="#ffae00"
                                  fill="url(#gradient1)"
                                  strokeWidth={1.8}
                                />
                              </>
                            }

                            
                            
                            <XAxis 
                              dataKey="date" 
                              hide={true}
                            />
                            <YAxis />
                            
                          </AreaChart>
                        </ResponsiveContainer>
                      :
                      <div className='odosfvoufnosfovefsouv'>
                      Aucune donnée pour tracer le graphique.
                      </div>
                    }
                      </div>
                    }
              </div>
            </div>
            </>
            :
            
            <>
            <div className="containerDash containerDashCustomized1">
              <div className="rowD1">
                <div className="caseD1 caseD1mod">
                  <span>Tableau</span><span>&nbsp;de Board</span>
                  {
                      loadingType || loading1 || Loading2 || Loading3 ?
                      <>
                        <img style={{marginLeft : "1.3rem"}} src={LVG} alt="..." height={23} width={23} />
                      </>
                      :
                      <button className='isbvdussofbvsuofbvousf' onClick={()=>{navigate(0);}} disabled={loadingType || Loading2 || Loading3 || loading1} ><i className='fa-solid fa-arrows-rotate' ></i></button>
                  }
                </div>
              </div>
              <div className="rowD2ab">
              <div className="cardX">
                  <div className="rowCardX">
                    <i class="fa-solid fa-seedling"></i>&nbsp;&nbsp;Total des fermes
                  </div>
                  <div className="rowCardX2">
                    <div className="NOSD7IO9">
                    {
                      data1 ? data1.length : ""
                    }
                    </div>
                    <div className="NOSD7I9999">
                    {
                      loading1 ? 
                      <div className='odosfvoufnosfovefsouv'>
                        <img src={LVG} alt="..." height={16} width={16} />&nbsp;&nbsp;Chargement...
                    </div>
                      :
                      <>
                      {
                      ChartData ? 
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={ChartData}>
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#8cd83f" stopOpacity={1} />
                              <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="none" />
                          <XAxis dataKey="date" hide={true} />
                          <YAxis hide={true} />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="Fermes"
                            stroke="#67c10c"
                            fill="url(#gradient)" // Gradient fill applied here
                            strokeWidth={1.8}
                          />
                        </AreaChart>
                      </ResponsiveContainer>

                      :
                      <div className='odosfvoufnosfovefsouv'>
                      Aucune donnée pour tracer le graphique.
                      </div>
                    }
                      </>
                    }
                    </div>
                  </div>
                </div>
                <div className="cardX">
                  <div className="rowCardX" 
                    style={{
                      display : "flex !important", 
                      alignItems : "center !important"
                    }}
                  >
                    <i class="fa-solid fa-magnifying-glass"></i>&nbsp;&nbsp;Moyenne de capture / jour <span
                      style={{
                        fontSize : "15px !important", 
                        color : "gray",
                        fontWeight : "400", 
                        marginTop : "0.3rem", 
                        marginLeft : "0.5rem"
                      }}
                    >(7 derniers jours)</span>
                  </div>
                  <div className="rowCardX2">
                    <div className="NOSD7IO9NOSD7IO9">
                    {
                      data2 && parseInt(data2) 
                    }
                    </div>
                    <div className="NOSD7I9999">
                    <>
                    {
                      Loading2 ? 
                      <div className='odosfvoufnosfovefsouv'>
                        <img src={LVG} alt="..." height={16} width={16} />&nbsp;&nbsp;Chargement...
                      </div>                
                      :
                      <>
                      {
                      chartData2 ? 
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData2}>
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#9fe857" stopOpacity={1} />
                              <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="none" />
                          <XAxis dataKey="date" hide={true} />
                          <YAxis hide={true} />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="Insectes"
                            stroke="#67c10c"
                            fill="url(#gradient)"
                            strokeWidth={1.8}
                          />
                        </AreaChart>
                      </ResponsiveContainer>

                      :
                      <div className='odosfvoufnosfovefsouv'>
                      Aucune donnée pour tracer le graphique.
                      </div>
                    }
                      </>
                    }
                    </>
                    </div>
                  </div>
                </div>
                <div className="cardX">
                  <div className="rowCardX">
                    <i class="fa-solid fa-turn-up"></i>&nbsp;&nbsp;Plaque à captures maximales
                  </div>
                  <div className="rowCardX2">
                    <div className="NOSrowCardX2D7IO9 NOSD7IO9NOSD7IO9">
                    {
                      data3 && data3.sum 
                    }
                    </div>
                    <div className="NOSD7I9999">
                    {
                      Loading3 ? 
                      <div className='odosfvoufnosfovefsouv'>
                        <img src={LVG} alt="..." height={16} width={16} />&nbsp;&nbsp;Chargement...
                      </div>                :
                      <>
                      {
                      chartData3 ? 
                      <div className='odosfvoufnosfovefsouv222'>
                        <div className="row6632 row66322">
                          <span>Plaque : </span>  <span>{chartData3.plaque_name ? chartData3.plaque_name : "---"}</span>
                        </div>
                        {/* {
                          chartData3.farm_id && 
                          <div className="row6632 row66322">
                            <span>Farm ID : </span>   {chartData3.farm_id}
                          </div>
                        }
                        {
                          chartData3.serre_id && 
                          <div className="row6632 row66322">
                            <span>Serre ID : </span>  <div>{chartData3.serre_id}</div>
                          </div>
                        } */}
                        <div className="row6632 row66322">
                        <span>Date : </span>{formatDateForCreatedAt(chartData3.created_at)}
                        </div>
                      </div>
                      :
                      <div className='odosfvoufnosfovefsouv'>
                      Aucune donnée pour tracer le graphique.
                      </div>
                      }
                      </>
                    }
                    </div>
                  </div>
                </div>
              </div>
              <div className="rowD3ab">
                {
                  Loading4 === false && 
                  <>
                  {
                    chartData4 && 
                    <>
                      <div className="colorss">
                    <div className="case9887253">
                      <div className="iosfvijsv89435">
                        <div className="caro"
                          onClick={()=>{
                               setvoirMouches(!voirMouches);
                          
                          }}
                        >
                        {
                          voirMouches && <i className='fa-solid fa-check'></i>
                        }
                        </div>
                        <div className="meaningCARO1">
                          Mouches
                        </div>
                      </div>
                      <div className="iosfvijsv89435">
                        <div className="caro2"
                          onClick={()=>{
                            setvoirTuta(!voirTuta);
                          }}
                        >
                        {
                          voirTuta && <i className='fa-solid fa-check'></i>
                        }
                        </div>
                        <div className="meaningCARO2">
                          Tuta
                        </div>
                      </div>
                      
                    </div>
                    <div className="case8243527">
                      <button
                        onClick={()=>{
                          setSelectedFarm(null);
                          setSelectedPlaque(null);
                          setSelectedSerre(null);
                          setChartData4(null);
                          setDailySumsX(null);
                          setCustomEndDate(null);
                          setCustomStartDate(null); 
                          setDefaultEndDate(null);
                          setDefaultStartDate(null);
                          fetch____data____second_chart();
                        }}    
                      >
                        <i className='fa-solid fa-arrows-rotate'></i>&nbsp;&nbsp;Rafraîchir
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <button
                        onClick={() => setshowDateModal2(true)}
                      >
                        <i className='fa-solid fa-leaf'></i>&nbsp;&nbsp;Filtrer par Ferme
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <button
                         onClick={() => setShowDateModal(true)}
                      >
                        <i className='fa-solid fa-calendar-days'></i>&nbsp;&nbsp;Filtrer par Date
                      </button>
                    </div>
                </div>
                    </>
                  }
                  </>
                }
              {
                      Loading4 ? 
                      <div className='odosfvoufnosfovefsouv'>
                        <img src={LVG} alt="..." height={16} width={16} />&nbsp;&nbsp;Chargement...
                      </div>                
                      :
                      <div className='surfvhuoshfovhsofuhvoush'>
                      {
                      chartData4 ? 
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart 
                            isAnimationActive={true}
                            data={chartData4}
                            tick={{ fontSize: 14 }}
                          >
                            <defs>
                              <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#ffae00" stopOpacity={1} />
                                <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
                              </linearGradient>
                              <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#5fa21b" stopOpacity={1} />
                                <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
                              </linearGradient>
                              <linearGradient id="gradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#67c10c" stopOpacity={1} />
                                <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="2.5 2.5"  />
                            <Tooltip content={<CustomTooltip />} />
                          


                           




                           

                            

                            {
                              voirTuta && 
                              <>
                              {/* class_B Area */}
                              <Area
                                animationEasing="ease-in-out"
                                animationDuration={1500}
                                type="monotone"
                                dataKey="Tuta"
                                stroke="#5fa21b"
                                fill="url(#gradient2)"
                                strokeWidth={1.8}
                              />
                              </>
                            }
   
                            
   {
                              voirMouches && 
                              <>
                              {/* class_A Area */}
                                <Area
                                  animationEasing="ease-in-out"
                                  animationDuration={1500}
                                  type="monotone"
                                  dataKey="Mouches"
                                  stroke="#ffae00"
                                  fill="url(#gradient1)"
                                  strokeWidth={1.8}
                                />
                              </>
                            }



                            <XAxis 
                              dataKey="date" 
                              hide={true}
                            />
                            <YAxis />
                            
                          </AreaChart>
                        </ResponsiveContainer>
                      :
                      <div className='odosfvoufnosfovefsouv'>
                      Aucune donnée pour tracer le graphique.
                      </div>
                    }
                      </div>
                    }
              </div>
            </div>
            </>
          }
        </>
      }

       
 

     
    </div>
  )
}

export default Dashboard;
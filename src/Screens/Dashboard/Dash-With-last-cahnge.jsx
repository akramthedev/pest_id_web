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
import PopUpModalDash from './PopUpModalDash';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', width : "200px" }}>
        <div style={{ color: 'black', width : "100%", display : "flex", alignItems : "center", justifyContent : "space-between" }}><span style={{ color : "#" ,fontWeight : "500", }} >Date :</span>{`${label}`}</div>
        <div style={{ color: '#da0404', width : "100%", display : "flex", alignItems : "center", justifyContent : "space-between" }}><span style={{ color : "#da0404" ,fontWeight : "500", }} >Mouches :</span> {` ${payload.find(p => p.dataKey === 'Mouches')?.value || 0}`}</div>
        <div style={{ color: '#8a2be2', width : "100%", display : "flex", alignItems : "center", justifyContent : "space-between" }}><span style={{ color : "#8a2be2" ,fontWeight : "500", }} >Tuta :</span> {` ${payload.find(p => p.dataKey === 'Tuta')?.value || 0}`}</div>
      </div>
    );
  }

  return null;
};




const Dashboard = () => {

  const [showItResponse, setshowItResponse] = useState(false);
  const [isErrorResponse, setisErrorResponse] = useState(false);
  const [messageResponse, setmessageResponse] = useState(null);
  const [refresh, setRefresh] = useState(true);
  const [isSuperAdministrator, setisSuperAdministrator] = useState(null);
  const [loadingType, setloading] = useState(true);


  //! card & charts
  const [loading1, setLoading1] = useState(true);
  const [Loading2,setLoading2] = useState(true);
  const [Loading3,setLoading3] = useState(true);

  const [Loading4,setLoading4] = useState(true);


  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [data3, setData3] = useState(null);
  const [data4, setData4] = useState(null);

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
  const [showDateModal2, setShowDateModal2] = useState(false);
  const [defaultStartDate, setDefaultStartDate] = useState(null);
  const [defaultEndDate, setDefaultEndDate] = useState(null);
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [dailySumsX, setDailySumsX] = useState({});
  const [loadingAllFarmsWithSerresWithPlaques, setloadingAllFarmsWithSerresWithPlaques] = useState(false);




  const [farms, setFarms] = useState([]);  
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [selectedSerre, setSelectedSerre] = useState(null);
  const [selectedPlaque, setSelectedPlaque] = useState(null);

 


  const  getAllFarmsWithSerresWithPlaques = async()=>{
    try{
      setSelectedPlaque(null);
      setDailySumsX({})
      setCustomStartDate(null);
      setDefaultEndDate(null);
      setDefaultStartDate(null);
      setSelectedSerre(null);
      setSelectedFarm(null);
      setFarms(null);

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
          setloadingAllFarmsWithSerresWithPlaques(false);
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

      setFarms(response.data);
    }
    catch(e){
      console.log(e.message);
    } finally{
      setloadingAllFarmsWithSerresWithPlaques(false);
    }
  }




  const [originalData, setOriginalData] = useState([]);   
  const [filteredData, setFilteredData] = useState([]);  

// Function to fetch the data
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
        const transformedData = response.data.map(prediction => ({
          id: prediction.id,
          plaque_id: prediction.plaque_id,
          serre_id: prediction.serre_id,
          farm_id: prediction.farm_id,
          created_at: prediction.created_at,
          Mouches: Array.isArray(prediction.images) && typeof prediction.images[0]?.class_A === 'number' ? prediction.images[0].class_A : 0,
          Tuta: Array.isArray(prediction.images) && typeof prediction.images[0]?.class_B === 'number' ? prediction.images[0].class_B : 0,
        }));

        // Save the original data
        setOriginalData(transformedData);

        // Apply filters immediately
        const initialFilteredData = applyFilters(transformedData);
        setFilteredData(initialFilteredData);

        const dailySums = calculateDailySums(initialFilteredData);

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

// Function to apply filters on the data
const applyFilters = (data) => {
  return data.filter(prediction => {
    const isFarmMatch = !selectedFarm || prediction.farm_id === selectedFarm;
    const isSerreMatch = !selectedSerre || prediction.serre_id === selectedSerre;
    const isPlaqueMatch = !selectedPlaque || prediction.plaque_id === selectedPlaque;

    return isFarmMatch && isSerreMatch && isPlaqueMatch;
  });
};

// Function to handle farm change
const handleFarmChange = (selectedOption) => {
  setSelectedFarm(selectedOption?.value || null);
  setSelectedSerre(null);  // Reset serre and plaque when farm is changed
  setSelectedPlaque(null);  // Reset plaque when farm is changed

  // Reapply filters when farm changes
  const newFilteredData = applyFilters(originalData);
  setFilteredData(newFilteredData);

  // You might want to recalculate daily sums and chart data here
  const dailySums = calculateDailySums(newFilteredData);
  const chartData = generateChartData(dailySums, customStartDate, customEndDate);
  setChartData4(chartData);
};

// Function to handle serre change
const handleSerreChange = (selectedOption) => {
  setSelectedSerre(selectedOption?.value || null);
  setSelectedPlaque(null);  // Reset plaque when serre is changed

  // Reapply filters when serre changes
  const newFilteredData = applyFilters(originalData);
  setFilteredData(newFilteredData);

  // Recalculate chart data
  const dailySums = calculateDailySums(newFilteredData);
  const chartData = generateChartData(dailySums, customStartDate, customEndDate);
  setChartData4(chartData);
};

// Function to handle plaque change
const handlePlaqueChange = (selectedOption) => {
  setSelectedPlaque(selectedOption?.value || null);

  // Reapply filters when plaque changes
  const newFilteredData = applyFilters(originalData);
  setFilteredData(newFilteredData);

  // Recalculate chart data
  const dailySums = calculateDailySums(newFilteredData);
  const chartData = generateChartData(dailySums, customStartDate, customEndDate);
  setChartData4(chartData);
};

// Function to calculate daily sums
const calculateDailySums = (data) => {
  return data.reduce((acc, prediction) => {
    const date = new Date(prediction.created_at);
    if (isNaN(date.getTime())) {
      console.error(`Invalid date: ${prediction.created_at}`);
      return acc;
    }

    const dateString = date.toISOString().split('T')[0];
    if (!acc[dateString]) {
      acc[dateString] = { Mouches: 0, Tuta: 0, farm_ids: [], serre_ids: [], plaque_ids: [] };
    }

    acc[dateString].Mouches += prediction.Mouches || 0;
    acc[dateString].Tuta += prediction.Tuta || 0;

    // Add farm, serre, and plaque ids to the arrays
    if (prediction.farm_id && !acc[dateString].farm_ids.includes(prediction.farm_id)) {
      acc[dateString].farm_ids.push(prediction.farm_id);
    }
    if (prediction.serre_id && !acc[dateString].serre_ids.includes(prediction.serre_id)) {
      acc[dateString].serre_ids.push(prediction.serre_id);
    }
    if (prediction.plaque_id && !acc[dateString].plaque_ids.includes(prediction.plaque_id)) {
      acc[dateString].plaque_ids.push(prediction.plaque_id);
    }

    return acc;
  }, {});
};

// Generate chart data based on daily sums
const generateChartData = (dailySums, startDate, endDate) => {
  const chartData = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    const dateString = currentDate.toISOString().split('T')[0];
    const dailySum = dailySums[dateString] || { Mouches: 0, Tuta: 0, farm_ids: [], plaque_ids: [], serre_ids: [] };

    chartData.push({
      date: dateString,
      Mouches: dailySum.Mouches,
      Tuta: dailySum.Tuta,
      farm_ids: dailySum.farm_ids,
      plaque_ids: dailySum.plaque_ids,
      serre_ids: dailySum.serre_ids
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return chartData;
};





const handleApplyDateRange = () => {
  console.log('Applying custom date range...');
  
  // Ensure the start and end dates are valid
  const correctedStartDate = new Date(customStartDate) > new Date(customEndDate) ? customEndDate : customStartDate;
  const correctedEndDate = new Date(customStartDate) > new Date(customEndDate) ? customStartDate : customEndDate;
  
  console.log(`Corrected start date: ${correctedStartDate}, corrected end date: ${correctedEndDate}`);
  
  // Apply the date range filter to the already filtered data
  const dateFilteredData = filteredData.filter(prediction => {
    const date = new Date(prediction.created_at);
    const predictionDate = date.toISOString().split('T')[0];
    return predictionDate >= correctedStartDate && predictionDate <= correctedEndDate;
  });

  console.log('Filtered data for date range:', dateFilteredData);

  // Calculate the daily sums based on the filtered data
  const dailySums = calculateDailySums(dateFilteredData);

  console.log('Daily sums after applying date range:', dailySums);

  // Generate the chart data using the filtered daily sums and the date range
  const chartData = generateChartData(dailySums, correctedStartDate, correctedEndDate);
  setChartData4(chartData);

  // Close the date range modal
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
          setData3(null);
        } else {
          let predictionWithMaximumValues = null;
  
          const transformedData = response.data.map(prediction => {
            return {
              id: prediction.id,
              plaque_id: prediction.plaque_id,
              serre_id: prediction.serre_id,
              farm_id: prediction.farm_id,
              created_at: prediction.created_at && prediction.created_at,
              class_A: Array.isArray(prediction.images) && typeof prediction.images[0]?.class_A === 'number' ? prediction.images[0].class_A : 0,
              class_B: Array.isArray(prediction.images) && typeof prediction.images[0]?.class_B === 'number' ? prediction.images[0].class_B : 0,
            };
          });
  
          // No filtering for the last 7 days; we now use the entire data set
          const totalInsects = transformedData.reduce((sum, prediction) => {
            const classA = typeof prediction.class_A === 'number' ? prediction.class_A : 0;
            const classB = typeof prediction.class_B === 'number' ? prediction.class_B : 0;
            return sum + classA + classB ;
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
          setData2(moyenne);
  
          // Calculating daily sums over all dates, without filtering to last 7 days
          const dailySums = transformedData.reduce((acc, prediction) => {
            const date = new Date(prediction.created_at).toISOString().split('T')[0];
            const sum = (prediction.class_A || 0) + (prediction.class_B || 0);
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
        setData3(null);
      }
    } catch (error) {
      setData2(0);
      setChartData3(null);
      setData3(null);
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
    getAllFarmsWithSerresWithPlaques();
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
  
 





  return (
    <div className='Dashboard'>



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
                onClick={handleApplyDateRange}
                className={ "efvofvz22 efvofvz22efvofvz22efvofvz2288"} 
              >
              {
                "Enregistrer la modification"
              }
              </button>
          </div>
        </div>
      </div>



      {
        farms !== null && 
        <PopUpModalDash 
          farms={farms}
          showDateModal2={showDateModal2}  
          setShowDateModal2={setShowDateModal2}
          handleSerreChange={handleSerreChange}
          selectedFarm={selectedFarm}
          handleFarmChange={handleFarmChange}
          handlePlaqueChange={handlePlaqueChange}
          selectedPlaque={selectedPlaque}
          selectedSerre={selectedSerre}
        />
      }

      
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
                      loadingType || loading1 || Loading2 || Loading3 ?
                      <>
                        <img style={{marginLeft : "1.3rem"}} src={LVG} alt="..." height={23} width={23} />
                      </>
                      :
                      <button className='isbvdussofbvsuofbvousf' onClick={()=>{setRefresh(!refresh)}} disabled={loadingType || Loading2 || Loading3 || loading1} ><i className='fa-solid fa-arrows-rotate' ></i></button>
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
                      <button className='isbvdussofbvsuofbvousf' onClick={()=>{setRefresh(!refresh)}} disabled={loadingType || Loading2 || Loading3 || loading1} ><i className='fa-solid fa-arrows-rotate' ></i></button>
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
                  {
                    chartData4 && 
                    <>
                      <div className="colorss">
                    <div className="case9887253">
                      <div className="iosfvijsv89435 iosfvijsv894352">
                        <div className="meaningCARO6">
                          Nombre d'insectes sélectionnés par jour :
                        </div>
                      </div>
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
                    {
                      chartData4 && 
                      <>
                      <div className="case8243527">
                          <button
                            onClick={() => setShowDateModal2(true)}
                          >
                            <i className='fa-solid fa-pen'></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Paramètres&nbsp;&nbsp;d'affichage
                          </button>
                          &nbsp;&nbsp;&nbsp;&nbsp;
                          <button
                            onClick={() => setShowDateModal(true)}
                          >
                            <i className='fa-solid fa-pen'></i>&nbsp;&nbsp;Modifier la plage de dates
                          </button>
                      </div>
                      </>
                    }
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
                                <stop offset="0%" stopColor="#da0404" stopOpacity={1} />
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
                                animationDuration={1300}
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
                                  animationDuration={1300}
                                  type="monotone"
                                  dataKey="Mouches"
                                  stroke="#da0404"
                                  fill="url(#gradient1)"
                                  strokeWidth={1.8}
                                />
                              </>
                            }
   

   


 
                            
                            <XAxis 
                              dataKey="date" 
                              hide={true}
                              tick={false} 
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
                      <button className='isbvdussofbvsuofbvousf' onClick={()=>{setRefresh(!refresh)}} disabled={loadingType || Loading2 || Loading3 || loading1} ><i className='fa-solid fa-arrows-rotate' ></i></button>
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
                    <i class="fa-solid fa-magnifying-glass"></i>&nbsp;&nbsp;Moyenne de capture / jour<span
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
                  <div className="zurçgçuzrfçhzrçfh">
                    <div className="NOSD7IO9NOSD7IO92 NOSD7IO9NOSD7IO9">
                    {
                      data3 && data3.sum 
                    }
                    </div>
                    <div className="NOSD7I9999NOSD7I9999">
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
                          <span>Plaque ID : </span>  <span>{chartData3.plaque_id ? chartData3.plaque_id : "---"}</span>
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
                      <div className="iosfvijsv89435 iosfvijsv894352">
                        <div className="meaningCARO6">
                          Nombre d'insectes sélectionnés par jour :
                        </div>
                      </div>
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
                         onClick={() => setShowDateModal(true)}
                      >
                        <i className='fa-solid fa-pen'></i>&nbsp;&nbsp;Modifier la plage de dates
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
                                <stop offset="0%" stopColor="#da0404" stopOpacity={1} />
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
                              voirMouches && 
                              <>
                              {/* class_A Area */}
                                <Area
                                  animationEasing="ease-in-out"
                                  animationDuration={1300}
                                  type="monotone"
                                  dataKey="Mouches"
                                  stroke="#da0404"
                                  fill="url(#gradient1)"
                                  strokeWidth={1.8}
                                />
                              </>
                            }


{
                              voirTuta && 
                              <>
                              {/* class_B Area */}
                              <Area
                                animationEasing="ease-in-out"
                                animationDuration={1300}
                                type="monotone"
                                dataKey="Tuta"
                                stroke="#5fa21b"
                                fill="url(#gradient2)"
                                strokeWidth={1.8}
                              />
                              </>
                            }
   



                            <XAxis 
                              dataKey="date" 
                              hide={true}
                              tick={false} 
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
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
import { LineChart, Line,Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import CryptoJS from 'crypto-js';




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

  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [data3, setData3] = useState(null);

  const [ChartData, setChartData] =useState(null);
  const [chartData2, setChartData2] =useState(null);
  const [chartData3, setChartData3] =useState(null);


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
      const userIdNum = parseInt(userId);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${ENDPOINT_API}farms/${userIdNum}`, {
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



  











  const fetchDataOfAdministrator = async () => {
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
          setData2([]);
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
              class_C: Array.isArray(prediction.images) && typeof prediction.images[0]?.class_C === 'number' ? prediction.images[0].class_C : 0,
            };
          });
  
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
          const filteredData = transformedData.filter(prediction => {
            const predictionDate = new Date(prediction.created_at);
            return predictionDate >= sevenDaysAgo;
          });
  
          // Calculate the total sum of insects
          const totalInsects = filteredData.reduce((sum, prediction) => {
            const classA = typeof prediction.class_A === 'number' ? prediction.class_A : 0;
            const classB = typeof prediction.class_B === 'number' ? prediction.class_B : 0;
            const classC = typeof prediction.class_C === 'number' ? prediction.class_C : 0;
            return sum + classA + classB + classC;
          }, 0);
  
          const moyenne = filteredData.length > 0 ? totalInsects / filteredData.length : 0;
  
          console.log('Total insects in the last 7 days:', totalInsects);
          console.log('Average insects per entry in the last 7 days:', moyenne);
  
          // Find the record with the maximum sum of class_A + class_B + class_C
          predictionWithMaximumValues = filteredData.reduce((max, prediction) => {
            const sum = (prediction.class_A || 0) + (prediction.class_B || 0) + (prediction.class_C || 0);
            if (sum > (max.sum || 0)) {
              return { ...prediction, sum };
            }
            return max;
          }, {});
  
          setData3(predictionWithMaximumValues);
          setData2(moyenne);
  
          // Group the data by date and calculate sum of class_A + class_B + class_C for each day
          const dailySums = filteredData.reduce((acc, prediction) => {
            const date = new Date(prediction.created_at).toISOString().split('T')[0];
            const sum = (prediction.class_A || 0) + (prediction.class_B || 0) + (prediction.class_C || 0);
  
            if (acc[date]) {
              acc[date] += sum;
            } else {
              acc[date] = sum;
            }
  
            return acc;
          }, {});
  
          // Prepare chart data
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
  }, [refresh]);

  useEffect(()=>{
    if(isSuperAdministrator){
      if(isSuperAdministrator === "superadmin"){
        //superadmin
        fetch_data_data1();
        fetch_All_Farms_For_SuperAdmin();
        fetch_data_Images_Traites();
      }
      else if(isSuperAdministrator === "admin"){
        //admin
        fetchFarms();
        fetchDataOfAdministrator();
      }
      else{
        //staff
      }
    }
  }, [refresh, isSuperAdministrator]);
  
 





  return (
    <div className='Dashboard'>
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
                      <LineChart data={ChartData}>
                          
                          <CartesianGrid strokeDasharray="3 3" stroke="none" />
                          <XAxis 
                            dataKey="date" 
                            hide={true}   
                          />
                          <YAxis hide={true} />
                          <Tooltip />
                          <Line 
                            connectNulls={true}  
                            type="monotone" 
                            dataKey="Utilisateurs" 
                            stroke="#67c10c" 
                            dot={false}  
                            strokeWidth={2}  // Set line thickness
                          />
                        </LineChart>
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
                      <LineChart data={chartData2}>
                          
                          <CartesianGrid strokeDasharray="3 3" stroke="none" />
                          <XAxis 
                            dataKey="date" 
                            hide={true}   
                          />
                          <YAxis hide={true} />
                          <Tooltip />
                          <Line 
                            connectNulls={true}  
                            type="monotone" 
                            dataKey="Images" 
                            stroke="#67c10c" 
                            dot={false}  
                            strokeWidth={2}   
                          />
                        </LineChart>
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
                      <LineChart data={chartData3}>
                          
                          <CartesianGrid strokeDasharray="3 3" stroke="none" />
                          <XAxis 
                            dataKey="date" 
                            hide={true}   
                          />
                          <YAxis hide={true} />
                          <Tooltip />
                          <Line 
                            connectNulls={true}  
                            type="monotone" 
                            dataKey="Fermes" 
                            stroke="#67c10c" 
                            dot={false}  
                            strokeWidth={2}   
                          />
                        </LineChart>
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

              </div>
            </div>
            </>
            :
            isSuperAdministrator === 'admin' ? 
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
                      <LineChart data={ChartData}>
                          
                          <CartesianGrid strokeDasharray="3 3" stroke="none" />
                          <XAxis 
                            dataKey="date" 
                            hide={true}   
                          />
                          <YAxis hide={true} />
                          <Tooltip />
                          <Line 
                            connectNulls={true}  
                            type="monotone" 
                            dataKey="Fermes" 
                            stroke="#67c10c" 
                            dot={false}  
                            strokeWidth={2}  // Set line thickness
                          />
                        </LineChart>
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
                    <i class="fa-solid fa-magnifying-glass"></i>&nbsp;&nbsp;Moyenne de capture <span
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
                      </div>                :
                      <>
                      {
                      chartData2 ? 
                      <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData2}>
                          
                          <CartesianGrid strokeDasharray="3 3" stroke="none" />
                          <XAxis 
                            dataKey="date" 
                            hide={true}   
                          />
                          <YAxis hide={true} />
                          <Tooltip />
                          <Line 
                            connectNulls={true}  
                            type="monotone" 
                            dataKey="Insectes" 
                            stroke="#67c10c" 
                            dot={false}  
                            strokeWidth={2}   
                          />
                        </LineChart>
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
                    <div className="NOSD7IO9">
                    {
                      data3 ? data3.sum : ""
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

              </div>
            </div>
            </>
            :
            <>
              Dash Admin
              //todo Next Scope : Dashboard for Admins and Staffs
              //! After Next Scope : Mka esure that the personal get All Farms and Serres of his administrator not of him like the way u did in Mobile 
            </>
          }
        </>
      }

       
 

     
    </div>
  )
}

export default Dashboard;
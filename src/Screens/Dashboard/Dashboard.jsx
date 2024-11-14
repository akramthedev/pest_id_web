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




const Dashboard = () => {

  const [showItResponse, setshowItResponse] = useState(false);
  const [isErrorResponse, setisErrorResponse] = useState(false);
  const [messageResponse, setmessageResponse] = useState(null);
  const [loadingAllUsers, setLoadingAllUsers] = useState(true);
  const [allUsers, setAllUsers] = useState(null);
  const [AllImages, AllsetImages] = useState(null);
  const [allPredictions, setallPredictions] = useState(null);
  const [LoadingX,setLoadingX] = useState(true);
  const [LoadingY,setLoadingYY] = useState(true);
  const [refresh, setRefresh] = useState(true);
  const [ChartData, setChartData] =useState(null);
  const [ChartDataImages, setChartDataImages] =useState(null);
  const [CHARTpredictions, setCHARTpredictions] =useState(null);
  
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





  const fetch_data_allUsers = async () => {
    try {
      setLoadingAllUsers(true);
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
          setAllUsers([]);

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
          setAllUsers(transformedData);

  
        const allDates = transformedData.map(user => new Date(user.created_at).toISOString().split('T')[0]);
        const firstDate = new Date(Math.min(...allDates.map(date => new Date(date).getTime()))).toISOString().split('T')[0];
        const lastDate = new Date(Math.max(...allDates.map(date => new Date(date).getTime()))).toISOString().split('T')[0];
        console.log('First Date:', firstDate);
        console.log('Last Date:', lastDate);
  
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
        setAllUsers([]);
      }
    } catch (error) {
      setAllUsers([]);
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
      setLoadingAllUsers(false);
    }
  };
  



  const fetch_data_Images_Traites = async () => {
    try {
      setLoadingX(true);
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
          AllsetImages([]);
        }
        else{
          AllsetImages(response.data);

        
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
  
        setChartDataImages(chartData);

        
      }
  
      } else {
        AllsetImages([]);
      }
    } catch (error) {
      AllsetImages([]);
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
      setLoadingX(false);
    }
  };






  
  const fetch_data_predictions = async () => {
    try {
      setLoadingX(true);
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
          setallPredictions([]);
        }
        else{
          setallPredictions(response.data);

          console.warn(response.data)

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
  
        const PredictionsPerDay = allDates.reduce((acc, date) => {
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
            Fermes: PredictionsPerDay[dateString] || 0,
          });
  
          currentDate.setDate(currentDate.getDate() + 1);
        }
  
        setCHARTpredictions(chartData);
        }
      } else {
        setallPredictions([]);
      }
    } catch (error) {
      setallPredictions([]);
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
      setLoadingYY(false);
    }
  };


  useEffect(()=>{
    fetch_data_allUsers();
    fetch_data_predictions();
    fetch_data_Images_Traites();
  }, [refresh]);
  
 





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
      localStorage.getItem("type") === "superadmin" ? 
      <>
         <div className="containerDash containerDashCustomized1">
        <div className="rowD1">
          <div className="caseD1 caseD1mod">
            <span>Tableau</span><span>&nbsp;de Board</span>
            {
                loadingAllUsers || LoadingX || LoadingY ?
                <>
                  <img style={{marginLeft : "1.3rem"}} src={LVG} alt="..." height={23} width={23} />
                </>
                :
                <button className='isbvdussofbvsuofbvousf' onClick={()=>{setRefresh(!refresh)}} disabled={LoadingX || LoadingY || loadingAllUsers} ><i className='fa-solid fa-arrows-rotate' ></i></button>
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
                allUsers ? allUsers.length : ""
              }
              </div>
              <div className="NOSD7I9999">
              {
                loadingAllUsers ? 
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
                AllImages ? AllImages.length : ""
              }
              </div>
              <div className="NOSD7I9999">
               <>
               {
                LoadingX ? 
                <div className='odosfvoufnosfovefsouv'>
                  <img src={LVG} alt="..." height={16} width={16} />&nbsp;&nbsp;Chargement...
                </div>                :
                <>
                {
                ChartDataImages ? 
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ChartDataImages}>
                    
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
              <i class="fa-solid fa-square-root-variable"></i>&nbsp;&nbsp;Total des fermes
            </div>
            <div className="rowCardX2">
              <div className="NOSD7IO9">
              {
                allPredictions ? allPredictions.length : ""
              }
              </div>
              <div className="NOSD7I9999">
              {
                LoadingY ? 
                <div className='odosfvoufnosfovefsouv'>
                  <img src={LVG} alt="..." height={16} width={16} />&nbsp;&nbsp;Chargement...
                </div>                :
                <>
                {
                  CHARTpredictions ? 
                  <ResponsiveContainer width="100%" height="100%">
                <LineChart data={CHARTpredictions}>
                     
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
        </div>
        <div className="rowD3ab">

        </div>
      </div>
      </>
      :
      <>
        //! BUT FIRST MAKE A REQUEST to get TYPE , do not base the dashboard only on the localStorage okay ? !
        //todo Next Scope : Dashboard for Admins and Staffs
        //! After Next Scope : Mka esure that the personal get All Farms and Serres of his administrator not of him like the way u did in Mobile 
      </>
    }

       
 

     
    </div>
  )
}

export default Dashboard;

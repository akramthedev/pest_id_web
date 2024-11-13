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
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';




const Dashboard = () => {

  const [showItResponse, setshowItResponse] = useState(false);
  const [isErrorResponse, setisErrorResponse] = useState(false);
  const [messageResponse, setmessageResponse] = useState(null);
  const [loadingAllUsers, setLoadingAllUsers] = useState(true);
  const [allUsers, setAllUsers] = useState(null);
  const [refresh, setRefresh] = useState(true);
  const [ChartData, setChartData] =useState(null);
  
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
  
        const userCountPerDay = allDates.reduce((acc, date) => {
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
                  userCount: 0
                });
              }
            }
          }
  
          // Push the current date's data to chartData
          chartData.push({
            date: dateString,
            userCount: userCountPerDay[dateString] || 0,
          });
  
          currentDate.setDate(currentDate.getDate() + 1);
        }
  
        setChartData(chartData);
  
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
  





  useEffect(()=>{
    fetch_data_allUsers();
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
     
     

       
 

      <div className="containerDash containerDashCustomized1">
        <div className="rowD1">
          <div className="caseD1 caseD1mod">
            <span>Tableau</span><span>&nbsp;de Board</span>
            {
                loadingAllUsers &&
                <>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src={LVG} alt="..." height={23} width={23} />
                </>
            }
          </div>
        </div>
        <div className="rowD2ab">
          <div className="cardX">
            <div className="rowCardX">
              Nombre d'utilisateurs
            </div>
            <div className="rowCardX2">
              <div className="NOSD7IO9">
              {
                allUsers ? allUsers.length : "--"
              }
              </div>
              <div className="NOSD7I9999">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="none" />
                    <XAxis 
                      dataKey="date" 
                      hide={true}   
                    />
                    <YAxis
                      hide={true}
                    />
                    <Tooltip />
                    <Line connectNulls={true}  type="monotone" dataKey="userCount" stroke="#8884d8" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="cardX">
            
          </div>
          <div className="cardX">
            
          </div>
        </div>
        <div className="rowD3ab">

        </div>
      </div>
    </div>
  )
}

export default Dashboard;

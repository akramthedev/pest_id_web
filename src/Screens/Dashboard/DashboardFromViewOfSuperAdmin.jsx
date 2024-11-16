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
import { useParams } from 'react-router-dom';
import { LineChart, Line,Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar, AreaChart } from 'recharts';
 

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', width : "200px" }}>
        <div style={{ color: 'black', width : "100%", display : "flex", alignItems : "center", justifyContent : "space-between" }}><span style={{ color : "#" ,fontWeight : "500", }} >Date :</span>{`${label}`}</div>
        <div style={{ color: '#da0404', width : "100%", display : "flex", alignItems : "center", justifyContent : "space-between" }}><span style={{ color : "#da0404" ,fontWeight : "500", }} >Mouches :</span> {` ${payload.find(p => p.dataKey === 'Mouches')?.value || 0}`}</div>
        <div style={{ color: '#5fa21b', width : "100%", display : "flex", alignItems : "center", justifyContent : "space-between" }}><span style={{ color : "#5fa21b" ,fontWeight : "500", }} >Tuta :</span> {` ${payload.find(p => p.dataKey === 'Tuta')?.value || 0}`}</div>
       </div>
    );
  }

  return null;
};




const DashboardFromViewOfSuperAdmin = () => {

    const params = useParams();
    const {IDUSERDASHBAORD,nameClient} = params;
    const [showItResponse, setshowItResponse] = useState(false);
    const [isErrorResponse, setisErrorResponse] = useState(false);
    const [messageResponse, setmessageResponse] = useState(null);
    const [refresh, setRefresh] = useState(true);
    const [showDateModal, setShowDateModal] = useState(false);
    const [defaultStartDate, setDefaultStartDate] = useState(null);
    const [defaultEndDate, setDefaultEndDate] = useState(null);
    const [customStartDate, setCustomStartDate] = useState(null);
    const [customEndDate, setCustomEndDate] = useState(null);
    const [dailySumsX, setDailySumsX] = useState({});
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

 

    const fetchFarms = async (IDX) => {
        try {
        setLoading1(true);
        setChartData(null);
        setData1(null);

        const token = localStorage.getItem('token');
 
        
        const response = await axios.get(`${ENDPOINT_API}farms/${parseInt(IDX)}`, {
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

 


    const fetch____data____second_chart = async (IDX) => {
        try {
        setLoading4(true);
        setChartData4(null);

        const userIdNum = parseInt(IDX);
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
    
            const dailySums = transformedData.reduce((acc, prediction) => {
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

            setDailySumsX(dailySums)

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
    
 

    const fetch_predictions_of_admin = async (IDX) => {
        try {
        setLoading2(true);
        setLoading3(true);
        setChartData2(null);
        setChartData3(null);
        setData2(null);
        setData3(null);
        const userIdNum = parseInt(IDX);
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
        if(IDUSERDASHBAORD){
          
            fetchFarms(IDUSERDASHBAORD);
            fetch_predictions_of_admin(IDUSERDASHBAORD);
            fetch____data____second_chart(IDUSERDASHBAORD);
        }
    
    }, [refresh, IDUSERDASHBAORD]);
    
     

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
 
         
         
            <div className="containerDash containerDashCustomized1">
              <div className="rowD1">
                <div className="caseD1 caseD1mod">
                  <span>Tableau</span><span>&nbsp;de Board&nbsp;&nbsp;:&nbsp;&nbsp;{nameClient && nameClient}</span>
                  {
                    loading1 || Loading2 || Loading3 ?
                      <>
                        <img style={{marginLeft : "1.3rem"}} src={LVG} alt="..." height={23} width={23} />
                      </>
                      :
                      <button className='isbvdussofbvsuofbvousf' onClick={()=>{setRefresh(!refresh)}} disabled={Loading2 || Loading3 || loading1} ><i className='fa-solid fa-arrows-rotate' ></i></button>
                  }
                </div>
              </div>
              <div className="rowD2ab">
              <div className="cardX">
                  <div className="rowCardX">
                    <i class="fa-solid fa-seedling"></i>&nbsp;&nbsp;Total de ses fermes
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
                    <div className=" NOSD7IO9NOSD7IO9">
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
                                  stroke="#da0404"
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
           

       
 

     
    </div>
  )
}

export default DashboardFromViewOfSuperAdmin;
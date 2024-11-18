import React, { useState } from 'react';
import './index.css'; 
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { ENDPOINT_API } from "../../endpoint";
import ErrorSuccess from '../../Components/ErrorSuccess';


const BookDemo = () => {
  const navigate = useNavigate();
  const maxDate = new Date('2025-12-31');
  const [selectedDate, setSelectedDate] = useState(null); 
  const [selectedTime, setSelectedTime] = useState(null);  
  const [fullName, setFullName] = useState("");
  const [identification, setidentification] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [loader, setloader] = useState(false);
  const [showItResponse, setshowItResponse] = useState(false);
  const [isErrorResponse, setisErrorResponse] = useState(false);
  const [messageResponse, setmessageResponse] = useState(null);
  const [isInputErors, setisInputErors] = useState(null);
  const [success, setsuccess] = useState(false);
  const [dateInFrensh, setdateInFrensh] = useState(null);
  const [showiT, setshowiT] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date()); 

  const toggleDateSelection = (date) => {
    const dateString = date.toDateString(); 
    setSelectedDate(selectedDate === dateString ? null : dateString);
    setSelectedTime(null); 
  };

  const isDateDisabled = (date) => {
    const today = new Date().setHours(0, 0, 0, 0); 
    const day = date.getDay(); 
  
    if (date.getMonth() === new Date().getMonth() && date < today) {
      return true;
    }
  
    return day === 0 || day === 6;
  };

  const generateCalendar = () => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
    // Vérifier si la date est au-delà de la date maximale
    if (endOfMonth > maxDate) {
      return []; // Ne pas afficher le mois si il dépasse la date maximale
    }
  
    const daysInMonth = [];
    let currentDay = startOfMonth;
  
    while (currentDay <= endOfMonth) {
      daysInMonth.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
  
    return daysInMonth;
  };
  const goToPreviousMonth = () => {
    const previousMonth = new Date(currentDate);
    previousMonth.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(previousMonth);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(currentDate.getMonth() + 1);
  
    // Vérifier si la date suivante dépasse la date maximale
    if (nextMonth <= maxDate) {
      setCurrentDate(nextMonth);
    } else {
      console.log("Max Date : 2025-12-31")
    }
  };

  const isPreviousMonthDisabled = () => {
    const today = new Date();
    return currentDate.getFullYear() === today.getFullYear() && currentDate.getMonth() === today.getMonth();
  };



  function generateToken(length = 15) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters[randomIndex];
    }
    return token;
  }



  const handleSubmit = async () => {
    if(selectedDate === null){
      if(!showItResponse){
        setisErrorResponse(true);
        setmessageResponse("Veuillez sélectionner une date.");
        setshowItResponse(true);
        setTimeout(()=>{          
          setshowItResponse(false);
        }, 4500);}
    }
    else if (email === '' || !/\S+@\S+\.\S+/.test(email)){
      setisInputErors(true);
      if(!showItResponse){
        setisErrorResponse(true);
        setmessageResponse("Veuillez entrer une adresse email valide.");
        setshowItResponse(true);
        setTimeout(()=>{          
          setshowItResponse(false);
        }, 4500);}
    }
    else{
      try{
        setloader(true);

        let selectedDateInFrench =  new Date(selectedDate).toLocaleDateString('fr-FR', {
          weekday: 'short',  
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });

        let identif = generateToken();
        setidentification(identif);

        const resp = await axios.post(`${ENDPOINT_API}book-demo`, {
          identification : identif,
          fullName : fullName, 
          mobile : mobile, 
          email : email, 
          date : selectedDateInFrench, 
          time : selectedTime 
        });
        setdateInFrensh(selectedDateInFrench);
   
        if(resp.status === 200){
          setsuccess(true);
          setTimeout(()=>{
            setshowiT(true);
          }, 800);
          if(!showItResponse){
            setisErrorResponse(false);
            setmessageResponse("Votre réservation a été enregistrée avec succès. Nous vous contacterons bientôt.");
            setshowItResponse(true);
            setTimeout(()=>{          
              setshowItResponse(false);
            }, 15000);
          }
        }
        else{
          if(!showItResponse){
            setisErrorResponse(true);
            setmessageResponse("Désolé, une erreur technique est survenue.");
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
          setmessageResponse("Désolé, une erreur technique est survenue.");
          setshowItResponse(true);
          setTimeout(()=>{          
            setshowItResponse(false);
          }, 4500);
        }
        console.log(e.message);
      } finally{
        setloader(false);
      }
    }
  };

   const generateAvailableHours = () => {
    const hours = [];
    const now = new Date();
    let startHour = 9;  
    let endHour = 18;  

    
    for (let hour = startHour; hour < endHour; hour++) {
      // Add both '00' and '30' minute options for each hour
      const timeString1 = `${hour < 10 ? '0' + hour : hour}:00`;   
      const timeString2 = `${hour < 10 ? '0' + hour : hour}:30`;  
      
      hours.push(timeString1, timeString2);  
    }
  

    return hours;
  };

  const handleTimeSelection = (time) => {
    setSelectedTime(time); // Set the selected time
  };

  return (
    <>
    <ErrorSuccess  
        isError={isErrorResponse}
        showIt={showItResponse}
        message={messageResponse}  
      />
    <div className="home">
      <div className="navHome">
        <div className="logo" onClick={() => { navigate("/"); }}>
          <span className="spanLogo1">PEST</span>
          <span className="spanLogo2">&nbsp;ID</span>
        </div>
        <div className="navCont">
          <button onClick={() => { navigate("/"); }} className="navContBtn">Acceuil</button>
          <button onClick={() => { navigate("/about"); }} className="navContBtn">À propos</button>
          <button onClick={() => { navigate("/contact"); }} className="navContBtn">Contact</button>
        </div>
        <div className="btnCont">
          <button onClick={() => { navigate("/login"); }} className="btnConexion">Connexion</button>
          <button onClick={() => { navigate("/become-member"); }} className="btnCréerCpt">Créer un compte</button>
        </div>
      </div>

      <div className="contHome contHome3976442968572">
        {
          success ? <h2><span>Informations</span> de la Réservation</h2>
          :
          <h2><span>Réserver</span> une Démo</h2>
        }
        <br /><br /><br />
        <div className="booking-form">
          
          <div className={success ? "noallInputs6" : "allInputs6"}>
            <div className="form-group">
              <label htmlFor="name">Nom et prénom</label>
              <input
                type="text"
                id="name"
                value={fullName}
                placeholder='Veuillez saisir votre nom et prénom...'
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                className={`${isInputErors ? 'input-error' : ''}`}
                placeholder='Veuillez saisir votre adresse email...'
                onChange={(e) => {
                    setEmail(e.target.value);
                    if(isInputErors){
                      setisInputErors(false);
                    }
                  }
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="mobile">Téléphone</label>
              <input
                type="text"
                id="mobile"
                placeholder='Veuillez saisir votre numéro de téléphone...'
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
          </div>

          {
            success && 
            <div className={showiT ? " pornhubZidenx pornhub pornhub2" : "nopornhub2"}>
              <div className="rowItEm">
                <span>ID : </span><span>{identification === '' ? "---" : identification}</span>
              </div>
              <div className="rowItEm">
                <span>Nom et prénom : </span><span>{fullName === '' ? "---" : fullName}</span>
              </div>
              <div className="rowItEm">
                <span>Adresse Email : </span><span>{email === "" ? "---" : email}</span>
              </div>
              <div className="rowItEm">
                <span>Numéro de téléphone : </span><span>{mobile === '' ? "---" : mobile}</span>
              </div>
              <div className="rowItEm">
                <span>Date choisie : </span><span>{dateInFrensh === null ? "---" : dateInFrensh}</span>
              </div>
              <div className="rowItEm">
                <span>Temps choisi : </span><span>{selectedTime === null ? "---" : selectedTime}</span>
              </div>
            </div>
          }

          <div className={success ? "nopornhub" : "pornhub"}>
            <div className="calendar-container">
              <div className="calendar-header">
                <button 
                  className={`zrshqfuoshdfuhqdfuohoqdf ${isPreviousMonthDisabled() && "shrufhsurhfuosehfohoqudf"}`}
                  onClick={goToPreviousMonth} 
                  disabled={isPreviousMonthDisabled()}  
                >
                  <i className='fa-solid fa-arrow-left'></i>
                </button>
                <h3>{currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}</h3>
                <button className='zrshqfuoshdfuhqdfuohoqdf' onClick={goToNextMonth}>
                  <i className='fa-solid fa-arrow-right'></i>
                </button>
              </div>

              <div className="calendar-grid">
                {generateCalendar().map((date) => {
                  const day = date.getDay(); 
                  const dateString = date.toDateString();
                  const isDisabled = isDateDisabled(date);

                  return (
                    <button
                      key={dateString}
                      onClick={() => !isDisabled && toggleDateSelection(date)}
                      disabled={isDisabled}
                      className={`calendar-day ${selectedDate === dateString ? 'selectedXXXX' : ''} 
                        ${day === 0 || day === 6 ? 'weekend' : ''}`}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="zushufhsqdfohqudfohuqohfouhqf">
              <button onClick={handleSubmit} disabled={!selectedDate} className={selectedDate ? "addColors" : "unClickables"}>
                {
                  loader ? "Envoi en cours..." : "Soumettre la réservation"
                }
              </button>
            </div>
          </div>

          {/* Time picker */}
          <div className={`pornHub1 ${selectedDate && "time-picker-container"} ${success && "pornHub1 NoShowIt"}`}>
            <h3>Choisissez une heure <span>(Heure du Maroc)</span></h3>
            <div className="time-options">
              {generateAvailableHours().map((time, index) => (
                <button
                  key={index}
                  onClick={() => handleTimeSelection(time)}
                  className={`time-option ${selectedTime === time ? 'selected' : ''}`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="footer">
        Une solution signée&nbsp;
        <a href="https://pcs-agri.com/" target='_blank'>PCS AGRI</a>&nbsp;© 2024
      </div>
    </div>
    </>

  );
};

export default BookDemo;

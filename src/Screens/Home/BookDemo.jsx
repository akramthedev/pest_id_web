import React, { useState } from 'react';
import './index.css'; 
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { ENDPOINT_API } from "../../endpoint";
import ErrorSuccess from '../../Components/ErrorSuccess';
import jsPDF from 'jspdf';
import 'jspdf-autotable';




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
  const [remote, setremote ] = useState(true); 

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
          time : selectedTime,
          isRemote : remote
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
    <div className="home home4">
       

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
              <label htmlFor="name">Nom et prénom : </label>
              <input
                type="text"
                id="name"
                value={fullName}
                placeholder='Veuillez saisir votre nom et prénom...'
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email : </label>
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
              <label htmlFor="mobile">Téléphone : </label>
              <input
                type="text"
                id="mobile"
                placeholder='Veuillez saisir votre numéro de téléphone...'
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>


            {
              !success && 
              <div className="form-group">
              <label htmlFor="mobile">Choix entre :</label>
              <div className="choicex">
                <button
                  onClick={()=>{
                    setremote(true);
                  }}
                  className={remote ===true && 'activateRemote'}
                >
                  À distance
                </button>
                <span>Ou bien</span>
                <button
                  onClick={()=>{
                    setremote(false);
                  }}
                  className={remote === false && 'activateRemote'}
                >
                  En présentiel
                </button>
              </div>
            </div>
          }


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
                <span>Type du rendez-vous : </span><span>{remote === true ? "À distance" : "En présentiel"}</span>
              </div>
              <div className="rowItEm">
                <span>Date choisie : </span><span>{selectedTime}&nbsp;&nbsp;/&nbsp;&nbsp;{dateInFrensh === null ? "---" : dateInFrensh}</span>
              </div>
              <div className="rowItEm">
              </div>
              <div className="rowItEm">
                <button 
                  onClick={()=>{
                    const doc = new jsPDF();

                    const logo = "data:image/jpeg;base64,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"; 
                    doc.addImage(logo, "PNG", 57, 10, 100, 30);

                    doc.setFontSize(18);
                    doc.setTextColor(51, 153, 0); 
                    doc.text("Informations de la Réservation", 14, 58);
                    const details = [
                      ["ID :", identification],
                      ["Nom et prénom :", fullName],
                      ["Adresse Email :", email],
                      ["Numéro de téléphone :", mobile],
                      ["Type du rendez-vous :", remote ? " À distance" : "En présentiel"],
                      ["Date choisie :", `${selectedTime} / ${selectedDate}`],
                      ["Localisation :", "Bureau A210, Cité d'inovation, Agadir"],
                    ];
                    details.forEach((detail, index) => {
                      doc.setFontSize(13);
                      doc.setTextColor(0, 0, 0);
                      doc.text(`${detail[0]} ${detail[1]}`, 14, 76 + index * 10);
                    });

                    doc.save("Reservation-démonstration-pcs-agri.pdf");
                  }}
                >
                  Imprimez les détails de votre réservation
                </button>
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
              <button onClick={handleSubmit} disabled={!selectedDate || !selectedTime} className={selectedDate && selectedTime ? "addColors" : "unClickables"}>
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

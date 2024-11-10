import React, { useState, useRef, useEffect } from 'react';
import "./index.css";
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Close the profile pop-up when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className='NavBar'>
      <div 
        className="logo"   
        onClick={() => navigate("/dashboard")}
      >
        <span className="spanLogo1">PEST</span>
        <span className="spanLogo2">&nbsp;ID</span>
      </div>
      <div className="options">
        <button className='eosvnowdc'>
          <button className='zjsdv' >
            <i class="fa-solid fa-earth-americas"></i>  
          </button>         
        </button>
        <button className='eosvnowdc'>
          <button className='zjsdv' >
            <i className="fa-solid fa-bell"></i>   
          </button>         
        </button>
        {
          isProfileOpen ? 
          <div key={797979} className="erovuson" onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <img 
                className='isfivs'
                src="https://res.cloudinary.com/dqprleeyt/image/upload/v1702216550/akram_tp6iku.jpg" 
                alt="VBFISBIS" 
              />
              <div className='ziuvfzuo'>
              {
                isProfileOpen ? <i className="fa-solid fa-angle-up"></i>
                :
                <i className="fa-solid fa-angle-down"></i>
              }
              </div>
            </div>
            :
            <div key={24924205} className="erovuson" onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <img 
                className='isfivs'
                src="https://res.cloudinary.com/dqprleeyt/image/upload/v1702216550/akram_tp6iku.jpg" 
                alt="VBFISBIS" 
              />
              <div className='ziuvfzuo'>
              {
                isProfileOpen ? <i className="fa-solid fa-angle-up"></i>
                :
                <i className="fa-solid fa-angle-down"></i>
              }
              </div>
            </div>
        }
       
          <div className={isProfileOpen ? "profile-popup showprofile-popup" : "profile-popup"} ref={profileRef}>
            <div className="profile-header">
              <img                
                  src="https://res.cloudinary.com/dqprleeyt/image/upload/v1702216550/akram_tp6iku.jpg" 
                  alt="Profile" 
                  className="profile-image" />
              <div className="profile-info">
                <div className="profile-name">Akram El Basri</div>
                <div className="profile-email">seasoned@gmail.com</div>
              </div>
            </div>
          

            
            <div 
              onClick={()=>{
                navigate("/activity");
              }}
              className="profile-item"> 
              <div className="uevuofz">
                <i class="fa-solid fa-book"></i>
              </div> 
              Journal d'activité
            </div>

            <div
              onClick={()=>{
                navigate("/broadcast");
              }}
              className="profile-item"> 
              <div className="uevuofz">
                <i class="fa-solid fa-bullhorn"></i>
              </div> 
              Station Broadcast
            </div>


 
            
            <div 
              onClick={()=>{
                navigate("/setting");
              }}
              className="profile-item"> 
              <div className="uevuofz">
                <i class="fa-solid fa-gear"></i>
              </div> 
              Paramètres
            </div>


            
 
            <div 
              className="profile-item"
              onClick={()=>{
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('type');
                navigate(0);
              }}
            > 
              <div className="uevuofz">
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
              </div> Déconnexion</div>
          </div>
       
      </div>
    </div>
  );
}

export default NavBar;

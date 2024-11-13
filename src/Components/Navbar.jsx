import React, { useState, useRef, useEffect } from 'react';
import "./index.css";
import { matchPath, useLocation, useNavigate } from "react-router-dom";

const NavBar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();


  const paths = [
    "/profile",
    "/activity",
    "/setting",
    "/broadcast",
    "/profile/:id",
    "/my-profile",
  ];

  const isProfilePage = paths.some((path) => matchPath({ path }, location.pathname));



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
        {
          isProfileOpen ? 
          <div key={797979} className="erovuson" onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <img 
                className='isfivs'
                src={localStorage.getItem("image") ? localStorage.getItem("image") : "https://res.cloudinary.com/dqprleeyt/image/upload/v1731358494/istockphoto-1397556857-612x612_muc78g.jpg"} 
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
                src={localStorage.getItem("image") ? localStorage.getItem("image") : "https://res.cloudinary.com/dqprleeyt/image/upload/v1731358494/istockphoto-1397556857-612x612_muc78g.jpg"} 
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
            <div 
              onClick={()=>{
                navigate("/my-profile");setIsProfileOpen(false);
              }}
              className="profile-header"
            >
              <img                
                  src={localStorage.getItem("image") ? localStorage.getItem("image") : "https://res.cloudinary.com/dqprleeyt/image/upload/v1731358494/istockphoto-1397556857-612x612_muc78g.jpg"} 
                  alt="Profile" 
                  className="profile-image" />
              <div className="profile-info">
                <div className="profile-name">{localStorage.getItem("fullName") ? localStorage.getItem("fullName") : "---"}</div>
                <div className="profile-email">{localStorage.getItem("email") ? localStorage.getItem("email") : "---"}</div>
              </div>
            </div>
          

            
            
            {isProfilePage && (
              <div 
                onClick={() => {
                  navigate("/dashboard");setIsProfileOpen(false);
                  
                }}
                className="profile-item"
              >
                <div className="uevuofz">
                  <i className="fa-solid fa-chart-line"></i>
                </div>
                Tableau de Board
              </div>
            )}




            <div 
              onClick={()=>{
                navigate("/activity");setIsProfileOpen(false);
              }}
              className="profile-item"> 
              <div className="uevuofz">
                <i class="fa-solid fa-book"></i>
              </div> 
              Journal d'activité
            </div>

            <div
              onClick={()=>{
                navigate("/broadcast");setIsProfileOpen(false);
              }}
              className="profile-item"> 
              <div className="uevuofz">
                <i class="fa-solid fa-bullhorn"></i>
              </div> 
              Station Broadcast
            </div>


 
            
            <div 
              onClick={()=>{
                navigate("/setting");setIsProfileOpen(false);
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
                localStorage.removeItem('mobile');
                localStorage.removeItem('image');
                localStorage.removeItem('fullName');
                localStorage.removeItem('email');
                localStorage.removeItem('created_at');

                localStorage.removeItem('company_email');
                localStorage.removeItem('company_mobile');
                localStorage.removeItem('company_name');
                localStorage.removeItem('adminId');

                localStorage.removeItem('isNoticeOfBroadCastSeen')
                localStorage.removeItem('is_np');
                localStorage.removeItem('is_an');
                localStorage.removeItem('is_maj');
                localStorage.removeItem('is_ja');

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

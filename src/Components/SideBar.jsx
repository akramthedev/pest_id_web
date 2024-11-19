import React, { useEffect, useState } from 'react'
import "./index.css";
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';



const SideBar = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const [TypeOfUser,setTypeOfUser] = useState(null);


  useEffect(()=>{
    const x = ()=>{
      const TOU = localStorage.getItem('type');
      setTypeOfUser(TOU);
    }
    x();
  },[]);
 

  return (
    <div 
      className='SideBar'
    >
    {
      TypeOfUser && 
      <>

        <div 
          className={`rowOI ${location.pathname === "/dashboard" ? 'rowOIactiavted' : ''}`}
          onClick={()=>{
            navigate("/dashboard");
          }}
        >
          <div  
            className={`icons ${location.pathname === "/dashboard" ? 'textActi' : ''}`}
          >
            <i class="fa-solid fa-chart-simple"></i>
          </div>
          <div  
            className={`textx ${location.pathname === "/dashboard" ? 'textActi' : ''}`}
          >
            Tableau de Board
          </div>
        </div>
  



        {
          TypeOfUser && 
          <>
          {
            TypeOfUser === "superadmin" && 
            <div 
              className={`rowOI ${location.pathname === "/demandes" ? 'rowOIactiavted' : ''}`} 
              onClick={()=>{
                navigate("/demandes");
              }}
            >
              <div  
                className={`icons ${location.pathname === "/demandes" ? 'textActi' : ''}`}
              >
              <i class="fa-solid fa-envelope"></i>
              </div>
              <div  
                className={`textx ${location.pathname === "/demandes" ? 'textActi' : ''}`}
              >
                Demandes d'Accès
              </div>
            </div>
          }
          </>
        }



{
          TypeOfUser && 
          <>
          {
            TypeOfUser === "superadmin" && 
            <div 
              className={`rowOI ${location.pathname === "/reservations" ? 'rowOIactiavted' : ''}`} 
              onClick={()=>{
                navigate("/reservations");
              }}
            >
              <div  
                className={`icons ${location.pathname === "/reservations" ? 'textActi' : ''}`}
              >
              <i class="fa-solid fa-envelope"></i>
              </div>
              <div  
                className={`textx ${location.pathname === "/reservations" ? 'textActi' : ''}`}
              >
                Réservations
              </div>
            </div>
          }
          </>
        }






        {
          TypeOfUser && 
          <>
          {
            TypeOfUser === "superadmin" && 
            <div 
              className={`rowOI ${location.pathname === "/clients" ? 'rowOIactiavted' : ''}`}
              onClick={()=>{
                navigate("/clients");
              }}
            >
              <div  
                className={`icons ${location.pathname === "/clients" ? 'textActi' : ''}`}
              >
                <i class="fa-solid fa-user-group"></i>
              </div>
              <div  
                className={`textx ${location.pathname === "/clients" ? 'textActi' : ''}`}
              >
                Mes Clients
              </div>
            </div>
          }
          </>
        }



        {
          TypeOfUser && 
          <>
            {
              TypeOfUser !== "staff" && 
              <div 
                className={`rowOI ${location.pathname === "/personnels" ? 'rowOIactiavted' : ''}`} 
                onClick={()=>{
                  navigate("/personnels");
                }}
              >
                <div  
                  className={`icons ${location.pathname === "/personnels" ? 'textActi' : ''}`}
                >
                  <i class="fa-solid fa-users"></i>
                </div>
                <div  
                  className={`textx ${location.pathname === "/personnels" ? 'textActi' : ''}`}
                >
                  Mes personnels
                </div>
              </div>
            }
          </>
        }


        

      



        {
          TypeOfUser && 
          <>
          {
            TypeOfUser !== "staff" && 
                <div 
                  className={`rowOI ${location.pathname === "/fermes" ? 'rowOIactiavted' : ''}`} 
                  onClick={()=>{
                    navigate("/fermes");
                  }}
                >
                  <div  
                    className={`icons ${location.pathname === "/fermes" ? 'textActi' : ''}`}
                  >
                    <i class="fa-solid fa-seedling"></i>
                  </div>
                  <div  
                    className={`textx ${location.pathname === "/fermes" ? 'textActi' : ''}`}
                  >
                    Mes Fermes
                  </div>
                </div>
          }
          </>
        }



        <div 
          className={`rowOI ${location.pathname === "/calculations" ? 'rowOIactiavted' : ''}`} 
          onClick={()=>{
            navigate("/calculations");
          }}
        >
          <div  
            className={`icons ${location.pathname === "/calculations" ? 'textActi' : ''}`}
          >
            <i class="fa-solid fa-square-root-variable"></i>
          </div>
          <div  
            className={`textx ${location.pathname === "/calculations" ? 'textActi' : ''}`}
          >
            Mes Calculs
          </div>
        </div>


      </>
    }
    </div>
  )
}

export default SideBar

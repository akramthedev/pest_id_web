import React, { useEffect, useState } from 'react'
import './index2.css'
import {useNavigate} from 'react-router-dom'



const PopUp = () => {


  const [isNoticeOfBroadCastSeen, setisNoticeOfBroadCastSeen] = useState(false);


  useEffect(()=>{
    const x = ()=>{
      setTimeout(()=>{
        const xyz = localStorage.getItem('isNoticeOfBroadCastSeen');
        if(xyz === "notseen"){
          setisNoticeOfBroadCastSeen(true);
        }
        else{
          setisNoticeOfBroadCastSeen(false);
        }
      }, 2000);
    }
    x();
  }, []);
  

  const navigate = useNavigate();


  return (
    <div className={!isNoticeOfBroadCastSeen ? "popUpkaka " : "popUpkaka showXuX"} >
      <div className="new">
        Nouveau Broadcast
      </div>
      <div className="newdesc">
        Un nouveau broadcast est disponible. Ouvrez-le pour voir les informations.
      </div>
      <div className="ouvrir">
        <button
          onClick={()=>{
            localStorage.setItem('isNoticeOfBroadCastSeen', "seen");
            navigate("/broadcast")
          }}
        >
          En savoir plus
        </button>
      </div>
    </div>
  )
}

export default PopUp;
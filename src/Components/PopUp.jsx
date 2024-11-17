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
      ✨&nbsp;Nouveau Message
      </div>
      <div className="newdesc">
        Vous avez un nouveau message. Cliquez pour en apprendre davantage.
      </div>
      <div className="ouvrir">
        <button
          onClick={()=>{
            localStorage.setItem('isNoticeOfBroadCastSeen', "seen");
            navigate("/broadcast")
          }}
        >
          Voir le message
        </button>
      </div>
    </div>
  )
}

export default PopUp;
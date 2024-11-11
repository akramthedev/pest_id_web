import React, { useEffect, useState} from 'react'
import "./index.css";
import NavBar from '../../Components/Navbar';
import axios from 'axios';
import formatDateForCreatedAt from '../../Helpers/formatCreatedAt';


const Profile = () => {

  const [fullName, setfullName] = useState(null);
  const [image, setimage] = useState(null);
  const [email, setemail] = useState(null);
  const [mobile, setmobile] = useState(null);
  const [created_at, setcreated_at] = useState(null);
  const [type, settype] = useState(null);
  const [EmailCompany, setEmailCompany] = useState(null);
  const [NameCompany, setNameCompany] = useState(null);
  const [MobileCompany, setMobileCompany] = useState(null);


  const [isModifiedInfosClicked, setisModifiedInfosClicked] = useState(false);
  const [isModifiedCompany, setisModifiedCompanyClicked] = useState(false);



  useEffect(()=>{

    const fetchInfosFromLocalStorage = ()=>{

      const x = localStorage.getItem("fullName") ? localStorage.getItem("fullName") : "---"  ;
      const y = localStorage.getItem("image") ? localStorage.getItem("image") : "---"  ;
      const z  = localStorage.getItem("email") ? localStorage.getItem("email") : "---"  ;
      const a = localStorage.getItem("mobile") ? localStorage.getItem("mobile") : "---"  ;
      const b = localStorage.getItem("created_at") ? localStorage.getItem("created_at") : "---"  ; 
      const pp = localStorage.getItem("type"); 

      settype(pp);
      setfullName(x);
      setimage(y);
      setemail(z);
      setmobile(a);
      setcreated_at(b);

      if(pp !== "staff"){
        setMobileCompany(localStorage.getItem("company_mobile") ? localStorage.getItem("company_mobile") : "---" );
        setNameCompany(localStorage.getItem("company_name") ? localStorage.getItem("company_name") : "---" );
        setEmailCompany(localStorage.getItem("company_email") ? localStorage.getItem("company_email") : "---" );
      }

    }
    fetchInfosFromLocalStorage();

  }, []);


  return (
    <>
      <NavBar /> 
      <div className='profile'>
        <div className="ofs">
          <span>Mon&nbsp;</span>profil
        </div>
        <div className="sfovwd">
          <div className="rowuzd">
            <div className="caseOno">
              <img 
                src={image && image !== "---" ? image : "https://res.cloudinary.com/dqprleeyt/image/upload/v1731358494/istockphoto-1397556857-612x612_muc78g.jpg" } 
                alt="" 
              />
            </div>
            <div className="caseDoso">
              <div className="zufsiqdvc">
                {fullName && fullName}
              </div>
              <div className="posdvo1">
                {email && email}
              </div>
              <div className="posdvo1">
                {mobile && mobile}
              </div>
              <div className="posdvo3">
                <span>Membre depuis le</span><span>{created_at && formatDateForCreatedAt(created_at)}</span>
              </div>
            </div>
          </div>
        {
          type !== "staff" && 
          <div className="ofs2">
            • Informations de ma propriété
          </div>
        }
        {
          type !== "staff" && 
          <div className="rowuzd2">
            <div className="itemX">
              <div className="posdvo4">
                Appelation
              </div>
              <div className="posdvo4">
              {
                NameCompany && NameCompany
              }
              </div>
            </div>
            <div className="itemX">
              <div className="posdvo4">
                Adresse email
              </div>
              <div className="posdvo4">
              {
                EmailCompany && EmailCompany
              }
              </div>
            </div>
            <div className="itemX">
              <div className="posdvo4">
                Numéro téléphone
              </div>
              <div className="posdvo4">
                {
                  MobileCompany && MobileCompany
                }
              </div>
            </div>
          </div>
        }
        {
          type !== "staff" ?
          <div className="ofs22">
            <button
              onClick={()=>{
                setisModifiedCompanyClicked(true);
              }}
            >
              Modifier ma propriété
            </button>
            <button
                          onClick={()=>{
                            setisModifiedInfosClicked(true);
                          }}
                        >
            
              Modifier mes informations
            </button>
          </div>
          :
          <div className="ofs22 ofs22ofs22">
            <button
                          onClick={()=>{
                            setisModifiedInfosClicked(true);
                          }}
                        >
            
              Modifier mes informations
            </button>
          </div>
        }
        </div>
      </div>
    </>
  )
}

export default Profile;
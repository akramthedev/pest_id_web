import React, { useEffect, useState} from 'react'
import "./index.css";
import NavBar from '../../Components/Navbar';
import axios from 'axios';
import formatDateForCreatedAt from '../../Helpers/formatCreatedAt';
import formatPhoneNumber from '../../Helpers/formatMobile';
import LVG from '../Dashboard/Loader.gif'
import { ENDPOINT_API } from "../../endpoint";
import PopUp from '../../Components/PopUp';
import ErrorSuccess from '../../Components/ErrorSuccess';



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
  const [loaderAnnuler, setloaderAnnuler] = useState(true);
  const [loaderConfirmer, setloaderConfirmer] = useState(null);
  const [isDataCompnayModified, setisDataCompnayModified] = useState(false);
  const [isDataPersonalModified, setisDataPersonalModified] = useState(false);
  const [isModifiedInfosClicked, setisModifiedInfosClicked] = useState(false);
 
 
  const [showItResponse, setshowItResponse] = useState(false);
  const [isErrorResponse, setisErrorResponse] = useState(false);
  const [messageResponse, setmessageResponse] = useState(null);

 

    const fetchInfosFromLocalStorage = ()=>{

      setisDataCompnayModified(false);
      setisModifiedInfosClicked(false);
      setisDataPersonalModified(false);
      setloaderAnnuler(true);

     
      let pp = localStorage.getItem("type");

      settype(pp);
      setfullName(localStorage.getItem("fullName") ? localStorage.getItem("fullName") : "---");
      setimage(localStorage.getItem("image") ? localStorage.getItem("image") : "---" );
      setemail(localStorage.getItem("email") ? localStorage.getItem("email") : "---");
      setmobile(localStorage.getItem("mobile") ? localStorage.getItem("mobile") : "---");
      setcreated_at(localStorage.getItem("created_at") ? localStorage.getItem("created_at") : "---");

      if(pp !== "staff"){
        setMobileCompany(localStorage.getItem("company_mobile") ? localStorage.getItem("company_mobile") : "---" );
        setNameCompany(localStorage.getItem("company_name") ? localStorage.getItem("company_name") : "---" );
        setEmailCompany(localStorage.getItem("company_email") ? localStorage.getItem("company_email") : "---" );
      }
      setloaderAnnuler(false);

    }



    const handleChangeData = async ()=>{
      
      if(isDataCompnayModified || isDataPersonalModified){

      
      if (email.length <= 4) {
        alert("Invalid email address");
        return;
      }
    
      else if(!fullName || fullName.length <= 3){
        alert("Invalid Full Name");
        return;        
      }
      setloaderConfirmer(true);
      
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      try{
        if(isDataPersonalModified === true){
          //change data user
          if(userId !== null && userId !== undefined){
            let dataPersonalModifying = {
              fullName : fullName, 
              email : email, 
              mobile : mobile, 
              image : image ? image : "https://res.cloudinary.com/dqprleeyt/image/upload/v1731407662/istockphoto-1397556857-612x612_1_vxnuqq.jpg", 
            }
            const resp = await axios.post(`${ENDPOINT_API}updateUserInfos/${parseInt(userId)}`, dataPersonalModifying, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            if(resp.status === 200){
              setisModifiedInfosClicked(false);
              localStorage.setItem('image', image ? image : "https://res.cloudinary.com/dqprleeyt/image/upload/v1731407662/istockphoto-1397556857-612x612_1_vxnuqq.jpg");
              localStorage.setItem('mobile', mobile ? mobile : "---");
              localStorage.setItem('fullName', fullName ? fullName : "---");
              localStorage.setItem('email', email ? email : "---");
              if(!showItResponse){
              setisErrorResponse(false);
              setmessageResponse("Votre profil a été modifié avec succès.");
              setshowItResponse(true);
              setTimeout(()=>{          
                setshowItResponse(false);
              }, 4500);
            }


            }
            else{
          
              if(!showItResponse){
              setisErrorResponse(true);
          
              setmessageResponse("Une erreur est survenue lors de la modification du profil.");
              setshowItResponse(true);
              setTimeout(()=>{          
                setshowItResponse(false);
              }, 4500);
            }
            }
          }
        }
        if(isDataCompnayModified === true){
          //change data admin
          const adminId = localStorage.getItem('adminId');
          if(adminId !== "---" && adminId !== null && adminId !== undefined){
            let dataCompanyModifying = {
              company_name : NameCompany,
              company_mobile : MobileCompany,
              company_email : EmailCompany,
            }
            const resp22 = await axios.patch(`${ENDPOINT_API}admin/${parseInt(adminId)}`, dataCompanyModifying, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            if(resp22.status === 200){
              setisModifiedInfosClicked(false);
              localStorage.setItem('company_mobile', MobileCompany ? MobileCompany : "---");
              localStorage.setItem('company_name', NameCompany ? NameCompany : "---");
              localStorage.setItem('company_email', EmailCompany ? EmailCompany : "---");
              if(!showItResponse){
              setisErrorResponse(false);
              setmessageResponse("Votre profil a été modifié avec succès.");
              setshowItResponse(true);
              setTimeout(()=>{          
                setshowItResponse(false);
              }, 4500);
            }
            }
            else{
               
            }
          }
        }
      }
      catch(e){
        
        if(!showItResponse){
        setisErrorResponse(true);
          
              setmessageResponse("Une erreur est survenue lors de la modification du profil.");
              setshowItResponse(true);
              setTimeout(()=>{          
                setshowItResponse(false);
              }, 4500);
            }
        console.log(e.message);
      }
      finally{
        setTimeout(()=>{
          setloaderConfirmer(false);
        }, 1000);
      }
      }
      else{
        setisModifiedInfosClicked(false);
      }
    }




  useEffect(()=>{
    fetchInfosFromLocalStorage();
  }, []);


  return (
    <>
      <NavBar /> 
      <PopUp/>
      <ErrorSuccess  
        isError={isErrorResponse}
        showIt={showItResponse}
        message={messageResponse}  
      />
      <div className={loaderConfirmer ? "popUp6666 showpopUp" : "popUp6666"}>
        <span style={{
          fontSize : '16px', 
          fontWeight : "500",
          display : "flex", 
          alignItems : "center", 
          justifyContent :"center"
        }}>
          <img src={LVG} alt="..." height={21} width={21} />
          &nbsp;&nbsp;Modification en cours...
        </span>
      </div>


      <div className='profile'> 
        <div className="ofs">
          <div><span>Mon&nbsp;</span><span>profil{isModifiedInfosClicked && <>&nbsp;&nbsp;/&nbsp;&nbsp;Modification</>}</span></div>
        {
          isModifiedInfosClicked ? 
          <div className='uoezsrqdvc'>
            <button
              className={loaderAnnuler || loaderConfirmer ? "disabled oefbbofoufzuofzs" : "oefbbofoufzuofzs"}
              disabled={loaderAnnuler || loaderConfirmer}
              onClick={()=>{
                handleChangeData();
              }}
            >
              <div className="tooltip">Sauvegarder les modifications</div>
              <i className='fa-solid fa-check' ></i>
            </button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <button
              disabled={loaderAnnuler || loaderConfirmer}
              className={loaderAnnuler || loaderConfirmer ? "disabled oefbbofoufzuofzs" : "oefbbofoufzuofzs"}
              onClick={()=>{
                fetchInfosFromLocalStorage();
              }}
            >
              <div className="tooltip">Annuler les modifications</div>
              <i className='fa-solid fa-xmark' ></i>
            </button>
          </div>
          :
          <button
            disabled={loaderAnnuler || loaderConfirmer}
            className={loaderAnnuler || loaderConfirmer ? "disabled oefbbofoufzuofzs" : "oefbbofoufzuofzs"}
            onClick={()=>{
              setisModifiedInfosClicked(true);
            }}
          >
            <div className="tooltip">Modifier mes informations</div>
            <i className='fa-solid fa-pen' ></i>
          </button>
        }
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
            {
              isModifiedInfosClicked ? 
              <div className="zufsiqdvcmodif">
                <input 
                spellCheck="false"
                  type="text" 
                  value={fullName}
                  onChange={(e)=>{
                    setisDataPersonalModified(true);
                    setfullName(e.target.value)
                  }}
                  maxLength={30}  
                />
              </div>
              :
              <div className="zufsiqdvc">
                {fullName && fullName}
              </div>
               
            }
            {
              isModifiedInfosClicked ? 
              <div className="zufsiqdvcmodif2">
                <input 
                spellCheck="false"
                  type="text" 
                  value={email}
                  onChange={(e)=>{
                    setisDataPersonalModified(true);
                    setemail(e.target.value)
                  }}
                  maxLength={40}  
                />
              </div>
              :
              <div className="posdvo1 zsfiowdvzsfiowdv">
                <i className='fa-solid fa-envelope'></i>&nbsp;&nbsp;{email && email}
              </div>
               
            }
            {
              isModifiedInfosClicked ? 
              <div className="zufsiqdvcmodif2">
                <input 
                spellCheck="false"
                  type="text" 
                  value={mobile}
                  onChange={(e)=>{
                    setisDataPersonalModified(true);
                    setmobile(e.target.value)
                  }}
                  maxLength={15}  
                />
              </div>
              :
              <div className="posdvo1 zsfiowdvzsfiowdv">
                <i className='fa-solid fa-phone'></i>&nbsp;&nbsp;{mobile && formatPhoneNumber(mobile)}
              </div>
               
            }
              <div className="posdvo3 zsfiowdvzsfiowdv">
                <span><i className='fa-solid fa-share'></i>&nbsp;&nbsp;Inscrit le {created_at && formatDateForCreatedAt(created_at)}</span>
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
                isModifiedInfosClicked ? 
                <div className="zufsiqdvcmodif3">
                  <input 
                  spellCheck="false"
                    type="text" 
                    value={NameCompany}
                    onChange={(e)=>{
                      setisDataCompnayModified(true);
                      setNameCompany(e.target.value)
                    }}
                    maxLength={40}  
                  />
                </div>
                :
                <div className="posdvo4">
                  {NameCompany && NameCompany}
                </div>
                
              }
              </div>
            </div>
            <div className="itemX">
              <div className="posdvo4">
                Adresse email
              </div>
              <div className="posdvo4">
              {
                isModifiedInfosClicked ? 
                <div className="zufsiqdvcmodif3">
                  <input 
                  spellCheck="false"
                    type="text" 
                    value={EmailCompany}
                    onChange={(e)=>{
                      setisDataCompnayModified(true);
                      setEmailCompany(e.target.value)
                    }}
                    maxLength={40}  
                  />
                </div>
                :
                <div className="posdvo4">
                  {EmailCompany && EmailCompany}
                </div>
                
              }
              </div>
            </div>
            <div className="itemX">
              <div className="posdvo4">
                Numéro téléphone
              </div>
              <div className="posdvo4">
                {
                  isModifiedInfosClicked ? 
                  <div className="zufsiqdvcmodif3">
                    <input 
                    spellCheck='false'
                      type="text" 
                      value={MobileCompany}
                      onChange={(e)=>{
                        setisDataCompnayModified(true);
                        setMobileCompany(e.target.value)
                      }}
                      maxLength={15}  
                    />
                  </div>
                  :
                  <div className="posdvo4">
                    {MobileCompany && formatPhoneNumber(MobileCompany)}
                  </div>
                  
                }
              </div>
            </div>
          </div>
        }
        </div>
      </div>
    </>
  )
}

export default Profile;
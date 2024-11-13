import React, { useState, useEffect } from 'react';
import "./index.css";
import NavBar from '../../Components/Navbar';
import SideBar from '../../Components/SideBar';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import Select from 'react-select';
import axios from 'axios'
import { ENDPOINT_API } from "../../endpoint";
import LVG from './Loader.gif'
import formatDateForCreatedAt from '../../Helpers/formatCreatedAt';
import PopUp from '../../Components/PopUp';
import { useNavigate } from 'react-router-dom';




const actionTemplate = (params, setAllUsers, setRefresh, refresh, seteditClicked, editClicked, setUserToEdit, userToEdit, setshowClicked, showClicked ,setisDeletedClicked, setparamClicked,  setRefreshStaff, RefreshStaff,setLoaderPermission, loaderOfPermission) => {

  
  const handleEdit = () => {
    console.log('Edit:', params.row);
    setUserToEdit(params.row);
    seteditClicked(!editClicked);
  };

  const handleChangePermission = async () => {
    setLoaderPermission(true);
    const token = localStorage.getItem('token');
    let access;
      try{  


        console.warn(params.row)

        if(params.row.permission === "Autorisé"){
           access = "canAccess"; 
           console.log("We restrict him");
        }
        else if(params.row.permission === "Restreint"){
           access = "canNotAccess"; 
           console.log("We Give him Access");
        } 
        const resp = await axios.get(`${ENDPOINT_API}updateUserRestriction/${parseInt(params.row.id)}/${access}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if(resp.status === 200){

          setAllUsers((prevPersonnels) =>
            prevPersonnels.map((person) =>
              person.id === params.id
                ? { ...person, permission : access === "canNotAccess" ? "Autorisé" : "Restreint"}
                : person
            )
          );
          //setRefresh(!refresh);
          setLoaderPermission(false);
        }
        else{
          setLoaderPermission(false);
        }

      }
      catch(e){
        console.log(e.message);
        setLoaderPermission(false);
      }
      setLoaderPermission(false);

  };

  
  const handleView = async () => {
    console.log('Show:', params.row);
    setUserToEdit(params.row);
    setRefreshStaff(!RefreshStaff);
    setshowClicked(true);
  };


  const handleDelete = ()=>{
    setparamClicked(params);
    setisDeletedClicked(true);
  }

  return (
    <div className='uefuvzou'>
      <button className='uoersf'   onClick={handleView}  >
        <i class="fa-solid fa-eye"></i>
      </button>
      <button disabled={loaderOfPermission} className='uoersf'   onClick={handleChangePermission}  >
      {
        params && 
        <>
        {
          params.row.permission === "Restreint" ? 
          <i class="fa-solid fa-lock"></i>
          :
          <i class="fa-solid fa-unlock"></i>
        }
        </>
      }
      </button>
      <button className='uoersf'   onClick={handleEdit}  >
      <i class="fa-solid fa-pencil"></i>
      </button>
      <button    className='uoersf'  onClick={handleDelete}  >
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  );
};


const Clients = () => {

  const [allUsers, setAllUsers] = useState([]);
  const [loadingAllUsers, setLoadingAllUsers] = useState(true);
  const isNoticeOfBroadCastSeen = localStorage.getItem('isNoticeOfBroadCastSeen');
  const navigate = useNavigate();
  const [fullname,setFullname] = useState("");
  const [email,setEmail] = useState("");
  const [mobile,setMobile] = useState("");
  const [password,setPassword] = useState("");

  const [addClicked, setaddClicked] = useState(false);
  const [editClicked, seteditClicked] = useState(false);
  const [showClicked,setshowClicked] = useState(false);
  const [loadinGEdit, setLoadinGEdit] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [loadingCreateUser, setLoadingCreateUser] = useState(false);
  const [refresh,setRefresh] = useState(false);
  const [loadingDelete,setLoadingDelete] = useState(false);
  const [isDeletedClicked,setisDeletedClicked] = useState(false);
  const [paramClicked,setparamClicked] = useState(null);
  const [loadingAllPersonnels, setloadingAllPersonnels] = useState(false);
  const [RefreshStaff, setRefreshStaff] = useState(false);
  const [AlllHisStaffs, setAlllHisStaffs] = useState(null);
  const [InfosOfHisProperty, setInfosOfHisProperty] = useState(null);
  const [LoaderOfPropertyInfos, setLoaderOfPropertyInfos] = useState(false);
  const [loaderOfPermission, setLoaderPermission] = useState(false);

  

  
  const fetch_data_allUsers = async () => {
    try {
      setLoadingAllUsers(true);
      const userId = localStorage.getItem('userId');
      const userIdNum = parseInt(userId);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${ENDPOINT_API}users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200 ) {
        let i = 0;
        const transformedData = response.data.users
          .filter(user => user.id !== userIdNum && user.type === "admin" &&  user.isEmailVerified === 1)
          .map(user => {
            i++; 
            let createdAt = formatDateForCreatedAt(user.created_at);
            return {
              idInc: i,
              id: user.id,
              fullName: user.fullName ? user.fullName : "---",
              password: user.password ? user.password : "---",
              type: user.type ? user.type : "---",
              permission: user.canAccess === 1 ? "Autorisé" : "Restreint",
              idUser: user.id ? user.id : "---",
              image: user.image ? user.image : "---",
              email: user.email ? user.email : "---",
              mobile: user.mobile ? user.mobile : "---",
              created_at: user.created_at ? createdAt : "---",
            };
          });
        setAllUsers(transformedData);

      }
      else{
        setAllUsers([]);
      }
  
    } catch (error) {
      setAllUsers([]);
      console.error('Erreur:', error.message);
    } finally {
      setLoadingAllUsers(false);
    }
  };
  
 
  


  useEffect(() => {
    fetch_data_allUsers();
  }, [refresh]);

 



 


    const handle_Update_Client = async(XXX)=>{
      if(XXX.idUser === "---" || XXX.idUser  === null || XXX.idUser  === undefined){
        alert("Oops, une erreur s'est produite ! ");
        return;
      }
      else{


        let emailX = XXX.email.toString();
        let mobileX = XXX.mobile.toString();
        let fullNameX = XXX.fullName.toString();

        try{
          if(emailX.length <= 1){
            alert("Invalid Email");
            return;
          } 
          else if(mobileX.length <= 4){
            alert("Invalid Mobile");
            return;
          } 
          else if(fullNameX.length <= 1){
            alert("Invalid fullname");
            return;
          }
          setLoadinGEdit(true);
          const token = localStorage.getItem('token');
          let data = {
            fullName : XXX.fullName, 
            email : XXX.email, 
            mobile : XXX.mobile, 
            image : XXX.image, 
            type : XXX.type
          }
          
          const resp = await axios.post(`${ENDPOINT_API}updateUserInfos/${parseInt(XXX.idUser)}`, data, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if(resp.status === 200){
            seteditClicked(false);
            setAllUsers((prevPersonnels) =>
              prevPersonnels.map((person) =>
                person.id === XXX.id
                  ? { ...person, email: XXX.email ? XXX.email : "---", mobile: XXX.mobile ? XXX.mobile : "---", fullName: XXX.fullName ? XXX.fullName : "---" }
                  : person
              )
            );
            setUserToEdit(null);
          }
          else{
            seteditClicked(false);
            setUserToEdit(null);
            alert('Oops, something went wrong !');
          }

        }
        catch(e){
          console.log(e.message);
          alert('Oops, something went wrong !');
        } finally{
          setLoadinGEdit(false);
        }

      }
    }

    

  const handleCreateNewClient = async ()=> {
    if(email.length <= 1){
      alert("Invalid Email");
      return;
    } 
    else if(password.length <= 4){
      alert("Invalid password");
      return;
    } 
    else if(fullname.length <= 1){
      alert("Invalid fullname");
      return;
    }   
    else{
      try{  
        setLoadingCreateUser(true);

        const resp0 = await axios.post(`${ENDPOINT_API}register2`,{
          fullName : fullname, 
          email : email, 
          password : password, 
          mobile : mobile, 
        });
        if(resp0.status === 201){
          setLoadingCreateUser(false);
          fetch_data_allUsers();
          setFullname('');
          setEmail("");
          setPassword('');
          setMobile('');
          setaddClicked(false);
        }
        else{
          setLoadingCreateUser(false);
          alert('X - Error while creating a new staff.');
        }          
      }
      catch(e){
        setLoadingCreateUser(false);
        alert('Oops, somethign went wrong ! ');
        console.log(e.message);
      } 
    }
  }
 




  const handleDeleteAdministrator = async () => {
    setisDeletedClicked(false);
    setLoadingDelete(true);
    let staffsUsers = [];
    if(!paramClicked){
      return;
    }
    try{

      const token = localStorage.getItem('token');

      const resp0 = await axios.get(`${ENDPOINT_API}getAdminIdFromUserId/${parseInt(paramClicked.row.id)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if(resp0.status === 200){
        const idAdmin = resp0.data.id;
        const resp00 = await axios.get(`${ENDPOINT_API}staffs/${idAdmin}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }); 

        if(resp00.status === 200){
          staffsUsers = resp00.data;
           
        }
      }

      const resp = await axios.delete(`${ENDPOINT_API}deleteUserWhoIsAdmin/${parseInt(paramClicked.row.id)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if(resp.status === 200){
        if (staffsUsers.length !== 0) {
          for (const staff of staffsUsers) {
            try {
              await axios.delete(`${ENDPOINT_API}deleteUserStaffNotAdmin/${staff.user_id}`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
            } catch (error) {
              console.log('Error deleting user:', error);
            }
          }
        }
        setLoadingDelete(false);
        setAllUsers(prevallUsers => 
          prevallUsers.filter(item => item.id !== paramClicked.row.id)
        );
      }
      else{
        alert('Not deleted');
        setLoadingDelete(false);
      }
      

    }
    catch(e){
      setLoadingDelete(false);
      alert('Not deleted');
      console.log(e.message);
    }
  };







   
  const getAllStaffs = async()=>{
    setloadingAllPersonnels(true);
    if(userToEdit){
      try{
        setAlllHisStaffs(null);
        setInfosOfHisProperty(null);
        const userIdNum = parseInt(userToEdit.idUser);
        const token = localStorage.getItem('token');
        
        const response = await axios.get(`${ENDPOINT_API}staffsByUserId/${userIdNum}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if(response.status === 200){
       
          const transformedData = response.data.map(staff => {
           
            let createdAt = formatDateForCreatedAt(staff.created_at);
            return {
              idInc: staff.user_id,
              id: staff.id,
              fullName: staff.user ? staff.user.fullName : "---",
              password: staff.user ? staff.user.password : "---",
              type: staff.user ? staff.user.type : "---",
              idUser: staff.user ? staff.user.id : "---",
              permission: staff.user.canAccess === 1 ? "yes" : "no",
              image: staff.user ? staff.user.image : "---",
              email: staff.user ? staff.user.email : "---",
              mobile: staff.user ? staff.user.mobile : "---",
              created_at: staff.created_at ? createdAt : "---",
            };
          });
          
          setAlllHisStaffs(transformedData)
        }
        else{
          setAlllHisStaffs([]);
        }
      }
      catch(e){
        console.log(e.message);
        setAlllHisStaffs([]);
      } finally{
        setloadingAllPersonnels(false);
      }
    }
  }


  const getInfosOfHisProperty = async()=>{
    setLoaderOfPropertyInfos(true);
    if(userToEdit){
      try{
        setInfosOfHisProperty(null);
        const userIdNum = parseInt(userToEdit.idUser);
        const token = localStorage.getItem('token');
        
        const response = await axios.get(`${ENDPOINT_API}getadmin/${userIdNum}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if(response.status === 200){
          console.log(response.data)
          setInfosOfHisProperty(response.data);
        }
        else{
          setInfosOfHisProperty({
          });
        }
      }
      catch(e){
        console.log(e.message);
        setInfosOfHisProperty({

        });
      } finally{
        setLoaderOfPropertyInfos(false);
      }
    }
  }




useEffect(()=>{
  getAllStaffs();
  getInfosOfHisProperty();
},[RefreshStaff]);




  const columns = [
    { 
      field: 'id', 
      headerName: 'idReal', 
      width: 130, 
      headerAlign: 'center', 
      align: 'center',
      hide: true  
    },
    { 
      field: 'idInc', 
      headerName: 'ID', 
      width: 100, 
      headerAlign: 'center', 
      align: 'center' 
    },
    { 
      field: 'fullName', 
      headerName: 'Nom et prénom', 
      minWidth: 250, 
      headerAlign: 'center', 
      align: 'center',
      flex: 1 // Allow the column to stretch
    },
    { 
      field: 'password', 
      headerName: 'Password', 
      minWidth: 0, 
      headerAlign: 'center', 
      align: 'center',
      flex: 1 // Allow the column to stretch
    },
    {
      field : 'permission', 
      headerName: "Permission d'accès", 
      minWidth: 160, 
      headerAlign: 'center', 
      align: 'center',
      flex: 1,
      renderCell: (params) => {
        const isAuthorized = params.value === 'Autorisé';
        return (
          <div
             
          >
            <span
              style={{
                backgroundColor: isAuthorized ? '#e0ffc1' : '#ffe1e1',
                color : isAuthorized ? '#477a14' : '#c90000',
                padding : "0.3rem 1rem", 
                borderRadius : "3rem", 
                fontWeight : "500"
              }}
            >
              {params.value}
            </span>
          </div>
        );
      },
    },
    { 
      field: 'email', 
      headerName: 'Adresse Email', 
      minWidth: 250, 
      headerAlign: 'center', 
      align: 'center',
      flex: 1  
    },
    { 
      field: 'mobile', 
      headerName: 'Téléphone', 
      minWidth: 202, 
      headerAlign: 'center', 
      align: 'center',
      flex: 1 // Allow the column to stretch
    },
    { 
      field: 'created_at', 
      headerName: 'Date création', 
      width: 200, 
      headerAlign: 'center', 
      align: 'center',
      flex: 1 // Allow the column to stretch
    },
    { 
      field: 'actions', 
      renderCell: (params) => actionTemplate(params, setAllUsers, setRefresh, refresh, seteditClicked, editClicked, setUserToEdit, userToEdit, setshowClicked, showClicked,setisDeletedClicked, setparamClicked, setRefreshStaff,RefreshStaff,setLoaderPermission,loaderOfPermission), 
      headerName: 'Actions', 
      minWidth: 300, 
      headerAlign: 'center', 
      align: 'center',
      flex: 1 // Allow the column to stretch
    }
  ];
  
    
    



    

  return (
    <div className='Dashboard'>
      <NavBar /> 
      <SideBar />
      <PopUp/>

      
      <div className={isDeletedClicked ? "popUp  showpopUp" : "popUp "}>
        <div className="contPopUp popUp1 popUp1popUp1popUp12  popUp1popUp1popUp12345">
          <div className="caseD11">
            <span className='svowdjc'><i class="fa-solid fa-triangle-exclamation fa-triangle-exclamation2"></i>&nbsp;&nbsp;Confirmer&nbsp;</span><span className='svowdjc'>&nbsp;la suppression</span>
          </div>
          <div className="uzuovsououzv">
            &nbsp;&nbsp;La suppression de cet utilisateur est irréversible et entraînera la perte définitive de ses données, notamment ses personnels, ses prédictions et ses fermes !
          </div>
          <div className="rowInp rowInpModified">
              <button 
                className='jofzvno' 
                disabled={loadingDelete} 
                onClick={()=>{
                  setisDeletedClicked(false);
                  setparamClicked(null);
                }} 
              >
                Annuler
              </button>
              <button 
                disabled={loadingDelete}
                onClick={()=>{
                  handleDeleteAdministrator();
                }}
                className={loadingDelete ? "efvofvz22 efvofvz2" : "efvofvz22"}
              >
              {
                loadingDelete ? "Traitement en cours..."
                :
                "Oui, je confirme"
              }
              </button>
          </div>
        </div>
      </div>

      <div className={loadingDelete ? "popUp6666 showpopUp" : "popUp6666"}>
        <span style={{
          fontSize : '16px', 
          fontWeight : "500",
          display : "flex", 
          alignItems : "center", 
          justifyContent :"center"
        }}>
          <img src={LVG} alt="..." height={21} width={21} />
          &nbsp;&nbsp;Suppression en cours...
        </span>
      </div>


      {/*   edit Personnel    */}

        <div className={editClicked ? "popUp po showpopUp" : "popUp po"}>
          <div className="contPopUp popUp1 popUp77777">
            <div className="caseD11">
              <span>Modifier&nbsp;le</span><span>&nbsp;client</span>
            </div>
            {
            userToEdit !== null && 
              <>
                <div className="rowInp">
                  <label>Nom et prénom</label>
                  <input 
                    onChange={(e)=>{
                      setUserToEdit({
                        ...userToEdit, 
                        fullName : e.target.value
                      })
                    }}
                    type="text"
                    value={userToEdit.fullName}
                    className='idplaque' 
                    placeholder="Veuillez saisir le nouveau nom et prénom..."
                  />
                </div>
                <div className="rowInp">
                  <label>Adresse Email</label>
                  <input 
                    onChange={(e)=>{
                      setUserToEdit({
                        ...userToEdit, 
                        email : e.target.value
                      })
                    }}
                    type="text"
                    value={userToEdit.email}
                    className='idplaque' 
                    placeholder="Veuillez saisir la nouvelle adresse email..."
                  />
                </div>
                <div className="rowInp">
                  <label>Téléphone</label>
                  <input 
                    onChange={(e)=>{
                      setUserToEdit({
                        ...userToEdit, 
                        mobile : e.target.value
                      })
                    }}
                    type="text"
                    value={userToEdit.mobile}
                    className='idplaque' 
                    placeholder="Veuillez saisir le nouveau numéro de téléphone..."
                  />
                </div>
                <div className="rowInp">
                  <label>Mot de passe</label>
                  <button
                    onClick={()=>{
                      if(userToEdit){
                        navigate(`/password-configuration/${userToEdit.idUser}/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjM0NTY3ODkwLCJ1c2VyX25hbWUiOiJKb2huIERvZSIsImV4cCI6MTY1Mzk0MjAwMH0.YXZhdGVnaW9uZW5vZGVibG9nYXMak8ab8ac890moplaimfok6668/${userToEdit.fullName}`);
                        seteditClicked(false);
                        setUserToEdit(null);
                      }
                    }}
                    className='uosruofdvc'
                  >
                    Modifier le mot de passe
                  </button>
                </div>
              </>
            }
            {
              userToEdit && userToEdit.idUser &&
              <div className="rowInp rowInpModified">
              <button 
                className='jofzvno' 
                disabled={loadinGEdit} 
                onClick={()=>{
                  seteditClicked(false);
                  setUserToEdit(null);
                }} 
              >
                Annuler
              </button>
              <button 
                disabled={loadinGEdit}
                onClick={()=>{
                  handle_Update_Client(userToEdit);
                }}
                className={loadinGEdit ? "efvofvz efvofvz2" : "efvofvz"}
              >
              {
                loadinGEdit ? "Sauvegarde en cours..."
                :
                "Sauvegarder les modifications"
              }
              </button>
            </div>
            }
          </div>
        </div>
      




        {/*   show Personnel    */}
              
        <div className={showClicked ? "popUp  showpopUp" : "popUp "}>
          <div className="contPopUp popUp1 popUp172853">
              <div className='uofsdvsfnov'>
                <div className="caseD11">
                  <span>Ses Informations&nbsp;</span><span>&nbsp;</span>
                </div>
                {
                userToEdit !== null && 
                  <>
                    <div className="rowInp rowInp1 rowInp1rowInp1 rowInp1rowInp1111">
                      <img 
                        src={userToEdit.image? userToEdit.image : "https://res.cloudinary.com/dqprleeyt/image/upload/v1731358494/istockphoto-1397556857-612x612_muc78g.jpg"}
                        alt="" 
                        style={{
                          borderRadius : "50%", 
                          height : '80px', 
                          width : '80px',
                          objectFit : "cover"
                        }}
                      />
                    </div>
                    <div className="rowInp rowInp1 rowInp1rowInp1">
                      <label>
                        Nom et prénom : 
                      </label>
                      <label>
                        {
                          userToEdit.fullName ? userToEdit.fullName  : "---"
                        }
                      </label>
                    </div>
                    <div className="rowInp rowInp1 rowInp1rowInp1">
                      <label>
                        Adresse Email : 
                      </label>
                      <label>
                        {
                          userToEdit.email ? userToEdit.email : "---"
                        }
                      </label>
                    </div>
                    <div className="rowInp rowInp1 rowInp1rowInp1">
                      <label>
                        Téléphone : 
                      </label>
                      <label>
                        {
                          userToEdit.mobile ?  userToEdit.mobile : "---"
                        }
                      </label>
                    </div>
                    <div className="rowInp rowInp1 rowInp1rowInp1">
                      <label>
                        Date de création : 
                      </label>
                      <label>
                        {
                          userToEdit.created_at
                        }
                      </label>
                    </div>

                    {
                      LoaderOfPropertyInfos ?
                      <div 
                            style={{
                              height : "123px", 
                              width : "100%", 
                              display : "flex", 
                              alignItems : "center", 
                              justifyContent : "center"
                            }}
                      >
                        Chargement...&nbsp;&nbsp;<img src={LVG} alt="..." height={20} width={20} />
                      </div>
                      :
                      <>
                      {
                        InfosOfHisProperty !== null && 
                        <>
                          <div 
                            style={{
                              height : "1px", 
                              width  :"93%",
                              marginLeft : "3.5%",
                              background : "#eee", 
                              marginBottom : "2rem" 
                            }}
                          />
                          <div className="rowInp rowInp1 rowInp1rowInp1">
                            <label>
                              Appelation de la propriété : 
                            </label>
                            <label>
                              {
                                InfosOfHisProperty.company_name ? InfosOfHisProperty.company_name : "---"
                              }
                            </label>
                          </div>
                          <div className="rowInp rowInp1 rowInp1rowInp1">
                            <label>
                              Email de la propriété : 
                            </label>
                            <label>
                              {
                                InfosOfHisProperty.company_email ? InfosOfHisProperty.company_email : "---"
                              }
                            </label>
                          </div>
                          <div className="rowInp rowInp1 rowInp1rowInp1">
                            <label>
                              Téléphone de la propriété : 
                            </label>
                            <label>
                              {
                                InfosOfHisProperty.company_mobile ? InfosOfHisProperty.company_mobile : "---"
                              }
                            </label>
                          </div>
                        </>
                      }
                      </>
                    }
                    
                    
                  </>
                }
                <div className="rowInp rowInpModified rowInpModified2 osfovoufsouvs">
                  <button className='jofzvno' onClick={()=>{setshowClicked(false);setUserToEdit(null);}} >Fermer</button>
                  <button 
                    onClick={()=>{
                      setshowClicked(false);
                      seteditClicked(true);
                    }}
                    className={loadinGEdit ? "efvofvz efvofvz2" : "efvofvz"}
                  >
                    Modifier le client
                  </button>
                </div>
            </div>
            <div className="hrVertical" />
            <div className="uofsdvsfnov">
                <div className="caseD11">
                  <span>Ses Personnels</span>
                </div>
                {
                  loadingAllPersonnels ? 
                  <div className="uozsoufvuosf" style={{
                    display : "flex",
                    alignItems : "center", 
                    justifyContent : "center", 
                    paddingTop : "6rem", 
                    color : "gray", 
                    fontWeight : "400", 
                    fontSize : "14px"
                  }}>
                    Chargement...&nbsp;&nbsp;<img src={LVG} alt="..." height={20} width={20} />
                  </div>
                  :
                  <>
                  {
                    AlllHisStaffs && 
                    <>
                    {
                      AlllHisStaffs.length === 0 ? 
                      <div className="uozsoufvuosf" style={{
                        display : "flex",
                        alignItems : "center", 
                        justifyContent : "center", 
                        paddingTop : "6rem", 
                        color : "gray", 
                        fontWeight : "400", 
                        fontSize : "14px"
                      }}>
                        Aucune donnée
                      </div>
                      :
                      <div className="uozsoufvuosf">
                        {
                          AlllHisStaffs.map((staff, index)=>{
                            return(
                              <div className="otem" key={index}>
                                <div className="caseuzhcsd8989">
                                  <div className="otemom">
                                    <span>Nom complet : &nbsp;</span>
                                    <span>
                                    {
                                      staff.fullName
                                    }
                                    </span>
                                  </div>
                                  <div className="otemom">
                                    <span>Adresse Email : &nbsp;</span>
                                    <span>
                                    {
                                      staff.email
                                    }
                                    </span>
                                  </div>
                                  <div className="otemom">
                                    <span>Numéro téléphone : &nbsp;</span>
                                    <span>
                                    {
                                      staff.mobile
                                    }
                                    </span>
                                  </div>
                                  <div className="otemom">
                                    <span>Permission d'accès : &nbsp;</span>
                                    <span>
                                    {
                                      staff.permission === "yes" ? "Autorisé" : "Restreint"
                                    }
                                    </span>
                                  </div>
                                </div>
                                <div className="caseuzhcsd89">
                                  <button className='uosfvuouo'>
                                    <i className='fa-solid fa-lock' ></i>
                                  </button>
                                  <button className='zirvhnzvf' >
                                    <i className='fa-solid fa-pen'></i>
                                  </button>
                                  <button className='zirvhnzvf' >
                                    <i className='fa-solid fa-trash'></i>
                                  </button>
                                </div>
                              </div>
                            )
                          })
                        }
                      </div>
                    }
                    </>
                  }
                  </>
                }
            </div>
          </div>
        </div>
      



      {/*   Add new Calculation    */}

      <div className={addClicked ? "popUp  showpopUp" : "popUp"}>
        <div className="contPopUp popUp2358">
          <div className="caseD11">
            <span>Nouveau</span><span>&nbsp;&nbsp;Client</span>
          </div>
          <div className="rowInp">
            <label>Nom et prénom</label>
            <input 
              onChange={(e)=>{setFullname(e.target.value)}}
              type="text"
              value={fullname}
              className='idplaque' 
              placeholder="Veuillez saisir le nom et prénom..."
            />
          </div>

          <div className="rowInp">
            <label>Adresse Email</label>
            <input 
              onChange={(e)=>{setEmail(e.target.value)}}
              type="text"
              value={email}
              className='idplaque' 
              placeholder="Veuillez saisir l'adresse email..."
            />
          </div> 

          <div className="rowInp">
            <label>Téléphone</label>
            <input 
              onChange={(e)=>{setMobile(e.target.value)}}
              type="text"
              value={mobile}
              className='idplaque' 
              placeholder="Veuillez saisir le numéro de téléphone..."
            />
          </div> 
          
          <div className="rowInp">
            <label>Mot de passe</label>
            <input 
              onChange={(e)=>{setPassword(e.target.value)}}
              type="text"
              value={password}
              className='idplaque' 
              placeholder="Veuillez saisir le mot de passe..."
            />
          </div> 
          <div className="uzuovsououzv2">
            <i class="fa-solid fa-triangle-exclamation "></i>&nbsp;&nbsp;Tous les privilèges d'un administrateur seront attribués au nouveau client.
          </div>
          <div className="rowInp rowInpModified">
            <button className='jofzvno' disabled={loadingCreateUser} onClick={()=>{setaddClicked(false); setPassword('');setEmail('');setFullname('');setMobile('')}} >Annuler</button>
            <button 
              disabled={loadingCreateUser}
              onClick={()=>{
                handleCreateNewClient();
              }}
              className={loadingCreateUser ? "efvofvz efvofvz2" : "efvofvz"}
            >
            {
              loadingCreateUser ? "Création en cours..."
              :
              "Créer le nouveau client"
            }
            </button>
          </div>
        </div>
      </div>





      <div className="containerDash">
          <div className="rowD1">
            <div className="caseD1">
              <span>Mes</span><span>&nbsp;Clients</span>
              {
                loadingAllUsers ? 
                <>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src={LVG} alt="..." height={23} width={23} />
                </>
                :
                <>
                &nbsp;&nbsp;
                {
                  allUsers && <span className="iyzsiyvqdc">:&nbsp;&nbsp;{allUsers.length}</span>
                }
                </>
              }
            </div>
            <div className="caseD2">
              <button  disabled={loadingAllUsers || loadingDelete}  className='eofvouszfv00 oefbbofoufzuofzs' onClick={()=>{setRefresh(!refresh)}} ><div className="tooltipXX">Actualiser</div><i className='fa-solid fa-arrows-rotate' ></i></button>
              <button  disabled={loadingAllUsers || loadingDelete}  className='eofvouszfv11'  onClick={()=>{setaddClicked(true);}} ><i className='fa-solid fa-plus' ></i>&nbsp;Ajouter un client</button>
              <button  disabled={loadingAllUsers || loadingDelete}  className='eofvouszfv22'><i className='fa-solid fa-download' ></i>&nbsp;Exporter</button>
            </div>
          </div>
          {
            allUsers !== null && 
            
            <Box  
              sx={{ 
                height: "calc(100% - 120px)", 
                width: '100%', 
                outline: "none",
                borderRadius: "20px !important",
              }}
            >
              <DataGrid
                columns={columns.filter(column => !['id','idInc', 'password'].includes(column.field))}
                hideFooter 
                rows={allUsers}
                loading={loadingAllUsers}
                disableSelectionOnClick
                className='euosvuouof'
                experimentalFeatures={{ newEditingApi: false  }}
                components={{
                  NoRowsOverlay: () => <div>Aucune donnée</div>,  
                }}
                sx={{
                  '& .Mui-selected': {
                    backgroundColor: 'white !important',
                    outline: 'none',
                    '&:hover': {
                      backgroundColor: 'white !important', 
                    },
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: 'white',  
                  },
                  '& .MuiDataGrid-cell:focus': {
                    outline: 'none',  
                  },
                }}
              />
            </Box>
          }
      </div>
    </div>
  )
}

export default Clients;

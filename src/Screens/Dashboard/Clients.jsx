import React, { useState, useEffect } from 'react';
import "./index.css";
import NavBar from '../../Components/Navbar';
import SideBar from '../../Components/SideBar';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import Select from 'react-select';
import 'primeflex/primeflex.css';
import axios from 'axios'
import { ENDPOINT_API } from "../../endpoint";
import LVG from './Loader.gif'
import formatDateForCreatedAt from '../../Helpers/formatCreatedAt';





const actionTemplate = (params, setAllUsers, setRefresh, refresh, seteditClicked, editClicked, setUserToEdit, userToEdit, setshowClicked, showClicked ,setisDeletedClicked, setparamClicked ) => {

  
  const handleEdit = () => {
    console.log('Edit:', params.row);
    setUserToEdit(params.row);
    seteditClicked(!editClicked);
  };


  
  const handleView = async () => {
    console.log('Show:', params.row);
    setUserToEdit(params.row);
    setshowClicked(!showClicked);
  };


  const handleDelete = ()=>{
    setparamClicked(params);
    console.warn(params);
    setisDeletedClicked(true);
  }

  return (
    <div className='uefuvzou'>
      <button className='uoersf'   onClick={handleView}  >
        <i class="fa-solid fa-eye"></i>
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
        console.warn(response.data.users);
        let i = 0;
        const transformedData = response.data.users
          .filter(user => user.id !== userIdNum && user.type === "admin" && user.canAccess === 1 && user.isEmailVerified === 1)
          .map(user => {
            i++; 
            let createdAt = formatDateForCreatedAt(user.created_at);
            return {
              idInc: i,
              id: user.id,
              fullName: user.fullName ? user.fullName : "---",
              password: user.password ? user.password : "---",
              type: user.type ? user.type : "---",
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

        console.log(XXX);

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
      field: 'email', 
      headerName: 'Adresse Email', 
      minWidth: 300, 
      headerAlign: 'center', 
      align: 'center',
      flex: 1 // Allow the column to stretch
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
      renderCell: (params) => actionTemplate(params, setAllUsers, setRefresh, refresh, seteditClicked, editClicked, setUserToEdit, userToEdit, setshowClicked, showClicked,setisDeletedClicked, setparamClicked ), 
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

      <div className={loadingDelete ? "popUp666 showpopUp" : "popUp666"}>
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
          <div className="contPopUp popUp1 popUp777">
            <div className="caseD11">
              <span>Informations&nbsp;du</span><span>&nbsp;client</span>
            </div>
            {
            userToEdit !== null && 
              <>
                <div className="rowInp rowInp1 rowInp1rowInp1">
                  <label>
                    Nom et prénom
                  </label>
                  <label>
                    {
                      userToEdit.fullName
                    }
                  </label>
                </div>
                <div className="rowInp rowInp1 rowInp1rowInp1">
                  <label>
                    Adresse Email
                  </label>
                  <label>
                    {
                      userToEdit.email
                    }
                  </label>
                </div>
                <div className="rowInp rowInp1 rowInp1rowInp1">
                  <label>
                    Téléphone
                  </label>
                  <label>
                    {
                      userToEdit.mobile
                    }
                  </label>
                </div>
                <div className="rowInp rowInp1 rowInp1rowInp1">
                  <label>
                    Date de création
                  </label>
                  <label>
                    {
                      userToEdit.created_at
                    }
                  </label>
                </div>
              </>
            }
            <div className="rowInp rowInpModified">
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
              <button  disabled={loadingAllUsers} title='Rafraîchir la page' className='eofvouszfv00' onClick={()=>{setRefresh(!refresh)}} ><i class="fa-solid fa-rotate-right"></i></button>
              <button  disabled={loadingAllUsers}  className='eofvouszfv11'  onClick={()=>{setaddClicked(true);}} ><i className='fa-solid fa-plus' ></i>&nbsp;Ajouter un client</button>
              <button  disabled={loadingAllUsers}  className='eofvouszfv22'><i className='fa-solid fa-download' ></i>&nbsp;Exporter</button>
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

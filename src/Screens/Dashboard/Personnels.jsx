import React, { useState, useEffect } from 'react';
import "./index.css";
import NavBar from '../../Components/Navbar';
import SideBar from '../../Components/SideBar';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
  import axios from 'axios'
import { ENDPOINT_API } from "../../endpoint";
import LVG from './Loader.gif'
import formatDateForCreatedAt from '../../Helpers/formatCreatedAt';
import PopUp from '../../Components/PopUp';
import { useNavigate } from 'react-router-dom';
import ErrorSuccess from '../../Components/ErrorSuccess';







const actionTemplate = (params, set_all_personnels, setRefresh, refresh, seteditClicked, editClicked, set_personnel_to_edit, personnel_to_edit, setshowClicked, showClicked ,setLoaderPermission,loaderOfPermission, setisDeletedClicked,paramClicked, setparamClicked,showItResponse, setisErrorResponse,  setshowItResponse, setmessageResponse) => {

  
  const handleEdit = () => {
    console.log('Edit:', params.row);
    set_personnel_to_edit(params.row);
    seteditClicked(!editClicked);
  };




  const handleChangePermission = async () => {
    setLoaderPermission(true);
    const token = localStorage.getItem('token');
    let access;
      try{  


        set_all_personnels((prevPersonnels) =>
          prevPersonnels.map((person) =>
            person.id === params.id
              ? { ...person, permission : access === "canNotAccess" ? "Autorisé" : "Restreint"}
              : person
          )
        );
        console.warn(params.row)
 

        if(params.row.permission === "Autorisé"){
           access = "canAccess"; 
           console.log("We restrict him");
        }
        else if(params.row.permission === "Restreint"){
           access = "canNotAccess"; 
           console.log("We Give him Access");
        } 
        const resp = await axios.get(`${ENDPOINT_API}updateUserRestriction/${parseInt(params.row.idUser)}/${access}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if(resp.status === 200){
          setLoaderPermission(false);
        }
        else{
          setRefresh(!refresh);
          setLoaderPermission(false);
        }

      }
      catch(e){
        setRefresh(!refresh);
        console.log(e.message);
        if(!showItResponse){
          setisErrorResponse(true);
          setmessageResponse("Une erreur est survenue lors du changement de permission.");
          setshowItResponse(true);
          setTimeout(()=>{          
            setshowItResponse(false);
          }, 4500);
        }
        setLoaderPermission(false);
      }
      setLoaderPermission(false);

  };



  
  const handleView = async () => {
    console.log('Show:', params.row);
    set_personnel_to_edit(params.row);
    setshowClicked(!showClicked);
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


const Personnels = () => {


  const [all_personnels, set_all_personnels] = useState([]);
  const [LoadinG_All_Personnels, set_LoadinG_All_Personnels] = useState(true);

  const [fullname,setFullname] = useState("");
  const [email,setEmail] = useState("");
  const [mobile,setMobile] = useState("");
  const [password,setPassword] = useState("");

  const [addClicked, setaddClicked] = useState(false);
  const [editClicked, seteditClicked] = useState(false);
  const [showClicked,setshowClicked] = useState(false);
  const [loadinGEdit, setLoadinGEdit] = useState(false);
  const [personnel_to_edit, set_personnel_to_edit] = useState(null);
  const [loadingCreationPersonnel, setLoadingCreationOfPersonnel] = useState(false);
  const [refresh,setRefresh] = useState(false);
  const [loaderOfPermission, setLoaderPermission] = useState(false);
  const [isDeletedClicked,setisDeletedClicked] = useState(false);
  const [paramClicked,setparamClicked] = useState(null);
  const [LoadingDelete,setLoadingDelete] = useState(false);
  const [showItResponse, setshowItResponse] = useState(false);
  const [isErrorResponse, setisErrorResponse] = useState(false);
  const [messageResponse, setmessageResponse] = useState(null);

 
  const navigate = useNavigate();



  const fetch_data_all_personnels = async () => {
    try {
      set_LoadinG_All_Personnels(true);
      const userId = localStorage.getItem('userId');
      const userIdNum = parseInt(userId);
      const token = localStorage.getItem('token');
      
      const resp0 = await axios.get(`${ENDPOINT_API}getAdminIdFromUserId/${userIdNum}`,{
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (resp0.status === 200) {
        const response = await axios.get(`${ENDPOINT_API}staffsweb/${resp0.data.id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        console.log(response.data);
        if (response.status === 200) {
          let i = 0;
          const transformedData = response.data.map(item => {
            i++;
            let createdAt = formatDateForCreatedAt(item.created_at)
            return {
              idInc : i,
              id : item.id,
              fullName : item.user.fullName ? item.user.fullName : "---", 
              password : item.user.password ? item.user.password : "---", 
              type : item.user.type ? item.user.type : "---", 
              permission: item.user.canAccess === 1 ? "Autorisé" : "Restreint",
              idUser : item.user.id ? item.user.id : "---",
              image : item.user.image ? item.user.image : "---", 
              email : item.user.email ? item.user.email : "---", 
              mobile : item.user.mobile ? item.user.mobile : "---", 
              created_at:  item.created_at ? createdAt : "---",
            };
          });
          set_all_personnels(transformedData);
        }
        else{
          set_all_personnels([]);
        }
      }
      else{
        set_all_personnels([]);
      }
  
    } catch (error) {
      set_all_personnels([]);
      console.error('Erreur:', error.message);
    } finally {
      set_LoadinG_All_Personnels(false);
    }
  };
  

  
 
  


  useEffect(() => {
    fetch_data_all_personnels();
  }, [refresh]);

 



 


    const handle_Update_Personnel = async(XXX)=>{
      if(XXX.idUser === "---" || XXX.idUser  === null || XXX.idUser  === undefined){
        alert("Oops, une erreur s'est produite ! ");
        return;
      }
      else{

        let emailX = XXX.email.toString();
        let mobileX = XXX.mobile.toString();
        let fullNameX = XXX.fullName.toString();

        try{
          if(emailX.length <= 4){
            if(!showItResponse){
              setisErrorResponse(true);
              setmessageResponse("Le champ `email` ne peut pas etre vide.");
              setshowItResponse(true);
              setTimeout(()=>{          
                setshowItResponse(false);
              }, 4500);
            }
            return;
          } 
           
          else if(fullNameX.length <= 1){
            if(!showItResponse){
              setisErrorResponse(true);
              setmessageResponse("Le champs `Nom et prénom` ne peut pas etre vide.");
              setshowItResponse(true);
              setTimeout(()=>{          
                setshowItResponse(false);
              }, 4500);
            }
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
            set_all_personnels((prevPersonnels) =>
              prevPersonnels.map((person) =>
                person.id === XXX.id
                  ? { ...person, email: XXX.email ? XXX.email : "---", mobile: XXX.mobile ? XXX.mobile : "---", fullName: XXX.fullName ? XXX.fullName : "---" }
                  : person
              )
            );
            set_personnel_to_edit(null);
          }
          else{
            seteditClicked(false);
            set_personnel_to_edit(null);
             if(!showItResponse){
              setisErrorResponse(true);
              setmessageResponse("Une erreur est survenue lors de la modification des données du personnel.");
              setshowItResponse(true);
              setTimeout(()=>{          
                setshowItResponse(false);
              }, 4500);
            }
          }

        }
        catch(e){
          console.log(e.message);
           if(!showItResponse){
              setisErrorResponse(true);
              setmessageResponse("Une erreur est survenue lors de la modification des données du personnel.");
              setshowItResponse(true);
              setTimeout(()=>{          
                setshowItResponse(false);
              }, 4500);
            }
        } finally{
          setLoadinGEdit(false);
        }

      }
    }

    

  const handleCreateNewPersonnel = async ()=> {
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
        setLoadingCreationOfPersonnel(true);

        const token = localStorage.getItem('token');
        const userIdNum =  parseInt(localStorage.getItem('userId'));

        const resp0 = await axios.get(`${ENDPOINT_API}getAdminIdFromUserId/${userIdNum}`,{
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if(resp0.status === 200){
          
          let idAdmin = parseInt(resp0.data.id);
          let data = {
            fullName : fullname, 
            email : email, 
            password : password, 
            mobile : mobile, 
            admin_id :idAdmin,
            typeS : "staff"
          }
      
          const resp = await axios.post(`${ENDPOINT_API}staff`, data, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if(resp.status === 201){
            setEmail("");
            setFullname('');
            setMobile('');
            setPassword('');
            setaddClicked(false);
            fetch_data_all_personnels();
          }
          else{
            alert('Error while creating a new staff.');
          }

        }
        else{
          alert('X - Error while creating a new staff.');
        }          
      }
      catch(e){
        alert('Oops, somethign went wrong ! ');
        console.log(e.message);
      }finally{
        setLoadingCreationOfPersonnel(false);
      }
    }
  }
 







  const handleDeleteStaff = async () => {
    setisDeletedClicked(false);
    setLoadingDelete(true);
    try{

      const token = localStorage.getItem('token');
      const response = await axios.delete(`${ENDPOINT_API}deleteUserStaffNotAdmin/${parseInt(paramClicked.row.idUser)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if(response.status === 200){
        set_all_personnels(prevall_personnels => 
          prevall_personnels.filter(item => item.id !== paramClicked.row.id)
        );
        setLoadingDelete(false);
      }
      else{
        alert('Not deleted');
        setLoadingDelete(false);
      }
    }
    catch(e){
      alert('Not deleted');
      setLoadingDelete(false);
      console.log(e.message);
    }  
    setLoadingDelete(false);

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
      renderCell: (params) => actionTemplate(params, set_all_personnels, setRefresh, refresh, seteditClicked, editClicked, set_personnel_to_edit, personnel_to_edit, setshowClicked, showClicked,setLoaderPermission,loaderOfPermission,setisDeletedClicked,paramClicked,setparamClicked,showItResponse, setisErrorResponse,  setshowItResponse, setmessageResponse ), 
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

      <ErrorSuccess  
        isError={isErrorResponse}
        showIt={showItResponse}
        message={messageResponse}  
      />

      <div className={LoadingDelete ? "popUp6666  showpopUp" : "popUp6666 "}>
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



          {/*   delete Personnel    */}


      <div className={isDeletedClicked ? "popUp  showpopUp" : "popUp "}>
        <div className="contPopUp popUp1 popUp1popUp1popUp12    popUp1popUp1popUp12345 popUp6666Modifi7">
          <div className="caseD11">
            <span className='svowdjc'><i class="fa-solid fa-triangle-exclamation fa-triangle-exclamation2"></i>&nbsp;&nbsp;Confirmer&nbsp;</span><span className='svowdjc'>&nbsp;la suppression</span>
          </div>
          <div className="uzuovsououzv">
            &nbsp;&nbsp;La suppression de ce personnel est irréversible et entraînera la perte définitive de ses données !
          </div>
          <div className="rowInp rowInpModified">
              <button 
                className='jofzvno' 
                disabled={LoadingDelete} 
                onClick={()=>{
                  setisDeletedClicked(false);
                  setparamClicked(null);
                }} 
              >
                Annuler
              </button>
              <button 
                disabled={LoadingDelete}
                onClick={()=>{
                  handleDeleteStaff();
                }}
                className={LoadingDelete ? "efvofvz22 efvofvz2" : "efvofvz22"}
              >
              {
                LoadingDelete ? "Traitement en cours..."
                :
                "Oui, je confirme"
              }
              </button>
          </div>
        </div>
      </div>









      {/*   edit Personnel    */}

        <div className={editClicked ? "popUp po showpopUp" : "popUp po"}>
          <div className="contPopUp popUp1 popUp77777">
            <div className="caseD11">
              <span>Modifier&nbsp;le</span><span>&nbsp;personnel</span>
            </div>
            {
            personnel_to_edit !== null && 
              <>
                <div className="rowInp">
                  <label>Nom et prénom</label>
                  <input 
                    onChange={(e)=>{
                      set_personnel_to_edit({
                        ...personnel_to_edit, 
                        fullName : e.target.value
                      })
                    }}
                    type="text"
                    value={personnel_to_edit.fullName}
                    className='idplaque' 
                    placeholder="Veuillez saisir le nouveau nom et prénom..."
                  />
                </div>
                <div className="rowInp">
                  <label>Adresse Email</label>
                  <input 
                    onChange={(e)=>{
                      set_personnel_to_edit({
                        ...personnel_to_edit, 
                        email : e.target.value
                      })
                    }}
                    type="text"
                    value={personnel_to_edit.email}
                    className='idplaque' 
                    placeholder="Veuillez saisir la nouvelle adresse email..."
                  />
                </div>
                <div className="rowInp">
                  <label>Téléphone</label>
                  <input 
                    onChange={(e)=>{
                      set_personnel_to_edit({
                        ...personnel_to_edit, 
                        mobile : e.target.value
                      })
                    }}
                    type="text"
                    value={personnel_to_edit.mobile}
                    className='idplaque' 
                    placeholder="Veuillez saisir le nouveau numéro de téléphone..."
                  />
                </div>
                <div className="rowInp">
                  <label>Mot de passe</label>
                  <button
                    className='uosruofdvc'
                    onClick={()=>{
                      if(personnel_to_edit){
                        console.log(personnel_to_edit);
                        navigate(`/password-configuration/${personnel_to_edit.idUser}/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjM0NTY3ODkwLCJ1c2VyX25hbWUiOiJKb2huIERvZSIsImV4cCI6MTY1Mzk0MjAwMH0.YXZhdGVnaW9uZW5vZGVibG9nYXMak8ab8ac890moplaimfok666/${personnel_to_edit.fullName}`);
                        seteditClicked(false);
                        set_personnel_to_edit(null);
                      }
                    }}
                  >
                    Modifier le mot de passe
                  </button>
                </div>
              </>
            }
            <div className="rowInp rowInpModified">
              <button 
                className='jofzvno' 
                disabled={loadinGEdit} 
                onClick={()=>{
                  seteditClicked(false);
                  set_personnel_to_edit(null);
                }} 
              >
                Annuler
              </button>
              <button 
                disabled={loadinGEdit}
                onClick={()=>{
                  handle_Update_Personnel(personnel_to_edit);
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
          </div>
        </div>
      




        {/*   show Personnel    */}
              
        <div className={showClicked ? "popUp  showpopUp" : "popUp "}>
          <div className="contPopUp popUp1 popUp777">
            <div className="caseD11">
              <span>Informations&nbsp;du</span><span>&nbsp;personnel</span>
            </div>
            {
            personnel_to_edit !== null && 
              <>
                <div className="rowInp rowInp1 rowInp1rowInp1 rowInp1rowInp1111">
                      <img 
                        src={personnel_to_edit.image? personnel_to_edit.image : "https://res.cloudinary.com/dqprleeyt/image/upload/v1729461147/Design_sans_titre_rbtiwt.png"}
                        alt="" 
                        style={{
                          borderRadius : "50%", 
                          height : '99px', 
                          width : '99px', 
                          objectFit : "cover"
                        }}
                      />
                </div>
                <div className="rowInp rowInp1 rowInp1rowInp1">
                  <label>
                    Nom et prénom
                  </label>
                  <label>
                    {
                      personnel_to_edit.fullName
                    }
                  </label>
                </div>
                <div className="rowInp rowInp1 rowInp1rowInp1">
                  <label>
                    Adresse Email
                  </label>
                  <label>
                    {
                      personnel_to_edit.email
                    }
                  </label>
                </div>
                <div className="rowInp rowInp1 rowInp1rowInp1">
                  <label>
                    Téléphone
                  </label>
                  <label>
                    {
                      personnel_to_edit.mobile
                    }
                  </label>
                </div>
                <div className="rowInp rowInp1 rowInp1rowInp1">
                  <label>
                    Date de création
                  </label>
                  <label>
                    {
                      personnel_to_edit.created_at
                    }
                  </label>
                </div>
              </>
            }
            <div className="rowInp rowInpModified">
              <button className='jofzvno' onClick={()=>{setshowClicked(false);set_personnel_to_edit(null);}} >Fermer</button>
              <button 
                onClick={()=>{
                  setshowClicked(false);
                  seteditClicked(true);
                }}
                className={loadinGEdit ? "efvofvz efvofvz2" : "efvofvz"}
              >
                Modifier le personnel
              </button>
            </div>
          </div>
        </div>
      



      {/*   Add new Calculation    */}

      <div className={addClicked ? "popUp showpopUp" : "popUp"}>
        <div className="contPopUp">
          <div className="caseD11">
            <span>Nouveau</span><span>&nbsp;&nbsp;Personnel</span>
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
          
          <div className="rowInp rowInpModified">
            <button className='jofzvno' disabled={loadingCreationPersonnel} onClick={()=>{setaddClicked(false); setPassword('');setEmail('');setFullname('');setMobile('')}} >Annuler</button>
            <button 
              disabled={loadingCreationPersonnel}
              onClick={()=>{
                handleCreateNewPersonnel();
              }}
              className={loadingCreationPersonnel ? "efvofvz efvofvz2" : "efvofvz"}
            >
            {
              loadingCreationPersonnel ? "Création en cours..."
              :
              "Créer le nouveau personnel"
            }
            </button>
          </div>
        </div>
      </div>





      <div className="containerDash">
          <div className="rowD1">
            <div className="caseD1">
              <span>Mes</span><span>&nbsp;Personnels</span>
              {
                LoadinG_All_Personnels ? 
                <>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src={LVG} alt="..." height={23} width={23} />
                </>
                :
                <>
                &nbsp;&nbsp;
                {
                  all_personnels && <span className="iyzsiyvqdc">:&nbsp;&nbsp;{all_personnels.length}</span>
                }
                </>
              }
            </div>
            <div className="caseD2">
              <button  disabled={LoadinG_All_Personnels}   className='eofvouszfv00 oefbbofoufzuofzs' onClick={()=>{setRefresh(!refresh)}} ><i className='fa-solid fa-arrows-rotate' ></i><div className="tooltipXX">Actualiser </div></button>
              <button  className='eofvouszfv11'  onClick={()=>{setaddClicked(true);}} ><i className='fa-solid fa-plus' ></i>&nbsp;Ajouter un personnel</button>
              <button   className='eofvouszfv22'><i className='fa-solid fa-download' ></i>&nbsp;Exporter</button>
            </div>
          </div>
          {
            all_personnels !== null && 
            
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
                rows={all_personnels}
                loading={LoadinG_All_Personnels}
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

export default Personnels;

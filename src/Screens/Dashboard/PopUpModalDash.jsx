import { useState } from 'react';
import Select from 'react-select'; // Assuming you're using 'react-select'
import './index.css';

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    height: "45px",
    border: '1px solid #ccc',     
    boxShadow: state.isFocused ? 'none' : 'none', 
    '&:hover': { border: '1px solid #ccc' },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#5fa21b' : '#fff',
    color: state.isSelected ? '#fff' : '#333',
    '&:hover': state.isSelected ? { backgroundColor: '#5fa21b', color: '#fff' } : { backgroundColor: '#c9ff93' },
  }),
};

const PopUpModalDash = ({
          farms,
          showDateModal2,  
          setShowDateModal2,
          handleSerreChange,
          selectedFarm,
          handleFarmChange,
          handlePlaqueChange,
          selectedPlaque,
          selectedSerre,
}) => {
  
  const farmOptions = farms.map(farm => ({
    value: farm.id,
    label: farm.name
  }));

  // Dynamically update serre options when farm is selected
  const serreOptions = selectedFarm
    ? farms.find(farm => farm.id === selectedFarm)?.serres.map(serre => ({
        value: serre.id,
        label: serre.name
      }))
    : [];

  // Dynamically update plaque options when serre is selected
  const plaqueOptions = selectedSerre
    ? farms.find(farm => farm.id === selectedFarm)
        ?.serres.find(serre => serre.id === selectedSerre)?.plaques.map(plaque => ({
          value: plaque.id,
          label: plaque.name
        }))
    : [];
 

  return (
    <div className={showDateModal2 ? "popUp showpopUp" : "popUp"}>
      <div className="contPopUp popUp1 popUp1popUp1popUp12 popUp1popUp1popUp12345 popUp6666Modifi7 popUp6666Modifi7999 popUp1popUp1popUp122749632976491326491236">
        <div className="caseD11 caseD111">
          <span className='svowdjc svowdjccolors'>Configurer l'affichage &nbsp;</span><span className='svowdjc'>&nbsp;</span>
        </div>
        <div className="zroshrvhsfv">
          <Select
            value={selectedFarm ? { value: selectedFarm, label: farms.find(farm => farm.id === selectedFarm)?.name } : null}
            onChange={handleFarmChange}
            options={farmOptions}
            placeholder="Select a Farm"
            styles={customStyles}
          />
        </div>
        <div className="zroshrvhsfv">
          <Select
            value={selectedSerre ? { value: selectedSerre, label: farms.find(farm => farm.id === selectedFarm)?.serres.find(serre => serre.id === selectedSerre)?.name } : null}
            onChange={handleSerreChange}
            options={serreOptions}
            isDisabled={!selectedFarm}
            placeholder="Select a Serre"
            styles={customStyles}
          />
        </div>
        <div className="zroshrvhsfv">
          <Select
            value={selectedPlaque ? { value: selectedPlaque, label: farms.find(farm => farm.id === selectedFarm)?.serres.find(serre => serre.id === selectedSerre)?.plaques.find(plaque => plaque.id === selectedPlaque)?.name } : null}
            onChange={handlePlaqueChange}
            options={plaqueOptions}
            isDisabled={!selectedSerre}
            placeholder="Select a Plaque"
            styles={customStyles}
          />
        </div>
        <div className="rowInp rowInpModified">
          <button 
            className='jofzvno' 
            onClick={() => setShowDateModal2(false)} 
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUpModalDash;

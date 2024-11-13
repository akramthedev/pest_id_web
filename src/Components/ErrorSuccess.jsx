import React from 'react';
import './index3.css'; 


const ErrorSuccess = ({ message, showIt, isError }) => {
 
    return (
        <div
            className={`customPopup ${showIt ? 'show' : ''} ${isError ? 'error' : 'success'}`}
            role="alert"
        >
            <div className={isError ? "customPopupContent" : "customPopupContent2"}>
                {message && message}
            </div>
        </div>
    );
};

export default ErrorSuccess;

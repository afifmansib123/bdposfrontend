// src/components/HandleRedirect.js
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const HandleRedirect = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tableId = queryParams.get('tableId');
        
        if (tableId) {
            // Store the tableId in localStorage
            localStorage.setItem('tableId', tableId);
            
            // Redirect to the home page or any other page
            navigate('/');
        } else {
            // Handle missing tableId
            console.error('No tableId found in URL');
        }
    }, [location.search, navigate]);

    return null;
};

export default HandleRedirect;

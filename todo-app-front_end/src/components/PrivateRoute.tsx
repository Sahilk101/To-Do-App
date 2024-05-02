import { Route, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

const PrivateRoute = ({children }:{children:any}) => {
    const [isAuthenticated,setIsAuthenticated] = useState(false)
    useEffect(() =>{        
      const token = localStorage.getItem('token')
      if(token) {        
        setIsAuthenticated(true)
      }
    },[])
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
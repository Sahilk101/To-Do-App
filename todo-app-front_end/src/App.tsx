import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import HomePage from './components/HomePage';
import ProjectDetailPage from './components/ProjectDetail';
import PublicRoute from './components/PublicRoute';


const App: React.FC = () => {

  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  useEffect(()=>{
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token);
  }, [])

  return (
    <Router>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/register" />} />
          <Route path="/login" element={<AuthForm formType="login" />} />
          <Route path="/register" element={<AuthForm formType="register" />} />
          <Route path="/home" element={isAuthenticated ? <HomePage /> : <Navigate to="/login"/> } />
          <Route path="/projects/:project_name/:projectId" element={isAuthenticated ? <ProjectDetailPage /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />
        </Routes>
    </Router>
  );
};

export default App;

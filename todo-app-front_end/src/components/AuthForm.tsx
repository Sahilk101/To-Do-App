import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css'

interface AuthFormProps {
  formType: 'login' | 'register';
}

const AuthForm: React.FC<AuthFormProps> = ({ formType }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();
// const [isAuthenticated, setIsAuthenticated] = useState<Boolean>();

//   useEffect(()=> {
//     if(isAuthenticated){
//         navigate('/home')
//     }
//   }, [isAuthenticated, navigate])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const url = formType === 'login' ? 'http://localhost:4000/v1/auth/login' : 'http://localhost:4000/v1/auth/register';
    const payload = formType === 'login' ? { email, password } : { fullName, email, password };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)

     });

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return;
      }
    
      const data = await response.json();
    
      if (response.status === 201 && formType === 'register') {
        console.log('register');
        navigate('/login');
      }

      if (response.status === 200 && formType === 'login') {
        console.log('login');
        localStorage.setItem('token', data.data.token);
        navigate('/home');
      }
    
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
          {formType === 'register' && (
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Full Name"
              required
            />
          )}
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">{formType === 'login' ? 'Login' : 'Register'}</button>
        </form>
      );
}   

export default AuthForm;

import React, { useState } from 'react';
import API_PATH from '../../utilitys/Apipath';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loginHandler = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_PATH}/vendor/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('vendorToken', data.token);
        const username = data.vendor?.username || email.split('@')[0];
        localStorage.setItem('vendorUsername', username);
        setEmail('');
        setPassword('');
        
        if (onLoginSuccess) {
          onLoginSuccess(username);
        } else {
          window.location.reload();
        }
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginSection">
      <form className="loginForm" onSubmit={loginHandler}>
        <h3>🔐 Vendor Login</h3>
        
        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: 'rgba(220, 38, 38, 0.2)',
            border: '1px solid #dc2626',
            borderRadius: '6px',
            color: '#fca5a5',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="email">📧 Email:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required 
          />
        </div>

        <div>
          <label htmlFor="password">🔒 Password:</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required 
          />
        </div>

        <button type="submit" disabled={loading} style={{opacity: loading ? 0.6 : 1}}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login

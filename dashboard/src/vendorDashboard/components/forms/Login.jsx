import React, { useState } from 'react'
import API_PATH from '../../utilitys/Apipath'

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch(`${API_PATH}/vendor/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Login successful!')
        localStorage.setItem('token', data.token)
        localStorage.setItem('vendorId', data.vendorId || '')
        setEmail('')
        setPassword('')
        // Notify parent of successful login
        if (onLoginSuccess) {
          setTimeout(() => onLoginSuccess(), 1000)
        }
      } else {
        setMessage(data.error || 'Login failed')
      }
    } catch (error) {
      setMessage('Network error. Please try again.')
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="loginSection">
      <form className="loginForm" onSubmit={handleSubmit}>
        <h3>Vendor Login</h3>
        
        {message && (
          <div style={{ 
            padding: '10px', 
            marginBottom: '15px', 
            borderRadius: '6px',
            backgroundColor: message.includes('successful') ? '#22c55e' : '#ef4444',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        <div>
          <label htmlFor="email">Email:</label>
          <br />
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <br />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <br />
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <br />
        </div>

        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default Login

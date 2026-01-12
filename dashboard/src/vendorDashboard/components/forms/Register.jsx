import React, { useState } from 'react'
import API_PATH from '../../utilitys/Apipath'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch(`${API_PATH}/vendor/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Registration successful! You can now login.')
        setUsername('')
        setEmail('')
        setPassword('')
      } else {
        setMessage(data.error || data || 'Registration failed')
      }
    } catch (error) {
      setMessage('Network error. Please try again.')
      console.error('Register error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="registersection">
      <form className="registerForm" onSubmit={handleSubmit}>
        <h3>Vendor Register</h3>

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
          <label htmlFor="username">Username:</label>
          <br />
          <input 
            type="text" 
            id="username" 
            name="username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
          />
          <br />
        </div>
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
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  )
}

export default Register

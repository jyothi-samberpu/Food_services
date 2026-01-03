import React from 'react'

const Login = () => {
  return (
    <div className="loginSection">
      

      <form className="loginForm">
        <h3>Vendor Login</h3>
        <div>
          <label htmlFor="email">Email:</label>
          <br />
          <input type="email" id="email" name="email" required />
          <br />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <br />
          <input type="password" id="password" name="password" required />
          <br />
        </div>

        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login

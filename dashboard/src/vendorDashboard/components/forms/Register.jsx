import React from 'react'

const Register = () => {
  return (
    <div className="registersection">
      

      <form className="registerForm">
        <h3>Vendor Register</h3>
        <div>
          <label htmlFor="username">Username:</label>
          <br />
          <input type="text" id="username" name="username" required />
          <br />
        </div>
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
        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default Register

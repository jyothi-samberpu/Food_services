import React from 'react'

const NavBar = ({ showLoginHandler, showRegisterHandler }) => {
  return (
    <div className="navsection">
      <div className="company">
        Vendor Dashboard
      </div>

      <div className="userAuth">
        <span onClick={showLoginHandler} style={{ cursor: 'pointer' }}>Login / </span>
        <span onClick={showRegisterHandler} style={{ cursor: 'pointer' }}>Register</span>
      </div>
    </div>
  )
}

export default NavBar

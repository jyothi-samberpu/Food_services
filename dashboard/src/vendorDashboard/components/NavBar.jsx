import React from 'react'

const NavBar = ({ showLoginHandler, showRegisterHandler, isLoggedIn, handleLogout }) => {
  return (
    <div className="navsection">
      <div className="company">
        Vendor Dashboard
      </div>

      <div className="userAuth">
        {isLoggedIn ? (
          <span onClick={handleLogout} style={{ cursor: 'pointer', color: '#ef4444' }}>
            Logout
          </span>
        ) : (
          <>
            <span onClick={showLoginHandler} style={{ cursor: 'pointer' }}>Login / </span>
            <span onClick={showRegisterHandler} style={{ cursor: 'pointer' }}>Register</span>
          </>
        )}
      </div>
    </div>
  )
}

export default NavBar

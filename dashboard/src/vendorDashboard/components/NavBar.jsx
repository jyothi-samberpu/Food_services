import React from 'react'

const NavBar = ({ showLoginHandler, showRegisterHandler, isLoggedIn, onLogout, vendorUsername }) => {
  return (
    <div className="navsection">
      <div className="company">
        Vendor Dashboard
      </div>

      <div className="userAuth">
        {isLoggedIn ? (
          <div className="userInfo">
            <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
              👤 {vendorUsername || 'Vendor'}
            </span>
            <button className="logoutBtn" onClick={onLogout}>
              Logout
            </button>
          </div>
        ) : (
          <>
            <span onClick={showLoginHandler} style={{ cursor: 'pointer' }}>
              🔐 Login
            </span>
            <span onClick={showRegisterHandler} style={{ cursor: 'pointer' }}>
              ✍️ Register
            </span>
          </>
        )}
      </div>
    </div>
  )
}

export default NavBar

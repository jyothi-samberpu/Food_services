import React, { useState, useEffect } from 'react'
import NavBar from '../components/NavBar' 
import SideBar from '../components/SideBar'
import Login from '../components/forms/Login'
import Register from '../components/forms/Register'
import AddFirm from '../components/forms/AddFirm'
import AddProduct from '../components/forms/AddProduct'
import AllProducts from '../components/AllProducts'
import UserDetails from '../components/UserDetails'

const LandingPage = () => {
    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)
    const [showAddFirm, setShowAddFirm] = useState(false)
    const [showAddProduct, setShowAddProduct] = useState(false)
    const [showAllProducts, setShowAllProducts] = useState(false)
    const [showUserDetails, setShowUserDetails] = useState(false)
    const [activeSection, setActiveSection] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [vendorUsername, setVendorUsername] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('vendorToken')
        const username = localStorage.getItem('vendorUsername')
        if (token) {
            setIsLoggedIn(true)
            setVendorUsername(username)
        }
    }, [])

    const resetAllSections = () => {
        setShowLogin(false)
        setShowRegister(false)
        setShowAddFirm(false)
        setShowAddProduct(false)
        setShowAllProducts(false)
        setShowUserDetails(false)
    }

    const showLoginHandler = () => {
        resetAllSections()
        setShowLogin(true)
        setActiveSection(null)
    }

    const showRegisterHandler = () => {
        resetAllSections()
        setShowRegister(true)
        setActiveSection(null)
    }

    const showAddFirmHandler = () => {
        if (!isLoggedIn) {
            alert('Please login first')
            showLoginHandler()
            return
        }
        resetAllSections()
        setShowAddFirm(true)
        setActiveSection('add-firm')
    }

    const showAddProductHandler = () => {
        if (!isLoggedIn) {
            alert('Please login first')
            showLoginHandler()
            return
        }
        resetAllSections()
        setShowAddProduct(true)
        setActiveSection('add-product')
    }

    const showAllProductsHandler = () => {
        resetAllSections()
        setShowAllProducts(true)
        setActiveSection('all-products')
    }

    const showUserDetailsHandler = () => {
        if (!isLoggedIn) {
            alert('Please login first')
            showLoginHandler()
            return
        }
        resetAllSections()
        setShowUserDetails(true)
        setActiveSection('user-details')
    }

    const handleLoginSuccess = (username) => {
        setIsLoggedIn(true)
        setVendorUsername(username)
        localStorage.setItem('vendorUsername', username)
        resetAllSections()
    }

    const handleLogout = () => {
        localStorage.removeItem('vendorToken')
        localStorage.removeItem('vendorUsername')
        setIsLoggedIn(false)
        setVendorUsername('')
        resetAllSections()
        showLoginHandler()
    }

    return (
      <section className="landingSection" style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
        <NavBar 
          showLoginHandler={showLoginHandler} 
          showRegisterHandler={showRegisterHandler}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          vendorUsername={vendorUsername}
        />

        <div className="collectionSection">
          {isLoggedIn && (
            <SideBar 
              showAddFirmHandler={showAddFirmHandler} 
              showAddProductHandler={showAddProductHandler}
              showAllProductsHandler={showAllProductsHandler}
              showUserDetailsHandler={showUserDetailsHandler}
              activeSection={activeSection}
            />
          )}
          
          <div className="mainContent">
            {showLogin && <Login onLoginSuccess={handleLoginSuccess} />}
            {showRegister && <Register onRegisterSuccess={showLoginHandler} />}
            {showAddFirm && <AddFirm />}
            {showAddProduct && <AddProduct />}
            {showAllProducts && <AllProducts />}
            {showUserDetails && <UserDetails />}
            {!showLogin && !showRegister && !showAddFirm && !showAddProduct && !showAllProducts && !showUserDetails && !isLoggedIn && (
              <div className="welcomeScreen">
                <div className="welcomeContent">
                  <h1>Welcome to Food Services Vendor Dashboard</h1>
                  <p>Manage your food business efficiently</p>
                  <button onClick={showLoginHandler} className="primaryBtn">
                    Get Started - Login
                  </button>
                  <button onClick={showRegisterHandler} className="secondaryBtn">
                    New Vendor? Register Here
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    )
}

export default LandingPage

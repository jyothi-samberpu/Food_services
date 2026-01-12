import React, { useState, useEffect } from 'react'
import NavBar from '../components/NavBar' 
import SideBar from '../components/SideBar'
import Login from '../components/forms/Login'
import Register from '../components/forms/Register'
import AddFirm from '../components/forms/AddFirm'
import AddProduct from '../components/forms/AddProduct'
import AllProducts from '../components/AllProducts'

const LandingPage = () => {
    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)
    const [showAddFirm, setShowAddFirm] = useState(false)
    const [showAddProduct, setShowAddProduct] = useState(false)
    const [showAllProducts, setShowAllProducts] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token')
        setIsLoggedIn(!!token)
    }, [])

    const showLoginHandler = () => {
        setShowLogin(true)
        setShowRegister(false)
        setShowAddFirm(false)
        setShowAddProduct(false)
        setShowAllProducts(false)
    }

    const showRegisterHandler = () => {
        setShowLogin(false)
        setShowRegister(true)
        setShowAddFirm(false)
        setShowAddProduct(false)
        setShowAllProducts(false)
    }

    const showAddFirmHandler = () => {
        setShowLogin(false)
        setShowRegister(false)
        setShowAddFirm(true)
        setShowAddProduct(false)
        setShowAllProducts(false)
    }

    const showAddProductHandler = () => {
        setShowLogin(false)
        setShowRegister(false)
        setShowAddFirm(false)
        setShowAddProduct(true)
        setShowAllProducts(false)
    }

    const showAllProductsHandler = () => {
        setShowLogin(false)
        setShowRegister(false)
        setShowAddFirm(false)
        setShowAddProduct(false)
        setShowAllProducts(true)
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('vendorId')
        setIsLoggedIn(false)
        setShowLogin(true)
        setShowRegister(false)
        setShowAddFirm(false)
        setShowAddProduct(false)
        setShowAllProducts(false)
    }

    const handleLoginSuccess = () => {
        setIsLoggedIn(true)
        setShowLogin(false)
    }

    return (
      <section className="landingSection">
        <NavBar 
          showLoginHandler={showLoginHandler} 
          showRegisterHandler={showRegisterHandler}
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
        />

        <div className="collectionSection">
          <SideBar 
            showAddFirmHandler={showAddFirmHandler} 
            showAddProductHandler={showAddProductHandler}
            showAllProductsHandler={showAllProductsHandler}
          />
          
          {showLogin && <Login onLoginSuccess={handleLoginSuccess} />}
          {showRegister && <Register />}
          {showAddFirm && <AddFirm />}
          {showAddProduct && <AddProduct />}
          {showAllProducts && <AllProducts />}
          
          {!showLogin && !showRegister && !showAddFirm && !showAddProduct && !showAllProducts && (
            <div className="welcomeSection">
              <h2>Welcome to Vendor Dashboard</h2>
              <p>Manage your food business with ease</p>
              {!isLoggedIn && (
                <p>Please login or register to get started</p>
              )}
            </div>
          )}
        </div>
      </section>
    )
}

export default LandingPage

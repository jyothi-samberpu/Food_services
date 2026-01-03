import React, { useState } from 'react'
import NavBar from '../components/NavBar' 
import SideBar from '../components/SideBar'
import Login from '../components/forms/Login'
import Register from '../components/forms/Register'
import AddFirm from '../components/forms/AddFirm'
import AddProduct from '../components/forms/AddProduct'

const LandingPage = () => {
    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)
    const [showAddFirm, setShowAddFirm] = useState(false)
    const [showAddProduct, setShowAddProduct] = useState(false)

    const showLoginHandler = () => {
        setShowLogin(true)
        setShowRegister(false)
        setShowAddFirm(false)
        setShowAddProduct(false)
    }

    const showRegisterHandler = () => {
        setShowLogin(false)
        setShowRegister(true)
        setShowAddFirm(false)
        setShowAddProduct(false)
    }

    const showAddFirmHandler = () => {
        setShowLogin(false)
        setShowRegister(false)
        setShowAddFirm(true)
        setShowAddProduct(false)
    }

    const showAddProductHandler = () => {
        setShowLogin(false)
        setShowRegister(false)
        setShowAddFirm(false)
        setShowAddProduct(true)
    }

    return (
      <section className="landingSection">
        <NavBar 
          showLoginHandler={showLoginHandler} 
          showRegisterHandler={showRegisterHandler} 
        />

        <div className="collectionSection">
          <SideBar 
            showAddFirmHandler={showAddFirmHandler} 
            showAddProductHandler={showAddProductHandler} 
          />
          
          {showLogin && <Login />}
          {showRegister && <Register />}
          {showAddFirm && <AddFirm />}
          {showAddProduct && <AddProduct />}
        </div>
      </section>
    )
}

export default LandingPage

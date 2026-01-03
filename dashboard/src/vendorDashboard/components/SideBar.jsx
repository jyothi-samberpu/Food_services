import React from 'react'

const SideBar = ({ showAddFirmHandler, showAddProductHandler }) => {
  return (
    <div className="sideBarSection">
        <ul>
            <li onClick={showAddFirmHandler} style={{ cursor: 'pointer' }}>Add Firm</li>
            <li onClick={showAddProductHandler} style={{ cursor: 'pointer' }}>Add Product</li>
            <li>All Products</li>
            <li>User Details</li>
        </ul>
    </div>
  )
}

export default SideBar

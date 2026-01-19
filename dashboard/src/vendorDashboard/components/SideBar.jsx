import React from 'react'

const SideBar = ({ 
  showAddFirmHandler, 
  showAddProductHandler, 
  showAllProductsHandler, 
  showUserDetailsHandler,
  activeSection
}) => {
  const menuItems = [
    { id: 'add-firm', label: 'Add Firm', icon: '🏪', handler: showAddFirmHandler },
    { id: 'add-product', label: 'Add Product', icon: '🍔', handler: showAddProductHandler },
    { id: 'all-products', label: 'All Products', icon: '📋', handler: showAllProductsHandler },
    { id: 'user-details', label: 'User Details', icon: '👤', handler: showUserDetailsHandler },
  ]

  return (
    <div className="sideBarSection">
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.id}
            onClick={item.handler}
            className={activeSection === item.id ? 'active' : ''}
          >
            <span>{item.icon}</span>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SideBar

import React, { useState, useEffect } from 'react'
import API_PATH from '../utilitys/Apipath'

const AllProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_PATH}/product/all`)
      const data = await response.json()
      
      if (response.ok) {
        setProducts(data.products || [])
      } else {
        setError('Failed to fetch products')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      console.error('Fetch products error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId) => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please login first')
      return
    }

    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      const response = await fetch(`${API_PATH}/product/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setProducts(products.filter(p => p._id !== productId))
      } else {
        alert('Failed to delete product')
      }
    } catch (err) {
      alert('Network error')
      console.error('Delete product error:', err)
    }
  }

  if (loading) {
    return (
      <div className="allProductsSection">
        <h3>All Products</h3>
        <p>Loading products...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="allProductsSection">
        <h3>All Products</h3>
        <p style={{ color: '#ef4444' }}>{error}</p>
      </div>
    )
  }

  return (
    <div className="allProductsSection">
      <h3>All Products</h3>
      
      {products.length === 0 ? (
        <p>No products found. Add some products!</p>
      ) : (
        <div className="productsGrid">
          {products.map(product => (
            <div key={product._id} className="productCard">
              {product.image && (
                <img 
                  src={`${API_PATH}/uploads/${product.image}`} 
                  alt={product.productName}
                  className="productImage"
                />
              )}
              <div className="productInfo">
                <h4>{product.productName}</h4>
                <p className="price">₹{product.price}</p>
                {product.description && (
                  <p className="description">{product.description}</p>
                )}
                {product.category && product.category.length > 0 && (
                  <p className="category">
                    {product.category.join(', ')}
                  </p>
                )}
                <button 
                  className="deleteBtn"
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AllProducts
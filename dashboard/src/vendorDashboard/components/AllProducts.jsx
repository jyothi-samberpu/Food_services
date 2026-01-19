import React, { useState, useEffect } from 'react';
import API_PATH from '../utilitys/Apipath';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_PATH}/product/all`);
      const data = await response.json();
      
      if (response.ok) {
        setProducts(data.products || data);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      console.error('Fetch products error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    const token = localStorage.getItem('vendorToken');
    if (!token) {
      alert('Please login first');
      return;
    }

    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`${API_PATH}/product/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Product deleted successfully');
        fetchProducts();
      } else {
        alert('Failed to delete product');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Network error. Please try again.');
    }
  };

  if (loading) {
    return <div className="allProducts"><p>Loading products...</p></div>;
  }

  if (error) {
    return <div className="allProducts"><p style={{color: 'red'}}>{error}</p></div>;
  }

  return (
    <div className="allProducts">
      <h3>All Products</h3>
      {products.length === 0 ? (
        <p>No products found. Add your first product!</p>
      ) : (
        <div className="productsGrid">
          {products.map((product) => (
            <div key={product._id} className="productCard">
              {product.image && (
                <img 
                  src={`${API_PATH}/uploads/${product.image}`} 
                  alt={product.name || product.productName}
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
              <h4>{product.name || product.productName}</h4>
              <p className="price">₹{product.price}</p>
              {product.category && product.category.length > 0 && (
                <p className="category">
                  {Array.isArray(product.category) 
                    ? product.category.join(', ') 
                    : product.category}
                </p>
              )}
              {product.description && (
                <p className="description">{product.description}</p>
              )}
              <button 
                onClick={() => handleDelete(product._id)}
                className="deleteBtn"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProducts;
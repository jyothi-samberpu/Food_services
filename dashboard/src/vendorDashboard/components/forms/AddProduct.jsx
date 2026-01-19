import React, { useState } from 'react';
import API_PATH from '../../utilitys/Apipath';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState([]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCategoryChange = (value) => {
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const addProductHandler = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('vendorToken');
    if (!token) {
      setError('Please login first');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('category', category.join(','));
      formData.append('description', description);
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch(`${API_PATH}/product/add`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert('Product added successfully!');
        setName('');
        setPrice('');
        setCategory([]);
        setDescription('');
        setImage(null);
        document.querySelector('input[type="file"]').value = '';
      } else {
        setError(data.message || data.error || 'Failed to add product');
      }
    } catch (err) {
      console.error('Add product error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="productSection">
      <form className="addProductForm" onSubmit={addProductHandler}>
        <h3>Add Product</h3>

        {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}

        <div>
          <label>Product Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name" 
            required
          />
        </div>

        <div>
          <label>Price</label>
          <input 
            type="number" 
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price" 
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className='checkinp'>
          <label>Category</label>
          <div className='checkboxContainer'>
            <div className='checkboxField'>
              <label>Veg</label>
              <input 
                type="checkbox" 
                value="veg"
                checked={category.includes('veg')}
                onChange={() => handleCategoryChange('veg')}
              />
            </div>
            <div className='checkboxField'>
              <label>Non-Veg</label>
              <input 
                type="checkbox" 
                value="non-veg"
                checked={category.includes('non-veg')}
                onChange={() => handleCategoryChange('non-veg')}
              />
            </div>
          </div>
        </div>

        <div>
          <label>Description</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter product description"
            rows="4"
          ></textarea>
        </div>

        <div>
          <label>Product Image</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  )
}

export default AddProduct

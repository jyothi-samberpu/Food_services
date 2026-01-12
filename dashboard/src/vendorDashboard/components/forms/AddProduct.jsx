import React, { useState } from 'react'
import API_PATH from '../../utilitys/Apipath'

const AddProduct = () => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState([])
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [bestSeller, setBestSeller] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCategoryChange = (value) => {
    if (category.includes(value)) {
      setCategory(category.filter(item => item !== value))
    } else {
      setCategory([...category, value])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const token = localStorage.getItem('token')
    if (!token) {
      setMessage('Please login first')
      setLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('price', price)
      formData.append('category', JSON.stringify(category))
      formData.append('description', description)
      formData.append('bestSeller', bestSeller)
      if (image) {
        formData.append('image', image)
      }

      const response = await fetch(`${API_PATH}/product/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Product added successfully!')
        setName('')
        setPrice('')
        setCategory([])
        setDescription('')
        setImage(null)
        setBestSeller(false)
      } else {
        setMessage(data.error || 'Failed to add product')
      }
    } catch (error) {
      setMessage('Network error. Please try again.')
      console.error('Add Product error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="productSection">
      <form className="addProductForm" onSubmit={handleSubmit}>
        <h3>Add Product</h3>

        {message && (
          <div style={{ 
            padding: '10px', 
            marginBottom: '15px', 
            borderRadius: '6px',
            backgroundColor: message.includes('successful') ? '#22c55e' : '#ef4444',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        <div>
          <label>Product Name</label>
          <input 
            type="text" 
            placeholder="Enter product name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Price</label>
          <input 
            type="number" 
            placeholder="Enter price" 
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
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
            placeholder="Enter product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label>Product Image</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div className="checkboxField">
          <input 
            type="checkbox" 
            id="bestseller" 
            checked={bestSeller}
            onChange={(e) => setBestSeller(e.target.checked)}
          />
          <label htmlFor="bestseller">Bestseller</label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  )
}

export default AddProduct

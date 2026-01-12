import React, { useState } from 'react'
import API_PATH from '../../utilitys/Apipath'

const AddFirm = () => {
  const [firmname, setFirmname] = useState('')
  const [area, setArea] = useState('')
  const [category, setCategory] = useState([])
  const [region, setRegion] = useState('')
  const [offer, setOffer] = useState('')
  const [image, setImage] = useState(null)
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
      formData.append('firmname', firmname)
      formData.append('area', area)
      formData.append('category', JSON.stringify(category))
      formData.append('region', region)
      formData.append('offer', offer)
      if (image) {
        formData.append('image', image)
      }

      const response = await fetch(`${API_PATH}/firm/add-firm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Firm added successfully!')
        setFirmname('')
        setArea('')
        setCategory([])
        setRegion('')
        setOffer('')
        setImage(null)
      } else {
        setMessage(data.message || 'Failed to add firm')
      }
    } catch (error) {
      setMessage('Network error. Please try again.')
      console.error('Add Firm error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="firmSection">
      <form className="addFirmForm" onSubmit={handleSubmit}>
        <h3>Add Firm</h3>

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
          <label>Firm Name</label>
          <input 
            type="text" 
            placeholder="Enter firm name" 
            value={firmname}
            onChange={(e) => setFirmname(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Area/Address</label>
          <input 
            type="text" 
            placeholder="Enter address" 
            value={area}
            onChange={(e) => setArea(e.target.value)}
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
          <label>Region</label>
          <select 
            value={region} 
            onChange={(e) => setRegion(e.target.value)}
            style={{ width: '100%', padding: '10px', marginTop: '6px', borderRadius: '6px', border: 'none' }}
          >
            <option value="">Select Region</option>
            <option value="south-indian">South Indian</option>
            <option value="north-indian">North Indian</option>
            <option value="chinese">Chinese</option>
            <option value="bakery">Bakery</option>
          </select>
        </div>

        <div>
          <label>Offer</label>
          <input 
            type="text" 
            placeholder="Enter Offer (e.g., 20% off)" 
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
          />
        </div>

        <div>
          <label>Firm Image</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        
        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Firm'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddFirm

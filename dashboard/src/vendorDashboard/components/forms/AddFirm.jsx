import React, { useState } from 'react';
import API_PATH from '../../utilitys/Apipath';

const AddFirm = () => {
  const [firmname, setFirmname] = useState('');
  const [area, setArea] = useState('');
  const [category, setCategory] = useState([]);
  const [region, setRegion] = useState([]);
  const [offer, setOffer] = useState('');
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

  const handleRegionChange = (value) => {
    setRegion((prev) =>
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

  const addFirmHandler = async (e) => {
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
      formData.append('firmname', firmname);
      formData.append('area', area);
      formData.append('category', category.join(','));
      formData.append('region', region.join(','));
      formData.append('offer', offer);
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch(`${API_PATH}/firm/add-firm`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.message) {
        alert('Firm added successfully!');
        setFirmname('');
        setArea('');
        setCategory([]);
        setRegion([]);
        setOffer('');
        setImage(null);
        document.querySelector('input[type="file"]').value = '';
      } else {
        setError(data.message || 'Failed to add firm');
      }
    } catch (err) {
      console.error('Add firm error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="firmSection">
      <form className="addFirmForm" onSubmit={addFirmHandler}>
        <h3>Add Firm</h3>

        {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}

        <div>
          <label>Firm Name</label>
          <input 
            type="text" 
            value={firmname}
            onChange={(e) => setFirmname(e.target.value)}
            placeholder="Enter firm name" 
            required
          />
        </div>

        <div>
          <label>Address</label>
          <input 
            type="text" 
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Enter address" 
            required
          />
        </div>

        <div className='checkinp'>
          <label> Category</label>
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

        <div className='checkinp'>
          <label>Region</label>
          <div className='checkboxContainer'>
            <div className='checkboxField'>
              <label>South Indian</label>
              <input 
                type="checkbox" 
                value="south-indian"
                checked={region.includes('south-indian')}
                onChange={() => handleRegionChange('south-indian')}
              />
            </div>
            <div className='checkboxField'>
              <label>North Indian</label>
              <input 
                type="checkbox" 
                value="north-indian"
                checked={region.includes('north-indian')}
                onChange={() => handleRegionChange('north-indian')}
              />
            </div>
            <div className='checkboxField'>
              <label>Chinese</label>
              <input 
                type="checkbox" 
                value="chinese"
                checked={region.includes('chinese')}
                onChange={() => handleRegionChange('chinese')}
              />
            </div>
            <div className='checkboxField'>
              <label>Bakery</label>
              <input 
                type="checkbox" 
                value="bakery"
                checked={region.includes('bakery')}
                onChange={() => handleRegionChange('bakery')}
              />
            </div>
          </div>
        </div>

        <div>
          <label>Offer</label>
          <input 
            type="text" 
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            placeholder="Enter Offer" 
          />
        </div>

        <div>
          <label>Firm Image</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageChange}
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

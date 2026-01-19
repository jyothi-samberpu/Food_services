import React, { useState, useEffect } from 'react';
import API_PATH from '../utilitys/Apipath';

const UserDetails = () => {
  const [vendor, setVendor] = useState(null);
  const [firms, setFirms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVendorDetails();
  }, []);

  const fetchVendorDetails = async () => {
    const token = localStorage.getItem('vendorToken');
    
    if (!token) {
      setError('Please login to view your details');
      setLoading(false);
      return;
    }

    try {
      // Decode JWT to get vendor ID (simple decode, not validation)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      const vendorId = payload.vendorId;

      const response = await fetch(`${API_PATH}/vendor/single-vendor/${vendorId}`);
      const data = await response.json();

      if (response.ok && data.vendor) {
        setVendor(data.vendor);
        
        // Fetch firms for this vendor
        const firmsResponse = await fetch(`${API_PATH}/firm/all`);
        const firmsData = await firmsResponse.json();
        
        if (firmsResponse.ok) {
          const vendorFirms = Array.isArray(firmsData) 
            ? firmsData.filter(firm => firm.vendor?._id === vendorId || firm.vendor === vendorId)
            : [];
          setFirms(vendorFirms);
        }
      } else {
        setError(data.message || 'Failed to fetch vendor details');
      }
    } catch (err) {
      console.error('Fetch vendor details error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vendorToken');
    alert('Logged out successfully');
    window.location.reload();
  };

  if (loading) {
    return <div className="userDetails"><p>Loading your details...</p></div>;
  }

  if (error) {
    return (
      <div className="userDetails">
        <p style={{color: 'red'}}>{error}</p>
        <button onClick={() => window.location.reload()}>Refresh</button>
      </div>
    );
  }

  if (!vendor) {
    return <div className="userDetails"><p>No vendor details found</p></div>;
  }

  return (
    <div className="userDetails">
      <h3>User Details</h3>
      
      <div className="detailsCard">
        <div className="detailRow">
          <strong>Username:</strong>
          <span>{vendor.username}</span>
        </div>
        
        <div className="detailRow">
          <strong>Email:</strong>
          <span>{vendor.email}</span>
        </div>
        
        <div className="detailRow">
          <strong>Total Firms:</strong>
          <span>{firms.length}</span>
        </div>
        
        <div className="detailRow">
          <strong>Account Created:</strong>
          <span>{vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : 'N/A'}</span>
        </div>
      </div>

      {firms.length > 0 && (
        <div className="firmsSection">
          <h4>Your Firms</h4>
          <div className="firmsList">
            {firms.map((firm) => (
              <div key={firm._id} className="firmItem">
                {firm.image && (
                  <img 
                    src={`${API_PATH}/uploads/${firm.image}`} 
                    alt={firm.firmname}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
                <div className="firmInfo">
                  <h5>{firm.firmname}</h5>
                  <p><strong>Area:</strong> {firm.area}</p>
                  {firm.category && firm.category.length > 0 && (
                    <p><strong>Category:</strong> {firm.category.join(', ')}</p>
                  )}
                  {firm.region && firm.region.length > 0 && (
                    <p><strong>Region:</strong> {firm.region.join(', ')}</p>
                  )}
                  {firm.offer && <p className="offer">🎉 {firm.offer}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="logoutSection">
        <button onClick={handleLogout} className="logoutBtn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserDetails;

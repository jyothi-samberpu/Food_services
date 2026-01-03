import React from 'react'

const AddFirm = () => {
  return (
    <div className="firmSection">
      <form className="addFirmForm">
        <h3>Add Firm</h3>

        <div>
          <label>Firm Name</label>
          <input type="text" placeholder="Enter firm name" />
        </div>

        <div>
          <label>Address</label>
          <input type="text" placeholder="Enter address" />
        </div>

       {/*} <div>
          <label>Category</label>
          <input type="text" placeholder="Eg: Restaurant, Services" />
        </div>*/}

    <div className='checkinp'>
        <label> Category</label>
        <div className='checkboxContainer'>
        <div className='checkboxField'>
            <label>Veg</label>
            <input type="checkbox" value="veg" /> 
        </div>

        <div className='checkboxField'>
            <label>Non-Veg</label>
            <input type="checkbox" value="non-veg" />
            
        </div>
    </div>
    </div>

        <div>
          <label>Region</label>
          <input type="text" placeholder="Enter region" />
        </div>


         <div>
          <label>Offer</label>
          <input type="text" placeholder="Enter Offer" />
        </div>
        

         <div>
          <label>Firm Image</label>
          <input type="file" />
        </div>
        
        <div>
            
            <button type="submit">Add Firm</button>
        </div>
       
      </form>
    </div>
  )
}

export default AddFirm

import React from 'react'

const AddProduct = () => {
  return (
    <div className="productSection">
      <form className="addProductForm">
        <h3>Add Product</h3>

        <div>
          <label>Product Name</label>
          <input type="text" placeholder="Enter product name" />
        </div>

        <div>
          <label>Price</label>
          <input type="number" placeholder="Enter price" />
        </div>

        <div>
          <label>Category</label>
          <input type="text" placeholder="Eg: Food, Electronics" />
        </div>

        <div>
          <label>Description</label>
          <textarea placeholder="Enter product description"></textarea>
        </div>

        <div>
          <label>Product Image</label>
          <input type="file" />
        </div>

        <div className="checkboxField">
          <input type="checkbox" id="bestseller" />
          <label htmlFor="bestseller">Bestseller</label>
        </div>

        <button type="submit">Add Product</button>
      </form>
    </div>
  )
}

export default AddProduct

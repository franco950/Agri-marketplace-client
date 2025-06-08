import React, { useState } from 'react';
import { Productform, ProductType, Unit,ProductStatus } from './data'; 
import Navbar from './Navbar';
import './newproduct.css'
import { postProduct } from './api/postproducts';
import { useNavigate } from 'react-router-dom';
// const locations = [
//   'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret',
//   'Thika', 'Meru', 'Kitale', 'Nyeri', 'Machakos'
// ];

const initialState: Productform = {
  name: '',
  type: ProductType.OTHER,
  unit: Unit.OTHER,
  priceperunit: 0,
  quantity: 0,
  variety: '',
  perishdate: new Date(),
  description: '',
  location: '',
  discount: 0,
  supplierthreshold: 0,
  farmerdelivery: false,
  status: ProductStatus.AVAILABLE,
  images:[]
};

const ProductForm: React.FC = () => {
  const [form, setForm] = useState<Productform>(initialState);
  const [errors, setErrors] = useState<{ [K in keyof Productform]?: string }>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const [imageError, setImageError] = useState<string | null>(null);
  const navigate=useNavigate()
 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value, type } = e.target;
  console.log(type)
  const isCheckbox = (el: any): el is HTMLInputElement => el.type === 'checkbox';

  setForm((prev) => ({
    ...prev,
    [name]: isCheckbox(e.target) ? e.target.checked : value
  }));
};


  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.location) newErrors.location = 'Location is required';
    if (!form.description) newErrors.description = 'Description is required';
    if (form.priceperunit <= 0) newErrors.priceperunit = 'Price must be positive';
    if (form.quantity <= 0) newErrors.quantity = 'Quantity must be positive';
    return newErrors;
  };

const handleSubmit = async (e: React.FormEvent) => {
    const formData = new FormData();
  e.preventDefault();
  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  try {
    if (imageFile) {
      
    
    formData.append('name', form.name);
    formData.append('type', form.type);
    formData.append('unit', form.unit);
    formData.append('priceperunit', form.priceperunit.toString());
    formData.append('quantity', form.quantity.toString());
    formData.append('variety', form.variety);
    formData.append('perishdate', form.perishdate.toISOString());
    formData.append('description', form.description);
    formData.append('location', form.location);
    formData.append('discount', form.discount.toString());
    formData.append('supplierthreshold', form.supplierthreshold.toString());
    formData.append('farmerdelivery', form.farmerdelivery.toString());
    formData.append('status',form.status.toString());
    formData.append('images',imageFile)

    postProduct(formData)
    alert("Product submitted successfully!");
    setForm(initialState)
    navigate(`/`)
    } 

  } catch (error) {
    console.error(error);
    alert("Something went wrong!");
  }
};
  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h2>Add New Product</h2>

      <label >
        Product Name:
        <input name="name" value={form.name} onChange={handleChange} />
        {errors.name && <span className="error">{errors.name}</span>}
      </label>

      <label >
        Product Type:
        <select name="type" value={form.type} onChange={handleChange}>
          {Object.values(ProductType).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </label>

      <label>
        Units eg Kg, Liter:
        <select name="unit" value={form.unit} onChange={handleChange}>
          {Object.values(Unit).map((unit) => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>
      </label>

      <label>
        Price Per Unit(Ksh):
        <input type="number" name="priceperunit" value={form.priceperunit} onChange={handleChange} />
        {errors.priceperunit && <span className="error">{errors.priceperunit}</span>}
      </label>

      <label>
        Quantity Available:
        <input type="number" name="quantity" value={form.quantity} onChange={handleChange} />
        {errors.quantity && <span className="error">{errors.quantity}</span>}
      </label>

      <label>
        Variety:
        <input name="variety" value={form.variety} onChange={handleChange} />
      </label>

      <label>
        Perish Date:
        <input type="date" name="perishdate" value={form.perishdate.toISOString().split('T')[0]} onChange={(e) =>
          setForm({ ...form, perishdate: new Date(e.target.value) })
        } />
      </label>

      <label>
        Product Description:
        <textarea name="description" value={form.description} onChange={handleChange} rows={4} />
        {errors.description && <span className="error">{errors.description}</span>}
      </label>
      <label>
        Product Image:
        {imageError && <span className="error">{imageError}</span>}

        <input
        type="file"
        accept="image/*"
        onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            if (!ALLOWED_TYPES.includes(file.type)) {
            setImageError("Only JPEG, PNG or WEBP images are allowed.");
            setImageFile(null);
            return;
            }

            if (file.size > MAX_FILE_SIZE) {
            setImageError("File size must be less than 2MB.");
            setImageFile(null);
            return;
            }
            setImageError(null);
            setImageFile(file);
        }}
        />
        </label>
      {/* <label>
        Location:
        <select name="location" value={form.location} onChange={handleChange}>
          <option value="">Select a town</option>
          {locations.map((town) => (
            <option key={town} value={town}>{town}</option>
          ))}
        </select>
        {errors.location && <span className="error">{errors.location}</span>}
      </label> */}
      <label>
        Location:
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Enter town"
        />
        {errors.location && <span className="error">{errors.location}</span>}
      </label>

      <label>
        Supplier Discount (%):
        <input type="number" name="discount" value={form.discount} onChange={handleChange} />
      </label>
      <label>
        Supplier Threshold:
        <input type="number" name="supplierthreshold" value={form.supplierthreshold} onChange={handleChange} />
      </label>
      <label>
        Farmer Delivery(Will you facilitate order delivery for this product):
        <input type="checkbox" name="farmerdelivery" checked={form.farmerdelivery} onChange={handleChange} />
      </label>

      <button type="submit">Submit Product</button>
    </form>
  );
};
function NewProductPage(){
    return(<div className='full-page'>
    <Navbar/>
    <ProductForm/>
    </div>)
}
export default NewProductPage
import React, { useState } from 'react';
import './ProductDetail.css';
import { Product,ProductType} from './data';
import { useSearchParams} from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSingleProduct } from './api/getproducts';
import Navbar from './Navbar';
import { capitalizeFirstLetter } from './utils/general';
import { patchProduct } from './api/getproducts';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './context/useauth';
const url=import.meta.env.VITE_SERVER_URL

type Props = {
  product: Product;
};

const ProductDetail: React.FC<Props> = ({ product }) => {
  const [imageFiles, setImageFiles] = useState<File[]>([]); 
  const [isEdit, setIsEdit] = useState(false);
  const {userid}=useAuth()
  const isowner=userid===product.farmerid
  const queryClient=useQueryClient()
  const [editedProduct, setEditedProduct] = useState<Product>({ ...product });
  const [images, setImages] = useState<string[]>(Array.isArray(product.images) ? product.images : []);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? parseFloat(value) : value;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };
  function getChangedFields(original: any, updated: any) {
  const changes: any = {};
  for (const key in updated) {
  
    if (typeof updated[key] !== 'object' && updated[key] !== original[key]) {
      changes[key] = updated[key];
    }
   
    if (Array.isArray(updated[key]) && JSON.stringify(updated[key]) !== JSON.stringify(original[key])) {
      changes[key] = updated[key];
    }
  }
  return changes;
}
const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    const files = Array.from(e.target.files);
    const previews = files.map(file => URL.createObjectURL(file));

    setImageFiles(prev => [...prev, ...files]); 
    setImages(prev => [...prev, ...previews]);  
  }
};


  const handleImageRemove = async (index: number) => {
  const imageToRemove = images[index];

  // Confirm before deleting
  const confirm = window.confirm("Are you sure you want to delete this image?");
  if (!confirm) return;

  try {
    // Call backend to delete image
    await fetch(`${url}/api/products/${product.id}/remove-image`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },credentials:'include',
      body: JSON.stringify({ image: imageToRemove }),
    });

    // Update frontend state after successful deletion
    setImages((prev) => prev.filter((_, i) => i !== index));
  } catch (error) {
    console.error("Failed to delete image:", error);
    alert("Failed to delete image. Please try again.");
  }
};
const handleSave = async () => {
  const productWithImages = { ...editedProduct, images };
  const changedFields = getChangedFields(product, productWithImages);

  if (Object.keys(changedFields).length === 0) {
    alert("No changes to save.");
    return;
  }

  try {
  
    await patchProduct(changedFields, product.id, imageFiles);
    alert("Product updated successfully");
    setIsEdit(false);
    const params = { id: product.id };
    queryClient.invalidateQueries({ queryKey: ['product', params] });
  } catch (err) {
    console.error(err);
    alert("Failed to save changes");
  }
}; console.log(url + images[0] )
  return (
    <div className="product-detail-container">
      <div className="product-detail-grid">
        <div className="product-image-section">
          <div className="main-image-wrapper">
            <img
              src={images[0] ? url + images[0] : url+'/uploads/placeholder.jpg'}
             
              
              alt={product.name}
              className="main-image" 
            />
            {isEdit && images[0] && (
              <button onClick={() => handleImageRemove(0)}>Remove</button>
            )}
          </div>

          <div className="thumbnail-row">
            {images.slice(1, 4).map((img: string, index: number) => {
              const actualIndex = index + 1; 
              return (
                <div key={actualIndex} className="thumbnail-wrapper">
                  <img src={url + img} alt={`thumb-${index}`} className="thumbnail" />
                  {isEdit && (
                    <button onClick={() => handleImageRemove(actualIndex)}>Remove</button>
                  )}
                </div>
              );
            })}
          </div>

          {isEdit && (
            <div>
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
            </div>
          )}
        </div>


        <div className="product-info-section">
          {isEdit ? (
            <>Product name
              <input name="name" value={editedProduct.name} onChange={handleInputChange} />
              variety
              <input name="variety" value={editedProduct.variety} onChange={handleInputChange} />
              type
              <select name="type" value={editedProduct.type} onChange={handleInputChange}>
          
                {Object.values(ProductType).map((type) => (
                <option key={type} value={type}>
                    {type}
                </option>
                ))}
                </select>
    
              Description
              <textarea name="description" value={editedProduct.description} onChange={handleInputChange} />
              Price per unit
              <input name="priceperunit" type="number" value={editedProduct.priceperunit} onChange={handleInputChange} />
              Quantity Available
              <input name="quantity" type="number" value={editedProduct.quantity} onChange={handleInputChange} />
              Location
              <input name="location" value={editedProduct.location} onChange={handleInputChange} />
              Estimated Expiry Date
              <input name="perishdate" type="date" value={new Date(editedProduct.perishdate).toISOString().split('T')[0]} onChange={handleInputChange} />
             Farmer Delivery:
              <label >
                <input type="checkbox" checked={editedProduct.farmerdelivery} onChange={(e) => setEditedProduct({ ...editedProduct, farmerdelivery: e.target.checked })} />
              </label>
              Service Delivery:
              <label >
                
                <input type="checkbox" checked={editedProduct.servicedelivery} onChange={(e) => setEditedProduct({ ...editedProduct, servicedelivery: e.target.checked })} />
              </label>
              <button onClick={handleSave}>Save</button>
            </>
          ) : (
            <>
              <h1 className="product-name">{product.name}</h1>
              <p className="product-variety">Variety: {product.variety}</p>
              <p className="product-type">Type: {product.type}</p>
              <p className="product-status">Status: {product.status}</p>
              <p className="product-description">{product.description}</p>
              <div className="product-price">
                <span>Ksh {product.priceperunit.toLocaleString()}</span>
                <span className="unit">/ {product.unit}</span>
              </div>
              <div className="product-meta">
                <p><strong>Quantity:</strong> {product.quantity} {product.unit}</p>
                <p><strong>Location:</strong> {product.location}</p>
                <p><strong>Perish Date:</strong> {new Date(product.perishdate).toLocaleDateString()}</p>
                <p><strong>Delivery:</strong>
                  {product.farmerdelivery && ' Farmer '}
                  {product.servicedelivery && ' Service '}
                </p>
              </div>
            </>
          )}

          <div className="farmer-info">
            <h3>Farmer Info</h3>
            <p>{product.farmer.firstname}</p>
            <p>Email: {product.farmer.email}</p>
            <p>Phone: {product.farmer.phone}</p>
          </div>

          {isowner&&(<button onClick={() => setIsEdit((prev) => !prev)}>
            {isEdit ? 'Cancel' : 'Edit Product'}
          </button>)}
        </div>
      </div>

      <div className="reviews-section">
        <h2>Reviews</h2>
        {product.review.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <ul>
            {product.review.map((rev, i) => (
              <li key={i} className="review">
                <strong>Rating:</strong> {rev.rating}<br />
                <em>{rev.comment}</em>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default function FarmerDetailPage() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || '';
  const uppername = searchParams.get('name') || '';
  const name = capitalizeFirstLetter(uppername);
  const location = searchParams.get('location') || '';
  const id = searchParams.get('id') || '';
  const queryParams = { name, type, location,id };

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', queryParams],
    queryFn: () => getSingleProduct(queryParams ),
    enabled: !!id,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error instanceof Error) return <p>{error.message}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="full-container">
      <Navbar />
      <ProductDetail product={product} />
    </div>
  );
}

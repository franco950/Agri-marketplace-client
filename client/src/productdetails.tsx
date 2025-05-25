// ProductDetail.tsx
import React,{ useState } from 'react';
import './ProductDetail.css';
import { Product } from './data';
import { useSearchParams,useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSingleProduct } from './api/getproducts';
import { capitalizeFirstLetter } from './utils/general';
import Navbar from './Navbar';
import { useCartContext } from './cart';

type Props = {
  product: Product;
};
function QuantityInput({ value, onChange }: { value: number, onChange: (val: number) => void }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) onChange(val);
  };

  return (
    <input
      type="number"
      min={1}
      value={value}
      onChange={handleChange}
      style={{ width: '50px', padding: '5px' }}
    />
  );
}

const ProductDetail: React.FC<Props> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const {addToCart}=useCartContext()
  const navigate=useNavigate()
  const images = Array.isArray(product.images) ? product.images : [];
  const imageUrl = images.length > 0 ? images[0] : '/placeholder.jpg';

  function handleOrder(productid:string,quantity:number){
    addToCart(productid,quantity)
    navigate(`/order/${productid}`)
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail-grid">
        <div className="product-image-section">
          <img src={process.env.PUBLIC_URL+imageUrl} alt={product.name} className="main-image" />
          <div className="thumbnail-row">
            {images.slice(1, 4).map((img: string, index: number) => (
              <img src={img} alt={`thumb-${index}`} key={index} className="thumbnail" />
            ))}
          </div>
          <div className="button-row">
  <button className="buy-now" onClick={()=>handleOrder(product.id,quantity)}>Buy</button>
  
  <QuantityInput value={quantity} onChange={setQuantity} />
  <button className="add-to-cart"onClick={()=>addToCart(product.id,quantity)}>Add to cart</button>
</div>

        </div>

        <div className="product-info-section">
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

          <div className="farmer-info">
            <h3>Farmer Info</h3>
            <p>{product.farmerobj.firstname}</p>
            <p>Email: {product.farmerobj.email}</p>
            <p>Phone: {product.farmerobj.phone}</p>
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <h2>Reviews</h2>
        {product.reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <ul>
            {product.reviews.map((review, i) => (
              <li key={i} className="review">
                <strong>Rating:</strong> {review.rating}<br />
                <em>{review.comment}</em>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default function ProductDetailPage() {
     const [searchParams] = useSearchParams();
        const type = searchParams.get('type') || '';
        const uppername = searchParams.get('name') || '';
        const name = capitalizeFirstLetter(uppername);
        const location = searchParams.get('location') || '';
        const id = searchParams.get('id') || '';
        const queryParams = { name, type, location,id };
        
  
    const { data: product, isLoading, error } = useQuery({
      queryKey: ['product', id],
      queryFn: () => getSingleProduct(queryParams),
      enabled: !!id,
    });
  
    if (isLoading) return <p>Loading...</p>;
    if (error instanceof Error) return <p>{error.message}</p>;
    
    if (!product) return <p>Product not found.</p>;
  
    return (<div className="full-container">
    <Navbar/>
    <ProductDetail product={product} />
    </div>)
    
  }


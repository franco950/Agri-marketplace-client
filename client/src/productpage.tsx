import { Link, useNavigate,useSearchParams } from "react-router-dom";
import { getProductData } from "./api/getproducts";
import { useQuery } from '@tanstack/react-query';
import { Product,ProductType,Role } from "./data";
import "./products.css"
import Navbar from "./Navbar";
import React from 'react';
import { useAuth } from "./context/useauth";
import { capitalizeFirstLetter } from "./utils/general";
  
  type Props = {
    products: Product[];
  };
  
  const readableProductType = (type: ProductType): string =>
    type.charAt(0) + type.slice(1).toLowerCase();
  
  const extractImage = (images: any): string => {
    try {
      const parsed = typeof images === 'string' ? JSON.parse(images) : images;
      return Array.isArray(parsed) ? parsed[0] : '';
    } catch (err) {
      console.error('Failed to parse product image JSON:', err);
      return '';
    }
  };
  
  const CategoryProductList: React.FC<Props> = ({ products }) => {
    const categories = Object.values(ProductType);
    const navigate=useNavigate()
    const{userRole}=useAuth()
    const isfarmer=userRole===Role.farmer
    function handleSearch(id:string){
      const params={id:id}
      const queryString = new URLSearchParams(params as Record<string, string>).toString();
      if (isfarmer){navigate(`/productdetails/farmer?${queryString}`)}else{
      navigate(`/productdetails?${queryString}`)}}
  
    return (
      <div className="app">
        {(isfarmer)?(<h1> My {process.env.PUBLIC_URL}Products</h1>):(<h1>{process.env.PUBLIC_URL}Products</h1>)}
        {(isfarmer)?(
          <Link to="/product/farmer" className="browse-link">Browse All</Link>):(
          <Link to="/product" className="browse-link">Browse All</Link>)}

  
        {categories.map((category) => {
          const filtered = products.filter((p) => p.type === category);
          if (filtered.length === 0) return null;
  
          return (
            <div className="category" key={category}>
              <h2>{readableProductType(category)}</h2>
              <div className="card-container">
                {filtered.map((product) => {
                  const imageUrl = extractImage(product.images);
                  return (
                    <div className="card" key={product.id}onClick={()=>handleSearch(product.id)}>
                      {imageUrl && (
                        <img
                          src={process.env.PUBLIC_URL+imageUrl}
                          alt={product.name}
                          style={{ width: '100%',height:'50%', borderRadius: '8px' }}
                        />
                      )}
                      <h3>{product.name}</h3>
                      <p>{product.variety}</p>
                      <p>
                        {product.quantity} {product.unit}
                      </p>
                      <p style={{ color: '#4CAF50' }}>
                        Ksh {product.priceperunit.toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  export default function ProductPage() {
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') || '';
    const uppername = searchParams.get('name') || '';
    const name = capitalizeFirstLetter(uppername);
    const location = searchParams.get('location') || '';
    const id = searchParams.get('id') || '';
    const queryParams = { name, type, location,id };
    
   
  
    const {
      data: products,
      isLoading,
      error,
    } = useQuery({
      queryKey: ['products', queryParams],
      queryFn: () => getProductData(queryParams),
      staleTime: 1000 * 60 * 5,
    });
  
    if (isLoading) return <p>Loading...</p>;
    if (error instanceof Error) return <p>{error.message}</p>;
    if (!products) return <p>No products to display</p>;
    
    return (
      <div className="full-container">
        <Navbar />
        <CategoryProductList products={products} />
      </div>
    );
  }
      
      







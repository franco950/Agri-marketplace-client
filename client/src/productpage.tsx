import { Link, useNavigate,useSearchParams } from "react-router-dom";
import { getProductData } from "./api/getproducts";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Product,ProductType,Role } from "./data";
import "./products.css"
import Navbar from "./Navbar";
import React, { useState } from 'react';
import { useAuth } from "./context/useauth";
import { capitalizeFirstLetter } from "./utils/general";
const url=import.meta.env.VITE_SERVER_URL

  type Props = {
    products: Product[],
    result:string
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
  
  const CategoryProductList: React.FC<Props> = ({ products,result }) => {
    const categories = Object.values(ProductType);
    const navigate=useNavigate()
    const{userRole}=useAuth()
    const isfarmer=userRole===Role.farmer
    const[all,setAll]=useState<Boolean>(false)
    
    const queryclient=useQueryClient()

    function handleSearch(id:string){
      const params={id:id}
      const queryString = new URLSearchParams(params as Record<string, string>).toString();
      if (isfarmer){navigate(`/productdetails/farmer?${queryString}`)}else{
      navigate(`/productdetails?${queryString}`)}}
    function handleAdd(){navigate(`/product/farmer/new`) }

      if (isfarmer && result=='emptyfarmer'&& all==false){
              return(<>You do not have any products.
                <button onClick={()=>setAll(true)}>Browse all products</button>
                <button onClick={()=>handleAdd()}>Add a product</button></>
              )
            }
      if (isfarmer && result=='all'){
      queryclient.invalidateQueries({ queryKey: ['reply'] });}
  
    return (
      <div className="app">
        {(isfarmer && result=='search')?(<h1> My Products</h1>):(<h1>Products</h1>)}
        {(isfarmer && result=='search')?(<>
        
          
          <Link to="/product" className="browse-link">Back to marketplace</Link></>):(
          <Link to="/product" className="browse-link">Browse All</Link>)}
          {isfarmer &&<button onClick={()=>handleAdd()}>Add a product</button>}

  
        {categories.map((category) => {
          const filtered = products.filter((p) => p.type === category);
          if (filtered.length === 0 ) {
            return null
          }; 
          
          return (
            <div className="category" key={category}>
              <h2>{readableProductType(category)}</h2>
              <div className="card-container">
                {filtered.map((product) => {
                  const imageUrl = url+extractImage(product.images);
             
                  return (
                    <div className="card" key={product.id}onClick={()=>handleSearch(product.id)}>
                      {imageUrl && (
                        <img
                          src={imageUrl}
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
    const farmerid=searchParams.get('farmerid')||'';
    const queryParams = { name, type, location,id,farmerid };
   
    const {
      data: reply,
      isLoading,
      error,
    } = useQuery({
      queryKey: ['reply', queryParams],
      queryFn: () => getProductData(queryParams),
      staleTime: 1000 * 60 * 5,
    });
  
    if (isLoading) return <p>Loading...</p>;
    if (error instanceof Error) return <p>{error.message}</p>;
    if (!reply) return <p>No products to display</p>;
    
    return (
      <div className="full-container">
        <Navbar />
        <CategoryProductList products={reply.myproducts}
                            result={reply.result} />
      </div>
    );
  }
      
      







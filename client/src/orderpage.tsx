import { useParams,useNavigate } from "react-router-dom"
import { useCartContext } from "./cart"
import { getCartProducts } from "./api/getproducts"
import { postOrders } from "./api/orders"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import Navbar from "./Navbar"
import './productDetail.css'
import React from 'react';
import { Product,Delivery } from './data'; 
import './orderPage.css';
const url=import.meta.env.VITE_SERVER_URL

export type newOrder={
    productid:string
    farmerid:string
    quantity:number
    totalcost:number
    deliveryoption:Delivery

}

function OrderPage(){
    const navigate=useNavigate()
    const [selfdelivery,setDelivery]=useState<boolean>(false)
    const{id}=useParams()
    const{cart,addToCart,removeFromCart}=useCartContext()
    const itemIds=cart.map(item=>item.productid)
    
    let querykey:string[];
    if (id=='1'||!id){
        querykey=itemIds
    }
    else { 
        querykey=[id]}
   
    if(querykey.length==0||!querykey){
        return(<div className="full-container">
        <Navbar/>
        <p>no items in cart</p>
        </div >)
    }

    
    const {
        data: products,
        isLoading,
        error,
      } = useQuery({
        queryKey: ['products', querykey],
        queryFn: () => getCartProducts(querykey),
        staleTime: 1000 * 60 * 5,
      });
    
    if (isLoading) return <p>Loading...</p>;
    if (error instanceof Error) return <p>{error.message}</p>;
    if (!products) return <p>No products to display</p>;


    type Props = {
    products: Product[];
    };

    const OrderPage: React.FC<Props> = ({ products }) => {
    const { cart } = useCartContext();
    

    // Match quantity from cart to each product
    const productsWithQuantities = products.map(product => {
        const item = cart.find(c => c.productid === product.id);
        
        const quantity = item?.quantity ?? 0;
        const subtotal = product.priceperunit * quantity;
        return { ...product, quantity, subtotal };
    });
    const productOrder:newOrder[] = products.map(product => {
        const item = cart.find(c => c.productid === product.id);
        const productid=product.id
        const farmerid=product.farmerid
        const quantity = item?.quantity ?? 0;
        const totalcost = product.priceperunit * quantity;
        const deliveryoption=(selfdelivery&&Delivery.SELF)||Delivery.SERVICE
        return {productid,farmerid, quantity,totalcost, deliveryoption};
    });
    const total = productsWithQuantities.reduce((acc, prod) => acc + prod.subtotal, 0);
    const handleQuantityChange = (productId: string, delta: number) => {
        addToCart(productId,delta)
      };
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDelivery(e.target.checked)
    
  };
    async function handleBuy(){
        await postOrders(productOrder)
        const productIds: string[] = productOrder.map((order) => order.productid);
        productIds.forEach(id => {removeFromCart(id)}); 
        navigate(`/tracking/${1}`)
      };
      
    return (
        <div className="full-container">
        <Navbar />
        <h1 className="checkout-heading">Order Summary</h1>

        <div className="checkout-list">
            {productsWithQuantities.map(product => (
            <div key={product.id} className="checkout-item">
                <img
                src={Array.isArray(product.images) ? url+product.images[0] : '/placeholder.jpg'}
                alt={product.name}
                className="product-thumb"
                />
                <div className="checkout-details">
                <h2>{product.name}</h2>
                <p>Unit Price: Ksh {product.priceperunit.toLocaleString()}</p>
                <p>Quantity: {product.quantity} {product.unit}</p>
                
                <div className="quantity-control">
                <button onClick={() => handleQuantityChange(product.id, -1)}>-</button>
                <span>{product.quantity}</span>
                <button onClick={() => handleQuantityChange(product.id, 1)}>+</button>
                </div>
                <p>Subtotal: Ksh {product.subtotal.toLocaleString()}</p>
                <p>Delivery: {selfdelivery&&(Delivery.SELF)||Delivery.SERVICE}</p>
                </div>
                <button onClick={()=>removeFromCart(product.id)}>Remove item</button>
            </div>
            ))}
        </div>
        

        <div className="checkout-total">
            <h2>Total: Ksh {total.toLocaleString()}</h2>
            <p><label className="checkbox-label"><input type="checkbox" checked={selfdelivery} onChange={handleCheckboxChange} />  I will handle delivery
            </label></p><br/>
            
            <button className="confirm-button"onClick={()=>handleBuy()}>Confirm Order</button>
        </div>
        </div>
    );
    };
    return(<>
        
        <OrderPage products={products} /></>)
    }
export default OrderPage
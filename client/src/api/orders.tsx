import { Order } from "../data";
import { newOrder } from "../orderpage";
const url=import.meta.env.VITE_SERVER_URL
export async function getOrders():Promise<Order[]>{
    try{
        
    const query=`${url}/order`

    const response=await fetch(query,{
        method: "GET",
        headers: {
          "Content-Type": "application/json", 
        },
        credentials: "include",
       
    })
    const myorders = await response.json(); 
    
    if (!response.ok) { 
        const error = await response.json();
        throw new Error(error.message || "Request failed")};
   
    return myorders||[]}

    catch(error:any) {
        console.error("Error retrieving orders:", error);
        throw new Error(error)} 
  }
export async function postOrders(orders:newOrder[]):Promise<Order[]>{
    try{
        
    const query=`${url}/order`

    const response=await fetch(query,{
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        credentials: "include",
        body:JSON.stringify(orders)
       
    })
    const myorders = await response.json(); 
    
    if (!response.ok) { 
        const error = await response.json();
        throw new Error(error.message || "Request failed")};
   
    return myorders||[]}

    catch(error:any) {
        console.error("Error retrieving orders:", error);
        throw new Error(error)} 
  }
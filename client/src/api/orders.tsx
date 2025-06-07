import { Order,Tracking } from "../data";
import { newOrder } from "../orderpage";
const url=import.meta.env.VITE_SERVER_URL
type OrdersResponse = {
  orders: Order[];
  missingreviews: string[];
};

export async function getOrders(): Promise<OrdersResponse> {
  try {
    const query = `${url}/order`;
    const response = await fetch(query, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Request failed");
    } 
    
    return {
      orders: data.orders,
      missingreviews: data.missingreviews,
    };
  } catch (error: any) {
    console.error("Error retrieving orders:", error);
    throw new Error(error);
  }
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


export async function patchOrder(orderId: string, newStatus: Tracking) {
    try{
        const query=`${url}/order/farmer`
        const response = await fetch(query, {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify({orderid:orderId,tracking: newStatus }),
        });
        const reply= await response.json();

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message||'Failed to send review');}
   
    return reply}
        catch(error:any) {
        console.error("Error sending review:", error);
        throw new Error(error)} }

export async function sendReview({
    orderId,
    rating,
    comment,
    }: {
    orderId: string;
    rating: number;
    comment: string;
    })  {
    try{
        const query=`${url}/product/review`
        const response = await fetch(query, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({ orderId, rating, comment }),
        });
        const reply= await response.json();

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message||'Failed to send review');}
   
    return reply}
        catch(error:any) {
        console.error("Error sending review:", error);
        throw new Error(error)} }


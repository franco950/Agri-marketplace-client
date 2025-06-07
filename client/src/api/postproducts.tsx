
const url=import.meta.env.VITE_SERVER_URL
export async function postProduct(product:any):Promise<number>{
    try{
        
    const query=`${url}/product/farmer`

    const response=await fetch(query,{
        method: "POST",
    
        credentials: "include",
        body:product

    })
    const result = await response.json(); 
    
    if (!response.ok) { 
        const error = await response.json();
        throw new Error(error.message || "Request failed")};
   
    return result}

    catch(error:any) {
        console.error("Error posting product:", error);
        throw new Error(error)} 
  }
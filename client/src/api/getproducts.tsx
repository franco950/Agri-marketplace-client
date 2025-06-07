import { searchParams } from "../homepage";
import { Product } from "../data";
const url=import.meta.env.VITE_SERVER_URL
type reply={
    myproducts:Product[],
    result:string
}
export async function getProductData(params:searchParams):Promise<reply>{
    
    try{
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== '')
        );
        const allParamsEmpty = Object.keys(filteredParams).length === 0;
        let query;
    if (allParamsEmpty){
        query=`${url}/product`
        
    }
    else{
        const queryString = '?'+new URLSearchParams(filteredParams as Record<string, string>).toString();
        query=`${url}/product${queryString}`

    }
    const response=await fetch(query,{
        method: "GET",
        headers: {
          "Content-Type": "application/json", 
        },
        credentials: "include",
    
    })
    const reply = await response.json(); 
    if (!response.ok) { 
        const error = await response.json();
        throw new Error(error.message || "Request failed")};
    if (!allParamsEmpty && reply.result=='all'){
        throw new Error('no products found')}
    
    return reply}
    
    
    catch(error:any) {
        console.error("Error retrieving products:", error);
        throw new Error(error)} 
  }

  export async function getSingleProduct(params:searchParams):Promise<Product>{
    try{
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== '')
        );
        const allParamsEmpty = Object.keys(filteredParams).length === 0;
        let query;
    if (allParamsEmpty){
        query=`${url}/product`
    }
    else{
        const queryString = '?'+new URLSearchParams(filteredParams as Record<string, string>).toString();
        query=`${url}/product${queryString}`
    }
    const response=await fetch(query,{
        method: "GET",
        headers: {
          "Content-Type": "application/json", 
        },
        credentials: "include",
    
    })
    const {myproducts,result} = await response.json(); 
    if (!response.ok) { 
        const error = await response.json();
        throw new Error(error.message || "Request failed")};
    if (!allParamsEmpty && result=='all'){
        throw new Error('no products found')}
    return myproducts[0]}
    
    
    catch(error:any) {
        console.error("Error retrieving products:", error);
        throw new Error(error)} 
  }
  
  export async function getCartProducts(productIds:string[]):Promise<Product[]>{
    try{
        
    const query=`${url}/product/checkout`

    
    const response=await fetch(query,{
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        credentials: "include",
        body: JSON.stringify(productIds)
    
    
    })
    const myproducts = await response.json(); 
    
    if (!response.ok) { 
        const error = await response.json();
        throw new Error(error.message || "Request failed")};
   
    return myproducts||[]}

    catch(error:any) {
        console.error("Error retrieving products:", error);
        throw new Error(error)} 
  }

export async function patchProduct(changedFields: any, id: string, files: File[]): Promise<Product> {
  const formData = new FormData();

  formData.append("id", id);
  formData.append("changedFields", JSON.stringify(changedFields)); 

  // append new files
  files.forEach((file, _index) => {
    formData.append("images", file);
  });

  const response = await fetch(`${url}/product/farmer`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });

  const myproduct = await response.json();

  if (!response.ok) {
    throw new Error(myproduct.message || "Request failed");
  }

  return myproduct;
}

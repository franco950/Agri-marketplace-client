import { searchParams } from "../homepage";
import { Product } from "../data";
export async function getProductData(params:searchParams):Promise<Product[]>{
    try{
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== '')
        );
        const allParamsEmpty = Object.keys(filteredParams).length === 0;
        let query;
    if (allParamsEmpty){
        query=`http://localhost:5000/product`
    }
    else{
        const queryString = '?'+new URLSearchParams(filteredParams as Record<string, string>).toString();
        query=`http://localhost:5000/product${queryString}`
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
    return myproducts}
    
    
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
        query=`http://localhost:5000/product`
    }
    else{
        const queryString = '?'+new URLSearchParams(filteredParams as Record<string, string>).toString();
        query=`http://localhost:5000/product${queryString}`
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
        
    const query=`http://localhost:5000/product/checkout`

    
    const response=await fetch(query,{
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        credentials: "include",
        body: JSON.stringify(productIds)
    
    
    })
    const myproducts = await response.json(); 
    console.log(myproducts)
    if (!response.ok) { 
        const error = await response.json();
        throw new Error(error.message || "Request failed")};
   
    return myproducts||[]}

    catch(error:any) {
        console.error("Error retrieving products:", error);
        throw new Error(error)} 
  }

    export async function patchProduct(values:any,id:string):Promise<Product>{
    try{
        
    const query=`http://localhost:5000/product/farmer`

    
    const response=await fetch(query,{
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", 
        },
        credentials: "include",
        body: JSON.stringify({values,id})
    
    
    })
    const myproduct = await response.json(); 
    if (!response.ok) { 
        const error = await response.json();
        throw new Error(error.message || "Request failed")};
   
    return myproduct}

    catch(error:any) {
        console.error("Error updating product:", error);
        throw new Error(error)} 
  }
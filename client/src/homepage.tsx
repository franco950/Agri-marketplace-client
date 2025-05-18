import { useState,useEffect } from 'react';
import Navbar from './Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/useauth';
import { Role } from './data';
const url=process.env.SERVER_URL
async function getHomeData(setMessage: React.Dispatch<React.SetStateAction<string>>,
  setProducts: React.Dispatch<React.SetStateAction<any>>){
   
  try{
  const response=await fetch(`${url}/home`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json", 
      },
      credentials: "include",
  
  })
  const data = await response.json();
  if (!response.ok) { 
      throw new Error(data.message || "Request failed")};
  
  setProducts(data)
      }
  catch(error:any) {
      console.error("Error retrieving products:", error);
      setMessage(error.message || "Error  retrieving products");} 
}

export type searchParams={
  name?:string;
  location?:string;
  type?:string;
}
function Homepage(){
  const {userRole}=useAuth()
  const isfarmer=userRole===Role.farmer
  const navigate=useNavigate()
  const [products, setProducts] = useState<any>(null);
  const [message,setMessage]=useState('')
  const[params,setParams]=useState<searchParams>({name:'',location:'',type:''})
  useEffect(() => {
    getHomeData(setMessage, setProducts);
  }, []);
  const types = products?.types || [];
  const locations = products?.locations || [];
  const uppernames=products?.names || [];
  const names:string[]=uppernames.map((name: string) => name.toLowerCase());

  


  function mapstuff(stuff:any[]){
    if (!stuff || stuff.length === 0) return null;
  
    return (stuff.map((option:any) => (
      <option key={option} value={option}>
        {option}
      </option>
    )))
  }
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setParams((prevData) => ({
      ...prevData,
      type: e.target.value,
    }));
  };
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setParams((prevData) => ({
      ...prevData,
      location: e.target.value,
    }));
  };
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams((prevData) => ({
      ...prevData,
      name: e.target.value.toLowerCase(),
    }));
  };
  function handleSearch(searchParams:searchParams,setMessage:React.Dispatch<React.SetStateAction<string>>){
    const filteredParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, value]) => value !== '')
    );
    if (!searchParams.location && !searchParams.name && !searchParams.type){
      setMessage('please enter at least one parameter')
      return
    }
    else if (names!=null && searchParams.name && !names.includes(searchParams.name)){
      setMessage('no product with that name found')
      return
    }
    
    else if (searchParams.location || searchParams.name ||searchParams.type){ 
      const queryString = new URLSearchParams(filteredParams as Record<string, string>).toString();
      {isfarmer?(navigate(`/product/farmer?${queryString}`)):(navigate(`/product?${queryString}`))}
      }
  }
    return (<>
    <div className='hero'>
    <div className='glass-card'>
    <Navbar/>
    <div className="hero-content">
        <h1>Direct from Farmers<br/> to You</h1>
        <p>
          Source fresh produce and grains directly from local farms.<br />
          Connecting buyers and farmers for fair, transparent trade.
        </p>
        {isfarmer?(
          <Link to={'/product/farmer'} className="explore-btn">View My products</Link>
        ):(
          <Link to={'/product'} className="explore-btn">Explore Marketplace</Link>)}
        
      </div>
      <p className='message'>{message}</p>
      <div className="search-box">
      
        <input type="text" placeholder="Search products" id='name'
         onChange={handleNameChange} value={params.name}/>
        <select defaultValue='' onChange={handleTypeChange}>
        <option value=''  disabled >Category</option>
          {mapstuff(types)}
        </select>
        <select defaultValue='' onChange={handleLocationChange}>
        <option value='' disabled >Location</option>
          {mapstuff(locations)}
        </select>
        <button className="search-btn" onClick={()=>handleSearch(params,setMessage)}>Search</button>
      </div></div></div></>)
}
export default Homepage
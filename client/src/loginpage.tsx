import { Link,useNavigate } from 'react-router-dom';
 import React,{ useState } from "react";
 import { useAuth } from "./context/useauth";
 import { Navigate } from 'react-router-dom';
 import './loginpage.css';

type Loginform={
    email:string
    password:string}
const url=import.meta.env.VITE_SERVER_URL
async function login(formData:Loginform,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setIsLoggedin: (value: boolean) => void  ,
    navigate: (path: string) => void){
   

    if (!formData.email || !formData.password){
        setMessage('Error: Enter a valid username and password');
      return;}
    try{
    const response=await fetch(`${url}/login`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify(formData),
        credentials: "include",
    
    })
    
    const data = await response.json();
    if (response.status === 403) {
        //  already authenticated, redirect to home
        
        
        navigate("/");
        alert('you are already logged in!')}
       
    else if (!response.ok) { 
        throw new Error(data.message || "Login failed")};
    
    setIsLoggedin(true);
    setMessage(`Welcome, ${data.username || "User"}!`)
    navigate('/');
        }
    catch(error:any) {
        console.error("Error logging in:", error);
        setMessage(error.message || "Error logging in. Check username and password.");}
    
     }

function LoginPage(){
    
    const [formData, setFormData]=useState({email:'',password:''})
    const [message, setMessage] = useState<string>("")
    const navigate = useNavigate();
    const { isLoggedin, setIsLoggedin } = useAuth();
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        
        setFormData({ ...formData, [event.target.name]: event.target.value });}
    
    if (isLoggedin){return  <Navigate to="/" />;}
    const handleLogin = async () => {
        await login(formData, setMessage, setIsLoggedin, navigate);
      };
    return(<>

    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Log in to continue</p>
        
        <div className="login-form">
          <div className="form-group">
          <p>{message}</p>
            <label>Email</label>
            <input type='email'name="email" value={formData.email}onChange={handleChange}></input>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name='password'value={formData.password}onChange={handleChange}></input>
          </div>
          <button className="login-button" onClick={handleLogin}>login</button>
          
          
          <div className="login-links">
            <a href="#">Forgot password?</a>
          </div>
          
          <div className="divider"></div>
          
          <p className="signup-text">
            Don't have an account? <Link to={`/register`} ><button>sign up</button></Link>
          </p>
          <Link to={`/`} className='signup-text'>proceed to homepage without login</Link>
        </div>
      </div>
    </div>
    </>)
}

export default LoginPage
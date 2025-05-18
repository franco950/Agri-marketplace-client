import { Link,useNavigate } from 'react-router-dom';
 import React,{ useState } from "react";
 import { useAuth } from "./context/useauth";
 import { Navigate } from 'react-router-dom';
 import {usertypes} from './dropdown';
 import Dropdown from './dropdown';
 import './registration.css';
const url=process.env.SERVER_URL
type Regform={
    firstname:string
    lastname:string
    usertype:usertypes
    phone:string
    email:string
    password:string
    confirmation:string}

function isStrongPassword(password:string) {
    return /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /\d/.test(password) &&
            /[^A-Za-z0-9]/.test(password);
    }
async function Register(formData:Regform,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setFormData: React.Dispatch<React.SetStateAction<Regform>>,
    navigate: (path: string) => void){
        const phoneRegex = /^[+]?[0-9]{7,15}$/;
   
    
    if (!formData.firstname||!formData.lastname||formData.usertype==usertypes.guest||!formData.phone||!formData.email || !formData.password|| !formData.confirmation){
        setMessage('Error: Pease fill all fields');
      return;}
    else if (!phoneRegex.test(formData.phone)) {
        setMessage("Invalid phone number. Use digits only, 7-15 characters, starting with country code eg +254.");
        return}
    else if ((formData.password).length < 8){
        setMessage('Error: Passwords must be at least 8 characters long');
        return
    }
    else if(!isStrongPassword(formData.password)){
        setMessage('Error: Password should contain a mixture of uppercase, lowercase, numbers and symbols');
        return
    }
    else if (formData.password !== formData.confirmation){
        setMessage('Error: Passwords do not match');
        return
    }console.log(formData.usertype)
    
    try{
        const submitdata={firstname:formData.firstname,lastname:formData.lastname,
            usertype:formData.usertype, phone:formData.phone,email:formData.email,password:formData.password}
    const response=await fetch(`${url}/register`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify(submitdata),
        credentials: "include",
    
    })
    
    const data = await response.json();
    if (response.status === 400) {
        //  already authenticated, redirect to home
        setMessage( data.message)
        setFormData({firstname:'',lastname:'',usertype:usertypes.guest,phone:"",email:'',password:'',confirmation:''})
        return}
       
    else if (!response.ok) { 
        throw new Error(data.message || "Registration failed")};
    setMessage(`success! you can now log in.`)
    navigate('/login');
    
        }
    catch(error:any) {
        console.error("Error in registration:", error);
        setMessage(error.message || "Error registering the account, please try again.");}
    
     }

function RegistrationPage(){
    
    const [formData, setFormData]=useState({
        firstname:'',lastname:'',usertype:usertypes.guest,phone:"",email:'',password:'',confirmation:''})
    const [message, setMessage] = useState<string>("")
    const navigate = useNavigate();
    const { isLoggedin } = useAuth();
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });}
    
    if (isLoggedin){return  <Navigate to="/" />;}
    const handleLogin = async () => {
        await Register(formData, setMessage,setFormData,  navigate);
      };
    return(<>
    
    
        <div className="registration-page">
          <div className="login-card-registration">
            <h1 className="login-title">Registration</h1>
            <p className="login-subtitle">Create an account</p>
            
            <div className="login-form">
            
             <div className='form-group'>
                
                <label >firstname</label>
                <input name="firstname" value={formData.firstname}onChange={handleChange}></input><br/>
                <label >lastname</label>
                <input name="lastname" value={formData.lastname}onChange={handleChange}></input><br/>
                <Dropdown
                value={formData.usertype}
                onChange={(newType) => setFormData({ ...formData, usertype: newType })}/><br/>
                <label >phone number<br/></label>
                <p  className="signup-text"> start with country code eg +254, then use digits only, 7-15 characters</p><br/>
                <input name="phone" type="tel" value={formData.phone}onChange={handleChange}></input><br/>
                <label >email</label>
                <input type='email'name="email" value={formData.email}onChange={handleChange}></input><br/>
                <p className="signup-text">password must be at least 8 characters long<br/></p>
                <p className="signup-text">Password should contain a mixture of uppercase, lowercase, numbers and symbols</p><br/>
                <label>password</label>
                <input type="password" name='password'value={formData.password}onChange={handleChange}></input><br/>
                <label>confirm password</label>
                <input type="password" name='confirmation'value={formData.confirmation}onChange={handleChange}></input><br/>
                <p className="error">{message}</p>
                <button className="login-button" onClick={handleLogin}>register</button><br/>
             </div>
              
              
              <div className="divider"></div>
              
              <p className="signup-text">
              <Link to={`/login`} ><button>log in</button></Link>
              </p>
              <Link to={`/`} className='signup-text'>proceed to homepage without registration</Link>
            </div>
          </div>
        </div>
    </>)
}


export default RegistrationPage 
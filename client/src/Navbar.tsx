import { useAuth } from "./context/useauth";
import { useCartContext } from "./cart";
import { useNavigate, Link} from "react-router-dom";

export default function Navbar() {
  let { isLoggedin, logout ,userRole} = useAuth();
  const { total } = useCartContext();
  const navigate=useNavigate()
  console.log('usertype:',userRole)


  return (
    <nav className="navbar">
      <li className="logo">AgriGo</li>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      {(userRole=='farmer')?(
        <li><Link to="/product/farmer">my products</Link></li>
        
      ):('')}
      {isLoggedin ? (
        <>
        <li><button className="cart-logo" onClick={()=>navigate(`/order/1`)}>{total}</button></li>
        <li><Link to="/profile">profile</Link></li>
        <Link to='/tracking/1'>my Orders</Link>
        <li><button onClick={logout}>Logout</button></li></>
        
      ) : (
        <li className="sign-in"><Link to="/login">Login</Link></li>
        
      )}</ul>
    </nav>
  );
}

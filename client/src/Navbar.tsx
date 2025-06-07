import { useAuth } from "./context/useauth";
import { useCartContext } from "./cart";
import { useNavigate, Link} from "react-router-dom";
const url=import.meta.env.VITE_SERVER_URL
export default function Navbar() {
  let { isLoggedin, logout ,username, userRole} = useAuth();
  const { total } = useCartContext();
  const navigate=useNavigate()
  return (
    <nav className="navbar">
      <li className="logo">AgriGo</li>
      
      <ul className="nav-links">
        <li className="text-role" >{username}: {userRole&& userRole}</li>
        <li className="text"><Link to="/">Home</Link></li>
      
       
      {(userRole=='farmer')?(
        <li className="text" ><Link to="/product/farmer?farmerid=1">my products</Link></li>
        
      ):('')}
      {isLoggedin ? (
        <>
        {userRole!=='farmer'&&<li><div className="image-container"onClick={()=>navigate(`/order/1`)}>
        <div className="cart-quantity">{total}</div>
        <img className='cart-image'src={url+'/uploads/cart.png'}></img></div></li>}
        <li className="text"><Link to="/profile">Profile</Link></li>
        <li className="text"><Link to='/tracking/1'>Orders</Link></li>
        <li><button onClick={logout}>Logout</button></li></>
        
      ) : (
        <li className="sign-in"><Link to="/login">Login</Link></li>
        
      )}</ul>
    </nav>
  );
}

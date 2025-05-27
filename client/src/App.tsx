import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider} from  "./context/AuthContext"
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from './loginpage';
import RegistrationPage from './registrationpage';
import HomePage from './homepage';
import ProductPage from './productpage';
import OrderPage from "./orderpage"
import TrackingPage from './trackingpage';
import ProfilePage from './profilepage';
import ProductDetail from './productdetails';
import { CartProvider } from './cart'
import FarmerDetailPage from './farmerproduct';

console.log(import.meta.env.MODE)
function App(){
  return(<>
  
  <AuthProvider>
    
  <CartProvider>
    <Router basename={import.meta.env.MODE === 'production' ? '/Agri-marketplace-client' : '/'}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/product" element={<ProtectedRoute><ProductPage /></ProtectedRoute>} />
         <Route path="/product/farmer" element={<ProtectedRoute><ProductPage /></ProtectedRoute>} />
        <Route path="/productdetails" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
        <Route path="/productdetails/farmer" element={<ProtectedRoute><FarmerDetailPage /></ProtectedRoute>} />
        <Route path="/order/:id" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
        <Route path="/tracking/:id" element={<ProtectedRoute><TrackingPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Routes>
      </Router>

    </CartProvider>
    </AuthProvider>

    
  
  </>)
}
export default App
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contex/cartContext';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import "./App.css"
import Myaccount from './pages/Myaccount';
import Admin from "./Admin/pages/Admin"
import DashboardComp from './Admin/components/DashboardComp';
import ProtectedRoute from "./ProtectedRoute/protectedRoute"
import LoginPage from './pages/Auth/Login';
import RegisterPage from './pages/Auth/Register';
import { AuthProvider } from './contex/authContext';
import Checkout from './pages/CheckoutPage';
import OrderSuccess from './components/OrderSucess';
import About from './pages/AboutPage';
import TermsAndConditions from './pages/TermsandConditionPage';

function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <div className="app">
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/productdetail/:id" element={<ProductDetailPage />} />
            <Route path="/myaccount" element={<Myaccount />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/termsandcondition" element={<TermsAndConditions />} />

            <Route path="/checkout" element={<Checkout />}/>

            <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <DashboardComp />
                  </ProtectedRoute>
                  } 
      />
            <Route path="/order-success" element={<OrderSuccess/>} />
            <Route path="/admin/only" element={<Admin />} />



          </Routes>
        </div>
      </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
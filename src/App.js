import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Menu from "./pages/Menu";
import Pagenotfound from "./pages/Pagenotfound";
import MyOrders from "./pages/MyOrders";
import { CartProvider } from "./context/cartContext";
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminProtectedRoute } from './components/AdminProtectedRoute';
import Dashboard from './pages/admin/Dashboard';
import AdminLogin from './pages/admin/AdminLogin';
import OrderManagement from './pages/admin/OrderManagement';
import MenuManagement from './pages/admin/MenuManagement';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import History from './pages/History';
import Registration from './pages/Registration';
import ErrorBoundary from './components/ErrorBoundary';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Payment from './pages/Payment';
import OrderDetails from './pages/OrderDetails';
import OrderConfirmation from './pages/OrderConfirmation';

function App() {
  return (
    <HelmetProvider>
      <div>
        <CartProvider>
          <AuthProvider>
            <ErrorBoundary>
              <BrowserRouter basename="/">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/myorders" element={<MyOrders />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Registration />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  
                  {/* Protected user routes */}
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
                  <Route path="/order-details/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/order-confirmation" element={<OrderConfirmation />} />
                  
                  {/* Admin routes with specialized protection */}
                  <Route path="/admin/dashboard" element={<AdminProtectedRoute><Dashboard /></AdminProtectedRoute>} />
                  <Route path="/admin/orders" element={<AdminProtectedRoute><OrderManagement /></AdminProtectedRoute>} />
                  <Route path="/admin/menu" element={<AdminProtectedRoute><MenuManagement /></AdminProtectedRoute>} />
                  
                  <Route path="*" element={<Pagenotfound />} />
                </Routes>
              </BrowserRouter>
            </ErrorBoundary>
          </AuthProvider>
        </CartProvider>
      </div>
    </HelmetProvider>
  );
}

export default App;

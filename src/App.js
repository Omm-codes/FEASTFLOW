import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Menu from "./pages/Menu";
import Pagenotfound from "./pages/Pagenotfound";
import MyOrders from "./pages/MyOrders";
import { CartProvider } from "./context/cartContext";
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Dashboard from './pages/admin/Dashboard';
import AdminLogin from './pages/admin/AdminLogin'; // ✅ NEW
import Profile from './pages/Profile';
import History from './pages/History';
import ErrorBoundary from './components/ErrorBoundary';
import Checkout from './pages/Checkout';
import Login from './pages/Login';

function App() {
  return (
    <div>
      <CartProvider>
        <AuthProvider>
          <ErrorBoundary>
            <BrowserRouter basename="/">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/myorders" element={<MyOrders />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
                <Route path="/admin/login" element={<AdminLogin />} /> {/* ✅ NEW */}
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Pagenotfound />} />
              </Routes>
            </BrowserRouter>
          </ErrorBoundary>
        </AuthProvider>
      </CartProvider>
    </div>
  );
}

export default App;

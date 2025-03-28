
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Menu from "./pages/Menu";
import Pagenotfound from "./pages/Pagenotfound";
import MyOrders from "./pages/MyOrders";
import { CartProvider } from "./context/cartContext";

function App() {
  // Get the base URL from the environment or use '/'
  const basename = process.env.PUBLIC_URL || '/';
  
  return (
    <div>
      <CartProvider>
        <BrowserRouter basename={basename}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/myorders" element={<MyOrders />} />
            <Route path="*" element={<Pagenotfound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </div>
  );
}

export default App;
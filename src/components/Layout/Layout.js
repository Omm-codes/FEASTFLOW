
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";

const Layout = ({ children, title, description, keywords, author }) => {
  const location = useLocation();
  const showFooter = location.pathname === "/about" || location.pathname === "/contact";

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      <Header />
      <main style={{ minHeight: "70vh" }}>
        <Toaster />
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

Layout.defaultProps = {
  title: "FeastFlow - Your Digital Canteen",
  description: "A digital canteen management solution",
  keywords: "react, canteen, food, management, digital",
  author: "Your Name",
};

export default Layout;
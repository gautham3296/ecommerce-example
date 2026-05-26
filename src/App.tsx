/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ProductsProvider } from './context/ProductsContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import Catalog from './pages/Catalog';
import Orders from './pages/Orders';
import Admin from './pages/Admin';

// Scroll to top on route change
function ScrollToTopEffect() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ProductsProvider>
      <CartProvider>
        <Router>
          <ScrollToTopEffect />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/products" element={<Catalog />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Layout>
        </Router>
      </CartProvider>
    </ProductsProvider>
  );
}

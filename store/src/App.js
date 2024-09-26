import React, { useState, useCallback } from 'react';
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import './i18n'; // Import file i18n config

import Login from './components/Login';
import Navbar from './components/NavBar';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import GitHubCallback from './components/GitHubCallback';
import GoogleCallback from './components/GoogleCallback';
import Shop from './components/Buyer/Shop';
import Cart from './components/Buyer/Cart';

import Products from './components/Owner/Products';
import CreateProduct from './components/Owner/CreateProduct';
import EditProduct from './components/Owner/EditProduct';
import SellProducts from './components/Owner/SellProducts';

const App = () => {
  const { i18n } = useTranslation(); // Sử dụng hook useTranslation để quản lý ngôn ngữ
  const [cartItems, setCartItems] = useState([]); // Quản lý giỏ hàng
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Quản lý trạng thái xác thực
  const [role, setRole] = useState(null); // Quản lý vai trò người dùng
  const [products, setProducts] = useState([]); // Quản lý sản phẩm

  const navigate = useNavigate();

  // Hàm thay đổi ngôn ngữ
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Hàm kiểm tra xác thực
  const checkAuthentication = useCallback(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    if (token && userRole) {
      setIsAuthenticated(true);
      setRole(userRole); // Lưu vai trò người dùng
    } else {
      setIsAuthenticated(false);
      setRole(null);
      navigate('/login'); // Điều hướng về trang đăng nhập nếu không xác thực
    }
  }, [navigate]);

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  const updateCartItemQuantity = (productId, quantityChange) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.id === productId);
      const product = products.find(p => p.id === productId);

      if (existingItem) {
        return prevItems.map(item =>
          item.id === productId
            ? { ...item, quantity: Math.max(item.quantity + quantityChange, 0) }
            : item
        ).filter(item => item.quantity > 0);
      } else if (product) {
        return [...prevItems, { ...product, quantity: 1 }];
      } else {
        return prevItems;
      }
    });
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const handleRemoveFromCart = (index) => {
    setCartItems(prevItems => prevItems.filter((_, i) => i !== index));
  };

  // Xử lý đăng nhập thành công
  const handleLoginSuccess = () => {
    checkAuthentication();
    const userRole = localStorage.getItem('role');
    if (userRole === 'Authenticated') {
      navigate('/products');
    } else {
      navigate('/shop');
    }
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setRole(null);
    navigate('/login');
  };

  return (
    <div>
      {/* Thanh điều hướng - Có nút chuyển ngôn ngữ */}
      <div className="language-switcher mt-3">
        <button onClick={() => changeLanguage('en')} class="btn btn-info ms-4 me-4">English</button>
        <button onClick={() => changeLanguage('vi')} class="btn btn-info">Tiếng Việt</button>
      </div>

      {/* Hiển thị Navbar nếu người dùng đã xác thực */}
      {/* {isAuthenticated && role === 'Public' && (
        <Navbar isAuthenticated={isAuthenticated} cartItems={cartItems} handleLogout={handleLogout} />
      )} */}
      {isAuthenticated && (
        <Navbar isAuthenticated={isAuthenticated} cartItems={cartItems} handleLogout={handleLogout} />
      )}

      {/* Định tuyến các trang */}
      <Routes>
        {/* Trang mặc định chuyển hướng tới đăng nhập */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Định tuyến cho người dùng bình thường */}
        <Route
          path="/shop"
          element={
            <Shop
              cartItems={cartItems}
              updateCartItemQuantity={updateCartItemQuantity}
              setProducts={setProducts}
              products={products}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <Cart cartItems={cartItems} handleRemoveFromCart={handleRemoveFromCart} />
          }
        />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/connect/github/redirect" element={<GitHubCallback />} />
        <Route path="/api/auth/google/callback" element={<GoogleCallback />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {isAuthenticated && role === 'Authenticated' && (
          <>
            <Route path="/products" element={<Products setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/create-product" element={<CreateProduct />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/sell-products" element={<SellProducts />} />
          </>
        )}
      </Routes>
    </div>
  );
};

export default App;

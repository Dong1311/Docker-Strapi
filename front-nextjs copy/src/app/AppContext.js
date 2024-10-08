import { createContext, useContext, useState } from "react";

// Tạo một context mới
const AppContext = createContext();

// Tạo provider component
export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]); // Quản lý trạng thái sản phẩm
  const [cartItems, setCartItems] = useState([]); // Quản lý trạng thái giỏ hàng

  // Hàm để cập nhật số lượng sản phẩm trong giỏ hàng
  const updateCartItemQuantity = (productId, quantityChange) => {
    setCartItems(prevItems => {
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

  return (
    <AppContext.Provider value={{ products, setProducts, cartItems, updateCartItemQuantity }}>
      {children}
    </AppContext.Provider>
  );
};

// Tạo một hook để dễ dàng sử dụng context
export const useAppContext = () => {
  return useContext(AppContext);
};

"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const SellProducts = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customer, setCustomer] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [customerPayment, setCustomerPayment] = useState(0);
  const [change, setChange] = useState(0); 
  const [revenueId] = useState(1);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://9160-117-7-238-234.ngrok-free.app/api/products');
        setProducts(res.data.data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const updateCartItemQuantity = (productId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.attributes.Price * item.quantity,
      0
    );
    setTotalAmount(total);
  }, [cartItems]);

  // Tính toán tiền thừa trả khách khi khách thanh toán
  useEffect(() => {
    const customerOwes = totalAmount - discount;
    const customerChange = Math.max(customerPayment - customerOwes, 0);
    setChange(customerChange);
  }, [customerPayment, totalAmount, discount]);

  // Cập nhật revenue trong Strapi khi thanh toán
  const updateRevenue = async () => {
    try {
      // Lấy thông tin hiện tại của revenue
      const revenueRes = await axios.get(`https://9160-117-7-238-234.ngrok-free.app/api/revenues/${revenueId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Gửi token nếu cần
        },
      });

      const currentRevenue = revenueRes.data.data.attributes.revenue || 0;

      // Tính tổng revenue mới sau khi cộng thêm tổng tiền đơn hàng
      const newRevenue = currentRevenue + (totalAmount - discount);
      console.log("newRevenue: ",newRevenue);
      // Gửi yêu cầu cập nhật revenue
      const updateRes = await axios.put(`https://9160-117-7-238-234.ngrok-free.app/api/revenues/${revenueId}`, {
        data: {
          revenue: newRevenue,
        },
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Gửi token nếu cần
        },
      });

      console.log('Revenue updated successfully:', updateRes.data);
    } catch (error) {
      console.error('Failed to update revenue:', error);
      alert('Có lỗi xảy ra khi cập nhật doanh thu.');
    }
  };

  // Thanh toán
  const handleCheckout = async () => {
    if (customerPayment >= totalAmount - discount) {
      await updateRevenue();
      
      alert(`Thanh toán thành công! Tiền thừa trả khách: ${change} VNĐ`);
      setCartItems([]); // Xóa giỏ hàng sau khi thanh toán
    } else {
      alert('Số tiền khách đưa không đủ.');
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Phần bên trái: Tìm kiếm sản phẩm và giỏ hàng */}
        <div className="col-md-7">
          <h2>{t('Sell Product')}</h2>
          <div className="row">
            {/* Tìm kiếm sản phẩm */}
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder={t('Find Product')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder={t('Find Customer')}
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
              />
            </div>
          </div>

          {/* Hiển thị sản phẩm */}
          {searchTerm && (
            <div className="row mt-4">
              <div className="col-md-12">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>{t('Name')}</th>
                      <th>{t('Price')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .filter((product) =>
                        product.attributes.Name.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .slice(0, 6) // Hiển thị tối đa 6 sản phẩm
                      .map((product) => (
                        <tr key={product.id} onClick={() => addToCart(product)} style={{ cursor: 'pointer' }}>
                          <td>{product.attributes.Name}</td>
                          <td>{product.attributes.Price} VNĐ</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Giỏ hàng */}
          <div className="row mt-4">
            <div className="col-md-12">
              <h4>{t('Cart')}</h4>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>{t('Product ID')}</th>
                    <th>{t('Name')}</th>
                    <th>{t('Price')}</th>
                    <th>{t('Quantity')}</th>
                    <th>{t('Sum')}</th>
                    <th>{t('Operation')}</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.attributes.Code || 'SP0000' + item.id}</td>
                      <td>{item.attributes.Name}</td>
                      <td>{item.attributes.Price} VNĐ</td>
                      <td>
                        <input
                          type="number" className='form-control'
                          value={item.quantity}
                          min="1"
                          onChange={(e) =>
                            updateCartItemQuantity(item.id, parseInt(e.target.value))
                          }
                          style={{ width: '60px' }}
                        />
                      </td>
                      <td>{item.attributes.Price * item.quantity} VNĐ</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Phần bên phải: Thanh toán */}
        <div className="col-md-5">
          <h4 className='text-center'>{t('Payment Information')}</h4>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td><label><strong>{t('Sum')}:</strong></label></td>
                <td>
                  <input type="number" value={totalAmount} readOnly className="form-control text-end" />
                </td>
              </tr>
              <tr>
                <td><label><strong>{t('Discount')}:</strong></label></td>
                <td>
                  <input 
                    type="number"
                    className="form-control text-end"
                    value={discount}
                    onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                  />
                </td>
              </tr>
              <tr>
                <td><label><strong>{t('Need to pay')}:</strong></label></td>
                <td>
                  <input type="number" value={totalAmount - discount} readOnly className="form-control text-end" />
                </td>
              </tr>
              <tr>
                <td><label><strong>{t('Customer pay')}:</strong></label></td>
                <td>
                  <input
                    type="number"
                    className="form-control text-end"
                    value={customerPayment}
                    onChange={(e) => setCustomerPayment(parseInt(e.target.value) || 0)}
                  />
                </td>
              </tr>
              <tr>
                <td><label><strong>{t('Change')}:</strong></label></td>
                <td><p>{change} VNĐ</p></td>
              </tr>
            </tbody>
          </table>

          <button className="btn btn-success w-100" onClick={handleCheckout}>
            {t('Checkout')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellProducts;

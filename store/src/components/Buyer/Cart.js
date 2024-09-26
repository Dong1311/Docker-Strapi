import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";  // Sử dụng QRCodeCanvas

const Cart = ({ cartItems, handleRemoveFromCart }) => {
  const [showQRCode, setShowQRCode] = useState(false); // Trạng thái để hiển thị QR code
  const totalAmount = cartItems.reduce((acc, item) => {
    if (item.attributes && item.attributes.Price) {
      return acc + item.attributes.Price * item.quantity;
    }
    return acc;
  }, 0);

  // Hàm để hiển thị mã QR
  const handlePayment = () => {
    setShowQRCode(true); // Hiển thị QR code ngay khi nhấn "Thanh toán"
  };

  return (
    <div className="container mt-4">
      <h2>Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          <ul className="list-group mb-3">
            {cartItems.map((item, index) => (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                <div>
                  <h5>{item.attributes?.Name || "Unknown Product"}</h5>
                  <p>Giá: {item.attributes?.Price || "N/A"}</p>
                  <p>Số lượng: {item.quantity}</p>
                </div>
                <button className="btn btn-danger" onClick={() => handleRemoveFromCart(index)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <h4>Tổng tiền: {totalAmount} VNĐ</h4>

          {/* Nút thanh toán */}
          <button className="btn btn-success w-100" onClick={handlePayment}>
            Thanh toán
          </button>

          {/* Hiển thị QR code nếu đã nhấn thanh toán */}
          {showQRCode && (
            <div className="mt-4">
              <h4>Chuyển khoản theo QR code dưới đây:</h4>
              <QRCodeCanvas
                value={`Vui lòng chuyển khoản ${totalAmount} VNĐ`} // Giá trị QR code
                size={200} // Kích thước QR code
                level="H" // Mức độ sửa lỗi
                includeMargin={true} // Thêm khoảng trống xung quanh QR
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;

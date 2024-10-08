// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Định nghĩa các bản dịch cho tiếng Việt và tiếng Anh
const resources = {
  en: {
    translation: {
      "Product ID": "Product ID",
      "Find Product": "Find Product",
      "Find Customer": "Find Customer",
      "Create New Product": "Create New Product",
      "Go Back": "Go Back",
      "Name": "Name",
      "Stock": "Stock",
      "Image": "Image",
      "Product List": "Product List",
      "Revenue": "Revenue",
      "Create": "Create Product",
      "Logout": "Logout",
      "Sell Product": "Sell Product",
      "Price": "Price",
      "Quantity": "Quantity",
      "Sum": "Sum",
      "Operation": "Operation",

    }
  },
  vi: {
    translation: {
      "Product ID": "Mã sản phẩm",
      "Find Product": "Tìm kiếm sản phẩm",
      "Find Customer": "Tìm kiếm khách hàng",
      "Create New Product": "Thêm mới sản phẩm",
      "Go Back": "Quay lại",
      "Name": "Tên",
      "Stock": "Số lượng tồn",
      "Image": "Hình ảnh",
      "Product List": "Danh sách sản phẩm",
      "Revenue": "Doanh thu",
      "Sell Product": "Bán hàng",
      "Create": "Thêm sản phẩm",
      "Logout": "Đăng xuất",
      "Price": "Giá",
      "Quantity": "Số lượng",
      "Sum": "Tổng",
      "Operation": "Thao tác",
      "Need to pay": "Khách cần trả",
      "Discount": "Giảm giá",
      "Customer Pay": "Khách trả",
      "Change": "Trả lại",
      "Checkout":"Thanh toán",
      "Payment Information": "Thông tin hóa đơn",
      "Previous":"Trang trước",
      "Next":"Trang sau",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", 
    interpolation: {
      escapeValue: false // React đã tự bảo vệ chống lại XSS
    }
  });

export default i18n;

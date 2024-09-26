import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate để điều hướng
import { useTranslation } from 'react-i18next';

const CreateProduct = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [image, setImage] = useState(null); // State để lưu ảnh đã chọn
    const [imagePreview, setImagePreview] = useState(""); // Xem trước hình ảnh đã chọn
    const navigate = useNavigate(); // Khởi tạo navigate để điều hướng
    const { t } = useTranslation();

    // Lấy token từ localStorage
    const token = localStorage.getItem('token'); 

    // Xử lý khi người dùng chọn ảnh mới
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file)); // Xem trước ảnh
    };

    const handleGobackClick = () => {
        navigate('/products');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let imageId = null;

            // Nếu người dùng chọn ảnh, tải ảnh lên trước
            if (image) {
                const formData = new FormData();
                formData.append('files', image);

                // Gửi yêu cầu upload ảnh kèm token trong header
                const uploadRes = await axios.post('http://localhost:1337/api/upload', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Thêm token vào header
                    }
                });
                imageId = uploadRes.data[0].id; // Lấy id của ảnh sau khi tải lên
            }

            // Tạo sản phẩm mới với dữ liệu
            await axios.post('http://localhost:1337/api/products', {
                data: {
                    Name: name,
                    Price: price,
                    Stock: stock,
                    Image: imageId, // Liên kết hình ảnh đã tải lên với sản phẩm mới
                },
            }, {
                headers: {
                    Authorization: `Bearer ${token}`, // Thêm token vào header
                }
            });

            alert("Product created successfully!");

            navigate('/products');

        } catch (error) {
            console.error("Failed to create product", error);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center">{t('Create New Product')}</h2>
            <button className="btn btn-primary mb-4" onClick={handleGobackClick}>{t('Go Back')} </button>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-3">
                    <label className="form-label">{t('Name')}</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">{t('Price')}</label>
                    <input 
                        type="number" 
                        className="form-control" 
                        value={price} 
                        onChange={(e) => setPrice(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">{t('Stock')}</label>
                    <input 
                        type="number" 
                        className="form-control" 
                        value={stock} 
                        onChange={(e) => setStock(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">{t('Image')}</label>
                    {imagePreview && (
                        <div className="mb-2">
                            <img src={imagePreview} alt="Product" style={{ height: '150px' }} />
                        </div>
                    )}
                    <input 
                        type="file" 
                        className="form-control" 
                        onChange={handleImageChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">{t('Create')}</button>
            </form>
        </div>
    );
};

export default CreateProduct;

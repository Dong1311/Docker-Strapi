"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation'; 
import { useTranslation } from 'react-i18next';
import Image from 'next/image'


const CreateProduct = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [image, setImage] = useState(null); 
    const [imagePreview, setImagePreview] = useState(""); 
    const { t } = useTranslation();
    const router = useRouter();
    
    const [token, setToken] = useState("");

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            setToken(storedToken || ""); // Đảm bảo token không null
        }
    }, []); // Chỉ chạy một lần khi component mount

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file)); // Xem trước ảnh
    };

    const handleGobackClick = () => {
        router.push('/owner/products');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let imageId = null;

            // Nếu người dùng chọn ảnh, tải ảnh lên trước
            if (image) {
                const formData = new FormData();
                formData.append('files', image);

                // Gửi yêu cầu upload ảnh kèm token trong header
                const uploadRes = await axios.post('https://9160-117-7-238-234.ngrok-free.app/api/upload', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Thêm token vào header
                    }
                });
                imageId = uploadRes.data[0].id; // Lấy id của ảnh sau khi tải lên
            }

            // Tạo sản phẩm mới với dữ liệu
            await axios.post('https://9160-117-7-238-234.ngrok-free.app/api/products', {
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

            router.push('/owner/products');

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
                            <Image src={imagePreview} alt="Product" width={150} height={150} />
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

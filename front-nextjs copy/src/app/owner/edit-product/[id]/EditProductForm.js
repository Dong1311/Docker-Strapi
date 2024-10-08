"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Sử dụng Next.js router
import { useTranslation } from 'react-i18next';

export default function EditProductForm({ product }) {
    const router = useRouter();

    const [name, setName] = useState(product.attributes.Name || '');
    const [price, setPrice] = useState(product.attributes.Price || '');
    const [stock, setStock] = useState(product.attributes.Stock || '');
    const [image, setImage] = useState(null); // State để lưu ảnh đã chọn

    const imageUrl = product.attributes.Image?.data?.attributes?.url;
    const imagePreviewUrl = imageUrl ? `https://9160-117-7-238-234.ngrok-free.app${imageUrl}` : '';
    const [imagePreview, setImagePreview] = useState(imagePreviewUrl); // Xem trước hình ảnh đã chọn
    
    // Xử lý khi người dùng chọn ảnh mới
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file)); // Xem trước ảnh mới đã chọn
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); // Lấy token từ localStorage
            let imageId = null;

            if (image) {
                const formData = new FormData();
                formData.append('files', image);

                const uploadRes = await axios.post('https://9160-117-7-238-234.ngrok-free.app/api/upload', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Thêm token vào tiêu đề
                    },
                });
                imageId = uploadRes.data[0].id; // Lấy id của ảnh sau khi tải lên
            }

            await axios.put(
                `https://9160-117-7-238-234.ngrok-free.app/api/products/${product.id}`,
                {
                    data: {
                        Name: name,
                        Price: price,
                        Stock: stock,
                        Image: imageId ? imageId : product.attributes.Image.data.id, // Cập nhật nếu có ảnh mới
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Thêm token vào tiêu đề
                    },
                }
            );
            router.refresh();
            router.push('/owner/products');
        } catch (error) {
            console.error('Failed to update product', error);
        }
    };

    return (
        <div className="container mt-4">
            <button className="btn btn-primary" onClick={() => router.push('/owner/products')}>
                Go Back
            </button>
            <h2 className="text-center">Edit Product</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input
                        type="number"
                        className="form-control"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Stock</label>
                    <input
                        type="number"
                        className="form-control"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Image</label>
                    {imagePreview && (
                        <div className="mb-2">
                            <img src={imagePreview} alt="Product" style={{ height: '150px' }} />
                        </div>
                    )}
                    <input type="file" className="form-control" onChange={handleImageChange} />
                </div>
                <button type="submit" className="btn btn-primary">
                    Save Changes
                </button>
            </form>
        </div>
    );
}

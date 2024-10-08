"use client"

import React, { useEffect, useState, useCallback  } from "react";
import axios from "axios";
import { useAppContext } from '../../AppContext';
import Image from 'next/image'

const Shop = () => {
    const { products, setProducts, cartItems, updateCartItemQuantity } = useAppContext(); // Sử dụng context
    const [page, setPage] = useState(1); 
    const [totalPages, setTotalPages] = useState(1); 
    const [language, setLanguage] = useState('en'); 
    const pageSize = 6;

    const fetchProducts = useCallback(async () => {
        try {
            const res = await axios.get(`https://9160-117-7-238-234.ngrok-free.app/api/products?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}&locale=${language}`);
            console.log("Products data: ", res.data);
            if (res.data && res.data.data) {
                setProducts(res.data.data); 
                setTotalPages(res.data.meta.pagination.pageCount); 
            } else {
                console.error("No product data found");
            }
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    }, [page, language, setProducts]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <div className="container mt-4">
            <h2>Shop</h2>

            {/* Phần chọn ngôn ngữ */}
            <div className="mb-3">
                <label htmlFor="language-select"><strong>Select Language:</strong></label>
                <select
                    id="language-select"
                    className="form-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)} // Cập nhật trạng thái ngôn ngữ
                >
                    <option value="en">English</option>
                    <option value="vi">Tiếng Việt</option>
                </select>
            </div>

            <div className="row">
                {products.length > 0 ? (
                    products.map(product => (
                        <div className="col-md-4 mb-4" key={product.id}>
                            <div className="card">
                                {product.attributes.Image && product.attributes.Image.data && (
                                    <Image
                                        src={`https://9160-117-7-238-234.ngrok-free.app${product.attributes.Image.data.attributes.url}`} 
                                        className="card-img-top" 
                                        alt={product.attributes.Name} 
                                        style={{ height: '150px', objectFit: 'contain' }} 
                                    />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">{product.attributes.Name}</h5>
                                    <p className="card-text">
                                        <strong>Price:</strong> {product.attributes.Price} 
                                    </p>
                                    <p className="card-text">
                                        <strong>Stock:</strong> {product.attributes.Stock} units
                                    </p>
                                    <div className="d-flex align-items-center">
                                        <button 
                                            className="btn btn-info me-2" 
                                            onClick={() => updateCartItemQuantity(product.id, -1)}
                                            disabled={!cartItems.find(item => item.id === product.id)?.quantity}
                                        >
                                            -
                                        </button>
                                        <span>{cartItems.find(item => item.id === product.id)?.quantity || 0}</span>
                                        <button 
                                            className="btn btn-info ms-2" 
                                            onClick={() => updateCartItemQuantity(product.id, 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No products available</p>
                )}
            </div>

            <div className="pagination d-flex justify-content-center align-items-center mt-4">
                <button 
                    className="btn btn-primary me-2" 
                    onClick={() => setPage(page - 1)} 
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button 
                    className="btn btn-primary ms-2" 
                    onClick={() => setPage(page + 1)} 
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Shop;

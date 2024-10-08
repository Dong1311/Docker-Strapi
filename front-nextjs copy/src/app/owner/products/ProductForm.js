"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function ProductForm({ initialProducts, initialTotalPages }) {
    // Thêm state để lưu danh sách sản phẩm và tổng số trang
    const [products, setProducts] = useState(initialProducts || []);
    const [totalPages, setTotalPages] = useState(initialTotalPages || 1);
    const [page, setPage] = useState(1);
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const pageSize = 6;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                const currentLocale = i18n.language;

                const res = await fetch(
                    `https://9160-117-7-238-234.ngrok-free.app/api/products?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}&locale=${currentLocale}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();
                setProducts(data.data); // Cập nhật danh sách sản phẩm
                setTotalPages(data.meta.pagination.pageCount); // Cập nhật tổng số trang
            } catch (error) {
                console.error('Failed to fetch products', error);
            }
        };

        fetchProducts();
    }, [page, i18n.language]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    const handleCreateClick = () => {
        router.push('/owner/create-product');
    };

    const handleCardClick = (productId) => {
        router.push(`/owner/edit-product/${productId}`);
    };

    const handleSellProducts = () => {
        router.push('/owner/sell-products');
    };

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center">{t('Product List')}</h2>
            <h2 className="text-start">{t('Revenue')}: </h2>
            <button className="btn btn-primary mb-4 me-4" onClick={handleCreateClick}>
                {t('Create')}
            </button>
            <button className="btn btn-danger mb-4 ms-4 me-4" onClick={handleLogout}>
                {t('Logout')}
            </button>
            <button className="btn btn-primary mb-4 ms-4" onClick={handleSellProducts}>
                {t('Sell Product')}
            </button>

            <div className="row">
                {products.map((product) => (
                    <div className="col-md-2 mb-4" key={product.id}>
                        <div className="card" onClick={() => handleCardClick(product.id)} style={{ cursor: 'pointer' }}>
                            {product.attributes.Image && product.attributes.Image.data && (
                                <img
                                    src={`https://9160-117-7-238-234.ngrok-free.app${product.attributes.Image.data.attributes.url}`}
                                    className="card-img-top"
                                    alt={product.attributes.Name}
                                    style={{ height: '150px', objectFit: 'contain' }}
                                />
                            )}
                            <div className="card-body">
                                <h5 className="card-title">{product.attributes.Name}</h5>
                                <p className="card-text">
                                    <strong>{t('Price')}: </strong> {product.attributes.Price}
                                </p>
                                <p className="card-text">
                                    <strong>{t('Quantity')}: </strong> {product.attributes.Stock} {product.attributes.Unit}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pagination d-flex justify-content-center align-items-center mt-4">
                <button className="btn btn-primary me-2" onClick={handlePreviousPage} disabled={page === 1}>
                    {t('Previous')}
                </button>
                <span>
                    Page {page} of {totalPages}
                </span>
                <button className="btn btn-primary ms-2" onClick={handleNextPage} disabled={page === totalPages}>
                    {t('Next')}
                </button>
            </div>
        </div>
    );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom"; 

const Products = ({ setIsAuthenticated }) => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1); 
    const [totalPages, setTotalPages] = useState(1); 
    const navigate = useNavigate(); 
    const { t, i18n } = useTranslation(); // Sử dụng i18n để xác định ngôn ngữ hiện tại
    const pageSize = 6; 

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('token'); // Lấy token từ localStorage
                const currentLocale = i18n.language; // Lấy ngôn ngữ hiện tại từ i18n
                
                // Gọi API Strapi và truyền locale để lấy sản phẩm theo ngôn ngữ hiện tại
                const res = await axios.get(`http://localhost:1337/api/products?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}&locale=${currentLocale}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Gửi token trong headers
                    },
                });
                
                setProducts(res.data.data);
                setTotalPages(res.data.meta.pagination.pageCount); // Cập nhật tổng số trang
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };

        fetchProducts();
    }, [page, i18n.language]); // Cập nhật khi ngôn ngữ thay đổi

    const handleLogout = () => {
        setIsAuthenticated(false); // Cập nhật trạng thái đăng nhập
        navigate('/'); // Điều hướng về trang chủ
    };

    const handleCardClick = (productId) => {
        navigate(`/edit-product/${productId}`);
    };

    const handleCreateClick = () => {
        navigate('/create-product');
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleSellProducts = () => {
        navigate('/sell-products');
    }

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center">{t('Product List')}</h2>
            <h2 className="text-start">{t('Revenue')}: </h2>
            <button className="btn btn-primary mb-4 me-4" onClick={handleCreateClick}>{t('Create')}</button>
            <button className="btn btn-danger mb-4 ms-4 me-4" onClick={handleLogout}>{t('Logout')}</button>
            <button className="btn btn-primary mb-4 ms-4" onClick={handleSellProducts}>{t('Sell Product')}</button>
            
            <div className="row">
                {products.map(product => (
                    <div className="col-md-2 mb-4" key={product.id}>
                        <div className="card" onClick={() => handleCardClick(product.id)} style={{ cursor: "pointer" }}>
                            {product.attributes.Image && product.attributes.Image.data && (
                                <img 
                                    src={`http://localhost:1337${product.attributes.Image.data.attributes.url}`} 
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
                <button 
                    className="btn btn-primary me-2" 
                    onClick={handlePreviousPage} 
                    disabled={page === 1}
                >
                    {t('Previous')}
                </button>
                <span>Page {page} of {totalPages}</span>
                <button 
                    className="btn btn-primary ms-2" 
                    onClick={handleNextPage} 
                    disabled={page === totalPages}
                >
                    {t('Next')}
                </button>
            </div>

        </div>
    );
};

export default Products;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate

const EditProduct = () => {
    const { id } = useParams(); // Lấy productId từ URL
    const navigate = useNavigate(); // Khởi tạo navigate để điều hướng
    const [product, setProduct] = useState(null);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [image, setImage] = useState(null); // State để lưu ảnh đã chọn
    const [imagePreview, setImagePreview] = useState(""); // Xem trước hình ảnh đã chọn

    // Fetch chi tiết sản phẩm khi component được mount
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem('token'); // Lấy token từ localStorage

                const res = await axios.get(`http://localhost:1337/api/products/${id}?populate=*`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Thêm token vào tiêu đề
                    },
                });
                const productData = res.data.data;
                
                setProduct(productData);
                setName(productData.attributes.Name); // Đảm bảo thuộc tính đúng
                setPrice(productData.attributes.Price);
                setStock(productData.attributes.Stock);
                if (productData.attributes.Image && productData.attributes.Image.data) {
                    setImagePreview(`http://localhost:1337${productData.attributes.Image.data.attributes.url}`);
                }
            } catch (error) {
                console.error("Failed to fetch product details", error);
            }
        };

        fetchProduct();
    }, [id]);

    // Xử lý khi người dùng chọn ảnh mới
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file)); // Xem trước ảnh
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); // Lấy token từ localStorage

            let imageId = null;

            // Nếu người dùng chọn ảnh mới, tải ảnh lên trước
            if (image) {
                const formData = new FormData();
                formData.append('files', image);

                const uploadRes = await axios.post('http://localhost:1337/api/upload', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Thêm token vào tiêu đề
                    },
                });
                imageId = uploadRes.data[0].id; // Lấy id của ảnh sau khi tải lên
            }

            // Cập nhật sản phẩm với dữ liệu mới
            await axios.put(`http://localhost:1337/api/products/${id}`, {
                data: {
                    Name: name,
                    Price: price,
                    Stock: stock,
                    Image: imageId ? imageId : product.attributes.Image.data.id // Cập nhật nếu có ảnh mới
                },
            }, {
                headers: {
                    Authorization: `Bearer ${token}`, // Thêm token vào tiêu đề
                },
            });

            // Điều hướng quay lại trang danh sách sản phẩm
            navigate('/products');

        } catch (error) {
            console.error("Failed to update product", error);
        }
    };

    const handleGobackClick = () => {
        navigate('/products');
    }

    if (!product) return <p>Loading...</p>;

    return (
        <div className="container mt-4">
                <button className="btn btn-primary" onClick={handleGobackClick}>Go Back</button>
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
                    <input 
                        type="file" 
                        className="form-control" 
                        onChange={handleImageChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
        </div>
    );
    
};

export default EditProduct;

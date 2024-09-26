import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GitHubCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy token từ URL sau khi GitHub callback
    const queryParams = new URLSearchParams(window.location.search);
    const accessToken = queryParams.get('access_token');
    console.log("Access token from URL:", accessToken);
    
    if (accessToken) {
      // Gửi token tới Strapi để xác thực và lấy JWT token
      axios.get(`http://localhost:1337/api/connect/github/callback?access_token=${accessToken}`)
        .then((response) => {
          console.log("Auth success:", response.data);

          // Lưu JWT từ Strapi vào localStorage
          localStorage.setItem('token', response.data.jwt);
          //localStorage.setItem('role', response.data.user.role.name);

          // onLoginSuccess();
          navigate('/products');
        })
        .catch((error) => {
          console.error('Error during authentication:', error);
          navigate('/login');
        });
    } else {
      // Nếu không có token, chuyển hướng lại trang đăng nhập
      navigate('/login');
    }
  }, [navigate]);

  return <div>Logging in...</div>;
};

export default GitHubCallback;

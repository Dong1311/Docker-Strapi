
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get("access_token");

      if (accessToken) {
        try {
          // Gửi yêu cầu đến Strapi để xác thực và nhận JWT token
          const res = await axios.get(`http://localhost:1337/api/connect/google/callback?access_token=${accessToken}`);

          // Lưu JWT token vào localStorage
          localStorage.setItem("token", res.data.jwt);
          console.log("Login successful:", res.data);

          // Điều hướng về trang chính hoặc trang dashboard
          navigate("/shop");
        } catch (error) {
          console.error("Error during Google login:", error);
        }
      } else {
        console.error("Missing access token from Google.");
      }
    };

    handleGoogleCallback();
  }, [navigate]);

  return <div>Processing Google login...</div>;
};

export default GoogleCallback;

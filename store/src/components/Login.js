import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import PasswordInput from "./PasswordInput";
import {MDBContainer,MDBInput,MDBCheckbox,MDBBtn,MDBIcon} from 'mdb-react-ui-kit';

const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    
    const fetchUserRole = async () => {
        try {
            const token = localStorage.getItem('token'); // Lấy token đã lưu khi người dùng đăng nhập

            // Gửi yêu cầu tới API để lấy thông tin người dùng và vai trò
            const response = await axios.get('http://localhost:1337/api/users/me?populate=role', {
                headers: {
                    Authorization: `Bearer ${token}`,  // Truyền token để xác thực
                },
            });

            console.log("User data:", response.data);
            const userRole = response.data.role.name; 
            console.log('User role:', userRole);

            return userRole;
        } catch (error) {
            console.error('Error fetching user role:', error);
            return null;
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Gửi yêu cầu đăng nhập tới Strapi
            const res = await axios.post('http://localhost:1337/api/auth/local', {
                identifier: username,
                password: password,
            });

            console.log("Login response:", res.data);

            // Lưu token để xác thực
            localStorage.setItem('token', res.data.jwt);
            const userRole = res.data.user.role?.name || null; 

            // Nếu không lấy được role từ đăng nhập, thử lấy từ API /me (chỉ dành cho vai trò có quyền)
            let finalRole = userRole;
            if (!finalRole) {
                finalRole = await fetchUserRole();
            }

            localStorage.setItem('role', finalRole || 'Public'); // Mặc định là Public nếu không lấy được

            onLoginSuccess();  // Gọi hàm onLoginSuccess mà không điều hướng cụ thể

            setError(""); // Xóa lỗi nếu đăng nhập thành công
        } catch (error) {
            console.error("Login error:", error); // Log chi tiết lỗi
            setError("Invalid credentials, please try again.");
        }
    };

    const handleGitHubLogin = () => {
      const strapiUrl = "http://localhost:1337/api/connect/github/";
      window.location.href = strapiUrl;
    };

    const handleGoogleLogin = () => {
      const strapiUrl = "http://localhost:1337/api/connect/google/";
      window.location.href = strapiUrl;
    };


    return (
        <div>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleLogin}>
                <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
            
                  <MDBInput wrapperClass='mb-4' placeholder="Username"  id='form1' type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required/>
                  <PasswordInput password={password} setPassword={setPassword} />
            
                  <div className="d-flex justify-content-between mx-3 mb-4">
                    <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
                    <Link to="/forgot-password" onClick={() => navigate('/forgot-password')}>Forgot password?</Link>
                  </div>
            
                  <MDBBtn type="submit" className="mb-4" noRipple>Sign in</MDBBtn>
            
                  <div className="text-center">
                    <p>Not a member? <a href="/register">Register</a></p>
                    <p>or sign up with:</p>
            
                    <div className='d-flex justify-content-between mx-auto' style={{width: '40%'}}>
                      <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                        <MDBIcon fab icon='facebook-f' size="sm"/>
                      </MDBBtn>
                      <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}  onClick={handleGoogleLogin}>
                        <MDBIcon fab icon='google' size="sm"/>
                      </MDBBtn>
            
                      <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }} onClick={handleGitHubLogin}>
                        <MDBIcon fab icon='github' size="sm"/>
                      </MDBBtn>
            
                    </div>
                  </div>
                </MDBContainer>
            </form>
        </div>
      );
};

export default Login;

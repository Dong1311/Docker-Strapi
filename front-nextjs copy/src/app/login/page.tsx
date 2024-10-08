"use client"; 

import React, { useState } from "react";
import PasswordInput from "../../components/PasswordInput";
import { MDBContainer, MDBInput, MDBCheckbox, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import Link from 'next/link';
import { useRouter } from 'next/navigation';  
import axios from "axios";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter(); // Sử dụng useRouter để điều hướng

    const fetchUserRole = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await axios.get('https://9160-117-7-238-234.ngrok-free.app/api/users/me?populate=role', {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            });

            const userRole = response.data.role.name; 
            return userRole;
        } catch (error) {
            console.error('Error fetching user role:', error);
            return null;
        }
    };

    const handleLoginSuccess = (userRole : string) => {
        if (userRole === 'Authenticated') {
          router.push('/owner/products'); 
        } else {
          router.push('/buyer/shop'); 
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const res = await axios.post('https://9160-117-7-238-234.ngrok-free.app/api/auth/local', {
              identifier: username,
              password: password,
          });
          console.log(res.data);
          localStorage.setItem('token', res.data.jwt); 
          let finalRole = res.data.user.role?.name || null;
  
          if (!finalRole) {
              finalRole = await fetchUserRole(); 
          }
  
          localStorage.setItem('role', finalRole || 'Public'); 
          handleLoginSuccess(finalRole);
          setError(""); 
      } catch (error) {
          
        if (axios.isAxiosError(error)) {
          // Nếu có thông báo lỗi từ API
          if (error.response && error.response.data && error.response.data.message) {
              setError(error.response.data.message); // Lấy thông báo lỗi từ API
          } else {
              setError("Invalid credentials, please try again."); // Lỗi mặc định
          }
      } else {
          // Nếu lỗi không phải từ axios, hiển thị lỗi mặc định khác
          setError("An unknown error occurred.");
      }
      }
  };
  

    const handleGitHubLogin = () => {
        const strapiUrl = "https://9160-117-7-238-234.ngrok-free.app/api/connect/github/";
        window.location.href = strapiUrl; // Điều hướng sang đăng nhập bằng GitHub
    };

    const handleGoogleLogin = () => {
        const strapiUrl = "https://9160-117-7-238-234.ngrok-free.app/api/connect/google/";
        window.location.href = strapiUrl; // Điều hướng sang đăng nhập bằng Google
    };

    return (
        <div>
            {error && <p className="text-danger">{error}</p>} 

            <form onSubmit={handleLogin}>
                <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
                  <MDBInput wrapperClass='mb-4' placeholder="Username" id='form1' type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required />
                  <PasswordInput password={password} setPassword={setPassword} />
            
                  <div className="d-flex justify-content-between mx-3 mb-4">
                    <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
                    <Link href="/forgot-password">Forgot password?</Link>
                  </div>
            
                  <MDBBtn type="submit" className="mb-4" noRipple>Sign in</MDBBtn>
            
                  <div className="text-center">
                    <p>Not a member? <Link href="/register">Register</Link></p>
                    <p>or sign up with:</p>
                    <div className='d-flex justify-content-between mx-auto' style={{width: '40%'}}>
                      <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                        <MDBIcon fab icon='facebook-f' size="sm"/>
                      </MDBBtn>
                      <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }} onClick={handleGoogleLogin}>
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

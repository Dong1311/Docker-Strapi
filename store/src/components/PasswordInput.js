import React, { useState } from 'react';
import { MDBInput, MDBIcon } from 'mdb-react-ui-kit';

const PasswordInput = ({ password, setPassword }) => {
  const [showPassword, setShowPassword] = useState(false);

  // Hàm xử lý việc bật/tắt mật khẩu
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-4 position-relative">
      <MDBInput
        wrapperClass='mb-4'
        placeholder='Password'
        id='password'
        type={showPassword ? 'text' : 'password'} // Hiển thị text nếu showPassword = true
        className="form-control"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {/* Icon con mắt */}
      <MDBIcon
        icon={showPassword ? 'eye-slash' : 'eye'} // Thay đổi icon dựa trên trạng thái showPassword
        className="position-absolute"
        style={{ top: '30%', right: '15px', transform: 'translateY(-50%)', cursor: 'pointer' }}
        onClick={togglePasswordVisibility}
      />
    </div>
  );
};

export default PasswordInput;

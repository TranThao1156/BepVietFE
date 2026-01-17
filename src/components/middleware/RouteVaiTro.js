import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// vaiTroChoPhep: Mảng [0] hoặc [1]
const RouteVaiTro = ({ vaiTroChoPhep }) => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  // 1. Chưa đăng nhập -> Về trang Login
  if (!user) {
    return <Navigate to="/dang-nhap" replace />;
  }

  // 2. Sai vai trò
  if (vaiTroChoPhep && !vaiTroChoPhep.includes(user.VaiTro)) {
    // Nếu là Quản lý (0) mà vào trang User -> Về trang quản trị
    if (user.VaiTro === 0) return <Navigate to="/quan-tri" replace />;
    
    // Nếu là User (1) mà vào trang Quản lý -> Về trang cá nhân
    if (user.VaiTro === 1) return <Navigate to="/nguoi-dung" replace />;
  }

  return <Outlet />;
};

export default RouteVaiTro;
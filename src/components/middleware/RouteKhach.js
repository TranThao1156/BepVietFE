import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RouteKhach = () => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  // Nếu đã đăng nhập thì không cho vào trang Login nữa
  if (user) {
    if (user.VaiTro === 0) return <Navigate to="/quan-tri" replace />;
    return <Navigate to="/" replace />; // Về trang chủ
  }

  return <Outlet />;
};

export default RouteKhach;
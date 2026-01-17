import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 1. Import các Middleware bảo mật
import RouteVaiTro from '../components/middleware/RouteVaiTro'; 
import RouteKhach from '../components/middleware/RouteKhach';

// 2. Import các Route con
import ClientRoutes from './ClientRoutes';
import AdminRoutes from './AdminRoutes';
import UserRoutes from './UserRoutes';

// 3. Import trang Đăng nhập (Để dùng cho RouteKhach)
// Hãy chắc chắn đường dẫn này đúng với máy của bạn
import DangNhap from '../pages/Auth/Auth'; 

const AppRouter = () => {
  return (
    <Routes>

      {/* =========================================================
          NHÓM 1: QUẢN TRỊ VIÊN (VaiTro = 0)
          Dùng RouteVaiTro để chặn người không phải Admin
      ========================================================= */}
      <Route element={<RouteVaiTro vaiTroChoPhep={[0]} />}>
         <Route path="/quan-tri/*" element={<AdminRoutes />} />
      </Route>


      {/* =========================================================
          NHÓM 2: NGƯỜI DÙNG (VaiTro = 1)
          Dùng RouteVaiTro để chặn người không phải User
      ========================================================= */}
      <Route element={<RouteVaiTro vaiTroChoPhep={[1]} />}>
         {/* Tự động chuyển hướng từ /nguoi-dung sang tab thông tin */}
         <Route path="/nguoi-dung" element={<Navigate to="/nguoi-dung/thong-tin-ca-nhan" replace />} />
         
         <Route path="/nguoi-dung/*" element={<UserRoutes />} />
      </Route>


      {/* =========================================================
          NHÓM 3: KHÁCH VÃNG LAI (Chưa đăng nhập)
          Dùng RouteKhach để chặn người ĐÃ đăng nhập quay lại đây
      ========================================================= */}
      <Route element={<RouteKhach />}>
         <Route path="/dang-nhap" element={<DangNhap />} />
         <Route path="/dang-ky" element={<DangNhap />} /> {/* Nếu dùng chung form */}
      </Route>


      {/* =========================================================
          NHÓM 4: CÔNG KHAI (Trang chủ, Blog, Công thức...)
          ClientRoutes xử lý phần còn lại (/*)
      ========================================================= */}
      <Route path="/*" element={<ClientRoutes />} />
      
      {/* Route bắt lỗi 404 cuối cùng */}
      <Route path="*" element={<div style={{textAlign: 'center', marginTop: 50}}>404 - Không tìm thấy trang</div>} />

    </Routes>
  );
};

export default AppRouter;
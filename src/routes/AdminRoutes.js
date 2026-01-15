import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AdminLayout from '../layouts/AdminLayout';
import BangDieuKhien from '../pages/QuanTriVien/BangDieuKhien';
import KiemDuyetNoiDung from '../pages/QuanTriVien/KiemDuyetNoiDung'; // <-- ĐƯỜNG DẪN MỚI CỦA BẠN
import QuanLyDanhMuc from '../pages/QuanTriVien/QuanLyDanhMuc';
import TaoDanhMuc from '../pages/QuanTriVien/TaoDanhMuc';
import SuaDanhMuc from '../pages/QuanTriVien/SuaDanhMuc';
import QuanLyNguoiDung from '../pages/QuanTriVien/QuanLyNguoiDung';
import ThemNguoiDung from '../pages/QuanTriVien/ThemNguoiDung';
import SuaNguoiDung from '../pages/QuanTriVien/SuaNguoiDung';


const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        
        <Route index element={<BangDieuKhien />} />
        
        {/* Nội dung */}
        <Route path="kiemduyet" element={<KiemDuyetNoiDung />} /> 
        {/* Người dùng */}
        <Route path="quanlynguoidung" element={<QuanLyNguoiDung />} />
        <Route path="quanlynguoidung/themnguoidung" element={<ThemNguoiDung />} />
        <Route path="quanlynguoidung/suanguoidung/:id" element={<SuaNguoiDung />} />
        {/* Danh mục */}
        <Route path="quanlydanhmuc" element={<QuanLyDanhMuc />} />
        <Route path="quanlydanhmuc/taodanhmuc" element={<TaoDanhMuc />} />
        <Route path="quanlydanhmuc/suadanhmuc/:id" element={<SuaDanhMuc />} />
        

      </Route>
    </Routes>
  );
};

export default AdminRoutes;
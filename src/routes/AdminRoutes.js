import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AdminLayout from '../layouts/AdminLayout';
import BangDieuKhien from '../pages/QuanTriVien/BangDieuKhien';
import KiemDuyetNoiDung from '../pages/QuanTriVien/KiemDuyetNoiDung'; // <-- ĐƯỜNG DẪN MỚI CỦA BẠN
import KiemDuyetCongThuc from '../pages/QuanTriVien/KiemDuyetCongThuc'; // Trâm - đã thêm: trang kiểm duyệt công thức riêng
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
        <Route path="kiem-duyet" element={<KiemDuyetNoiDung />} /> 
        <Route path="kiem-duyet-cong-thuc" element={<KiemDuyetCongThuc />} /> 
        {/* Người dùng */}
        <Route path="quan-ly-nguoi-dung" element={<QuanLyNguoiDung />} />
        <Route path="quan-ly-nguoi-dung/them-nguoi-dung" element={<ThemNguoiDung />} />
        <Route path="quan-ly-nguoi-dung/sua-nguoi-dung/:id" element={<SuaNguoiDung />} />
        {/* Danh mục */}
        <Route path="quan-ly-danh-muc" element={<QuanLyDanhMuc />} />
        <Route path="quan-ly-danh-muc/tao-danh-muc" element={<TaoDanhMuc />} />
        <Route path="quan-ly-danh-muc/sua-danh-muc/:id" element={<SuaDanhMuc />} />
        

      </Route>
    </Routes>
  );
};

export default AdminRoutes;
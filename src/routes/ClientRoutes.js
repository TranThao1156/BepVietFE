import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Layout
import LayoutChung from '../layouts/LayoutChung';

// Import Pages
import Home from '../pages/GiaoDienChung/Home';
import DsCongThuc from '../pages/GiaoDienChung/DsCongThuc';
import ChitietCongthuc from '../pages/GiaoDienChung/ChiTietCongThuc';
import Blog from '../pages/GiaoDienChung/Blog';
import ChitietBlog from '../pages/GiaoDienChung/ChiTietBlog';
import AIChat from '../pages/GiaoDienChung/AIChat';
import Auth from '../pages/Auth/Auth';

const ClientRoutes = () => {
  return (
    <Routes>
      {/* --- NHÓM 1: CÁC TRANG CÓ HEADER/FOOTER (Dùng LayoutChung) --- */}
      <Route element={<LayoutChung />}>
        <Route index element={<Home />} /> {/* Đường dẫn gốc / */}
        
        <Route path="cong-thuc" element={<DsCongThuc />} />
        <Route path="cong-thuc/:idSlug" element={<ChitietCongthuc />} />
        
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:id" element={<ChitietBlog />} />
        
        <Route path="ai-chat" element={<AIChat />} />
      </Route>

      {/* --- NHÓM 2: CÁC TRANG ĐỘC LẬP (Login/Register) --- */}
      <Route path="login" element={<Auth />} />
      <Route path="register" element={<Auth />} />

      {/* Trang 404 của phía Client */}
      <Route path="*" element={<div style={{padding: 50, textAlign: 'center'}}>404 - Không tìm thấy trang</div>} />
    </Routes>
  );
};

export default ClientRoutes;
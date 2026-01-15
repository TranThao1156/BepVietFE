import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ClientRoutes from './ClientRoutes';
import AdminRoutes from './AdminRoutes';

const AppRouter = () => {
  return (
    <Routes>
      {/* QUAN TRỌNG: Dấu sao (*) ở cuối path báo hiệu cho React Router biết
        là "hãy nhường quyền xử lý phần còn lại cho file con".
      */}

      {/* 1. Nếu đường dẫn là /admin/... thì gọi AdminRoutes */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* 2. Tất cả đường dẫn còn lại (/*) thì gọi ClientRoutes */}
      <Route path="/*" element={<ClientRoutes />} />
      
    </Routes>
  );
};

export default AppRouter;
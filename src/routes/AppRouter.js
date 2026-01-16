import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ClientRoutes from './ClientRoutes';
import AdminRoutes from './AdminRoutes';
import UserRoutes from './UserRoutes';


const AppRouter = () => {
  return (
    <Routes>
      <Route path="/nguoi-dung" element={<Navigate to="/nguoi-dung/thong-tin-ca-nhan" replace />} />

      <Route path="/quan-tri/*" element={<AdminRoutes />} />

      <Route path="/nguoi-dung/*" element={<UserRoutes />} />


      <Route path="/*" element={<ClientRoutes />} />
      
      <Route path="*" element={<div>404 Not Found</div>} />

    </Routes>
  );
};

export default AppRouter;


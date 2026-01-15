
import { Routes, Route, Navigate } from "react-router-dom";
import UserRoutes from "./UserRoutes";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/nguoidung/thongtincanhan" replace />} />

      {UserRoutes()}

      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

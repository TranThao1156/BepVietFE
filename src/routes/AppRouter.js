import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// 1. Import các Middleware bảo mật
import RouteVaiTro from "../components/middleware/RouteVaiTro";
import RouteKhach from "../components/middleware/RouteKhach";

// 2. Import các Route con
import ClientRoutes from "./ClientRoutes";
import AdminRoutes from "./AdminRoutes";
import UserRoutes from "./UserRoutes";

// 3. Import trang Đăng nhập (Để dùng cho RouteKhach)
// Hãy chắc chắn đường dẫn này đúng với máy của bạn
import DangNhap from "../pages/Auth/Auth";

const AppRouter = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route path="/*" element={<ClientRoutes />} />

      {/* ================= AUTH (GUEST ONLY) ================= */}
      <Route element={<RouteKhach />}>
        <Route path="/dang-nhap" element={<DangNhap />} />
        <Route path="/dang-ky" element={<DangNhap />} />
      </Route>

      {/* ================= USER + ADMIN ================= */}
      {/* Admin kế thừa toàn bộ quyền user */}
      <Route element={<RouteVaiTro vaiTroChoPhep={[0, 1]} />}>
        <Route
          path="/nguoi-dung"
          element={<Navigate to="/nguoi-dung/thong-tin-ca-nhan" replace />}
        />
        <Route path="/nguoi-dung/*" element={<UserRoutes />} />
      </Route>

      {/* ================= ADMIN ONLY ================= */}
      <Route element={<RouteVaiTro vaiTroChoPhep={[0]} />}>
        <Route path="/quan-tri/*" element={<AdminRoutes />} />
      </Route>

      {/* ================= 404 ================= */}
      <Route
        path="*"
        element={
          <div style={{ textAlign: "center", marginTop: 50 }}>
            404 - Không tìm thấy trang
          </div>
        }
      />
      
    </Routes>
  );
};

export default AppRouter;

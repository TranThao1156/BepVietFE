import { Routes, Route, Navigate } from 'react-router';
import LayoutNguoiDung from '../layouts/LayoutNguoiDung';
import ThongTinCaNhan from '../pages/NguoiDung/ThongTinCaNhan';
import CookBook from '../pages/NguoiDung/Cookbook';
import ChiTietCookbook from '../pages/NguoiDung/ChiTietCookbook';
import DoiMatKhau from '../pages/NguoiDung/DoiMatKhau';
import LichSuTruyCap from '../pages/NguoiDung/LichSuTruyCap';
import QlCongThuc from '../pages/NguoiDung/QlCongThuc';
import QlBlog from '../pages/NguoiDung/QlBlog';
import SuaBlog from '../pages/NguoiDung/SuaBlog';
import SuaCongThuc from '../pages/NguoiDung/SuaCongThuc';
import TaoBlog from '../pages/NguoiDung/TaoBlog';
import TaoCongThuc from '../pages/NguoiDung/TaoCongThuc';
import TaoCookbook from '../pages/NguoiDung/TaoCookbook';



export default function UserRoutes() {
  return (
    <Routes>
      <Route element={<LayoutNguoiDung />}>
        <Route path="thong-tin-ca-nhan" element={<ThongTinCaNhan />} />
        <Route path="cookbook" element={<CookBook />} />
        <Route path="cookbook/chi-tiet-cookbook" element={<ChiTietCookbook />} />
        <Route path="doi-mat-khau" element={<DoiMatKhau />} />
        <Route path="lich-su-truy-cap" element={<LichSuTruyCap />} />
        <Route path="ql-cong-thuc" element={<QlCongThuc />} />
        <Route path="ql-blog" element={<QlBlog />} />
        <Route path="ql-blog/sua-blog" element={<SuaBlog />} />
        <Route path="ql-cong-thuc/sua-cong-thuc" element={<SuaCongThuc />} />
        <Route path="ql-blog/tao-blog" element={<TaoBlog />} />
        <Route path="ql-cong-thuc/tao-cong-thuc" element={<TaoCongThuc />} />
        <Route path="cookbook/tao-cookbook" element={<TaoCookbook />} />
      </Route>
      </Routes>
  );
}

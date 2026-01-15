import { Routes, Route, Navigate } from 'react-router-dom';
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
    <>
      <Route path="/nguoidung" element={<LayoutNguoiDung />}>
        <Route path="thongtincanhan" element={<ThongTinCaNhan />} />
        <Route path="cookbook" element={<CookBook />} />
        <Route path="chitietcookbook" element={<ChiTietCookbook />} />
        <Route path="doimatkhau" element={<DoiMatKhau />} />
        <Route path="lichsutruycap" element={<LichSuTruyCap />} />
        <Route path="qlcongthuc" element={<QlCongThuc />} />
        <Route path="qlblog" element={<QlBlog />} />
        <Route path="suablog" element={<SuaBlog />} />
        <Route path="suacongthuc" element={<SuaCongThuc />} />
        <Route path="taoblog" element={<TaoBlog />} />
        <Route path="taocongthuc" element={<TaoCongThuc />} />
        <Route path="taocookbook" element={<TaoCookbook />} />
      </Route>
      </>
  );
}

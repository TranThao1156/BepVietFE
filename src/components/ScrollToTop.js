import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Mỗi khi pathname thay đổi (tức là chuyển trang), cuộn lên toạ độ 0,0
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Component này không hiển thị gì cả, chỉ chạy logic
};

export default ScrollToTop;
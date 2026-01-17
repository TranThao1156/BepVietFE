import React from 'react';
import { Link } from 'react-router-dom';
import DsCongThuc from './DsCongThuc'; //Trâm-import 
const Home = () => {
  // --- MOCK DATA (Dữ liệu giả lập thay cho Database) ---
  const monNgonNoiBat = [
    {
      id: 1,
      TenMon: "Phở Bò Gia Truyền Nam Định",
      HinhAnh: "https://images.unsplash.com/photo-1582878826618-c05326eff935?q=80&w=2070&auto=format&fit=crop",
      ThoiGianNau: 90,
      DoKho: "Trung bình",
      average_rating: 4.9,
      tacGia: { HoTen: "Bếp cô Minh", AnhDaiDien: "https://randomuser.me/api/portraits/women/44.jpg" }
    },
    {
      id: 2,
      TenMon: "Cơm Tấm Sườn Bì Chả",
      HinhAnh: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=1000&auto=format&fit=crop",
      ThoiGianNau: 45,
      DoKho: "Dễ",
      average_rating: 4.7,
      tacGia: { HoTen: "Chef Tuấn", AnhDaiDien: "https://randomuser.me/api/portraits/men/32.jpg" }
    },
    {
      id: 3,
      TenMon: "Gỏi Cuốn Tôm Thịt",
      HinhAnh: "https://images.unsplash.com/photo-1548596638-349c25055b80?q=80&w=1000&auto=format&fit=crop",
      ThoiGianNau: 30,
      DoKho: "Rất dễ",
      average_rating: 5.0,
      tacGia: { HoTen: "Lan Nhi", AnhDaiDien: "https://randomuser.me/api/portraits/women/65.jpg" }
    },
    {
      id: 4,
      TenMon: "Bánh Xèo Miền Tây",
      HinhAnh: "https://images.unsplash.com/photo-1551185627-2b7b3b421274?q=80&w=1000&auto=format&fit=crop",
      ThoiGianNau: 60,
      DoKho: "Khó",
      average_rating: 4.5,
      tacGia: { HoTen: "Mẹ Gấu", AnhDaiDien: "https://randomuser.me/api/portraits/women/68.jpg" }
    }
  ];

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section className="hero">
        <div className="container">
            <h1>Khám phá hương vị <br />Việt Nam</h1>
            <p>Hàng ngàn công thức nấu ăn chuẩn vị từ các đầu bếp tại gia.</p>
            <div className="hero-btns">
                <Link to="/cong-thuc" className="btn btn-primary">
                    Xem công thức
                </Link>
            </div>
        </div>
      </section>

      <main className="container">
        
        {/* ================= SECTION 1: MÓN NGON NỔI BẬT ================= */}
        {/* Trâm - thay thế code cũ bằng Component DsCongThuc */}
        <div id="danh-sach-mon" style={{ marginTop: '50px', marginBottom: '80px' }}>
             <DsCongThuc />
        </div>

        {/* ================= SECTION 2: KHÁM PHÁ 3 MIỀN ================= */}
        <div className="section-header" style={{ justifyContent: 'center', marginTop: '60px' }}>
            <h2>Khám phá Ẩm thực 3 Miền</h2>
        </div>
        
        <div className="grid-3">
            <div className="region-card">
                <img src="https://images.unsplash.com/photo-1555921015-5532091f6026?q=80&w=1000&auto=format&fit=crop" alt="Miền Bắc" />
                <div className="region-overlay">
                    <div className="region-title">Miền Bắc</div>
                </div>
            </div>
            <div className="region-card">
                <img src="https://images.unsplash.com/photo-1565060169123-e99d821361c4?q=80&w=1000&auto=format&fit=crop" alt="Miền Trung" />
                <div className="region-overlay">
                    <div className="region-title">Miền Trung</div>
                </div>
            </div>
            <div className="region-card">
                <img src="https://images.unsplash.com/photo-1559592413-7cec4d0ea49b?q=80&w=1000&auto=format&fit=crop" alt="Miền Nam" />
                <div className="region-overlay">
                    <div className="region-title">Miền Nam</div>
                </div>
            </div>
        </div>

        {/* ================= SECTION 3: MÓN NGON MỚI ================= */}
       {/* Trâm-xóa  */}

        {/* ================= SECTION 4: AI BANNER ================= */}
        <div className="ai-banner">
            <div className="ai-content">
                <div className="ai-badge">
                    <i className="fa-solid fa-robot"></i> Mới: Trợ lý AI
                </div>
                <h2>Bạn không biết nấu gì hôm nay?</h2>
                <p>Chỉ cần nhập nguyên liệu bạn có, AI Chef sẽ gợi ý ngay.</p>
                <button className="btn btn-white">
                    <Link to="/ai-chat" style={{ color: 'var(--primary-color)' }}>
                        Thử ngay miễn phí
                    </Link>
                </button>
            </div>
            <div className="ai-icon">
                <i className="fa-solid fa-utensils"></i>
            </div>
        </div>

      </main>
    </>
  );
};

export default Home;
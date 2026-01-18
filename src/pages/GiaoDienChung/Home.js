import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';


const Home = () => {
  // 17/01/2026 Thi Lấy dữ liệu từ API từ BE
    const [monNgonNoiBat, setMonNgonNoiBat] = useState([]);
    const [monMoi, setMonMoi] = useState([]);
    const [monMienBac, setMonMienBac] = useState(null);
    const [monMienTrung, setMonMienTrung] = useState(null);
    const [monMienNam, setMonMienNam] = useState(null);
    const [loading, setLoading] = useState(true);
   useEffect(() => {
  const fetchData = async () => {
    try {
      const [noiBatRes, moiRes, bacRes, trungRes, namRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/cong-thuc/mon-noi-bat").then(r => {
          if (!r.ok) throw new Error("Lỗi mon-noi-bat");
          return r.json();
        }),
        fetch("http://127.0.0.1:8000/api/cong-thuc/mon-moi").then(r => {
          if (!r.ok) throw new Error("Lỗi mon-moi");
          return r.json();
        }),
        fetch("http://127.0.0.1:8000/api/cong-thuc/mien-noi-bat/bac").then(r => {
          if (!r.ok) throw new Error("Lỗi món nổi bật miền Bắc");
          return r.json();
        }),
        fetch("http://127.0.0.1:8000/api/cong-thuc/mien-noi-bat/trung").then(r => {
          if (!r.ok) throw new Error("Lỗi món nổi bật miền Trung");
          return r.json();
        }),
        fetch("http://127.0.0.1:8000/api/cong-thuc/mien-noi-bat/nam").then(r => {
          if (!r.ok) throw new Error("Lỗi món nổi bật miền Nam");
          return r.json();
        })
      ]);
      // Kiểm tra kết quả trả về
      console.log("Bắc:", bacRes);
      console.log("Trung:", trungRes);
      console.log("Nam:", namRes);

      if (noiBatRes.success) setMonNgonNoiBat(noiBatRes.data);
      if (moiRes.success) setMonMoi(moiRes.data);
      if (bacRes.success) setMonMienBac(bacRes.data);
      if (trungRes.success) setMonMienTrung(trungRes.data);
      if (namRes.success) setMonMienNam(namRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

    if (loading) 
    {
        return <p style={{ textAlign: 'center' }}>Đang tải dữ liệu...</p>;
    }

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
        <div className="section-header">
            <h2>Món ngon nổi bật</h2>
            <Link to="/cong-thuc" className="view-all">
                Xem tất cả <i className="fa-solid fa-arrow-right"></i>
            </Link>
        </div>

        <div className="grid-4">
            {monNgonNoiBat.map((mon) => (
                <article className="card" key={mon.Ma_CT}>
                    {/* Ảnh món ăn */}
                    <img 
                        src={`http://127.0.0.1:8000/storage/img/CongThuc/${mon.HinhAnh}`} 
                        alt={mon.TenMon} 
                        className="card-img" 
                    />

                    <div className="card-body">
                        {/* Tên món (Click vào sẽ sang trang chi tiết) */}
                        <Link to={`/cong-thuc/${mon.Ma_CT}`} className="card-title">
                            {mon.TenMon}
                        </Link>

                        <div className="card-meta">
                            <i className="fa-regular fa-clock"></i> {mon.ThoiGianNau}p
                            <span>{mon.DoKho}</span>
                        </div>

                        <div className="card-footer">
                            {mon.nguoi_dung && (
                            <div className="author">
                                <img
                                src={`http://127.0.0.1:8000/storage/img/NguoiDung/${mon.nguoi_dung.AnhDaiDien}`}
                                alt={mon.nguoi_dung.HoTen}
                                />
                                <span>{mon.nguoi_dung.HoTen}</span>
                            </div>
                            )}
                            <div className="rating">
                                <i className="fa-solid fa-star"></i> {mon.average_rating}
                            </div>
                        </div>
                    </div>
                </article>
            ))}
        </div>

        {/* ================= SECTION 2: KHÁM PHÁ 3 MIỀN ================= */}
        <div className="section-header" style={{ justifyContent: 'center', marginTop: '60px' }}>
            <h2>Khám phá Ẩm thực 3 Miền</h2>
        </div>
        
        <div className="grid-3">
            <Link to="/cong-thuc/mien-bac" className="region-card">
                {monMienBac&& (
                <img
                    src={`http://127.0.0.1:8000/storage/img/CongThuc/${monMienBac.HinhAnh}`}
                    alt="Miền Bắc"
                />
                )}
                <div className="region-overlay">
                <div className="region-title">Miền Bắc</div>
                </div>
            </Link>
            <Link to="/cong-thuc/mien-trung" className="region-card">
                {monMienTrung && (
                <img
                    src={`http://127.0.0.1:8000/storage/img/CongThuc/${monMienTrung.HinhAnh}`}
                    alt="Miền Trung"
                />
                )}
                <div className="region-overlay">
                    <div className="region-title">Miền Trung</div>
                </div>
            </Link>
            <Link to="/cong-thuc/mien-nam" className="region-card">
                {monMienNam && (
                <img
                    src={`http://127.0.0.1:8000/storage/img/CongThuc/${monMienNam.HinhAnh}`}
                    alt="Miền Nam"
                />
                )}      
                <div className="region-overlay">
                    <div className="region-title">Miền Nam</div>
                </div>
            </Link>
        </div>

        {/* ================= SECTION 3: MÓN NGON MỚI ================= */}
        <div className="section-header">
            <h2>Món ngon mới</h2>
            <Link to="/cong-thuc" className="view-all">
                Xem tất cả <i className="fa-solid fa-arrow-right"></i>
            </Link>
        </div>

        {/* Tái sử dụng grid card nhưng có thể map dữ liệu khác nếu muốn */}
        <div className="grid-4">
            {monMoi.map((mon) => (
                <article className="card" key={`new-${mon.Ma_CT}`}>
                    <img src={`http://127.0.0.1:8000/storage/img/CongThuc/${mon.HinhAnh}`} alt={mon.TenMon} className="card-img" />
                    <div className="card-body">
                        <Link to={`/cong-thuc/${mon.Ma_CT}`} className="card-title">
                            {mon.TenMon}
                        </Link>
                        <div className="card-meta">
                            <i className="fa-regular fa-clock"></i> {mon.ThoiGianNau}p
                            <span>{mon.DoKho}</span>
                        </div>
                        <div className="card-footer">
                            <div className="author">
                                <img src={`http://127.0.0.1:8000/storage/img/NguoiDung/${mon.nguoi_dung.AnhDaiDien}`} alt="Avatar" />
                                <span>{mon.nguoi_dung.HoTen}</span>
                            </div>
                            <div className="rating">
                                <i className="fa-solid fa-star"></i> {mon.average_rating}
                            </div>
                        </div>
                    </div>
                </article>
            ))}
        </div>

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
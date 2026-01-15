import React from 'react';

const BangDieuKhien = () => {
  return (
    <main className="main-content">

        <div className="welcome-section">
            <h2>Chào quản trị viên!</h2>
            <p className="sub-welcome">Dưới đây là tổng quan hoạt động của hệ thống Cook&Share.</p>
        </div>

        <div className="stats-grid">
            <div className="stat-card">
                <div className="stat-header">
                    <span className="stat-label">Tổng người dùng</span>
                    <div className="stat-icon blue"><i className="fas fa-user-friends"></i></div>
                </div>
                <div className="stat-body">
                    <h4 className="stat-value">5,240</h4>
                    <span className="stat-trend positive"><i className="fas fa-arrow-up"></i> +520 hôm nay</span>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-header">
                    <span className="stat-label">Tổng công thức</span>
                    <div className="stat-icon orange"><i className="fas fa-book-open"></i></div>
                </div>
                <div className="stat-body">
                    <h4 className="stat-value">1,500</h4>
                    <span className="stat-trend positive"><i className="fas fa-arrow-up"></i> +35 mới</span>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-header">
                    <span className="stat-label">Chờ phê duyệt</span>
                    <div className="stat-icon red"><i className="fas fa-file-signature"></i></div>
                </div>
                <div className="stat-body">
                    <h4 className="stat-value">24</h4>
                    <span className="stat-trend urgent">Hiện tại</span>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-header">
                    <span className="stat-label">Tổng lượt xem</span>
                    <div className="stat-icon purple"><i className="fas fa-eye"></i></div>
                </div>
                <div className="stat-body">
                    <h4 className="stat-value">45,280</h4>
                    <span className="stat-trend positive"><i className="fas fa-arrow-up"></i> +12% so tháng trước</span>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-header">
                    <span className="stat-label">Tổng danh mục</span>
                    <div className="stat-icon teal"><i className="fas fa-list"></i></div>
                </div>
                <div className="stat-body">
                    <h4 className="stat-value">32</h4>
                    <span className="stat-trend" style={{color: '#666'}}>Đang hoạt động</span>
                </div>
            </div>
        </div>

        <div className="chart-container">
            <div className="chart-header">
                <h3>Lượt đăng ký người dùng mới</h3>
                <select className="chart-filter" defaultValue="7days">
                    <option value="7days">7 ngày qua</option>
                    <option value="month">Tháng này</option>
                    <option value="year">Năm nay</option>
                </select>
            </div>

            <div className="chart-canvas-area">
                {/* SVG Chart converted to React Props */}
                <svg viewBox="0 0 1000 300" className="chart-svg" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="gradientFill" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#F4501E" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path d="M0,250 C150,250 200,150 350,180 S550,220 650,150 S850,50 1000,80"
                        fill="none" stroke="#F4501E" strokeWidth="3" strokeLinecap="round" />
                    
                    {/* Circles */}
                    <circle cx="0" cy="250" r="5" fill="#fff" stroke="#F4501E" strokeWidth="2" />
                    <circle cx="175" cy="220" r="5" fill="#fff" stroke="#F4501E" strokeWidth="2" />
                    <circle cx="350" cy="180" r="5" fill="#fff" stroke="#F4501E" strokeWidth="2" />
                    <circle cx="525" cy="200" r="5" fill="#fff" stroke="#F4501E" strokeWidth="2" />
                    <circle cx="700" cy="170" r="5" fill="#fff" stroke="#F4501E" strokeWidth="2" />
                    <circle cx="875" cy="80" r="5" fill="#fff" stroke="#F4501E" strokeWidth="2" />
                    <circle cx="1000" cy="80" r="5" fill="#fff" stroke="#F4501E" strokeWidth="2" />
                </svg>
            </div>

            <div className="chart-labels">
                <span>T2</span>
                <span>T3</span>
                <span>T4</span>
                <span>T5</span>
                <span>T6</span>
                <span>T7</span>
                <span>CN</span>
            </div>
        </div>

    </main>
  );
};

export default BangDieuKhien;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Import các thành phần để vẽ biểu đồ
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Đăng ký ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const BangDieuKhien = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // State lưu dữ liệu (Cấu trúc khớp với JSON trả về từ API)
  const [stats, setStats] = useState({
    users: { total: 0, new_today: 0 },
    recipes: { total: 0, new_today: 0, pending: 0 },
    views: { total: 0, growth: 0 },
    categories: { total: 0 },
    chart: [],
  });

  const [filterType, setFilterType] = useState("7days");

  // Gọi API khi component load
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        navigate("/dang-nhap");
        return;
      }

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/admin/dashboard?filter=${filterType}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.status === 401) {
          alert("Phiên đăng nhập hết hạn");
          navigate("/dang-nhap");
          return;
        }

        const json = await response.json();
        if (json.success) {
          setStats(json.data);
        }
      } catch (error) {
        console.error("Lỗi kết nối:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, filterType]);

  // --- Cấu hình Biểu đồ cho giống thiết kế cũ ---
  const chartData = {
    // Lấy nhãn ngày từ API (VD: T2, T3...)
    labels: stats.chart.map((item) => item.label),
    datasets: [
      {
        label: "Đăng ký mới",
        data: stats.chart.map((item) => item.count),
        borderColor: "#F4501E", // Màu cam giống SVG cũ
        backgroundColor: (context) => {
          // Tạo gradient màu cam nhạt giống thiết kế
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(244, 80, 30, 0.2)");
          gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
          return gradient;
        },
        tension: 0.4, // Tạo đường cong mềm mại (bezier curve)
        fill: true,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#F4501E",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // Ẩn chú thích
      tooltip: {
        backgroundColor: "#333",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
      x: {
        grid: { display: false }, // Ẩn lưới dọc
        ticks: { color: "#666" },
      },
      y: {
        display: false, // Ẩn trục Y để giống thiết kế cũ
        min: 0,
      },
    },
  };

  if (loading)
    return <div style={{ padding: "20px" }}>Đang tải dữ liệu...</div>;

  return (
    <main className="main-content">
      <div className="welcome-section">
        <h2>Chào quản trị viên!</h2>
        <p className="sub-welcome">
          Dưới đây là tổng quan hoạt động của hệ thống Cook&Share.
        </p>
      </div>

      <div className="stats-grid">
        {/* Card 1: Người dùng */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Tổng người dùng</span>
            <div className="stat-icon blue">
              <i className="fas fa-user-friends"></i>
            </div>
          </div>
          <div className="stat-body">
            <h4 className="stat-value">{stats.users.total.toLocaleString()}</h4>
            <span className="stat-trend positive">
              <i className="fas fa-arrow-up"></i> +{stats.users.new_today} hôm
              nay
            </span>
          </div>
        </div>

        {/* Card 2: Công thức */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Tổng công thức</span>
            <div className="stat-icon orange">
              <i className="fas fa-book-open"></i>
            </div>
          </div>
          <div className="stat-body">
            <h4 className="stat-value">
              {stats.recipes.total.toLocaleString()}
            </h4>
            <span className="stat-trend positive">
              <i className="fas fa-arrow-up"></i> +{stats.recipes.new_today} mới
            </span>
          </div>
        </div>

        {/* Card 3: Chờ phê duyệt */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Chờ phê duyệt</span>
            <div className="stat-icon red">
              <i className="fas fa-file-signature"></i>
            </div>
          </div>
          <div className="stat-body">
            <h4 className="stat-value">{stats.recipes.pending}</h4>
            <span className="stat-trend urgent">Hiện tại</span>
          </div>
        </div>

        {/* Card 4: Tổng lượt xem */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Tổng lượt xem</span>
            <div className="stat-icon purple">
              <i className="fas fa-eye"></i>
            </div>
          </div>
          <div className="stat-body">
            <h4 className="stat-value">
              {Number(stats.views.total).toLocaleString()}
            </h4>
            <span className="stat-trend positive">
              <i className="fas fa-arrow-up"></i> +{stats.views.growth}% so
              tháng trước
            </span>
          </div>
        </div>

        {/* Card 5: Tổng danh mục */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Tổng danh mục</span>
            <div className="stat-icon teal">
              <i className="fas fa-list"></i>
            </div>
          </div>
          <div className="stat-body">
            <h4 className="stat-value">{stats.categories.total}</h4>
            <span className="stat-trend" style={{ color: "#666" }}>
              Đang hoạt động
            </span>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h3>Lượt đăng ký người dùng mới</h3>
          <select
            className="chart-filter"
            value={filterType} // 1. Gắn giá trị từ state
            onChange={(e) => setFilterType(e.target.value)} // 2. Cập nhật state khi chọn
          >
            <option value="7days">7 ngày qua</option>
            <option value="month">Tháng này</option>
            <option value="year">Năm nay</option>
          </select>
        </div>

        {/* Thay thế SVG tĩnh bằng ChartJS động */}
        <div
          className="chart-canvas-area"
          style={{ position: "relative", height: "300px", width: "100%" }}
        >
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Đã bỏ div chart-labels cũ vì ChartJS tự render label ở trục X */}
      </div>
    </main>
  );
};

export default BangDieuKhien;

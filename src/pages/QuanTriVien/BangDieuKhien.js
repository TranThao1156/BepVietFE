import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Filler
);

const BangDieuKhien = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false); // State để hiển thị loading khi đang xuất file

  // State lưu dữ liệu
  const [stats, setStats] = useState({
    users: { total: 0, new_today: 0 },
    recipes: { total: 0, new_today: 0, pending: 0 },
    views: { total: 0, growth: 0 },
    categories: { total: 0 },
    chart: [],
  });

  const [filterType, setFilterType] = useState("7days");

  // Gọi API lấy dữ liệu dashboard
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
          }
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

  // --- HÀM XỬ LÝ XUẤT EXCEL (MỚI THÊM) ---
  const handleExport = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    setExporting(true); // Bật trạng thái loading cho nút bấm

    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/dashboard/export", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Không cần Content-Type json vì nhận file
        },
      });

      if (response.status === 401) {
        navigate("/dang-nhap");
        return;
      }

      if (!response.ok) {
        throw new Error("Lỗi khi tải file báo cáo");
      }

      // 1. Chuyển response thành Blob (Dữ liệu nhị phân)
      const blob = await response.blob();

      // 2. Tạo đường dẫn ảo (Object URL)
      const url = window.URL.createObjectURL(blob);
      
      // 3. Tạo thẻ a ẩn để kích hoạt tải xuống
      const a = document.createElement("a");
      a.href = url;
      
      // Đặt tên file kèm ngày giờ hiện tại
      const dateStr = new Date().toISOString().slice(0, 10);
      a.download = `Bao_cao_thong_ke_${dateStr}.xlsx`;
      
      document.body.appendChild(a);
      a.click();
      
      // 4. Dọn dẹp
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Xuất excel thất bại:", error);
      alert("Không thể xuất báo cáo. Vui lòng thử lại sau.");
    } finally {
      setExporting(false); // Tắt loading
    }
  };

  // --- Cấu hình Biểu đồ ---
  const chartData = {
    labels: stats.chart.map((item) => item.label),
    datasets: [
      {
        label: "Đăng ký mới",
        data: stats.chart.map((item) => item.count),
        borderColor: "#F4501E",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(244, 80, 30, 0.2)");
          gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
          return gradient;
        },
        tension: 0.4,
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
      legend: { display: false },
      tooltip: {
        backgroundColor: "#333",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#666" },
      },
      y: {
        display: false,
        min: 0,
      },
    },
  };

  if (loading)
    return <div style={{ padding: "20px" }}>Đang tải dữ liệu...</div>;

  return (
    <main className="main-content">
      {/* Sửa lại phần Header để chứa nút Export */}
      <div className="welcome-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2>Chào quản trị viên!</h2>
          <p className="sub-welcome">
            Dưới đây là tổng quan hoạt động của hệ thống Cook&Share.
          </p>
        </div>
        
        {/* NÚT XUẤT EXCEL */}
        <button 
            onClick={handleExport}
            disabled={exporting}
            style={{
                backgroundColor: '#107C41', // Màu xanh Excel
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: exporting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '600',
                opacity: exporting ? 0.7 : 1,
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
        >
            {exporting ? (
                <>
                    <i className="fas fa-spinner fa-spin"></i> Đang xuất...
                </>
            ) : (
                <>
                    <i className="fas fa-file-excel"></i> Xuất Báo Cáo
                </>
            )}
        </button>
      </div>

      <div className="stats-grid">
        {/* ... (Giữ nguyên phần Cards Stats của bạn) ... */}
        {/* Card 1 */}
        <Link to="/quan-tri/quan-ly-nguoi-dung">
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Tổng người dùng</span>
              <div className="stat-icon blue"><i className="fas fa-user-friends"></i></div>
            </div>
            <div className="stat-body">
              <h4 className="stat-value">{stats.users.total.toLocaleString()}</h4>
              <span className="stat-trend positive">
                <i className="fas fa-arrow-up"></i> +{stats.users.new_today} hôm nay
              </span>
            </div>
          </div>
        </Link>

        {/* Card 2 */}
        <Link to="/cong-thuc">
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Tổng công thức</span>
              <div className="stat-icon orange"><i className="fas fa-book-open"></i></div>
            </div>
            <div className="stat-body">
              <h4 className="stat-value">{stats.recipes.total.toLocaleString()}</h4>
              <span className="stat-trend positive">
                <i className="fas fa-arrow-up"></i> +{stats.recipes.new_today} mới
              </span>
            </div>
          </div>
        </Link>

        {/* Card 3 */}
        <Link to="/quan-tri/kiem-duyet">
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Chờ phê duyệt</span>
              <div className="stat-icon red"><i className="fas fa-file-signature"></i></div>
            </div>
            <div className="stat-body">
              <h4 className="stat-value">{stats.recipes.pending}</h4>
              <span className="stat-trend urgent">Hiện tại</span>
            </div>
          </div>
        </Link>

        {/* Card 4 */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Tổng lượt xem</span>
            <div className="stat-icon purple"><i className="fas fa-eye"></i></div>
          </div>
          <div className="stat-body">
            <h4 className="stat-value">{Number(stats.views.total).toLocaleString()}</h4>
            <span className="stat-trend positive">
              <i className="fas fa-arrow-up"></i> +{stats.views.growth}% so tháng trước
            </span>
          </div>
        </div>

        {/* Card 5 */}
        <Link to="/quan-tri/quan-ly-danh-muc">
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Tổng danh mục</span>
              <div className="stat-icon teal"><i className="fas fa-list"></i></div>
            </div>
            <div className="stat-body">
              <h4 className="stat-value">{stats.categories.total}</h4>
              <span className="stat-trend" style={{ color: "#666" }}>Đang hoạt động</span>
            </div>
          </div>
        </Link>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h3>Lượt đăng ký người dùng mới</h3>
          <select
            className="chart-filter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="7days">7 ngày qua</option>
            <option value="month">Tháng này</option>
            <option value="year">Năm nay</option>
          </select>
        </div>

        <div className="chart-canvas-area" style={{ position: "relative", height: "300px", width: "100%" }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </main>
  );
};

export default BangDieuKhien;
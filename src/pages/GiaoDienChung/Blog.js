import React from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
  // MOCK DATA: Danh sách bài viết
  const blogs = [
    { id: 1, title: "10 mẹo giữ rau củ tươi lâu trong tủ lạnh", desc: "Cách bảo quản rau củ quả luôn tươi ngon cả tuần mà không bị mất chất dinh dưỡng...", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop", date: "08/01/2026" },
    { id: 2, title: "Đánh giá top 5 nồi chiên không dầu tốt nhất", desc: "So sánh chi tiết ưu nhược điểm của các dòng nồi chiên hot nhất hiện nay...", img: "https://images.unsplash.com/photo-1626082927389-d3164294050d?q=80&w=1000&auto=format&fit=crop", date: "05/01/2026" },
    { id: 3, title: "Chế độ ăn Eat Clean cho người mới bắt đầu", desc: "Lộ trình 7 ngày ăn sạch sống khỏe, giảm cân an toàn và hiệu quả...", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop", date: "02/01/2026" },
    { id: 4, title: "Ý nghĩa mâm ngũ quả ngày Tết cổ truyền", desc: "Khám phá ý nghĩa sâu sắc đằng sau các loại quả được bày biện trên bàn thờ tổ tiên...", img: "https://images.unsplash.com/photo-1541544744-5e3604b95f8a?q=80&w=1000&auto=format&fit=crop", date: "01/01/2026" },
    { id: 5, title: "Một vòng Food Tour phố cổ Hà Nội", desc: "Cùng dạo quanh 36 phố phường và thưởng thức những món ăn đường phố trứ danh...", img: "https://images.unsplash.com/photo-1555243896-c709bfa0b564?q=80&w=1000&auto=format&fit=crop", date: "28/12/2025" },
    { id: 6, title: "Cách khử mùi tanh hải sản cực đơn giản", desc: "Chỉ với vài nguyên liệu sẵn có trong bếp, bạn có thể đánh bay mùi tanh khó chịu...", img: "https://images.unsplash.com/photo-1563729768-6af5846410a3?q=80&w=1000&auto=format&fit=crop", date: "20/12/2025" },
  ];

  return (
    <main className="container">
        <div className="blog-header-section">
            <div className="breadcrumb" style={{justifyContent: 'center'}}>
                <Link to="/">Trang chủ</Link> <i className="fa-solid fa-chevron-right"></i> <span>Blog & Chia sẻ</span>
            </div>
            <h1>Góc Chia Sẻ & Mẹo Vặt</h1>
            <p>Nơi lưu giữ những câu chuyện bếp núc, mẹo vặt cuộc sống và văn hóa ẩm thực ba miền.</p>
        </div>

        <div className="blog-toolbar">
            <span className="result-count">Hiển thị <b>{blogs.length}</b> bài viết mới nhất</span>
            <div className="sort-box">
                <i className="fa-solid fa-arrow-up-wide-short"></i>
                <span>Sắp xếp:</span>
                <select defaultValue="newest">
                    <option value="newest">Mới nhất</option>
                    <option value="popular">Xem nhiều nhất</option>
                </select>
            </div>
        </div>

        <div className="grid-4">
            {blogs.map((blog) => (
                <article className="card blog-card" key={blog.id}>
                    <div className="card-img-wrapper">
                        <Link to={`/blog/${blog.id}`}>
                            <img src={blog.img} alt={blog.title} className="card-img" />
                        </Link>
                    </div>
                    <div className="card-body">
                        <Link to={`/blog/${blog.id}`} className="card-title">{blog.title}</Link>
                        <p className="blog-desc">{blog.desc}</p>
                        <div className="card-footer">
                            <div className="blog-date">
                                <i className="fa-regular fa-calendar"></i> {blog.date}
                            </div>
                        </div>
                    </div>
                </article>
            ))}
        </div>

        <div className="pagination">
            <a href="#" className="page-link"><i className="fa-solid fa-chevron-left"></i></a>
            <a href="#" className="page-link active">1</a>
            <a href="#" className="page-link">2</a>
            <a href="#" className="page-link">3</a>
            <a href="#" className="page-link"><i className="fa-solid fa-chevron-right"></i></a>
        </div>
    </main>
  );
};

export default Blog;
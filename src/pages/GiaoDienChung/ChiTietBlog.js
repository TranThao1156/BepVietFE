import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import BinhLuanBlog from '../NguoiDung/BinhLuanBlog'; //Trâm import BinhLuanBlog
const ChitietBlog = () => {
  const { id } = useParams();
    //Trâm thêm 
const [currentUser, setCurrentUser] = useState(null);

useEffect(() => {
    const userStr = localStorage.getItem("user"); // Key này được lưu lúc bạn Login thành công
    if (userStr) {
        try {
            setCurrentUser(JSON.parse(userStr));
        } catch (e) {
            console.error("Lỗi parse user từ localStorage");
        }
    }
}, []);
  // hết phần của Trâm
  
  // Dữ liệu giả cho 1 bài viết
  const post = {
    title: "10 mẹo giữ rau củ tươi lâu trong tủ lạnh mà bà nội trợ nào cũng nên biết",
    category: "Mẹo vặt",
    author: "Bếp cô Minh",
    date: "08/01/2026",
    views: "1.5k",
    comments: 24,
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop"
  };

  return (
    <main className="container">
        <div className="breadcrumb" style={{ margin: '30px 0' }}>
            <Link to="/blog">Blog</Link> <i className="fa-solid fa-chevron-right"></i> <span>Chi tiết bài viết</span>
        </div>

        <div className="blog-detail-layout">
            {/* NỘI DUNG CHÍNH */}
            <article className="blog-article">
                <span className="category-badge">{post.category}</span>
                <h1 className="article-title">{post.title} (ID: {id})</h1>

                <div className="article-meta">
                    <div className="author-mini">
                        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Author" />
                        <div>
                            <strong>{post.author}</strong>
                            <span>Đăng ngày {post.date}</span>
                        </div>
                    </div>
                    <div className="meta-stats">
                        <span><i className="fa-regular fa-eye"></i> {post.views} lượt xem</span>
                        <span><i className="fa-regular fa-comment"></i> {post.comments} bình luận</span>
                    </div>
                </div>

                <div className="article-featured-img">
                    <img src={post.img} alt="Featured" />
                </div>

                <div className="article-content">
                    <p className="lead">Việc bảo quản rau củ quả đúng cách không chỉ giúp thực phẩm tươi ngon lâu hơn mà còn giữ trọn vẹn chất dinh dưỡng. Dưới đây là những bí quyết đơn giản nhưng cực kỳ hiệu quả.</p>

                    <h2>1. Phân loại rau củ trước khi cho vào tủ lạnh</h2>
                    <p>Không phải loại rau củ nào cũng có thể để chung với nhau. Một số loại quả như táo, chuối, cà chua khi chín sẽ giải phóng khí Ethylene, làm các loại rau lá xanh bên cạnh nhanh bị héo úa.</p>
                    <p>Vì vậy, quy tắc đầu tiên là: <strong>Hãy để riêng các loại củ quả sinh khí Ethylene với các loại rau lá xanh.</strong></p>

                    <h2>2. Không rửa rau trước khi cất</h2>
                    <p>Nhiều người có thói quen đi chợ về rửa sạch rau rồi mới cất tủ lạnh cho tiện. Tuy nhiên, độ ẩm còn sót lại sau khi rửa chính là môi trường lý tưởng cho vi khuẩn và nấm mốc phát triển.</p>

                    <blockquote>
                        <i className="fa-solid fa-quote-left"></i>
                        Chỉ nên rửa rau ngay trước khi chế biến. Nếu bắt buộc phải rửa, hãy đảm bảo rau thật ráo nước hoặc dùng khăn giấy thấm khô trước khi cho vào hộp.
                    </blockquote>

                    <h2>3. Sử dụng khăn giấy</h2>
                    <p>Lót một lớp khăn giấy vào đáy hộp đựng rau hoặc túi zip. Khăn giấy sẽ hút bớt độ ẩm dư thừa, giúp rau không bị úng nước và giữ được độ tươi giòn lên đến cả tuần.</p>
                    
                    <h3>Kết luận</h3>
                    <p>Hy vọng với những mẹo nhỏ trên, căn bếp của bạn sẽ luôn đầy ắp những nguyên liệu tươi ngon.</p>
                </div>

                <div className="article-footer">
                    <div className="tags-list">
                        <span className="tag">#MẹoVặt</span>
                        <span className="tag">#BảoQuản</span>
                        <span className="tag">#SốngXanh</span>
                    </div>
                    <div className="share-buttons">
                        <span>Chia sẻ:</span>
                        <a href="#!" className="share-icon facebook"><i className="fa-brands fa-facebook"></i></a>
                        <a href="#!" className="share-icon pinterest"><i className="fa-brands fa-pinterest"></i></a>
                        <a href="#!" className="share-icon twitter"><i className="fa-brands fa-twitter"></i></a>
                    </div>
                </div>

                {/* Trâm - BÌNH LUẬN */}
                <div style={{ marginTop: '40px' }}>
                    <BinhLuanBlog 
                        blogId={id}             // Truyền ID lấy từ URL
                        currentUser={currentUser} // Truyền User lấy từ state
                        initialComments={[]}      // Ban đầu rỗng, sẽ load khi component chạy (hoặc truyền list từ API chi tiết)
                    />
                </div>
            </article>

            {/* SIDEBAR PHẢI */}
            <aside className="sidebar-right">
                <div className="widget author-widget">
                    <div className="author-avatar-large">
                        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Author" />
                    </div>
                    <h3>{post.author}</h3>
                    <p>Yêu bếp, nghiện nhà. Minh chia sẻ những kinh nghiệm nấu nướng đúc kết được sau 10 năm làm nội trợ.</p>
                    <button className="btn btn-outline" style={{color: 'var(--primary-color)', borderColor: 'var(--primary-color)', width: '100%', marginTop: '15px'}}>Xem hồ sơ</button>
                </div>

                <div className="widget related-widget">
                    <h3>Bài viết liên quan</h3>
                    <div className="related-item">
                        <img src="https://images.unsplash.com/photo-1626082927389-d3164294050d?q=80&w=1000&auto=format&fit=crop" alt="Post" />
                        <div className="related-info"><Link to="#">Cách chọn nồi chiên không dầu phù hợp</Link></div>
                    </div>
                    <div className="related-item">
                        <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop" alt="Post" />
                        <div className="related-info"><Link to="#">Bí quyết nêm nếm gia vị chuẩn nhà hàng</Link></div>
                    </div>
                </div>
            </aside>
        </div>
    </main>
  );
};

export default ChitietBlog;
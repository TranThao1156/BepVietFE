import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const ChitietCongthuc = () => {
  const { id } = useParams();

  // --- 1. STATE QUẢN LÝ DỮ LIỆU ---
  // Giả lập danh sách bình luận ban đầu
  const [comments, setComments] = useState([
    { id: 1, name: "Lan Anh", avatar: "https://i.pravatar.cc/150?img=5", content: "Công thức rất chuẩn! Nước dùng ngọt thanh, nhà mình ai cũng khen.", rating: 5, date: "2 giờ trước" },
    { id: 2, name: "Minh Tuấn", avatar: "https://i.pravatar.cc/150?img=11", content: "Mình nấu thử thấy hơi nhạt, chắc do khẩu vị miền Trung.", rating: 4, date: "1 ngày trước" }
  ]);

  // State cho form nhập liệu
  const [userRating, setUserRating] = useState(0); // Số sao người dùng chọn
  const [hoverRating, setHoverRating] = useState(0); // Hiệu ứng hover sao
  const [commentText, setCommentText] = useState(""); // Nội dung bình luận

  // --- 2. XỬ LÝ SỰ KIỆN ---
  const handleSubmit = () => {
    if (userRating === 0) {
      alert("Bạn chưa chọn số sao đánh giá!");
      return;
    }
    if (commentText.trim() === "") {
      alert("Bạn chưa nhập nội dung bình luận!");
      return;
    }

    // Tạo bình luận mới giả lập
    const newComment = {
      id: comments.length + 1,
      name: "Bạn (Mới)", // Sau này lấy tên từ User đăng nhập
      avatar: "https://ui-avatars.com/api/?name=You&background=random",
      content: commentText,
      rating: userRating,
      date: "Vừa xong"
    };

    setComments([newComment, ...comments]); // Thêm vào đầu danh sách
    setCommentText(""); // Reset ô nhập
    setUserRating(0);   // Reset sao
  };

  // Dữ liệu cứng chi tiết bài viết (như cũ)
  const recipe = {
    title: "Phở Bò Gia Truyền",
    desc: "Hương vị phở Bắc đặc trưng, nước dùng trong, ngọt thanh từ xương ninh, bánh phở mềm dai, thịt bò tái chín hoàn hảo.",
    image: "https://images.unsplash.com/photo-1582878826618-c05326eff935?q=80&w=2070&auto=format&fit=crop",
    author: "Bếp cô Minh",
    date: "12/05/2024",
    prepTime: "30 phút",
    cookTime: "2 giờ",
    difficulty: "Trung bình",
    serving: "4 người",
    ingredients: [
        "1kg Bánh phở tươi", "500g Thịt bò tái (thăn/bắp)", "1kg Xương ống bò", 
        "1 củ Gừng, 3 củ Hành tím nướng", "1 gói Gia vị phở", "Hành lá, ngò gai, rau húng quế"
    ],
    steps: [
        { id: 1, title: "Sơ chế xương bò", content: "Xương ống bò rửa sạch, ngâm nước muối loãng 30 phút...", img: "https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=1000&auto=format&fit=crop" },
        { id: 2, title: "Ninh nước dùng", content: "Cho xương đã sơ chế vào nồi lớn, đổ ngập 3-4 lít nước...", img: "https://images.unsplash.com/photo-1547496502-ffa222335374?q=80&w=1000&auto=format&fit=crop" },
        { id: 3, title: "Hoàn thiện", content: "Xếp thịt bò tái lên trên bánh phở. Rắc hành lá...", img: "https://images.unsplash.com/photo-1582878826618-c05326eff935?q=80&w=2070&auto=format&fit=crop" }
    ]
  };

  return (
    <div className="recipe-bottom-layout">
        <div className="recipe-main">
            <main className="container recipe-container">

                {/* --- Header & Info (Giữ nguyên) --- */}
                <div className="recipe-header">
                    <h1 className="recipe-title">{recipe.title}</h1>
                    <p className="recipe-desc">{recipe.desc}</p>
                    <div className="recipe-meta-top">
                        <div className="author-info">
                            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Author" />
                            <div><span className="author-name">{recipe.author}</span><span className="post-date">{recipe.date}</span></div>
                        </div>
                        <div className="recipe-actions">
                            <button className="btn-action"><i className="fa-regular fa-heart"></i> Lưu</button>
                            <button className="btn-action"><i className="fa-solid fa-share-nodes"></i> Chia sẻ</button>
                        </div>
                    </div>
                    <div className="recipe-hero-img"><img src={recipe.image} alt={recipe.title} /></div>
                </div>

                {/* --- Content Grid (Giữ nguyên) --- */}
                <div className="recipe-content-grid">
                    <aside className="sidebar">
                        <div className="ingredients-box">
                            <h3>Nguyên liệu</h3>
                            <ul className="ingredients-list">
                                {recipe.ingredients.map((ing, index) => <li key={index}><i className="fa-solid fa-check"></i> {ing}</li>)}
                            </ul>
                        </div>
                    </aside>
                    <div className="main-instructions">
                        <h2>Hướng dẫn thực hiện</h2>
                        <div className="steps-container">
                            {recipe.steps.map((step) => (
                                <div className="step-item" key={step.id}>
                                    <div className="step-number">{step.id}</div>
                                    <div className="step-content">
                                        <h3>{step.title}</h3>
                                        <p>{step.content}</p>
                                        <img className="step-img" src={step.img} alt={step.title} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- PHẦN ĐÁNH GIÁ & BÌNH LUẬN (ĐÃ NÂNG CẤP) --- */}
                <div className="comments-section" style={{marginTop: '60px', borderTop: '1px solid #E5E7EB', paddingTop: '40px'}}>
                    <h3 className="section-title">Đánh giá & Bình luận ({comments.length})</h3>

                    <div className="review-dashboard" style={{marginBottom: '30px'}}>
                        {/* Cột trái: Tổng quan điểm số */}
                        <div className="dashboard-left">
                            <div className="score-big">4.8</div>
                            <div className="stars-display">
                                <i className="fa-solid fa-star" style={{color: '#FBBF24'}}></i>
                                <i className="fa-solid fa-star" style={{color: '#FBBF24'}}></i>
                                <i className="fa-solid fa-star" style={{color: '#FBBF24'}}></i>
                                <i className="fa-solid fa-star" style={{color: '#FBBF24'}}></i>
                                <i className="fa-solid fa-star-half-stroke" style={{color: '#FBBF24'}}></i>
                            </div>
                            <p className="count-text">Điểm trung bình</p>
                        </div>

                        {/* Cột phải: Form nhập liệu của người dùng */}
                        <div className="dashboard-right" style={{flex: 1}}>
                            
                            {/* 1. PHẦN ĐÁNH GIÁ SAO (Rating Action Row) */}
                            <div className="rating-action-row" style={{marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '15px'}}>
                                <span style={{fontWeight: 600}}>Đánh giá của bạn:</span>
                                <div className="star-select" style={{cursor: 'pointer'}}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <i 
                                            key={star}
                                            className={`fa-star ${star <= (hoverRating || userRating) ? "fa-solid" : "fa-regular"}`}
                                            style={{ color: '#FBBF24', fontSize: '1.2rem', marginRight: '5px' }}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setUserRating(star)}
                                        ></i>
                                    ))}
                                </div>
                                <span style={{fontSize: '0.9rem', color: '#6B7280'}}>
                                    {userRating > 0 ? `(${userRating} sao)` : '(Chạm để xếp hạng)'}
                                </span>
                                <button 
                                    className="btn btn-primary" 
                                    onClick={handleSubmit}
                                    style={{marginTop: '10px', float: 'right'}}
                                >
                                    Gửi đánh giá
                                </button>
                            </div>

                            {/* 2. PHẦN NHẬP BÌNH LUẬN (Comment Input Wrapper) */}
                            <div className="comment-input-wrapper" style={{position: 'relative'}}>
                                <textarea 
                                    placeholder="Chia sẻ cảm nhận hoặc bí quyết nấu món này của bạn..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    style={{width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #E5E7EB', minHeight: '100px'}}
                                ></textarea>
                                <button 
                                    className="btn btn-primary" 
                                    onClick={handleSubmit}
                                    style={{marginTop: '10px', float: 'right'}}
                                >
                                    Gửi bình luận
                                </button>
                                <div style={{clear: 'both'}}></div>
                            </div>
                        </div>
                    </div>

                    {/* --- DANH SÁCH BÌNH LUẬN --- */}
                    <div className="comments-list">
                        {comments.map((cmt) => (
                            <div className="user-comment-item" key={cmt.id} style={{display: 'flex', gap: '15px', marginTop: '20px', paddingBottom: '20px', borderBottom: '1px dashed #E5E7EB'}}>
                                <img src={cmt.avatar} alt={cmt.name} className="cmt-avatar" style={{width: '50px', height: '50px', borderRadius: '50%'}} />
                                <div className="cmt-content">
                                    <div className="cmt-header" style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px'}}>
                                        <span className="cmt-name" style={{fontWeight: 700}}>{cmt.name}</span>
                                        <span className="cmt-badge" style={{fontSize: '0.8rem', color: '#F59E0B'}}>
                                            <i className="fa-solid fa-star"></i> {cmt.rating}.0
                                        </span>
                                        <span style={{fontSize: '0.8rem', color: '#9CA3AF'}}>• {cmt.date}</span>
                                    </div>
                                    <p className="cmt-text" style={{color: '#374151'}}>{cmt.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </main>
        </div>

        {/* SIDEBAR PHẢI (Giữ nguyên) */}
        <aside className="recipe-right-sidebar">
             <h3 className="sidebar-title">Món ngon liên quan</h3>
             <div className="related-list">
                <article className="related-item">
                    <img src="https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?q=80&w=1000&auto=format&fit=crop" alt="Related" />
                    <div><Link to="#">Bún Chả Hà Nội</Link><span><i className="fa-solid fa-star"></i> 4.7</span></div>
                </article>
                <article className="related-item">
                    <img src="https://images.unsplash.com/photo-1503764654157-72d979d98934?q=80&w=1000&auto=format&fit=crop" alt="Related" />
                    <div><Link to="#">Bún Bò Huế</Link><span><i className="fa-solid fa-star"></i> 4.9</span></div>
                </article>
             </div>
        </aside>
    </div>
  );
};

export default ChitietCongthuc;
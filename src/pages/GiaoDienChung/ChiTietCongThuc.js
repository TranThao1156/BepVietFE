import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const ChitietCongthuc = () => {
    // Lấy ID từ URL (ví dụ: /cong-thuc/1 -> id = 1)
    const { id } = useParams();

    const [userRating, setUserRating] = useState(0);
    const [hoverStar, setHoverStar] = useState(0);
    const [commentContent, setCommentContent] = useState('');
    // DỮ LIỆU GIẢ CHI TIẾT (Trong thực tế sẽ dùng id để gọi API lấy đúng món)
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
            "1kg Bánh phở tươi",
            "500g Thịt bò tái (thăn/bắp)",
            "1kg Xương ống bò",
            "1 củ Gừng, 3 củ Hành tím nướng",
            "1 gói Gia vị phở (thảo quả, hoa hồi, quế...)",
            "Hành lá, ngò gai, rau húng quế",
            "Gia vị: Muối, đường phèn, nước mắm ngon"
        ],
        steps: [
            { id: 1, title: "Sơ chế xương bò", content: "Xương ống bò rửa sạch, ngâm nước muối loãng 30 phút để ra hết máu tanh. Sau đó, chần xương qua nước sôi khoảng 5 phút rồi vớt ra, rửa lại thật sạch bằng nước lạnh.", img: "https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=1000&auto=format&fit=crop" },
            { id: 2, title: "Ninh nước dùng", content: "Cho xương đã sơ chế vào nồi lớn, đổ ngập 3-4 lít nước. Thêm gừng, hành tím đã nướng thơm và gói gia vị phở vào. Ninh lửa nhỏ trong khoảng 2 giờ.", img: "https://images.unsplash.com/photo-1547496502-ffa222335374?q=80&w=1000&auto=format&fit=crop" },
            { id: 3, title: "Hoàn thiện và thưởng thức", content: "Xếp thịt bò tái lên trên bánh phở. Rắc hành lá, ngò gai lên. Chan nước dùng sôi sùng sục trực tiếp lên thịt để thịt vừa chín tới.", img: "https://images.unsplash.com/photo-1582878826618-c05326eff935?q=80&w=2070&auto=format&fit=crop" }
        ]
    };

    return (
        <div className="recipe-bottom-layout">
            {/* CỘT TRÁI (NỘI DUNG CHÍNH) */}
            <div className="recipe-main">
                <main className="container recipe-container">

                    <div className="recipe-header">
                        <h1 className="recipe-title">{recipe.title}</h1>
                        <p className="recipe-desc">{recipe.desc}</p>

                        <div className="recipe-meta-top">
                            <div className="author-info">
                                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Bếp cô Minh" />
                                <div>
                                    <span className="author-name">{recipe.author}</span>
                                    <span className="post-date">Cập nhật: {recipe.date}</span>
                                </div>
                            </div>
                            <div className="recipe-actions">
                                <button className="btn-action"><i className="fa-regular fa-heart"></i> Lưu</button>
                                <button className="btn-action"><i className="fa-solid fa-share-nodes"></i> Chia sẻ</button>
                            </div>
                        </div>

                        <div className="recipe-hero-img">
                            <img src={recipe.image} alt={recipe.title} />
                        </div>

                        <div className="recipe-quick-info">
                            <div className="info-item">
                                <i className="fa-regular fa-clock"></i>
                                <div>
                                    <span>Chuẩn bị</span>
                                    <strong>{recipe.prepTime}</strong>
                                </div>
                            </div>
                            <div className="info-item">
                                <i className="fa-solid fa-fire-burner"></i>
                                <div>
                                    <span>Nấu</span>
                                    <strong>{recipe.cookTime}</strong>
                                </div>
                            </div>
                            <div className="info-item">
                                <i className="fa-solid fa-chart-simple"></i>
                                <div>
                                    <span>Độ khó</span>
                                    <strong>{recipe.difficulty}</strong>
                                </div>
                            </div>
                            <div className="info-item">
                                <i className="fa-solid fa-user-group"></i>
                                <div>
                                    <span>Khẩu phần</span>
                                    <strong>{recipe.serving}</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="recipe-content-grid">

                        <aside className="recipe-left-sidebar">
                            <div className="ingredients-box">
                                <h3>Nguyên liệu</h3>
                                <ul className="ingredients-list">
                                    {recipe.ingredients.map((ing, index) => (
                                        <li key={index}><i className="fa-solid fa-check"></i> {ing}</li>
                                    ))}
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


                    <div className="comments-section">
                        <h3 className="section-title">Đánh giá từ cộng đồng (128)</h3>
                        {/* Phần comment giữ nguyên HTML hoặc tách component nếu cần */}
                        <div className="review-dashboard">
                            <div className="dashboard-left">
                                <div className="score-big">4.8</div>
                                <div className="stars-display">
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star-half-stroke"></i>
                                </div>
                                <p className="count-text">Dựa trên 128 đánh giá</p>
                            </div>
                            <div className="dashboard-right">

                                {/* 1. Hàng chọn Sao (Nằm trên cùng) */}
                                <div className="rating-row">
                                    <span className="rating-text">Đánh giá của bạn:</span>
                                    <div className="stars-select">
                                        {[...Array(5)].map((_, index) => {
                                            const ratingValue = index + 1;
                                            return (
                                                <i
                                                    key={index}
                                                    className="fa-solid fa-star"
                                                    style={{
                                                        cursor: 'pointer',
                                                        fontSize: '20px', // Sao to rõ hơn chút
                                                        color: ratingValue <= (hoverStar || userRating) ? '#ffc107' : '#e4e5e9',
                                                        marginRight: '5px',
                                                        transition: 'color 0.2s'
                                                    }}
                                                    onClick={() => setUserRating(ratingValue)}
                                                    onMouseEnter={() => setHoverStar(ratingValue)}
                                                    onMouseLeave={() => setHoverStar(0)}
                                                ></i>
                                            );
                                        })}
                                    </div>
                                    {/* Badge nhỏ "Gửi đánh giá" giống trong Figma (nếu cần) */}
                                    {userRating > 0 && <span className="rating-badge">Đã chọn {userRating} sao</span>}
                                </div>

                                {/* 2. Ô nhập liệu (Ở giữa) */}
                                <div className="input-wrapper">
                                    <textarea
                                        className="review-textarea-clean"
                                        placeholder="Chia sẻ kinh nghiệm nấu món này của bạn..."
                                        value={commentContent}
                                        onChange={(e) => setCommentContent(e.target.value)}
                                    ></textarea>
                                </div>

                                {/* 3. Nút gửi (Dưới cùng bên phải) */}
                                <div className="action-row-right">
                                    <button className="btn-submit-review">Gửi bình luận</button>
                                </div>

                            </div>
                        </div>

                        <div className="user-comment-item">
                            <img src="https://i.pravatar.cc/150?img=5" alt="Lan Anh" className="cmt-avatar" />
                            <div className="cmt-content">
                                <div className="cmt-header">
                                    <span className="cmt-name">Lan Anh</span>
                                    <span className="cmt-badge"><i className="fa-solid fa-star"></i> 5.0</span>
                                </div>
                                <p className="cmt-text">Công thức rất chuẩn! Nước dùng ngọt thanh, nhà mình ai cũng khen.</p>
                            </div>
                        </div>
                    </div>

                </main>
            </div>

            {/* CỘT PHẢI (SIDEBAR) */}
            <aside className="recipe-right-sidebar">
                <h3 className="sidebar-title">Món ngon liên quan</h3>
                <div className="related-list">
                    <article className="related-item">
                        <img src="https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?q=80&w=1000&auto=format&fit=crop" alt="Related" />
                        <div>
                            <Link to="#">Bún Chả Hà Nội</Link>
                            <span><i className="fa-solid fa-star"></i> 4.7</span>
                        </div>
                    </article>
                    <article className="related-item">
                        <img src="https://images.unsplash.com/photo-1628198640748-417c128063f8?q=80&w=1000&auto=format&fit=crop" alt="Related" />
                        <div>
                            <Link to="#">Bánh Mì Pate Đặc Biệt</Link>
                            <span><i className="fa-solid fa-star"></i> 4.8</span>
                        </div>
                    </article>
                </div>
            </aside>

        </div>
    );
};

export default ChitietCongthuc;
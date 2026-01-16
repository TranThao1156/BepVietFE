import React, { useState, useRef, useEffect } from 'react';

const AIChat = () => {
  // State quản lý tin nhắn
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Xin chào! Tôi là AI Chef. Bạn đang phân vân không biết nấu gì? Hãy hỏi tôi ngay!' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages, isTyping]);

  // Hàm gửi tin nhắn
  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // 1. Thêm tin nhắn User
    const userMsg = { role: 'user', content: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // 2. Giả lập AI trả lời
    setTimeout(() => {
        const aiMsg = { 
            role: 'ai', 
            content: `AI Chef đang trả lời cho câu hỏi: "${userMsg.content}"... (Đây là demo, sau này bạn sẽ kết nối API thật)` 
        };
        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
    }, 1500);
  };

  const handleSuggestion = (text) => {
    setInputText(text);
  };

  return (
    <main className="chat-wrapper">
        <div className="container">
            <div className="chat-layout">
                
                {/* --- SIDEBAR (ĐÃ BỎ LỊCH SỬ) --- */}
                <aside className="chat-sidebar">
                    {/* Nút này bây giờ chỉ có tác dụng xóa màn hình chat hiện tại */}
                    <button className="btn-new-chat" onClick={() => setMessages([])}>
                        <i className="fa-solid fa-plus"></i> Làm mới đoạn chat
                    </button>
                    
                    {/* Khoảng trống thay vì danh sách lịch sử */}
                    <div className="history-list" style={{ marginTop: '20px', flex: 1, color: '#9CA3AF', fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>
                        <p>Hỏi AI Chef bất cứ điều gì về ẩm thực!</p>
                    </div>

                    <div className="sidebar-footer">
                        <div className="user-mini">
                            <img src="https://ui-avatars.com/api/?name=User&background=random" alt="User" />
                            <span>Người dùng Bếp Việt</span>
                        </div>
                    </div>
                </aside>

                {/* --- KHUNG CHAT CHÍNH --- */}
                <section className="chat-main">
                    <div className="chat-mobile-header">
                        <span>AI Chef Bếp Việt</span>
                    </div>

                    <div className="messages-container" id="messagesContainer">
                        {/* Welcome Screen */}
                        {messages.length === 1 && (
                            <div className="ai-welcome">
                                <div className="ai-avatar-large"><i className="fa-solid fa-robot"></i></div>
                                <h2>Xin chào! Tôi là AI Chef.</h2>
                                <p>Bạn đang phân vân không biết nấu gì? Hãy hỏi tôi ngay!</p>
                            </div>
                        )}

                        {/* List Messages */}
                        {messages.map((msg, index) => (
                            <div key={index} className={`message-row ${msg.role}`}>
                                <div className="msg-avatar">
                                    <i className={`fa-solid ${msg.role === 'ai' ? 'fa-robot' : 'fa-user'}`}></i>
                                </div>
                                <div className="msg-bubble">{msg.content}</div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="message-row ai">
                                <div className="msg-avatar"><i className="fa-solid fa-robot"></i></div>
                                <div className="msg-bubble typing">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />

                        {/* Suggestions */}
                        {messages.length < 3 && !isTyping && (
                            <div className="suggestion-grid">
                                <div className="suggestion-card" onClick={() => handleSuggestion('Gợi ý món ăn tối nay cho 4 người?')}>
                                    <h4>🍛 Bữa tối gia đình</h4>
                                    <p>"Gợi ý món ăn tối nay?"</p>
                                </div>
                                <div className="suggestion-card" onClick={() => handleSuggestion('Cách làm nước chấm ốc ngon?')}>
                                    <h4>🥣 Bí quyết nước chấm</h4>
                                    <p>"Cách làm nước chấm ốc ngon?"</p>
                                </div>
                                <div className="suggestion-card" onClick={() => handleSuggestion('Trong tủ lạnh còn trứng và cà chua')}>
                                    <h4>🧊 Dọn tủ lạnh</h4>
                                    <p>"Còn trứng, cà chua nấu gì?"</p>
                                </div>
                                <div className="suggestion-card" onClick={() => handleSuggestion('Viết thực đơn giảm cân 1 tuần')}>
                                    <h4>🥗 Eat Clean / Diet</h4>
                                    <p>"Thực đơn giảm cân 1 tuần"</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="input-area-wrapper">
                        <div className="input-container">
                            <textarea 
                                placeholder="Nhập câu hỏi của bạn..." 
                                rows="1"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                            ></textarea>
                            <button className="btn-send" onClick={handleSendMessage}>
                                <i className="fa-solid fa-paper-plane"></i>
                            </button>
                        </div>
                        <p className="disclaimer">AI có thể đưa ra thông tin chưa chính xác.</p>
                    </div>
                </section>
            </div>
        </div>
    </main>
  );
};

export default AIChat;
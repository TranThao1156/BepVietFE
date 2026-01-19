import React, { useState, useRef, useEffect } from "react";

const AIChat = () => {
  // State quản lý tin nhắn
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content:
        "Xin chào! Tôi là AI Chef. Bạn đang phân vân không biết nấu gì? Hãy hỏi tôi ngay!",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages, isTyping]);

  // Hàm gửi tin nhắn và kết nối API
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg = { role: "user", content: inputText };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:8000/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          message: userMsg.content, // ✅ ĐÚNG BACKEND
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: data.reply || "Vui lòng đăng nhập để sử dụng AI Chat.",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "❌ Không kết nối được server AI.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestion = (text) => {
    setInputText(text);
  };

  return (
    <main className="chat-wrapper">
      <div className="container">
        <div className="chat-layout">
          {/* --- SIDEBAR --- */}
          <aside className="chat-sidebar">
            <button
              className="btn-new-chat"
              onClick={() =>
                setMessages([
                  { role: "ai", content: "Tôi đã sẵn sàng cho câu hỏi mới!" },
                ])
              }
            >
              <i className="fa-solid fa-plus"></i> Làm mới đoạn chat
            </button>

            <div
              className="history-list"
              style={{
                marginTop: "20px",
                flex: 1,
                color: "#9CA3AF",
                fontSize: "0.9rem",
                textAlign: "center",
                padding: "20px",
              }}
            >
              <p>Hỏi AI Chef bất cứ điều gì về ẩm thực!</p>
              
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
                  <div className="ai-avatar-large">
                    <i className="fa-solid fa-robot"></i>
                  </div>
                  <h2>Xin chào! Tôi là AI Chef.</h2>
                  <p>Bạn đang phân vân không biết nấu gì? Hãy hỏi tôi ngay!</p>
                </div>
              )}

              {/* List Messages */}
              {messages.map((msg, index) => (
                <div key={index} className={`message-row ${msg.role}`}>
                  <div className="msg-avatar">
                    <i
                      className={`fa-solid ${msg.role === "ai" ? "fa-robot" : "fa-user"}`}
                    ></i>
                  </div>
                  {/* Sử dụng white-space: pre-wrap để AI xuống dòng đẹp */}
                  <div
                    className="msg-bubble"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="message-row ai">
                  <div className="msg-avatar">
                    <i className="fa-solid fa-robot"></i>
                  </div>
                  <div className="msg-bubble typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />

              {/* Suggestions */}
              {messages.length < 3 && !isTyping && (
                <div className="suggestion-grid">
                  <div
                    className="suggestion-card"
                    onClick={() =>
                      handleSuggestion("Gợi ý món ăn tối nay cho 4 người?")
                    }
                  >
                    <h4>🍛 Bữa tối gia đình</h4>
                    <p>"Gợi ý món ăn tối nay?"</p>
                  </div>
                  <div
                    className="suggestion-card"
                    onClick={() =>
                      handleSuggestion("Cách làm nước chấm ốc ngon?")
                    }
                  >
                    <h4>🥣 Bí quyết nước chấm</h4>
                    <p>"Cách làm nước chấm ốc ngon?"</p>
                  </div>
                  <div
                    className="suggestion-card"
                    onClick={() =>
                      handleSuggestion("Trong tủ lạnh còn trứng và cà chua")
                    }
                  >
                    <h4>🧊 Dọn tủ lạnh</h4>
                    <p>"Còn trứng, cà chua nấu gì?"</p>
                  </div>
                  <div
                    className="suggestion-card"
                    onClick={() =>
                      handleSuggestion("Viết thực đơn giảm cân 1 tuần")
                    }
                  >
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
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                ></textarea>
                <button
                  className="btn-send"
                  onClick={handleSendMessage}
                  disabled={isTyping}
                >
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </div>
              <p className="disclaimer">
                AI có thể đưa ra thông tin chưa chính xác.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default AIChat;

import React from 'react';
import { Settings, X, Send } from 'lucide-react';

// Widget Chatbox AI (Góc phải màn hình)
function ChatBox({
  chatOpen,
  setChatOpen,
  messages,
  userInput,
  setUserInput,
  loading,
  customApiKey,
  setCustomApiKey,
  showKeyInput,
  setShowKeyInput,
  chatEndRef,
  parseMessage,
  handleSendMessage,
  saveApiKey,
  setSelectedObjectId,
}) {
  return (
    <div className="ai-chat-widget">
      {chatOpen && (
        <div className="chat-window">
          {/* Header của Khung Chat */}
          <div className="chat-header">
            <div className="chat-header-info">
              <span className="chat-title">Hướng dẫn viên ảo</span>
              <span className="chat-subtitle">● Sẵn sàng hỗ trợ</span>
            </div>
            <div className="chat-header-actions">
              <button
                className="chat-action-btn"
                onClick={() => setShowKeyInput(!showKeyInput)}
                title="Cài đặt API Key"
              >
                <Settings size={16} />
              </button>
              <button
                className="chat-action-btn"
                onClick={() => setChatOpen(false)}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Panel Nhập API Key */}
          {showKeyInput && (
            <div className="api-key-panel">
              <input
                type="password"
                className="api-key-input"
                placeholder="Nhập Gemini API Key từ AI Studio..."
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
              />
              <button className="api-key-save-btn" onClick={saveApiKey}>
                Lưu
              </button>
            </div>
          )}

          {/* Lịch sử tin nhắn */}
          <div className="chat-history">
            {messages.map((msg, index) => {
              const { body, links } = parseMessage(msg.text);
              return (
                <div key={index} className={`chat-msg ${msg.role}`}>
                  <div className="msg-bubble" style={{ whiteSpace: 'pre-line' }}>
                    {body}
                  </div>
                  {links && links.length > 0 && (
                    <div className="chat-msg-links">
                      <span className="links-label">Hiện vật liên quan:</span>
                      {links.map((link, lIdx) => (
                        <button
                          key={lIdx}
                          className="chat-direct-link-btn"
                          onClick={() => {
                            setSelectedObjectId(link.objId);
                            setChatOpen(false);
                          }}
                        >
                          {link.label} 🔍
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {loading && (
              <div className="chat-loading">
                AI đang tra cứu
                <span className="chat-dot"></span>
                <span className="chat-dot"></span>
                <span className="chat-dot"></span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Ô nhập tin nhắn */}
          <form className="chat-input-area" onSubmit={handleSendMessage}>
            <input
              type="text"
              className="chat-input"
              placeholder="Hỏi về thời Bao Cấp, Khoán 10, CNH-HĐH..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="chat-send-btn"
              disabled={loading || !userInput.trim()}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ChatBox;

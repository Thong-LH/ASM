import React from 'react';
import { X, Sparkles, Cpu, Bot, UserCheck, BookOpen, ShieldCheck, Layers, Paintbrush, Code, FileText } from 'lucide-react';
import './AiAppendixModal.css';

export default function AiAppendixModal({ onClose }) {
  return (
    <div className="ai-appendix-overlay" onClick={onClose}>
      <div className="ai-appendix-card" onClick={(e) => e.stopPropagation()}>
        {/* Header - Màu Cam Chủ Đạo Rực Rỡ */}
        <div className="ai-appendix-header">
          <div className="header-title-box">
            <div className="icon-badge">
              <Sparkles size={28} />
            </div>
            <div>
              <h1 className="ai-appendix-title">PHỤ LỤC: SỬ DỤNG CÔNG CỤ AI TRONG ĐỒ ÁN</h1>
              <p className="ai-appendix-subtitle">Báo cáo minh bạch & Liêm chính học thuật</p>
            </div>
          </div>
          <button className="ai-appendix-close-btn" onClick={onClose} title="Đóng trang">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="ai-appendix-body">
          {/* Section 1 */}
          <div className="appendix-block">
            <h2 className="block-title">
              <Cpu className="block-icon" size={24} /> 1. Liệt kê công cụ & Mục đích
            </h2>
            <div className="tools-grid">
              <div className="tool-card">
                <div className="tool-header">
                  <span className="tool-tag midjourney">Midjourney</span>
                </div>
                <p className="tool-desc">
                  Tạo texture bản đồ cổ, họa tiết trang trí, vật thể minh họa (hộp bút, loa).
                </p>
              </div>

              <div className="tool-card">
                <div className="tool-header">
                  <span className="tool-tag gemini">Gemini (LLM)</span>
                </div>
                <p className="tool-desc">
                  Hỗ trợ cấu trúc nội dung, viết mô tả ngắn, kiểm tra ngữ pháp, viết code Three.js.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="appendix-block">
            <h2 className="block-title">
              <Layers className="block-icon" size={24} /> 2. Quy trình làm việc & Phân định nội dung
            </h2>
            
            <div className="workflow-container">
              {/* AI Output */}
              <div className="workflow-box ai-box">
                <div className="box-header">
                  <Bot size={22} />
                  <span>AI Output</span>
                </div>
                <p className="box-content">
                  AI hỗ trợ tạo khung xương dữ liệu (JSON), sơ bộ ý tưởng nội dung, mã nguồn giao diện (code Three.js), và hình ảnh minh họa cho các vật thể 2D.
                </p>
              </div>

              {/* Sinh viên biên soạn */}
              <div className="workflow-box student-box">
                <div className="box-header">
                  <UserCheck size={22} />
                  <span>Phần sinh viên chỉnh sửa / biên soạn</span>
                </div>
                <div className="student-tasks">
                  <div className="task-item">
                    <div className="task-label">
                      <FileText size={18} /> <strong>Nội dung:</strong>
                    </div>
                    <p className="task-desc">
                      Tự tổng hợp kiến thức từ giáo trình LLCT, đối chiếu sự kiện lịch sử (1986–1996) để đảm bảo độ chính xác tuyệt đối.
                    </p>
                  </div>

                  <div className="task-item">
                    <div className="task-label">
                      <Paintbrush size={18} /> <strong>Hình ảnh:</strong>
                    </div>
                    <p className="task-desc">
                      Tự xử lý hậu kỳ (cắt nền, tách lớp, phủ filter) để hình ảnh hòa hợp với thiết kế tổng thể.
                    </p>
                  </div>

                  <div className="task-item">
                    <div className="task-label">
                      <Code size={18} /> <strong>Kỹ thuật:</strong>
                    </div>
                    <p className="task-desc">
                      Tự tinh chỉnh code Three.js, cấu hình 3D cho quả địa cầu, thiết kế logic tương tác cho các "Room".
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="appendix-block">
            <h2 className="block-title">
              <BookOpen className="block-icon" size={24} /> 3. Đối chiếu nguồn chính thống
            </h2>
            <div className="sources-box">
              <p className="sources-intro">
                Toàn bộ kiến thức lịch sử (Đại hội VI, Khoán 10, Đổi mới) được kiểm chứng dựa trên:
              </p>
              <ul className="sources-bullet-list">
                <li>Giáo trình <em>Những nguyên lý cơ bản của Chủ nghĩa Mác - Lênin</em></li>
                <li>Văn kiện Đại hội đại biểu toàn quốc lần thứ VI, VII.</li>
              </ul>
            </div>
          </div>

          {/* Section 4 */}
          <div className="appendix-block">
            <h2 className="block-title integrity-heading">
              <ShieldCheck className="block-icon" size={24} /> 4. Cam kết liêm chính học thuật
            </h2>
            <div className="integrity-box">
              <p>
                Nhóm cam kết AI chỉ đóng vai trò công cụ hỗ trợ sáng tạo (tạo hình ảnh, khung sườn). Mọi nội dung cốt lõi, tư duy logic và toàn bộ mã nguồn giao diện đều do sinh viên thực hiện, kiểm duyệt và chịu trách nhiệm hoàn toàn về độ chính xác.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="ai-appendix-footer">
          <button className="confirm-btn" onClick={onClose}>
            Đã hiểu & Đóng Phụ Lục
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CornerUpLeft, HelpCircle } from 'lucide-react';

export default function UIOverlay({ roomData, selectedObjectId, onSelectObject }) {
  const { objects } = roomData;
  
  // Lấy thông tin vật thể đang được chọn
  const activeObject = objects.find(obj => obj.id === selectedObjectId);

  return (
    <div className="ui-layer">
      {/* Header cố định phía trên */}
      <header className="museum-header">
        <div className="museum-title">
          <h1>Bảo tàng Số <span>Đổi Mới</span></h1>
          <p>Môi trường tương tác 2.5D • Phòng 1: Thời Bao Cấp</p>
        </div>
      </header>

      {/* Dòng chữ hướng dẫn người dùng khi chưa chọn vật thể nào */}
      <AnimatePresence>
        {!selectedObjectId && (
          <motion.div 
            className="hint-text"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            ✦ Click vào vật thể 3D để khám phá chi tiết ✦
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel thông tin bên phải (chỉ hiện khi có selectedObjectId) */}
      <AnimatePresence>
        {activeObject && (
          <motion.div
            key={activeObject.id}
            className="glass-panel info-panel ui-interactive"
            initial={{ x: '110%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '110%', opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 100 }}
          >
            {/* Nút Đóng */}
            <button 
              className="close-btn" 
              onClick={() => onSelectObject(null)}
              aria-label="Đóng bảng thông tin"
            >
              <X size={18} />
            </button>

            {/* Nội dung thông tin vật thể */}
            <div className="info-content">
              {/* Media Preview (Hình ảnh / Mockup) */}
              <div className="info-media-wrapper">
                {activeObject.content.media_url ? (
                  <img 
                    src={activeObject.content.media_url} 
                    alt={activeObject.content.title}
                    className="info-media"
                  />
                ) : (
                  <div className="media-placeholder">
                    <span>Đang tải hình ảnh...</span>
                  </div>
                )}
              </div>

              {/* Tiêu đề & Mô tả */}
              <h2 className="info-title">{activeObject.content.title}</h2>
              <p className="info-desc">{activeObject.content.desc}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nút Reset góc nhìn toàn cảnh (chỉ hiện khi đang xem chi tiết) */}
      <AnimatePresence>
        {selectedObjectId && (
          <div className="bottom-control">
            <motion.button
              className="reset-button ui-interactive"
              onClick={() => onSelectObject(null)}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 120 }}
            >
              <CornerUpLeft size={16} />
              Quay lại toàn cảnh
            </motion.button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

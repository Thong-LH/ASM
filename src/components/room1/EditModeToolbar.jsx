import React from 'react';
import { Copy, Check } from 'lucide-react';

// Thanh công cụ Edit Mode — chỉ hiện khi kích hoạt ?edit=true trong URL
function EditModeToolbar({
  isEditMode,
  transformMode,
  setTransformMode,
  setIsEditMode,
  roomData,
  copied,
  setCopied,
}) {
  if (!isEditMode) return null;

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(roomData, null, 2))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <>
      {/* Bảng xuất tọa độ JSON */}
      <div className="editor-export-panel">
        <p>🔧 Chế độ Chỉnh sửa: Sử dụng các nút bấm ở trên đầu để chuyển đổi giữa kéo di chuyển vị trí và co giãn kích thước.</p>
        <button className="copy-json-btn" onClick={handleCopyJSON}>
          {copied ? <Check size={16} color="#00ff66" /> : <Copy size={16} />}
          {copied ? 'Đã sao chép JSON mới!' : 'Copy cấu hình JSON mới'}
        </button>
      </div>
    </>
  );
}

export default EditModeToolbar;

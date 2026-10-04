import { UploadCloud, Image as ImageIcon } from "lucide-react";
import { useRef, useState } from "react";

export default function ImageUploader({ label = "Drop an image here", hint = "PNG, JPG or WEBP", onChange, preview }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const selectFile = (file) => {
    if (!file) return;
    onChange?.(file);
  };

  return (
    <div
      className={`upload-box ${dragging ? "dragging" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        selectFile(e.dataTransfer.files?.[0]);
      }}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        hidden
        onChange={(e) => selectFile(e.target.files?.[0])}
      />
      {preview ? (
        <img className="upload-preview" src={preview} alt="Selected preview" />
      ) : (
        <>
          <div className="upload-icon"><UploadCloud size={22} /></div>
          <strong>{label}</strong>
          <span>{hint}</span>
          <button type="button" className="ghost-button" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>
            <ImageIcon size={15} /> Choose image
          </button>
        </>
      )}
    </div>
  );
}

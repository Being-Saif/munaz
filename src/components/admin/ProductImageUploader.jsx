import { useState, useRef } from 'react';
import { Upload, X, Star } from 'lucide-react';
import { cn } from '@utils/cn';
import api from '@services/api';
import toast from 'react-hot-toast';

/**
 * ProductImageUploader - drag & drop multi-image uploader with previews
 * images: [{ url, publicId, isPrimary }]
 * onChange(images)
 */
const ProductImageUploader = ({ images = [], onChange, darkMode }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const uploadFiles = async (files) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (valid.length === 0) return;

    setUploading(true);
    try {
      const uploaded = [];
      for (const file of valid) {
        const formData = new FormData();
        formData.append('image', file);
        const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        uploaded.push({ url: res.data.url, publicId: res.data.publicId, isPrimary: false });
      }
      const next = [...images, ...uploaded];
      // First image becomes primary if none set yet
      if (!next.some((img) => img.isPrimary) && next.length > 0) next[0].isPrimary = true;
      onChange(next);
      toast.success(`${uploaded.length} image(s) uploaded`);
    } catch (err) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    uploadFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    const next = images.filter((_, i) => i !== index);
    if (images[index]?.isPrimary && next.length > 0) next[0].isPrimary = true;
    onChange(next);
  };

  const setPrimary = (index) => {
    onChange(images.map((img, i) => ({ ...img, isPrimary: i === index })));
  };

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-8 cursor-pointer transition-colors',
          dragOver
            ? 'border-primary bg-primary/5'
            : darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => uploadFiles(e.target.files)}
        />
        <Upload size={28} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
        <p className={cn('text-sm font-medium', darkMode ? 'text-gray-300' : 'text-gray-600')}>
          {uploading ? 'Uploading...' : 'Click or drag images here to upload'}
        </p>
        <p className={cn('text-xs', darkMode ? 'text-gray-500' : 'text-gray-400')}>PNG, JPG up to 5MB — multiple allowed</p>
      </div>

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
          {images.map((img, index) => (
            <div key={img.publicId || img.url} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
              <img src={img.url} alt="" className="w-full h-full object-cover" />

              {/* Primary badge */}
              {img.isPrimary && (
                <span className="absolute top-1.5 left-1.5 bg-primary text-white text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Star size={9} fill="white" /> Primary
                </span>
              )}

              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!img.isPrimary && (
                  <button
                    type="button"
                    onClick={() => setPrimary(index)}
                    title="Set as primary"
                    className="p-1.5 bg-white rounded-full hover:bg-primary hover:text-white transition-colors"
                  >
                    <Star size={13} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  title="Remove"
                  className="p-1.5 bg-white rounded-full hover:bg-red-500 hover:text-white transition-colors"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageUploader;

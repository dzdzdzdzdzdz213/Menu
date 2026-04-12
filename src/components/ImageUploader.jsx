import React, { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import { supabase } from '../lib/supabase';
import { UploadCloud, X, Loader2, ImageOff } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * ImageUploader — compresses image before uploading to Supabase Storage.
 *
 * Props:
 *  - bucket:      string  — Supabase storage bucket name (e.g. 'product-images')
 *  - folder:      string  — sub-path inside bucket (e.g. user.id)
 *  - currentUrl:  string  — existing public URL to preview (optional)
 *  - onUpload:    (url: string) => void — called with the public URL after upload
 *  - label:       string  — field label text
 *  - aspectRatio: string  — CSS aspect-ratio for the preview box (default '16/9')
 */
const ImageUploader = ({
  bucket = 'images',
  folder = 'uploads',
  currentUrl = '',
  onUpload,
  label = 'Upload Image',
  aspectRatio = '16/9',
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl);
  const inputRef = useRef();

  const compressionOptions = {
    maxSizeMB: 0.4,          // max 400 KB after compression
    maxWidthOrHeight: 1024,   // resize to max 1024px dimension
    useWebWorker: true,
    fileType: 'image/webp',   // convert everything to modern WebP
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setUploading(true);
    try {
      // 1. Compress locally
      toast.loading('Compressing image…', { id: 'compress' });
      const compressed = await imageCompression(file, compressionOptions);
      toast.dismiss('compress');

      // 2. Show local preview immediately
      const localUrl = URL.createObjectURL(compressed);
      setPreview(localUrl);

      // 3. Upload to Supabase Storage
      toast.loading('Uploading…', { id: 'upload' });
      const fileName = `${folder}/${Date.now()}.webp`;
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, compressed, {
          contentType: 'image/webp',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // 4. Get public URL
      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
      toast.dismiss('upload');
      toast.success('Image uploaded!');

      onUpload(data.publicUrl);
    } catch (err) {
      toast.dismiss('compress');
      toast.dismiss('upload');
      toast.error(err.message || 'Upload failed');
      setPreview(currentUrl); // revert preview
    } finally {
      setUploading(false);
      // reset input so same file can be re-selected
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleClear = () => {
    setPreview('');
    onUpload('');
  };

  return (
    <div className="image-uploader">
      {label && (
        <label className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>
          {label}
        </label>
      )}

      <div
        className="image-uploader-box glass"
        style={{ aspectRatio, position: 'relative', overflow: 'hidden', borderRadius: '12px', border: '2px dashed var(--glass-border)', cursor: uploading ? 'wait' : 'pointer' }}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={() => setPreview('')}
            />
            {/* Clear button */}
            {!uploading && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleClear(); }}
                style={{
                  position: 'absolute', top: '0.5rem', right: '0.5rem',
                  background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%',
                  width: '32px', height: '32px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                }}
                aria-label="Remove image"
              >
                <X size={16} />
              </button>
            )}
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '0.75rem', padding: '1rem' }}>
            {uploading ? (
              <Loader2 size={36} className="text-red animate-spin" />
            ) : (
              <UploadCloud size={36} className="text-muted" />
            )}
            <span className="text-muted" style={{ fontSize: '0.82rem', textAlign: 'center' }}>
              {uploading ? 'Uploading…' : 'Click to upload · Auto-compressed to WebP'}
            </span>
          </div>
        )}

        {uploading && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 size={32} className="text-red animate-spin" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageUploader;

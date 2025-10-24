import React from 'react';
import '../styles/Dashboard.css';

const ImageUpload = ({ handleImageUpload, imagePreviews }) => {
  return (
    <div className="adm-form-group">
      <label className="adm-label">Product Images</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
        className="adm-file-input"
      />
      {imagePreviews.length > 0 && (
        <div className="adm-image-previews">
          {imagePreviews.map((url, idx) => (
            <img key={idx} src={url} alt={`Preview ${idx + 1}`} className="adm-preview-img" />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
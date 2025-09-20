import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import Slider from '@mui/material/Slider';
import getCroppedImg from './cropImage'; // helper to create cropped blob

const CropUpload = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageSrc(reader.result));
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const formData = new FormData();
      formData.append('file', croppedBlob, 'crop.png');

      const response = await fetch('http://localhost:8000/match', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('Top 5 matches:', result.matches);
      alert(JSON.stringify(result.matches, null, 2));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Upload and Crop Hieroglyph Symbol</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {imageSrc && (
        <div>
          <div style={{ position: 'relative', width: '100%', height: 400, background: '#333', marginTop: '20px' }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e, zoom) => setZoom(zoom)}
            />
          </div>
          <button onClick={handleUpload} style={{ marginTop: '10px', padding: '10px 20px' }}>
            Decode Symbol
          </button>
        </div>
      )}
    </div>
  );
};

export default CropUpload;

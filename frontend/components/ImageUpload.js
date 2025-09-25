function ImageUpload({ onImageUpload }) {
  try {
    const [isDragging, setIsDragging] = React.useState(false);
    const fileInputRef = React.useRef(null);

    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);
      
      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find(file => file.type.startsWith('image/'));
      
      if (imageFile) {
        onImageUpload(imageFile);
      }
    };

    const handleFileSelect = (e) => {
      const file = e.target.files[0];
      if (file) {
        onImageUpload(file);
      }
    };

    const openFileDialog = () => {
      fileInputRef.current?.click();
    };

    return (
      <div className="card" data-name="image-upload" data-file="components/ImageUpload.js">
        <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
          Upload Hieroglyph Image
        </h2>
        
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging 
              ? 'border-[var(--primary-color)] bg-[var(--secondary-color)] bg-opacity-20' 
              : 'border-[var(--secondary-color)] hover:border-[var(--primary-color)]'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[var(--secondary-color)]">
              <div className="icon-upload text-2xl text-[var(--primary-color)]"></div>
            </div>
            
            <div>
              <p className="text-lg font-medium text-[var(--text-primary)] mb-2">
                {isDragging ? 'Drop image here' : 'Drag & drop or click to upload'}
              </p>
              <p className="text-[var(--text-secondary)]">
                Supports JPG, PNG, and other image formats
              </p>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    );
  } catch (error) {
    console.error('ImageUpload component error:', error);
    return null;
  }
}
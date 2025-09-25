function ImageCanvas({ imageSrc, onRegionSelect, selectedRegion }) {
  try {
    const [isSelecting, setIsSelecting] = React.useState(false);
    const [startPoint, setStartPoint] = React.useState(null);
    const [currentSelection, setCurrentSelection] = React.useState(null);
    const canvasRef = React.useRef(null);

    const handleMouseDown = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setIsSelecting(true);
      setStartPoint({ x, y });
      setCurrentSelection({ x, y, width: 0, height: 0 });
    };

    const handleMouseMove = (e) => {
      if (!isSelecting || !startPoint) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const selection = {
        x: Math.min(startPoint.x, x),
        y: Math.min(startPoint.y, y),
        width: Math.abs(x - startPoint.x),
        height: Math.abs(y - startPoint.y)
      };

      setCurrentSelection(selection);
    };

    const handleMouseUp = () => {
      if (currentSelection && currentSelection.width > 10 && currentSelection.height > 10) {
        onRegionSelect(currentSelection);
      }
      
      setIsSelecting(false);
      setStartPoint(null);
      setCurrentSelection(null);
    };

    const selection = currentSelection || selectedRegion;

    return (
      <div className="card" data-name="image-canvas" data-file="components/ImageCanvas.js">
        <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
          Select Symbol
        </h2>
        
        <div className="relative inline-block">
          <img
            ref={canvasRef}
            src={imageSrc}
            alt="Hieroglyph"
            className="max-w-full h-auto rounded-lg cursor-crosshair select-none"
            style={{ maxHeight: '500px' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            draggable={false}
          />
          
          {selection && (
            <div
              className="selection-box"
              style={{
                left: `${selection.x}px`,
                top: `${selection.y}px`,
                width: `${selection.width}px`,
                height: `${selection.height}px`
              }}
            />
          )}
        </div>

        <p className="text-sm text-[var(--text-secondary)] mt-4">
          Click and drag to select a hieroglyph symbol for analysis
        </p>
      </div>
    );
  } catch (error) {
    console.error('ImageCanvas component error:', error);
    return null;
  }
}
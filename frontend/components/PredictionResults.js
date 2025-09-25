function PredictionResults({ predictions, isAnalyzing, hasSelection, onSaveSymbol }) {
  try {
    if (!hasSelection) {
      return (
        <div className="card" data-name="prediction-results" data-file="components/PredictionResults.js">
          <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
            Analysis Results
          </h2>
          
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[var(--secondary-color)] mx-auto mb-4">
              <div className="icon-search text-2xl text-[var(--primary-color)]"></div>
            </div>
            <p className="text-[var(--text-secondary)]">
              Select a symbol from your uploaded image to begin analysis
            </p>
          </div>
        </div>
      );
    }

    if (isAnalyzing) {
      return (
        <div className="card" data-name="prediction-results" data-file="components/PredictionResults.js">
          <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
            Analysis Results
          </h2>
          
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[var(--secondary-color)] mx-auto mb-4 animate-pulse">
              <div className="icon-loader text-2xl text-[var(--primary-color)]"></div>
            </div>
            <p className="text-[var(--text-secondary)]">
              Analyzing hieroglyph symbol...
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="card" data-name="prediction-results" data-file="components/PredictionResults.js">
        <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
          Top 5 Matching Patterns
        </h2>
        
        {predictions && predictions.length > 0 ? (
          <div className="space-y-4">
            {predictions.map((prediction, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg border border-[var(--secondary-color)] bg-[var(--bg-secondary)]"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-[var(--text-primary)]">
                    #{index + 1} {prediction.symbol}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold px-2 py-1 rounded bg-[var(--primary-color)] text-white">
                      {prediction.confidence}%
                    </span>
                    <button
                      onClick={() => onSaveSymbol(prediction.symbol, prediction.meaning, prediction.confidence)}
                      className="p-1 rounded hover:bg-[var(--secondary-color)] transition-colors"
                      title="Save to Library"
                    >
                      <div className="icon-bookmark text-sm text-[var(--primary-color)]"></div>
                    </button>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className="h-2 rounded-full bg-[var(--primary-color)]"
                    style={{ width: `${prediction.confidence}%` }}
                  ></div>
                </div>
                
                <p className="text-[var(--text-secondary)] text-sm">
                  <strong>Meaning:</strong> {prediction.meaning}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-[var(--text-secondary)]">
              No matches found for the selected symbol
            </p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('PredictionResults component error:', error);
    return null;
  }
}
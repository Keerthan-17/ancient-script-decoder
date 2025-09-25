class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">We're sorry, but something unexpected happened.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-black"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  try {
    const [uploadedImage, setUploadedImage] = React.useState(null);
    const [selectedRegion, setSelectedRegion] = React.useState(null);
    const [predictions, setPredictions] = React.useState(null);
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const [showLibrary, setShowLibrary] = React.useState(false);
    const [savedSymbols, setSavedSymbols] = React.useState([]);

    const handleImageUpload = (imageFile) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setSelectedRegion(null);
        setPredictions(null);
      };
      reader.readAsDataURL(imageFile);
    };

    const handleRegionSelect = async (region) => {
      setSelectedRegion(region);
      setIsAnalyzing(true);
      
      try {
        // Simulate AI analysis with mock predictions
        const mockPredictions = await analyzeHieroglyph(region);
        setPredictions(mockPredictions);
      } catch (error) {
        console.error('Analysis error:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    const handleSaveSymbol = async (symbol, meaning, confidence, userNotes = '') => {
      try {
        await saveSymbolToLibrary(symbol, meaning, confidence, userNotes);
        loadSavedSymbols();
      } catch (error) {
        console.error('Error saving symbol:', error);
      }
    };

    const loadSavedSymbols = async () => {
      try {
        const symbols = await getSavedSymbols();
        setSavedSymbols(symbols);
      } catch (error) {
        console.error('Error loading saved symbols:', error);
      }
    };

    React.useEffect(() => {
      loadSavedSymbols();
    }, []);

    return (
      <div className="min-h-screen bg-[var(--bg-primary)]" data-name="app" data-file="app.js">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[var(--secondary-color)]">
                <div className="icon-image text-xl text-[var(--primary-color)]"></div>
              </div>
              <h1 className="text-4xl font-bold text-[var(--text-primary)]">
                Hieroglyph Analyzer
              </h1>
            </div>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
              Upload hieroglyph images and discover ancient symbols with AI-powered pattern recognition
            </p>
            
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setShowLibrary(false)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  !showLibrary 
                    ? 'bg-[var(--primary-color)] text-white' 
                    : 'bg-[var(--secondary-color)] text-[var(--text-primary)] hover:bg-[var(--accent-color)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="icon-search text-lg"></div>
                  Analyzer
                </div>
              </button>
              <button
                onClick={() => setShowLibrary(true)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  showLibrary 
                    ? 'bg-[var(--primary-color)] text-white' 
                    : 'bg-[var(--secondary-color)] text-[var(--text-primary)] hover:bg-[var(--accent-color)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="icon-bookmark text-lg"></div>
                  Library ({savedSymbols.length})
                </div>
              </button>
            </div>
          </header>

          {!showLibrary ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <ImageUpload onImageUpload={handleImageUpload} />
                
                {uploadedImage && (
                  <ImageCanvas 
                    imageSrc={uploadedImage}
                    onRegionSelect={handleRegionSelect}
                    selectedRegion={selectedRegion}
                  />
                )}
              </div>

              <div>
                <PredictionResults 
                  predictions={predictions}
                  isAnalyzing={isAnalyzing}
                  hasSelection={!!selectedRegion}
                  onSaveSymbol={handleSaveSymbol}
                />
              </div>
            </div>
          ) : (
            <SymbolLibrary 
              savedSymbols={savedSymbols}
              onRefresh={loadSavedSymbols}
            />
          )}

          <footer className="text-center mt-12 pt-8 border-t border-[var(--secondary-color)]">
            <p className="text-[var(--text-secondary)]">
              © 2025 Hieroglyph Analyzer. Unlock the mysteries of ancient symbols.
            </p>
          </footer>
        </div>
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
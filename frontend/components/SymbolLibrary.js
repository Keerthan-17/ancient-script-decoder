function SymbolLibrary({ savedSymbols, onRefresh }) {
  try {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState('all');

    const filteredSymbols = savedSymbols.filter(symbol => {
      const matchesSearch = symbol.objectData.Symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           symbol.objectData.Meaning.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

    const handleDeleteSymbol = async (symbolId) => {
      try {
        await deleteSymbolFromLibrary(symbolId);
        onRefresh();
      } catch (error) {
        console.error('Error deleting symbol:', error);
      }
    };

    return (
      <div className="space-y-6" data-name="symbol-library" data-file="components/SymbolLibrary.js">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              Symbol Library
            </h2>
            <button
              onClick={onRefresh}
              className="btn-primary flex items-center gap-2"
            >
              <div className="icon-refresh-cw text-lg"></div>
              Refresh
            </button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <div className="icon-search text-[var(--text-secondary)]"></div>
              </div>
              <input
                type="text"
                placeholder="Search symbols or meanings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[var(--secondary-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {filteredSymbols.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[var(--secondary-color)] mx-auto mb-4">
              <div className="icon-bookmark text-2xl text-[var(--primary-color)]"></div>
            </div>
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
              No symbols saved yet
            </h3>
            <p className="text-[var(--text-secondary)]">
              Start analyzing hieroglyphs and save interesting symbols to your library
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSymbols.map((symbolObj) => (
              <div key={symbolObj.objectId} className="card hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{symbolObj.objectData.Symbol}</div>
                    <div>
                      <div className="text-sm font-semibold px-2 py-1 rounded bg-[var(--primary-color)] text-white">
                        {symbolObj.objectData.Confidence}%
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteSymbol(symbolObj.objectId)}
                    className="p-2 rounded hover:bg-red-100 transition-colors text-red-600"
                    title="Remove from Library"
                  >
                    <div className="icon-trash-2 text-sm"></div>
                  </button>
                </div>

                <h3 className="font-medium text-[var(--text-primary)] mb-2">
                  {symbolObj.objectData.Meaning}
                </h3>

                {symbolObj.objectData.UserNotes && (
                  <div className="mb-3">
                    <p className="text-sm text-[var(--text-secondary)]">
                      <strong>Notes:</strong> {symbolObj.objectData.UserNotes}
                    </p>
                  </div>
                )}

                <div className="text-xs text-[var(--text-secondary)]">
                  Saved: {new Date(symbolObj.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('SymbolLibrary component error:', error);
    return null;
  }
}
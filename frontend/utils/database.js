// Trickle Database functions for hieroglyph symbol management

async function getHieroglyphsFromDB() {
  try {
    const result = await trickleListObjects('hieroglyph', 100, true);
    return result.items.map(item => ({
      symbol: item.objectData.Symbol,
      meaning: item.objectData.Meaning,
      category: item.objectData.Category,
      description: item.objectData.Description
    }));
  } catch (error) {
    console.error('Error fetching hieroglyphs from database:', error);
    return [];
  }
}

async function saveSymbolToLibrary(symbol, meaning, confidence, userNotes = '') {
  try {
    const symbolData = {
      Symbol: symbol,
      Meaning: meaning,
      Confidence: confidence,
      UserNotes: userNotes,
      SavedAt: new Date().toISOString()
    };
    
    const result = await trickleCreateObject('saved_symbol', symbolData);
    return result;
  } catch (error) {
    console.error('Error saving symbol to library:', error);
    throw error;
  }
}

async function getSavedSymbols() {
  try {
    const result = await trickleListObjects('saved_symbol', 100, true);
    return result.items;
  } catch (error) {
    console.error('Error getting saved symbols:', error);
    return [];
  }
}

async function deleteSymbolFromLibrary(symbolId) {
  try {
    await trickleDeleteObject('saved_symbol', symbolId);
  } catch (error) {
    console.error('Error deleting symbol:', error);
    throw error;
  }
}

async function updateSymbolNotes(symbolId, userNotes) {
  try {
    const result = await trickleUpdateObject('saved_symbol', symbolId, {
      UserNotes: userNotes
    });
    return result;
  } catch (error) {
    console.error('Error updating symbol notes:', error);
    throw error;
  }
}
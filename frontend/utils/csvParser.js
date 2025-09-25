// Mock CSV data - replace with actual CSV file parsing when available
const mockHieroglyphData = [
  { symbol: "𓀀", meaning: "Man, person, individual" },
  { symbol: "𓀁", meaning: "Woman, female, lady" },
  { symbol: "𓀂", meaning: "Child, young person" },
  { symbol: "𓀃", meaning: "Elder, old person, wise one" },
  { symbol: "𓀄", meaning: "King, pharaoh, ruler" },
  { symbol: "𓀅", meaning: "God, deity, divine being" },
  { symbol: "𓀆", meaning: "Priest, religious official" },
  { symbol: "𓀇", meaning: "Scribe, writer, scholar" },
  { symbol: "𓀈", meaning: "Worker, laborer, craftsman" },
  { symbol: "𓀉", meaning: "Soldier, warrior, guard" },
  { symbol: "𓁀", meaning: "House, home, dwelling" },
  { symbol: "𓁁", meaning: "Temple, sacred place" },
  { symbol: "𓁂", meaning: "Palace, royal residence" },
  { symbol: "𓁃", meaning: "City, town, settlement" },
  { symbol: "𓁄", meaning: "Water, river, Nile" },
  { symbol: "𓁅", meaning: "Sun, light, day" },
  { symbol: "𓁆", meaning: "Moon, night, darkness" },
  { symbol: "𓁇", meaning: "Star, heaven, sky" },
  { symbol: "𓁈", meaning: "Earth, ground, land" },
  { symbol: "𓁉", meaning: "Fire, flame, heat" }
];

async function parseCSVData(csvContent) {
  try {
    // Try to get data from Trickle database first
    const dbData = await getHieroglyphsFromDB();
    if (dbData && dbData.length > 0) {
      return dbData;
    }
    
    // Fall back to mock data if database is empty
    return mockHieroglyphData;
  } catch (error) {
    console.error('CSV parsing error:', error);
    return mockHieroglyphData;
  }
}

function getHieroglyphMeaning(symbol) {
  try {
    const data = parseCSVData();
    const match = data.find(item => item.symbol === symbol);
    return match ? match.meaning : "Unknown hieroglyph symbol";
  } catch (error) {
    console.error('Error getting hieroglyph meaning:', error);
    return "Unknown hieroglyph symbol";
  }
}
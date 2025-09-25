# Hieroglyph Analyzer

A web application for analyzing ancient Egyptian hieroglyphs using AI-powered pattern recognition.

## Features

- **Image Upload**: Drag and drop or click to upload hieroglyph images
- **Symbol Selection**: Interactive canvas for selecting specific symbols from uploaded images
- **AI Analysis**: Pattern matching with confidence scores for top 5 predictions
- **Symbol Database**: CSV-based hieroglyph symbol meanings and interpretations

## How to Use

1. **Upload Image**: Use the upload area to add a hieroglyph image (JPG, PNG supported)
2. **Select Symbol**: Click and drag on the image to select a specific hieroglyph symbol
3. **View Results**: Get top 5 matching patterns with confidence percentages and meanings

## Technical Stack

- React 18 for interactive UI components
- TailwindCSS for styling with Egyptian-inspired theme
- Canvas-based image interaction for symbol selection
- Mock AI analysis (ready for real AI model integration)

## CSV Data Integration

The application supports CSV files containing hieroglyph symbols and their meanings. Current implementation includes mock data that can be replaced with actual CSV parsing.

## Future Enhancements

- Real AI model integration for accurate hieroglyph recognition
- CSV file upload functionality
- Symbol history and bookmarking
- Advanced image preprocessing options
import random
from PIL import Image
import io

# Dummy Gardiner Codes
GARDINER_CODES = [
    "A1", "A2", "A3", "B1", "B2", "C1", "D1", "E1", "F1", "G1",
    "H1", "I1", "K1", "L1", "M1", "N1", "O1", "P1", "Q1", "R1"
]

def demo_predict_symbol(image_bytes):
    """
    Dummy model that returns:
    - predicted Gardiner code with confidence %
    - 5 similar symbols with similarity %
    """
    try:
        # Just to simulate opening the image
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except:
        pass  # Even if invalid, still return dummy output

    # Random prediction
    predicted_code = random.choice(GARDINER_CODES)
    confidence = round(random.uniform(70, 99), 2)

    # Random 5 similar codes
    similar_codes = random.sample([c for c in GARDINER_CODES if c != predicted_code], 5)
    similars = [{"code": code, "similarity": round(random.uniform(50, 95), 2)} for code in similar_codes]

    return {
        "predicted_code": predicted_code,
        "confidence": confidence,
        "similar_symbols": similars
    }

import random
from PIL import Image

# ------------------------
# Dummy Gardiner Codes
# ------------------------
GARDINER_CODES = [
    "A1", "A2", "A3", "B1", "B2", "C1", "D1", "E1", "F1", "G1",
    "H1", "I1", "K1", "L1", "M1", "N1", "O1", "P1", "Q1", "R1"
]

def demo_predict_symbol(image_path):
    # Just to simulate reading an image
    try:
        img = Image.open(image_path).convert("RGB")
        print(f"Image '{image_path}' loaded successfully.")
    except:
        print(f"Could not load '{image_path}'. Using dummy data.")

    # Randomly pick one predicted Gardiner code
    predicted_code = random.choice(GARDINER_CODES)
    confidence = round(random.uniform(70, 99), 2)  # main prediction confidence

    # Randomly select 5 other similar codes with similarity %
    similar_codes = random.sample([c for c in GARDINER_CODES if c != predicted_code], 5)
    similars = [(code, round(random.uniform(50, 95), 2)) for code in similar_codes]

    return predicted_code, confidence, similars


# ------------------------
# Example Usage
# ------------------------
pred_code, confidence, similars = demo_predict_symbol("test_symbol.jpg")

print("\n--- Demo Output ---")
print(f"Predicted Gardiner Code: {pred_code} ({confidence}%)")
print("Top 5 Similar Symbols:")
for code, sim in similars:
    print(f"{code} - {sim}% similarity")
print("--------------------\n")
from flask import Flask, request, render_template_string
import sys, os
import pandas as pd

# Add project root to Python path (so we can import models.demo)
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.demo import demo_predict_symbol

app = Flask(__name__)

# ------------------------
# Load Gardiner meanings CSV once
# ------------------------
CSV_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dataset/dataset.csv")
df = pd.read_csv(CSV_PATH)
gardiner_dict = dict(zip(df['gardiner_code'], df['meaning']))

def get_gardiner_meaning(predicted_code):
    return gardiner_dict.get(predicted_code, "Meaning not found")


# ------------------------
# Simple HTML (no CSS)
# ------------------------
UPLOAD_HTML = """
<!doctype html>
<title>Upload Image</title>
<h2>Upload Hieroglyph Image</h2>
<form method=post enctype=multipart/form-data>
  <input type=file name=image>
  <input type=submit value=Upload>
</form>

{% if result %}
  <h3>Prediction:</h3>
  <p><b>Predicted Gardiner Code:</b> {{ result.predicted_code }} ({{ result.confidence }}%)</p>
  <p><b>Meaning:</b> {{ result.meaning }}</p>

  <h4>Top 5 Similar Symbols:</h4>
  <ul>
    {% for item in result.similar_symbols %}
      <li>
        {{ item.code }} - {{ item.similarity }}% similarity 
        {% if item.meaning %} - Meaning: {{ item.meaning }}{% endif %}
      </li>
    {% endfor %}
  </ul>
{% endif %}
"""

@app.route("/", methods=["GET", "POST"])
def upload_file():
    result = None
    if request.method == "POST":
        if "image" not in request.files:
            return "No file uploaded", 400

        file = request.files["image"]
        image_bytes = file.read()

        # Get dummy prediction from demo model
        pred_result = demo_predict_symbol(image_bytes)

        # Add meaning for predicted code
        pred_result['meaning'] = get_gardiner_meaning(pred_result['predicted_code'])

        # Add meanings for top 5 similar symbols
        for item in pred_result['similar_symbols']:
            item['meaning'] = get_gardiner_meaning(item['code'])

        # Convert dict to object so Jinja can access with dot notation
        class ResultObj:
            def __init__(self, d): self.__dict__ = d
        result = ResultObj(pred_result)

    return render_template_string(UPLOAD_HTML, result=result)


if __name__ == "__main__":
    app.run(debug=True)

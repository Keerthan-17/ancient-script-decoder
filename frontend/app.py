from flask import Flask, request, render_template_string
import sys, os

# Add project root to Python path (so we can import models.demo)
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.demo import demo_predict_symbol

app = Flask(__name__)

# Simple HTML (no CSS)
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
  <h4>Top 5 Similar Symbols:</h4>
  <ul>
    {% for item in result.similar_symbols %}
      <li>{{ item.code }} - {{ item.similarity }}%</li>
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
        result = demo_predict_symbol(image_bytes)

        # Convert dict to object so Jinja can access with dot notation
        class ResultObj:
            def __init__(self, d): self.__dict__ = d
        result = ResultObj(result)

    return render_template_string(UPLOAD_HTML, result=result)

if __name__ == "__main__":
    app.run(debug=True)

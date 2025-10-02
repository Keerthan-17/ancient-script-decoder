import torch
from torchvision import models, transforms
from PIL import Image
import gradio as gr

# ----------------- Class names -----------------
class_names = [
    'Aa13', 'Aa15', 'E9', 'F18', 'G35', 'G39', 'G7', 'N30', 'O28', 'P8',
    'a1', 'a19', 'a2', 'a24', 'a30', 'a40', 'a42', 'a50', 'b1', 'd1', 'd2', 'd21',
    'd28', 'd35', 'd36', 'd37', 'd39', 'd4', 'd40', 'd45', 'd46', 'd52', 'd54', 'd55',
    'd58', 'd60', 'e1', 'e23', 'e34', 'f1', 'f12', 'f13', 'f21', 'f26', 'f31', 'f32',
    'f34', 'f35', 'f39', 'f4', 'g1', 'g14', 'g17', 'g25', 'g36', 'g37', 'g38', 'g40',
    'g43', 'g5', 'h1', 'h6', 'i1', 'i10', 'i9', 'l1', 'l2', 'm12', 'm16', 'm17', 'm18',
    'm2', 'm20', 'm23', 'm3', 'm42', 'n1', 'n14', 'n18', 'n25', 'n26', 'n29', 'n31',
    'n33', 'n35', 'n36', 'n37', 'n42', 'n5', 'n8', 'o1', 'o29', 'o3', 'o34', 'o4',
    'o49', 'o50', 'o6', 'q1', 'q2', 'q3', 'r11', 'r14', 'r4', 'r7', 'r8', 's19',
    's21', 's24', 's27', 's28', 's29', 's3', 's34', 's38', 's40', 't21', 't22', 't28',
    'u1', 'u15', 'u23', 'u33', 'u6', 'u7', 'v1', 'v10', 'v13', 'v20', 'v28', 'v29',
    'v30', 'v31', 'v4', 'v6', 'v7', 'w11', 'w14', 'w15', 'w17', 'w18', 'w19', 'w22',
    'w23', 'w24', 'w25', 'x1', 'x7', 'x8', 'y1', 'y2', 'y3', 'y4', 'y5', 'z1', 'z11',
    'z2', 'z3', 'z4'
]

# ----------------- Device -----------------
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# ----------------- Load EfficientNetV2-S -----------------
model = models.efficientnet_v2_s(weights=None)  # Do not load ImageNet weights if custom
num_classes = len(class_names)
model.classifier[1] = torch.nn.Linear(model.classifier[1].in_features, num_classes)

# Load your trained weights
model.load_state_dict(torch.load("D:\Desktop\Ensemble\EfficientNetV2-S_best_model2.pth", map_location=DEVICE))
model.to(DEVICE)
model.eval()

# ----------------- Transform -----------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

# ----------------- Prediction function -----------------
def predict_image(image):
    img = Image.fromarray(image).convert('RGB')
    img = transform(img).unsqueeze(0).to(DEVICE)
    with torch.no_grad():
        outputs = model(img)
        probs = torch.nn.functional.softmax(outputs, dim=1)
        conf, pred_idx = torch.max(probs, 1)
        top5 = {class_names[i]: float(probs[0][i]) for i in range(len(class_names))}
        return top5, class_names[pred_idx.item()], float(conf)

# ----------------- Gradio UI -----------------
iface = gr.Interface(
    fn=predict_image,
    inputs=gr.Image(type="numpy"),
    outputs=[
        gr.Label(num_top_classes=5, label="Top 5 Predictions"),
        gr.Textbox(label="Predicted Class"),
        gr.Textbox(label="Confidence")
    ],
    title="EfficientNetV2-S Classifier",
    description="Upload an image and get the predicted class"
)

iface.launch()

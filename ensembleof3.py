import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import gradio as gr

# ----------------- Device -----------------
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ----------------- Paths to checkpoints -----------------
resnet_ckpt = r"D:\Desktop\Ensemble\resent18_model_epoch13.pth"
convnext_ckpt = r"D:\Desktop\Ensemble\convnext_tiny_best_model1.pth"
efficient_ckpt = r"D:\Desktop\Ensemble\EfficientNetV2-S_best_model2.pth"

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

# ----------------- Transforms -----------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

# ----------------- Load Models -----------------
# ResNet18
num_resnet_classes = 150
resnet18 = models.resnet18(weights=None)
resnet18.fc = nn.Sequential(
    nn.Dropout(0.5),
    nn.Linear(resnet18.fc.in_features, num_resnet_classes)
)
resnet18.load_state_dict(torch.load(resnet_ckpt, map_location=DEVICE))
resnet18 = resnet18.to(DEVICE).eval()

# ConvNeXt-Tiny
num_classes_total = len(class_names)
convnext = models.convnext_tiny(weights=None)
convnext.classifier[2] = nn.Linear(convnext.classifier[2].in_features, num_classes_total)
convnext.load_state_dict(torch.load(convnext_ckpt, map_location=DEVICE))
convnext = convnext.to(DEVICE).eval()

# EfficientNetV2-S
efficient = models.efficientnet_v2_s(weights=None)
efficient.classifier[1] = nn.Linear(efficient.classifier[1].in_features, num_classes_total)
efficient.load_state_dict(torch.load(efficient_ckpt, map_location=DEVICE))
efficient = efficient.to(DEVICE).eval()

# Missing classes handling for ResNet
missing_classes = ['y2','y3','y4','y5','z1','z11','z2','z3','z4']
trained_classes = [c for c in class_names if c not in missing_classes]
def pad_resnet_predictions(preds_150):
    batch_size = preds_150.size(0)
    preds_159 = torch.zeros(batch_size, num_classes_total).to(DEVICE)
    for i, cls in enumerate(trained_classes):
        idx = class_names.index(cls)
        preds_159[:, idx] = preds_150[:, i]
    return preds_159

# ----------------- Prediction Function -----------------
def predict(image):
    image = transform(image).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        out_resnet = resnet18(image)
        out_resnet = pad_resnet_predictions(out_resnet)
        out_convnext = convnext(image)
        out_efficient = efficient(image)

        # Ensemble (weighted logits)
        ensemble_logits = 0.45*out_efficient + 0.35*out_resnet + 0.20*out_convnext
        ensemble_probs = torch.softmax(ensemble_logits, dim=1).squeeze()

        # Top-5 predictions
        top_probs, top_indices = torch.topk(ensemble_probs, 5)
        top_probs = top_probs.cpu().numpy()
        top_indices = top_indices.cpu().numpy()

    results = {class_names[i]: float(top_probs[j]) for j, i in enumerate(top_indices)}
    return results

# ----------------- Gradio UI -----------------
demo = gr.Interface(
    fn=predict,
    inputs=gr.Image(type="pil"),
    outputs=gr.Label(num_top_classes=5),
    title="Ensemble Model",
    description="Upload an image to get Top-5 predictions from ResNet18 + ConvNeXt + EfficientNetV2-S"
)

if __name__ == "__main__":
    demo.launch()

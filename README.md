# 🏺 Ancient Script Decoder
*AI-powered Hieroglyph Recognition & Translation*

| ![Python](https://img.shields.io/badge/Python-3.9%2B-blue?logo=python&logoColor=white)  ![React](https://img.shields.io/badge/Frontend-React-%2361DAFB?logo=react&logoColor=black)  ![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)  ![License](https://img.shields.io/badge/License-MIT-green)  ![Contributions](https://img.shields.io/badge/Contributions-Welcome-orange)  ![Status](https://img.shields.io/badge/Project-Active-success)  |
---

## 🌍 About the Project  
Ancient Egyptian hieroglyphs are fascinating but hard to read.  
This project makes them accessible!  

👉 Upload a hieroglyphic image → crop a symbol → our AI matches it against a database → get the **top 5 similar symbols** with:  
- ✅ **Gardiner Code** (official classification)  
- ✅ **English meaning/word**  
- ✅ **Match percentage** (confidence score)  

This helps students, researchers, and history enthusiasts understand hieroglyphs with ease.  

---

## ✨ Features  
- 📤 Upload hieroglyphic images  
- ✂️ Crop and select specific symbols  
- 🔍 Get **Top-5 symbol matches** instantly  
- 🏷️ View **Gardiner Code + English meaning**  
- 📊 Matching percentage for transparency  
- 💾 Feedback loop (future): improve model with user corrections  

---

## 📂 Project Structure  

```
project_root/
│
├── dataset/             # All hieroglyph images + metadata
│   ├── images/          # Organized by Gardiner categories (A, B, G, M, N…)
│   └── dataset.csv      # Metadata file (gardiner_code, meaning, etc.)
│
├── models/              # Trained ML/DL models
├── embeddings/          # FAISS index + embeddings
├── backend/             # FastAPI backend code
├── frontend/            # React app for upload + crop + results
└── README.md            # Project documentation
```

---

## 🛠️ Tech Stack  
- **Frontend** → React + Tailwind + React Easy Crop  
- **Backend** → FastAPI (Python)  
- **AI/ML** → PyTorch + FAISS (vector search)  
- **Database** → CSV / SQLite (for symbol metadata)  

---

## 📑 Dataset Format  

CSV file: `dataset/dataset.csv`  
```csv
id,file_name,gardiner_code,category,meaning,source
1,images/A/A1.jpg,A1,A,seated man,Wikimedia Commons
2,images/G/G17.jpg,G17,G,owl,Wikimedia Commons
3,images/N/N5.jpg,N5,N,sun disk,Wikimedia Commons
```

---

## 🚀 Getting Started  

### 1️⃣ Clone the repo
```bash
git clone https://github.com/Keerthan-17/ancient-script-decoder.git
cd ancient-script-decoder
```

### 2️⃣ Install backend dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 3️⃣ Run backend
```bash
uvicorn main:app --reload
```

### 4️⃣ Run frontend
```bash
cd frontend
npm install
npm start
```

---

## 🎯 Roadmap  
- [x] Upload & crop feature  
- [x] Symbol matching with FAISS  
- [ ] Expand dataset with more Gardiner codes  
- [ ] Add user feedback for corrections  
- [ ] Deploy demo online  

---

## 🤝 Contributing  
Contributions are welcome! 🎉  
1. Fork the repo  
2. Create a feature branch  
3. Commit changes  
4. Open a pull request  

---

## 📜 License  
This project is MIT Licensed.  
Users must still comply with **third-party dataset / API provider terms**.  

---

## 💡 Inspiration  
This project was built as a **Final Year Engineering Project** 🏫 with the aim of blending **AI + History + Accessibility**.


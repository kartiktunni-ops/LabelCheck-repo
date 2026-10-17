# Compliance Checker — Backend

Flask API that OCRs a product label image and checks it against 8 Legal
Metrology / FSSAI mandatory declarations.

## 1. Install Tesseract OCR (Windows)

pytesseract needs the actual Tesseract engine installed on the machine — the
Python package is just a wrapper around it.

1. Download and run the installer from the UB-Mannheim build:
   https://github.com/UB-Mannheim/tesseract/wiki
2. Accept the default install location: `C:\Program Files\Tesseract-OCR\`
3. That path is already set in [`ocr.py`](ocr.py):
   ```python
   pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
   ```
   If you installed it somewhere else, update that line to match.

(On macOS/Linux, install via `brew install tesseract` or
`apt install tesseract-ocr` and remove/comment out that line — it'll already
be on `PATH`.)

## 2. Install Python dependencies

```bash
cd backend
pip install -r requirements.txt
```

## 3. Run the server

```bash
python app.py
```

Runs on `http://localhost:5000`. Test it's up:

```bash
curl http://localhost:5000/api/health
# {"status": "ok"}
```

A `scans.db` SQLite file is created automatically on first run — no setup
needed.

## Endpoints

| Method | Path              | Description                              |
|--------|-------------------|-------------------------------------------|
| GET    | `/api/health`     | Health check                              |
| POST   | `/api/scan`       | Upload a label image (`multipart/form-data`, field `image`), get back OCR + compliance results |
| GET    | `/api/history`    | List past scans (summary)                 |
| GET    | `/api/scan/<id>`  | Full detail of one past scan              |

CORS is enabled for `http://localhost:5173` and `http://localhost:5174`
(Vite's default and fallback ports). If your frontend runs on a different
port, add it to the `origins` list in [`app.py`](app.py).

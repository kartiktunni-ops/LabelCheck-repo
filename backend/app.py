import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

from flask import Flask, Response, jsonify, request, session
from flask_cors import CORS

import db
from auth import check_credentials, login_required
from barcode import decode_barcode, lookup_product
from ocr import extract_text_with_confidence
from pdf_report import generate_pdf
from rules import analyze_text

UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tiff"}

app = Flask(__name__)
# Fixed dev secret so sessions survive a server restart during the demo.
# Not suitable for production — use a real secret from the environment there.
app.secret_key = "compliance-checker-dev-secret"
# Regex origins so a phone on the same Wi-Fi (hitting the dev machine's LAN IP
# instead of localhost) is also allowed — needed for the camera-scan flow.
CORS(
    app,
    origins=[r"^http://localhost:517\d$", r"^http://(\d{1,3}\.){3}\d{1,3}:517\d$"],
    supports_credentials=True,
)

db.init_db()


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    username = data.get("username", "")
    password = data.get("password", "")

    if not check_credentials(username, password):
        return jsonify({"error": "Invalid username or password"}), 401

    session["logged_in"] = True
    session["username"] = username
    return jsonify({"username": username})


@app.route("/api/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"success": True})


@app.route("/api/me", methods=["GET"])
def me():
    if session.get("logged_in"):
        return jsonify({"logged_in": True, "username": session.get("username")})
    return jsonify({"logged_in": False})


@app.route("/api/scan", methods=["POST"])
def scan():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided under field 'image'"}), 400

    image = request.files["image"]
    if image.filename == "":
        return jsonify({"error": "No file selected"}), 400

    ext = Path(image.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        return jsonify({"error": f"Unsupported file type: {ext}"}), 400

    scan_id = str(uuid.uuid4())
    saved_path = UPLOAD_DIR / f"{scan_id}{ext}"
    image.save(saved_path)

    try:
        raw_text, confidence_score = extract_text_with_confidence(saved_path)
    except Exception as exc:
        return jsonify({"error": f"OCR failed: {exc}"}), 500

    fields, passed, total, overall_status = analyze_text(raw_text)
    compliance_percentage = round((passed / total) * 100)

    timestamp = datetime.now(timezone.utc).isoformat()
    response = {
        "scan_id": scan_id,
        "overall_status": overall_status,
        "rules_passed": passed,
        "rules_total": total,
        "compliance_percentage": compliance_percentage,
        "confidence_score": confidence_score,
        "fields": fields,
        "raw_ocr_text": raw_text,
    }

    db.save_scan(
        {
            "scan_id": scan_id,
            "timestamp": timestamp,
            "filename": image.filename,
            "overall_status": overall_status,
            "rules_passed": passed,
            "rules_total": total,
            "compliance_percentage": compliance_percentage,
            "confidence_score": confidence_score,
            "fields_json": json.dumps(fields),
            "raw_ocr_text": raw_text,
        }
    )

    return jsonify(response)


@app.route("/api/barcode", methods=["POST"])
def barcode():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided under field 'image'"}), 400

    image = request.files["image"]
    if image.filename == "":
        return jsonify({"error": "No file selected"}), 400

    ext = Path(image.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        return jsonify({"error": f"Unsupported file type: {ext}"}), 400

    saved_path = UPLOAD_DIR / f"{uuid.uuid4()}{ext}"
    image.save(saved_path)

    try:
        code = decode_barcode(saved_path)
    except Exception as exc:
        return jsonify({"error": f"Barcode decoding failed: {exc}"}), 500

    if code is None:
        return jsonify({"error": "No barcode detected in that photo. Try getting closer with the barcode flat and in focus."}), 422

    product = lookup_product(code)
    return jsonify({"barcode": code, "product": product})


def _scan_row_to_dict(scan_row):
    return {
        "scan_id": scan_row["scan_id"],
        "overall_status": scan_row["overall_status"],
        "rules_passed": scan_row["rules_passed"],
        "rules_total": scan_row["rules_total"],
        "compliance_percentage": scan_row["compliance_percentage"],
        "confidence_score": scan_row["confidence_score"],
        "fields": json.loads(scan_row["fields_json"]),
        "raw_ocr_text": scan_row["raw_ocr_text"],
        "timestamp": scan_row["timestamp"],
        "filename": scan_row["filename"],
    }


@app.route("/api/history", methods=["GET"])
@login_required
def history():
    return jsonify(db.list_scans())


@app.route("/api/scan/<scan_id>", methods=["GET"])
@login_required
def scan_detail(scan_id):
    scan_row = db.get_scan(scan_id)
    if scan_row is None:
        return jsonify({"error": "Scan not found"}), 404

    return jsonify(_scan_row_to_dict(scan_row))


@app.route("/api/scan/<scan_id>/pdf", methods=["GET"])
def scan_pdf(scan_id):
    # Public like POST /api/scan — the scan_id is an unguessable UUID handed
    # only to the person who just ran that scan, so no login is required here.
    scan_row = db.get_scan(scan_id)
    if scan_row is None:
        return jsonify({"error": "Scan not found"}), 404

    pdf_bytes = generate_pdf(_scan_row_to_dict(scan_row))
    return Response(
        pdf_bytes,
        mimetype="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="compliance-report-{scan_id[:8]}.pdf"'},
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5000, use_reloader=False, threaded=True)

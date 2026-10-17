import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "scans.db"

SCHEMA = """
CREATE TABLE IF NOT EXISTS scans (
    scan_id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    filename TEXT NOT NULL,
    overall_status TEXT NOT NULL,
    rules_passed INTEGER NOT NULL,
    rules_total INTEGER NOT NULL,
    compliance_percentage INTEGER NOT NULL,
    confidence_score INTEGER NOT NULL,
    fields_json TEXT NOT NULL,
    raw_ocr_text TEXT NOT NULL
)
"""


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    conn.execute(SCHEMA)
    conn.commit()
    conn.close()


def save_scan(scan):
    conn = get_connection()
    conn.execute(
        """INSERT INTO scans
           (scan_id, timestamp, filename, overall_status, rules_passed, rules_total,
            compliance_percentage, confidence_score, fields_json, raw_ocr_text)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (
            scan["scan_id"],
            scan["timestamp"],
            scan["filename"],
            scan["overall_status"],
            scan["rules_passed"],
            scan["rules_total"],
            scan["compliance_percentage"],
            scan["confidence_score"],
            scan["fields_json"],
            scan["raw_ocr_text"],
        ),
    )
    conn.commit()
    conn.close()


def list_scans():
    conn = get_connection()
    rows = conn.execute(
        """SELECT scan_id, timestamp, filename, overall_status, rules_passed, rules_total,
                  compliance_percentage, confidence_score
           FROM scans ORDER BY timestamp DESC"""
    ).fetchall()
    conn.close()
    return [dict(row) for row in rows]


def get_scan(scan_id):
    conn = get_connection()
    row = conn.execute("SELECT * FROM scans WHERE scan_id = ?", (scan_id,)).fetchone()
    conn.close()
    return dict(row) if row else None

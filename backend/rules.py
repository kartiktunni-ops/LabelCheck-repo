import re

WINDOW = 60  # chars to search after a keyword for its associated value


def _find_near(text, keyword_pattern, value_pattern, window=WINDOW):
    """Find value_pattern within `window` chars after a keyword_pattern match."""
    for kw_match in re.finditer(keyword_pattern, text, re.IGNORECASE):
        segment = text[kw_match.end():kw_match.end() + window]
        val_match = re.search(value_pattern, segment, re.IGNORECASE)
        if val_match:
            return val_match.group(0).strip(" :₹-\n\t")
    return None


def detect_mrp(text):
    match = re.search(
        r"(?:MRP|M\.R\.P\.?)\s*[:\-]?\s*(?:Rs\.?|₹|INR)?\s*([\d,]+(?:\.\d{1,2})?)",
        text,
        re.IGNORECASE,
    )
    if match:
        return f"₹{match.group(1)}"
    match = re.search(r"₹\s*([\d,]+(?:\.\d{1,2})?)", text)
    if match:
        return f"₹{match.group(1)}"
    return None


def detect_net_quantity(text):
    match = re.search(
        r"(\d+(?:\.\d+)?)\s*(kg|g|gm|gms|ml|l|litre|liters?|pieces?|pcs)\b",
        text,
        re.IGNORECASE,
    )
    if match:
        return f"{match.group(1)} {match.group(2)}"
    return None


def detect_manufacturer(text):
    match = re.search(
        r"(?:Mfd\.?\s*by|Manufactured\s*by|Marketed\s*by|Packed\s*by)\s*[:\-]?\s*(.+)",
        text,
        re.IGNORECASE,
    )
    if match:
        value = match.group(1).strip()
        return value[:150] if value else None
    return None


def detect_mfg_date(text):
    return _find_near(
        text,
        r"(?:Mfg\.?|Manufactur(?:ed|ing)|Pkd\.?|Packed|Packing)\s*(?:Date|Dt\.?|On)?",
        r"\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{1,2}[\/\-]\d{4}",
    )


def detect_best_before(text):
    return _find_near(
        text,
        r"Best\s*Before",
        r"\d+\s*(?:days?|months?|years?)|\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{1,2}[\/\-]\d{4}",
    )


def detect_consumer_care_number(text):
    match = re.search(r"1800[-\s]?\d{2,3}[-\s]?\d{4}", text)
    if match:
        return match.group(0).strip()
    match = re.search(r"(?:\+?91[-\s]?)?[6-9]\d{9}\b", text)
    if match:
        return match.group(0).strip()
    return None


def detect_consumer_care_email(text):
    match = re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", text)
    if match:
        return match.group(0).strip()
    return None


def detect_fssai(text):
    for kw_match in re.finditer(r"FSSAI", text, re.IGNORECASE):
        segment = text[kw_match.end():kw_match.end() + WINDOW]
        val_match = re.search(r"\d[\d\s]{12,18}\d", segment)
        if val_match:
            digits = re.sub(r"\s", "", val_match.group(0))
            if len(digits) == 14:
                return digits
    match = re.search(r"\b\d{14}\b", text)
    if match:
        return match.group(0)
    return None


FIELD_DEFINITIONS = [
    {
        "name": "Manufacturer/Packer Name & Address",
        "category": "Legal Metrology",
        "reference": "Rule 6 — Name and address of manufacturer/packer/importer",
        "detector": detect_manufacturer,
    },
    {
        "name": "Net Quantity",
        "category": "Legal Metrology",
        "reference": "Rule 6 & 8 — Net quantity in standard units",
        "detector": detect_net_quantity,
    },
    {
        "name": "MRP (Maximum Retail Price)",
        "category": "Legal Metrology",
        "reference": "Rule 6 — Retail sale price inclusive of all taxes",
        "detector": detect_mrp,
    },
    {
        "name": "Manufacturing Date",
        "category": "Legal Metrology",
        "reference": "Rule 6 — Month and year of manufacture/packing/import",
        "detector": detect_mfg_date,
    },
    {
        "name": "Best Before / Expiry",
        "category": "Legal Metrology",
        "reference": "Rule 6 — Date of expiry / best before date",
        "detector": detect_best_before,
    },
    {
        "name": "Consumer Care Contact Number",
        "category": "Legal Metrology",
        "reference": "Rule 6 — Consumer care telephone number",
        "detector": detect_consumer_care_number,
    },
    {
        "name": "Consumer Care Email",
        "category": "Legal Metrology",
        "reference": "Rule 6 — Consumer care email address",
        "detector": detect_consumer_care_email,
    },
    {
        "name": "FSSAI License Number",
        "category": "FSSAI",
        "reference": "FSS (Packaging & Labelling) Regulations — 14-digit license number",
        "detector": detect_fssai,
    },
]


def analyze_text(text):
    fields = []
    passed = 0
    for definition in FIELD_DEFINITIONS:
        value = definition["detector"](text)
        detected = value is not None
        if detected:
            passed += 1
        fields.append(
            {
                "name": definition["name"],
                "detected": detected,
                "value": value,
                "status": "PASS" if detected else "FAIL",
                "category": definition["category"],
                "reference": definition["reference"],
            }
        )
    total = len(FIELD_DEFINITIONS)
    overall_status = "Compliant" if passed == total else "Non-Compliant"
    return fields, passed, total, overall_status

from io import BytesIO

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

NAVY = colors.HexColor("#1a2238")
NAVY_LIGHT = colors.HexColor("#eef1f8")
EMERALD_HEX = "#059669"
RED_HEX = "#dc2626"
EMERALD = colors.HexColor(EMERALD_HEX)
RED = colors.HexColor(RED_HEX)


def generate_pdf(scan):
    """scan is a dict with the same shape as the /api/scan response, plus
    timestamp and filename."""
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        topMargin=20 * mm,
        bottomMargin=20 * mm,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
    )
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle("TitleNavy", parent=styles["Title"], textColor=NAVY, fontSize=18)
    heading_style = ParagraphStyle("HeadingNavy", parent=styles["Heading2"], textColor=NAVY, fontSize=11)
    normal_style = styles["Normal"]
    small_style = ParagraphStyle("Small", parent=styles["Normal"], fontSize=8, textColor=colors.HexColor("#64748b"))
    cell_style = ParagraphStyle("Cell", parent=styles["Normal"], fontSize=8, leading=10)

    is_compliant = scan["overall_status"] == "Compliant"
    status_color = EMERALD if is_compliant else RED
    status_hex = EMERALD_HEX if is_compliant else RED_HEX

    story = []

    story.append(Paragraph("Department of Legal Metrology", small_style))
    story.append(Paragraph("Compliance Checker — Scan Report", title_style))
    story.append(Spacer(1, 4 * mm))

    meta_table = Table(
        [
            ["File", scan.get("filename", "—")],
            ["Scanned at", scan.get("timestamp", "—")],
            ["Scan ID", scan.get("scan_id", "—")],
        ],
        colWidths=[35 * mm, 130 * mm],
    )
    meta_table.setStyle(
        TableStyle(
            [
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#64748b")),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
            ]
        )
    )
    story.append(meta_table)
    story.append(Spacer(1, 6 * mm))

    summary_table = Table(
        [
            [
                Paragraph(f'<font size="24" color="{status_hex}"><b>{scan["compliance_percentage"]}%</b></font>', normal_style),
                Paragraph(f'<b>{scan["overall_status"].upper()}</b>', ParagraphStyle("st", parent=normal_style, textColor=status_color, fontSize=12)),
                Paragraph(f'{scan["rules_passed"]}/{scan["rules_total"]} checks passed<br/>{scan["confidence_score"]}% OCR confidence', small_style),
            ]
        ],
        colWidths=[40 * mm, 60 * mm, 65 * mm],
    )
    summary_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), NAVY_LIGHT),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (0, 0), 10),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#dbe1ee")),
            ]
        )
    )
    story.append(summary_table)
    story.append(Spacer(1, 8 * mm))

    story.append(Paragraph("Mandatory Declarations", heading_style))
    story.append(Spacer(1, 2 * mm))

    rows = [["Status", "Field", "Detected Value", "Reference"]]
    for field in scan["fields"]:
        # Helvetica has no glyph for ₹ (renders as a box), so use "Rs." in the PDF.
        value = (field["value"] or "—").replace("₹", "Rs. ")
        rows.append(
            [
                "PASS" if field["detected"] else "FAIL",
                Paragraph(field["name"], cell_style),
                Paragraph(value, cell_style),
                Paragraph(field["reference"], cell_style),
            ]
        )

    field_table = Table(rows, colWidths=[16 * mm, 42 * mm, 45 * mm, 62 * mm], repeatRows=1)
    style_commands = [
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#dbe1ee")),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
    ]
    for i, field in enumerate(scan["fields"], start=1):
        color = colors.HexColor("#d1fae5") if field["detected"] else colors.HexColor("#fee2e2")
        text_color = EMERALD if field["detected"] else RED
        style_commands.append(("BACKGROUND", (0, i), (0, i), color))
        style_commands.append(("TEXTCOLOR", (0, i), (0, i), text_color))
        style_commands.append(("FONTNAME", (0, i), (0, i), "Helvetica-Bold"))
    field_table.setStyle(TableStyle(style_commands))
    story.append(field_table)

    story.append(Spacer(1, 10 * mm))
    story.append(
        Paragraph(
            "This report is generated automatically from OCR text extraction and is "
            "not a substitute for manual verification under the Legal Metrology "
            "(Packaged Commodities) Rules, 2011.",
            small_style,
        )
    )

    doc.build(story)
    buffer.seek(0)
    return buffer.read()

import pytesseract
from PIL import Image, ImageOps

# Windows does not auto-detect the Tesseract binary. Set this to wherever
# the UB-Mannheim installer put it (default shown below). On macOS/Linux,
# leave this commented out — tesseract is usually already on PATH.
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Real phone photos are much lower quality than a clean scan: they carry EXIF
# rotation, are often small/low-contrast, and have a lot of background outside
# the label. This preprocessing pass measurably improves Tesseract's accuracy
# on that kind of input.
MIN_DIMENSION = 1600


def _preprocess(image):
    image = ImageOps.exif_transpose(image)  # phone photos are often sideways until this runs
    image = image.convert("L")  # grayscale

    if max(image.size) < MIN_DIMENSION:
        scale = MIN_DIMENSION / max(image.size)
        new_size = (round(image.width * scale), round(image.height * scale))
        image = image.resize(new_size, Image.LANCZOS)

    image = ImageOps.autocontrast(image)
    return image


def extract_text_with_confidence(image_path):
    """Returns (text, confidence) where confidence is Tesseract's average
    per-word confidence (0-100) across all words it recognized — a proxy for
    how readable/clean the source photo was, independent of which fields
    were actually found."""
    image = Image.open(image_path)
    image = _preprocess(image)

    text = pytesseract.image_to_string(image)

    data = pytesseract.image_to_data(image, output_type=pytesseract.Output.DICT)
    word_confidences = [
        int(conf) for conf, word in zip(data["conf"], data["text"])
        if str(conf).lstrip("-").isdigit() and int(conf) >= 0 and word.strip()
    ]
    confidence = round(sum(word_confidences) / len(word_confidences)) if word_confidences else 0

    return text, confidence

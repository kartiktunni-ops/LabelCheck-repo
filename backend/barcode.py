import json
import urllib.request

import zxingcpp
from PIL import Image, ImageOps

OFF_API = "https://world.openfoodfacts.org/api/v2/product"


def decode_barcode(image_path):
    image = Image.open(image_path)
    image = ImageOps.exif_transpose(image)
    results = zxingcpp.read_barcodes(image)
    return results[0].text if results else None


def lookup_product(barcode):
    url = f"{OFF_API}/{barcode}.json?fields=product_name,brands,quantity"
    try:
        with urllib.request.urlopen(url, timeout=8) as response:
            data = json.loads(response.read())
    except Exception:
        return None

    if data.get("status") == 1 and data.get("product"):
        return data["product"]
    return None

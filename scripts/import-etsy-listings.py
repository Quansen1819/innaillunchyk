"""Convert EtsyListingsDownload.csv into data/paintings.json."""

from __future__ import annotations

import csv
import json
import re
import struct
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

CSV_PATH = Path(r"C:\Users\quans\Downloads\EtsyListingsDownload.csv")
OUT_PATH = Path(__file__).resolve().parents[1] / "data" / "paintings.json"
SHOP_URL = "https://www.etsy.com/shop/InnaIliychukArt"

SIZE_RE = re.compile(
    r"(?<!\d)(\d{1,2})\s*[xX×]\s*(\d{1,2})(?!\d)\s*(?:inches|in\b)?",
    re.I,
)
SLUG_STRIP = re.compile(r"[^a-z0-9]+")
FILLER_WORDS = {
    "original",
    "oil",
    "painting",
    "paintings",
    "artwork",
    "art",
    "wall",
    "decor",
    "canvas",
    "panel",
    "stretched",
    "hanging",
    "handmade",
    "hand",
    "painted",
    "one",
    "kind",
    "small",
    "large",
    "inches",
    "impressionist",
    "expressive",
    "brushstrokes",
    "brushwork",
}

TITLE_PREFIXES = re.compile(
    r"(?i)\b(original(?:\s+impressionist)?(?:\s+cloudscape)?(?:\s+seascape)?"
    r"(?:\s+oil)?(?:\s+landscape)?(?:\s+cloud)?(?:\s+floral)?"
    r"(?:\s+oil)?\s+paintings?|small oil painting|oil landscape painting)\b"
)
TITLE_NOISE = re.compile(
    r"(?i)\b(wall arts?|wall decors?|wall hanging(?: oil art)?|canvas arts?|"
    r"canvas panels?|stretched canvas|nature decors?|home warming gift|"
    r"colorful canvas wall art|cottage arts?|beach house canvas panel|"
    r"hand-painted|one of a kind(?: art)?|expressive brushstrokes?)\b"
)


def jpeg_size(data: bytes) -> tuple[int, int] | None:
    if data[:2] != b"\xff\xd8":
        return None
    i = 2
    while i + 9 < len(data):
        if data[i] != 0xFF:
            i += 1
            continue
        marker = data[i + 1]
        if marker in (0xD8, 0xD9) or marker == 0x01 or 0xD0 <= marker <= 0xD7:
            i += 2
            continue
        if i + 3 >= len(data):
            break
        length = struct.unpack(">H", data[i + 2 : i + 4])[0]
        if marker in (0xC0, 0xC1, 0xC2):
            if i + 8 >= len(data):
                break
            h, w = struct.unpack(">HH", data[i + 5 : i + 9])
            return int(w), int(h)
        i += 2 + length
    return None


def fetch_image_size(url: str) -> tuple[int, int]:
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (compatible; InnaIliychukArt/1.0)"},
    )
    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            data = resp.read(96 * 1024)
        size = jpeg_size(data)
        if size:
            return size
    except Exception as exc:  # noqa: BLE001
        print(f"warn: size fetch failed {url}: {exc}", file=sys.stderr)
    return 1600, 1200


def slugify(text: str) -> str:
    slug = SLUG_STRIP.sub("-", text.lower()).strip("-")
    return slug or "painting"


def clean_tags(raw: str) -> list[str]:
    tags = []
    for part in (raw or "").split(","):
        tag = part.replace("_", " ").strip()
        if tag:
            tags.append(tag)
    return tags


def distinctive_count(text: str) -> int:
    words = re.findall(r"[a-zA-Z]+", text.lower())
    return sum(1 for w in words if w not in FILLER_WORDS and len(w) > 2)


def tidy_phrase(text: str) -> str:
    text = TITLE_PREFIXES.sub(" ", text)
    text = TITLE_NOISE.sub(" ", text)
    text = SIZE_RE.sub(" ", text)
    text = re.sub(r"[|:/]+", " ", text)
    text = re.sub(r"\s+", " ", text).strip(" ,-")
    return text


def clean_title(raw: str) -> str:
    text = re.sub(r"\([^)]*\)", " ", raw)
    parts = [tidy_phrase(p) for p in re.split(r"[,|]", text)]
    parts = [p for p in parts if p and distinctive_count(p) > 0]
    if not parts:
        fallback = tidy_phrase(raw)
        return fallback or "Original Oil Painting"

    parts.sort(key=lambda p: (-distinctive_count(p), -len(p)))
    chosen = [parts[0]]
    if len(parts) > 1 and distinctive_count(parts[1]) >= 2:
        extra = parts[1]
        if extra.lower() not in chosen[0].lower() and chosen[0].lower() not in extra.lower():
            chosen.append(extra)
    title = ", ".join(chosen)
    title = re.sub(r"(?i)\boriginal\b", " ", title)
    title = re.sub(r"(?i)\boil paintings?\b", " ", title)
    title = re.sub(r"(?i)\bimpressionist\b", " ", title)
    title = re.sub(r"\s+,", ",", title)
    title = re.sub(r",\s*,+", ",", title)
    title = re.sub(r"\s+", " ", title).strip(" ,-")
    return title[0].upper() + title[1:] if title else "Original Oil Painting"


def extract_size(title: str, desc: str) -> tuple[int, int]:
    blob = f"{title}\n{desc}"
    matches = SIZE_RE.findall(blob)
    a = b = None
    size_line = re.search(r"(?i)size:\s*(\d{1,2})\s*[xX×]\s*(\d{1,2})", desc)
    if size_line:
        a, b = int(size_line.group(1)), int(size_line.group(2))
    elif matches:
        a, b = int(matches[0][0]), int(matches[0][1])
    else:
        a, b = 16, 20

    horizontal = bool(re.search(r"(?i)horizontal orientation|horizontal artwork", blob))
    vertical = bool(re.search(r"(?i)vertical orientation", blob))
    if a == b:
        return a, b
    if horizontal:
        return max(a, b), min(a, b)
    if vertical:
        return min(a, b), max(a, b)
    # Title patterns like 24x18 already read as width x height.
    if a > b:
        return a, b
    return max(a, b), min(a, b)


def extract_medium(materials: str, desc: str) -> str:
    blob = f"{materials}\n{desc}".lower()
    if "panel" in blob or "canvas board" in blob or "canvas panel" in blob:
        return "Oil on Panel"
    if "stretched canvas" in blob or "oil on canvas" in blob or "oil on stretched canvas" in blob:
        return "Oil on Canvas"
    if (materials or "").strip():
        mat = materials.strip()
        if mat.lower() == "canvas":
            return "Oil on Canvas"
        return f"Oil on {mat}"
    return "Oil on Canvas"


def extract_description(desc: str) -> str:
    text = desc.replace("\r\n", "\n").replace("\r", "\n")
    text = re.split(r"(?i)\n\s*(?:details|detail)\s*:?\s*\n", text, maxsplit=1)[0]
    text = re.split(r"\n\s*[•*]", text, maxsplit=1)[0]
    paragraphs = [re.sub(r"\s+", " ", p).strip() for p in re.split(r"\n\s*\n", text)]
    skip_starts = (
        "perfect for",
        "this is an original",
        "colors may vary",
        "thank you",
        "the painting will",
        "original artwork",
        "this artwork was painted",
        "painted in my studio",
        "painted in chicago",
        "a beautiful choice",
        "ideal for",
        "it also makes",
    )
    sentences: list[str] = []
    for para in paragraphs:
        lower = para.lower()
        if not para or lower.startswith(skip_starts):
            continue
        if re.match(r"(?i)^original .*(inches|painting)", para) and len(para) < 90:
            continue
        for sentence in re.split(r"(?<=[.!?])\s+", para):
            s_low = sentence.lower()
            if not sentence or s_low.startswith(skip_starts):
                continue
            sentences.append(sentence)
        if len(sentences) >= 2:
            break
    if not sentences:
        return "Original oil painting."
    return " ".join(sentences[:3])


def classify(title: str, tags: list[str], desc: str) -> tuple[str, str]:
    hay = " ".join([title, desc, *tags]).lower()
    still_keys = ("still life", "flower vase")
    floral_keys = ("iris", "sunflower", "floral", "peony", "lilac")
    water_garden = ("water lily", "lily pond", "koi", "garden pond", "floral pond")
    winter = ("winter", "snow", "christmas")
    sea = ("seascape", "ocean", "coastal", "wave", "beach", "sailboat", "sailing", "palm tree", "palm trees")
    cloud = ("cloudscape", "cloud", "luminous sky", "pink cloud")
    cottage = ("cottage", "farmhouse", "village", "blooming trees")

    if any(k in hay for k in still_keys):
        return "still-life", "The Quiet Table"
    if any(k in hay for k in water_garden):
        return "landscapes", "Garden Ponds"
    if any(k in hay for k in winter):
        return "landscapes", "Winter Light"
    if any(k in hay for k in sea):
        return "landscapes", "Coastal Waters"
    if any(k in hay for k in cottage):
        return "landscapes", "Rivers & Fields"
    if any(k in hay for k in floral_keys) and "landscape" not in hay:
        return "florals", "Garden Notes"
    if any(k in hay for k in cloud):
        return "landscapes", "Clouds & Light"
    if any(k in hay for k in floral_keys):
        return "florals", "Garden Notes"
    return "landscapes", "Rivers & Fields"


def image_alt(title: str, medium: str, category: str) -> str:
    subject = {
        "florals": "floral oil painting",
        "still-life": "still life oil painting",
        "landscapes": "landscape oil painting",
    }[category]
    return f"{title}, {subject} in {medium.lower()} by Inna Iliychuk"


def main() -> None:
    with CSV_PATH.open(encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))

    paintings = []
    slugs: dict[str, int] = {}
    urls = []

    for index, row in enumerate(rows, start=1):
        title_raw = (row.get("TITLE") or "").strip()
        desc_raw = row.get("DESCRIPTION") or ""
        tags = clean_tags(row.get("TAGS") or "")
        materials = (row.get("MATERIALS") or "").strip()
        title = clean_title(title_raw)
        width_in, height_in = extract_size(title_raw, desc_raw)
        medium = extract_medium(materials, desc_raw)
        category, series = classify(title, tags, desc_raw)
        slug_base = slugify(title)
        n = slugs.get(slug_base, 0) + 1
        slugs[slug_base] = n
        if n > 1:
            title = f"{title} ({width_in}×{height_in})"
            slug_base = slugify(title)
            n = slugs.get(slug_base, 0) + 1
            slugs[slug_base] = n
        slug = slug_base if n == 1 else f"{slug_base}-{n}"
        images = [
            (row.get(f"IMAGE{i}") or "").strip()
            for i in range(1, 11)
            if (row.get(f"IMAGE{i}") or "").strip()
        ]
        primary = images[0] if images else ""
        extra = images[1:]
        urls.append((index, primary))
        qty = int(float(row.get("QUANTITY") or 1))
        paintings.append(
            {
                "id": f"p-{index:03d}",
                "slug": slug,
                "title": title,
                "year": 2025,
                "medium": medium,
                "widthIn": width_in,
                "heightIn": height_in,
                "price": int(float(row.get("PRICE") or 0)),
                "currency": (row.get("CURRENCY_CODE") or "USD").strip() or "USD",
                "status": "available" if qty > 0 else "sold",
                "category": category,
                "series": series,
                "image": primary,
                "images": extra,
                "imageWidth": 1600,
                "imageHeight": 1200,
                "imageAlt": image_alt(title, medium, category),
                "description": extract_description(desc_raw),
                "tags": tags,
                "materials": materials or medium,
                "etsyUrl": SHOP_URL,
            }
        )

    sizes: dict[int, tuple[int, int]] = {}
    with ThreadPoolExecutor(max_workers=12) as pool:
        futures = {pool.submit(fetch_image_size, url): idx for idx, url in urls if url}
        for fut in as_completed(futures):
            idx = futures[fut]
            sizes[idx] = fut.result()

    for painting in paintings:
        idx = int(painting["id"].split("-")[1])
        if idx in sizes:
            painting["imageWidth"], painting["imageHeight"] = sizes[idx]

    OUT_PATH.write_text(json.dumps(paintings, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {len(paintings)} paintings to {OUT_PATH}")
    for p in paintings:
            print(f"{p['id']} {p['widthIn']}x{p['heightIn']} {p['category']:11} {p['series']:16} {p['title']}".encode('utf-8', 'replace').decode('utf-8'))


if __name__ == "__main__":
    main()

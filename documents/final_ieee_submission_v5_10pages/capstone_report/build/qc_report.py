"""QC of the final capstone report: page labels, PAGEREF values vs. real pages, prohibited punctuation."""
import re, sys, zipfile, html
import pymupdf
PDF, DOCX = sys.argv[1], sys.argv[2]
d = pymupdf.open(PDF)
FOOT = "PCCOE, Department of Computer Science and Engineering (AI & ML) 2026-27"
labels = []
for p in d:
    lines = [l.strip() for l in p.get_text().split("\n") if l.strip()]
    lab = None
    if FOOT in lines:
        k = lines.index(FOOT)
        if k + 1 < len(lines) and re.fullmatch(r"[ivxlc]+|\d+", lines[k + 1]): lab = lines[k + 1]
    labels.append(lab)
print("pages:", d.page_count, "| no label:", [i + 1 for i, l in enumerate(labels) if l is None])
roman = [l for l in labels if l and not l.isdigit()]; arab = [int(l) for l in labels if l and l.isdigit()]
print("roman labels:", roman[0], "to", roman[-1], f"({len(roman)})", "| arabic:", arab[0], "to", arab[-1], f"({len(arab)})",
      "| arabic consecutive:", arab == list(range(1, len(arab) + 1)))

# PAGEREF results written by Word into the DOCX
x = zipfile.ZipFile(DOCX).read("word/document.xml").decode("utf8")
refs = {}
for m in re.finditer(r'<w:instrText[^>]*>\s*PAGEREF\s+(\S+)[^<]*</w:instrText>(.*?)<w:fldChar w:fldCharType="end"/>', x, re.S):
    val = "".join(re.findall(r"<w:t[^>]*>([^<]*)</w:t>", m.group(2)))
    refs[m.group(1)] = val.strip()
print("PAGEREF fields:", len(refs), "| empty or error:", [k for k, v in refs.items() if not v or "Error" in v])

# where does each bookmark's text really appear? bookmark names -> searchable text
bm_text = {}
for m in re.finditer(r'<w:bookmarkStart\b([^>]*)/>', x):
    attrs = dict(re.findall(r'w:(\w+)="([^"]*)"', m.group(1)))
    end = x.find(f'<w:bookmarkEnd w:id="{attrs.get("id")}"/>', m.end())
    if "name" not in attrs or end < 0:
        continue
    t = html.unescape("".join(re.findall(r"<w:t[^>]*>([^<]*)</w:t>", x[m.end():end])))
    bm_text[attrs["name"]] = re.sub(r"\s+", " ", t).strip()
pages_text = [re.sub(r"\s+", " ", p.get_text()) for p in d]
first_body = labels.index("1")
bad = []
for bm, val in refs.items():
    t = bm_text.get(bm, "")
    key = t[:45]
    hits = [i for i, pt in enumerate(pages_text) if key and key in pt and i >= first_body]
    if not hits: bad.append((bm, val, "text not found: " + key)); continue
    real = labels[hits[0]]
    if real != val: bad.append((bm, val, "actual " + str(real)))
print("PAGEREF mismatches:", bad if bad else "none", f"(checked {len(refs)})")

# prohibited punctuation in prose: body pages up to the References heading, outside reference/citation notation
ref_start = next(i for i, pt in enumerate(pages_text) if pt.strip().startswith(FOOT) and "REFERENCES" in pt[:200] or ("REFERENCES [1]" in pt))
hits = []
for i, pt in enumerate(pages_text[:ref_start]):
    for m in re.finditer("—|–|--", pt):
        ctx = pt[max(0, m.start() - 30): m.end() + 30]
        if re.search(r"\]–\[", ctx): continue          # IEEE citation range [a]-[b]
        hits.append((labels[i], ctx))
print("em/en dash or double hyphen before References:", len(hits))
for h in hits: print("   ", h)

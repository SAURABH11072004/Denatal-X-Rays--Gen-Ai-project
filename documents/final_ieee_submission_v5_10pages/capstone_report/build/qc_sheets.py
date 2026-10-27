# contact sheets of a PDF: qc_sheets.py <pdf> <out_prefix> <dpi> <per_sheet> [first,last]
import sys, pymupdf
from PIL import Image
pdf, out, dpi, per = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
d = pymupdf.open(pdf)
a, b = (map(int, sys.argv[5].split(","))) if len(sys.argv) > 5 else (1, d.page_count)
pages = list(range(a, b + 1))
for s in range(0, len(pages), per):
    ims = []
    for n in pages[s:s + per]:
        pm = d[n - 1].get_pixmap(dpi=dpi)
        ims.append(Image.frombytes("RGB", (pm.width, pm.height), pm.samples))
    w, h = ims[0].size
    ncol = min(per, 6)
    nrow = (len(ims) + ncol - 1) // ncol
    sheet = Image.new("RGB", (w * ncol, h * nrow), "white")
    for i, im in enumerate(ims):
        sheet.paste(im, ((i % ncol) * w, (i // ncol) * h))
    sheet.save(f"{out}_{pages[s]:03d}.png")
    print(f"{out}_{pages[s]:03d}.png", pages[s], "-", pages[min(s + per, len(pages)) - 1])

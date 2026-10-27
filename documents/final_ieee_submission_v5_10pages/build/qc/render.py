import sys, pymupdf
pdf, out, pages = sys.argv[1], sys.argv[2], sys.argv[3]
d = pymupdf.open(pdf)
for n in [int(x) for x in pages.split(",")]:
    d[n-1].get_pixmap(dpi=int(sys.argv[4]) if len(sys.argv)>4 else 70).save(f"{out}_p{n:02d}.png")

import sys, pymupdf
for f in sys.argv[1:]:
    d = pymupdf.open(f)
    print(f, "pages:", d.page_count, "size:", d[0].rect)
    for i, p in enumerate(d):
        blocks = p.get_text("blocks")
        ys = [b[3] for b in blocks if b[4].strip() and not b[4].strip().isdigit()]
        # lowest text in left and right columns
        mid = p.rect.width / 2
        L = max([b[3] for b in blocks if b[2] <= mid + 5 and b[4].strip() and not b[4].strip().isdigit()] or [0])
        R = max([b[3] for b in blocks if b[0] >= mid - 5 and b[4].strip() and not b[4].strip().isdigit()] or [0])
        print(f"  p{i+1}: words={len(p.get_text('words'))} images={len(p.get_images())} drawings={len(p.get_drawings())} bottomL={L:.0f} bottomR={R:.0f}")

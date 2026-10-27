"""Figures for the DentaMind AI IEEE paper, version 3 (2026-10-25): redesigned from scratch.

Design rules (all figures):
* black on white only; square-cornered blocks; 0.6 pt outlines, 1.1 pt for trained networks (legend in Fig. 1);
* dashed containers only for real groupings (e.g. deployed vs. offline-only);
* orthogonal connectors that leave and enter blocks at their centers; junction dots where lines branch;
* Times New Roman, 7.5 pt names, 7 pt details, nothing below 6.5 pt, drawn at the printed IEEE column width (3.45 in).
Content follows the manuscript and documents/dentist-research-figures/make_figures.py (same facts, thresholds and counts).
Schematic version: every figure is a vector block diagram; no photograph, screenshot or raster image is embedded.
Run:  python make_figures_v3.py <out_dir>
Writes figN_*.svg (text outlined, used in the DOCX), figN_*_editable.svg (text as text), .pdf, .png (600 dpi).
"""
import sys
from pathlib import Path

from PIL import ImageFont

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, Polygon, Rectangle
from matplotlib.transforms import Bbox

OUT = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
OUT.mkdir(parents=True, exist_ok=True)
plt.rcParams.update({"font.family": "serif", "font.serif": ["Times New Roman"], "mathtext.fontset": "stix",
                     "pdf.fonttype": 42, "svg.hashsalt": "dentamind"})

W = 3.45
TFS, FS, SFS = 7.5, 7.0, 6.6          # name, detail, small/label sizes (pt)
TLH = TFS * 1.32 / 72
LH = FS * 1.22 / 72
PAD = 0.045
LW, LWB, LWT = 0.6, 1.1, 0.35          # outline, trained network, thin rules
GAP = 0.15
DASH = (0, (3.5, 2))
K = "black"

_TNR = ImageFont.truetype("C:/Windows/Fonts/times.ttf", 100)


def tw(s, fs=FS):
    return _TNR.getlength(s) * fs / 100 / 72


def wrap(s, w, fs=FS):
    s = s.replace("≥ ", "≥ ").replace("< ", "< ")
    out = []
    for part in s.split("\n"):
        cur = ""
        for word in part.split(" "):
            cand = (cur + " " + word).strip()
            if cur and tw(cand, fs) > w - 0.09:
                out.append(cur)
                cur = word
            else:
                cur = cand
        out.append(cur)
    return out


def canvas(h):
    fig = plt.figure(figsize=(W, h))
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(0, W)
    ax.set_ylim(0, h)
    ax.axis("off")
    return fig, ax


def need(w, name=None, detail=""):
    n = len(wrap(detail, w)) if detail else 0
    return 2 * PAD + (TLH if name else 0) + n * LH


def block(ax, x, top, w, h, name=None, detail="", lw=LW, ls="-", align="center"):
    ax.add_patch(Rectangle((x, top - h), w, h, fc="white", ec=K, lw=lw, ls=ls, joinstyle="miter"))
    lines = wrap(detail, w) if detail else []
    gh = (TLH if name else 0) + len(lines) * LH
    y = top - (h - gh) / 2
    tx = x + w / 2 if align == "center" else x + 0.06
    if name:
        ax.text(tx, y - TLH / 2, name, fontsize=TFS, fontweight="bold", ha=align, va="center")
        y -= TLH
    for ln in lines:
        ax.text(tx, y - LH / 2, ln, fontsize=FS, ha=align, va="center")
        y -= LH
    return top - h


def blocks(ax, xs, top, w, specs, lw=LW):
    h = max(need(w, n, d) for n, d in specs)
    for x, (n, d) in zip(xs, specs):
        block(ax, x, top, w, h, n, d, lw=lw)
    return top - h


def grid(n, gap, x0=0.0, x1=W):
    w = (x1 - x0 - (n - 1) * gap) / n
    return [x0 + k * (w + gap) for k in range(n)], w


def arrow(ax, x1, y1, x2, y2):
    ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle="-|>,head_length=0.30,head_width=0.13", lw=LW, color=K,
                                shrinkA=0, shrinkB=0))


def poly(ax, xs, ys, lw=LW, ls="-"):
    ax.plot(xs, ys, color=K, lw=lw, ls=ls, solid_capstyle="butt", solid_joinstyle="miter")


def dot(ax, x, y):
    ax.add_patch(Circle((x, y), 0.017, fc=K, ec="none"))


def fan(ax, x0, y0, targets, ytop, drop=0.065):
    yb = y0 - drop
    poly(ax, [x0, x0], [y0, yb])
    poly(ax, [min(targets + [x0]), max(targets + [x0])], [yb, yb])
    if min(targets) < x0 < max(targets):
        dot(ax, x0, yb)
    for t in targets:
        arrow(ax, t, yb, t, ytop)


def merge(ax, sources, y0, x1, ytop, drop=0.065):
    yb = y0 - drop
    for s in sources:
        poly(ax, [s, s], [y0, yb])
    poly(ax, [min(sources + [x1]), max(sources + [x1])], [yb, yb])
    if min(sources) < x1 < max(sources):
        dot(ax, x1, yb)
    arrow(ax, x1, yb, x1, ytop)


def label(ax, x, y, s, fs=SFS, ha="left", style="italic", weight="normal", va="center"):
    ax.text(x, y, s, fontsize=fs, ha=ha, va=va, style=style, fontweight=weight)


def heading(ax, x, y, s):
    label(ax, x, y, s.upper(), fs=SFS, style="normal", weight="bold")


def table(ax, x, top, colx, rows, rh, header=None, lw_rule=LWT, bold_first=False):
    """Ruled table: colx = left edges (relative to x) of columns, last entry = right edge. Returns bottom y."""
    y = top
    n = len(rows) + (1 if header else 0)
    right = x + colx[-1]
    poly(ax, [x, right], [top, top], lw=LW)
    if header:
        for k, h in enumerate(header):
            ax.text(x + colx[k] + 0.05, y - rh / 2, h, fontsize=SFS + 0.4, fontweight="bold", va="center")
        y -= rh
        poly(ax, [x, right], [y, y], lw=LW)
    for i, r in enumerate(rows):
        for k, c in enumerate(r):
            ax.text(x + colx[k] + 0.05, y - rh / 2, c, fontsize=FS, va="center",
                    fontweight="bold" if (bold_first and k == 0) else "normal")
        y -= rh
        if i < len(rows) - 1:
            poly(ax, [x, right], [y, y], lw=lw_rule)
    poly(ax, [x, right], [y, y], lw=LW)
    return y


def save(fig, name, bottom, top=None):
    top = fig.get_figheight() if top is None else top
    bb = Bbox.from_extents(0, max(0, bottom - 0.03), W, top)
    with plt.rc_context({"svg.fonttype": "none"}):
        fig.savefig(OUT / f"{name}_editable.svg", bbox_inches=bb)
    with plt.rc_context({"svg.fonttype": "path"}):
        fig.savefig(OUT / f"{name}.svg", bbox_inches=bb)
    fig.savefig(OUT / f"{name}.pdf", bbox_inches=bb)
    fig.savefig(OUT / f"{name}.png", dpi=600, bbox_inches=bb)
    plt.close(fig)


# ================================================================== Fig. 1: layered system architecture
def fig1():
    H = 5.2
    fig, ax = canvas(H)
    cx = W / 2
    y = H - 0.02

    def tier(y, name, first=False):
        if not first:
            poly(ax, [0, W], [y, y], lw=LWT, ls=DASH)
        heading(ax, 0.0, y - 0.07, name)
        return y - 0.135

    t = tier(y, "Input", first=True)
    w = 2.1
    b = block(ax, cx - w / 2, t, w, need(w, "n", "d"), "Panoramic radiograph", "PNG or JPEG upload")
    sep = b - 0.075
    arrow(ax, cx, b, cx, sep - 0.15)
    t = tier(sep, "Pipeline (back end)")
    b = block(ax, 0, t, W, need(W, "n", "d"), "Pre-processing", "intensity scaling to [0, 1]; image-quality flags")
    arrow(ax, cx, b, cx, b - 0.11)
    w = 2.1
    b = block(ax, cx - w / 2, b - 0.11, w, need(w, "n", "d"), "Tooth detector", "Faster R-CNN, ResNet-50 FPN", lw=LWB)
    xs, bw = grid(3, 0.09)
    tt = b - 0.13 - 0.11
    fan(ax, cx, b, [x + bw / 2 for x in xs], tt, drop=0.13)
    label(ax, cx + 0.04, b - 0.06, "tooth boxes", ha="left")
    b = blocks(ax, xs, tt, bw, [("FDI numbering", "Faster R-CNN, 32 FDI classes"),
                                ("Segmentation", "Mask R-CNN, ResNet-50 FPN"),
                                ("Finding classifier", "ResNet-50, four finding classes")], lw=LWB)
    tt = b - 0.065 - 0.11
    merge(ax, [x + bw / 2 for x in xs], b, cx, tt)
    b = block(ax, 0, tt, W, need(W, "n", "d"), "Uncertainty signals per region",
              "entropy, flip disagreement, mask and box instability")
    arrow(ax, cx, b, cx, b - 0.11)
    w = 2.5
    b = block(ax, cx - w / 2, b - 0.11, w, need(w, "n", "d"), "Region records and final result", "stored in SQLite")
    sep = b - 0.075
    xs2, ow = grid(2, 0.14)
    t = tier(sep, "Services")
    fan(ax, cx, b, [x + ow / 2 for x in xs2], t, drop=0.045)
    b = blocks(ax, xs2, t, ow, [("Report drafting", "English, Hindi and Marathi templates; evidence validator"),
                                ("Human review", "confirm, correct or reject; second approver")])
    sep = b - 0.075
    t = tier(sep, "Interface (front end)")
    merge(ax, [x + ow / 2 for x in xs2], b, cx, t, drop=0.045)
    b = block(ax, 0, t, W, need(W, "n", "d"), "Web interface",
              "radiograph overlay, region review, report preview, final result")
    # legend
    ly = b - 0.1
    ax.add_patch(Rectangle((W - 1.12, ly - 0.035), 0.16, 0.07, fc="white", ec=K, lw=LWB))
    label(ax, W - 0.92, ly, "trained network", style="normal")
    save(fig, "fig1_architecture", ly - 0.06)


# ================================================================== Fig. 2: workflow as a phase-grouped step table
def fig2():
    """Ten implemented pipeline steps (PipelineService.run) as numbered blocks, two columns read top to bottom."""
    steps = [("Pre-process", "intensity scaling; quality flags"), ("Detect", "tooth boxes, score \u2265 0.3"),
             ("Number", "FDI code or \u2018unassigned\u2019"), ("Segment", "instance masks (optional)"),
             ("Match", "mask \u2194 box, IoU \u2265 0.5"), ("Classify", "softmax over the 4 classes"),
             ("Classify, flipped", "same crops, mirrored"), ("Flip passes", "detector and segmenter, mirrored image"),
             ("Region records", "signals, flags, review need"), ("Final result", "top class per tooth")]
    H = 5.0
    fig, ax = canvas(H)
    nb, g, cg = 0.2, 0.1, 0.3
    cw = (W - cg) / 2
    xs = [0.0, cw + cg]
    bh = max(need(cw - nb, n, d) for n, d in steps)
    top0 = H - 0.14
    tops = []
    for k, (n, d) in enumerate(steps):
        c, r = divmod(k, 5)
        x, t = xs[c], top0 - r * (bh + g)
        ax.add_patch(Rectangle((x, t - bh), cw, bh, fc="white", ec=K, lw=LW))
        poly(ax, [x + nb, x + nb], [t, t - bh], lw=LWT)
        ax.text(x + nb / 2, t - bh / 2, str(k + 1), fontsize=TFS, fontweight="bold", ha="center", va="center")
        lines = wrap(d, cw - nb)
        y = t - (bh - (TLH + len(lines) * LH)) / 2
        ax.text(x + nb + 0.06, y - TLH / 2, n, fontsize=TFS, fontweight="bold", va="center")
        y -= TLH
        for ln in lines:
            ax.text(x + nb + 0.06, y - LH / 2, ln, fontsize=FS, va="center")
            y -= LH
        if r < 4:
            arrow(ax, x + cw / 2, t - bh, x + cw / 2, t - bh - g)
        tops.append((x, t))
    x5, t5 = tops[4]
    x6, t6 = tops[5]
    xm = cw + cg / 2
    y5 = t5 - bh / 2
    poly(ax, [cw, xm], [y5, y5])
    poly(ax, [xm, xm], [y5, t6 + 0.07])
    poly(ax, [xm, x6 + cw / 2], [t6 + 0.07, t6 + 0.07])
    arrow(ax, x6 + cw / 2, t6 + 0.07, x6 + cw / 2, t6)
    x10, t10 = tops[9]
    yb = t10 - bh
    t = yb - 0.065 - 0.11
    xo, ow = grid(2, 0.14)
    fan(ax, x10 + cw / 2, yb, [x + ow / 2 for x in xo], t)
    b = blocks(ax, xo, t, ow, [("Report draft", "status: unconfirmed draft"),
                               ("Review queue", "images ordered by combined score S")])
    note = ("Every step is timed and records its status. A step whose model is missing is reported as \u2018unavailable\u2019, "
            "a crashed step as \u2018failed\u2019; steps that do not depend on it still run, and a missing signal is never set to zero.")
    b = block(ax, 0, b - 0.1, W, need(W, None, note), None, note, ls=DASH, align="left")
    save(fig, "fig2_workflow", b)


# ================================================================== Fig. 3: numbering / matching (a) and FDI chart (b)
TOOTH_W = {1: 0.95, 2: 0.8, 3: 0.85, 4: 0.85, 5: 0.85, 6: 1.25, 7: 1.15, 8: 1.05}


def fdi_chart(ax, x0, x1, top):
    seq = [8, 7, 6, 5, 4, 3, 2, 1] + [1, 2, 3, 4, 5, 6, 7, 8]
    gapu = 0.14
    unit = (x1 - x0) / (sum(TOOTH_W[n] for n in seq) + 15 * gapu + 0.3)
    gap = gapu * unit
    th = 0.27
    mid = None
    yu = top - 0.17
    yl = yu - th - 0.16
    for y, (qL, qR) in ((yu, (1, 2)), (yl, (4, 3))):
        x = x0
        for k, n in enumerate(seq):
            if k == 8:
                mid = x + 0.15 * unit - gap / 2
                x += 0.3 * unit
            w = TOOTH_W[n] * unit
            ax.add_patch(Rectangle((x, y - th), w, th, fc="white", ec=K, lw=0.5))
            ax.text(x + w / 2, y - th / 2, f"{qL if k < 8 else qR}{n}", fontsize=5.6, ha="center", va="center")
            x += w + gap
    ym = (yu - th + yl) / 2
    poly(ax, [mid, mid], [yu + 0.05, yl - th - 0.05], lw=LWT, ls=DASH)
    poly(ax, [x0, x1], [ym, ym], lw=LWT, ls=DASH)
    for xx, yy, s in (((x0 + mid) / 2, yu + 0.085, "Quadrant 1 (upper right)"), ((mid + x1) / 2, yu + 0.085, "Quadrant 2 (upper left)"),
                      ((x0 + mid) / 2, yl - th - 0.085, "Quadrant 4 (lower right)"), ((mid + x1) / 2, yl - th - 0.085, "Quadrant 3 (lower left)")):
        label(ax, xx, yy, s, ha="center")
    ax.text(x0 - 0.04, ym, "R", fontsize=TFS, fontweight="bold", ha="right", va="center")
    ax.text(x1 + 0.04, ym, "L", fontsize=TFS, fontweight="bold", ha="left", va="center")
    return yl - th - 0.15


def fig3():
    H = 4.6
    fig, ax = canvas(H)
    top = H - 0.02
    x0 = 0.2
    ax.text(0.0, top - 0.06, "(a)", fontsize=TFS, fontweight="bold", va="center")
    xs, cw = grid(3, 0.1, x0, W)
    c = [x + cw / 2 for x in xs]
    b = blocks(ax, xs, top, cw, [("Numbering model", "Faster R-CNN, 32 FDI classes; best box per code"),
                                 ("Tooth detector", "one class \u2018tooth\u2019; score \u2265 0.3"),
                                 ("Segmentation model", "Mask R-CNN instance masks")], lw=LWB)
    y1, y2 = b - 0.06, b - 0.12                     # two bus levels keep the branches separate
    t = b - 0.2
    xa = (xs[0] + xs[1] + cw) / 2                   # number assignment spans columns 1-2
    poly(ax, [c[0], c[0]], [b, y1])
    poly(ax, [c[1], c[1]], [b, y2])
    poly(ax, [c[0], c[1]], [y1, y1])
    dot(ax, c[1], y1)
    arrow(ax, xa, y1, xa, t)
    dot(ax, xa, y1)
    poly(ax, [c[1], c[2]], [y2, y2])
    poly(ax, [c[2], c[2]], [b, y2])
    dot(ax, c[2], y2)
    arrow(ax, c[2], y2, c[2], t)
    wa = 2 * cw + 0.1
    ha = need(wa, "n", "in score order, each box takes the unused numbering box of highest IoU \u2265 0.5; otherwise \u2018unassigned\u2019")
    ba = block(ax, xs[0], t, wa, ha, "Number assignment",
               "in score order, each box takes the unused numbering box of highest IoU \u2265 0.5; otherwise \u2018unassigned\u2019")
    arrow(ax, xa, ba, xa, ba - GAP)
    hc = need(wa, "n", "flag if a code is duplicated, confidence < 0.5, or side / arch disagrees with the quadrant; no number is forced")
    bc = block(ax, xs[0], ba - GAP, wa, hc, "Consistency check",
               "flag if a code is duplicated, confidence < 0.5, or side / arch disagrees with the quadrant; no number is forced")
    block(ax, xs[2], t, cw, t - bc, "Mask matching", "one-to-one with detector boxes, IoU \u2265 0.5")
    tt = bc - 0.065 - 0.11
    cxr = (x0 + W) / 2
    merge(ax, [xa, c[2]], bc, cxr, tt)
    b = block(ax, x0, tt, W - x0, need(W - x0, "n", "d"), "Region record", "tooth box, FDI code or \u2018unassigned\u2019, mask, flags")
    t = b - 0.17
    ax.text(0.0, t - 0.06, "(b)", fontsize=TFS, fontweight="bold", va="center")
    b = fdi_chart(ax, x0 + 0.12, W - 0.14, t)
    save(fig, "fig3_detection_numbering_segmentation", b)


# genuine model output (written by run_genuine_overlay.py from the deployed checkpoints)
PALETTE = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#17becf", "#bcbd22", "#7f7f7f"]


def overlay_panel(ax, x0, x1, top):
    import json
    import numpy as np
    from PIL import Image
    from matplotlib.colors import to_rgb
    root = Path(__file__).resolve().parents[3]
    sys.path[:0] = [str(root / "src")]
    from dentexmodel.utils.geometry import rle_to_mask
    data = json.loads((OUT / "fig3b_genuine_output.json").read_text(encoding="utf-8"))
    regs = data["regions"]
    img = np.asarray(Image.open(root / data["summary"]["image"]).convert("L"), dtype=np.float32) / 255.0
    bx = np.array([r["box"] for r in regs])
    m = 0.035 * (bx[:, 2].max() - bx[:, 0].min())
    cx0, cx1 = int(max(0, bx[:, 0].min() - m)), int(min(img.shape[1], bx[:, 2].max() + m))
    cy0, cy1 = int(max(0, bx[:, 1].min() - 2.2 * m)), int(min(img.shape[0], bx[:, 3].max() + 2.2 * m))
    rgb = np.repeat(img[cy0:cy1, cx0:cx1, None], 3, axis=2)
    order = sorted(range(len(regs)), key=lambda i: (bx[i, 0] + bx[i, 2]) / 2)
    col = {i: PALETTE[k % len(PALETTE)] for k, i in enumerate(order)}
    for i, r in enumerate(regs):
        if r["mask_rle"]:
            mk = rle_to_mask(r["mask_rle"])[cy0:cy1, cx0:cx1].astype(bool)
            rgb[mk] = 0.62 * rgb[mk] + 0.38 * np.array(to_rgb(col[i]))
    wpx, hpx = cx1 - cx0, cy1 - cy0
    wi = x1 - x0
    hi = wi * hpx / wpx
    ax.imshow(rgb, extent=(x0, x1, top - hi, top), interpolation="lanczos", zorder=1)
    ax.add_patch(Rectangle((x0, top - hi), wi, hi, fc="none", ec=K, lw=LW, zorder=3))
    X = lambda px: x0 + (px - cx0) / wpx * wi
    Y = lambda py: top - (py - cy0) / hpx * hi
    ymid = np.median((bx[:, 1] + bx[:, 3]) / 2)
    LBH = 0.085                                       # label height incl. padding (in)
    placed = []                                       # (x_left, x_right, y_anchor) of labels already drawn
    for i in sorted(range(len(regs)), key=lambda i: (bx[i, 0] + bx[i, 2]) / 2):
        r = regs[i]
        a, b_, c, d = r["box"]
        ax.add_patch(Rectangle((X(a), Y(d)), X(c) - X(a), Y(b_) - Y(d), fc="none", ec=col[i], lw=0.35, zorder=2))
        if r["fdi"] is None:
            txt, fc = "u", "#555555"
        elif r["numbering_status"] != "assigned":
            txt, fc = f"{r['fdi']}?", "#c62828"
        else:
            txt, fc = str(r["fdi"]), "black"
        upper = (b_ + d) / 2 < ymid
        xc = X((a + c) / 2)
        half = tw(txt, 5.0) / 2 + 0.03
        y = Y(b_) + 0.03 if upper else Y(d) - 0.03
        step = LBH if upper else -LBH
        while any(xl < xc + half and xc - half < xr and abs(y - yo) < LBH for xl, xr, yo in placed):
            y += step                                 # stack instead of overlapping a neighbour's label
        placed.append((xc - half, xc + half, y))
        ax.text(xc, y, txt, fontsize=5.0, color="white", ha="center", va="bottom" if upper else "top", zorder=4,
                bbox=dict(boxstyle="square,pad=0.12", fc=fc, ec="none"))
    yl = top - hi - 0.085
    items = [[("black", "14", "FDI number from the numbering model")],
             [("#c62828", "41?", "number flagged for review"), ("#555555", "u", "no number assigned")]]
    for line_items in items:
        xx = x0
        for fc, s, t in line_items:
            ax.text(xx, yl, s, fontsize=5.0, color="white", va="center", bbox=dict(boxstyle="square,pad=0.12", fc=fc, ec="none"))
            xx += tw(s, 5.0) + 0.06
            ax.text(xx, yl, t, fontsize=SFS - 0.4, va="center")
            xx += tw(t, SFS - 0.4) + 0.14
        yl -= 0.12
    return yl + 0.06


# ================================================================== Fig. 4: classification workflow
def class_crops(classes):
    """One genuine ground-truth training crop per class, cut with the classifier's own rule (trainers.crop_region:
    10 % padding, 224 px). The example is the training box whose area is closest to its class median (deterministic)."""
    import csv
    import numpy as np
    from PIL import Image
    root = Path(__file__).resolve().parents[3]
    sys.path[:0] = [str(root / "src")]
    from dentexmodel.training.trainers import crop_region
    rows = [r for r in csv.DictReader(open(root / "Data/splits/combined_train.csv", encoding="utf-8"))
            if r["source_dataset"].startswith("dentex_train_disease") and r["split"] == "train"]
    out, log = {}, []
    for cname in classes:
        rs = [r for r in rows if r["target_class"] == cname]
        area = lambda r: (lambda b: b[2] * b[3])([float(v) for v in r["bbox_xywh"].strip("[]").split(",")])
        med = float(np.median([area(r) for r in rs]))
        r = min(rs, key=lambda r: (abs(area(r) - med), r["sample_id"]))
        x, y, w, h = (float(v) for v in r["bbox_xywh"].strip("[]").split(","))
        img = np.asarray(Image.open(root / "Data" / r["image_path"]).convert("RGB"))
        out[cname] = crop_region(img, [x, y, x + w, y + h], 224)[:, :, 0]
        log.append({"class": cname, "sample_id": r["sample_id"], "image": r["image_path"], "split": r["split"], "bbox_xywh": [x, y, w, h]})
    import json
    (OUT / "fig4_crop_sources.json").write_text(json.dumps(log, indent=1), encoding="utf-8")
    return out


def fig4():
    """Finding classification as a block chain: tooth box -> crop -> resize -> normalize -> ResNet-50 -> softmax -> 4 classes."""
    H = 3.6
    fig, ax = canvas(H)
    top = H - 0.02
    xs, bw = grid(3, 0.17)
    row1 = [("Tooth box", "detector box (application) or GT box (evaluation)"),
            ("Crop", "box + 10 % padding on each side"),
            ("Resize", "224 \u00d7 224 px, bilinear")]
    row2 = [("Normalize", "ImageNet mean and SD per channel"),
            ("ResNet-50", "ImageNet-initialized; new 4-way output layer"),
            ("Softmax", "4 class scores; arg max = class")]
    b1 = blocks(ax, xs, top, bw, row1)
    ym = (top + b1) / 2
    for k in range(2):
        arrow(ax, xs[k] + bw, ym, xs[k + 1], ym)
    yr = b1 - 0.09
    t2 = yr - 0.1
    poly(ax, [xs[2] + bw / 2, xs[2] + bw / 2], [b1, yr])
    poly(ax, [xs[2] + bw / 2, xs[0] + bw / 2], [yr, yr])
    arrow(ax, xs[0] + bw / 2, yr, xs[0] + bw / 2, t2)
    h2 = max(need(bw, n, d) for n, d in row2)
    for x, (n, d) in zip(xs, row2):
        block(ax, x, t2, bw, h2, n, d, lw=LWB if n == "ResNet-50" else LW)
    b2 = t2 - h2
    ym2 = (t2 + b2) / 2
    for k in range(2):
        arrow(ax, xs[k] + bw, ym2, xs[k + 1], ym2)
    cls = [("Caries", "1,550", "0.41"), ("Deep Caries", "438", "1.44"), ("Impacted", "412", "1.53"),
           ("Periapical Lesion", "120", "5.25")]
    xc, cw = grid(4, 0.07)
    t3 = b2 - 0.065 - 0.11
    fan(ax, xs[2] + bw / 2, b2, [x + cw / 2 for x in xc], t3)
    b3 = blocks(ax, xc, t3, cw, [(n, f"{c} crops\nweight {w}") for n, c, w in cls])
    label(ax, W / 2, b3 - 0.085, "training crops per class; weight w = N / (K n), N = 2,520, K = 4", ha="center", style="normal")
    note = ("No healthy class: DENTEX labels only teeth that carry a finding, so the model always selects the closest of the "
            "four annotated findings, one label per tooth. Scores are raw softmax values, not calibrated probabilities.")
    b = block(ax, 0, b3 - 0.17, W, need(W, None, note), None, note, ls=DASH, align="left")
    save(fig, "fig4_classification", b)


# ================================================================== Fig. 5: uncertainty, abstention and review routing
def fig5():
    H = 4.3
    fig, ax = canvas(H)
    top = H - 0.02
    heading(ax, 0.0, top - 0.06, "Deployed in the application")
    rh = 0.148
    cols = [0.0, 1.22, 2.02, W]
    rows = [("normalized entropy", "\u2265 0.397", "\u2018abstained\u2019"),
            ("flip disagreement", "\u2265 0.076", "\u2018unstable under flip\u2019"),
            ("mask instability", "\u2265 0.30", "\u2018mask unstable\u2019"),
            ("detection score", "< 0.50", "\u2018low detection score\u2019"),
            ("numbering check", "issue / no number", "numbering flag")]
    t0 = top - 0.14
    b = table(ax, 0, t0, cols, rows, rh, header=["Signal per region", "Threshold", "Flag (sent to review)"])
    for x in cols[1:-1]:
        poly(ax, [x, x], [t0, b], lw=LWT)
    # routing
    xl, wl = 0.0, 1.32
    xr0, wr = 1.5, W - 1.5
    cl, cr = xl + wl / 2, xr0 + wr / 2
    t = b - 0.2
    arrow(ax, cl, b, cl, t)
    arrow(ax, cr, b, cr, t)
    label(ax, cl + 0.04, b - 0.095, "every region")
    label(ax, cr + 0.04, b - 0.095, "flagged regions")
    specs = [("Review queue", "images ordered by combined score S"),
             ("Human review", "confirm, correct or reject"),
             ("Second approver", "only approved records are exportable")]
    yy = t
    for k, (n, d) in enumerate(specs):
        bb = block(ax, xr0, yy, wr, need(wr, n, d), n, d)
        if k < 2:
            arrow(ax, cr, bb, cr, bb - 0.09)
            yy = bb - 0.09
    rb = bb
    block(ax, xl, t, wl, t - rb, "Final result",
          "top class and raw score; marked \u2018needs human review\u2019 if flagged; never reported as healthy when abstained")
    # offline panel
    t = rb - 0.13
    body = ["temperature scaling, T = 0.95 (calibration split); app scores stay raw",
            "33 alternative abstention rules; the best candidate failed on validation",
            "retraining with approved reviews: implemented, never run"]
    lines = []
    for s in body:
        ww = wrap(s, W - 0.2)
        lines += [("\u2022 " if i == 0 else "   ") + l for i, l in enumerate(ww)]
    hbox = 0.16 + len(lines) * LH + 0.06
    ax.add_patch(Rectangle((0, t - hbox), W, hbox, fc="none", ec=K, lw=LW, ls=DASH))
    heading(ax, 0.06, t - 0.08, "Evaluated offline only (not deployed)")
    for k, l in enumerate(lines):
        ax.text(0.08, t - 0.16 - (k + 0.5) * LH, l, fontsize=FS, va="center")
    save(fig, "fig5_uncertainty_review", t - hbox)


# ================================================================== Fig. 6: dataset, split and leakage protocol
def fig6():
    """Data protocol: pixel-hash grouping -> seeded split -> four splits -> leakage checks -> protected test evaluation."""
    H = 5.6
    fig, ax = canvas(H)
    top = H - 0.02
    cx = W / 2
    d = "labeled: quadrant 693, enumeration 634, enumeration-disease 705; excluded: official test set, 50 demo images"
    b = block(ax, 0, top, W, need(W, "n", d), "DENTEX: 3,653 PNG files, 2,716 distinct radiographs", d)
    t = b - 0.17
    arrow(ax, cx, b, cx, t)
    label(ax, cx + 0.05, b - 0.085, "1,133 distinct labeled radiographs")
    d = "identical films (same SHA-256 of pixels) form one group and always share a split"
    b = block(ax, 0, t, W, need(W, "n", d), "Group by pixel hash", d)
    arrow(ax, cx, b, cx, b - 0.12)
    d = "seed 42; proportions 0.70 / 0.10 / 0.10 / 0.10; assignments are append-only"
    b = block(ax, 0, b - 0.12, W, need(W, "n", d), "Seeded group split", d)
    xs, sw = grid(4, 0.07)
    t = b - 0.065 - 0.11
    fan(ax, cx, b, [x + sw / 2 for x in xs], t)
    b = blocks(ax, xs, t, sw, [("Train", "794 films; fit weights"), ("Validation", "113 films; epoch choice, metrics"),
                               ("Calibration", "113 films; thresholds, temperature"), ("Test", "113 films; final metrics only")])
    lw_ = xs[2] + sw
    t = b - 0.065 - 0.11
    merge(ax, [x + sw / 2 for x in xs[:3]], b, xs[1] + sw / 2, t)
    d = ("file-hash overlap, all split pairs: 0; training / epoch-selection films vs. test: 0; "
         "near duplicates (pixel correlation \u2265 0.97): 0 confirmed")
    bl = block(ax, 0, t, lw_, need(lw_, "n", d), "Duplicate and leakage checks", d)
    t2 = bl - 0.13
    arrow(ax, xs[1] + sw / 2, bl, xs[1] + sw / 2, t2)
    tx = xs[3] + sw / 2
    arrow(ax, tx, b, tx, t2)
    d = ("explicit flag, named authorizer, written reason and a validation report for the same checkpoint; "
         "each run appended to a hash-chained ledger; repeated runs refused")
    b = block(ax, 0, t2, W, need(W, "n", d), "Protected test evaluation", d, lw=LWB)
    note = ("Not checkable: two different films of the same patient. DENTEX has no patient identifiers, so patient-level "
            "leakage cannot be excluded. The test split was used once per deployed model (2026-10-14).")
    b = block(ax, 0, b - 0.1, W, need(W, None, note), None, note, ls=DASH, align="left")
    save(fig, "fig6_dataset_splits", b)


# ================================================================== Fig. 7: evaluation framework (task x split matrix)
def fig7():
    groups = [("Models", [("Tooth detection", "mAP, AP50, P / R @ 0.3", "VT"),
                          ("Segmentation", "box / mask AP50, IoU, Dice", "VT"),
                          ("FDI numbering", "AP50, coverage, accuracy", "VT"),
                          ("Classification, GT crops", "P / R / F1, macro-F1, AUC", "VT")]),
              ("System", [("End-to-end, detector crops", "matched / missed, macro-F1", "V"),
                          ("Calibration, uncertainty", "ECE, Brier score, AUROC", "CT"),
                          ("Abstention rules", "coverage, risk, macro-F1", "VC")]),
              ("Studies", [("Active learning", "macro-F1 per label budget", "V"),
                           ("Classifier variants", "paired macro-F1, 5 seeds", "V"),
                           ("Leakage check", "overlaps, all split pairs", "VCTA"),
                           ("Inference benchmark", "latency, peak memory", "B")])]
    rh = 0.14
    n = sum(len(r) for _, r in groups)
    H = 0.05 + rh * (n + 1) + len(groups) * 0.7 * rh + 0.06
    fig, ax = canvas(H)
    span_top = None
    cols = [0.0, 1.25, 2.6, 2.88, 3.16, W]
    y = H - 0.02
    top = y
    poly(ax, [0, W], [y, y], lw=LW)
    for k, h in enumerate(["Task", "Metrics", "Val.", "Cal.", "Test"]):
        ax.text(cols[k] + (0.05 if k < 2 else (cols[k + 1] - cols[k]) / 2), y - rh / 2, h, fontsize=SFS + 0.4,
                fontweight="bold", va="center", ha="left" if k < 2 else "center")
    y -= rh
    poly(ax, [0, W], [y, y], lw=LW)
    for gi, (g, rows) in enumerate(groups):
        ax.text(0.05, y - rh * 0.4, g.upper(), fontsize=SFS - 0.4, fontweight="bold", va="center")
        y -= rh * 0.7
        for r in rows:
            name, met, sp = r
            ax.text(0.12, y - rh / 2, name, fontsize=FS, va="center")
            ax.text(cols[1] + 0.05, y - rh / 2, met, fontsize=FS, va="center")
            if sp == "B":
                span_top = y
                ax.text((cols[2] + W) / 2, y - rh / 2, "10 images", fontsize=FS, ha="center", va="center")
            else:
                for k, ch in enumerate("VCT"):
                    if ch in sp:
                        ax.add_patch(Circle(((cols[2 + k] + cols[3 + k]) / 2, y - rh / 2), 0.03, fc=K, ec="none"))
            y -= rh
        if gi < len(groups) - 1:
            poly(ax, [0, W], [y, y], lw=LWT)
    poly(ax, [0, W], [y, y], lw=LW)
    poly(ax, [cols[2], cols[2]], [top, y], lw=LWT)
    for x in cols[3:5]:
        poly(ax, [x, x], [top, span_top], lw=LWT)
    save(fig, "fig7_evaluation_framework", y)


if __name__ == "__main__":
    for f in (fig1, fig2, fig3, fig4, fig5, fig6, fig7):
        f()
    print("figures written to", OUT)

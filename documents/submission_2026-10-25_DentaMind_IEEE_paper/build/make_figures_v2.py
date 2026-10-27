"""Redrawn diagrams for the submission copy of the DentaMind AI IEEE paper (2026-10-25).

Same content as documents/dentist-research-figures/make_figures.py, redrawn with one consistent style:
* every box has a gray title band and a white body; boxes in a row share one height;
* connectors are orthogonal and leave or enter boxes at their centers;
* labels use plain language instead of code identifiers;
* Fig. 3b is a drawn FDI tooth chart instead of an application screenshot.
Printed size: IEEE single column, 3.45 in wide; text 7-8 pt Times; grayscale only.
Run:  python make_figures_v2.py <out_dir>   -> figN_*.svg / .pdf / .png (600 dpi), same names as the originals.
"""
import sys
from pathlib import Path

from PIL import ImageFont

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, Rectangle, Circle
from matplotlib.transforms import Bbox

OUT = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
OUT.mkdir(parents=True, exist_ok=True)
plt.rcParams.update({"font.family": "serif", "font.serif": ["Times New Roman", "Times", "DejaVu Serif"],
                     "mathtext.fontset": "stix", "pdf.fonttype": 42})

W = 3.45
FS = 7.2              # body text (pt)
TFS = 7.6             # box titles (pt)
LH = FS * 1.25 / 72   # body line height (in)
TH = TFS * 1.75 / 72  # title band height (in)
PAD = 0.04
LW = 0.6
BAND = "0.86"         # title band
SOFT = "0.95"         # light emphasis fill
GAP = 0.14            # vertical gap for arrows
DASH = (0, (3, 2))
R = 0.035             # corner radius

_TNR = ImageFont.truetype("C:/Windows/Fonts/times.ttf", 100)
_TNRB = ImageFont.truetype("C:/Windows/Fonts/timesbd.ttf", 100)


def tw(s, fs=FS, bold=False):
    return (_TNRB if bold else _TNR).getlength(s) * fs / 100 / 72


def wrap(s, w, fs=FS):
    avail = w - 0.1
    out = []
    for part in s.split("\n"):
        cur = ""
        for word in part.split(" "):
            cand = (cur + " " + word).strip()
            if cur and tw(cand, fs) > avail:
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


def need(w, title=None, body=""):
    """Height a box needs for its text."""
    n = len(wrap(body, w)) if body else 0
    return (TH if title else 0) + (2 * PAD + n * LH if body else 0)


def box(ax, x, top, w, h, title=None, body="", fill="white", ls="-", band=BAND, align="center"):
    """Rounded box with an optional gray title band; body text centered in the remaining height. Returns bottom y."""
    y = top - h
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle=f"round,pad=0,rounding_size={R}", fc=fill, ec="none"))
    if title:
        clip = FancyBboxPatch((x, y), w, h, boxstyle=f"round,pad=0,rounding_size={R}", fc="none", ec="none")
        ax.add_patch(clip)
        r = Rectangle((x, top - TH), w, TH, fc=band, ec="none")
        ax.add_patch(r)
        r.set_clip_path(clip)
        if body:
            ax.plot([x, x + w], [top - TH, top - TH], color="black", lw=0.35)
        ax.text(x + w / 2, top - TH / 2, title, fontsize=TFS, fontweight="bold", ha="center", va="center")
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle=f"round,pad=0,rounding_size={R}", fc="none", ec="black",
                                lw=LW, ls=ls))
    if body:
        lines = wrap(body, w)
        area_top = top - (TH if title else 0)
        mid = (area_top + y) / 2
        y0 = mid + (len(lines) - 1) * LH / 2
        tx = x + w / 2 if align == "center" else x + 0.07
        for k, ln in enumerate(lines):
            ax.text(tx, y0 - k * LH, ln, fontsize=FS, ha=align, va="center")
    return y


def row(ax, xs, top, w, specs, fill="white", fills=None):
    """A row of equal-height boxes. specs = [(title, body)]. Returns the common bottom y."""
    h = max(need(w, t, b) for t, b in specs)
    for k, (x, (t, b)) in enumerate(zip(xs, specs)):
        box(ax, x, top, w, h, t, b, fill=(fills[k] if fills else fill))
    return top - h


def arrow(ax, x1, y1, x2, y2):
    ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle="-|>,head_length=0.32,head_width=0.16", lw=LW, color="black",
                                shrinkA=0, shrinkB=0))


def line(ax, xs, ys, lw=LW, ls="-"):
    ax.plot(xs, ys, color="black", lw=lw, ls=ls, solid_capstyle="butt")


def fan(ax, x0, y0, targets, ytop, drop=0.07):
    """Orthogonal fan-out from (x0, y0) down to the tops (ytop) of boxes centered at targets."""
    yb = y0 - drop
    line(ax, [x0, x0], [y0, yb])
    line(ax, [min(targets + [x0]), max(targets + [x0])], [yb, yb])
    for tx in targets:
        arrow(ax, tx, yb, tx, ytop)


def merge(ax, sources, y0, x1, ytop, drop=0.07):
    """Orthogonal merge from box bottoms at sources (y0) into one box top at x1."""
    yb = y0 - drop
    for sx in sources:
        line(ax, [sx, sx], [y0, yb])
    line(ax, [min(sources + [x1]), max(sources + [x1])], [yb, yb])
    arrow(ax, x1, yb, x1, ytop)


def grid(n, gap, x0=0.0, x1=W):
    w = (x1 - x0 - (n - 1) * gap) / n
    return [x0 + k * (w + gap) for k in range(n)], w


def save(fig, name, bottom):
    bb = Bbox.from_extents(0, max(0, bottom - 0.03), W, fig.get_figheight())
    with plt.rc_context({"svg.fonttype": "path"}):
        fig.savefig(OUT / f"{name}.svg", bbox_inches=bb)
    fig.savefig(OUT / f"{name}.pdf", bbox_inches=bb)
    fig.savefig(OUT / f"{name}.png", dpi=600, bbox_inches=bb)
    plt.close(fig)


# ------------------------------------------------------------------ Fig. 1: overall architecture
def fig1():
    H = 4.6
    fig, ax = canvas(H)
    cx = W / 2
    top = H - 0.02
    b = box(ax, 0.55, top, W - 1.1, need(W - 1.1, None, "x"), body="Panoramic X-ray upload (PNG or JPEG)")
    frame_top = b - GAP
    arrow(ax, cx, b, cx, frame_top)
    ax.text(0.1, frame_top - 0.085, "Back-end analysis pipeline (FastAPI)", fontsize=7, style="italic", va="center")
    inner0, inner1 = 0.1, W - 0.1
    t = frame_top - 0.17
    b = box(ax, inner0, t, inner1 - inner0, need(2.5, "Pre-processing", "x"), "Pre-processing",
            "intensity scaling to [0, 1] and image-quality checks", fill=SOFT)
    arrow(ax, cx, b, cx, b - GAP)
    w = 2.0
    b = box(ax, cx - w / 2, b - GAP, w, need(w, "Tooth detection", "x"), "Tooth detection",
            "Faster R-CNN, ResNet-50 FPN")
    xs, bw = grid(3, 0.08, inner0, inner1)
    t = b - 0.07 - GAP + 0.05
    fan(ax, cx, b, [x + bw / 2 for x in xs], t)
    b = row(ax, xs, t, bw, [("FDI numbering", "Faster R-CNN, 32 tooth codes"),
                            ("Segmentation", "Mask R-CNN, one mask per tooth"),
                            ("Finding classifier", "ResNet-50, four finding classes")])
    t = b - 0.07 - GAP + 0.05
    merge(ax, [x + bw / 2 for x in xs], b, cx, t)
    b = box(ax, inner0, t, inner1 - inner0, need(2.5, "U", "x"), "Uncertainty signals per tooth",
            "entropy, flip disagreement, mask and box instability", fill=SOFT)
    arrow(ax, cx, b, cx, b - GAP)
    w = 2.6
    b = box(ax, cx - w / 2, b - GAP, w, need(w, None, "x"), body="Per-tooth result and region records (SQLite)")
    frame_bot = b - 0.09
    ax.add_patch(FancyBboxPatch((0.03, frame_bot), W - 0.06, frame_top - frame_bot,
                                boxstyle=f"round,pad=0,rounding_size={R}", fc="none", ec="black", lw=LW, ls=DASH))
    xs2, ow = grid(2, 0.12, inner0, inner1)
    t = frame_bot - GAP
    fan(ax, cx, b, [x + ow / 2 for x in xs2], t, drop=0.045)
    b = row(ax, xs2, t, ow, [("Report drafting", "English, Hindi and Marathi templates"),
                             ("Human review", "confirm, correct or reject; second approver")])
    t = b - 0.07 - GAP + 0.05
    merge(ax, [x + ow / 2 for x in xs2], b, cx, t)
    b = box(ax, inner0, t, inner1 - inner0, need(3.0, "W", "x"), "Web interface (React)",
            "X-ray overlay, region review, report preview, final result")
    save(fig, "fig1_architecture", b)


# ------------------------------------------------------------------ Fig. 2: processing workflow
def fig2():
    steps = [("Pre-process", "scaling, quality checks"), ("Detect teeth", "boxes with score \u2265 0.3"),
             ("Number teeth", "FDI code or \u2018unassigned\u2019"), ("Segment teeth", "instance masks (optional)"),
             ("Match masks", "mask \u2194 box, IoU \u2265 0.5"), ("Classify findings", "softmax over 4 classes"),
             ("Flip test, classifier", "same crops, mirrored"), ("Flip test, detection", "mirrored image"),
             ("Region records", "signals, flags, review need"), ("Final result", "top class per tooth")]
    H = 4.6
    fig, ax = canvas(H)
    rad = 0.075
    colw = (W - 0.2) / 2
    xs = [0.2, 0.2 + colw + 0.1]                  # left edge of each column (circle sits left of the box)
    bw = colw - 0.1 - 2 * rad - 0.05
    bh = max(need(bw, t, b) for t, b in steps)
    g = 0.1
    top0 = H - 0.14
    pos = []
    for k, (t, b) in enumerate(steps):
        c, r = divmod(k, 5)
        bx = xs[c] + 2 * rad + 0.05 - 0.1
        top = top0 - r * (bh + g)
        box(ax, bx, top, bw, bh, t, b, fill=SOFT if k in (5, 6, 7) else "white")
        cyc = top - bh / 2
        ax.add_patch(Circle((bx - rad - 0.04, cyc), rad, fc="black", ec="black", lw=LW))
        ax.text(bx - rad - 0.04, cyc, str(k + 1), color="white", fontsize=6.6, fontweight="bold", ha="center", va="center")
        if r < 4:
            arrow(ax, bx + bw / 2, top - bh, bx + bw / 2, top - bh - g)
        pos.append((bx, top))
    # step 5 (bottom left) -> step 6 (top right): up the gutter between the columns
    bx5, t5 = pos[4]
    bx6, t6 = pos[5]
    xm = bx5 + bw + 0.065
    y5 = t5 - bh / 2
    line(ax, [bx5 + bw, xm], [y5, y5])
    line(ax, [xm, xm], [y5, t6 + 0.06])
    line(ax, [xm, bx6 + bw / 2], [t6 + 0.06, t6 + 0.06])
    arrow(ax, bx6 + bw / 2, t6 + 0.06, bx6 + bw / 2, t6)
    # outputs
    bx10, t10 = pos[9]
    ylow = t10 - bh
    oxs, ow = grid(2, 0.12, 0.0, W)
    t = ylow - 0.07 - GAP + 0.04
    fan(ax, bx10 + bw / 2, ylow, [x + ow / 2 for x in oxs], t)
    b = row(ax, oxs, t, ow, [("Report draft", "marked as an unconfirmed draft"),
                             ("Review queue", "images ordered by combined score")])
    ax.text(W / 2, b - 0.09, "A step that cannot run is recorded as unavailable; independent steps still run.",
            fontsize=6.6, style="italic", ha="center", va="center")
    save(fig, "fig2_workflow", b - 0.16)


# ------------------------------------------------------------------ Fig. 3: numbering flow (a) and FDI chart (b)
TOOTH_W = {1: 0.95, 2: 0.8, 3: 0.85, 4: 0.85, 5: 0.85, 6: 1.2, 7: 1.1, 8: 1.0}   # relative crown widths


def fdi_chart(ax, x0, x1, top):
    """Drawn FDI chart as seen on a panoramic radiograph: patient's right on the image left."""
    order_l = [8, 7, 6, 5, 4, 3, 2, 1]
    seq = order_l + order_l[::-1]
    total = sum(TOOTH_W[n] for n in seq) + 0.25
    unit = (x1 - x0) / (total + 15 * 0.12)
    gap = 0.12 * unit
    th_u, th_l = 0.30, 0.30
    mid = x0 + (x1 - x0) / 2
    yu = top - 0.2
    yl = yu - th_u - 0.17
    for arch, (y, h, qL, qR) in enumerate(((yu, th_u, 1, 2), (yl, th_l, 4, 3))):
        x = x0
        for k, n in enumerate(seq):
            q = qL if k < 8 else qR
            w = TOOTH_W[n] * unit
            if k == 8:
                x += 0.25 * unit
            molar = n >= 6
            ax.add_patch(FancyBboxPatch((x, y - h), w, h, boxstyle=f"round,pad=0,rounding_size={min(w, h) * 0.35}",
                                        fc=SOFT if molar else "white", ec="black", lw=0.5))
            ax.text(x + w / 2, y - h / 2, f"{q}{n}", fontsize=5.4, ha="center", va="center")
            x += w + gap
    line(ax, [mid, mid], [yu + 0.06, yl - th_l - 0.06], lw=0.5, ls=DASH)
    ym = (yu - th_u + yl) / 2
    line(ax, [x0, x1], [ym, ym], lw=0.5, ls=DASH)
    lab = dict(fontsize=6.8, ha="center", va="center", style="italic")
    ax.text((x0 + mid) / 2, yu + 0.09, "Quadrant 1: upper right", **lab)
    ax.text((mid + x1) / 2, yu + 0.09, "Quadrant 2: upper left", **lab)
    ax.text((x0 + mid) / 2, yl - th_l - 0.09, "Quadrant 4: lower right", **lab)
    ax.text((mid + x1) / 2, yl - th_l - 0.09, "Quadrant 3: lower left", **lab)
    ax.text(x0, ym, "R ", fontsize=7, fontweight="bold", ha="right", va="center")
    ax.text(x1, ym, " L", fontsize=7, fontweight="bold", ha="left", va="center")
    return yl - th_l - 0.17


def fig3():
    H = 4.3
    fig, ax = canvas(H)
    top = H - 0.02
    x0 = 0.22
    ax.text(0.0, top - 0.07, "(a)", fontsize=TFS, fontweight="bold", va="center")
    xs, hw = grid(2, 0.1, x0, W)
    b = row(ax, xs, top, hw, [("Tooth detector", "one class \u2018tooth\u2019; boxes kept if score \u2265 0.3"),
                              ("Numbering model", "32 FDI classes; best box per tooth code")])
    cx = (x0 + W) / 2
    t = b - 0.07 - GAP + 0.04
    merge(ax, [x + hw / 2 for x in xs], b, cx, t)
    flow = [("Number assignment", "each detector box takes the unused numbering box of highest IoU (\u2265 0.5); "
                                  "otherwise it stays unassigned"),
            ("Consistency check", "flag for review if a code is duplicated, confidence < 0.5, or the side / arch "
                                  "disagrees with the quadrant; no number is forced"),
            ("Mask matching", "one Mask R-CNN instance per detector box, IoU \u2265 0.5")]
    for k, (ti, bo) in enumerate(flow):
        b = box(ax, x0, t, W - x0, need(W - x0, ti, bo), ti, bo, fill=SOFT if k == 2 else "white")
        if k < 2:
            arrow(ax, cx, b, cx, b - GAP)
            t = b - GAP
    t = b - 0.16
    ax.text(0.0, t - 0.07, "(b)", fontsize=TFS, fontweight="bold", va="center")
    b = fdi_chart(ax, x0 + 0.1, W - 0.14, t)
    save(fig, "fig3_detection_numbering_segmentation", b)


# ------------------------------------------------------------------ Fig. 4: finding classification
def fig4():
    H = 2.2
    fig, ax = canvas(H)
    top = H - 0.02
    steps = [("Tooth box", "detector or ground truth"), ("Crop", "pad 10 %, resize to 224 px"),
             ("Normalize", "ImageNet statistics"), ("ResNet-50", "four-way output"), ("Softmax", "most likely class")]
    xs, sw = grid(5, 0.11)
    b = row(ax, xs, top, sw, steps, fills=["white", "white", "white", SOFT, "white"])
    ymid = (top + b) / 2
    for k in range(4):
        arrow(ax, xs[k] + sw, ymid, xs[k + 1], ymid)
    t = b - GAP - 0.02
    arrow(ax, xs[4] + sw / 2, b, xs[4] + sw / 2, t)
    # output classes: one band of four cells
    cxs, cw = grid(4, 0.0)
    head = TH
    bodyh = 2 * PAD + 2 * LH
    hband = head + bodyh
    ax.add_patch(FancyBboxPatch((0, t - hband), W, hband, boxstyle=f"round,pad=0,rounding_size={R}", fc="white",
                                ec="none"))
    cls = [("Caries", "1,550", "0.41"), ("Deep Caries", "438", "1.44"), ("Impacted", "412", "1.53"),
           ("Periapical lesion", "120", "5.25")]
    ax.add_patch(Rectangle((0, t - head), W, head, fc=BAND, ec="none"))
    for k, (n, c, wt) in enumerate(cls):
        x = cxs[k]
        ax.text(x + cw / 2, t - head / 2, n, fontsize=TFS, fontweight="bold", ha="center", va="center")
        ax.text(x + cw / 2, t - head - PAD - LH / 2, f"{c} training crops", fontsize=FS, ha="center", va="center")
        ax.text(x + cw / 2, t - head - PAD - 1.5 * LH, f"class weight {wt}", fontsize=FS, ha="center", va="center")
        if k:
            line(ax, [x, x], [t, t - hband], lw=0.35)
    line(ax, [0, W], [t - head, t - head], lw=0.35)
    ax.add_patch(FancyBboxPatch((0, t - hband), W, hband, boxstyle=f"round,pad=0,rounding_size={R}", fc="none",
                                ec="black", lw=LW))
    b = t - hband
    note = "No healthy class: the output names the closest of the four findings and gives one label per tooth."
    b = box(ax, 0, b - 0.09, W, need(W, None, note), body=note, ls=DASH)
    save(fig, "fig4_classification", b)


# ------------------------------------------------------------------ Fig. 5: uncertainty-aware review
def fig5():
    H = 3.6
    fig, ax = canvas(H)
    top = H - 0.02
    ax.text(0, top - 0.07, "Deployed in the application", fontsize=TFS, fontweight="bold", va="center")
    rows = [("normalized entropy \u2265 0.397", "\u2018abstained\u2019"),
            ("flip disagreement \u2265 0.076", "\u2018unstable under flip\u2019"),
            ("mask instability \u2265 0.30", "\u2018mask unstable\u2019"),
            ("detection score < 0.50", "\u2018low detection score\u2019"),
            ("numbering issue or no number", "numbering flag")]
    rh = LH + 0.055
    y = top - 0.16
    split = 1.72
    ax.add_patch(Rectangle((0, y - rh), W, rh, fc=BAND, ec="none"))
    ax.text(0.07, y - rh / 2, "Signal and threshold", fontsize=TFS, fontweight="bold", va="center")
    ax.text(split + 0.07, y - rh / 2, "Flag (region sent to review)", fontsize=TFS, fontweight="bold", va="center")
    for k, (a, c) in enumerate(rows):
        yc = y - (k + 1.5) * rh
        ax.text(0.07, yc, a, fontsize=FS, va="center")
        ax.text(split + 0.07, yc, c, fontsize=FS, va="center")
        line(ax, [0, W], [y - (k + 1) * rh] * 2, lw=0.35 if k else LW)
    ytab = y - 6 * rh
    ax.add_patch(Rectangle((0, ytab), W, 6 * rh, fc="none", ec="black", lw=LW))
    line(ax, [split, split], [y, ytab], lw=0.35)
    xs, bw = grid(3, 0.12)
    t = ytab - GAP
    arrow(ax, xs[0] + bw / 2, ytab, xs[0] + bw / 2, t)
    b = row(ax, xs, t, bw, [("Final result", "top class and raw score; review mark if abstained"),
                            ("Review queue", "images ordered by combined score"),
                            ("Second approver", "only approved records can be exported")])
    ym = (t + b) / 2
    for k in range(2):
        arrow(ax, xs[k] + bw, ym, xs[k + 1], ym)
    t = b - 0.12
    ax.text(0, t - 0.07, "Evaluated offline only (not deployed)", fontsize=TFS, fontweight="bold", va="center")
    body = ("\u2022 temperature scaling, T = 0.95 fitted on calibration (app scores stay raw)\n"
            "\u2022 33 alternative abstention rules; the best candidate failed on validation\n"
            "\u2022 retraining with approved reviews: implemented, never run")
    b = box(ax, 0, t - 0.16, W, need(W, None, body), body=body, ls=DASH, align="left")
    save(fig, "fig5_uncertainty_review", b)


# ------------------------------------------------------------------ Fig. 6: dataset splits and protocol
def fig6():
    H = 3.9
    fig, ax = canvas(H)
    cx = W / 2
    top = H - 0.02
    body = ("labeled: quadrant 693, enumeration 634, enumeration-disease 705 (1,133 distinct)\n"
            "excluded: official test set (Turkish taxonomy); 50 unlabeled demo images")
    b = box(ax, 0, top, W, need(W, "T", body), "DENTEX: 3,653 PNG files, 2,716 distinct radiographs", body)
    arrow(ax, cx, b, cx, b - GAP)
    body = "fractions 0.70 / 0.10 / 0.10 / 0.10; assignments are append-only"
    b = box(ax, 0, b - GAP, W, need(W, "T", body), "Group by pixel SHA-256; seeded split (seed 42)", body, fill=SOFT)
    xs, sw = grid(4, 0.07)
    t = b - 0.07 - GAP + 0.04
    fan(ax, cx, b, [x + sw / 2 for x in xs], t)
    b = row(ax, xs, t, sw, [("Train", "794 films\nfit weights"), ("Validation", "113 films\nepoch choice, metrics"),
                            ("Calibration", "113 films\nthresholds, temperature"), ("Test", "113 films\nfinal metrics, ledger")])
    t = b - 0.07 - GAP + 0.04
    merge(ax, [x + sw / 2 for x in xs], b, cx, t)
    body = ("\u2022 file-hash overlap between all split pairs: 0\n"
            "\u2022 training and epoch-selection films vs. test, per task: 0\n"
            "\u2022 near duplicates (pixel correlation \u2265 0.97): 0 confirmed\n"
            "\u2022 not checkable: two films of one patient (no patient IDs)")
    b = box(ax, 0, t, W, need(W, "T", body), "Leakage checks (2026-10-15)", body, align="left")
    note = "Test split used once per model (2026-10-14); later results on it are not untouched estimates."
    b = box(ax, 0, b - 0.09, W, need(W, None, note), body=note, ls=DASH)
    save(fig, "fig6_dataset_splits", b)


# ------------------------------------------------------------------ Fig. 7: evaluation framework (table)
def fig7():
    groups = [
        ("Models", [("Tooth detection", "mAP, AP50, P / R @ 0.3", "val, test"),
                    ("Segmentation", "box / mask AP50, IoU, Dice", "val, test"),
                    ("FDI numbering", "AP50, coverage, accuracy", "val, test"),
                    ("Finding classification", "P / R / F1, macro-F1, AUC", "val, test")]),
        ("System", [("Detector \u2192 classifier", "matched / missed, macro-F1", "val"),
                    ("Uncertainty, calibration", "AUROC, ECE, Brier score", "cal, test"),
                    ("Abstention rules", "coverage, risk, macro-F1", "cal, val")]),
        ("Studies", [("Active learning", "macro-F1 per label budget", "val"),
                     ("Classifier variants", "paired macro-F1, 5 seeds", "val"),
                     ("Leakage; benchmark", "overlaps; latency, memory", "all; 10 img")]),
    ]
    rh = LH + 0.05
    n = sum(len(r) for _, r in groups)
    H = 0.06 + rh * (n + 1) + 0.04
    fig, ax = canvas(H)
    xs = [0.0, 0.52, 1.62, 2.86]
    y = H - 0.02
    ax.add_patch(Rectangle((0, y - rh), W, rh, fc=BAND, ec="none"))
    for k, h in enumerate(["Group", "Task", "Metrics", "Splits"]):
        ax.text(xs[k] + 0.06, y - rh / 2, h, fontsize=TFS, fontweight="bold", va="center")
    ytop = y
    y -= rh
    line(ax, [0, W], [y, y], lw=LW)
    for gi, (gname, rows) in enumerate(groups):
        y0 = y
        if gi % 2 == 1:
            ax.add_patch(Rectangle((0, y - len(rows) * rh), W, len(rows) * rh, fc=SOFT, ec="none", zorder=0))
        for r in rows:
            for k, s in enumerate(r):
                ax.text(xs[k + 1] + 0.06, y - rh / 2, s, fontsize=FS, va="center")
            y -= rh
        ax.text(xs[0] + 0.06, (y0 + y) / 2, gname, fontsize=FS, style="italic", va="center")
        if gi < len(groups) - 1:
            line(ax, [0, W], [y, y], lw=0.35)
    ax.add_patch(Rectangle((0, y), W, ytop - y, fc="none", ec="black", lw=LW))
    for x in xs[1:]:
        line(ax, [x, x], [ytop, y], lw=0.35)
    save(fig, "fig7_evaluation_framework", y)


if __name__ == "__main__":
    for f in (fig1, fig2, fig3, fig4, fig5, fig6, fig7):
        f()
    print("figures written to", OUT)

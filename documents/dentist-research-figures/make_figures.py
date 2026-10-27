"""Source for the diagrams of the DentaMind AI IEEE paper (dentist-research-paper.docx).

Every box and label describes code or records that exist in this repository (sources noted per figure).
All figures are drawn at their printed size: IEEE single-column width 3.45 in, so 1 pt in the figure = 1 pt on paper.
Body text 7.5 pt, titles 8 pt (close to the 8 pt caption size), lines 0.6 pt, grayscale only.
Run:  python make_figures.py  -> figN_*.svg (outlined text), figN_*_editable.svg, figN_*.pdf, figN_*.png (600 dpi)
"""
from pathlib import Path

from PIL import ImageFont

import matplotlib

matplotlib.use("Agg")
import matplotlib.image as mpimg
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, Rectangle
from matplotlib.transforms import Bbox

OUT = Path(__file__).resolve().parent
REPO = OUT.parents[1]
plt.rcParams.update({"font.family": "serif", "font.serif": ["Times New Roman", "Times", "DejaVu Serif"],
                     "mathtext.fontset": "stix", "pdf.fonttype": 42})

W = 3.45             # printed width (in)
FS = 7.5             # body font (pt)
TFS = 8.0            # title font (pt)
LH = FS * 1.28 / 72  # line height (in)
PAD = 0.045          # inner vertical padding (in)
LW = 0.6
FILL = "0.92"        # light gray for emphasis boxes
CPI = 21.5           # characters per inch at 7.5 pt Times (conservative)
GAP = 0.13           # vertical gap used for arrows
DASH = (0, (3, 2))


def canvas(h):
    fig = plt.figure(figsize=(W, h))
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(0, W)
    ax.set_ylim(0, h)
    ax.axis("off")
    return fig, ax


_TNR = ImageFont.truetype("C:/Windows/Fonts/times.ttf", 100)


def text_w(s, fs=FS):
    """Printed width (in) of s in Times New Roman at fs points."""
    return _TNR.getlength(s) * fs / 100 / 72


def wrap(s, w, fs=FS):
    """Greedy word wrap with real font metrics; available width = box width minus side padding."""
    avail = w - 0.12
    out = []
    for part in s.split("\n"):
        cur = ""
        for word in part.split(" "):
            cand = (cur + " " + word).strip()
            if cur and text_w(cand, fs) > avail:
                out.append(cur)
                cur = word
            else:
                cur = cand
        out.append(cur)
    return out


def node(ax, x, top, w, title=None, body="", fill="white", ls="-", align="center", rounded=True, tfs=TFS, fs=FS,
         nlines=0):
    """Box whose height follows its text (or nlines body lines, to equalize a row). Returns the bottom y."""
    lines = wrap(body, w, fs) if body else []
    lines += [""] * max(0, nlines - len(lines))
    th = tfs * 1.28 / 72 if title else 0
    h = 2 * PAD + th + len(lines) * LH
    y = top - h
    style = "round,pad=0,rounding_size=0.03" if rounded else "square,pad=0"
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle=style, fc=fill, ec="black", lw=LW, ls=ls))
    cx = x + w / 2 if align == "center" else x + 0.06
    yy = top - PAD
    if title:
        ax.text(cx, yy - th / 2, title, fontsize=tfs, fontweight="bold", ha=align, va="center")
        yy -= th
    for ln in lines:
        ax.text(cx, yy - LH / 2, ln, fontsize=fs, ha=align, va="center")
        yy -= LH
    return y


def arrow(ax, x1, y1, x2, y2):
    ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle="-|>,head_length=0.35,head_width=0.18", lw=LW, color="black",
                                shrinkA=0, shrinkB=0))


def line(ax, xs, ys, ls="-", lw=LW):
    ax.plot(xs, ys, color="black", lw=lw, ls=ls, solid_capstyle="butt")


def label(ax, x, y, s, fs=FS, bold=False, italic=False, ha="left"):
    ax.text(x, y, s, fontsize=fs, fontweight="bold" if bold else "normal", fontstyle="italic" if italic else "normal",
            ha=ha, va="center")


def save(fig, name, bottom):
    """Crop the canvas to [bottom, top] and write all formats."""
    bb = Bbox.from_extents(0, max(0, bottom - 0.02), W, fig.get_figheight())
    with plt.rc_context({"svg.fonttype": "none"}):
        fig.savefig(OUT / f"{name}_editable.svg", bbox_inches=bb)
    with plt.rc_context({"svg.fonttype": "path"}):
        fig.savefig(OUT / f"{name}.svg", bbox_inches=bb)
    fig.savefig(OUT / f"{name}.pdf", bbox_inches=bb)
    fig.savefig(OUT / f"{name}.png", dpi=600, bbox_inches=bb)
    plt.close(fig)


# ------------------------------------------------------------------ Fig. 1: overall architecture
# Sources: backend/main.py (FastAPI), backend/services/pipeline.py, configs/models.yaml, reporting/*, annotation/reviews.py, frontend/src.
def fig1():
    H = 4.2
    fig, ax = canvas(H)
    b = node(ax, 0.6, H - 0.02, W - 1.2, body="Panoramic radiograph (PNG / JPEG upload)")
    arrow(ax, W / 2, b, W / 2, b - GAP)
    frame_top = b - GAP
    label(ax, 0.09, frame_top - 0.09, "FastAPI back end — full-analysis pipeline", fs=7, italic=True)
    b = node(ax, 0.09, frame_top - 0.19, W - 0.18, body="Pre-processing: RGB [0, 1] at full resolution; image-quality flags",
             fill=FILL)
    arrow(ax, W / 2, b, W / 2, b - GAP)
    b = node(ax, 0.7, b - GAP, W - 1.4, title="Tooth detection", body="Faster R-CNN R50-FPN, class ‘tooth’")
    bw = (W - 0.18 - 2 * 0.07) / 3
    xs = [0.09 + k * (bw + 0.07) for k in range(3)]
    ybus = b - 0.06
    line(ax, [W / 2, W / 2], [b, ybus])
    line(ax, [xs[0] + bw / 2, xs[2] + bw / 2], [ybus, ybus])
    tb = ybus - 0.08
    specs = [("FDI numbering", "Faster R-CNN, 32 FDI classes"), ("Segmentation", "Mask R-CNN, R50-FPN"),
             ("Finding classifier", "ResNet-50, 4 finding classes")]
    bots = []
    for x, (ti, bo) in zip(xs, specs):
        arrow(ax, x + bw / 2, ybus, x + bw / 2, tb)
        bots.append(node(ax, x, tb, bw, title=ti, body=bo, tfs=7.5, nlines=2))
    low = min(bots)
    for x, bt in zip(xs, bots):
        if bt > low:
            line(ax, [x + bw / 2, x + bw / 2], [bt, low])
        arrow(ax, x + bw / 2, low, x + bw / 2, low - GAP)
    b = node(ax, 0.09, low - GAP, W - 0.18, title="Uncertainty and review flags per region",
             body="entropy · flip disagreement · mask and box instability", fill=FILL)
    arrow(ax, W / 2, b, W / 2, b - GAP)
    b = node(ax, 0.55, b - GAP, W - 1.1, body="Final result + region records (SQLite)")
    frame_bot = b - 0.08
    ax.add_patch(FancyBboxPatch((0.03, frame_bot), W - 0.06, frame_top - frame_bot,
                                boxstyle="round,pad=0,rounding_size=0.03", fc="none", ec="black", lw=LW, ls=DASH))
    ow = (W - 0.18 - 0.08) / 2
    ox = [0.09, 0.09 + ow + 0.08]
    for x in ox:
        arrow(ax, x + ow / 2, b, x + ow / 2, frame_bot - GAP)
    t = frame_bot - GAP
    b1 = node(ax, ox[0], t, ow, title="Report drafting", body="EN / HI / MR templates, evidence validator", tfs=7.5, nlines=2)
    b2 = node(ax, ox[1], t, ow, title="Human review", body="confirm / correct / reject; second approver", tfs=7.5,
              nlines=2)
    low = min(b1, b2)
    for x, bt in zip(ox, (b1, b2)):
        if bt > low:
            line(ax, [x + ow / 2, x + ow / 2], [bt, low])
        arrow(ax, x + ow / 2, low, x + ow / 2, low - GAP)
    b = node(ax, 0.09, low - GAP, W - 0.18, title="React front end",
             body="DetectionOverlay · RegionReview · ReportPreview · FinalResult", tfs=7.5)
    save(fig, "fig1_architecture", b)


# ------------------------------------------------------------------ Fig. 2: processing workflow (two-column snake)
# Source: PipelineService.run() step names (backend/services/pipeline.py).
def fig2():
    steps = [("1  preprocess", "RGB [0, 1]; quality flags"), ("2  detect", "tooth boxes, score ≥ 0.3"),
             ("3  number", "FDI code or ‘unassigned’"), ("4  segment", "instance masks (optional)"),
             ("5  match", "mask ↔ box, IoU ≥ 0.5"), ("6  classify", "softmax over 4 classes"),
             ("7  classify_tta", "same on flipped crops"), ("8  flip passes", "detector / segmenter, flipped"),
             ("9  region records", "signals, flags, review need"), ("10  final result", "top class per tooth")]
    H = 3.0
    fig, ax = canvas(H)
    cw = (W - 0.3) / 2
    xl, xr = 0.0, cw + 0.3
    gap = 0.09
    boxes = []
    for col, x in enumerate((xl, xr)):
        t = H - 0.12
        for k in range(5):
            name, desc = steps[col * 5 + k]
            b = node(ax, x, t, cw, title=name, body=desc, align="left", fill=FILL if k % 2 == 0 else "white",
                     rounded=False, tfs=7.5)
            if k < 4:
                arrow(ax, x + cw / 2, b, x + cw / 2, b - gap)
            boxes.append((t, b))
            t = b - gap
    # connector: right edge of step 5 -> top of step 6
    t5, b5 = boxes[4]
    t6, _ = boxes[5]
    xm = cw + 0.15
    ym = (t5 + b5) / 2
    line(ax, [cw, xm], [ym, ym])
    line(ax, [xm, xm], [ym, t6 + 0.06])
    line(ax, [xm, xr + cw / 2], [t6 + 0.06, t6 + 0.06])
    arrow(ax, xr + cw / 2, t6 + 0.06, xr + cw / 2, t6)
    # outputs from step 10
    b10 = boxes[9][1]
    low = min(b5, b10) - 0.15
    line(ax, [xr + cw / 2, xr + cw / 2], [b10, low + 0.07])
    line(ax, [xl + cw / 2, xr + cw / 2], [low + 0.07, low + 0.07])
    arrow(ax, xl + cw / 2, low + 0.07, xl + cw / 2, low)
    arrow(ax, xr + cw / 2, low + 0.07, xr + cw / 2, low)
    o1 = node(ax, xl, low, cw, title="Report draft", body="status: unconfirmed draft", tfs=7.5)
    o2 = node(ax, xr, low, cw, title="Review queue", body="ordered by combined score", tfs=7.5)
    b = min(o1, o2)
    label(ax, W / 2, b - 0.09, "A step that cannot run is recorded as unavailable or failed; independent steps still run.",
          fs=6.8, italic=True, ha="center")
    save(fig, "fig2_workflow", b - 0.16)


# ------------------------------------------------------------------ Fig. 3: detection, numbering, segmentation + real output
# Sources: torch_models.number_teeth, trainers.resolve_numbering, tooth_numbering.check_numbering, pipeline._greedy_match.
# (b): docs/audit_evidence/shots/e2e_analysis.png (UI audit 2026-10-14; DENTEX validation_data/val_12.png, unlabeled).
def fig3():
    H = 4.6
    fig, ax = canvas(H)
    top = H - 0.02
    x0 = 0.24
    label(ax, 0.0, top - 0.07, "(a)", fs=TFS, bold=True)
    hw = (W - x0 - 0.1) / 2
    x1, x2 = x0, x0 + hw + 0.1
    b1 = node(ax, x1, top, hw, title="Tooth detector", body="class ‘tooth’; boxes kept if score ≥ 0.3", tfs=7.5,
              nlines=2)
    b2 = node(ax, x2, top, hw, title="Numbering model", body="32 FDI classes; class-agnostic NMS, best box per code",
              tfs=7.5, nlines=2)
    low = min(b1, b2)
    for x, bb in ((x1, b1), (x2, b2)):
        line(ax, [x + hw / 2, x + hw / 2], [bb, low - 0.06])
    line(ax, [x1 + hw / 2, x2 + hw / 2], [low - 0.06, low - 0.06])
    cx = (x0 + W) / 2
    arrow(ax, cx, low - 0.06, cx, low - 0.06 - GAP)
    b = node(ax, x0, low - 0.06 - GAP, W - x0, title="Number assignment", tfs=7.5, align="left",
             body="each detector box, by score, takes the unused numbering box of highest IoU if IoU ≥ 0.5; "
                  "otherwise the tooth stays unassigned")
    arrow(ax, cx, b, cx, b - GAP)
    b = node(ax, x0, b - GAP, W - x0, title="Consistency check (no number is forced)", tfs=7.5, align="left",
             body="review if the code is duplicated, confidence < 0.5, or the box side / arch disagrees with the quadrant")
    arrow(ax, cx, b, cx, b - GAP)
    b = node(ax, x0, b - GAP, W - x0, title="Mask matching", tfs=7.5, align="left", fill=FILL,
             body="Mask R-CNN instance ↔ detector box, one-to-one, IoU ≥ 0.5")
    t = b - 0.12
    label(ax, 0.0, t - 0.07, "(b)", fs=TFS, bold=True)
    img = mpimg.imread(REPO / "docs/audit_evidence/shots/e2e_analysis.png")
    crop = img[192:566, 598:1360]          # radiograph viewer only (rows, columns of the 1440 x 900 screenshot)
    iw = W - x0
    ih = iw * crop.shape[0] / crop.shape[1]
    ax.imshow(crop, extent=(x0, W, t - ih, t), interpolation="lanczos", aspect="auto")
    ax.add_patch(Rectangle((x0, t - ih), iw, ih, fc="none", ec="black", lw=LW))
    ax.set_xlim(0, W)
    ax.set_ylim(0, H)
    save(fig, "fig3_detection_numbering_segmentation", t - ih)


# ------------------------------------------------------------------ Fig. 4: finding classification
# Sources: torch_models.classify_regions, trainers.crop_region, classifier sidecar (class counts and weights).
def fig4():
    H = 2.0
    fig, ax = canvas(H)
    top = H - 0.02
    steps = [("Tooth box", "detector or GT"), ("Crop", "pad 10 %, 224 px"), ("Normalize", "ImageNet stats"),
             ("ResNet-50", "4-way output"), ("Softmax", "argmax class")]
    g = 0.1
    sw = (W - 4 * g) / 5
    bots = []
    for k, (a, c) in enumerate(steps):
        x = k * (sw + g)
        bots.append(node(ax, x, top, sw, title=a, body=c, tfs=7.5, fill=FILL if k == 3 else "white", nlines=2))
    yb = (top + min(bots)) / 2
    for k in range(1, 5):
        x = k * (sw + g)
        arrow(ax, x - g, yb, x, yb)
    b = min(bots)
    xs = 4 * (sw + g) + sw / 2
    t = b - GAP - 0.04
    line(ax, [xs, xs], [b, b - 0.07])
    line(ax, [W / 8, xs], [b - 0.07, b - 0.07])
    cls = [("Caries", "1,550", "0.41"), ("Deep Caries", "438", "1.44"), ("Impacted", "412", "1.53"),
           ("Periapical L.", "120", "5.25")]
    cg = 0.06
    cw = (W - 3 * cg) / 4
    bl = []
    for k, (n, c, wt) in enumerate(cls):
        x = k * (cw + cg)
        arrow(ax, x + cw / 2, b - 0.07, x + cw / 2, t)
        bl.append(node(ax, x, t, cw, title=n, body=f"{c} crops\nweight {wt}", tfs=7.5))
    b = node(ax, 0, min(bl) - 0.08, W, ls=DASH,
             body="No healthy class: the output names the closest of the four findings, not whether a tooth is diseased; "
                  "one label per tooth.")
    save(fig, "fig4_classification", b)


# ------------------------------------------------------------------ Fig. 5: uncertainty-aware review
# Sources: pipeline.DEFAULT_THRESHOLDS + Data/reports/uncertainty_thresholds.json, final_result.py, annotation/reviews.py,
# uncertainty_evaluation.json (temperature, offline), docs/audit_evidence/ml_improvement/abstention/report.md.
def fig5():
    H = 3.3
    fig, ax = canvas(H)
    top = H - 0.02
    label(ax, 0, top - 0.07, "Deployed in the application", fs=TFS, bold=True)
    rows = [("normalized entropy ≥ 0.397", "‘abstained’ + review"),
            ("flip disagreement ≥ 0.076", "‘unstable under flip’ + review"),
            ("mask instability ≥ 0.30", "‘mask unstable’ + review"),
            ("detection score < 0.50", "‘low detection score’ + review"),
            ("numbering issue / no number", "number flag + review")]
    rh = LH + 0.06
    y = top - 0.16
    lw_ = 1.55
    ax.add_patch(Rectangle((0, y - 5 * rh), lw_, 5 * rh, fc=FILL, ec="none"))
    ax.add_patch(Rectangle((0, y - 5 * rh), W, 5 * rh, fc="none", ec="black", lw=LW))
    line(ax, [lw_, lw_], [y, y - 5 * rh])
    for k, (a, c) in enumerate(rows):
        yc = y - (k + 0.5) * rh
        label(ax, 0.06, yc, a)
        label(ax, lw_ + 0.22, yc, c)
        arrow(ax, lw_ + 0.04, yc, lw_ + 0.17, yc)
        if k:
            line(ax, [0, W], [y - k * rh] * 2, lw=0.3)
    y -= 5 * rh
    arrow(ax, W / 6, y, W / 6, y - GAP)
    t = y - GAP
    g = 0.1
    bw = (W - 2 * g) / 3
    specs = [("Final result", "top class + raw score; review mark if abstained"),
             ("Review queue", "images ordered by combined score"),
             ("Second approver", "only approved pool / upload records exportable")]
    bots = [node(ax, k * (bw + g), t, bw, title=ti, body=bo, tfs=7.5, nlines=3) for k, (ti, bo) in enumerate(specs)]
    for k in range(2):
        x = k * (bw + g) + bw
        arrow(ax, x, (t + min(bots)) / 2, x + g, (t + min(bots)) / 2)
    t = min(bots) - 0.1
    label(ax, 0, t - 0.07, "Evaluated offline only (not deployed)", fs=TFS, bold=True)
    b = node(ax, 0, t - 0.16, W, align="left", ls=DASH,
             body="• temperature scaling, T = 0.95 fitted on calibration (app scores stay raw)\n"
                  "• 33 alternative abstention rules; the best candidate failed on validation\n"
                  "• retraining with approved reviews: implemented, never run")
    save(fig, "fig5_uncertainty_review", b)


# ------------------------------------------------------------------ Fig. 6: dataset splits and protocol
# Sources: Data/reports/dataset_audit.md, leakage_check.md, configs/data.yaml (seed 42, 70/10/10/10), docs/RESEARCH_INTEGRITY.md.
def fig6():
    H = 3.6
    fig, ax = canvas(H)
    b = node(ax, 0, H - 0.02, W, title="DENTEX: 3,653 PNG files, 2,716 distinct radiographs", align="left",
             body="labeled: quadrant 693, enumeration 634, enum.-disease 705 (1,133 distinct)\n"
                  "excluded: official test set (Turkish taxonomy); 50 unlabeled demo images")
    arrow(ax, W / 2, b, W / 2, b - GAP)
    b = node(ax, 0, b - GAP, W, title="Group by SHA-256 of pixels; seeded split (seed 42)",
             body="fractions 0.70 / 0.10 / 0.10 / 0.10; assignments are append-only", fill=FILL)
    g = 0.06
    sw = (W - 3 * g) / 4
    ybus = b - 0.06
    line(ax, [W / 2, W / 2], [b, ybus])
    line(ax, [sw / 2, 3 * (sw + g) + sw / 2], [ybus, ybus])
    t = ybus - 0.08
    sp = [("Train", "794", "fit weights"), ("Validation", "113", "epoch choice, metrics"),
          ("Calibration", "113", "thresholds, temperature"), ("Test", "113", "final metrics, ledger")]
    bots = []
    for k, (a, n, r) in enumerate(sp):
        x = k * (sw + g)
        arrow(ax, x + sw / 2, ybus, x + sw / 2, t)
        bots.append(node(ax, x, t, sw, title=a, body=f"{n} films\n{r}", tfs=7.5, nlines=3))
    b = min(bots)
    b = node(ax, 0, b - GAP, W, title="Leakage checks (2026-10-15)", align="left",
             body="• file-hash overlap between all split pairs: 0\n"
                  "• training / epoch-selection films vs. test, per task: 0\n"
                  "• near duplicates (pixel correlation ≥ 0.97): 0 confirmed\n"
                  "• not checkable: two films of one patient (no patient ids)")
    b = node(ax, 0, b - 0.08, W, ls=DASH,
             body="Test split used once per model (2026-10-14); later results on it are not untouched.")
    save(fig, "fig6_dataset_splits", b)


# ------------------------------------------------------------------ Fig. 7: evaluation framework
# Sources: scripts/evaluate_*.py, abstention_threshold_experiment.py, run_al_experiment.py, benchmark_inference.py, check_leakage.py.
def fig7():
    groups = [
        ("Models", [("Tooth detection", "mAP, AP50, P / R @ 0.3", "val, test"),
                    ("Segmentation", "box / mask AP50, IoU, Dice", "val, test"),
                    ("FDI numbering", "AP50, coverage, accuracy", "val, test"),
                    ("Finding classification", "P / R / F1, macro-F1, AUC", "val, test")]),
        ("System", [("Detector → classifier", "matched / missed, macro-F1", "val"),
                    ("Uncertainty, calibration", "AUROC, ECE, Brier score", "cal, test"),
                    ("Abstention rules", "coverage, risk, macro-F1", "cal, val")]),
        ("Studies", [("Active learning", "macro-F1 per label budget", "val"),
                     ("Classifier variants", "paired macro-F1, 5 seeds", "val"),
                     ("Leakage; benchmark", "overlaps; latency, memory", "all; 10 img")]),
    ]
    rh = LH + 0.035
    n = sum(len(r) for _, r in groups)
    H = 0.05 + rh * (n + 1) + 0.04
    fig, ax = canvas(H)
    xs = [0.0, 0.5, 1.6, 2.86]
    y = H - 0.02
    line(ax, [0, W], [y, y], lw=0.8)
    for k, h in enumerate(["Group", "Task", "Metrics", "Splits"]):
        label(ax, xs[k] + 0.02, y - rh / 2, h, fs=TFS, bold=True)
    y -= rh
    line(ax, [0, W], [y, y], lw=0.5)
    for gi, (gname, rows) in enumerate(groups):
        y0 = y
        for r in rows:
            for k, s in enumerate(r):
                label(ax, xs[k + 1] + 0.02, y - rh / 2, s)
            y -= rh
        label(ax, xs[0] + 0.02, (y0 + y) / 2, gname, italic=True)
        if gi < len(groups) - 1:
            line(ax, [0, W], [y, y], lw=0.3, ls=(0, (2, 2)))
    line(ax, [0, W], [y, y], lw=0.8)
    save(fig, "fig7_evaluation_framework", y - 0.01)


if __name__ == "__main__":
    for f in (fig1, fig2, fig3, fig4, fig5, fig6, fig7):
        f()
    print("figures written to", OUT)

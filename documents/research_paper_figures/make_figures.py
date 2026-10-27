"""Source for the four black-and-white diagrams used in the IEEE paper.

Each figure is drawn at IEEE single-column width (3.5 in) so that the text in
the figure stays legible (>= 6.5 pt) when placed in the two-column layout.
Run:  python make_figures.py   -> writes fig*.svg, fig*.pdf and fig*.png here.
"""
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.transforms import Bbox
from matplotlib.patches import FancyBboxPatch, Rectangle

OUT = Path(__file__).resolve().parent
plt.rcParams.update({
    "font.family": "serif",
    "font.serif": ["Times New Roman", "Times", "DejaVu Serif"],
    "mathtext.fontset": "stix",
    "pdf.fonttype": 42,
})
LW = 0.7
GRAY = "0.90"


def canvas(w, h):
    fig = plt.figure(figsize=(w, h))
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(0, w)
    ax.set_ylim(0, h)
    ax.axis("off")
    return fig, ax


def box(ax, x, y, w, h, fill="white", lw=LW, rounded=True, ls="-"):
    style = "round,pad=0,rounding_size=0.04" if rounded else "square,pad=0"
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle=style, fc=fill,
                                ec="black", lw=lw, ls=ls))


def text(ax, x, y, s, fs=7, bold=False, ha="center", va="center", italic=False, **kw):
    ax.text(x, y, s, fontsize=fs, ha=ha, va=va,
            fontweight="bold" if bold else "normal",
            fontstyle="italic" if italic else "normal", **kw)


def arrow(ax, x1, y1, x2, y2, lw=LW, head=True):
    ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle="-|>" if head else "-", lw=lw,
                                color="black", mutation_scale=7,
                                shrinkA=0, shrinkB=0))


def content_bbox(fig, pad=0.03):
    """Bounding box (inches) of the drawn content, ignoring the empty canvas axes."""
    fig.canvas.draw()
    r = fig.canvas.get_renderer()
    main = fig.axes[0]
    boxes = [a.get_window_extent(r) for a in main.patches + main.texts + main.lines]
    boxes += [a.get_tightbbox(r) for a in fig.axes[1:]]
    bb = Bbox.union(boxes).transformed(fig.dpi_scale_trans.inverted())
    return Bbox.from_extents(bb.x0 - pad, bb.y0 - pad, bb.x1 + pad, bb.y1 + pad)


def save(fig, name):
    bb = content_bbox(fig)
    # *_editable.svg keeps text as text (for editing); *.svg/.pdf use outlined
    # glyphs so Word renders them identically without font substitution.
    with plt.rc_context({"svg.fonttype": "none"}):
        fig.savefig(OUT / f"{name}_editable.svg", bbox_inches=bb)
    with plt.rc_context({"svg.fonttype": "path"}):
        fig.savefig(OUT / f"{name}.svg", bbox_inches=bb)
    fig.savefig(OUT / f"{name}.pdf", bbox_inches=bb)
    fig.savefig(OUT / f"{name}.png", dpi=600, bbox_inches=bb)
    plt.close(fig)


# ---------------------------------------------------------------- Fig. 1
def fig1():
    stages = [
        ("1. Patient inputs", ["Medical reports / laboratory results", "X-ray images",
                               "MRI / DICOM (future phase)", "Symptoms and history",
                               "Previous dated records"]),
        ("2. Secure patient data", ["Login and profile", "Patient-specific records",
                                    "Date-wise history"]),
        ("3. Multimodal\ninterpretation", ["Pretrained multimodal models",
                                           "Structured findings and values",
                                           "Evidence and uncertainty"]),
        ("4. Longitudinal\nhealth analysis", ["Compare current and previous records",
                                              "Trend detection", "Patient health summary"]),
        ("5. Medical RAG and\nverification", ["Condition-specific knowledge",
                                              "Evidence-grounded explanation",
                                              "Clinician review if needed"]),
        ("6. Patient-centred\noutputs", ["Potential findings / risk signals",
                                         "Explainable timeline",
                                         "Suggested next steps / specialist category"]),
    ]
    W, line, pad, gap = 3.5, 0.135, 0.07, 0.17
    heights = [len(items) * line + 2 * pad for _, items in stages]
    H = sum(heights) + gap * (len(stages) - 1) + 0.12
    fig, ax = canvas(W, H)
    x0, bw, lw_col = 0.04, 2.98, 1.02
    y = H - 0.06
    centers = []
    for (title, items), h in zip(stages, heights):
        y -= h
        box(ax, x0, y, bw, h)
        ax.add_patch(Rectangle((x0, y), lw_col, h, fc=GRAY, ec="black", lw=LW))
        text(ax, x0 + lw_col / 2, y + h / 2, title, fs=7, bold=True, linespacing=1.15)
        for k, it in enumerate(items):
            yy = y + h - pad - line * (k + 0.5)
            text(ax, x0 + lw_col + 0.08, yy, "▪  " + it, fs=6.8, ha="left")
        centers.append((y, h))
        y -= gap
    # downward flow arrows between stages
    for (ya, ha), (yb, hb) in zip(centers[:-1], centers[1:]):
        arrow(ax, x0 + bw / 2, ya, x0 + bw / 2, yb + hb)
    # feedback loop: stage 6 -> stage 1 along the right margin
    xr = x0 + bw + 0.2
    y6 = centers[-1][0] + centers[-1][1] / 2
    y1 = centers[0][0] + centers[0][1] / 2
    ax.plot([x0 + bw, xr, xr], [y6, y6, y1], color="black", lw=LW)
    arrow(ax, xr, y1, x0 + bw, y1)
    text(ax, xr + 0.12, (y1 + y6) / 2, "Evaluation and iterative improvement",
         fs=6.8, rotation=90, italic=True)
    save(fig, "fig1_architecture")


# ---------------------------------------------------------------- Fig. 2
def fig2():
    W, H = 3.5, 4.55
    fig, ax = canvas(W, H)
    # inputs: 3 x 2 grid
    inputs = [("Laboratory results", "blood test reports"),
              ("Medical imaging", "X-ray, MRI, CT"),
              ("Clinical notes", "EMR, discharge summaries"),
              ("Symptoms", "patient-reported"),
              ("Prescriptions", "current and past"),
              ("Other information", "appointments, vitals, history")]
    text(ax, W / 2, H - 0.09, "Multimodal inputs", fs=7.5, bold=True)
    bw, bh, gx, gy = 1.08, 0.36, 0.05, 0.06
    left = (W - (3 * bw + 2 * gx)) / 2
    top = H - 0.2
    bottoms = []
    for i, (t, s) in enumerate(inputs):
        r, c = divmod(i, 3)
        x = left + c * (bw + gx)
        y = top - (r + 1) * bh - r * gy
        box(ax, x, y, bw, bh)
        text(ax, x + bw / 2, y + bh * 0.66, t, fs=6.8, bold=True)
        text(ax, x + bw / 2, y + bh * 0.3, f"({s})", fs=6.2)
        if r == 1:
            bottoms.append(x + bw / 2)
    ygrid = top - 2 * bh - gy
    # converge arrows to unified record
    ybus = ygrid - 0.12
    for xc in bottoms:
        ax.plot([xc, xc], [ygrid, ybus], color="black", lw=LW)
    ax.plot([bottoms[0], bottoms[-1]], [ybus, ybus], color="black", lw=LW)
    rec_top = ybus - 0.14
    arrow(ax, W / 2, ybus, W / 2, rec_top)
    # unified patient record (fields follow Table III)
    fields = ["Examination date", "Laboratory results", "Medical images",
              "Clinical notes", "Symptoms", "Prescriptions",
              "History / vitals", "Source document"]
    rh = 0.2 + 4 * 0.2 + 0.08
    rx, rw = 0.12, W - 0.24
    ry = rec_top - rh
    box(ax, rx, ry, rw, rh, lw=0.9)
    ax.add_patch(Rectangle((rx, rec_top - 0.2), rw, 0.2, fc=GRAY, ec="black", lw=LW))
    text(ax, W / 2, rec_top - 0.1, "Unified patient record  (Patient ID: P001, pseudonymous)",
         fs=7, bold=True)
    fw, fh = (rw - 0.3) / 2, 0.16
    for i, f in enumerate(fields):
        r, c = divmod(i, 2)
        fx = rx + 0.1 + c * (fw + 0.1)
        fy = rec_top - 0.24 - (r + 1) * fh - r * 0.04
        box(ax, fx, fy, fw, fh, rounded=False)
        text(ax, fx + fw / 2, fy + fh / 2, f, fs=6.6)
    # chronological history
    tl_top = ry - 0.16
    arrow(ax, W / 2, ry, W / 2, tl_top)
    events = [("15 Sep 2026", "Lab report", "complete blood count"),
              ("02 Sep 2026", "Chest X-ray", "imaging study"),
              ("28 Aug 2026", "Clinical note", "follow-up visit"),
              ("20 Aug 2026", "Symptom", "fatigue, headache"),
              ("12 Aug 2026", "Prescription", "metformin 500 mg"),
              ("05 Aug 2026", "Lab report", "lipid profile")]
    th = 0.2 + len(events) * 0.19 + 0.06
    ty = tl_top - th
    box(ax, rx, ty, rw, th, lw=0.9)
    ax.add_patch(Rectangle((rx, tl_top - 0.2), rw, 0.2, fc=GRAY, ec="black", lw=LW))
    text(ax, W / 2, tl_top - 0.1, "Chronological medical history (newest first)",
         fs=7, bold=True)
    xl = rx + 0.95
    y_first = tl_top - 0.2 - 0.12
    y_last = y_first - (len(events) - 1) * 0.19
    arrow(ax, xl, y_first + 0.06, xl, y_last - 0.09)
    for k, (d, t, s) in enumerate(events):
        yy = y_first - k * 0.19
        text(ax, xl - 0.1, yy, d, fs=6.6, ha="right")
        ax.plot([xl], [yy], marker="o", ms=3.2, mfc="white", mec="black", mew=LW)
        text(ax, xl + 0.12, yy, t, fs=6.8, ha="left", bold=True)
        text(ax, xl + 0.86, yy, s, fs=6.6, ha="left")
    save(fig, "fig2_data_integration")


# ---------------------------------------------------------------- Fig. 3
def fig3():
    W, H = 3.5, 4.75
    fig, ax = canvas(W, H)
    # inputs row
    text(ax, W / 2, H - 0.09, "Multimodal medical inputs", fs=7.5, bold=True)
    cols = [(0.06, 1.05, "Medical images", "X-ray, MRI, CT"),
            (1.225, 1.05, "Laboratory values", "extracted from reports"),
            (2.39, 1.05, "Clinical text", "notes, symptoms,\nprescriptions, history")]
    iy, ih = H - 0.62, 0.44
    for x, w, t, s in cols:
        box(ax, x, iy, w, ih)
        text(ax, x + w / 2, iy + ih - 0.11, t, fs=6.9, bold=True)
        text(ax, x + w / 2, iy + 0.15, s, fs=6.2, linespacing=1.1)
    # modality-specific models
    my_top = iy - 0.16
    mh = 1.42
    my = my_top - mh
    labels = [
        ("CNN / vision model", ["Conv. + ReLU (2)", "Pooling", "Feature extraction"],
         r"$\mathbf{h}_{\mathrm{img}}$"),
        ("Structured features", ["Unit standardization", "Reference-range flags",
                                 "Imputation (7)"], r"$\mathbf{h}_{\mathrm{lab}}$"),
        ("Transformer model", ["Tokenization", "Encoder layers (1)",
                               "Text embeddings"], r"$\mathbf{h}_{\mathrm{text}}$"),
    ]
    for (x, w, *_), (title, steps, hv) in zip(cols, labels):
        cx = x + w / 2
        arrow(ax, cx, iy, cx, my_top)
        box(ax, x, my, w, mh)
        ax.add_patch(Rectangle((x, my_top - 0.2), w, 0.2, fc=GRAY, ec="black", lw=LW))
        text(ax, cx, my_top - 0.1, title, fs=6.8, bold=True)
        sy = my_top - 0.3
        for k, st in enumerate(steps):
            yb = sy - k * 0.33 - 0.2
            box(ax, x + 0.08, yb, w - 0.16, 0.2, rounded=False)
            text(ax, cx, yb + 0.1, st, fs=6.3)
            if k < len(steps) - 1:
                arrow(ax, cx, yb, cx, yb - 0.13)
        text(ax, cx, my + 0.09, hv, fs=7.5)
    # fusion
    fy_top = my - 0.17
    fh = 0.36
    fy = fy_top - fh
    for x, w, *_ in cols:
        arrow(ax, x + w / 2, my, x + w / 2, fy_top)
    box(ax, 0.06, fy, W - 0.12, fh, fill=GRAY, lw=0.9)
    text(ax, W / 2, fy + fh * 0.68, "Multimodal feature fusion", fs=7, bold=True)
    text(ax, W / 2, fy + fh * 0.27,
         r"$\mathbf{h}=[\mathbf{h}_{\mathrm{text}};\,\mathbf{h}_{\mathrm{lab}};\,"
         r"\mathbf{h}_{\mathrm{img}}]$   (3)", fs=7)
    # multi-task head
    hy_top = fy - 0.17
    hh = 0.4
    hy = hy_top - hh
    arrow(ax, W / 2, fy, W / 2, hy_top)
    box(ax, 0.06, hy, W - 0.12, hh, lw=0.9)
    text(ax, W / 2, hy + hh * 0.7, "Multi-task disease analysis head", fs=7, bold=True)
    text(ax, W / 2, hy + hh * 0.28,
         r"$\hat{y}_d=\sigma(\mathbf{w}_d^{\top}\mathbf{h}+b_d)$  for each condition $d$   (4)",
         fs=7)
    # outputs
    oy_top = hy - 0.2
    oh = 0.42
    oy = oy_top - oh
    diseases = ["Diabetes", "Anemia", "Hyper-\ntension", "Kidney\ndisorders", "Liver\ndisorders"]
    ow, og = 0.62, 0.045
    ox0 = (W - (5 * ow + 4 * og)) / 2
    ax.plot([ox0 + ow / 2, ox0 + 4 * (ow + og) + ow / 2], [hy - 0.1, hy - 0.1],
            color="black", lw=LW)
    ax.plot([W / 2, W / 2], [hy, hy - 0.1], color="black", lw=LW)
    for k, d in enumerate(diseases):
        x = ox0 + k * (ow + og)
        arrow(ax, x + ow / 2, hy - 0.1, x + ow / 2, oy_top)
        box(ax, x, oy, ow, oh)
        text(ax, x + ow / 2, oy + oh / 2 + 0.06, d, fs=6.5, bold=True, linespacing=1.05)
        text(ax, x + ow / 2, oy + 0.07, r"$\hat{y}_d$", fs=6.8)
    text(ax, W / 2, oy - 0.1,
         "Outputs are potential indicators for clinician review, not diagnoses.",
         fs=6.3, italic=True)
    save(fig, "fig3_model_fusion")


# ---------------------------------------------------------------- Fig. 4
def fig4():
    W, H = 3.5, 5.05
    fig, ax = canvas(W, H)
    # previous records strip
    text(ax, W / 2, H - 0.09, "Dated laboratory reports (visits V1–V5)", fs=7.5, bold=True)
    recs = [(f"V{i}", "Lab report", "dated") for i in range(1, 6)]
    rw, rg = 0.64, 0.05
    rx0 = (W - (5 * rw + 4 * rg)) / 2
    ry, rh = H - 0.62, 0.42
    for k, (v, t, s) in enumerate(recs):
        x = rx0 + k * (rw + rg)
        box(ax, x, ry, rw, rh)
        text(ax, x + rw / 2, ry + rh - 0.09, v, fs=6.8, bold=True)
        text(ax, x + rw / 2, ry + rh / 2 - 0.01, t, fs=6.3)
        text(ax, x + rw / 2, ry + 0.08, f"({s})", fs=5.9)
    arrow(ax, W / 2, ry, W / 2, ry - 0.16)
    # monitoring panel
    pt = ry - 0.16
    ph = 2.46
    py = pt - ph
    box(ax, 0.06, py, W - 0.12, ph, lw=0.9)
    ax.add_patch(Rectangle((0.06, pt - 0.2), W - 0.12, 0.2, fc=GRAY, ec="black", lw=LW))
    text(ax, W / 2, pt - 0.1, "Longitudinal monitoring of key laboratory parameters",
         fs=7, bold=True)
    series = [
        ("Fasting glucose (mg/dL)", [95, 110, 118, 132, 112], (70, 99), (50, 150), "o", "-"),
        ("HbA1c (%)", [5.4, 5.8, 6.1, 6.3, 6.1], (None, 5.7), (4.5, 7.0), "s", "-"),
        ("Hemoglobin (g/dL)", [14.2, 13.8, 12.6, 11.9, 12.8], (12.0, 15.5), (10, 17), "^", "-"),
        ("LDL cholesterol (mg/dL)", [98, 112, 128, 122, 118], (None, 100), (80, 140), "D", "-"),
    ]
    cw, chh = 1.38, 0.82
    origins = [(0.42, pt - 0.32 - chh), (2.0, pt - 0.32 - chh),
               (0.42, pt - 0.32 - 2 * chh - 0.35), (2.0, pt - 0.32 - 2 * chh - 0.35)]
    for (title, vals, rng, ylim, mk, ls), (ox, oy) in zip(series, origins):
        sub = fig.add_axes([ox / W, oy / H, cw / W, chh / H])
        xs = range(1, 6)
        lo, hi = rng
        if lo is not None:
            sub.axhspan(lo, hi, color="0.88", lw=0)
        else:
            sub.axhline(hi, color="black", lw=0.6, ls="--")
        if lo is not None:
            for b in (lo, hi):
                sub.axhline(b, color="black", lw=0.5, ls="--")
        sub.plot(xs, vals, color="black", lw=0.8, marker=mk, ms=2.8, mfc="white", mew=0.7)
        for x, v in zip(xs, vals):
            # put the label below the point when it would sit on a reference line
            near = lo is None and 0 < hi - v < 0.12 * (ylim[1] - ylim[0])
            sub.annotate(f"{v:g}", (x, v), textcoords="offset points",
                         xytext=(0, -7.5 if near else 3.2), ha="center", fontsize=5.6)
        sub.set_ylim(*ylim)
        sub.set_xlim(0.6, 5.4)
        sub.set_xticks(list(xs))
        sub.set_xticklabels([f"V{i}" for i in xs], fontsize=5.8)
        sub.tick_params(axis="y", labelsize=5.8, length=2, width=0.5, pad=1.5)
        sub.tick_params(axis="x", length=2, width=0.5, pad=1.5)
        for s in sub.spines.values():
            s.set_linewidth(0.6)
        sub.spines["top"].set_visible(False)
        sub.spines["right"].set_visible(False)
        sub.set_title(title, fontsize=6.6, pad=2.5, fontweight="bold")
        ref = (f"ref. {lo:g}-{hi:g}" if lo is not None else f"ref. < {hi:g}")
        sub.text(0.98, 0.04, ref, transform=sub.transAxes, ha="right", va="bottom",
                 fontsize=5.4, style="italic")
    arrow(ax, W / 2, py, W / 2, py - 0.16)
    # insights and alerts (values from Eq. (5), V1 -> V5)
    it = py - 0.16
    ih = 1.2
    iy = it - ih
    box(ax, 0.06, iy, W - 0.12, ih, lw=0.9)
    ax.add_patch(Rectangle((0.06, it - 0.2), W - 0.12, 0.2, fc=GRAY, ec="black", lw=LW))
    text(ax, W / 2, it - 0.1, r"Insights and alerts (relative change V1$\rightarrow$V5, Eq. (5))",
         fs=7, bold=True)
    rows = [("↑", "Fasting glucose", "95 → 112 mg/dL", "+17.9%", "above range"),
            ("↑", "HbA1c", "5.4 → 6.1 %", "+13.0%", "above range"),
            ("↓", "Hemoglobin", "14.2 → 12.8 g/dL", "−9.9%", "within range"),
            ("↑", "LDL cholesterol", "98 → 118 mg/dL", "+20.4%", "above range")]
    for k, (sym, n, ch, pc, flag) in enumerate(rows):
        yy = it - 0.34 - k * 0.19
        text(ax, 0.2, yy, sym, fs=8, bold=True)
        text(ax, 0.33, yy, n, fs=6.7, ha="left", bold=True)
        text(ax, 1.27, yy, ch, fs=6.6, ha="left")
        text(ax, 2.33, yy, pc, fs=6.6, ha="left")
        text(ax, 2.83, yy, flag, fs=6.4, ha="left", italic=True)
    text(ax, W / 2, iy + 0.13,
         "Several parameters rise across visits; discuss with a healthcare professional.",
         fs=6.3, italic=True)
    save(fig, "fig4_longitudinal_monitoring")


if __name__ == "__main__":
    fig1()
    fig2()
    fig3()
    fig4()
    print("figures written to", OUT)

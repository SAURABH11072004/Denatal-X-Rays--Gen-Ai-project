"""One-off patch: turns make_figures_schematic.py into the pure block-diagram version (no photographs or screenshots)."""
from pathlib import Path

P = Path(__file__).with_name("make_figures_schematic.py")
s = P.read_text(encoding="utf8")


def replace_func(name, new):
    global s
    i = s.index(f"def {name}(")
    j = s.index("\n# ==================================================================", i)
    s = s[:i] + new.strip("\n") + "\n\n" + s[j:]


replace_func("fig2", '''
def fig2():
    """Ten implemented pipeline steps (PipelineService.run) as numbered blocks, two columns read top to bottom."""
    steps = [("Pre-process", "intensity scaling; quality flags"), ("Detect", "tooth boxes, score \\u2265 0.3"),
             ("Number", "FDI code or \\u2018unassigned\\u2019"), ("Segment", "instance masks (optional)"),
             ("Match", "mask \\u2194 box, one-to-one, IoU \\u2265 0.5"), ("Classify", "softmax over the 4 classes"),
             ("Classify, flipped", "same crops, mirrored"), ("Flip passes", "detector and segmenter, mirrored image"),
             ("Region records", "signals, flags, review need"), ("Final result", "top class per tooth")]
    H = 5.0
    fig, ax = canvas(H)
    nb, g, cg = 0.2, 0.1, 0.3
    cw = (W - cg) / 2
    xs = [0.0, cw + cg]
    bh = max(need(cw - nb, n, d) for n, d in steps)
    top0 = H - 0.02
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
    note = ("Every step is timed and records its status. A step whose model is missing is reported as \\u2018unavailable\\u2019, "
            "a crashed step as \\u2018failed\\u2019; steps that do not depend on it still run, and a missing signal is never set to zero.")
    b = block(ax, 0, b - 0.1, W, need(W, None, note), None, note, ls=DASH, align="left")
    save(fig, "fig2_workflow", b)
''')

replace_func("fig4", '''
def fig4():
    """Finding classification as a block chain: tooth box -> crop -> resize -> normalize -> ResNet-50 -> softmax -> 4 classes."""
    H = 3.6
    fig, ax = canvas(H)
    top = H - 0.02
    xs, bw = grid(3, 0.17)
    row1 = [("Tooth box", "detector box (application) or GT box (evaluation)"),
            ("Crop", "box + 10 % padding on each side"),
            ("Resize", "224 \\u00d7 224 px, bilinear")]
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
    label(ax, 0.0, b2 - 0.06, "four output classes", ha="left")
    b3 = blocks(ax, xc, t3, cw, [(n, f"{c} training crops; weight {w}") for n, c, w in cls])
    label(ax, W / 2, b3 - 0.085, "class weight w = N / (K n), N = 2,520 training crops, K = 4", ha="center", style="normal")
    note = ("No healthy class: DENTEX labels only teeth that carry a finding, so the model always selects the closest of the "
            "four annotated findings, one label per tooth. Scores are raw softmax values, not calibrated probabilities.")
    b = block(ax, 0, b3 - 0.17, W, need(W, None, note), None, note, ls=DASH, align="left")
    save(fig, "fig4_classification", b)
''')

replace_func("fig6", '''
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
         "near duplicates (pixel correlation \\u2265 0.97): 0 confirmed")
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
''')

# Fig. 3b: drawn FDI chart instead of the model-output image
s = s.replace("    b = overlay_panel(ax, x0, W, t)\n", "    b = fdi_chart(ax, x0 + 0.12, W - 0.14, t)\n")

# Fig. 7: name the two classification settings explicitly
s = s.replace('("Finding classification", "P / R / F1, macro-F1, AUC", "VT")',
              '("Classification, GT crops", "P / R / F1, macro-F1, AUC", "VT")')
s = s.replace('("Detector \\u2192 classifier", "matched / missed, macro-F1", "V")',
              '("End-to-end, detector crops", "matched / missed, macro-F1", "V")')
s = s.replace('("Uncertainty, calibration", "AUROC, ECE, Brier score", "CT")',
              '("Calibration, uncertainty", "ECE, Brier score, AUROC", "CT")')
s = s.replace("Final version: Fig. 3b shows genuine model output (run_genuine_overlay.py) and Fig. 4 genuine training crops.",
              "Schematic version: every figure is a vector block diagram; no photograph, screenshot or raster image is embedded.")
s = s.replace("def fig3():\n    H = 5.4\n", "def fig3():\n    H = 4.6\n")
P.write_text(s, encoding="utf8")
assert "overlay_panel(ax, x0, W, t)" not in s and "GT crops" in s and "End-to-end, detector crops" in s
print("patched")

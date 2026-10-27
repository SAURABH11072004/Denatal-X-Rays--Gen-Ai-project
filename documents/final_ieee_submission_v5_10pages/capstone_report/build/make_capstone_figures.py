"""Two additional diagrams for the DentaMind AI capstone report (2026-10-26), drawn with the helpers and design rules of
../../build/make_figures_v4.py so they match the seven existing schematic figures (black on white, square blocks,
Times New Roman, dashed outlines only for optional or not-deployed parts).

  figB_block_diagram      system block diagram: client, API, services, model layer, storage, optional services
  figR_report_generation  evidence-grounded report drafting (the project's generative component)

Facts come from backend/services/*.py, src/dentexmodel/reporting/reports.py and docs/API_GUIDE.md.
Run:  python make_capstone_figures.py <out_dir>
"""
import importlib.util
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("mf", HERE.parents[1] / "build" / "make_figures_v4.py")
mf = importlib.util.module_from_spec(spec)
_argv = sys.argv[:]
sys.argv = [sys.argv[0], str(Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve())]
spec.loader.exec_module(mf)
sys.argv = _argv

W, LW, LWB, LWT, DASH = mf.W, mf.LW, mf.LWB, mf.LWT, mf.DASH
block, blocks, arrow, poly, label, heading, need, grid, canvas, fan, merge, save, dot = (
    mf.block, mf.blocks, mf.arrow, mf.poly, mf.label, mf.heading, mf.need, mf.grid, mf.canvas, mf.fan, mf.merge, mf.save, mf.dot)


def box(ax, x, top, w, name, detail, **kw):
    return block(ax, x, top, w, need(w, name, detail), name, detail, **kw)


def tier(ax, y, name, first=False):
    if not first:
        poly(ax, [0, W], [y, y], lw=LWT, ls=DASH)
    heading(ax, 0.0, y - 0.07, name)
    return y - 0.135


def figB():
    """Deployment-level block diagram of the implemented application."""
    H = 5.6
    fig, ax = canvas(H)
    cx = W / 2
    t = tier(ax, H - 0.02, "Client (browser)", first=True)
    b = box(ax, 0, t, W, "React 18 user interface (Vite 5, Tailwind CSS)",
            "Home, X-ray Analysis, Reports, Review Findings, About & Limitations, Settings; research pages")
    arrow(ax, cx, b, cx, b - 0.17)
    label(ax, cx + 0.05, b - 0.085, "HTTP/JSON; proxy adds the API token", ha="left")
    t = tier(ax, b - 0.2, "Back end (FastAPI; token, loopback only, rate limits)")
    xs, bw = grid(4, 0.07)
    b = blocks(ax, xs, t, bw, [("Images", "upload checks, manifest ids"), ("Analysis", "10-step pipeline, uncertainty"),
                               ("Reports", "drafting, validation, export"), ("Reviews", "revisions, second approver")])
    xs2, bw2 = grid(3, 0.09)
    t2 = b - 0.09
    b = blocks(ax, xs2, t2, bw2, [("Active learning", "pool scoring and selection"),
                                  ("Models and training", "registry, jobs, evaluation"),
                                  ("Dataset", "manifest, splits, leakage")])
    arrow(ax, cx, b, cx, b - 0.17)
    t = tier(ax, b - 0.2, "Model layer (dentexmodel package, PyTorch 2.6, CUDA or CPU)")
    w = 2.3
    b = box(ax, cx - w / 2, t, w, "Model registry", "SHA-256 of each checkpoint checked against its sidecar")
    xs4, bw4 = grid(4, 0.07)
    tt = b - 0.13 - 0.11
    fan(ax, cx, b, [x + bw4 / 2 for x in xs4], tt, drop=0.13)
    b = blocks(ax, xs4, tt, bw4, [("Tooth detector", "Faster R-CNN"), ("FDI numbering", "Faster R-CNN, 32 classes"),
                                  ("Segmenter", "Mask R-CNN"), ("Classifier", "ResNet-50, 4 finding classes")], lw=LWB)
    t = tier(ax, b - 0.11, "Storage (local disk)")
    xs3, bw3 = grid(3, 0.09)
    b = blocks(ax, xs3, t, bw3, [("SQLite database", "images, analyses, reviews, reports, jobs"),
                                 ("Files", "uploads (hash names), DENTEX data, checkpoints"),
                                 ("Reports folder", "evaluation reports, test-set ledger")])
    t = tier(ax, b - 0.09, "Optional services (not configured)")
    xs5, bw5 = grid(3, 0.09)
    h = max(need(bw5, n, d) for n, d in [("LLM endpoint", "OpenAI-compatible; optional rewording"),
                                          ("Label Studio", "annotation server"), ("TensorBoard", "training curves")])
    for x, (n, d) in zip(xs5, [("LLM endpoint", "OpenAI-compatible; optional rewording"),
                               ("Label Studio", "annotation server"), ("TensorBoard", "training curves")]):
        block(ax, x, t, bw5, h, n, d, ls=DASH)
    b = t - h
    ly = b - 0.1
    ax.add_patch(mf.Rectangle((0.0, ly - 0.035), 0.16, 0.07, fc="white", ec="black", lw=LWB))
    label(ax, 0.2, ly, "trained network", style="normal")
    ax.add_patch(mf.Rectangle((1.3, ly - 0.035), 0.16, 0.07, fc="white", ec="black", lw=LW, ls=DASH))
    label(ax, 1.5, ly, "optional, not configured", style="normal")
    save(fig, "figB_block_diagram", ly - 0.06)


def figR():
    """Evidence-grounded report drafting as implemented in reporting/reports.py and reporting/i18n.py."""
    H = 6.2
    fig, ax = canvas(H)
    cx = W / 2
    y = H - 0.02
    w = 2.6
    b = box(ax, cx - w / 2, y, w, "Stored analysis",
            "region records: box, FDI code or 'unassigned', closest class, raw score, uncertainty, review flags")
    arrow(ax, cx, b, cx, b - 0.11)
    b = box(ax, cx - w / 2, b - 0.11, w, "Evidence bundle",
            "one finding per region with a stable id (F1, F2, ...); model versions")
    # two drafting paths
    xs, bw = grid(2, 0.2)
    tt = b - 0.13 - 0.11
    fan(ax, cx, b, [x + bw / 2 for x in xs], tt, drop=0.13)
    label(ax, cx + 0.05, b - 0.065, "mode: template (default) or llm", ha="left")
    specs = [("Template generator", "deterministic sentences; deployed and used for every report"),
             ("LLM rewording", "optional OpenAI-compatible endpoint, temperature 0, de-identified findings; not configured, never run live")]
    h = max(need(bw, n, d) for n, d in specs)
    block(ax, xs[0], tt, bw, h, *specs[0])
    block(ax, xs[1], tt, bw, h, *specs[1], ls=DASH)
    b = tt - h
    tt = b - 0.2 - 0.11
    merge(ax, [x + bw / 2 for x in xs], b, cx, tt, drop=0.2)
    b = box(ax, 0, tt, W, "Report validator",
              "schema and required fields; findings match the evidence (FDI, label, score, uncertainty); valid FDI codes; "
              "no tooth, number or finding name absent from the evidence; no diagnostic or treatment phrases")
    xs2, bw2 = grid(2, 0.2)
    tt = b - 0.13 - 0.11
    fan(ax, cx, b, [x + bw2 / 2 for x in xs2], tt, drop=0.13)
    label(ax, xs2[0] + bw2 / 2 + 0.04, tt + 0.055, "passed", ha="left")
    label(ax, xs2[1] + bw2 / 2 + 0.04, tt + 0.055, "failed (LLM text)", ha="left")
    specs = [("English research draft", "status: unconfirmed research draft; disclaimer and limitations attached"),
             ("Rejected", "LLM text discarded; the template draft is used and the reasons are recorded")]
    h = max(need(bw2, n, d) for n, d in specs)
    block(ax, xs2[0], tt, bw2, h, *specs[0])
    block(ax, xs2[1], tt, bw2, h, *specs[1])
    yb = tt - h / 2
    arrow(ax, xs2[1], yb, xs2[0] + bw2, yb)
    b = tt - h
    x0 = xs2[0] + bw2 / 2
    xs3, bw3 = grid(3, 0.09)
    tt = b - 0.13 - 0.11
    poly(ax, [x0, x0], [b, b - 0.13])
    poly(ax, [xs3[0] + bw3 / 2, xs3[2] + bw3 / 2], [b - 0.13, b - 0.13])
    for x in xs3:
        arrow(ax, x + bw3 / 2, b - 0.13, x + bw3 / 2, tt)
    if xs3[0] + bw3 / 2 < x0 < xs3[2] + bw3 / 2:
        dot(ax, x0, b - 0.13)
    b = blocks(ax, xs3, tt, bw3, [("Hindi and Marathi", "fixed sentence templates; values copied verbatim; localization check"),
                                  ("Reviewer sign-off", "named reviewer; status becomes reviewed research draft"),
                                  ("Export", "HTML, TXT or JSON in the chosen language")])
    save(fig, "figR_report_generation", b - 0.02)


if __name__ == "__main__":
    figB()
    figR()
    print("written to", mf.OUT)

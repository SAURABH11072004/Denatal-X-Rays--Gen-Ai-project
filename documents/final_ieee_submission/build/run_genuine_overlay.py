"""Genuine model output for the paper's Fig. 3b (read-only; writes nothing to the app database).

Runs the four deployed checkpoints (Data/checkpoints/*_v1) through the same inference functions that
backend/services/pipeline.py uses, on DENTEX validation_data/.../val_12.png (unlabeled; the image of the archived
UI audit, docs/audit_evidence/shots/e2e_analysis.png). Detector boxes, FDI numbers (number_teeth + check_numbering),
Mask R-CNN masks matched one-to-one at IoU >= 0.5, and classifier candidates are saved as JSON next to the figure.
Run from the repository root:  .venv/Scripts/python.exe documents/final_ieee_submission/build/run_genuine_overlay.py
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[3]
sys.path[:0] = [str(ROOT / "src"), str(ROOT)]
from backend.services.pipeline import _greedy_match  # noqa: E402  (same matching rule as the application)
from dentexmodel.config import get_settings  # noqa: E402
from dentexmodel.inference.tooth_numbering import check_numbering  # noqa: E402
from dentexmodel.inference.torch_models import classify_regions, detect_teeth, number_teeth, segment_teeth  # noqa: E402
from dentexmodel.uncertainty import entropy  # noqa: E402
from dentexmodel.utils.geometry import rle_to_mask  # noqa: E402

OUT = Path(__file__).resolve().parents[1] / "figures"
OUT.mkdir(parents=True, exist_ok=True)
IMG = ROOT / "Data/validation_data/quadrant_enumeration_disease/xrays/val_12.png"

s = get_settings(ROOT)
img = np.asarray(Image.open(IMG).convert("RGB"), dtype=np.float32) / 255.0
H, W = img.shape[:2]
det = detect_teeth(img, "val_12", s)
dets = [dict(d.__dict__) for d in det.detections]
num = number_teeth(img, dets, s)
seg = segment_teeth(img, "val_12", s)
segs = [dict(d.__dict__) for d in seg.detections]
mm = _greedy_match([d["box"] for d in dets], [x["box"] for x in segs])
chk = check_numbering([{"box": d["box"], "fdi": d.get("fdi"), "fdi_confidence": d.get("fdi_confidence")} for d in dets], W, H)
cls = classify_regions(img, [d["box"] for d in dets], s)
thr = json.loads((ROOT / "Data/reports/uncertainty_thresholds.json").read_text(encoding="utf-8"))["review_if_any"]["normalised_entropy_ge"]

regions = []
for i, d in enumerate(dets):
    st = chk["teeth"][i]["status"] if d.get("fdi") is not None else "unassigned"
    p = cls["probabilities"][i]
    r = {"box": d["box"], "score": d["score"], "fdi": d.get("fdi"), "numbering_status": st,
         "mask_rle": segs[mm[i][0]].get("mask_rle") if i in mm else None, "mask_iou": mm[i][1] if i in mm else None}
    if p is not None:
        p = np.asarray(p, float)
        r.update(candidate=cls["class_names"][int(p.argmax())], score_top=float(p.max()), entropy=float(entropy(p)),
                 high_entropy=bool(entropy(p) >= thr))
    regions.append(r)

summary = {"image": str(IMG.relative_to(ROOT)), "size": [W, H], "models": {"detection": det.model_version, "segmentation": seg.model_version,
           "numbering": num["model_version"], "classification": cls.get("model_version")},
           "n_regions": len(regions), "n_numbered": sum(r["fdi"] is not None for r in regions),
           "n_number_needs_review": sum(r["fdi"] is not None and r["numbering_status"] != "assigned" for r in regions),
           "n_with_mask": sum(r["mask_rle"] is not None for r in regions), "n_high_entropy": sum(r.get("high_entropy", False) for r in regions),
           "entropy_threshold": thr}
(OUT / "fig3b_genuine_output.json").write_text(json.dumps({"summary": summary, "regions": regions}, indent=1), encoding="utf-8")
print(json.dumps(summary, indent=1))

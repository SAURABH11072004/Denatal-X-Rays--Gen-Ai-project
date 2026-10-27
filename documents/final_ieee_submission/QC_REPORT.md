# Quality-control report: final IEEE submission of the DentaMind AI paper (2026-10-25)

## Deliverables (in this folder)

| File | Content |
|---|---|
| `DentaMind_AI_IEEE_Final.docx` | editable manuscript: IEEE two-column, 12 pages, 7 figures, 17 tables, 15 numbered equations, Algorithm 1, 35 references |
| `DentaMind_AI_IEEE_Final.pdf` | the same paper, exported by Microsoft Word; every page was rendered and inspected |
| `DentaMind_AI_IEEE_Final_References.bib` / `.txt` | the 35 references in BibTeX and as rendered in the PDF, in IEEE citation order |
| `figures/` | per figure: editable SVG (text as text), SVG with outlined text (embedded in the DOCX), vector PDF, 600-dpi PNG; plus `fig3b_genuine_output.json` and `fig4_crop_sources.json` (provenance of the genuine images) |
| `build/` | `make_figures_final.py`, `run_genuine_overlay.py`, `build_paper_final.js`: everything needed to regenerate the files |

No earlier manuscript, figure or reference file was modified.

## What the reference folder contained

`documents/dentist-research-paper.pdf` (with `dentist-research-figures/`) is the previous version of this same DentaMind AI paper, not an external paper. Its figures were schematic drawings, and its Fig. 3b was an application screenshot.

* **Kept:** its structure, its IEEE layout and all of its verified content.
* **Visual direction:** taken from the v3 figure redesign (strict black and white, vector), with genuine images added where they exist.

## Figures

| Fig. | Change | Genuine evidence |
|---|---|---|
| 1 Architecture | layered vector diagram (input, pipeline, services, interface); trained networks in bold | — |
| 2 Workflow | ten steps grouped by phase, with outputs and failure behaviour | — |
| 3 Detection, numbering, segmentation | (a) vector data flow; **(b) genuine output of the four deployed checkpoints on `val_12.png`**: Mask R-CNN masks, detector boxes and FDI numbers | re-run on 2026-10-25 with `Data/checkpoints/*_v1`, through the same functions the application uses (`run_genuine_overlay.py`). It reproduces the archived UI audit exactly: 32 regions, 27 numbered, 1 number flagged ("41?"), 30 masks |
| 4 Classification | vector workflow plus **one genuine 224 × 224 training crop per class**, cut with the classifier's own `crop_region` rule | crops chosen deterministically (the training box closest to the class-median area); sources in `fig4_crop_sources.json` |
| 5 Uncertainty and review | thresholds table and routing; offline-only work in a separate dashed panel | — |
| 6 Data protocol | grouped split, a bar drawn to the configured proportions, split-role and leakage tables | — |
| 7 Evaluation framework | task × split matrix | — |

* **No illustrations stand in for real images.** Panel 3b and the crops in Fig. 4 are unaltered DENTEX pixels with model output overlaid.
* **Diagrams** are pure vector graphics. The PDF contains only 2 raster images, Fig. 3b and Fig. 4, both from real data.
* **Colour** is used only in Fig. 3b, to tell apart neighbouring tooth masks.

## Manuscript changes

* **Abstract:** rewritten (about 240 words) with the same numbers. It now also states that splits are grouped by pixel hash and that the test-split log exists.
* **Introduction:** rewritten. The motivation now rests on stage interaction and trustworthy evaluation, citing the new leakage and near-duplicate references.
* **Related Work:**
  - expanded into four strands: numbering and segmentation, findings, reliability, and data plus human factors;
  - Table I gains two rows.
* **Algorithm 1 (new):** per-image analysis and review routing, written step by step from `backend/services/pipeline.py`.
* **Figure captions:** all seven rewritten to describe content rather than file names; the genuine-image figures state their provenance and licence.
* **Section XII:** retitled to match its content ("Active Learning, Inference Cost and Software Verification").
* **Section X-B:** labelled as the ablation study.
* **Ethics:** now states the DENTEX licence (CC BY-NC-SA 4.0) and the attribution for the reproduced radiographs. This replaces "no radiograph is reproduced", which is no longer true.
* **Conclusion:** rewritten to say where effort is most needed (labels for the rare classes, a "no finding" class, external data).
* **Unchanged:**
  - all results, tables, equations and negative findings;
  - the CV5 sentence;
  - the Acknowledgment, including the AI-assistance disclosure.

## Scientific checks completed

* **Abstract numbers:** 13 headline numbers checked against their exact JSON keys in `Data/reports/`: AP50 0.966, mask AP50 0.974, Dice 0.873, FDI exact 0.968, accuracy 0.785, macro-F1 0.646, Periapical Lesion recall 0.308, end-to-end 0.718 → 0.634, flagged 0.542, errors caught 0.868, ECE 0.048 → 0.036. All match.
* **Fig. 4 class counts** (1,550 / 438 / 412 / 120) recomputed from `Data/splits/combined_train.csv`: they match.
* **Fig. 3b counts** reproduced by a fresh model run (see the table above).
* **CV5 numbers** (0.677 ± 0.008, 0.698 ± 0.007, 541 radiographs, 2,851 findings) taken from `cv5_results.json`, whose checksum matches `SHA256SUMS.txt`.
* **Body numbers:** all 354 decimals were reconciled with the source reports in the 2026-10-24 QC (`documents/dentist-research-qc-report.md`). No result in the body was changed after that.
* **Claims:** no clinical-validation, diagnostic or patient-level independence claim is made. Offline-only methods (temperature scaling, alternative abstention rules, retraining) are labelled as not deployed in the text and in Fig. 5.
* **PDF:** 12 pages; all seven figure captions and Algorithm 1 present; no "Error!" or "??" markers; 35 reference entries, and the highest citation number in the text is [35]; guide name "Dr. Pradnya Narkhede" correct.

## References added (8, all 2024–2026, verified)

Each entry's title, authors, venue, volume, pages or article number, year and DOI were taken from the Crossref record. Each was checked against its abstract (PubMed or Semantic Scholar where available) for the statement it supports.

| Key | Reference | Cited for | Abstract check |
|---|---|---|---|
| zhangJBHI | Zhang et al., IEEE JBHI 2025 (early access), doi 10.1109/JBHI.2025.3643805 | multi-stage tooth instance segmentation and FDI numbering | abstract read (Semantic Scholar) |
| brahmi | Brahmi et al., Eng. Appl. AI 133:108510, 2024 | systematic review of CNN segmentation in dental radiography | title and venue only; **no abstract retrieved** |
| huangUQ | Huang et al., Med. Image Anal. 97:103223, 2024 | review of uncertainty quantification methods | abstract read (PubMed, "Review") |
| lambertUQ | Lambert et al., Artif. Intell. Med. 150:102830, 2024 | review of uncertainty quantification for trustworthy clinical AI | abstract read (PubMed, "Review") |
| balanya | Balanya et al., Neural Comput. Appl. 36(14):8073–8095, 2024 | adaptive temperature scaling | abstract read (Crossref) |
| truong | Truong et al., IEEE ISBI 2024, pp. 1–5 | embedding-based near and exact duplicate detection | title only; **no abstract retrieved** |
| huangDup | Huang et al., Front. Med. 13:1955863, 2026 | near-duplicate contamination inflates benchmark performance | abstract read (PubMed) |
| rajpurkar | Rajpurkar and Topol, Radiology 316(1):e250477, 2025 | role separation of AI and human readers | **Editorial** (PubMed type); no abstract; cited only for the authors' argument, stated as an argument |

* **Retained:** all 27 earlier references, which were DOI-verified on 2026-10-24.
* **Not added, by design:** papers whose abstract could not be matched to a specific claim. Similar 2025–2026 YOLO numbering papers were left out to avoid padding.

## Unresolved issues (need the authors or the guide)

1. **Two new references need reading:** Brahmi et al. and Truong et al. were cited on the strength of their titles and venues; no abstract was retrieved. Read them to confirm. Zhang et al. (JBHI) is early access and has no volume or issue yet.
2. **Older items still open from the 2026-10-24 QC:**
   - skim references [1], [3], [5], [6] and [11];
   - Bittar et al. (2026) and Vazhentsev et al. (2026) have no final volume or pages yet.
3. **Fig. 3b and Fig. 4 reproduce DENTEX radiographs** under CC BY-NC-SA 4.0 with attribution. Confirm the target venue allows non-commercial-licensed images.
4. **Test-set ledger:** the 2026-10-16 Kaggle BASE test use, shown as "(6)" in the ledger table, is not appended to the ledger.
5. **Benchmark count:** the report says 10 images but lists 11 sizes. This is disclosed under Table XV.
6. **No similarity or plagiarism check has been run.** No score is claimed. Run the institution's checker. The text overlaps with the authors' own capstone report.
7. **AI-assistance disclosure** in the Acknowledgment: the authors must confirm the wording.
8. **Template:** the layout follows IEEE conference settings; no official IEEE template was available. If the venue supplies one, move the content into it.
9. **Layout:** Algorithm 1 is kept whole, which leaves part of page 5's right column empty.
10. **Small text in Fig. 3b:** the tooth-number labels are 5 pt, readable on screen and in print at 100 % but small. A full-width figure would enlarge them if the venue allows.

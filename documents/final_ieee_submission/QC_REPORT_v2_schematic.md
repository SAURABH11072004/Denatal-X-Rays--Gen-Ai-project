# Quality check: v2, schematic figures (2026-10-25)

**Scope.** In this version all seven figures are technical block diagrams: rectangular boxes, straight arrows, text labels and dashed explanatory notes, all black on white.
* No photograph, screenshot or raster image remains. The exported PDF contains **0 raster images**, and no figure SVG contains an `<image>` element.
* The previous final version (`DentaMind_AI_IEEE_Final.docx/.pdf`, which had model-output and crop images) is kept unchanged.
* Results, tables, equations, references and Algorithm 1 are the same as in that version.

## Deliverables

| File | Content |
|---|---|
| `DentaMind_AI_IEEE_Final_v2_schematic.docx` | editable manuscript: 12 pages, 7 figures, 17 tables, 15 equations, Algorithm 1, 35 references |
| `DentaMind_AI_IEEE_Final_v2_schematic.pdf` | matching PDF exported by Microsoft Word; every figure page inspected in grayscale at reading size |
| `DentaMind_AI_IEEE_Final_References.bib` | references (unchanged) |

## Editable source-file organization

```
final_ieee_submission/
├── figures_schematic/              v2 figures (pure vector)
│   ├── editable_svg/               SVG with text kept as text (Times New Roman); edit in Inkscape or Illustrator
│   ├── embed_svg/                  SVG with outlined text, embedded in the DOCX (renders identically everywhere)
│   ├── vector_pdf/                 one vector PDF per figure, e.g. for LaTeX or a journal upload
│   └── preview_png/                600-dpi PNG, used only as Word's fallback image and for quick viewing
├── build/
│   ├── make_figures_schematic.py   source of all seven figures: run  python make_figures_schematic.py <out_dir>
│   ├── build_paper_schematic.js    document generator: node build_paper_schematic.js figures_schematic <out.docx> <out.bib>
│   └── patch_*.py                  the recorded one-off edits that produced the v2 sources from v1
└── figures/  (v1, with images)     kept for reference; not used by v2
```

File names are the same in every folder: `fig1_architecture`, `fig2_workflow`, `fig3_detection_numbering_segmentation`, `fig4_classification`, `fig5_uncertainty_review`, `fig6_dataset_splits`, `fig7_evaluation_framework`.

Make visual edits in `build/make_figures_schematic.py` and regenerate, so that all formats stay identical. Hand-edit `editable_svg/` only for one-off changes.

## Design rules (all figures)

* **Colour and outlines:** white background, black lines and text, square-cornered boxes. Outlines are 0.6 pt; trained networks get 1.1 pt (legend in Fig. 1).
* **Connectors:** straight and orthogonal, entering and leaving boxes at their centres, with junction dots where lines branch. Flow runs top to bottom, or left to right inside a row.
* **Dashed boxes:** used only for notes, limitations and offline-only content.
* **Type:** Times New Roman at 7.5 pt for box titles and 7 pt for details, nothing below 6.6 pt. The one exception is the tooth numbers in Fig. 3b at 5.6 pt; they are still legible.
* **Size:** every figure is drawn at its printed single-column width (3.45 in).
* **Not used:** gradients, shadows, icons, 3D effects or coloured fills.

## Figure-to-caption consistency checklist

| Fig. | Caption says | Figure shows | Source of every value | Cited in text | Status |
|---|---|---|---|---|---|
| 1 | detector feeds number assignment, mask matching and classification; uncertainty signals become flags before the final result, reports and review; bold = trained network | input → pre-processing → detector → {FDI numbering, segmentation, classifier} → uncertainty signals → region records and final result → {report drafting, human review} → web interface; legend | `backend/services/pipeline.py`, checkpoint sidecars | Sec. I, V | ✔ |
| 2 | ten steps in order, two outputs, dashed unavailable/failed behaviour | numbered boxes 1–10 (pre-process, detect, number, segment, match, classify, classify flipped, flip passes, region records, final result); report draft and review queue; dashed note | `PipelineService.run()` step order and status handling | Sec. I, V | ✔ |
| 3 | (a) region record from detector, numbering and segmentation; (b) FDI notation, patient-right on image-left, molars wider | (a) numbering model and detector → number assignment (IoU ≥ 0.5) → consistency check; detector and segmenter → mask matching (one-to-one, IoU ≥ 0.5) → region record; (b) FDI chart 11–48 with quadrants | `number_teeth`, `check_numbering`, `_greedy_match`; ISO 3950 | Sec. I, VI-B ("Fig. 3a") | ✔ |
| 4 | tooth box → 10 % padding → 224 × 224 → ImageNet normalization → ResNet-50 → four-class softmax; crop counts and weights; dashed no-healthy-class note | same chain in two rows; four class boxes 1,550/0.41, 438/1.44, 412/1.53, 120/5.25; equation w = N/(K n), N = 2,520, K = 4; dashed note; tooth box marked detector (application) vs. GT (evaluation) | `trainers.crop_region`; classifier sidecar; counts re-derived from `combined_train.csv` | Sec. I, VI-C (twice) | ✔ |
| 5 | deployed thresholds and routing; dashed panel offline only | thresholds table (0.397, 0.076, 0.30, 0.50, numbering); every region → final result; flagged → review queue → human review → second approver; dashed offline panel (T = 0.95, 33 rules, retraining never run) | `uncertainty_thresholds.json`, `pipeline.py`, `final_result.py`, `reviews.py`, abstention report | Sec. I, VI-E | ✔ |
| 6 | pixel-hash grouping, seeded split, leakage checks, gated test evaluation; dashed note on what cannot be checked | DENTEX counts → group by pixel hash → seeded split (seed 42; 0.70/0.10/0.10/0.10) → train 794 / val 113 / cal 113 / test 113 → duplicate and leakage checks (0 / 0 / 0 confirmed) → protected test evaluation (flag, authorizer, reason, ledger); dashed patient-level note | `dataset_audit.md`, `configs/data.yaml`, `leakage_check.md`, test-ledger code | Sec. I, IV-C, VIII | ✔ |
| 7 | tasks, metrics and splits; GT-crop and detector-crop evaluation listed separately | matrix: detection, segmentation, numbering, classification (GT crops), end-to-end (detector crops), calibration, abstention, active learning, variants, leakage, benchmark × Val./Cal./Test | `scripts/evaluate_*.py`, `Data/reports/*` | Sec. I, VIII | ✔ |

**Further checks:**
* Figure numbers follow first citation, 1 to 7.
* Each caption is outside its graphic and directly below it, kept with the figure.
* No figure is split across a page or column.

## Accuracy rules applied

* Every box, threshold, count, model name and metric is copied from the manuscript or the cited source. No stage, connection or number was added.
* The ground-truth crop versus detector crop distinction is explicit in Fig. 4 (tooth-box box) and Fig. 7 (separate rows).
* Offline-only methods appear only in the dashed panel of Fig. 5, with no arrow into the deployed flow.

## Text changes required by removing the images (only these)

1. **Fig. 3b caption:** returned to the FDI-notation wording.
2. **Fig. 4 caption:** describes the block chain instead of the training crops.
3. **Section XI-D:** the sentence about re-analysing the radiograph for Fig. 3b was removed. The archived UI-audit numbers stay.
4. **Ethics paragraph:** "All figures are schematic diagrams; no radiograph is reproduced"; the DENTEX licence sentence is kept.
5. **Captions of Figs. 2, 6 and 7:** reworded to match the new diagrams.

## Inspection of the exported PDF

| Item | Result |
|---|---|
| Figure placement | page 4: Figs. 1–2; page 5: Figs. 3–4 and Algorithm 1; page 6: Fig. 5; page 7: Figs. 6–7 |
| Raster images in PDF | 0 |
| Clipping, overlapping text, broken arrows | none found (two defects fixed before export: the Fig. 2 connector ran off the top edge; a Fig. 4 label overlapped a branch line) |
| Broken references ("Error!", "??") | none |
| Guide name | "Dr. Pradnya Narkhede", correct |

## Still open (unchanged from QC_REPORT.md)

1. **References to read:** Brahmi et al. and Truong et al. were cited without a retrieved abstract.
2. **Test-set ledger:** the 2026-10-16 entry is not yet recorded.
3. **Benchmark count:** the report says 10 images but lists 11 sizes.
4. **Similarity check:** not yet run.
5. **AI-assistance disclosure:** the wording needs the authors' confirmation.
6. **Template:** the layout follows IEEE settings, not an official IEEE template.

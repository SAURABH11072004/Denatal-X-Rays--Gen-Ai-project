# Quality-Control Report: `dentist-research-paper.docx`

Generated 2026-10-24. Paper title: *DentaMind AI: An Uncertainty-Aware Pipeline for Tooth Detection, FDI Numbering, Segmentation and Finding Classification on Panoramic Dental Radiographs*.

## 1. Deliverables (all in `D:\Dentex-Gen Ai\documents\`; no existing project file was overwritten)

| File | Content |
|---|---|
| `dentist-research-paper.docx` | The paper: IEEE two-column, US Letter, Times New Roman, 11 pages. It has 17 tables, 7 figures, 15 numbered Word (OMML) equations and 27 references. |
| `dentist-research-paper.pdf` | The same paper exported by Microsoft Word, used for the visual check. |
| `dentist-research-references.bib` | The 27 references in BibTeX, listed in citation order. |
| `dentist-research-qc-report.md` | This report. |
| `dentist-research-figures/` | `make_figures.py` (diagram source), `build_paper.js` (document generator), and each figure as `.svg` (text as outlines), `_editable.svg` (text kept as text), `.pdf` and a 600-dpi `.png`. |

## 2. Author information

The author block is copied exactly from the existing paper (`documents/123B1B260-Research_Paper_Final.docx (2).pdf`):

- **Authors and order:** Nilesh Sonawane, Saurabh Mali, Sadhyoj Hanwate, Sachet Lothe.
- **Guide:** Dr. Pradnya Narkhede.
- **Department:** Department of Computer Engineering.
- **Institution:** Pimpri Chinchwad College of Engineering (PCCOE), Pune, Maharashtra, India.

## 3. Evidence inventory: results found and where they come from

Every table cites its source file in a note under the table. Metrics come from these sources:

| Task / study | Split(s) | Source file(s) | Paper |
|---|---|---|---|
| Tooth detection (mAP, AP50, TP/FP/FN, P/R @ 0.3) | val 69 / test 63 | `Data/reports/eval_dentex_teeth_detection_v1_{val,test}.json` | Table V |
| Segmentation (box/mask AP50, mask IoU, Dice) | val / test | `eval_dentex_teeth_segmentation_v1_{val,test}.json` | Table V |
| FDI numbering (AP50, coverage, exact/strict/quadrant accuracy, per tooth) | val / test | `eval_dentex_fdi_numbering_v1_{val,test}.json` | Table VI |
| Finding classification, per class, confusion matrices | val 65 / test 73 | `eval_dentex_findings_classification_v1_{val,test}.json` | Tables VII, VIII |
| End-to-end, detector → classifier | val | `end_to_end_validation_evaluation.md/.json` | Table IX |
| Imbalance, crop jitter, recipe and Kaggle experiments | val (Kaggle BASE also test) | `docs/audit_evidence/ml_improvement/imbalance/report.md`, `crop_robustness_experiment.md`, `training_recipe_comparison_results.md`, `checkpoints/kaggle_candidates/dc9c505b/README.md`, `reports/training_summary.md` | Table X |
| Uncertainty, calibration, ECE, Brier, AUROC, flagging | cal / test | `uncertainty_evaluation.json`, `uncertainty_thresholds.json` | Table XI |
| Flip instability of masks and detections | val, 30 films | `instability_validation.json` | Table XII |
| Abstention rules | cal / val | `docs/audit_evidence/ml_improvement/abstention/report.md` | Table XIII |
| Active learning | val | `active_learning_experiment.md/.json`, `docs/UNCERTAINTY_AND_ACTIVE_LEARNING.md` | Table XIV |
| Inference benchmark | 10 images | `benchmark_inference.json` | Table XV |
| Leakage checks | all splits | `leakage_check.md` | Table XVI |
| Test-split usage | test | `test_set_ledger.json`, `reports/p5_disclosure_entry.json` | Table XVII |
| Dataset and split statistics | — | `dataset_audit.md`, `reports/training_summary.md` | Tables II, III |
| Training configuration | — | `Data/checkpoints/*.json` sidecars, `src/dentexmodel/training/trainers.py` | Table IV |

**Results kept even though they are negative:**

- Periapical Lesion test recall is 0.308.
- Macro-F1 drops when detector boxes replace ground-truth boxes.
- Every classifier-improvement attempt failed its acceptance criteria.
- Active learning did not beat random selection.
- Temperature scaling made calibration-split ECE worse.
- The flip-instability AUROCs are weak (0.593 and 0.644).
- The abstention candidate was rejected.

**Specific checks requested in the brief, all confirmed against `uncertainty_evaluation.json/.md`:**

- 54.2 % of test crops are flagged (`flagged_for_review_fraction` = 0.5424).
- 86.8 % of errors fall in the flagged set (`errors_caught_fraction` = 0.8684).
- ECE goes from 0.048 to 0.036 with temperature scaling.
- Temperature scaling is not applied in the app. This is stated in the report, in `KNOWN_LIMITATIONS.md` and in a `backend/services/pipeline.py` note.
- Thresholds were chosen by Youden's J on the calibration split, with one seed and one dataset, and are marked provisional (`scripts/evaluate_uncertainty.py` lines 125–173).

**Derived numbers.** These appear in the paper but are calculated rather than copied:

- "66 of 76" errors: 354 × (1 − 0.785) = 76 errors; 192 flagged × 0.34375 = 66.
- 13.2 % = 1 − 0.868.
- 1.65 GB = 1,653.3 MB.
- Class weight N / (K·n_c): 2,520 / (4 × 120) = 5.25, which matches the sidecar.

**One number read from an image:** 1.92 s and the 32/27/30/26 region counts in Fig. 3b come from the archived screenshot `docs/audit_evidence/shots/e2e_analysis.png`, not from a JSON report.

**Automated reconciliation.** A script extracted all 354 decimal numbers in the paper body (225 distinct) and matched them against every value in the source reports. Only 1.65, 1.92 and 13.2 were unmatched, which are the derived or screenshot values listed above. The tables were also cross-checked by hand while writing.

**Not reported, because no evidence exists:**

- Per-class results for any external dataset.
- Patient counts.
- Confidence intervals over seeds for the deployed models.
- Results on the official DENTEX test set, which uses a Turkish taxonomy and was excluded.
- Any clinician reader study.
- Retraining with approved reviews (implemented, never run).
- Live LLM report generation and the Label Studio loop (not exercised).
- Mean mask IoU and Dice on validation. The validation report does not contain them, so the table shows "n.r.".

## 4. Conflicts and inconsistencies found in the evidence (all disclosed in the paper)

1. **Benchmark image count.** `benchmark_inference.json` says `n_images: 10` but lists 11 image sizes. Disclosed in the Table XV note. Unresolved.
2. **A test-split use missing from the ledger.** The Kaggle BASE recipe was evaluated on the internal test split on 2026-10-16. A disclosure entry (`reports/p5_disclosure_entry.json`) was prepared, but `Data/reports/test_set_ledger.json` still holds only 5 entries. Shown as "(6)" in Table XVII. **Action for the authors: append the entry to the ledger.**
3. **Deployed classifier: 0.649 vs. 0.651.** Detector-box macro-F1 is 0.649 with live boxes and 0.651 with cached boxes rounded to 0.01 px; the recipe report explains the difference. The paper uses 0.649 in Table IX and quotes 0.651 only in the recipe comparison, where it is labelled as the cached-box value.
4. **Temperature scaling.** It improves test ECE but worsens calibration ECE (0.071 → 0.076). Both values are reported.
5. **Validation vs. test, numbering.** Numbering exact accuracy is higher on test (0.968) than on validation (0.936). Reported as is and not interpreted.

## 5. Dataset integrity

- The official DENTEX test set is **excluded**: it uses a Turkish, treatment-oriented taxonomy with no verified mapping (Section IV-B).
- The scope of the leakage checks is stated exactly: identical and near-identical films only. Patient-level leakage **cannot be excluded** because DENTEX has no patient identifiers. The paper says this in the abstract and in Sections IV, XIII and XIV.
- The paper does not state a patient count anywhere. Image counts are labelled as entries or as distinct radiographs.
- The internal test split had already been used, and the paper says so. The four checkpoints are legacy: their image-level training membership was not recorded.

## 6. Citations

- There are **27 references**, numbered by first appearance. The generator stops with an error if any reference is uncited or any key is unknown. All figures and tables are numbered by first citation, and each is cited in the text.
- **DOIs verified** (Crossref, or DataCite for arXiv) for 24 of 27 references: title, authors, venue, volume and pages all checked.
- **Three references have no DOI, which is normal for these venues:**
  - [15] Guo et al., ICML 2017 (PMLR 70).
  - [12] Geifman and El-Yaniv, NIPS 2017.
  - [22] ISO 3950:2016 (a standard).
- **Partly verified:**
  - [13] Vazhentsev et al., *npj Artificial Intelligence* 2026: the DOI resolves, but Crossref lists no volume or article number yet.
  - [7] DENTEX is an arXiv preprint and is labelled as one.
- **Accuracy of claims about cited work.** Statements about [2] and [4] (dataset sizes, method) were checked against the Crossref abstracts. Statements about the other papers stay at the level of their titles and venues and do not quote their results.
- **Not done:** reading the full text of each cited paper. The authors should skim [1], [3], [5], [6] and [11] to confirm the one-sentence descriptions.

## 7. Formatting and rendering checks that actually ran

| Check | Tool | Result |
|---|---|---|
| OOXML schema validation | `docx` skill `validate.py` (XSD) | **PASSED**, after fixing one OMML `<m:nary>` schema error |
| Rendering | Microsoft Word 16 (COM) → PDF, then PyMuPDF raster | 11 pages, all opened and inspected |
| Visual page inspection | every page viewed at 100 dpi, problem pages at higher resolution | No clipped tables, overlapping text, broken images or empty placeholders. Captions stay with their figures and tables (keep-with-next). The last page is balanced. |
| Spelling | Word proofing engine (en-US) | 201 flags: proper names, file paths and code identifiers, plus British spellings, which were then standardized to American (IEEE style) |
| Grammar | Word proofing engine | 22 flags, reviewed: sentence fragments in table notes (file names), `mAP@[.5:.95]` notation and reference entries. No real grammar errors found |
| Numbers vs. evidence | custom script (Section 3) | 225 distinct decimals; 3 unmatched, all explained |

**Layout notes:**

- Figures are full single-column width (3.4–3.46 in), and the smallest text in a figure is about 5.9 pt.
- Table body text is 7–7.5 pt, which is standard IEEE.
- Table XVII and Table X use 7 pt.
- The formatting was built from IEEE conference settings (two columns, 0.25 in gutter, small-caps Roman-numeral headings) and the layout of the supplied paper. **No official IEEE `.dotx` template was available in this environment.** If the venue supplies one, paste the content into it.

## 8. Originality and similarity

- **No similarity checker was run.** None (Turnitin, iThenticate or similar) is available in this environment, so **no similarity score was obtained**, and none is claimed.
- The text was written from the repository's own reports and code. No passages were copied from the cited papers.
- AI-detection outcomes are not claimed or guaranteed.

## 9. Diagrams

| Fig. | Content | Basis | Status label |
|---|---|---|---|
| 1 | Overall architecture | `backend/main.py`, `backend/services/pipeline.py`, `configs/models.yaml`, frontend components | implemented |
| 2 | Ten-step processing workflow | `PipelineService.run()` step names | implemented |
| 3 | (a) detection → numbering → mask matching; (b) **genuine app output** | `number_teeth`, `resolve_numbering`, `check_numbering`; screenshot `docs/audit_evidence/shots/e2e_analysis.png` | implemented; (b) is unlabeled, no ground truth |
| 4 | Classification workflow, class counts and weights | `classify_regions`, `crop_region`, classifier sidecar | implemented |
| 5 | Uncertainty-aware review | thresholds, `final_result.py`, `reviews.py`; offline items in a separate dashed box | deployed vs. **offline-only** clearly separated |
| 6 | Dataset splits and leakage protocol | `splits.py`, `configs/data.yaml`, `dataset_audit.md`, `leakage_check.md` | implemented |
| 7 | Evaluation framework | evaluation scripts and reports | implemented |

**Fig. 3b licensing:** it is a crop of a project UI screenshot showing a DENTEX radiograph (`val_12.png`). The authors should confirm that the DENTEX license allows the image to be reproduced in a publication.

## 10. Unresolved issues for the authors

1. **Ledger entry.** Append the Kaggle BASE test use (2026-10-16) to `test_set_ledger.json`.
2. **Benchmark count.** Resolve the 10 vs. 11 image-size discrepancy in `benchmark_inference.json`.
3. **Fig. 3b license.** Confirm the DENTEX license allows the panoramic image to be reproduced.
4. **Venue template.** If the venue requires its official IEEE template, transfer the content into it and re-check the layout.
5. **Similarity check.** Run your institution's similarity checker before submission.
6. **Citation descriptions.** Skim [1], [3], [5], [6] and [11] to confirm the one-line descriptions, and check [13] for a final volume or article number.
7. **No external test set.** All results are internal DENTEX results. The paper states this, and no clinical claim is made.

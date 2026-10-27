# DentaMind AI IEEE paper: v3 with redesigned figures (2026-10-25)

**Scope.** This is a visual revision only.
* All seven figures were redrawn from scratch.
* The text, results, tables, equations and references are unchanged. The one exception is the Fig. 3 caption: "molars are shaded" became "molars are drawn wider", because the new figure has no gray fill.
* The previous version, `../DentaMind_AI_IEEE_Paper_Submission.docx`, and every earlier file are untouched.

## Files

| File | Content |
|---|---|
| `DentaMind_AI_IEEE_Paper_v3_redesigned_figures.docx` | editable paper: 11 pages, 7 figures, 17 tables, 15 equations, 27 references |
| `DentaMind_AI_IEEE_Paper_v3_redesigned_figures.pdf` | exported by Microsoft Word; all figures are vector graphics (the PDF contains 0 raster images) |
| `DentaMind_AI_IEEE_Paper_References.bib` | references (unchanged) |
| `figures/figN_*_editable.svg` | editable vector source; text is kept as text (Times New Roman) |
| `figures/figN_*.svg` | vector with text outlined; this is the version embedded in the DOCX |
| `figures/figN_*.pdf` | vector PDF of each figure |
| `figures/figN_*.png` | 600-dpi PNG, used only as Word's fallback image |
| `build/make_figures_v3.py` | figure source; run `python make_figures_v3.py <out_dir>` |
| `build/build_paper_v3.js` | document generator, a copy of the submission generator with the changes below |

## Design rules applied to every figure

* Black on white; square-cornered blocks; 0.6 pt outlines.
* Trained networks have a 1.1 pt outline, explained by the legend in Fig. 1.
* Dashed containers mark only real groupings, such as offline-only versus deployed.
* Orthogonal connectors, with junction dots where lines branch.
* Times New Roman: 7.5 pt names, 7 pt details, nothing below about 5.6 pt (the tooth numbers in Fig. 3b).
* Every figure is drawn at its printed size, one IEEE column (3.45 in).
* No screenshots, no shading, no icons, no gradients.

| Fig. | Design |
|---|---|
| 1 | layered architecture (input, pipeline, services, interface); trained networks in bold |
| 2 | ten pipeline steps as a phase-grouped table (localization, classification, stability check, aggregation), with the two outputs |
| 3 | (a) detector boxes feed both number assignment (with the numbering model) and mask matching (with the segmenter), and both merge into a region record; (b) a drawn FDI tooth chart |
| 4 | schematic crop with 10 % padding, the 224 px resize and ResNet-50 drawn as an encoder; class table with training crops and weights |
| 5 | deployed thresholds table, then "every region" to the final result and "flagged regions" to the review queue, human review and second approver; a separate dashed panel holds the offline-only work, with no arrow into it |
| 6 | DENTEX source, grouped split, a bar drawn to the 0.70 / 0.10 / 0.10 / 0.10 proportions, the split-role table, and the leakage-check results table |
| 7 | task × split matrix (validation, calibration, test) |

All thresholds, counts, metrics and component names are copied from the manuscript and the earlier figure source. No value was changed.

## Layout changes in `build_paper_v3.js` (layout only)

* **Tables:** tables of up to 10 rows are kept in one column, using keep-with-next on their rows. Longer tables may continue in the next column. Before this, Table VII split across columns without its header, because Word does not repeat header rows across columns.
* **Fig. 3 caption:** the wording change described under Scope.

## Checks

* **Rendering:** every figure was inspected as a 600-dpi PNG and on each PDF page at reading size, in grayscale.
* **Defects fixed during the checks:**
  - text crossing arrows (Fig. 1);
  - a label overlapping a connector (Fig. 1);
  - split "IoU ≥ 0.5" line breaks (Fig. 3);
  - a connector crossing captions (Fig. 4);
  - rules running through text (Fig. 7);
  - a truncated last row (Fig. 7);
  - column gaps caused by figure height.
* **Text:** the DOCX text was compared with the previous submission, and only the Fig. 3 caption line differs.
* **PDF:** 11 pages; all of Fig. 1 to Fig. 7 are present; no "Error!" or "??" markers; the guide's name appears correctly (2 occurrences).

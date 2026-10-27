# Submission notes: DentaMind AI IEEE paper (2026-10-25)

**Paper:** "DentaMind AI: An Uncertainty-Aware Pipeline for Tooth Detection, FDI Numbering, Segmentation and Finding Classification on Panoramic Dental Radiographs"

**Authors:** Nilesh Sonawane, Saurabh Mali, Sadhyoj Hanwate, Sachet Lothe. Guide: Dr. Pradnya Narkhede.

**Department:** Computer Engineering, PCCOE, Pune.

## Files

| File | Content |
|---|---|
| `DentaMind_AI_IEEE_Paper_Submission.docx` | editable paper: IEEE two-column, 11 pages, 17 tables, 7 figures, 15 numbered equations, 27 references |
| `DentaMind_AI_IEEE_Paper_Submission.pdf` | the same paper, exported by Microsoft Word |
| `DentaMind_AI_IEEE_Paper_References.bib` | the 27 references in BibTeX, in citation order |
| `build/build_paper_submission.js` | generator copy used for this version |
| `figures/`, `build/make_figures_v2.py` | the redrawn figures (SVG, PDF, 600-dpi PNG) and their source |
| `previous/` | the first submission version (with the screenshot in Fig. 3b), kept for reference |

The source paper `documents/dentist-research-paper.docx` and its generator were not changed. Rebuilding the unchanged generator reproduces that paper's text exactly.

## Changes from `documents/dentist-research-paper.docx`

1. **Conclusion:** the sentence "A grouped five-fold cross-validation design has been drafted but has not been approved or run" was out of date. It now reports the completed run: 541 radiographs, 2,851 findings, macro-F1 0.677 ± 0.008 on detector boxes and 0.698 ± 0.007 on ground-truth boxes. These values come from `kaggle/artifacts_cv5_run1/cv5_results.json`, and that file's checksum matches `SHA256SUMS.txt`.
2. **Acknowledgment added:** it thanks the guide and discloses AI-assisted drafting, as IEEE requires.
3. **All 7 figures redrawn in one consistent style:**
   - gray title bands, equal box heights within a row, connectors centred on the boxes;
   - plain-language labels instead of code names;
   - grayscale only.
4. **Fig. 3b replaced:** the application screenshot is now a drawn FDI (ISO 3950) tooth chart. Its caption was updated. The screenshot counts (32 regions, 26 flagged, 1.92 s) are kept in the text and cited to the archived UI audit.

The guide's name was already correct everywhere ("Dr. Pradnya Narkhede"). The title, authors and affiliation are unchanged.

## Verification done

* **Abstract numbers:** all 13 headline numbers were re-checked against their exact keys in `Data/reports/*.json`, and all match. On 2026-10-24, all 354 decimals in the body were reconciled with the source reports; see `documents/dentist-research-qc-report.md`.
* **PDF:** opened and rendered; all 11 pages were inspected in grayscale.
* **Text checks:** no "Error!" or "??" reference markers; 27 of 27 references listed; the guide name is correct.

## Open items for the authors and guide

1. **Test-set ledger:** the 2026-10-16 Kaggle BASE test use is shown as "(6)" in Table XVII. It is not yet appended to `test_set_ledger.json`.
2. **Benchmark image count:** `benchmark_inference.json` says 10 images but lists 11 sizes. This is disclosed in the note under Table XV.
3. **Fig. 3b licence:** resolved. No radiograph is reproduced any more; all figures are schematic.
4. **Similarity check:** none has been run. Run the institutional checker before submission. There is self-overlap with the capstone report.
5. **References:** read [1], [3], [5], [6] and [11] to confirm their one-line descriptions. Check whether [13] has a final volume or article number.
6. **Template:** no official IEEE `.dotx` template was used. The layout follows IEEE conference settings. If the venue requires its own template, move the content into it.
7. **Scope of the results:** all results are internal DENTEX results with one seed. The internal test split has already been used, and there is no external test set and no clinician reader study. The paper states that the system is not clinically validated.
8. **Acknowledgment wording:** the authors should confirm the AI-assistance disclosure.

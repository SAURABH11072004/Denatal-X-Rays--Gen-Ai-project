# DentaMind AI IEEE manuscript, v5 (10 pages): quality-control report, 2026-10-26

**Result: the exported PDF has exactly 10 pages**, counted with PyMuPDF on `DentaMind_AI_IEEE_v5.pdf`, US Letter (612 × 792 pt).
The submission blockers carried over from v4 are still open (Section 8). This version does not resolve them.

## 1. Deliverables in this folder

| File | Content |
|---|---|
| `DentaMind_AI_IEEE_v5.docx` | Final editable manuscript |
| `DentaMind_AI_IEEE_v5.pdf` | Word export of the DOCX (Word COM, `SaveAs` format 17): 10 pages |
| `DentaMind_AI_IEEE_v5_References.bib` | 24 references in IEEE citation order |
| `figures_schematic/` | Figure sources, unchanged from v4: editable SVG, embed SVG, PNG previews, vector PDF |
| `build/build_paper_v5.js` | Self-contained generator for the DOCX and BibTeX |
| `build/make_figures_v4.py` | Figure generator (figures not modified in v5) |
| `build/qc/` | Export script and QC scripts used for this report |
| `v4_baseline/` | Copies of the v4 DOCX, PDF, BibTeX and status report, plus a SHA-256 manifest of the original v4 folder |

**Originals:** `../final_ieee_submission_v4/` was not modified. All 34 files match the SHA-256 manifest taken before editing.

**Rebuild:**
```
set NODE_PATH=<folder containing docx@9.5.1 and jszip@3.10.2>
node build/build_paper_v5.js figures_schematic DentaMind_AI_IEEE_v5.docx DentaMind_AI_IEEE_v5_References.bib
powershell -File build/qc/export.ps1 -src <abs path>.docx -pdf <abs path>.pdf
```
A rebuild reproduces `word/document.xml` and the `.bib` byte-for-byte.

## 2. Baseline vs. final

| Item | v4 (original) | v5 (final) |
|---|---|---|
| Pages (PDF) | 12 | **10** |
| References | 35 | **24** (all cited, first citations in order [1] to [24]) |
| Figures | 7 | 7 (same sources, same size: 3.45 in wide) |
| Tables | 17 | 12 |
| Numbered equations | 15 | 11 |
| Algorithm boxes | 1 | 1 |
| Body / caption / table / reference font | 10 / 8 / 7.5 / 8 pt Times New Roman | unchanged |
| Margins (top/bottom/left/right) | 0.75 / 1.0 / 0.625 / 0.625 in | unchanged |
| Columns | 2, 0.25 in gap | unchanged |

**Parity check:** rebuilding v4 in the same environment reproduced its 12 pages with the same per-page layout. The page counts above therefore come from one rendering environment.

## 3. How the length was reduced

Font sizes, margins, spacing and figure sizes were not changed. The reduction came from editing, plus one layout change.

1. **Structure (15 to 10 sections):**
   * the Research Gap section was merged into the Introduction, and the roadmap paragraph was removed;
   * Architecture, Methodology and Training were merged into Section IV;
   * Results, Error Analysis, Inference Cost and Software Verification were merged into Section VI;
   * Active Learning was moved into Section VII;
   * Future Work was merged into the Conclusion.
2. **Related work:** grouped by task (detection/numbering/segmentation, findings, uncertainty, data integrity). The 11-row comparison table was removed because each retained study is described in one sentence.
3. **Tables folded into text, all key numbers kept:**
   * flip-instability validation: AUROC 0.593 and 0.644, 851 and 878 regions, 51.8 %, 27 FPs, 0.598 vs. 0.439;
   * active learning: paired differences, win counts, and the values at 300 films;
   * inference benchmark: mean latency and peak memory per stage, 1.92 s per full analysis;
   * leakage checks: 17 of 18 pass, one warning, 794/113/113/113 films.
   Dropped as a result: per-budget values below 300 films, and median, p95 and images/s latency figures.
4. **Classifier-improvement table:** condensed from 13 to 9 rows. The five non-best imbalance variants are given as a range (0.742 to 0.766), and the no-rebalancing reference (0.751 ± 0.017) is in the table note. All baselines, verdicts and the Kaggle range are kept.
5. **Equations (15 to 11):**
   * IoU and Dice now share one line;
   * Youden's J is now inline;
   * the AP interpolation sum and the macro-F1 formula are now one-line verbal definitions, with COCO AP cited [23].

   All thresholds, class weights, H, JS, u_mask, S, P/R/F1, ECE, Brier, temperature scaling and coverage/risk equations remain.
6. **Prose:** repeated explanations removed, such as the deployed/offline distinction and the no-healthy-class point, each now stated once. Sentences were shortened and transitions made more direct.
7. **Figure placement (layout only):** v4 placed figures inline, and each figure that did not fit left 100 to 270 pt of empty column. v5 puts each figure and its caption in a borderless floating cell at the top of a column, anchored to a body paragraph near its first citation. Anchors never sit next to headings, because that tied headings to floats. This alone recovered about one column.

## 4. Preserved scientific content (verified)

* **Numbers:** every numeric token in the v5 body also appears in the v4 body. The only "new" token is a renumbered citation (`[9],`); script: `build/qc/numcheck.py`.
* **Removed numbers:** the numbers that disappeared are listed in item 3 above (dropped table cells) or are old reference numbers.
* **Unfavorable results all kept:**
  * Periapical Lesion recall 0.308;
  * the drop in end-to-end macro-F1 from 0.718 to 0.634;
  * 54.2 % flag rate and 13.2 % of errors missed;
  * mixed temperature-scaling result;
  * all four negative improvement studies, plus the deployed seed being the weakest of five;
  * the failed abstention candidate;
  * the negative active-learning result;
  * 1,580 of 1,903 unlabeled boxes still assigned a finding class;
  * the two test-split uses outside the ledger.
* **Distinctions kept:**
  * dataset entries vs. distinct radiographs vs. patients;
  * why the official test set is excluded (label mismatch, and 95 of 250 images byte-identical to training);
  * ground-truth-crop vs. detector-crop evaluation;
  * deployed vs. offline-only methods (Fig. 5, and an explicit paragraph in Section IX);
  * no clinical validation or diagnostic claim;
  * patient-level leakage cannot be excluded.
* **One correction:** v4's limitations paragraph said the splits have "65–73 radiographs per task". The detection/numbering/segmentation test split has 63 radiographs (Table II, eval reports), so v5 says "63 to 73".
* **Figures:** all 7 retained and cited in the text. Their labels contain no section or table numbers, so the restructure did not invalidate them. Fig. 5 still separates deployed from offline-only functions; Fig. 4 still shows the class counts and weights and the no-healthy-class note.

## 5. References: 35 to 24

**Removed (11), with the reason for each:**

| v4 # | Reference | Reason |
|---|---|---|
| [2] | Peker & Kurtoglu 2025 | Mixed-dentition YOLO numbering; background only; numbering claim covered by [1], [2] |
| [3] | Tang et al. 2025 | Supported only an interpretive aside ("missing teeth"), which was removed |
| [5] | Brahmi et al. 2024 | Segmentation review; general background |
| [7] | Raeisi et al. 2025 | Multi-label diagnosis; mentioned in passing only |
| [13] | Yalım et al. 2026 | U-Net cost comparison; method not used |
| [14] | Ayhan et al. 2024 | Bitewing modality; not directly comparable |
| [16] | Lambert et al. 2024 | Second UQ review; duplicates Huang et al. [12] |
| [18] | Vazhentsev et al. 2026 | Text-based abstention; duplicates Geifman [13]; metadata incomplete in v4 |
| [21] | Balanya et al. 2024 | Adaptive temperature scaling; never used |
| [24] | Truong et al. 2024 | Embedding-based dedup, explicitly "not applied" |
| [25] | Rajpurkar & Topol 2025 | Editorial, cited only for an argument that was removed |

**Retained (24), in v5 order:**
* [1] Putra
* [2] Zhang (JBHI)
* [3] Szabó
* [4] Bittar
* [5] Hamamci (DENTEX, arXiv)
* [6] Hamamci (MICCAI)
* [7] Kapoor & Narayanan
* [8] Huang (near-duplicate)
* [9] Faster R-CNN
* [10] Mask R-CNN
* [11] ResNet
* [12] Huang (UQ review)
* [13] Geifman
* [14] Wang (TTA)
* [15] Guo
* [16] Naeini
* [17] Wang (active learning)
* [18] ISO 3950
* [19] FPN
* [20] ImageNet
* [21] Lin (JS divergence)
* [22] Youden
* [23] COCO
* [24] Brier

Seven of these were published 2024 to 2026.

**Verification, re-run on 2026-10-26 (`build/qc/crossref_check.py`):**
* All 21 entries with a DOI were checked: 20 against Crossref and the DENTEX arXiv DOI against DataCite.
* Title, year, volume, pages/article number, first author and author count all match, with one exception.
* Naeini [16]: Crossref records the family name as "Pakdaman Naeini". The paper uses the common form "M. P. Naeini". This is a style choice, not an error.
* Guo [15]: confirmed on the PMLR page (vol. 70, pp. 1321–1330).
* Geifman [13]: title, authors and vol. 30 confirmed on the NeurIPS page. **Pages 4878–4887 not confirmed** this session (the page does not show them).
* ISO 3950:2016 [18]: **not re-checked**; iso.org returned a bot challenge. Entry unchanged from v4.
* Zhang [2]: still early access (Dec. 2025, no volume or issue), as in v4.
* Every claim whose citation was removed was either deleted or still has a retained citation.

## 6. Formatting and rendering checks

* **Pages:** all 10 rendered at 100 dpi and inspected. No clipping, no overlapping figures, equations (1) to (11) intact, all tables readable, no blank pages, and the footer page number in the same position on every page.
* **Floating figures:** an earlier draft had Fig. 2 drawn over Fig. 1 (Word ignored `overlap: never`). This was found during inspection and fixed by re-anchoring. The final pages have no overlap.
* **Whitespace:**
  * pages 1 and 3 to 7 are filled to the bottom margin;
  * small gaps remain at the bottom of page 2 right (≈60 pt, Table II moved to the next column) and page 8 left (≈85 pt, Table XI moved);
  * page 10 right ends about a quarter of the way down the column (end of references), which leaves a safety margin.
* **Order:** tables are first cited in order I to XII, all 7 figures and Algorithm 1 are cited, and there are no unresolved markers ("??", "Error!").
* **DOCX vs. PDF:** the PDF is Word's own export of the DOCX. Word counts agree (4,290 vs. 4,286; the difference is line-end hyphenation and equation text). The final PDF text is identical to the draft inspected page by page.
* **Punctuation:**
  * 0 en dashes and 0 double hyphens in the body;
  * the only em dashes are the IEEE template labels "Abstract—" and "Index Terms—", kept deliberately. Removing them would break the IEEE format; change them if you prefer;
  * en dashes remain only inside reference entries (page ranges) and the ISO 3950 title, which are bibliographic text;
  * "Jensen-Shannon" is written with a hyphen.

## 7. Caution when editing the DOCX by hand

The figures are floating tables anchored to particular paragraphs. Adding or removing text before a figure can move its anchor paragraph to a different column, which reopens a gap or pushes the paper to 11 pages. Make content changes in `build/build_paper_v5.js`, rebuild, and recount the pages.

## 8. Unresolved (carried over from v4, not addressed by this task)

1. **Test-set ledger entries (6) and (7)** are still not recorded; a named authorizer is needed. Commands are in `v4_baseline/STATUS_REPORT_v4.md`, Section 2. After recording, update the Table XII note and the sentence in Section VIII ("have not yet been appended").
2. **AI-assistance disclosure** (Acknowledgment) still needs the authors' confirmation. Its wording is unchanged from v4. The authors should also decide whether the v5 condensation and rewriting should be mentioned in it.
3. **Similarity check:** no official check has been run, and none is claimed. v5 is a substantial rewrite, so the v3 local shingle check no longer describes this text.
4. **Target venue and its template** are unknown; the IEEE-style layout from v4 is kept.
5. **Reference details:** Geifman's page range and ISO 3950 were not re-verified (Section 5). The authors should still skim [1], [3] and [5] to confirm the one-line descriptions, as v4 recommended.

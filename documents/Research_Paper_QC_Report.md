# Quality-Control Report: IEEE Research Paper Update

**Paper:** *An Explainable Multimodal AI Framework for Disease Detection, Medical Report Interpretation, and Personalized Care Pathway Recommendation*
**Source used:** `documents/123B1B260-Research_Paper_Final.docx (2).pdf` (9 pages; only a PDF was supplied, no .docx)
**Deliverables (in `documents/`):**

| File | Purpose |
|---|---|
| `123B1B260-Research_Paper_IEEE_Updated.docx` | Editable paper (IEEE two-column, US Letter, Times New Roman, native Word equations) |
| `123B1B260-Research_Paper_IEEE_Updated.pdf` | PDF exported through Microsoft Word, for checking the layout |
| `research_paper_figures/make_figures.py` | Source code for all four diagrams |
| `research_paper_figures/fig*.svg / .pdf / .png` | Vector diagrams (text drawn as outlines) plus 600-dpi PNG fallbacks |
| `research_paper_figures/fig*_editable.svg` | The same diagrams with text kept as editable text |
| `research_paper_figures/build_paper.js` | Generator for the .docx (rebuild with `node build_paper.js <figdir> <out.docx>`) |

## 1. Requested edits

- The guide is now **Dr. Pradnya Narkhede**. The name appears once in the paper, in the title block, and "Supriya Mahadevkar" no longer appears anywhere.
- The authors, department and college are unchanged. The title is kept word for word.
- All four technical components are kept: Transformer text, CNN/vision, fusion and multi-disease analysis, longitudinal analysis, and RAG with personalized recommendations. Equations (1)–(11), the six optimization techniques and all twelve tables are also kept.

## 2. IEEE formatting

- **Page layout:** the title, abstract and index terms span the full page width; the body is in two 3.5 in columns with a 0.25 in gap. Section headings use Roman numerals and small caps, and subsections use italic letters.
- **Tables:** every table has a caption above it in the "TABLE N / Title" style, uses 8 pt text, and repeats its header row when it continues onto the next page. All twelve tables are cited in the text.
- **Equations:** all eleven are native Word (OMML) equations, editable in Word. Each is numbered at the right-hand margin, and function names such as softmax, ReLU, sim and exp are set upright.
- **Visual check:** the document was rendered through Word (10 pages). I found no overlapping text, clipped tables, empty figure placeholders or broken images, and the columns are balanced on the last page.

## 3. Figures

All four figures were redrawn in black and white at single-column width. The smallest text in them is about 6.5 pt. Each figure is cited and explained in the text, and none adds a system component that was not in the source.

| Fig. | Content | Changes from the source figure |
|---|---|---|
| 1 | End-to-end architecture: six stages plus the evaluation loop | Same stages and items; redrawn vertically so it fits one column |
| 2 | Multimodal inputs → unified record → chronological history | The record fields now match Table III exactly |
| 3 | CNN, structured-feature and Transformer branches → fusion (3) → multi-task head (4) | Adds a h_lab branch, because Eq. (3) already uses h_lab. The example "High/Low risk" labels were removed so they can't be read as results |
| 4 | Longitudinal trends and alerts | Same values. The source plotted lab values on dates that belonged to an X-ray, a note and a prescription; these are now visits V1–V5, all lab reports. The figure is labelled as synthetic. The percentage changes are computed with Eq. (5) |

## 4. Citations

- References are numbered in the order they are first cited, as IEEE requires, so the numbering differs from the original draft. All 22 references are cited and every citation number has an entry. The generator stops with an error if this ever stops being true.
- **The DOIs were checked against Crossref.** Seventeen of them resolve, with matching title, journal, volume and pages. I made these corrections:
  - [3] Etemadi: the author names are now "S. Bazzaz Abkenar" and "M. Haghi Kashani".
  - [10] Tiwari: the missing co-author **A. Khanna** has been added.
  - [11] Erten: the stray "et al." after the full author list was removed, and "no. 20" was added.
  - DOIs were added for Wang (KDD), LeCun, He, Robertson and Karpukhin.
  - [13] WHO: a URL was added; it returns HTTP 200.
- **Needs review:** for [20] Robertson & Zaragoza, Crossref lists the volume and pages as 4(1–2) 1–174, while the citation gives vol. 3, no. 4, pp. 333–389. The latter matches the published monograph as far as I know, but someone should check it against the publisher's page.
- The NIPS/NeurIPS and ICML proceedings entries ([5], [12], [19], [22]) have no DOI, which is normal for these venues. Their page ranges match the published proceedings.

## 5. Scientific-claim audit

| Check | Finding | What was done |
|---|---|---|
| Dataset of ~2,261 patients | The source always calls this a **proposed target**, "subject to availability". There is no evidence the data were collected. | The paper now says it is "a collection target … not an achieved count" in the abstract, Sections I and V, and the limitations. |
| Tables X–XII backed by logs? | **No logs found.** This repository (`D:\Dentex-Gen Ai`) is the DentaMind dental panoramic X-ray (DENTEX) project. It has no lab-report extraction, RAG, Lothe Lab data or evaluation output matching any value in Tables X–XII. | The tables were relabelled "Preliminary … (Unverified)". A new Section XII-A explains that the logs, sample sizes and confidence intervals are not archived and that no clinical study has been done. The values themselves were **not changed**. |
| Patient-grouped validation | The source said it "is used", but nothing documents patient identifiers or the split procedure. | It is now described as the **planned** protocol (Section X-A), and the paper says it is **not claimed** for the preliminary values. |
| F1 consistency | The harmonic mean of the reported P = 88.4% and R = 84.6% is **86.5%**, but Table X reports 86.4%. At 86.5% the status would be "Met", not "Near". | A footnote on Table X flags the gap; the value is kept as reported. **Unresolved.** |
| Grounding consistency | Table XI gives "claims supported 0.90" and "unsupported claims 0.12", which add up to 1.02. Table X gives groundedness 88.0%, and 1 − 0.88 = 0.12. | A footnote on Table XI flags this. **Unresolved:** one of these numbers is probably wrong, or they come from different claim sets. |
| Trend accuracy | Table X gives 94.6% and Table XII gives 0.95. | These agree after rounding, and the text now says so. |
| Target consistency | The F1 target of 86.5% equals the harmonic mean of the 88% and 85% targets. | Confirmed in the text. |
| Cost unit | "1–3" and "1.8" have **no currency**. | Marked with † in Tables VIII and X. **Unresolved.** |
| "Largest gains" claim | The source claim was only partly accurate. | Rewritten: hybrid retrieval (+0.14) and transfer learning (+0.12) give the largest absolute gains; temperature scaling gives the largest relative gain (ECE about −66%). |
| Implemented vs proposed | The source mixed "will" and "is" for the same features. | The framework is described as a design, the dataset as a target, and the results as preliminary (stated in Section I and used consistently). |

## 6. Writing

- The text was rewritten into plainer academic English with less repetition. The abstract has no citations, as IEEE recommends.
- Short explanations of design choices were added, all following from the existing design:
  - why stages run in this order;
  - why the median is used for imputation;
  - why hybrid retrieval is used;
  - why a shared multi-task representation is used;
  - why limitations are listed next to the components in Table V.
- No new results, references or system components were added.
- **Similarity and AI-detection scores cannot be guaranteed.** The text was not altered to get around detectors. It sticks to what the source material and evidence support.

## 7. Open issues the authors must resolve before submission

1. **Provide the experiment logs for Tables X–XII.** These are the test sets, the number of reports or claims, the split procedure and the confidence intervals. If the logs don't exist, the tables should be removed or rewritten as targets only. Do not submit them as results.
2. Resolve the F1 value (86.4% vs 86.5%) and the groundedness values (0.90 / 0.12 / 88.0%).
3. State the currency for the API cost.
4. Check the volume and pages for reference [20].
5. **Possible conflict of interest:** co-author Sachet Lothe and the data partner Lothe Lab share a surname. If they are related, journals usually require a conflict-of-interest or funding disclosure.
6. Formatting: if the target venue supplies its own IEEE Word template (with its own fonts and margins), paste this content into that template. The layout here follows standard IEEE conference settings and the supplied PDF.
7. The docx schema validator could not run because the `defusedxml` Python module is missing. Word 16 opened and rendered the file without errors.

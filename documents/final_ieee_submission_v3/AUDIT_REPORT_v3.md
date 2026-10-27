# Pre-submission audit, v3 (2026-10-25)

**Scope.** Corrections and checks on `documents/final_ieee_submission/DentaMind_AI_IEEE_Final_v2_schematic.docx`.
* Previous files are preserved. v3 is saved here as `DentaMind_AI_IEEE_v3.docx` / `.pdf` (12 pages, 7 figures, 17 tables, 15 equations, Algorithm 1, 35 references).
* Nothing was pushed, and no code outside this folder was changed.
* Evidence files are in `evidence/`.

## 1. Benchmark discrepancy (10 images, 11 sizes): resolved, documentation fix only

* **Cause** (from the source code, `scripts/benchmark_inference.py`):
  - It loads `images + warmup` = 10 + 2 = 12 files and times only the 10 that follow the warm-up.
  - It writes `image_sizes` as the set of distinct sizes over all 12 loaded files.
* **The two warm-up files** are `val_0.png` and `val_0-checkpoint.png`, byte-identical copies at 2872 × 1504, a size none of the timed images has.
* **The 10 timed images** (`val_1`, `val_10`–`val_18`) have 10 distinct sizes, so 10 + 1 = 11.
* **Evidence:**
  - The reconstructed size set equals the recorded set exactly.
  - No file in the image folder was modified after the benchmark's timestamp (2026-10-14 07:52 UTC).
  - See `evidence/benchmark_reconstruction.txt`.
* **Correction:** the note under Table XV now explains the 11 sizes. Timings, the image count (10) and the largest timed size (3,076 × 1,536) were already correct and are unchanged.
* **Side observation:** the warm-up included a Jupyter checkpoint copy. This is harmless because warm-up runs are excluded from timing.

## 2. Brahmi et al. and Truong et al.: verified; wording corrected to match the abstracts

Metadata and abstracts come from OpenAlex, which matches the Crossref record, plus the open preprints (TechRxiv for Brahmi, arXiv 2312.07273 for Truong). Details are in `evidence/reference_verification.txt`.

| Ref. | Verified metadata | What the abstract supports | Change |
|---|---|---|---|
| Brahmi, Jdey, Drira | Eng. Appl. Artif. Intell. 133:108510, 2024; type: review | systematic review of 45 studies on CNNs for dental imaging analysis and segmentation (CT, CBCT, MRI, ultrasound, intra-oral periapical X-rays; **panoramic not mentioned in the abstract**) | Table I row: "Context for our Mask R-CNN choice" became "Context for CNN-based tooth segmentation"; "45 studies" added. Prose citations ("review convolutional networks in dental radiography") were already accurate |
| Truong, Khun Jush, Lenga | IEEE ISBI 2024, pp. 1–5 | pretrained 2-D embeddings for near and exact duplicate detection in **3-D** medical images (Medical Segmentation Decathlon); mean sensitivity 0.9645, specificity 0.8559 | "medical images" became "3-D medical images". In Section XIII, "a more sensitive alternative" became "an alternative", because the paper does not compare against perceptual hashing |

## 3. Test-split use on 2026-10-16: ledger entry needed (not recorded); a second unrecorded use found (2026-10-24)

* **2026-10-16:**
  - The Kaggle training log, line 679, reads "2026-10-16 11:53:27 test evaluated for: ['BASE'] (selection used validation only)".
  - The local seed-45 checkpoint hash `3e0ab876…` matches the disclosure record `reports/p5_disclosure_entry.json` (`c8f9b186…`).
  - It is not in the ledger, which still holds 5 entries, chain intact, `f117c1a3…`.
* **2026-10-24 (newly identified):**
  - The external-data run log, line 360, reads "test evaluated for: ['BASE']".
  - Its disclosure record (`kaggle/artifacts_external_run1/ledger_disclosure_entry.json`, `91083588…`) gives the same `combined_test.csv` SHA-256 (`749af264…`) and 73 films, i.e. **the same internal test split**.
  - It is also not in the ledger.
* **Paper change:** Table XVII gains row "(7)", and Section XIII now reports both uses. The 2026-10-24 mean ± SD of GT-box macro-F1, 0.705 ± 0.031, was computed from the five per-seed values in the disclosure record, using the sample SD as the existing row does. Neither run selected or changed a deployed model.
* **Ledger: not modified.** The established procedure needs the accountable authorizer's own name. Commands for the authorizer:
  ```
  .venv\Scripts\python.exe scripts\test_set_ledger.py --record-disclosure reports\p5_disclosure_entry.json --authorized-by "<authorizer's full name>" --reason "<reason>"
  .venv\Scripts\python.exe scripts\test_set_ledger.py --record-disclosure kaggle\artifacts_external_run1\ledger_disclosure_entry.json --authorized-by "<authorizer's full name>" --reason "<reason>"
  ```
  Once they are recorded, the note under Table XVII should say "(6) and (7) recorded" rather than "not in the ledger".

## 4. AI-assistance disclosure: revised to IEEE's required structure; venue confirmation needed

* **IEEE's general policy** ([IEEE Open, AI-generated text](https://open.ieee.org/author-guidelines-for-artificial-intelligence-ai-generated-text/)):
  - AI-generated content (text, figures, images, code) must be disclosed in the acknowledgments;
  - the AI system must be named;
  - the specific sections must be identified, with the level of use.
* **Previous wording:** it named the system but did not identify sections or level, and did not mention figures or code. It did not meet the policy.
* **New wording:** names Claude (Anthropic); identifies all sections' text, the figure-drawing code and Figs. 1–7, and the reference search; states that numbers and references were checked against records.
* **Needs confirmation (not assumed):**
  1. **Accuracy:** the authors must confirm the statement, and add their own role, e.g. which parts they wrote or revised.
  2. **Venue-specific rules:** some 2026 IEEE conferences also require citing the AI system in each affected section ([WCCI 2026](https://attend.ieee.org/wcci-2026/final-author-instructions/)), and some journals want editing-only use declared in the cover letter ([IEEE EDL](https://eds.ieee.org/publications/electron-device-letters/information-for-authors)). Check the chosen venue.
  3. **Institution:** PCCOE's own rules on AI-assisted academic writing were not checked; please confirm.

## 5. Similarity check: local indicative check only; no authorized tool available

* **Not run:** no institutional checker (Turnitin, iThenticate) is accessible here. **No official similarity score exists**, and none is claimed.
* **What was run:** `build/similarity_check.py`, a local shingle-overlap check:
  - text checked: 6,448 prose words;
  - sources: 126, namely 25 reference abstracts plus project documents (the abstract of the Rajpurkar editorial was unavailable).

| Source group | 8-word runs | 5-word runs |
|---|---:|---:|
| Published literature (abstracts) | **0.00 %** | 0.31 % |
| Authors' own project documents (capstone report, README, docs, reports) | 3.82 % | 13.83 % |
| Overall, excluding the earlier version of this paper | 3.82 % | 14.08 % |
| Earlier version of this same paper (`dentist-research-paper.pdf`) | 74.77 % | 78.52 % |

* **Limitations:**
  - Not the whole internet, and no full texts of cited papers, only abstracts.
  - The method differs from Turnitin's, so a real report can differ.
  - The largest non-self overlap is the authors' own capstone report (1.8 %), mainly limitation sentences. If that report was submitted to Turnitin, it will appear as self-overlap.
* Full output: `evidence/similarity_v3.json`.

## 6. Venue and template

* **No target venue** is named in the request or anywhere in the project files.
* The current layout (IEEE conference settings: two columns, US Letter, Times New Roman) is **retained**.
* **Limitation:** when a venue is chosen, check whether it requires its official IEEE template (fonts, margins, page limit, copyright line), and move the content into it if so.

## 7. Final verification of v3

| Check | Result |
|---|---|
| Figure files | 7 figures × 4 formats in `figures_schematic/` (copied unchanged from v2); 0 `<image>` elements in the SVGs; PDF has 0 raster images |
| Figure placement | page 4: Figs. 1–2; page 5: Figs. 3–4 and Algorithm 1; page 6: Fig. 5; page 7: Figs. 6–7; all readable at reading size (inspected) |
| Captions and in-text citations | every Fig. 1–7 caption present; each figure cited in the body; figure-to-caption checklist in `../final_ieee_submission/QC_REPORT_v2_schematic.md` still holds (no figure changed) |
| References | 35 entries; citations [1]–[35] all appear in the body |
| Broken fields | no "Error!" or "??" |
| Guide name | "Dr. Pradnya Narkhede", correct |
| Scientific content vs. v2 | text diff: 21 changed lines, all listed above. **No number was removed; the only new numbers are 0.705 and 0.031** (from the disclosure record) |
| DOCX integrity | opens, ZIP test passes; PDF exported by Microsoft Word, 12 pages |

## Unresolved

1. **Ledger:** record entries (6) and (7) with the authorizer's name (commands above), then update the Table XVII note.
2. **AI disclosure:** authors must confirm it, and check the venue and PCCOE rules.
3. **Similarity:** run the institutional checker. Only the local indicative check exists.
4. **Venue:** not chosen, so the template requirement is unknown.
5. **Reference metadata:** Zhang et al. (JBHI) is still early access; Bittar et al. and Vazhentsev et al. have no final volume or pages yet.
6. **Missing original file:** `documents/dentist-research-paper.docx` (the original 2026-10-24 paper) is **no longer on disk**; only its PDF remains. It was present at about 18:50 today and was not removed by this audit. It can be rebuilt exactly from `documents/dentist-research-figures/build_paper.js`, whose output was verified text-identical earlier, if you want it restored.

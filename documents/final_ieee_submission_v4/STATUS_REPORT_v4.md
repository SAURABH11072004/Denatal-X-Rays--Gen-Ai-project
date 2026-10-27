# DentaMind AI IEEE manuscript: status report v4 (2026-10-25)

**Status: NOT ready for final submission.** Two integrity steps are still pending:
* the test-set ledger entries are not recorded;
* the AI-assistance disclosure is not confirmed by the authors.

In addition, no official similarity check has been run.

**Deliverables in this folder:**
* `DentaMind_AI_IEEE_v4.docx` / `.pdf` (12 pages)
* `DentaMind_AI_IEEE_v4_References.bib`
* `figures_schematic/` (unchanged from v3)
* `build/`

All earlier versions are preserved: v1–v3, the submission folder and the figure-redesign folder.

## 1. Complete (verified)

| Task | Result and evidence |
|---|---|
| Restore `documents/dentist-research-paper.docx` | Rebuilt with its own script (`documents/dentist-research-figures/build_paper.js`; all inputs present). Nothing was overwritten: the file did not exist, and the BibTeX output went to scratch. It is **byte-identical** to the existing `dentist-research-references.bib`. Its text matches the surviving original PDF after normalization; the only differences are extraction artifacts (page numbers, XML entities, equation glyphs) |
| Zhang et al. (JBHI) | Crossref: no volume or issue, pp. 1–13, 2025. PubMed (PMID 41396752): volume "PP", published 2025 Dec 15, i.e. **still early access**. Reference now reads "early access, Dec. 2025, pp. 1–13". No volume or issue was added |
| Bittar et al. (J. Dent.) | Crossref and PubMed (PMID 42537896) both give **vol. 175, Art. no. 106944, Dec. 2026**. The existing reference already matched; nothing changed |
| Vazhentsev et al. (npj Artif. Intell.) | Crossref and OpenAlex give an online date of 2026-05-29 and **no volume or article number**; the publisher page redirects to a login and could not be read. Only "May 2026" was added |
| Export and inspection | Word exported 12 pages, all inspected. Present: 7 figures with captions (vector; 0 raster images), 17 tables (I–XVII), equations (1)–(15), Algorithm 1, and 35 references, with [1]–[35] all cited. No "Error!" or "??". Guide name correct |
| Page breaks | Table I continues to the next column and Table X to the next page, each with its header row repeated; no other table, figure or equation splits. No blank pages |
| Content vs. v3 | Text diff: **only the two reference entries** [4] and [18] changed. No result, table, figure or claim changed |

## 2. Test-set ledger: prepared, intentionally NOT written

* **State:** `Data/reports/test_set_ledger.json` has 5 entries, the chain is intact (`--verify`), SHA-256 `f117c1a3…`. Unchanged.
* **Prepared entries, both unchanged:**
  - `reports/p5_disclosure_entry.json` (2026-10-16, `c8f9b186…`);
  - `kaggle/artifacts_external_run1/ledger_disclosure_entry.json` (2026-10-24, `91083588…`).
* **Read-only validation:** both supply every field the ledger code requires (`test_ledger.DISCLOSURE_FIELDS`, 12 fields), and all 5 checkpoint hashes in each are full 64-character SHA-256.
* **Requirements for writing** (from `src/dentexmodel/evaluation/test_ledger.py`):
  - an authorizer name of 2–64 characters;
  - a reason of at least 20 characters;
  - the ledger chain must pass its integrity check.
* **Not written, because no authorizer identity has been supplied.** Commands for the authorizer:
  ```
  .venv\Scripts\python.exe scripts\test_set_ledger.py --record-disclosure reports\p5_disclosure_entry.json --authorized-by "<full name>" --reason "<at least 20 characters>"
  .venv\Scripts\python.exe scripts\test_set_ledger.py --record-disclosure kaggle\artifacts_external_run1\ledger_disclosure_entry.json --authorized-by "<full name>" --reason "<at least 20 characters>"
  .venv\Scripts\python.exe scripts\test_set_ledger.py --verify
  ```
* **After recording:**
  - change the note under Table XVII from "not in the ledger" to "recorded";
  - change "have not yet been appended" in Section XIII accordingly.

## 3. AI-assistance disclosure: requires author confirmation

**Exact text in v4 (Acknowledgment):**
> "AI-generated content is disclosed following IEEE policy. The text of all sections, the figure-drawing code and the resulting diagrams (Figs. 1–7), and the reference search were produced with the assistance of an AI system (Claude, Anthropic), working from the project's own source code and evaluation reports. Every reported number was reconciled against those reports, and every added reference was checked against its bibliographic record. The authors are responsible for the content of this paper."

**The authors must confirm:**
1. That the scope is accurate: AI was used for the text of all sections, the figure code and figures, and the reference search.
2. Whether any parts were written or substantially revised by the authors themselves. If so, the statement should say which.
3. That the authors have read the whole manuscript and accept responsibility for it. The sentence asserts this; only the authors can make it true.
4. That they personally checked the reconciled numbers and references, or that the statement should say an automated check was used.
5. Whether AI was also used for any code or analysis behind the results (the project software), which some policies ask to disclose.

**Policy status (not claimed as compliant):**
* **IEEE general policy** ([IEEE Open, AI-generated text](https://open.ieee.org/author-guidelines-for-artificial-intelligence-ai-generated-text/)): disclose in the acknowledgments, name the system, identify sections and level. The wording follows this structure, but compliance depends on items 1–5.
* **Venue rules:** unknown, because no venue is chosen. Some IEEE conferences also require an in-text citation of the AI system in each affected section ([WCCI 2026](https://attend.ieee.org/wcci-2026/final-author-instructions/)); some journals treat editing-only use differently ([IEEE EDL](https://eds.ieee.org/publications/electron-device-letters/information-for-authors)).
* **PCCOE policy:** **not checked.** No PCCOE rule on AI-assisted academic writing was available to me. Ask the guide or the department.

## 4. Text overlap: local, indicative only

* **No official plagiarism or similarity check has been run**, and no official score exists.
* The local shingle-overlap check from v3 (`../final_ieee_submission_v3/evidence/similarity_v3.json`) still applies, because v4 changes only two reference entries, which are excluded from that check:
  - 8-word runs: 0.00 % against the 25 cited-work abstracts, 3.82 % against the authors' own project documents;
  - 5-word runs: 0.31 % and 13.83 %.
* **Limitations:** abstracts only, not the whole web, and a different method from Turnitin.

## 5. Unverified or open

1. **Ledger entries (6) and (7):** need a named authorizer (Section 2).
2. **AI disclosure:** needs the authors' confirmation; venue and PCCOE rules are unchecked (Section 3).
3. **Official similarity report:** not available.
4. **Target venue and its template requirement:** unknown; the current IEEE-style layout is retained.
5. **Reference metadata not yet final:**
   - Zhang et al.: early access, no volume or issue;
   - Vazhentsev et al.: no volume or article number found in Crossref or OpenAlex, and the publisher page could not be read.
6. **Previously flagged, still open:** the authors should skim references [1], [3], [5], [6] and [11] to confirm the one-line descriptions. The Rajpurkar and Topol reference is an editorial, cited only as an argument.

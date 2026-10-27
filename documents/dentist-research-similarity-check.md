# Local Similarity and AI-Likelihood Check: `dentist-research-paper.docx`

Run on 2026-10-24 on this machine. **These are local, indicative checks. They are not Turnitin, iThenticate or GPTZero results and must not be presented as an institutional similarity report.** The scripts are in the session scratchpad (`simcheck/fetch.py`, `overlap.py`, `perplexity.py`).

## 1. Text-overlap (plagiarism-style) check

- **Method:** shingle matching, the same idea commercial checkers use. A word counts as matched when it lies inside a run of at least N consecutive words that also appears word-for-word in a source, after lower-casing and removing punctuation.
- **Text checked:** the body prose of the paper, 5,764 words. Tables, equations and the reference list were excluded.
- **Sources compared (72):**
  - the public abstracts of 18 of the 27 cited works (from Semantic Scholar / Crossref; the other 9 abstracts were not available online);
  - 54 project documents: everything in `docs/`, `Data/reports/`, `reports/`, the README, the capstone report and summary, and the earlier paper version.

| Source group | Matched, N = 8 words | Matched, N = 5 words |
|---|---:|---:|
| Published literature (18 reference abstracts) | **0 words (0.0 %)** | 12 words (0.2 %): two factual phrases, e.g. "200 pediatric patients in the mixed dentition" |
| Project's own documents | 209 words (3.6 %) | 841 words (14.6 %) |
| **Overall** | **3.6 %** | **14.6 %** |

The largest overlaps at N = 8 all come from the project's own documents:

| Source | Matched words (share of paper) | Longest matching phrase |
|---|---:|---|
| `documents/final_capstone/DentaMind_AI_Capstone_Report.docx` | 96 (1.7 %) | "the Hindi and Marathi wording has not been reviewed by a native-speaking dental professional" |
| `README.md` | 31 (0.5 %) | "the Hindi and Marathi report wording has not been reviewed by" |
| `docs/KNOWN_LIMITATIONS.md` | 29 (0.5 %) | "an unconfirmed research draft until a named reviewer signs it" |
| `Data/reports/end_to_end_validation_evaluation.md` | 29 (0.5 %) | "the classifier called them Caries 475 Periapical Lesion 71 Deep Caries 23" |

**What this means:** no wording was copied from published papers. The remaining overlap is with your own unpublished project documents. It consists of short limitation statements and number-dense sentences of results.

**Caution:** if the capstone report has already been submitted through your college's Turnitin, Turnitin will show this overlap as a match to your own earlier submission. Ask your guide whether that self-overlap is acceptable, or reword the sentences listed above.

## 2. AI-likelihood check

**Method:** GPT-2 perplexity and "burstiness", the principle behind GPTZero-style detectors.

- **Perplexity** measures how predictable each sentence is to a language model. Machine-written text tends to be very predictable, so it scores low.
- **Burstiness** is how much that predictability varies from sentence to sentence. Human writing tends to vary more.

The paper was compared with a human-written baseline: abstracts of the cited papers published before 2022 (7 texts, 52 sentences).

| Measure | Paper (295 sentences) | Human baseline |
|---|---:|---:|
| Median sentence perplexity | 226.5 | 116.6 |
| Share of very predictable sentences (perplexity < 30) | 0.3 % | 1.9 % |
| Burstiness (median coefficient of variation) | 0.549 | 0.397 |

Under this heuristic, the paper does **not** look more machine-like than the human baseline. That is mostly because it is dense with numbers, file names and technical terms, which GPT-2 finds hard to predict. **This is not a reliable verdict.**

- The baseline is small (7 abstracts).
- The detector is uncalibrated.
- Commercial detectors such as Turnitin AI use trained classifiers that work differently and can give a different result.

**Disclosure:** the manuscript text was drafted with an AI assistant (Claude) from the project's own code and reports. A real AI detector may flag parts of it whatever this local check says. Most universities and IEEE require AI-assisted writing to be disclosed (IEEE asks for it in the acknowledgments). Check your college's policy and add the disclosure it requires.

## 3. What was not done

- **No institutional checks.** No Turnitin, iThenticate, Grammarly or GPTZero check was run: they need your account, and uploading would send the unpublished paper to a third party.
- **No web-wide search.** The overlap check covered only the 72 sources listed above, not the whole internet.
- **9 reference abstracts unavailable:** [5], [12], [13], [15], [22], [23], [24], [25] and [27].

**To get an official report:** submit `dentist-research-paper.docx` through your college's Turnitin, or through iThenticate if the IEEE venue provides it. Use those numbers in any formal declaration.

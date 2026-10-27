"""v3 pre-submission corrections (2026-10-25). Each change is backed by the evidence listed in ../AUDIT_REPORT_v3.md."""
from pathlib import Path

P = Path(__file__).with_name("build_paper_v3.js")
s = P.read_text(encoding="utf8")
CHANGES = [
    # 1. benchmark note: discrepancy explained by scripts/benchmark_inference.py (sizes are collected over 10 timed + 2 warm-up files)
    ("The report lists 11 image sizes for 10 images; this inconsistency is unresolved.",
     "The report lists 11 distinct image sizes because they were collected over all 12 loaded files, including the two "
     "byte-identical warm-up copies (2872 \\u00d7 1504 px) excluded from timing; the 10 timed images have 10 distinct sizes."),
    # 2. Brahmi et al.: abstract covers CNN segmentation across dental imaging modalities; it does not motivate Mask R-CNN
    ('"Systematic review, CNN segmentation in dental radiography", "Context for our Mask R-CNN choice"',
     '"Systematic review (45 studies), CNN segmentation in dental imaging", "Context for CNN-based tooth segmentation"'),
    # 3. Truong et al.: 3-D images, no comparison with perceptual hashing -> no sensitivity claim
    ("benchmark pretrained embeddings for finding exact and near duplicates in medical images,",
     "benchmark pretrained vision embeddings for detecting exact and near duplicates among 3-D medical images,"),
    ("embedding-based detectors {c:truong} are a more sensitive alternative that we have not applied.",
     "embedding-based detection {c:truong} is an alternative that we have not applied."),
    # 4. second unrecorded test use (2026-10-24), same combined_test.csv sha256 749af264...
    ("We also found one use outside the ledger: the Kaggle re-run evaluated its BASE recipe once on the test split on 2026-10-16 "
     "(ground-truth-box macro-F1 0.693 \\u00b1 0.030 over five seeds). A disclosure record was prepared, but the entry has not been appended to the ledger.",
     "We also found two uses outside the ledger. The Kaggle re-run evaluated its BASE recipe once on the test split on 2026-10-16 "
     "(ground-truth-box macro-F1 0.693 \\u00b1 0.030 over five seeds), and a later external-data run evaluated its five BASE seeds on the "
     "same split on 2026-10-24 (0.705 \\u00b1 0.031). Neither run selected or changed a deployed model, and neither result is used elsewhere in "
     "this paper. Disclosure records were prepared for both, but the entries have not yet been appended to the ledger."),
    ('["(6)", "Kaggle BASE, seeds 42\\u201346", "classification", "2026-10-16", "73"],',
     '["(6)", "Kaggle BASE, seeds 42\\u201346", "classification", "2026-10-16", "73"],\n'
     '      ["(7)", "External-data run, BASE seeds 42\\u201346", "classification", "2026-10-24", "73"],'),
    ("Entry (6) is not in the ledger; source: reports/p5_disclosure_entry.json.",
     "Entries (6) and (7) are not in the ledger; sources: reports/p5_disclosure_entry.json and "
     "kaggle/artifacts_external_run1/ledger_disclosure_entry.json."),
    # 5. AI-assistance disclosure in the structure required by the IEEE policy (system, sections, level)
    ("The manuscript text was drafted with the assistance of an AI writing tool (Claude, Anthropic) from the project’s own code and "
     "evaluation reports, and every reported number was reconciled against those reports. The authors are responsible for the content of this paper.",
     "AI-generated content is disclosed following IEEE policy. The text of all sections, the figure-drawing code and the resulting "
     "diagrams (Figs. 1\\u20137), and the reference search were produced with the assistance of an AI system (Claude, Anthropic), working "
     "from the project\\u2019s own source code and evaluation reports. Every reported number was reconciled against those reports, and every "
     "added reference was checked against its bibliographic record. The authors are responsible for the content of this paper."),
]
for old, new in CHANGES:
    assert s.count(old) == 1, ("not found exactly once", old[:70])
    s = s.replace(old, new)
s = s.replace("schematic block-diagram figures (IEEE two-column, US Letter).",
              "schematic block-diagram figures; v3 pre-submission audit corrections (IEEE two-column, US Letter).")
P.write_text(s, encoding="utf8")
print(f"{len(CHANGES)} corrections applied")

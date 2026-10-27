// Content of the DentaMind AI capstone report. Every number comes from a project report named in the text or table notes.
const path = require("path");
const B = require("./blocks.js");
const { p, pn, bul, unnumbered, raw, tab, cols } = B;

// ------------------------------------------------------------------ verified details (placeholders are listed in QC_REPORT.md)
const META = {
  title: "DentaMind AI: An Uncertainty-Aware Pipeline for Tooth Detection, FDI Numbering, Segmentation and Finding Classification on Panoramic Dental Radiographs",
  groupId: "__________",                                   // not found in any project record
  degreeDept: "Computer Engineering",                      // department stated in the team's paper affiliations
  guide: "Dr. Pradnya Narkhede",                           // guide named in the DentaMind manuscripts (v4/v5)
  guideDeptLine: "Department of CSE (AI & ML)",            // as printed in the official certificate template
  students: [
    { name: "Nilesh Sonawane", prn: "__________" },
    { name: "Saurabh Mali", prn: "__________" },
    { name: "Sadhyoj Hanwate", prn: "__________" },
    { name: "Sachet Lothe", prn: "__________" },
  ],
};

// ------------------------------------------------------------------ references
// 24 entries re-verified for the IEEE v5 manuscript (Crossref/DataCite/PMLR/NeurIPS, 2026-10-26); the Geifman page range,
// which could not be confirmed, is omitted. The entries below were checked on 2026-10-26 against Crossref (DOI) or the
// NeurIPS proceedings pages; the GitHub entry against the GitHub API.
const REFS = {
  ...require("./refs_ieee_v5.json"),
  goodfellow: "I. Goodfellow, J. Pouget-Abadie, M. Mirza, B. Xu, D. Warde-Farley, S. Ozair, A. Courville, and Y. Bengio, “Generative adversarial networks,” {i}Commun. ACM{/i}, vol. 63, no. 11, pp. 139–144, Nov. 2020, doi: 10.1145/3422622.",
  ho: "J. Ho, A. Jain, and P. Abbeel, “Denoising diffusion probabilistic models,” in {i}Proc. Adv. Neural Inf. Process. Syst. (NeurIPS){/i}, vol. 33, 2020, pp. 6840–6851.",
  vaswani: "A. Vaswani, N. Shazeer, N. Parmar, J. Uszkoreit, L. Jones, A. N. Gomez, Ł. Kaiser, and I. Polosukhin, “Attention is all you need,” in {i}Proc. Adv. Neural Inf. Process. Syst. (NIPS){/i}, vol. 30, 2017.",
  brown: "T. Brown, B. Mann, N. Ryder, M. Subbiah, J. D. Kaplan, P. Dhariwal, A. Neelakantan, et al., “Language models are few-shot learners,” in {i}Proc. Adv. Neural Inf. Process. Syst. (NeurIPS){/i}, vol. 33, 2020, pp. 1877–1901.",
  lewis: "P. Lewis, E. Perez, A. Piktus, F. Petroni, V. Karpukhin, N. Goyal, H. Küttler, et al., “Retrieval-augmented generation for knowledge-intensive NLP tasks,” in {i}Proc. Adv. Neural Inf. Process. Syst. (NeurIPS){/i}, vol. 33, 2020, pp. 9459–9474.",
  singhal: "K. Singhal, S. Azizi, T. Tu, S. S. Mahdavi, J. Wei, H. W. Chung, N. Scales, et al., “Large language models encode clinical knowledge,” {i}Nature{/i}, vol. 620, no. 7972, pp. 172–180, Jul. 2023, doi: 10.1038/s41586-023-06291-2.",
  thirunavukarasu: "A. J. Thirunavukarasu, D. S. J. Ting, K. Elangovan, L. Gutierrez, T. F. Tan, and D. S. W. Ting, “Large language models in medicine,” {i}Nat. Med.{/i}, vol. 29, no. 8, pp. 1930–1940, Jul. 2023, doi: 10.1038/s41591-023-02448-8.",
  ji: "Z. Ji, N. Lee, R. Frieske, T. Yu, D. Su, Y. Xu, E. Ishii, et al., “Survey of hallucination in natural language generation,” {i}ACM Comput. Surv.{/i}, vol. 55, no. 12, pp. 1–38, 2023, doi: 10.1145/3571730.",
  jing: "B. Jing, P. Xie, and E. Xing, “On the automatic generation of medical imaging reports,” in {i}Proc. 56th Annu. Meeting Assoc. Comput. Linguistics (ACL){/i}, 2018, pp. 2577–2586, doi: 10.18653/v1/P18-1240.",
  r2gen: "Z. Chen, Y. Song, T.-H. Chang, and X. Wan, “Generating radiology reports via memory-driven transformer,” in {i}Proc. Conf. Empirical Methods Natural Lang. Process. (EMNLP){/i}, 2020, pp. 1439–1449, doi: 10.18653/v1/2020.emnlp-main.112.",
  tu: "T. Tu, S. Azizi, D. Driess, M. Schaekermann, M. Amin, P.-C. Chang, A. Carroll, et al., “Towards generalist biomedical AI,” {i}NEJM AI{/i}, vol. 1, no. 3, 2024, doi: 10.1056/AIoa2300138.",
  reiter: "E. Reiter and R. Dale, “Building applied natural language generation systems,” {i}Nat. Lang. Eng.{/i}, vol. 3, no. 1, pp. 57–87, Mar. 1997, doi: 10.1017/S1351324997001502.",
  selvaraju: "R. R. Selvaraju, M. Cogswell, A. Das, R. Vedantam, D. Parikh, and D. Batra, “Grad-CAM: Visual explanations from deep networks via gradient-based localization,” in {i}Proc. IEEE Int. Conf. Comput. Vis. (ICCV){/i}, 2017, pp. 618–626, doi: 10.1109/ICCV.2017.74.",
  schwendicke: "F. Schwendicke, T. Golla, M. Dreher, and J. Krois, “Convolutional neural networks for dental image diagnostics: A scoping review,” {i}J. Dent.{/i}, vol. 91, Art. no. 103226, Dec. 2019, doi: 10.1016/j.jdent.2019.103226.",
  tuzoff: "D. V. Tuzoff, L. N. Tuzova, M. M. Bornstein, A. S. Krasnov, M. A. Kharchenko, S. I. Nikolenko, M. M. Sveshnikov, and G. B. Bednenko, “Tooth detection and numbering in panoramic radiographs using convolutional neural networks,” {i}Dentomaxillofac. Radiol.{/i}, vol. 48, no. 4, Art. no. 20180051, May 2019, doi: 10.1259/dmfr.20180051.",
  ccbrepo: "“The CCB computer vision repository,” GitHub repository ccb-hms/computervision (listed contributor: awerdich), licensed under CC BY 4.0. [Online]. Available: https://github.com/ccb-hms/computervision",
};

// ------------------------------------------------------------------ abbreviations and symbols (template: symbols only in the nomenclature section)
const ABBREVIATIONS = [
  ["AI", "Artificial Intelligence"], ["API", "Application Programming Interface"], ["AP", "Average Precision"],
  ["AP50", "Average Precision at an IoU match threshold of 0.5"], ["AUC", "Area Under the (ROC) Curve"],
  ["AUROC", "Area Under the Receiver Operating Characteristic curve"], ["CNN", "Convolutional Neural Network"],
  ["COCO", "Common Objects in Context (dataset)"], ["CSV", "Comma-Separated Values"], ["CUDA", "Compute Unified Device Architecture"],
  ["DENTEX", "Dental Enumeration and Tooth Pathosis Detection Benchmark"], ["ECE", "Expected Calibration Error"],
  ["FDI", "Fédération Dentaire Internationale (two-digit tooth notation, ISO 3950)"], ["FN", "False Negative"], ["FP", "False Positive"],
  ["FPN", "Feature Pyramid Network"], ["GAN", "Generative Adversarial Network"], ["GPU", "Graphics Processing Unit"],
  ["Grad-CAM", "Gradient-weighted Class Activation Mapping"], ["GT", "Ground Truth"], ["HTML", "HyperText Markup Language"],
  ["HTTP", "HyperText Transfer Protocol"], ["IoU", "Intersection over Union"], ["JS", "Jensen-Shannon (divergence)"],
  ["JSON", "JavaScript Object Notation"], ["LLM", "Large Language Model"], ["mAP", "mean Average Precision"],
  ["MDM", "Multidisciplinary Minor"], ["NLG", "Natural Language Generation"], ["NMS", "Non-Maximum Suppression"],
  ["PCCOE", "Pimpri Chinchwad College of Engineering"], ["PNG", "Portable Network Graphics"], ["R-CNN", "Region-based Convolutional Neural Network"],
  ["RAG", "Retrieval-Augmented Generation"], ["ResNet", "Residual Network"], ["RGB", "Red, Green, Blue (color channels)"],
  ["ROC", "Receiver Operating Characteristic"], ["SD", "Standard Deviation"], ["SHA-256", "Secure Hash Algorithm, 256-bit"],
  ["SQL", "Structured Query Language"], ["TP", "True Positive"], ["TPR / FPR", "True Positive Rate / False Positive Rate"],
  ["TTA", "Test-Time Augmentation"], ["TXT", "Plain-text file"], ["UI", "User Interface"],
];
const SYMBOLS = [
  ["A, B", "Two boxes or binary masks being compared"], ["IoU(A, B)", "Intersection over union of A and B"],
  ["Dice(A, B)", "Dice coefficient of A and B"], ["K", "Number of finding classes (K = 4)"], ["N", "Number of training crops (N = 2,520)"],
  ["n{sub}c{/sub}", "Number of training crops of class c"], ["w{sub}c{/sub}", "Loss weight of class c"],
  ["z{sub}k{/sub}", "Logit (pre-softmax score) of class k"], ["p{sub}k{/sub}", "Softmax probability of class k"],
  ["{b}p{/b}, {b}q{/b}", "Softmax vectors of a crop and of its horizontally flipped copy"], ["H(p)", "Normalized predictive entropy"],
  ["H′", "Unnormalized (Shannon) entropy"], ["JS(p, q)", "Jensen-Shannon divergence between p and q, normalized by ln 2"],
  ["u{sub}mask{/sub}", "Mask instability of a region under horizontal flipping"], ["S", "Image-level combined uncertainty score"],
  ["α{sub}j{/sub}, s{sub}j{/sub}", "Weight and value of uncertainty signal j"],
  ["τ{sub}H{/sub}, τ{sub}JS{/sub}, τ{sub}M{/sub}, τ{sub}D{/sub}", "Review thresholds: entropy, flip disagreement, mask instability, detection score"],
  ["J", "Youden's index, J = TPR − FPR"], ["T", "Temperature used in temperature scaling"],
  ["B{sub}m{/sub}", "m-th confidence bin used by the ECE"], ["acc(B{sub}m{/sub}), conf(B{sub}m{/sub})", "Accuracy and mean confidence of bin m"],
  ["y{sub}ik{/sub}", "One-hot ground-truth label of sample i for class k"], ["BS", "Multi-class Brier score"],
  ["P, R, F1", "Precision, recall and their harmonic mean"], ["cov, risk", "Coverage and error rate of an abstention rule"],
];

// ------------------------------------------------------------------ acknowledgement and abstract
function prelims() {
  return [
    unnumbered("Acknowledgement", "ack"),
    p(`We are grateful to our guide, ${META.guide}, for steady guidance throughout the project and for the hard questions raised during every review. The insistence that each result should be traceable to the evidence behind it shaped how this project was evaluated and how this report was written.`),
    p("We thank Prof. Dr. Anuradha Thakare, Head of the Department of Computer Science and Engineering (AI & ML), and the faculty and staff of Pimpri Chinchwad College of Engineering for the academic environment and support that made this capstone project possible."),
    p("We acknowledge the organizers of the DENTEX challenge for releasing a public, hierarchically annotated set of panoramic radiographs, the authors of the CCB computer vision repository on which our code base was started, and the developers of PyTorch, torchvision, FastAPI and React, whose open-source software the system is built on."),
    p("Parts of this report, including the drafting of text and the drawing of the schematic diagrams, were prepared with the assistance of an AI system (Claude, Anthropic), working from the project’s own source code, test records and evaluation reports. The team checked the content against those sources and takes responsibility for the report."),
    p("Finally, we thank our families and friends for their patience during the long training runs and evaluations."),
    raw(({ runs }) => META.students.map((s, k) => new (require("docx").Paragraph)({ alignment: require("docx").AlignmentType.RIGHT,
      spacing: { before: k === 0 ? 480 : 0, after: 0, line: 276 }, children: runs(s.name) }))),

    unnumbered("Abstract", "abstract"),
    p("Reading a panoramic dental radiograph means locating every tooth, giving it its FDI number and checking it for findings. DentaMind AI is a research prototype, built on the public DENTEX dataset, that performs these steps with trained models and then uses a generative step to turn the structured model output into readable draft reports."),
    p("The system chains a Faster R-CNN tooth detector, a second Faster R-CNN for FDI numbering, a Mask R-CNN instance segmenter and a ResNet-50 classifier that names the closest of four finding classes (Caries, Deep Caries, Impacted, Periapical Lesion) for each detected tooth. Normalized entropy and flip disagreement estimate uncertainty, and thresholds fitted on a calibration split route uncertain regions to a human reviewer. The generative component drafts English, Hindi and Marathi reports from the structured findings only, using a deterministic template by default and an optional language-model path guarded by an evidence validator."),
    p("On an internal test split of 63 radiographs, the detector reached AP50 0.966, the segmenter mask AP50 0.974 (mean matched Dice 0.873), and 96.8 % of matched teeth received the correct FDI number. On ground-truth crops from 73 test radiographs, the classifier reached accuracy 0.785 and macro-F1 0.646, but Periapical Lesion recall was only 0.308; with detector crops in place of ground-truth crops, validation macro-F1 fell from 0.718 to 0.634. The entropy flag marked 54.2 % of test crops, which held 86.8 % of the errors. Four classifier-improvement attempts and an active-learning study were negative. All 61 report-output checks passed, and the test suite passed 590 tests."),
    p("Splits are grouped by pixel hash and test-split use is logged, but patient-level leakage cannot be excluded. The classifier has no healthy class, the language-model path has never been run live, and the system has not been clinically validated."),
    pn("{b}Keywords:{/b} panoramic radiograph, DENTEX, tooth detection, FDI numbering, instance segmentation, uncertainty estimation, human review, evidence-grounded report generation, generative AI, data leakage."),
  ];
}

// ------------------------------------------------------------------ appendices
function appendices() {
  const { Paragraph, AlignmentType, ImageRun } = require("docx");
  const fs = require("fs");
  const ROOT = path.resolve(__dirname, "..");
  const pages = [];
  const dir = path.join(ROOT, "appendix_a_draft_paper");
  if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".png")).sort()) pages.push(path.join(dir, f));
  return [
    unnumbered("Appendix A: Publication Details", "appendix_a"),
    p("The template asks for the details of a paper publication, reviewer comments, certificates and the paper itself, or a draft paper if nothing has been published. The current status of each item is listed below. Nothing in this appendix should be read as evidence of acceptance or publication."),
    tab({ id: "pubstatus", title: "Status of Publication-Related Documents", head: ["Item", "Status (2026-10-26)"],
      widths: cols(36, 64), rows: [
        ["Paper title", META.title],
        ["Authors", "Nilesh Sonawane, Saurabh Mali, Sadhyoj Hanwate and Sachet Lothe (guide: Dr. Pradnya Narkhede)"],
        ["Manuscript", "IEEE two-column draft, 10 pages, 24 references (DentaMind_AI_IEEE_v5.pdf); reproduced below as the draft paper"],
        ["Target conference or journal", "PENDING: not yet chosen; the manuscript has not been submitted"],
        ["Reviewer comments", "NOT AVAILABLE: no submission has been made"],
        ["Acceptance letter, publication or participation certificate", "NOT AVAILABLE"],
        ["Patent documents", "NOT APPLICABLE: no patent application has been filed"],
        ["Project event participation certificates", "PENDING: to be attached by the team if any exist"],
        ["Open items before submission", "test-set ledger entries (6) and (7) need a named authorizer; the AI-assistance disclosure needs the authors’ confirmation; an official similarity check has not been run"],
      ], size: 20 }),
    p(pages.length ? "The draft manuscript follows, one page per report page." : "The draft manuscript pages could not be found and must be attached."),
    ...pages.map((f, k) => raw(({ runs }) => [
      new Paragraph({ alignment: AlignmentType.CENTER, pageBreakBefore: true, spacing: { after: 60, line: 240 },
        children: runs(`{i}Draft manuscript (not submitted), page ${k + 1} of ${pages.length}{/i}`, { size: 20 }) }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, border: { top: { style: "single", size: 4, color: "000000", space: 1 },
        bottom: { style: "single", size: 4, color: "000000", space: 1 }, left: { style: "single", size: 4, color: "000000", space: 1 }, right: { style: "single", size: 4, color: "000000", space: 1 } },
        children: [new ImageRun({ type: "png", data: fs.readFileSync(f), transformation: { width: 5.1 * 96 * 0.97, height: 5.1 * 96 * 0.97 * 792 / 612 },
          altText: { title: `Draft manuscript page ${k + 1}`, description: "Page of the DentaMind AI IEEE draft manuscript", name: `paper_p${k + 1}` } })] }),
    ])),
    unnumbered("Appendix B: Plagiarism Report", "appendix_b"),
    p("{b}PENDING. The official plagiarism (similarity) report is not attached because it has not been generated.{/b} The PCCOE instructions make this report mandatory: the similarity must be below 15 %, it must be produced with a good-quality similarity-checking tool, and it must be verified by the guide."),
    p("No similarity score is stated anywhere in this report, and none should be inferred. The team must run the official check on the final text of this report, have the guide verify it, and insert the report here before submission."),
  ];
}

function body() {
  return [...require("./ch1_2.js"), ...require("./ch3_4.js"), ...require("./ch5_6.js"), ...require("./ch7_8.js")];
}

module.exports = { META, REFS, ABBREVIATIONS, SYMBOLS, prelims, body, appendices };

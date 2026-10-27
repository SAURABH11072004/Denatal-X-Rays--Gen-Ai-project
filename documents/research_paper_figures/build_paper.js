// Builds the IEEE two-column research paper (.docx).
// Run from a folder where the `docx` npm package is installed:
//   node build_paper.js <figures_dir> <output.docx>
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, SectionType, Footer,
  PageNumber, TabStopType, Tab, LevelFormat, VerticalAlign,
  Math: OMath, MathRun, MathFraction, MathSubScript, MathSuperScript,
  MathSubSuperScript, MathRadical, MathSum, MathRoundBrackets, MathSquareBrackets,
  MathCurlyBrackets,
} = require("docx");

const FIG = process.argv[2];
const OUT = process.argv[3];
const FONT = "Times New Roman";
const COL = 5040;          // column width in twips (3.5 in)

// ------------------------------------------------------------ references
const REFS = {
  esteva: "A. Esteva, A. Robicquet, B. Ramsundar, V. Kuleshov, M. DePristo, K. Chou, C. Cui, G. Corrado, S. Thrun, and J. Dean, “A guide to deep learning in healthcare,” {i}Nature Med.{/i}, vol. 25, no. 1, pp. 24–29, Jan. 2019, doi: 10.1038/s41591-018-0316-z.",
  rajkomar: "A. Rajkomar, J. Dean, and I. Kohane, “Machine learning in medicine,” {i}N. Engl. J. Med.{/i}, vol. 380, no. 14, pp. 1347–1358, Apr. 2019, doi: 10.1056/NEJMra1814259.",
  wangrl: "L. Wang, W. Zhang, X. He, and H. Zha, “Supervised reinforcement learning with recurrent neural network for dynamic treatment recommendation,” in {i}Proc. 24th ACM SIGKDD Int. Conf. Knowl. Discov. Data Mining (KDD){/i}, 2018, pp. 2447–2456, doi: 10.1145/3219819.3219961.",
  muyama: "L. Muyama, A. Neuraz, and A. Coulet, “Deep reinforcement learning for personalized diagnostic decision pathways using electronic health records: A comparative study on anemia and systemic lupus erythematosus,” {i}Artif. Intell. Med.{/i}, vol. 157, Art. no. 102994, Nov. 2024, doi: 10.1016/j.artmed.2024.102994.",
  etemadi: "M. Etemadi, S. Bazzaz Abkenar, A. Ahmadzadeh, M. Haghi Kashani, P. Asghari, M. Akbari, and E. Mahdipour, “A systematic review of healthcare recommender systems: Open issues, challenges, and techniques,” {i}Expert Syst. Appl.{/i}, vol. 213, Art. no. 118823, Mar. 2023, doi: 10.1016/j.eswa.2022.118823.",
  who: "World Health Organization, {i}Ethics and Governance of Artificial Intelligence for Health: WHO Guidance{/i}. Geneva, Switzerland: World Health Organization, 2021. [Online]. Available: https://www.who.int/publications/i/item/9789240029200",
  nguyen: "N. H. Q. Nguyen, T. T. Nguyen, and A. C. Phan, “A lightweight explainable deep learning for blood cell classification,” {i}Comput. Model. Eng. Sci.{/i}, vol. 145, no. 2, pp. 2435–2456, 2025, doi: 10.32604/cmes.2025.070419.",
  medbert: "L. Rasmy, Y. Xiang, Z. Xie, C. Tao, and D. Zhi, “Med-BERT: Pretrained contextualized embeddings on large-scale structured electronic health records for disease prediction,” {i}npj Digit. Med.{/i}, vol. 4, Art. no. 86, May 2021, doi: 10.1038/s41746-021-00455-y.",
  wangz: "Z. Wang, A. D. Shah, A. R. Tate, S. Denaxas, J. Shawe-Taylor, and H. Hemingway, “Extracting diagnoses and investigation results from unstructured text in electronic health records by semi-supervised machine learning,” {i}PLoS ONE{/i}, vol. 7, no. 1, Art. no. e30412, Jan. 2012, doi: 10.1371/journal.pone.0030412.",
  kersloot: "M. G. Kersloot, F. J. P. van Putten, A. Abu-Hanna, R. Cornet, and D. L. Arts, “Natural language processing algorithms for mapping clinical text fragments onto ontology concepts: A systematic review and recommendations for future studies,” {i}J. Biomed. Semantics{/i}, vol. 11, Art. no. 14, Nov. 2020, doi: 10.1186/s13326-020-00231-z.",
  zhu: "Z. Zhu, Z. Ren, S. Lu, S. Wang, and Y.-D. Zhang, “DLBCNet: A deep learning network for classifying blood cells,” {i}Big Data Cogn. Comput.{/i}, vol. 7, no. 2, Art. no. 75, Apr. 2023, doi: 10.3390/bdcc7020075.",
  lee: "S. J. Lee, P. Y. Chen, and J. W. Lin, “Complete blood cell detection and counting based on deep neural networks,” {i}Appl. Sci.{/i}, vol. 12, no. 16, Art. no. 8140, Aug. 2022, doi: 10.3390/app12168140.",
  tiwari: "P. Tiwari, J. Qian, Q. Li, B. Wang, D. Gupta, A. Khanna, J. J. P. C. Rodrigues, and V. H. C. de Albuquerque, “Detection of subtype blood cells using deep learning,” {i}Cogn. Syst. Res.{/i}, vol. 52, pp. 1036–1044, Dec. 2018, doi: 10.1016/j.cogsys.2018.08.022.",
  erten: "M. Erten, P. D. Barua, S. Dogan, T. Tuncer, R. S. Tan, and U. R. Acharya, “ConcatNeXt: An automated blood cell classification with a new deep convolutional neural network,” {i}Multimedia Tools Appl.{/i}, vol. 84, no. 20, pp. 22231–22249, 2025, doi: 10.1007/s11042-024-19899-x.",
  vaswani: "A. Vaswani, N. Shazeer, N. Parmar, J. Uszkoreit, L. Jones, A. N. Gomez, Ł. Kaiser, and I. Polosukhin, “Attention is all you need,” in {i}Proc. Adv. Neural Inf. Process. Syst. (NIPS){/i}, vol. 30, 2017, pp. 5998–6008.",
  lecun: "Y. LeCun, L. Bottou, Y. Bengio, and P. Haffner, “Gradient-based learning applied to document recognition,” {i}Proc. IEEE{/i}, vol. 86, no. 11, pp. 2278–2324, Nov. 1998, doi: 10.1109/5.726791.",
  lewis: "P. Lewis, E. Perez, A. Piktus, F. Petroni, V. Karpukhin, N. Goyal, H. Küttler, M. Lewis, W. Yih, T. Rocktäschel, S. Riedel, and D. Kiela, “Retrieval-augmented generation for knowledge-intensive NLP tasks,” in {i}Proc. Adv. Neural Inf. Process. Syst. (NeurIPS){/i}, vol. 33, 2020, pp. 9459–9474.",
  he: "K. He, X. Zhang, S. Ren, and J. Sun, “Deep residual learning for image recognition,” in {i}Proc. IEEE Conf. Comput. Vis. Pattern Recognit. (CVPR){/i}, 2016, pp. 770–778, doi: 10.1109/CVPR.2016.90.",
  tan: "M. Tan and Q. V. Le, “EfficientNet: Rethinking model scaling for convolutional neural networks,” in {i}Proc. 36th Int. Conf. Mach. Learn. (ICML){/i}, PMLR, vol. 97, 2019, pp. 6105–6114.",
  robertson: "S. Robertson and H. Zaragoza, “The probabilistic relevance framework: BM25 and beyond,” {i}Found. Trends Inf. Retr.{/i}, vol. 3, no. 4, pp. 333–389, 2009, doi: 10.1561/1500000019.",
  karpukhin: "V. Karpukhin, B. Oğuz, S. Min, P. Lewis, L. Wu, S. Edunov, D. Chen, and W. Yih, “Dense passage retrieval for open-domain question answering,” in {i}Proc. Conf. Empirical Methods Nat. Lang. Process. (EMNLP){/i}, 2020, pp. 6769–6781, doi: 10.18653/v1/2020.emnlp-main.550.",
  guo: "C. Guo, G. Pleiss, Y. Sun, and K. Q. Weinberger, “On calibration of modern neural networks,” in {i}Proc. 34th Int. Conf. Mach. Learn. (ICML){/i}, PMLR, vol. 70, 2017, pp. 1321–1330.",
};
const order = [];  // keys in order of first citation
function citeNums(keys) {
  return keys.map((k) => {
    if (!REFS[k]) throw new Error("unknown reference " + k);
    if (!order.includes(k)) order.push(k);
    return order.indexOf(k) + 1;
  });
}
function citeText(keys) {
  const n = [...new Set(citeNums(keys))].sort((a, b) => a - b);
  const parts = [];
  for (let i = 0; i < n.length;) {
    let j = i;
    while (j + 1 < n.length && n[j + 1] === n[j] + 1) j++;
    if (j - i >= 2) parts.push(`[${n[i]}]–[${n[j]}]`);
    else for (let k = i; k <= j; k++) parts.push(`[${n[k]}]`);
    i = j + 1;
  }
  return parts.join(", ");
}

// ------------------------------------------------------------ inline markup
// {i}..{/i} italic, {b}..{/b} bold, {sub}..{/sub}, {sup}..{/sup}, {c:key,key} citation
function runs(src, base = {}) {
  src = src.replace(/\{c:([^}]+)\}/g, (_, k) => citeText(k.split(",").map((s) => s.trim())));
  const out = [];
  const st = { i: false, b: false, sub: false, sup: false };
  for (const tok of src.split(/(\{\/?(?:i|b|sub|sup)\})/)) {
    const m = tok.match(/^\{(\/?)(i|b|sub|sup)\}$/);
    if (m) { st[m[2]] = !m[1]; continue; }
    if (!tok) continue;
    out.push(new TextRun({
      text: tok, font: FONT, ...base,
      italics: base.italics ? !st.i : st.i,
      bold: base.bold || st.b,
      subScript: st.sub, superScript: st.sup,
    }));
  }
  return out;
}

const P = (t, o = {}) => new Paragraph({
  alignment: AlignmentType.JUSTIFIED, indent: { firstLine: 288 },
  spacing: { after: 60 }, ...o, children: runs(t, { size: 20 }),
});
const PN = (t, o = {}) => P(t, { indent: { firstLine: 0 }, ...o });
const H1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: runs(t) });
const H2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: runs(t) });
const LI = (t) => new Paragraph({
  numbering: { reference: "contrib", level: 0 }, alignment: AlignmentType.JUSTIFIED,
  spacing: { after: 40 }, children: runs(t, { size: 20 }),
});

// ------------------------------------------------------------ equations
const R = (t) => new MathRun(t);
// upright (non-italic) math text, e.g. function names; marked here, styled in postprocess()
const U = (t) => new MathRun("" + t);
const sub = (b, s) => new MathSubScript({ children: [].concat(b), subScript: [].concat(s) });
const sup = (b, s) => new MathSuperScript({ children: [].concat(b), superScript: [].concat(s) });
const frac = (n, d) => new MathFraction({ numerator: [].concat(n), denominator: [].concat(d) });
const rb = (c) => new MathRoundBrackets({ children: [].concat(c) });
function EQ(num, children) {
  return new Paragraph({
    tabStops: [{ type: TabStopType.CENTER, position: COL / 2 }, { type: TabStopType.RIGHT, position: COL }],
    spacing: { before: 80, after: 80 }, keepLines: true,
    children: [new TextRun({ children: [new Tab()], font: FONT }),
      new OMath({ children }),
      new TextRun({ children: [new Tab(), `(${num})`], font: FONT, size: 20 })],
  });
}

// ------------------------------------------------------------ tables
const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
const thin = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
const borders = { top: thin, bottom: thin, left: thin, right: thin };
function cell(t, w, { bold = false, align = AlignmentType.LEFT } = {}) {
  return new TableCell({
    width: { size: w, type: WidthType.DXA }, borders, verticalAlign: VerticalAlign.CENTER,
    margins: { top: 25, bottom: 25, left: 60, right: 60 },
    children: [new Paragraph({ alignment: align, spacing: { after: 0 }, children: runs(t, { size: 16, bold }) })],
  });
}
function TABLE(n, title, head, rows, widths, { center = [], notes = [] } = {}) {
  const total = widths.reduce((a, b) => a + b, 0);
  if (total !== COL) throw new Error(`table ${n} widths ${total}`);
  const al = (c) => (center.includes(c) ? AlignmentType.CENTER : AlignmentType.LEFT);
  const out = [
    new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, spacing: { before: 160, after: 0 },
      children: runs(`TABLE ${ROMAN[n]}`, { size: 16 }) }),
    new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, spacing: { after: 60 },
      children: runs(title, { size: 16, smallCaps: true }) }),
    new Table({
      width: { size: COL, type: WidthType.DXA }, columnWidths: widths,
      rows: [
        new TableRow({ tableHeader: true, cantSplit: true,
          children: head.map((h, c) => cell(h, widths[c], { bold: true, align: al(c) })) }),
        ...rows.map((r) => new TableRow({ cantSplit: true,
          children: r.map((t, c) => cell(t, widths[c], { align: al(c) })) })),
      ],
    }),
  ];
  notes.forEach((t, k) => out.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED,
    spacing: { before: k === 0 ? 40 : 0, after: k === notes.length - 1 ? 120 : 0 },
    children: runs(t, { size: 15 }) })));
  if (!notes.length) out.push(new Paragraph({ spacing: { after: 60 }, children: [] }));
  return out;
}

// ------------------------------------------------------------ figures
function FIGURE(n, file, caption) {
  const png = fs.readFileSync(path.join(FIG, file + ".png"));
  const svg = fs.readFileSync(path.join(FIG, file + ".svg"));
  const wpx = png.readUInt32BE(16), hpx = png.readUInt32BE(20);
  const w = Math.min(3.45, wpx / 600) * 96;
  const h = w * hpx / wpx;
  return [
    new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, spacing: { before: 120, after: 60 },
      children: [new ImageRun({ type: "svg", data: svg, transformation: { width: w, height: h },
        fallback: { type: "png", data: png },
        altText: { title: `Fig. ${n}`, description: caption.replace(/\{\/?\w+\}/g, ""), name: file } })] }),
    new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 160 },
      children: runs(`Fig. ${n}.  ${caption}`, { size: 16 }) }),
  ];
}

// ============================================================ CONTENT
const front = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 },
    children: runs("An Explainable Multimodal AI Framework for Disease Detection, Medical Report Interpretation, and Personalized Care Pathway Recommendation", { size: 48 }) }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 },
    children: runs("Nilesh Sonawane, Saurabh Mali, Sadhyoj Hanwate, and Sachet Lothe", { size: 22 }) }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 },
    children: runs("Guide: Dr. Pradnya Narkhede", { size: 20, italics: true }) }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 },
    children: runs("Department of Computer Engineering, Pimpri Chinchwad College of Engineering, Pune, Maharashtra, India", { size: 20, italics: true }) }),
  new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 }, children: [
    ...runs("Abstract", { size: 18, bold: true, italics: true }),
    ...runs("—Clinical information about one patient is usually spread across laboratory reports, imaging studies, prescriptions, clinical notes and earlier consultations. When each document is read on its own, gradual changes in test values are easy to miss, and patients are left to assemble the overall picture themselves. This paper presents an explainable multimodal AI framework that brings these sources together in a single patient-centred platform. The framework has four technical components. First, pretrained Transformer-based text models and convolutional (CNN) or other vision models interpret supported reports and images, and their features are fused for multi-disease analysis of diabetes, anemia, hypertension, and kidney and liver disorders. Second, current and earlier records are linked by patient identifier and examination date so that changes in laboratory values can be followed over time. Third, a Retrieval-Augmented Generation (RAG) layer grounds explanations in curated medical references, keeps extracted facts separate from model interpretation, and produces a consolidated health summary with suggested next steps for discussion with a clinician. Fourth, a statistical evaluation protocol with predefined targets is specified, together with six optimization techniques for OCR filtering, imputation, transfer learning, hybrid retrieval, trend features and confidence calibration. A real-world multimodal dataset is planned in collaboration with Lothe Lab with a target of approximately 2,261 patients; this is a collection target, subject to data availability, authorization and privacy requirements, not an achieved count. Preliminary component-level values are reported against the targets, but they have not yet been independently verified and are not clinical findings. The system is intended to support, not replace, professional diagnosis.", { size: 18, bold: true }),
  ] }),
  new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 200 }, children: [
    ...runs("Index Terms", { size: 18, bold: true, italics: true }),
    ...runs("—Multimodal artificial intelligence, disease detection, medical report interpretation, explainable AI (XAI), retrieval-augmented generation (RAG), Transformer models, convolutional neural networks (CNN), deep learning, longitudinal health analysis, personalized healthcare, medical data integration, patient health monitoring, statistical analysis, optimization techniques.", { size: 18, bold: true }),
  ] }),
];

const body = [];
const add = (...xs) => xs.forEach((x) => (Array.isArray(x) ? body.push(...x) : body.push(x)));

// I. Introduction
add(H1("I. Introduction"),
  P("Artificial intelligence (AI) has opened new possibilities for disease detection, medical report interpretation and personalized patient care {c:esteva,rajkomar}. In everyday practice, however, a patient’s information is rarely held in one place. Laboratory reports, blood test results, medical images, prescriptions, clinical notes and earlier records arrive in different formats and at different times. Reading them one by one makes it hard to form a view of the patient’s overall condition, and slow changes that only become visible across several reports can go unnoticed. What is missing is an integrated system that can read these different kinds of information together and present the result in plain, understandable language {c:esteva,rajkomar}."),
  P("This work, “An Explainable Multimodal AI Framework for Disease Detection, Medical Report Interpretation, and Personalized Care Pathway Recommendation,” addresses that gap by combining multimodal AI, deep learning and medical knowledge retrieval in a unified patient health platform {c:esteva,rajkomar,etemadi,kersloot}. Pretrained Transformer-based models {c:vaswani} are used to read medical text and its context, while convolutional neural networks (CNNs) {c:lecun} and other pretrained vision models support the analysis of medical images where the modality is supported {c:esteva,nguyen,zhu,lee,tiwari,erten}. Together they extract the relevant content of supported documents and images and look for patterns associated with five selected conditions: diabetes, anemia, hypertension, and kidney and liver disorders."),
  P("A central design choice is to treat a patient’s records as a history rather than a set of unrelated documents. The system orders records chronologically and compares laboratory values, reported findings and other indicators across visits, which makes recurring abnormalities and drifting parameters visible. A Retrieval-Augmented Generation (RAG) approach {c:lewis} then links each generated explanation to passages from trusted medical sources, so that a reader can see where a statement comes from."),
  P("The output is a consolidated health summary that explains potential findings in everyday language and proposes next steps to discuss with a healthcare professional. Because the system works in a clinical setting, it must say clearly what it knows and how sure it is: extracted facts, potential findings and confirmed diagnoses are kept apart, and the platform is positioned as decision support rather than a substitute for clinical judgment {c:esteva,rajkomar,who}."),
  P("The project also plans a real-world multimodal dataset in collaboration with Lothe Lab, with a target of approximately 2,261 patients, subject to data availability, institutional authorization and privacy requirements. Throughout the paper we separate three kinds of statements: the framework design, which is specified in full; the dataset, which is a collection target; and the numerical results, which are preliminary values that still require independent verification (Section XII). The rest of the paper is organized as follows. Section II reviews related work and Section III states the research gap and contributions. Sections IV–IX describe the framework, dataset, interpretation engine, longitudinal analysis, RAG layer and patient summary. Section X defines the statistical protocol, Section XI the optimization techniques and Section XII the results. Sections XIII–XV discuss the findings, limitations and future work."),
);

// II. Related Work
add(H1("II. Related Work"),
  P(`Table I summarizes representative studies. Esteva {i}et al.{/i} ${citeText(["esteva"])} and Rajkomar {i}et al.{/i} ${citeText(["rajkomar"])} survey deep learning and machine learning in medicine and discuss both their promise and the obstacles to clinical use. Wang {i}et al.{/i} {c:wangrl} and Muyama {i}et al.{/i} {c:muyama} apply reinforcement learning to dynamic treatment recommendation and to personalized diagnostic pathways from electronic health records (EHR), the latter for anemia and systemic lupus erythematosus. Etemadi {i}et al.{/i} {c:etemadi} review healthcare recommender systems and list their open problems, and the World Health Organization (WHO) guidance {c:who} sets out ethical and governance principles that constrain how such systems should be designed.`),
  P("Image-based work has concentrated on blood cell analysis: a lightweight explainable network for blood cell classification {c:nguyen} and several deep networks for classification, detection and counting {c:zhu,lee,tiwari,erten}. On the record side, Med-BERT {c:medbert} learns contextual embeddings from structured EHR codes for disease prediction, while {c:wangz} and {c:kersloot} extract diagnoses, investigation results and ontology concepts from free clinical text. Each of these studies shows that data-driven medical analysis is feasible, but each handles a single data type or a single task. None combines report text, laboratory values, images and patient history in one explainable, longitudinal, multi-disease platform."),
  TABLE(1, "Representative Related Studies and Identified Gaps",
    ["Study", "Main contribution", "Gap / relevance"],
    [
      [`Esteva {i}et al.{/i} {c:esteva}`, "Guide to deep learning in healthcare", "General overview; no integrated patient platform"],
      [`Rajkomar {i}et al.{/i} {c:rajkomar}`, "Overview of machine learning in medicine", "Not a concrete multimodal, longitudinal system"],
      [`Wang {i}et al.{/i} {c:wangrl}`, "Supervised RL with RNN for dynamic treatment recommendation", "Treatment focus; no report interpretation"],
      [`Muyama {i}et al.{/i} {c:muyama}`, "Deep RL for diagnostic pathways from EHR (anemia, SLE)", "Two conditions; structured EHR only"],
      [`Etemadi {i}et al.{/i} {c:etemadi}`, "Systematic review of healthcare recommender systems", "Review; no implemented multimodal system"],
      [`WHO {c:who}`, "Ethics and governance guidance for AI in health", "Guidance, not a method; shapes design constraints"],
      [`Nguyen {i}et al.{/i} {c:nguyen}`, "Lightweight explainable deep learning for blood cell classification", "Image-only; single task"],
      [`Rasmy {i}et al.{/i} {c:medbert}`, "Med-BERT: pretrained embeddings on structured EHR for disease prediction", "Coded EHR only; no report or image input"],
      [`Wang {i}et al.{/i} {c:wangz}; Kersloot {i}et al.{/i} {c:kersloot}`, "Extraction of diagnoses and results from clinical text; NLP mapping to ontology concepts", "Text extraction only; no prediction or explanation"],
      [`${citeText(["zhu", "lee", "tiwari", "erten"])}`, "Deep networks for blood cell classification, detection and counting", "Image-only; not linked to reports or history"],
    ], [1300, 1980, 1760]),
);

// III. Research gap and contributions
add(H1("III. Research Gap and Contributions"),
  P("The reviewed work leaves four limitations. (i) Medical information is fragmented across reports, notes, images and prescriptions held in heterogeneous formats. (ii) Most studies address one data type or one task instead of a combined view of the patient. (iii) Records are usually interpreted one at a time, without longitudinal context. (iv) Explanations are seldom grounded in trusted medical references or separated from AI-generated interpretation, a separation that matters for trustworthy use {c:who}. This paper responds with the following contributions:"),
  LI("the design of a unified multimodal framework that integrates laboratory reports, clinical notes, symptoms, prescriptions and supported medical images;"),
  LI("a plan for a real-world multimodal dataset, built with Lothe Lab, with a target of approximately 2,261 patients, subject to availability, authorization and privacy requirements;"),
  LI("multi-disease analysis for diabetes, anemia, hypertension, and kidney and liver disorders from a shared patient representation;"),
  LI("longitudinal analysis that links current and previous records by patient identifier and examination date;"),
  LI("a RAG-based explainability layer that separates extracted facts from AI-generated interpretation and communicates uncertainty;"),
  LI("a statistical analysis protocol with defined metrics and target values; and"),
  LI("six selected optimization techniques covering OCR filtering, imputation, transfer learning, hybrid retrieval, trend features and confidence calibration."),
);

// IV. Proposed framework
add(H1("IV. Proposed Framework"),
  P("The framework is organized as six stages (Fig. 1): patient inputs, secure patient data, multimodal interpretation, longitudinal health analysis, medical RAG and verification, and patient-centred outputs. An evaluation loop returns from the outputs to the inputs, so that errors found during evaluation lead to changes in preprocessing, models or retrieval rather than being absorbed silently. The stages follow a deliberate order. Records are first secured and tied to a patient, because every later step—interpretation, trend analysis and explanation—depends on knowing whose record it is and when it was produced {c:esteva,rajkomar,kersloot}. Interpretation precedes longitudinal analysis because trends are computed on extracted, standardized values, and retrieval comes last because explanations must refer to findings that already exist {c:esteva,rajkomar,etemadi}."),
  FIGURE(1, "fig1_architecture", "Proposed end-to-end architecture of the explainable multimodal AI framework. Records pass through six stages from patient inputs to patient-centred outputs; evaluation results feed back into the pipeline. MRI and DICOM inputs are planned for a future phase."),
  P("Table II traces how a raw record becomes a patient-level insight. Each stage produces a defined output, which makes it possible to evaluate the stages separately with the metrics introduced in Section X."),
  TABLE(2, "Record-to-Insight Workflow",
    ["Stage", "Operation", "Output"],
    [
      ["1", "Collection of reports, notes, symptoms, prescriptions and images with consent", "Raw records"],
      ["2", "Parsing and OCR of reports; extraction of test names, values, units and dates", "Structured fields"],
      ["3", "Standardization of names and units; handling of missing or inconsistent values", "Consistent records"],
      ["4", "Association with patient identifier and examination date", "Patient timeline"],
      ["5", "Modality-specific interpretation (text and image models)", "Findings and embeddings"],
      ["6", "Multimodal fusion and multi-disease analysis", "Potential disease indicators"],
      ["7", "Retrieval of trusted references (RAG)", "Evidence-grounded explanation"],
      ["8", "Dashboard generation", "Health summary and next steps"],
    ], [560, 2880, 1600], { center: [0] }),
);

// V. Dataset development
add(H1("V. Dataset Development"),
  H2("A. Real-World Medical Dataset Collection"),
  P("Medical data will be collected in collaboration with Lothe Lab. The target is approximately 2,261 patients; this figure is a planned collection target, not a count of records already obtained, and it remains subject to data availability and the necessary permissions. The dataset is intended to contain laboratory reports, blood test results, medical history, prescriptions, clinical notes, symptoms and earlier medical records. Public medical datasets may also be used for model development and for comparison {c:esteva,rajkomar,medbert,wangz}. Patient information will be handled under applicable privacy, consent and data-protection requirements, and identifiers will be replaced by pseudonyms before analysis {c:who}."),
  H2("B. Data Preprocessing and Integration"),
  P("Collected records differ in layout, terminology and units, so they are first brought into a common form. Preprocessing extracts the relevant content from each report, standardizes laboratory test names and measurement units, handles missing or inconsistent values, and associates every record with the correct patient and examination date. The result is stored in the unified patient record whose schema is given in Table III {c:medbert,wangz,kersloot}. Records that cannot be mapped reliably are flagged for manual review instead of being added silently, because a single mis-linked report would corrupt the patient’s timeline."),
  P("Fig. 2 shows how the six input types are merged into this record and then ordered into a chronological medical history. The example patient and dates are illustrative; they show the structure of the record, not real patient data."),
  TABLE(3, "Unified Patient Record Schema",
    ["Field", "Description"],
    [
      ["Patient ID", "Pseudonymous patient identifier"],
      ["Examination date", "Date of each report, study or visit"],
      ["Laboratory results", "Test name, value, unit and reference range"],
      ["Medical images", "Image type and study date for supported modalities"],
      ["Clinical notes", "Free-text notes and discharge summaries"],
      ["Symptoms", "Patient-reported symptoms"],
      ["Prescriptions", "Current and past medications"],
      ["History / vitals", "Medical history and vital signs"],
      ["Source", "Original document, kept for traceability"],
    ], [1500, 3540]),
);

// VI. Multimodal interpretation engine
add(H1("VI. Multimodal AI Interpretation Engine"),
  P("The interpretation engine applies pretrained models to supported documents and images. Transformer-based models read medical text, clinical notes and the relations between extracted findings {c:medbert,wangz,kersloot}; CNN-based or other pretrained vision models analyze medical images where the modality is supported {c:zhu,lee,tiwari,erten}. Pretrained models are preferred over training from scratch because labelled medical data are scarce and because pretrained representations transfer reasonably well to new clinical tasks {c:esteva,rajkomar}. The outputs of the separate models are then combined into a single description of the patient."),
  FIGURE(2, "fig2_data_integration", "Integration of multimodal inputs into a unified patient record (fields as in Table III) and a chronological medical history. The patient identifier, dates and entries are illustrative."),
  H2("A. Transformer-Based Text Interpretation"),
  P("Text from reports, notes, symptoms and prescriptions is tokenized and encoded by a Transformer encoder {c:vaswani}. Its core operation is scaled dot-product self-attention,"),
  EQ(1, [U("Attention"), rb([R("Q,K,V")]), R("="), U("softmax"),
    rb([frac([R("Q"), sup(R("K"), R("T"))], [new MathRadical({ children: [sub(R("d"), R("k"))] })])]), R("V")]),
  PN("where {i}Q{/i}, {i}K{/i} and {i}V{/i} are the query, key and value matrices and {i}d{/i}{sub}k{/sub} is the key dimension. Self-attention lets each token weigh every other token in the document, which suits reports in which a value is only meaningful next to its test name, unit and reference range. Pretrained clinical language models such as Med-BERT {c:medbert} are examples of this approach."),
  H2("B. Vision-Based Image Interpretation"),
  P("For supported medical images, a CNN or another pretrained vision model {c:lecun} extracts features through convolution, a nonlinearity and pooling {c:zhu,lee,tiwari,erten}. A convolutional layer computes"),
  EQ(2, [R("z="), U("ReLU"), rb([R("W∗x+b")])]),
  PN("where {i}x{/i} is the input, {i}W{/i} the learned filters, ∗ the convolution operator and {i}b{/i} the bias. Weight sharing across the image keeps the number of parameters small, which is important when labelled images are limited."),
  H2("C. Fusion and Multi-Disease Detection"),
  P("Text, laboratory and image features are concatenated into one patient representation (Fig. 3),"),
  EQ(3, [R("h="), new MathSquareBrackets({ children: [sub(R("h"), U("text")), R(";"), sub(R("h"), U("lab")), R(";"), sub(R("h"), U("img"))] })]),
  PN("and a multi-task output layer estimates an indicator for each selected disease {i}d{/i}:"),
  EQ(4, [sub(R("ŷ"), R("d")), R("=σ"), rb([new MathSubSuperScript({ children: [R("w")], subScript: [R("d")], superScript: [R("T")] }), R("h+"), sub(R("b"), R("d"))])]),
  PN("where σ is the logistic function. Sharing one representation across diseases is a deliberate choice: anemia, kidney disease and diabetes are often reflected in overlapping laboratory panels, and a shared representation lets evidence learned for one condition support the others. Concatenation is the simplest fusion that keeps each modality’s contribution identifiable, which helps the explanation layer of Section VIII."),
  FIGURE(3, "fig3_model_fusion", "Modality-specific models, multimodal feature fusion (3) and the multi-task disease analysis head (4). The outputs are potential indicators for clinician review, not diagnoses."),
  H2("D. Multi-Disease Analysis"),
  P("The processed information is analyzed for potential indicators of the selected conditions {c:esteva,rajkomar,medbert}. The analysis draws on laboratory values, symptoms, medical history and model-generated findings, and it considers the available patient context instead of judging each condition from an isolated value. The scope and quality of disease detection depend on the available data, the selected models, the reference labels and experimental validation. Table IV lists illustrative indicators for each condition; the final set will be agreed with domain experts."),
  TABLE(4, "Target Conditions and Illustrative Indicators",
    ["Condition", "Illustrative indicators"],
    [
      ["Diabetes", "Fasting glucose, HbA1c"],
      ["Anemia", "Hemoglobin, hematocrit, red blood cell indices"],
      ["Hypertension", "Blood pressure, history, symptoms"],
      ["Kidney disorders", "Creatinine, urea"],
      ["Liver disorders", "ALT, AST, bilirubin"],
    ], [1500, 3540]),
  H2("E. Justification of Model Components"),
  P("Table V gives the reason for each component and its main limitation. Stating the limitations next to the reasons is intentional: each limitation corresponds to a safeguard elsewhere in the design, such as flagged records, calibrated confidence or retrieval-grounded explanations."),
  TABLE(5, "Justification of Model Components",
    ["Component", "Why it fits", "Limitation"],
    [
      ["Transformer text model", `Captures context and relations between extracted findings ${citeText(["medbert", "vaswani"])}`, "Can give unsupported output; needs domain adaptation"],
      ["CNN / vision model", `Learns visual features of supported images ${citeText(["zhu", "lee", "tiwari", "erten", "lecun"])}`, "Needs labelled images; performance varies by modality"],
      ["Fusion + multi-task head", "One patient representation shared across diseases", "Missing modalities; uneven labels per disease"],
      ["RAG", `Grounds explanations in trusted references ${citeText(["lewis"])}`, "Depends on coverage of the knowledge base"],
    ], [1250, 2050, 1740]),
);

// VII. Longitudinal analysis
add(H1("VII. Longitudinal Patient Health Analysis"),
  P("Current and historical records are integrated by associating each record with its examination date, which yields a chronological health timeline for every patient {c:medbert}. The framework compares earlier and current laboratory values, identifies recurring abnormalities and presents changes in relevant indicators as trend charts. This gives users a view of how a parameter has moved over time and provides context for reading a new report."),
  P("For a laboratory parameter with values {i}v{/i}{sub}t−1{/sub} and {i}v{/i}{sub}t{/sub} at consecutive examinations, the relative change is"),
  EQ(5, [sub(R("Δ"), R("t")), R("="), frac([sub(R("v"), R("t")), R("−"), sub(R("v"), R("t−1"))], [sub(R("v"), R("t−1"))]), R("×100"), U("%")]),
  PN("and a value is flagged when it lies outside its reference range. Fig. 4 illustrates the idea with synthetic values. Applying (5) between the first and last visits gives +17.9% for fasting glucose (95 to 112 mg/dL) and +13.0% for HbA1c (5.4% to 6.1%), both ending above their reference limits. Hemoglobin falls by 9.9% and dips below its range at the fourth visit, yet ends within range; this is exactly the kind of transient change that is easy to overlook when only the latest report is read."),
  FIGURE(4, "fig4_longitudinal_monitoring", "Longitudinal monitoring of key laboratory parameters with insights and alerts. Values are synthetic and illustrative, not patient data; shaded bands and dashed lines mark reference ranges, and percentage changes follow (5)."),
);

// VIII. RAG and explainability
add(H1("VIII. Retrieval-Augmented Generation and Explainability"),
  P("A Retrieval-Augmented Generation (RAG) mechanism retrieves relevant passages from a curated collection of trusted medical references, and these passages support the explanation of potential findings and suggested next steps. Grounding generation in retrieved text has two advantages over free generation: each explanation can point to its evidence, and missing evidence becomes visible instead of being filled in by the model. The system distinguishes extracted facts from AI-generated interpretation and states its uncertainty when the information is incomplete or conflicting, with the aim of improving transparency and reducing unsupported medical claims {c:esteva,rajkomar,who}."),
  P("Retrieval compares the embedding {b}e{/b}{sub}q{/sub} of a query {i}q{/i} with the embedding {b}e{/b}{sub}d{/sub} of each reference passage {i}d{/i} using cosine similarity {c:lewis}:"),
  EQ(6, [U("sim"), rb([R("q,d")]), R("="), frac([sub(R("e"), R("q")), R("·"), sub(R("e"), R("d"))], [R("‖"), sub(R("e"), R("q")), R("‖ ‖"), sub(R("e"), R("d")), R("‖")])]),
  PN("The top-ranked passages, obtained with the hybrid retrieval of Section XI-D, are passed to the generator. Every output is labelled as an extracted fact, a potential finding or information for discussion, so that no output is presented as a confirmed diagnosis {c:who}."),
);

// IX. Personalized summary
add(H1("IX. Personalized Health Summary and Recommendations"),
  P("The final stage combines report interpretation, multi-disease analysis and longitudinal monitoring in a single patient dashboard. The dashboard shows important findings, historical trends, relevant medical information and evidence-grounded guidance {c:esteva,rajkomar,etemadi}. From the available information, the system may suggest next steps or a relevant specialist category to discuss with a healthcare professional; this is the personalized care pathway referred to in the title. All outputs are presented as decision-support information and do not replace professional diagnosis {c:who}."),
);

// X. Statistical analysis
add(H1("X. Statistical Analysis"),
  P("The statistical analysis pairs descriptive statistics of the extracted data with accuracy, safety and efficiency measures for each stage of the pipeline. Table VI lists the methods and their use in this project."),
  TABLE(6, "Statistical Methods and Their Use",
    ["Method", "Use in this project"],
    [
      ["Descriptive statistics", "Summarize extracted report data, missing fields and identified abnormalities"],
      ["Field-level accuracy", "Check whether extracted test names, values, units and dates match the original reports"],
      ["Precision, recall and F1-score", "Evaluate how accurately predefined abnormalities are identified when verified reference labels are available"],
      ["Trend comparison error", "Compare computed historical comparisons with manually verified results; report the percentage of incorrect comparisons"],
      ["Groundedness evaluation", "Check whether generated explanations and recommendations are supported by the retrieved sources"],
      ["Safety error analysis", "Identify incorrect, misleading or potentially unsafe generated guidance"],
      ["Latency and cost analysis", "Measure report-processing time, API failures and estimated API cost per report"],
    ], [1500, 3540]),
  H2("A. Data, Labels and Validation"),
  P("The framework will be evaluated on datasets with reliable reference labels or expert-verified annotations, where these are available. The evaluation covers information-extraction accuracy; disease-classification performance measured by precision, recall, F1-score, sensitivity and specificity; and the factual support of generated explanations. Longitudinal analysis is assessed for correct patient-record association and for accurate representation of change over time. These evaluations are meant to expose limitations before any clinical use is considered {c:esteva,rajkomar,who}."),
  P("Once the patient-level dataset is assembled, evaluation will use patient-grouped cross-validation: all records that share a pseudonymous patient identifier are kept in the same fold, so that scores estimate performance on patients the models have not seen. Preprocessing statistics, imputation values and hyper-parameters will be fitted on training folds only, to avoid leakage. This protocol relies on the patient identifier of Table III. The split used for the preliminary values of Section XII is not documented with patient identifiers, so patient-grouped validation is not claimed for those values."),
  H2("B. Evaluation Metrics"),
  P("Let TP, FP and FN denote true positives, false positives and false negatives for predefined abnormalities. Table VII defines the metrics. The F1-score is the harmonic mean of precision {i}P{/i} and recall {i}R{/i}, and the 95th-percentile response time is the time within which 95% of requests complete."),
  TABLE(7, "Evaluation Metrics",
    ["Metric", "Definition", "Purpose"],
    [
      ["Field-level accuracy", "matched fields / reference fields", "Extraction quality"],
      ["Precision ({i}P{/i})", "TP / (TP + FP)", "Share of predicted abnormalities that are correct"],
      ["Recall ({i}R{/i})", "TP / (TP + FN)", "Share of reference abnormalities identified"],
      ["F1-score", "2{i}PR{/i} / ({i}P{/i} + {i}R{/i})", "Balance of precision and recall"],
      ["Trend comparison accuracy", "correct comparisons / all comparisons", "Reliability of longitudinal comparison"],
      ["Groundedness", "supported claims / evaluated claims", "Evidence support of explanations"],
      ["Safety error rate", "flagged outputs / evaluated outputs", "Unsafe or misleading guidance (lower is better)"],
    ], [1380, 1830, 1830]),
  H2("C. Target Results"),
  P("Table VIII lists the targets set before evaluation. They are planning targets, not achieved results. Measured values are to be reported with 95% confidence intervals, and any target that is not met is reported as such. The F1 target of 86.5% is consistent with the precision and recall targets, since 2(0.88)(0.85)/(0.88 + 0.85) = 0.865."),
  TABLE(8, "Target Results of the Evaluation",
    ["Evaluation method", "Target", "Interpretation / purpose"],
    [
      ["Field-level extraction accuracy", "≥ 90%", "Extracted report fields that match reference data"],
      ["Precision", "≥ 88%", "Predicted abnormalities that are correct"],
      ["Recall", "≥ 85%", "Reference abnormalities correctly identified"],
      ["F1-score", "≥ 86.5%", "Combined measure of precision and recall"],
      ["Trend comparison accuracy", "≥ 95%", "Historical comparisons matching expected results"],
      ["Groundedness", "≥ 85%", "Evaluated claims supported by retrieved sources"],
      ["Safety error rate", "< 5%", "Outputs flagged for safety issues; lower is better"],
      ["Median response time", "≤ 6 s", "Typical time to process a report and respond"],
      ["95th-percentile response time", "≤ 15 s", "Time within which 95% of requests complete"],
      ["Estimated API cost per report", "1–3†", "Planning estimate; depends on model, input size and number of API calls"],
    ], [1650, 800, 2590], { center: [1], notes: ["†Cost is given in the units of the original planning estimate; the currency was not specified in the source material and must be stated before publication."] }),
);

// XI. Optimization techniques
add(H1("XI. Optimization Techniques"),
  P("Twelve candidate techniques were considered, covering data preprocessing, model input, retrieval, record linkage, trend analysis and output calibration. Six were selected because they act directly on the accuracy or reliability of the framework (Table IX). One-hot encoding, standard scaling, cross-encoder reranking, chunk-size tuning and indexed blocking remain candidates for later tuning, and Transformer-based text processing is already part of the interpretation engine (Section VI)."),
  TABLE(9, "Selected Optimization Techniques",
    ["Technique", "Why selected", "Application", "Metric"],
    [
      ["Confidence-based OCR filtering", "Scanned reports may contain extraction errors", "Flag low-confidence fields; apply validation rules", "Field-level precision and recall"],
      ["Median and mode imputation", "Reports often miss values, units or dates", "Median for numeric, mode for categorical features", "Imputation MAE / RMSE"],
      ["CNN transfer learning", "Pretrained models reduce training from scratch", "Fine-tune ResNet or EfficientNet on supported images", "Sensitivity, specificity, AUC"],
      ["Hybrid retrieval (BM25 + dense)", "Combines exact matching with semantic similarity", "Retrieve passages from curated references for RAG", "Recall@{i}k{/i}, MRR"],
      ["Time-aware trend features", "Captures change across visits", "Previous-to-current differences and rolling statistics", "Trend error and detection accuracy"],
      ["Temperature scaling", "Adjusts confidence without retraining", "Calibrate classifier outputs on a validation set", "ECE, Brier score"],
    ], [1180, 1250, 1500, 1110]),
  H2("A. Confidence-Based OCR Filtering"),
  P("OCR assigns a confidence {i}c{/i}{sub}f{/sub} to each extracted field {i}f{/i}. A field is accepted when {i}c{/i}{sub}f{/sub} ≥ τ; otherwise it is flagged for post-processing and validation rules before it enters the patient record. The threshold τ is chosen on a validation set to balance field-level precision and recall, because a threshold that is too strict sends many correct fields to manual review while one that is too lenient lets OCR errors into the timeline."),
  H2("B. Median and Mode Imputation"),
  P("Missing values are imputed using statistics from the training folds only. For numeric feature {i}j{/i},"),
  EQ(7, [sub(R("x̂"), R("ij")), R("="), U("median"), new MathCurlyBrackets({ children: [sub(R("x"), R("kj")), R(":"), sub(R("x"), R("kj")), U(" observed")] })]),
  PN("while categorical features take the most frequent category. The median is used because laboratory values are often skewed and the median is not pulled by extreme readings. Where a value must not be assumed—for example, an absent diagnosis—the category “unknown” is kept. Imputation quality is measured by MAE and RMSE on deliberately masked test values."),
  H2("C. CNN Transfer Learning"),
  P("A CNN pretrained on a large image dataset, such as ResNet {c:he} or EfficientNet {c:tan}, is fine-tuned on the supported medical-image tasks. Early layers, which capture generic edges and textures, can be kept fixed while later layers and the classifier are updated. This reduces both the labelled data and the training time required compared with training from scratch."),
  H2("D. Hybrid Retrieval"),
  P("Lexical BM25 scoring {c:robertson} is combined with dense semantic retrieval {c:karpukhin}, so that exact medical terms and their paraphrases are both matched:"),
  EQ(8, [R("s"), rb([R("q,d")]), R("=α "), sub(R("s"), U("BM25")), rb([R("q,d")]), R("+"), rb([R("1−α")]), U(" sim"), rb([R("q,d")])]),
  PN("where {i}s{/i}{sub}BM25{/sub} is normalized to [0, 1], sim is the cosine similarity in (6), and α is tuned on a retrieval test set using Recall@{i}k{/i} and the mean reciprocal rank (MRR). Lexical matching protects rare test names and drug names that dense embeddings may blur, while dense matching handles lay wording."),
  H2("E. Time-Aware Trend Features"),
  P("In addition to the relative change in (5), a rolling mean over the last {i}w{/i} valid visits is computed:"),
  EQ(9, [sub(R("m"), R("t")), R("="), frac(R("1"), R("w")), new MathSum({ children: [sub(R("v"), R("t−i"))], subScript: [R("i=0")], superScript: [R("w−1")] })]),
  PN("Percentage changes are computed only where both values are valid, and the features are checked against manually verified comparisons using trend calculation error and trend-detection accuracy. The rolling mean smooths single abnormal readings, so that an alert reflects a sustained change rather than one noisy test."),
  H2("F. Temperature Scaling"),
  P("To make classifier confidence more reliable without retraining, the logits {i}z{/i}{sub}i{/sub} are divided by a temperature {i}T{/i} fitted on a separate validation set {c:guo}:"),
  EQ(10, [sub(R("p"), R("i")), R("="), frac([U("exp"), rb([sub(R("z"), R("i")), R("/T")])], [new MathSum({ children: [U("exp"), rb([sub(R("z"), R("j")), R("/T")])], subScript: [R("j")] })])]),
  PN("Calibration is assessed by the expected calibration error (ECE) and the Brier score,"),
  EQ(11, [U("ECE"), R("="), new MathSum({ children: [frac([R("|"), sub(R("B"), R("m")), R("|")], R("n")), R("|"), U("acc"), rb([sub(R("B"), R("m"))]), R("−"), U("conf"), rb([sub(R("B"), R("m"))]), R("|")], subScript: [R("m")] })]),
  PN("where {i}B{/i}{sub}m{/sub} are the confidence bins and {i}n{/i} is the number of samples. Calibrated confidence underpins the uncertainty statements of Section VIII: a score of 0.8 should mean that about 80% of such predictions are correct."),
);

// XII. Experimental results
add(H1("XII. Experimental Results"),
  H2("A. Status of the Reported Values"),
  P("Tables X–XII report the preliminary values available for this manuscript and compare them with the targets of Table VIII. They should be read with three qualifications. First, the experiment logs, test-set composition, number of evaluated reports and confidence intervals behind each value have not been archived with this manuscript, so the values cannot yet be reproduced independently. Second, the dataset of Section V is a collection target, so the values do not describe the planned Lothe Lab cohort, and, as noted in Section X-A, patient-grouped validation is not claimed for them. Third, no clinician reader study or prospective evaluation has been carried out. The values are therefore preliminary, unverified engineering results and not validated clinical findings. They will be replaced by fully documented measurements, with confidence intervals, when the protocol of Section X has been completed."),
  H2("B. Results Against Targets"),
  P("Table X places each preliminary value next to its target. “Met” means the value reaches the target; “Near” means it falls short by less than one percentage point."),
  TABLE(10, "Preliminary Results Against Targets (Unverified)",
    ["Metric", "Target", "Result", "Status"],
    [
      ["Field-level extraction accuracy", "≥ 90%", "91.2%", "Met"],
      ["Precision", "≥ 88%", "88.4%", "Met"],
      ["Recall", "≥ 85%", "84.6%", "Near"],
      ["F1-score", "≥ 86.5%", "86.4%*", "Near"],
      ["Trend comparison accuracy", "≥ 95%", "94.6%", "Near"],
      ["Groundedness", "≥ 85%", "88.0%", "Met"],
      ["Safety error rate", "< 5%", "3.8%", "Met"],
      ["Median response time", "≤ 6 s", "5.4 s", "Met"],
      ["95th-percentile response time", "≤ 15 s", "13.2 s", "Met"],
      ["Estimated API cost per report", "1–3†", "1.8†", "Met"],
    ], [2040, 1000, 1000, 1000], { center: [1, 2, 3], notes: [
      "*The harmonic mean of the reported precision and recall is 2(0.884)(0.846)/(0.884 + 0.846) = 0.865. The reported 86.4% differs by 0.1 point, which may reflect rounding or per-class averaging; this must be confirmed from the experiment logs.",
      "†Currency not specified in the source material (see Table VIII)."] }),
  H2("C. Component-Level Results"),
  P("Table XI breaks the preliminary values down by component. The text model’s F1 of 0.86 agrees with its precision and recall (harmonic mean 0.865), and the CNN’s AUC of 0.91 matches the transfer-learning row of Table XII."),
  TABLE(11, "Preliminary Component-Level Results (Unverified)",
    ["Component", "Metric", "Value"],
    [
      ["Transformer text interpretation", "Precision / recall / F1", "0.88 / 0.85 / 0.86"],
      ["CNN image analysis", "Sensitivity / specificity / AUC", "0.84 / 0.89 / 0.91"],
      ["RAG retrieval", "Relevant evidence retrieved", "0.88"],
      ["RAG grounding", "Claims supported by citations", "0.90‡"],
      ["RAG answer quality", "Answer relevance", "0.86"],
      ["RAG grounding", "Unsupported claims (lower is better)", "0.12‡"],
    ], [1640, 1900, 1500], { center: [2], notes: [
      "‡The supported (0.90) and unsupported (0.12) claim rates sum to more than 1 and do not match the groundedness of 88.0% in Table X. They can be reconciled only if they come from different claim sets or definitions; this must be resolved from the logs before publication."] }),
  H2("D. Effect of the Optimization Techniques"),
  P("Table XII compares each metric with and without the corresponding optimization technique. The 0.95 trend-detection accuracy with trend features is the 94.6% of Table X rounded to two decimals."),
  TABLE(12, "Preliminary Effect of Optimization Techniques (Unverified)",
    ["Technique", "Metric", "Without", "With"],
    [
      ["Confidence-based OCR filtering", "Field-level F1", "0.86", "0.90"],
      ["Median and mode imputation", "RMSE, z-scored (lower is better)", "0.42", "0.27"],
      ["CNN transfer learning", "AUC", "0.79", "0.91"],
      ["Hybrid retrieval", "Recall@5", "0.74", "0.88"],
      ["Time-aware trend features", "Trend-detection accuracy", "0.88", "0.95"],
      ["Temperature scaling", "ECE (lower is better)", "0.092", "0.031"],
    ], [1640, 1800, 800, 800], { center: [2, 3] }),
  P("Taken at face value, Tables X–XII show that the extraction, groundedness, safety and efficiency targets are met, while recall, F1-score and trend comparison accuracy fall just short. Each selected technique moves its metric in the intended direction. Among the accuracy-type metrics, the largest absolute gains come from hybrid retrieval (+0.14 Recall@5) and transfer learning (+0.12 AUC); temperature scaling gives the largest relative improvement, reducing ECE by about two-thirds. These comparisons rest on single preliminary values without confidence intervals, so they indicate direction rather than establish effect sizes."),
);

// XIII. Discussion
add(H1("XIII. Discussion"),
  P("The framework is designed to integrate medical information from several sources and present a unified view of a patient’s health {c:esteva,rajkomar,medbert}. This section discusses the expected benefits of each part of the design and what must still be shown."),
  H2("A. Unified Medical Data Integration"),
  P("Organizing laboratory results, earlier reports, symptoms, prescriptions and other clinical information in one record {c:medbert,wangz,kersloot}, linked by patient identifier and examination date, maintains a chronological history. This reduces the need to search through separate documents and gives new reports a fuller context."),
  H2("B. Multimodal Interpretation and Multi-Disease Analysis"),
  P("Transformer models can extract and interpret clinical text, and suitable image models can examine supported images {c:medbert,zhu,lee,tiwari,erten}. Combining them may reveal patterns associated with diabetes, anemia, hypertension, and kidney and liver disorders {c:esteva,rajkomar}. How reliable these outputs are will depend on model performance, data quality and validation for each disease category, and per-disease results are not yet available."),
  H2("C. Longitudinal Health Monitoring"),
  P("Comparing current results with earlier records is one of the main expected benefits. Repeated glucose or HbA1c measurements can be shown as a trend, and recurring abnormal values can be highlighted for review, as in Fig. 4. This historical view often says more than a single report read in isolation."),
  H2("D. Explainable Medical Findings"),
  P("RAG is intended to ground explanations in relevant medical references. Instead of only naming a potential finding, the framework aims to show which extracted values or observations led to it and to cite supporting sources where available. Separating extracted information from AI-generated interpretation helps users understand the limits of automated analysis {c:esteva,rajkomar,who}."),
  H2("E. Personalized Patient Health Summary"),
  P("The dashboard brings findings, laboratory trends, earlier reports and relevant history into one interface {c:esteva,rajkomar,etemadi}. Presented in plain language, this may help patients follow their own history and prepare for consultations, with next steps framed as topics to discuss with a professional."),
  H2("F. Overall Assessment"),
  P("The main contribution is the integration of multimodal interpretation, multi-disease analysis, longitudinal monitoring and explainable retrieval in one patient-centred design. Its actual effectiveness still has to be established with reliable reference labels, the metrics of Table VII and, where possible, expert-verified assessment {c:esteva,rajkomar,who}. The preliminary values of Section XII are encouraging in direction but cannot yet support claims about clinical usefulness. The expected deliverables are the unified dataset, the extraction and integration software, the multimodal interpretation models, the longitudinal analysis module, the RAG explanation layer and a prototype patient dashboard."),
);

// XIV. Limitations
add(H1("XIV. Limitations"),
  P("Several limitations remain. Medical reports may contain inconsistent terminology, missing values, different measurement units or incomplete history, and incorrect patient-record matching would distort the longitudinal analysis. Pretrained models can produce inaccurate or unsupported interpretations, and performance may vary across diseases and data sources. The dataset collaboration with Lothe Lab, with its target of approximately 2,261 patients, remains subject to data availability, authorization and privacy requirements."),
  P("The results also carry specific limitations. The values in Tables X–XII are preliminary and unverified: their logs, sample sizes and confidence intervals have not been archived, patient-grouped validation is not claimed for them, and two internal inconsistencies (the F1 value in Table X and the grounding values in Table XI) are still open. The cost estimate lacks a stated currency. Retrieved references must be curated and kept current, and the system must be used only as decision support under appropriate clinical oversight {c:who}."),
);

// XV. Conclusion
add(H1("XV. Conclusion and Future Work"),
  P("This paper has presented an explainable multimodal AI framework that integrates laboratory reports, clinical notes, symptoms, prescriptions and supported medical images; analyzes several diseases from a shared patient representation; tracks changes in patient health over time; and grounds its explanations in trusted medical references through Retrieval-Augmented Generation. The framework is intended to support patients and healthcare professionals, not to replace clinical judgment {c:who}. A statistical protocol with predefined targets and six optimization techniques for extraction, retrieval, trend analysis and confidence calibration have been specified, and preliminary values have been reported with their verification status stated explicitly."),
  P("Future work will first complete the planned dataset and repeat the evaluation under patient-grouped validation with archived logs and confidence intervals. Beyond that, the framework will be extended to more diseases and to imaging modalities such as MRI and DICOM studies, with multilingual patient-friendly explanations, real-time health monitoring, clinician-in-the-loop validation and prospective evaluation under appropriate ethical approval."),
);

// References
const refParas = [new Paragraph({ heading: HeadingLevel.HEADING_1, children: runs("References") })];
order.forEach((k, i) => refParas.push(new Paragraph({
  alignment: AlignmentType.LEFT, spacing: { after: 40 },
  indent: { left: 400, hanging: 400 }, tabStops: [{ type: TabStopType.LEFT, position: 400 }],
  children: [new TextRun({ text: `[${i + 1}]`, font: FONT, size: 16 }),
    new TextRun({ children: [new Tab()], font: FONT, size: 16 }), ...runs(REFS[k], { size: 16 })],
})));
const unused = Object.keys(REFS).filter((k) => !order.includes(k));
if (unused.length) throw new Error("uncited references: " + unused.join(", "));

// ============================================================ DOCUMENT
const page = { size: { width: 12240, height: 15840 },
  margin: { top: 1080, bottom: 1440, left: 900, right: 900, footer: 720 } };
const footer = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
  children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16 })] })] });

const doc = new Document({
  creator: "Nilesh Sonawane, Saurabh Mali, Sadhyoj Hanwate, Sachet Lothe",
  title: "An Explainable Multimodal AI Framework for Disease Detection, Medical Report Interpretation, and Personalized Care Pathway Recommendation",
  styles: {
    default: { document: { run: { font: FONT, size: 20 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: FONT, size: 20, smallCaps: true, color: "000000", bold: false },
        paragraph: { alignment: AlignmentType.CENTER, spacing: { before: 200, after: 100 }, keepNext: true, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: FONT, size: 20, italics: true, color: "000000", bold: false },
        paragraph: { spacing: { before: 120, after: 60 }, keepNext: true, outlineLevel: 1 } },
    ],
  },
  numbering: { config: [{ reference: "contrib", levels: [{ level: 0, format: LevelFormat.DECIMAL,
    text: "%1)", alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 576, hanging: 288 } }, run: { font: FONT, size: 20 } } }] }] },
  sections: [
    { properties: { page }, footers: { default: footer }, children: front },
    { properties: { page, type: SectionType.CONTINUOUS, column: { count: 2, space: 360, equalWidth: true } },
      footers: { default: footer }, children: [...body, ...refParas] },
    // trailing continuous break makes Word balance the two columns on the last page
    { properties: { page, type: SectionType.CONTINUOUS }, footers: { default: footer },
      children: [new Paragraph({ spacing: { after: 0 }, children: [] })] },
  ],
});

async function postprocess(buf) {
  const JSZip = require("jszip");
  const zip = await JSZip.loadAsync(buf);
  let xml = await zip.file("word/document.xml").async("string");
  xml = xml.replace(/<m:r><m:t([^>]*)>/g, '<m:r><m:rPr><m:sty m:val="p"/></m:rPr><m:t$1>');
  if (xml.includes("")) throw new Error("unprocessed upright marker");
  zip.file("word/document.xml", xml);
  return zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
}

Packer.toBuffer(doc).then(postprocess).then((buf) => {
  fs.writeFileSync(OUT, buf);
  console.log("wrote", OUT, "references:", order.length);
});

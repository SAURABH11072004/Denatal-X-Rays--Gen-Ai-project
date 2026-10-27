// Generator for the DentaMind AI IEEE paper, v5 (2026-10-26): v4 condensed to 10 pages; 24 references; prose revised without em/en dashes; same figures, numbers and IEEE two-column US Letter layout.
// Every number in this file is copied from a repository report; the source is named next to each table.
// Usage (needs the `docx` and `jszip` npm packages on NODE_PATH):
//   node build_paper.js <figures_dir> <output.docx> <output.bib>
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, SectionType, Footer,
  PageNumber, TabStopType, Tab, LevelFormat, VerticalAlign,
  Math: OMath, MathRun, MathFraction, MathSubScript, MathSuperScript, MathSubSuperScript,
  MathRadical, MathSum, MathRoundBrackets, MathSquareBrackets, MathCurlyBrackets,
  TableAnchorType, RelativeVerticalPosition, RelativeHorizontalPosition, OverlapType,
} = require("docx");

const [FIG, OUT, BIB] = process.argv.slice(2);
const FONT = "Times New Roman";
const COL = 5040;

// ------------------------------------------------------------ references (all DOIs checked against Crossref/DataCite)
const REFS = {
  hamamciArxiv: { t: "I. E. Hamamci, S. Er, O. F. Durugol, G. R. Cakmak, E. de la Rosa, E. Simsar, et al., \u201cDENTEX: Dental enumeration and tooth pathosis detection benchmark for panoramic X-ray,\u201d {i}arXiv preprint{/i} arXiv:2305.19112, 2023, doi: 10.48550/arXiv.2305.19112.",
    bib: ["misc", { author: "Hamamci, Ibrahim Ethem and Er, Sezgin and Durugol, Omer Faruk and Cakmak, Gulsade Rabia and de la Rosa, Ezequiel and Simsar, Enis and others", title: "{DENTEX}: Dental Enumeration and Tooth Pathosis Detection Benchmark for Panoramic X-ray", year: "2023", eprint: "2305.19112", archivePrefix: "arXiv", doi: "10.48550/arXiv.2305.19112" }] },
  hamamciMiccai: { t: "I. E. Hamamci, S. Er, E. Simsar, A. Sekuboyina, M. Gundogar, B. Stadlinger, A. Mehl, and B. Menze, \u201cDiffusion-based hierarchical multi-label object detection to analyze panoramic dental X-rays,\u201d in {i}Medical Image Computing and Computer Assisted Intervention (MICCAI 2023){/i}, Lecture Notes in Computer Science. Cham, Switzerland: Springer, 2023, pp. 389\u2013399, doi: 10.1007/978-3-031-43987-2_38.",
    bib: ["inproceedings", { author: "Hamamci, Ibrahim Ethem and Er, Sezgin and Simsar, Enis and Sekuboyina, Anjany and Gundogar, Mustafa and Stadlinger, Bernd and Mehl, Albert and Menze, Bjoern", title: "Diffusion-Based Hierarchical Multi-label Object Detection to Analyze Panoramic Dental {X}-Rays", booktitle: "Medical Image Computing and Computer Assisted Intervention -- MICCAI 2023", series: "Lecture Notes in Computer Science", publisher: "Springer", pages: "389--399", year: "2023", doi: "10.1007/978-3-031-43987-2_38" }] },
  putra: { t: "R. H. Putra, E. R. Astuti, D. K. Putri, M. Widiasri, P. A. M. Laksanti, H. Majidah, and N. Yoda, \u201cAutomated permanent tooth detection and numbering on panoramic radiograph using a deep learning approach,\u201d {i}Oral Surg. Oral Med. Oral Pathol. Oral Radiol.{/i}, vol. 137, no. 5, pp. 537\u2013544, May 2024, doi: 10.1016/j.oooo.2023.06.003.",
    bib: ["article", { author: "Putra, Ramadhan Hardani and Astuti, Eha Renwi and Putri, Dina Karimah and Widiasri, Monica and Laksanti, Putri Alfa Meirani and Majidah, Hilda and Yoda, Nobuhiro", title: "Automated permanent tooth detection and numbering on panoramic radiograph using a deep learning approach", journal: "Oral Surgery, Oral Medicine, Oral Pathology and Oral Radiology", volume: "137", number: "5", pages: "537--544", year: "2024", doi: "10.1016/j.oooo.2023.06.003" }] },
  szabo: { t: "V. Szab\u00f3, K. Orhan, C. Dob\u00f3-Nagy, D. S. Veres, D. Manulis, M. Ezhov, A. Sanders, and B. T. Szab\u00f3, \u201cDeep learning-based periapical lesion detection on panoramic radiographs,\u201d {i}Diagnostics{/i}, vol. 15, no. 4, Art. no. 510, Feb. 2025, doi: 10.3390/diagnostics15040510.",
    bib: ["article", { author: "Szab{\\'o}, Viktor and Orhan, Kaan and Dob{\\'o}-Nagy, Csaba and Veres, D{\\'a}niel S{\\'a}ndor and Manulis, David and Ezhov, Matvey and Sanders, Alex and Szab{\\'o}, Bence Tam{\\'a}s", title: "Deep Learning-Based Periapical Lesion Detection on Panoramic Radiographs", journal: "Diagnostics", volume: "15", number: "4", pages: "510", year: "2025", doi: "10.3390/diagnostics15040510" }] },
  bittar: { t: "A. Bittar, R. Dascanio, and M. \u00d6zcan, \u201cArtificial intelligence for dental caries detection: An umbrella review,\u201d {i}J. Dent.{/i}, vol. 175, Art. no. 106944, Dec. 2026, doi: 10.1016/j.jdent.2026.106944.",
    bib: ["article", { author: "Bittar, Ahmad and Dascanio, Rafael and {\\\"O}zcan, Mutlu", title: "Artificial intelligence for dental caries detection: An umbrella review", journal: "Journal of Dentistry", volume: "175", pages: "106944", year: "2026", doi: "10.1016/j.jdent.2026.106944" }] },
  ren: { t: "S. Ren, K. He, R. Girshick, and J. Sun, \u201cFaster R-CNN: Towards real-time object detection with region proposal networks,\u201d {i}IEEE Trans. Pattern Anal. Mach. Intell.{/i}, vol. 39, no. 6, pp. 1137\u20131149, Jun. 2017, doi: 10.1109/TPAMI.2016.2577031.",
    bib: ["article", { author: "Ren, Shaoqing and He, Kaiming and Girshick, Ross and Sun, Jian", title: "Faster {R-CNN}: Towards Real-Time Object Detection with Region Proposal Networks", journal: "IEEE Transactions on Pattern Analysis and Machine Intelligence", volume: "39", number: "6", pages: "1137--1149", year: "2017", doi: "10.1109/TPAMI.2016.2577031" }] },
  maskrcnn: { t: "K. He, G. Gkioxari, P. Doll\u00e1r, and R. Girshick, \u201cMask R-CNN,\u201d in {i}Proc. IEEE Int. Conf. Comput. Vis. (ICCV){/i}, 2017, pp. 2980\u20132988, doi: 10.1109/ICCV.2017.322.",
    bib: ["inproceedings", { author: "He, Kaiming and Gkioxari, Georgia and Doll{\\'a}r, Piotr and Girshick, Ross", title: "Mask {R-CNN}", booktitle: "Proceedings of the IEEE International Conference on Computer Vision (ICCV)", pages: "2980--2988", year: "2017", doi: "10.1109/ICCV.2017.322" }] },
  fpn: { t: "T.-Y. Lin, P. Doll\u00e1r, R. Girshick, K. He, B. Hariharan, and S. Belongie, \u201cFeature pyramid networks for object detection,\u201d in {i}Proc. IEEE Conf. Comput. Vis. Pattern Recognit. (CVPR){/i}, 2017, pp. 936\u2013944, doi: 10.1109/CVPR.2017.106.",
    bib: ["inproceedings", { author: "Lin, Tsung-Yi and Doll{\\'a}r, Piotr and Girshick, Ross and He, Kaiming and Hariharan, Bharath and Belongie, Serge", title: "Feature Pyramid Networks for Object Detection", booktitle: "Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (CVPR)", pages: "936--944", year: "2017", doi: "10.1109/CVPR.2017.106" }] },
  resnet: { t: "K. He, X. Zhang, S. Ren, and J. Sun, \u201cDeep residual learning for image recognition,\u201d in {i}Proc. IEEE Conf. Comput. Vis. Pattern Recognit. (CVPR){/i}, 2016, pp. 770\u2013778, doi: 10.1109/CVPR.2016.90.",
    bib: ["inproceedings", { author: "He, Kaiming and Zhang, Xiangyu and Ren, Shaoqing and Sun, Jian", title: "Deep Residual Learning for Image Recognition", booktitle: "Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (CVPR)", pages: "770--778", year: "2016", doi: "10.1109/CVPR.2016.90" }] },
  coco: { t: "T.-Y. Lin, M. Maire, S. Belongie, J. Hays, P. Perona, D. Ramanan, P. Doll\u00e1r, and C. L. Zitnick, \u201cMicrosoft COCO: Common objects in context,\u201d in {i}Computer Vision \u2013 ECCV 2014{/i}, Lecture Notes in Computer Science. Cham, Switzerland: Springer, 2014, pp. 740\u2013755, doi: 10.1007/978-3-319-10602-1_48.",
    bib: ["inproceedings", { author: "Lin, Tsung-Yi and Maire, Michael and Belongie, Serge and Hays, James and Perona, Pietro and Ramanan, Deva and Doll{\\'a}r, Piotr and Zitnick, C. Lawrence", title: "Microsoft {COCO}: Common Objects in Context", booktitle: "Computer Vision -- ECCV 2014", series: "Lecture Notes in Computer Science", publisher: "Springer", pages: "740--755", year: "2014", doi: "10.1007/978-3-319-10602-1_48" }] },
  imagenet: { t: "J. Deng, W. Dong, R. Socher, L.-J. Li, K. Li, and L. Fei-Fei, \u201cImageNet: A large-scale hierarchical image database,\u201d in {i}Proc. IEEE Conf. Comput. Vis. Pattern Recognit. (CVPR){/i}, 2009, pp. 248\u2013255, doi: 10.1109/CVPR.2009.5206848.",
    bib: ["inproceedings", { author: "Deng, Jia and Dong, Wei and Socher, Richard and Li, Li-Jia and Li, Kai and Fei-Fei, Li", title: "{ImageNet}: A large-scale hierarchical image database", booktitle: "Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (CVPR)", pages: "248--255", year: "2009", doi: "10.1109/CVPR.2009.5206848" }] },
  iso3950: { t: "{i}Dentistry \u2014 Designation System for Teeth and Areas of the Oral Cavity{/i}, ISO Standard 3950:2016, International Organization for Standardization, Geneva, Switzerland, 2016.",
    bib: ["misc", { title: "Dentistry -- Designation system for teeth and areas of the oral cavity", note: "ISO Standard 3950:2016", organization: "International Organization for Standardization", year: "2016" }] },
  naeini: { t: "M. P. Naeini, G. Cooper, and M. Hauskrecht, \u201cObtaining well calibrated probabilities using Bayesian binning,\u201d in {i}Proc. AAAI Conf. Artif. Intell.{/i}, vol. 29, no. 1, 2015, doi: 10.1609/aaai.v29i1.9602.",
    bib: ["inproceedings", { author: "Naeini, Mahdi Pakdaman and Cooper, Gregory and Hauskrecht, Milos", title: "Obtaining Well Calibrated Probabilities Using {Bayesian} Binning", booktitle: "Proceedings of the AAAI Conference on Artificial Intelligence", volume: "29", number: "1", year: "2015", doi: "10.1609/aaai.v29i1.9602" }] },
  guo: { t: "C. Guo, G. Pleiss, Y. Sun, and K. Q. Weinberger, \u201cOn calibration of modern neural networks,\u201d in {i}Proc. 34th Int. Conf. Mach. Learn. (ICML){/i}, PMLR, vol. 70, 2017, pp. 1321\u20131330.",
    bib: ["inproceedings", { author: "Guo, Chuan and Pleiss, Geoff and Sun, Yu and Weinberger, Kilian Q.", title: "On Calibration of Modern Neural Networks", booktitle: "Proceedings of the 34th International Conference on Machine Learning", series: "Proceedings of Machine Learning Research", volume: "70", pages: "1321--1330", year: "2017" }] },
  brier: { t: "G. W. Brier, \u201cVerification of forecasts expressed in terms of probability,\u201d {i}Mon. Weather Rev.{/i}, vol. 78, no. 1, pp. 1\u20133, Jan. 1950, doi: 10.1175/1520-0493(1950)078<0001:VOFEIT>2.0.CO;2.",
    bib: ["article", { author: "Brier, Glenn W.", title: "Verification of forecasts expressed in terms of probability", journal: "Monthly Weather Review", volume: "78", number: "1", pages: "1--3", year: "1950", doi: "10.1175/1520-0493(1950)078<0001:VOFEIT>2.0.CO;2" }] },
  youden: { t: "W. J. Youden, \u201cIndex for rating diagnostic tests,\u201d {i}Cancer{/i}, vol. 3, no. 1, pp. 32\u201335, 1950, doi: 10.1002/1097-0142(1950)3:1<32::AID-CNCR2820030106>3.0.CO;2-3.",
    bib: ["article", { author: "Youden, W. J.", title: "Index for rating diagnostic tests", journal: "Cancer", volume: "3", number: "1", pages: "32--35", year: "1950", doi: "10.1002/1097-0142(1950)3:1<32::AID-CNCR2820030106>3.0.CO;2-3" }] },
  wangTTA: { t: "G. Wang, W. Li, M. Aertsen, J. Deprest, S. Ourselin, and T. Vercauteren, \u201cAleatoric uncertainty estimation with test-time augmentation for medical image segmentation with convolutional neural networks,\u201d {i}Neurocomputing{/i}, vol. 338, pp. 34\u201345, Apr. 2019, doi: 10.1016/j.neucom.2019.01.103.",
    bib: ["article", { author: "Wang, Guotai and Li, Wenqi and Aertsen, Michael and Deprest, Jan and Ourselin, S{\\'e}bastien and Vercauteren, Tom", title: "Aleatoric uncertainty estimation with test-time augmentation for medical image segmentation with convolutional neural networks", journal: "Neurocomputing", volume: "338", pages: "34--45", year: "2019", doi: "10.1016/j.neucom.2019.01.103" }] },
  linJS: { t: "J. Lin, \u201cDivergence measures based on the Shannon entropy,\u201d {i}IEEE Trans. Inf. Theory{/i}, vol. 37, no. 1, pp. 145\u2013151, Jan. 1991, doi: 10.1109/18.61115.",
    bib: ["article", { author: "Lin, J.", title: "Divergence measures based on the {Shannon} entropy", journal: "IEEE Transactions on Information Theory", volume: "37", number: "1", pages: "145--151", year: "1991", doi: "10.1109/18.61115" }] },
  geifman: { t: "Y. Geifman and R. El-Yaniv, \u201cSelective classification for deep neural networks,\u201d in {i}Proc. Adv. Neural Inf. Process. Syst. (NIPS){/i}, vol. 30, 2017, pp. 4878\u20134887.",
    bib: ["inproceedings", { author: "Geifman, Yonatan and El-Yaniv, Ran", title: "Selective Classification for Deep Neural Networks", booktitle: "Advances in Neural Information Processing Systems", volume: "30", pages: "4878--4887", year: "2017" }] },
  wangAL: { t: "H. Wang, Q. Jin, S. Li, S. Liu, M. Wang, and Z. Song, \u201cA comprehensive survey on deep active learning in medical image analysis,\u201d {i}Med. Image Anal.{/i}, vol. 95, Art. no. 103201, Jul. 2024, doi: 10.1016/j.media.2024.103201.",
    bib: ["article", { author: "Wang, Haoran and Jin, Qiuye and Li, Shiman and Liu, Siyu and Wang, Manning and Song, Zhijian", title: "A comprehensive survey on deep active learning in medical image analysis", journal: "Medical Image Analysis", volume: "95", pages: "103201", year: "2024", doi: "10.1016/j.media.2024.103201" }] },
  // ---- added 2026-10-25; metadata verified against Crossref (and PubMed where indexed)
  zhangJBHI: { t: "Y. Zhang, Y. Yu, Q. Li, H. Chen, Y. Liang, J. Chen, and J. Yin, “A reliable multi-stage system for tooth instance segmentation and numbering in panoramic radiographs,” {i}IEEE J. Biomed. Health Inform.{/i}, early access, Dec. 2025, pp. 1–13, doi: 10.1109/JBHI.2025.3643805.",
    bib: ["article", { author: "Zhang, Yani and Yu, Yuzhou and Li, Qiankun and Chen, Huabao and Liang, Yuci and Chen, Junxin and Yin, Jiayue", title: "A Reliable Multi-Stage System for Tooth Instance Segmentation and Numbering in Panoramic Radiographs", journal: "IEEE Journal of Biomedical and Health Informatics", pages: "1--13", year: "2025", note: "Early access", doi: "10.1109/JBHI.2025.3643805" }] },
  huangUQ: { t: "L. Huang, S. Ruan, Y. Xing, and M. Feng, “A review of uncertainty quantification in medical image analysis: Probabilistic and non-probabilistic methods,” {i}Med. Image Anal.{/i}, vol. 97, Art. no. 103223, Oct. 2024, doi: 10.1016/j.media.2024.103223.",
    bib: ["article", { author: "Huang, Ling and Ruan, Su and Xing, Yucheng and Feng, Mengling", title: "A review of uncertainty quantification in medical image analysis: Probabilistic and non-probabilistic methods", journal: "Medical Image Analysis", volume: "97", pages: "103223", year: "2024", doi: "10.1016/j.media.2024.103223" }] },
  huangDup: { t: "Y. Huang, Z. Sun, J. Chen, T. Yang, L. Xie, and X. Lin, “Near-duplicate contamination inflates brain MRI benchmark performance: A size-matched, multi-seed MedNeXt-B study,” {i}Front. Med.{/i}, vol. 13, Art. no. 1955863, Oct. 2026, doi: 10.3389/fmed.2026.1955863.",
    bib: ["article", { author: "Huang, Yuhan and Sun, Zhipeng and Chen, Jinghui and Yang, Tao and Xie, Lianxin and Lin, Xinchen", title: "Near-duplicate contamination inflates brain {MRI} benchmark performance: a size-matched, multi-seed {MedNeXt-B} study", journal: "Frontiers in Medicine", volume: "13", pages: "1955863", year: "2026", doi: "10.3389/fmed.2026.1955863" }] },
  kapoor: { t: "S. Kapoor and A. Narayanan, \u201cLeakage and the reproducibility crisis in machine-learning-based science,\u201d {i}Patterns{/i}, vol. 4, no. 9, Art. no. 100804, Sep. 2023, doi: 10.1016/j.patter.2023.100804.",
    bib: ["article", { author: "Kapoor, Sayash and Narayanan, Arvind", title: "Leakage and the reproducibility crisis in machine-learning-based science", journal: "Patterns", volume: "4", number: "9", pages: "100804", year: "2023", doi: "10.1016/j.patter.2023.100804" }] },
};
const order = [];
function citeText(keys) {
  const n = [...new Set(keys.map((k) => {
    if (!REFS[k]) throw new Error("unknown reference " + k);
    if (!order.includes(k)) order.push(k);
    return order.indexOf(k) + 1;
  }))].sort((a, b) => a - b);
  const parts = [];
  for (let i = 0; i < n.length;) {
    let j = i;
    while (j + 1 < n.length && n[j + 1] === n[j] + 1) j++;
    if (j - i >= 2) parts.push(`[${n[i]}]\u2013[${n[j]}]`);
    else for (let k = i; k <= j; k++) parts.push(`[${n[k]}]`);
    i = j + 1;
  }
  return parts.join(", ");
}

// ------------------------------------------------------------ inline markup: {i} {b} {sub} {sup} {c:key,key}
function runs(src, base = {}) {
  src = src.replace(/\{c:([^}]+)\}/g, (_, k) => citeText(k.split(",").map((s) => s.trim())));
  const out = [];
  const st = { i: false, b: false, sub: false, sup: false };
  for (const tok of src.split(/(\{\/?(?:i|b|sub|sup)\})/)) {
    const m = tok.match(/^\{(\/?)(i|b|sub|sup)\}$/);
    if (m) { st[m[2]] = !m[1]; continue; }
    if (!tok) continue;
    out.push(new TextRun({ text: tok, font: FONT, ...base, italics: base.italics ? !st.i : st.i,
      bold: base.bold || st.b, subScript: st.sub, superScript: st.sup }));
  }
  return out;
}
const P = (t, o = {}) => new Paragraph({ alignment: AlignmentType.JUSTIFIED, indent: { firstLine: 288 },
  spacing: { after: 60 }, ...o, children: runs(t, { size: 20 }) });
const PN = (t, o = {}) => P(t, { indent: { firstLine: 0 }, ...o });
const H1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: runs(t) });
const H2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: runs(t) });
const LI = (t) => new Paragraph({ numbering: { reference: "contrib", level: 0 }, alignment: AlignmentType.JUSTIFIED,
  spacing: { after: 40 }, children: runs(t, { size: 20 }) });

// ------------------------------------------------------------ equations
const R = (t) => new MathRun(t);
const U = (t) => new MathRun("\uE000" + t);            // upright text inside math (styled in postprocess)
const sub = (b, s) => new MathSubScript({ children: [].concat(b), subScript: [].concat(s) });
const sup = (b, s) => new MathSuperScript({ children: [].concat(b), superScript: [].concat(s) });
const subsup = (b, s, p) => new MathSubSuperScript({ children: [].concat(b), subScript: [].concat(s), superScript: [].concat(p) });
const frac = (n, d) => new MathFraction({ numerator: [].concat(n), denominator: [].concat(d) });
const rb = (c) => new MathRoundBrackets({ children: [].concat(c) });
const sum = (c, s, p) => new MathSum({ children: [].concat(c), subScript: s ? [].concat(s) : undefined, superScript: p ? [].concat(p) : undefined });
let eqNo = 0;
function EQ(children) {
  eqNo += 1;
  return new Paragraph({ tabStops: [{ type: TabStopType.CENTER, position: COL / 2 }, { type: TabStopType.RIGHT, position: COL }],
    spacing: { before: 60, after: 60 }, keepLines: true,
    children: [new TextRun({ children: [new Tab()], font: FONT }), new OMath({ children }),
      new TextRun({ children: [new Tab(), `(${eqNo})`], font: FONT, size: 20 })] });
}

// ------------------------------------------------------------ tables
const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];
let tabNo = 0;
const tabId = {};
const thin = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
const borders = { top: thin, bottom: thin, left: thin, right: thin };
function cell(t, w, { bold = false, align = AlignmentType.LEFT, size = 15, keepNext = false } = {}) {
  return new TableCell({ width: { size: w, type: WidthType.DXA }, borders, verticalAlign: VerticalAlign.CENTER,
    margins: { top: 20, bottom: 20, left: 50, right: 50 },
    children: [new Paragraph({ alignment: align, keepNext, spacing: { after: 0 }, children: runs(t, { size, bold }) })] });
}
// reserve a table number by id before it is cited, so text can say "Table {T:id}"
function T(id) { if (!tabId[id]) { tabNo += 1; tabId[id] = tabNo; } return ROMAN[tabId[id]]; }
function TABLE(id, title, head, rows, widths, { center = [], notes = [], size = 15 } = {}) {
  const total = widths.reduce((a, b) => a + b, 0);
  if (total !== COL) throw new Error(`table ${id} widths ${total}`);
  const n = T(id);
  const al = (c) => (center.includes(c) ? AlignmentType.CENTER : AlignmentType.LEFT);
  const out = [
    new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, spacing: { before: 140, after: 0 }, children: runs(`TABLE ${n}`, { size: 16 }) }),
    new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, spacing: { after: 50 }, children: runs(title, { size: 16, smallCaps: true }) }),
    new Table({ width: { size: COL, type: WidthType.DXA }, columnWidths: widths, rows: [
      // keepNext keeps short tables (<= 10 rows) in one column (Word does not repeat headers across columns);
      // longer tables may continue in the next column rather than leave a large gap
      new TableRow({ tableHeader: true, cantSplit: true, children: head.map((h, c) => cell(h, widths[c], { bold: true, align: al(c), size, keepNext: true })) }),
      ...rows.map((r, i) => new TableRow({ cantSplit: true, children: r.map((t, c) => cell(t, widths[c], { align: al(c), size, keepNext: rows.length <= 10 ? i < rows.length - 1 : i < 1 })) })),
    ] }),
  ];
  notes.forEach((t, k) => out.push(new Paragraph({ alignment: AlignmentType.LEFT,
    spacing: { before: k === 0 ? 30 : 0, after: k === notes.length - 1 ? 120 : 0 }, children: runs(t, { size: 14 }) })));
  if (!notes.length) out.push(new Paragraph({ spacing: { after: 60 }, children: [] }));
  return out;
}

// ------------------------------------------------------------ figures
let figNo = 0;
const figId = {};
function F(id) { if (!figId[id]) { figNo += 1; figId[id] = figNo; } return figId[id]; }
// v5: each figure and its caption sit in one borderless floating cell pinned to the top of the current column
// (IEEE-style top placement), so text backfills the column instead of leaving a gap when a figure does not fit.
const nob = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
function FIGURE(id, file, caption, { inline = false } = {}) {
  const n = F(id);
  const png = fs.readFileSync(path.join(FIG, "preview_png", file + ".png"));
  const svg = fs.readFileSync(path.join(FIG, "embed_svg", file + ".svg"));
  const wpx = png.readUInt32BE(16), hpx = png.readUInt32BE(20);
  const w = Math.min(3.45, wpx / 600) * 96;
  const h = w * hpx / wpx;
  const kids = [
    new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, spacing: { before: inline ? 120 : 0, after: 60 },
      children: [new ImageRun({ type: "svg", data: svg, transformation: { width: w, height: h }, fallback: { type: "png", data: png },
        altText: { title: `Fig. ${n}`, description: caption.replace(/\{[^}]+\}/g, ""), name: file } })] }),
    new Paragraph({ alignment: AlignmentType.LEFT, spacing: { after: inline ? 160 : 0 }, children: runs(`Fig. ${n}.  ${caption}`, { size: 16 }) }),
  ];
  // inline: for a figure whose float would compete with another float for the same column top (Word may overlap them)
  if (inline) return kids;
  return [new Table({ width: { size: COL, type: WidthType.DXA }, columnWidths: [COL],
    float: { horizontalAnchor: TableAnchorType.TEXT, relativeHorizontalPosition: RelativeHorizontalPosition.CENTER,
      verticalAnchor: TableAnchorType.MARGIN, relativeVerticalPosition: RelativeVerticalPosition.TOP,
      bottomFromText: 200, overlap: OverlapType.NEVER },
    rows: [new TableRow({ cantSplit: true, children: [new TableCell({ width: { size: COL, type: WidthType.DXA },
      margins: { top: 0, bottom: 0, left: 0, right: 0 }, borders: { top: nob, bottom: nob, left: nob, right: nob }, children: kids })] })] })];
}
// ------------------------------------------------------------ algorithm box (ruled top and bottom, kept together)
function ALGO(title, lines) {
  const rule = { style: BorderStyle.SINGLE, size: 6, color: "000000" };
  const none = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  const paras = lines.map(([indent, text], k) => new Paragraph({ keepNext: k < lines.length - 1, spacing: { after: 10 },
    indent: { left: 200 + indent * 220, hanging: 200 }, children: runs(text, { size: 16 }) }));
  return [
    new Paragraph({ keepNext: true, spacing: { before: 120, after: 40 }, children: runs(title, { size: 16, bold: true }) }),
    new Table({ width: { size: COL, type: WidthType.DXA }, columnWidths: [COL], rows: [new TableRow({ cantSplit: true, children: [
      new TableCell({ width: { size: COL, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 40, right: 40 },
        borders: { top: rule, bottom: rule, left: none, right: none }, children: paras })] })] }),
    new Paragraph({ spacing: { after: 80 }, children: [] }),
  ];
}

// text helper: {T:id} -> table roman numeral, {F:id} -> figure number
const X = (s) => s.replace(/\{T:(\w+)\}/g, (_, id) => T(id)).replace(/\{F:(\w+)\}/g, (_, id) => String(F(id)));
const Px = (s, o) => P(X(s), o);
const PNx = (s, o) => PN(X(s), o);

// ============================================================ CONTENT (v5: condensed to 10 pages, 2026-10-26)
// Figure numbers follow the order of first citation in the text; registering them here guards that order.
["arch", "flow", "num", "cls", "review", "splits", "eval"].forEach(F);
const TITLE = "DentaMind AI: An Uncertainty-Aware Pipeline for Tooth Detection, FDI Numbering, Segmentation and Finding Classification on Panoramic Dental Radiographs";
const front = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 }, children: runs(TITLE, { size: 44 }) }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: runs("Nilesh Sonawane, Saurabh Mali, Sadhyoj Hanwate, and Sachet Lothe", { size: 22 }) }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: runs("Guide: Dr. Pradnya Narkhede", { size: 20, italics: true }) }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: runs("Department of Computer Engineering, Pimpri Chinchwad College of Engineering (PCCOE), Pune, Maharashtra, India", { size: 20, italics: true }) }),
  // "Abstract—" and "Index Terms—" keep the IEEE template's em-dash label; the prose itself contains none
  new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 }, children: [
    ...runs("Abstract", { size: 18, bold: true, italics: true }),
    ...runs("—DentaMind AI is a research prototype, built on the public DENTEX dataset, that detects teeth, assigns FDI numbers, segments tooth instances and gives each detected tooth the closest of four finding classes (Caries, Deep Caries, Impacted, Periapical Lesion), while routing uncertain regions to a human reviewer. On a held-out internal test split of 63 radiographs, the detector reached AP50 0.966 and the segmenter mask AP50 0.974 (mean matched Dice 0.873), and 96.8 % of matched teeth received the correct FDI number. On ground-truth crops from 73 test radiographs, the finding classifier reached accuracy 0.785 and macro-F1 0.646, but Periapical Lesion recall was only 0.308. With detector boxes in place of ground-truth boxes, validation macro-F1 fell from 0.718 to 0.634. An entropy rule flagged 54.2 % of test crops, which held 86.8 % of the classifier’s errors; temperature scaling lowered test ECE from 0.048 to 0.036 but was not adopted. Four classifier-improvement attempts judged against criteria fixed in advance, and an active-learning study, were all negative. Splits are grouped by pixel hash and every use of the test split is logged, but DENTEX has no patient identifiers, so patient-level leakage cannot be ruled out. The system has not been clinically validated and is not a diagnostic device.", { size: 18, bold: true }),
  ] }),
  new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 200 }, children: [
    ...runs("Index Terms", { size: 18, bold: true, italics: true }),
    ...runs("—Dental panoramic radiography, DENTEX, tooth detection, FDI tooth numbering, instance segmentation, finding classification, uncertainty estimation, calibration, selective prediction, data leakage, reproducibility.", { size: 18, bold: true }),
  ] }),
];

const body = [];
const add = (...xs) => xs.forEach((x) => (Array.isArray(x) ? body.push(...x) : body.push(x)));
const NA = "n/a";

// ---------------------------------------------------------------- I. Introduction (gap and contributions merged in)
add(H1("I. Introduction"),
  P("A panoramic radiograph shows both dental arches in one exposure, which makes it a common first image in a dental examination and a demanding one to read: each tooth has to be located, numbered and checked for findings such as caries, impaction or periapical lesions. Deep learning has been applied to each of these steps, from tooth detection, numbering and segmentation {c:putra,zhangJBHI} to individual findings {c:szabo,bittar}, and the DENTEX benchmark lets enumeration and diagnosis be studied on the same public images {c:hamamciArxiv,hamamciMiccai}."),
  P("Two practical questions receive less attention. The first is how the stages behave together. Classifiers are usually scored on hand-drawn tooth boxes, while a deployed system crops whatever the detector returns, so errors carry over from one stage to the next. The second is whether the evaluation can be trusted. Leakage inflates reported performance across machine-learning research {c:kapoor}, and near-duplicate images shared between splits have been shown to raise medical-imaging benchmark scores {c:huangDup}. On DENTEX, where one radiograph can appear in several sub-sets under different file names, this risk is concrete."),
  P("DentaMind AI was built to answer both questions on DENTEX. Its networks are standard (Faster R-CNN {c:ren}, Mask R-CNN {c:maskrcnn} and ResNet-50 {c:resnet}), and we claim no architectural novelty. What we contribute is evidence about such a pipeline when every stage is measured on the same held-out data:"),
  LI(`an open pipeline that links detection, FDI numbering, segmentation and finding classification region by region through IoU matching, never by list position (Figs. ${F("arch")} and ${F("flow")});`),
  LI("an end-to-end study of how detector boxes, instead of ground-truth boxes, change finding classification, with the loss traced to its causes;"),
  LI("an evaluation of uncertainty-based review routing, calibration and abstention, with thresholds fixed on a separate calibration split;"),
  LI("four controlled attempts to improve the classifier and one active-learning study, judged against criteria fixed before the results were known; all were negative; and"),
  LI("an auditable data protocol with pixel-hash grouped splits, leakage checks and a hash-chained ledger of every use of the test split."),
  P("Every number in this paper can be traced to a named evaluation report in the project repository. The system is a research prototype; it has not been clinically validated and does not make diagnoses."),
);

// ---------------------------------------------------------------- II. Related work (grouped by task; comparison table folded into the text)
add(H1("II. Related Work"),
  P("{i}Detection, numbering and segmentation.{/i} Putra {i}et al.{/i} {c:putra} detect and number permanent teeth on panoramic radiographs with a deep detector. Zhang {i}et al.{/i} {c:zhangJBHI} combine instance segmentation with FDI-compliant numbering in a multi-stage system that treats missing and supernumerary teeth explicitly. DentaMind AI covers the same task pair, but links the stages by IoU and adds review routing on top."),
  P("{i}Finding classification.{/i} Szabó {i}et al.{/i} {c:szabo} evaluate a commercial system for periapical lesions on 616 teeth from 357 panoramic radiographs; this is the class on which our classifier is weakest. Bittar {i}et al.{/i} {c:bittar} summarize the evidence on AI for caries detection in an umbrella review. Hamamci {i}et al.{/i} released DENTEX {c:hamamciArxiv}, the source of our data and finding taxonomy, together with a diffusion-based hierarchical detector for its enumeration-and-diagnosis task {c:hamamciMiccai}."),
  FIGURE("arch", "fig1_architecture", "System architecture of DentaMind AI as implemented. The tooth detector feeds number assignment, mask matching and finding classification; per-region uncertainty signals become review flags before the final result, report drafting and human review. Bold outlines mark trained networks."),
  P("{i}Uncertainty and data efficiency.{/i} From the uncertainty-quantification literature for medical images {c:huangUQ} we use only simple, single-network tools: selective classification, which lets a model withhold a prediction {c:geifman}; test-time augmentation as a cheap uncertainty estimate {c:wangTTA}; and temperature scaling {c:guo}, assessed with the expected calibration error (ECE) {c:naeini}. Active learning aims to cut labeling effort in medical imaging {c:wangAL}, and we test whether it does so here."),
  P("{i}Data integrity.{/i} Kapoor and Narayanan {c:kapoor} identify leakage as a common cause of irreproducible machine-learning results, and Huang {i}et al.{/i} {c:huangDup} show how near-duplicate contamination inflates a brain-MRI benchmark. Our split and audit protocol (Section III) is designed around both risks. Throughout, we measure how much existing techniques help on DENTEX rather than propose new ones."),
);

// ---------------------------------------------------------------- III. Dataset
add(H1("III. Dataset and Data Preparation"),
  H2("A. DENTEX Sub-Sets and Their Overlap"),
  Px("We use the DENTEX panoramic radiographs {c:hamamciArxiv}, collected at three institutions with several scanners. Table {T:sources} lists the sub-sets found by the project’s dataset audit. The {i}quadrant-enumeration{/i} sub-set labels every tooth with its quadrant and tooth index, which together give the two-digit FDI code {c:iso3950}. The {i}quadrant-enumeration-disease{/i} sub-set labels only teeth that carry one of four findings. Annotations include boxes and polygon masks."),
  TABLE("sources", "DENTEX Sub-Sets Present in the Project (Dataset Audit, 2026-10-14)",
    ["Sub-set", "Images", "Annotations", "Use"],
    [
      ["quadrant", "693", "2,772", "not used by the current models"],
      ["quadrant-enumeration", "634", "18,095", "detection, numbering, segmentation"],
      ["quadrant-enumeration-disease", "705", "3,529", "finding classification"],
      ["unlabelled", "1,571", NA, "active-learning pool"],
      ["validation_data (unlabeled)", "50", NA, "inference demonstration only"],
      ["All files on disk", "3,653", "", "2,716 distinct radiographs by pixels"],
    ], [1650, 650, 900, 1840], { center: [1, 2], notes: ["Source: Data/reports/dataset_audit.md. In the disease sub-set, 27 images have no annotation."] }),
  P("The sub-sets overlap heavily. The 3,653 files hold only 2,716 distinct radiographs, and the 2,005 annotated entries only 1,133; 235 radiographs appear in all three annotated sub-sets, sometimes under different file names. Image counts quoted for DENTEX therefore count entries, not distinct radiographs, and certainly not independent patients."),
  H2("B. Finding Taxonomy and Excluded Data"),
  P("The disease sub-set contains 2,189 Caries, 578 Deep Caries, 604 Impacted and 158 Periapical Lesion annotations. It has no “healthy” label: a tooth without a finding is simply not annotated. The official DENTEX test release uses a different, Turkish and treatment-oriented label set (for example “1-çürük” and “3-kanal”), and the project found no verified equivalence between those labels and the four English classes. On the one radiograph shared by both releases, the English labels contradicted the mapping. In addition, 95 of the 250 official test images are byte-identical to radiographs in DENTEX’s own training sub-sets. For both reasons, the official test set is excluded from every evaluation in this paper. The 50 unlabeled {i}validation_data{/i} images are used only to demonstrate inference; 20 of them duplicate labeled radiographs."),
  H2("C. Splitting Procedure"),
  Px("Each radiograph is identified by the SHA-256 hash of its pixels, so identical copies in different sub-sets form one group and always share a split. Groups are assigned with seed 42 to train, validation, calibration and test splits in proportions 0.70/0.10/0.10/0.10. The split file is append-only, so an image never changes split. Train fits weights, validation selects the epoch and gives validation metrics, calibration fixes thresholds and the temperature, and test is kept for final metrics. Table {T:splits} gives the counts per task."),
  TABLE("splits", "Split Statistics per Task",
    ["Task (sub-set)", "Train", "Val.", "Cal.", "Test"],
    [
      ["Detection, numbering, segmentation: radiographs", "440", "69", "62", "63"],
      ["Detection: tooth boxes", NA, "2,000", NA, "1,790"],
      ["Findings: radiographs", "476", "65", "64", "73"],
      ["Findings: Caries", "1,550", "205", "206", "228"],
      ["Findings: Deep Caries", "438", "45", "47", "48"],
      ["Findings: Impacted", "412", "72", "55", "65"],
      ["Findings: Periapical Lesion", "120", "9", "16", "13"],
    ], [2440, 650, 650, 650, 650], { center: [1, 2, 3, 4], notes: ["Sources: dataset_audit.md, eval_*.json and reports/training_summary.md. Finding counts are ground-truth finding boxes (crops); the calibration split has 324 finding crops. In training, Caries outnumber Periapical Lesion 12.9 : 1."] }),
);

// ---------------------------------------------------------------- IV. Architecture and methods (former Sections V to VII)
add(H1("IV. System Architecture and Methods"),
  H2("A. Pipeline"),
  Px("Fig. {F:arch} shows the implemented system and Fig. {F:flow} its ten steps in execution order. A FastAPI back end runs the analysis, a SQLite store keeps images, analyses, reviews and reports, and a React front end displays them. The upload is never modified; models receive the RGB image as values in [0, 1], and torchvision’s internal transform resizes it (shorter side 800 px, longer side at most 1,333 px); grayscale contrast statistics only raise image-quality flags. Each step is timed and records its status; if a model is missing or a step fails, independent later steps still run and the missing signal is reported as unavailable, never as zero. Region identifiers are derived from the image, the rounded box and the model version, so a review stays attached to the region the reviewer actually saw."),
  H2("B. Tooth Detection and Instance Segmentation"),
  P("Tooth detection uses Faster R-CNN {c:ren} with a ResNet-50 feature pyramid {c:resnet,fpn} and a single class, “tooth”; detections with score ≥ 0.3 are kept. Instance segmentation uses Mask R-CNN {c:maskrcnn} trained on the DENTEX polygon masks, so boxes are never converted into masks. Mask instances and detector boxes are linked by one-to-one greedy matching at intersection over union (IoU) ≥ 0.5, and mask quality is also summarized by the Dice coefficient:"),
  EQ([U("IoU"), rb([R("A,B")]), R("="), frac([R("|A∩B|")], [R("|A∪B|")]), R(",   "), U("Dice"), rb([R("A,B")]), R("="), frac([R("2|A∩B|")], [R("|A|+|B|")])]),
  FIGURE("flow", "fig2_workflow", "End-to-end processing workflow: the ten implemented pipeline steps in execution order, the two outputs, and (dashed) the behavior when a step is unavailable or fails."),
  PN("where {i}A{/i} and {i}B{/i} are boxes or binary masks."),
  H2("C. FDI Tooth Numbering"),
  FIGURE("num", "fig3_detection_numbering_segmentation", "(a) How detector boxes, the numbering model and the segmentation model are combined into a region record. (b) FDI two-digit tooth notation (ISO 3950) used for the 32 numbering classes, drawn as the teeth appear on a panoramic radiograph: the patient’s right is on the image left, and molars are drawn wider."),
  Px("A second Faster R-CNN predicts 32 classes, one per permanent FDI code {c:iso3950}. Because Faster R-CNN suppresses overlaps only within a class, one tooth can receive several numbers, so the raw output is resolved: boxes scoring below 0.3 are dropped, class-agnostic non-maximum suppression at IoU 0.5 is applied, and the best box per code is kept. Detector boxes are then visited in descending score order, and each takes the unused numbering box of highest IoU if that IoU is at least 0.5 (Fig. {F:num}a). A tooth without such a box stays “unassigned”; the system never guesses a number. A rule-based check flags a number for review when it is duplicated, when its confidence is below 0.5, or when the box lies on the wrong side or arch for its quadrant (on a panoramic image, image-left is patient-right)."),
  H2("D. Finding Classification"),
  Px("Each tooth box is cropped with 10 % padding, resized to 224 × 224 pixels, normalized with ImageNet statistics {c:imagenet} and classified by a ResNet-50 with a new four-way output layer (Fig. {F:cls}). The application crops detector boxes, whereas the classifier evaluation crops ground-truth boxes; Section VI-D measures the difference. Because the training data contain no healthy class, the softmax answers “which of these four findings does this crop most resemble”, not “is this tooth diseased”. Training uses inverse-frequency class weights,"),
  EQ([sub(R("w"), R("c")), R("="), frac(R("N"), [R("K"), sub(R("n"), R("c"))])]),
  PN("where {i}N{/i} = 2,520 training crops, {i}K{/i} = 4 and {i}n{/i}{sub}c{/sub} is the class count, which gives weights 0.41, 1.44, 1.53 and 5.25."),
  H2("E. Uncertainty Signals"),
  P("All signals come from a single network, not from an ensemble or a Bayesian model. For a softmax vector {b}p{/b} over {i}K{/i} = 4 classes, the normalized entropy is"),
  EQ([R("H"), rb([R("p")]), R("=−"), frac([sum([sub(R("p"), R("k")), U(" ln "), sub(R("p"), R("k"))], R("k"))], [U("ln "), R("K")])]),
  PN("Flip disagreement is the Jensen-Shannon divergence {c:linJS} between the prediction {b}p{/b} on a crop and the prediction {b}q{/b} on its horizontal flip, a two-pass form of test-time augmentation {c:wangTTA}:"),
  EQ([U("JS"), rb([R("p,q")]), R("="), frac([R("H′"), rb([frac([R("p+q")], R("2"))]), R("−"), frac([R("H′"), rb([R("p")]), R("+H′"), rb([R("q")])], R("2"))], [U("ln "), R("2")])]),
  FIGURE("cls", "fig4_classification", "Finding-classification workflow: tooth box, crop with 10 % padding, resize to 224 × 224, ImageNet normalization, ResNet-50 and a four-class softmax. Each class box gives its training-crop count and class weight from the checkpoint sidecar; the dashed note states that there is no healthy class."),
  PN("where {i}H′{/i} is the unnormalized entropy. Mask instability and detection instability are both 1 − IoU between an instance and its best match on the flipped image (flipped back), and an instance without a counterpart counts as 1:"),
  EQ([sub(R("u"), U("mask")), R("=1−"), U("IoU"), rb([R("m,"), sub(R("m̃"), U("flip"))])]),
  PN("The image-level score that orders the review queue is the weighted mean of the available signals,"),
  EQ([R("S="), frac([sum([sub(R("α"), R("j")), sub(R("s"), R("j"))], [R("j∈"), U("avail")])], [sum([sub(R("α"), R("j"))], [R("j∈"), U("avail")])])]),
  FIGURE("review", "fig5_uncertainty_review", "Uncertainty-aware review routing. Upper part: thresholds and routing deployed in the application. Lower dashed panel: methods evaluated offline only, which are not active in the application."),
  PN("with weights 0.4 (entropy), 0.4 (flip disagreement) and 0.2 (mask instability), renormalized over the signals that are available. Detection instability is displayed but excluded from {i}S{/i}."),
  H2("F. Review Routing, Human Review and Reports"),
  Px("Fig. {F:review} separates the thresholds deployed in the application from methods evaluated only offline. The entropy threshold 0.397 maximizes Youden’s index {i}J{/i} = TPR − FPR {c:youden} on calibration crops, where a “positive” is a classifier error; the flip-disagreement threshold 0.076 is the 90th percentile on calibration crops. Both were fixed once, on one seed and one dataset, and are provisional. Algorithm 1 gives the routing as implemented. A region at or above the entropy threshold is “abstained” and sent for review. Since a project decision on 2026-10-16, its top class is still shown, marked as needing human review because of high classifier uncertainty, and an abstained tooth is never reported as healthy. Scores shown to users are raw softmax values, not calibrated probabilities."),
  P("A reviewer can confirm, correct or reject a region’s class, set or clear its tooth number, or mark the image for specialist review or as unusable. Each record stores the model output the reviewer saw, a changed decision creates a new revision, and approval requires a second named person. Reviewer names are self-declared, and only approved records on unlabeled-pool or uploaded images can be exported for training. Reports are drafted from the structured findings with fixed templates in English, Hindi and Marathi. A validator rejects text that cites teeth, labels or numbers absent from the findings, and every report stays an unconfirmed research draft until a named reviewer signs it."),
  ALGO("Algorithm 1: Per-image analysis and review routing (as implemented)", [
    [0, "{b}Input:{/b} radiograph {i}I{/i} (RGB, values in [0, 1]); thresholds τ{sub}H{/sub} = 0.397, τ{sub}JS{/sub} = 0.076, τ{sub}M{/sub} = 0.30, τ{sub}D{/sub} = 0.50"],
    [0, "1: {i}D{/i} ← tooth detector({i}I{/i}), keeping boxes with score ≥ 0.3"],
    [0, "2: assign FDI codes to {i}D{/i} from the numbering model (score order, IoU ≥ 0.5); run the consistency check"],
    [0, "3: {i}M{/i} ← segmenter({i}I{/i}); match {i}M{/i} to {i}D{/i} one-to-one at IoU ≥ 0.5"],
    [0, "4: repeat detection and segmentation on the flipped image (instability signals)"],
    [0, "5: {b}for{/b} each box {i}d{/i} ∈ {i}D{/i} {b}do{/b}"],
    [1, "6: {b}p{/b} ← classifier(crop({i}d{/i})); {b}q{/b} ← classifier(flip(crop({i}d{/i})))"],
    [1, "7: compute {i}H{/i}({b}p{/b}), JS({b}p{/b}, {b}q{/b}), {i}u{/i}{sub}mask{/sub} and detection instability"],
    [1, "8: flags ← {{i}H{/i} ≥ τ{sub}H{/sub}, JS ≥ τ{sub}JS{/sub}, {i}u{/i}{sub}mask{/sub} ≥ τ{sub}M{/sub}, score < τ{sub}D{/sub}, no matched mask, number needs review, not found on flipped image}"],
    [1, "9: status ← “abstained” if {i}H{/i} ≥ τ{sub}H{/sub} (top class still shown); review ← flags ≠ ∅ or number unassigned"],
    [0, "10: {i}S{/i} ← weighted mean of the available image-level signals; store region records"],
    [0, "11: draft the report as an unconfirmed draft; place the image in the review queue ordered by {i}S{/i}"],
  ]),
  H2("G. Training Configuration"),
  Px("Table {T:config} lists the configuration recorded in each checkpoint’s sidecar file. All models are torchvision implementations. The detectors start from COCO weights {c:coco} and the classifier from ImageNet weights; both are general-domain, not dental, starting points. Training uses AdamW with weight decay 10{sup}−4{/sup}, a cosine learning-rate schedule and seed 42, and keeps the epoch with the best validation score. Horizontal flips augment the one-class detector and the segmenter but not the numbering model, because a flip would swap left and right FDI codes. Training ran on an NVIDIA RTX 3050 Laptop GPU (4 GB) with PyTorch 2.6 and CUDA 12.4."),
  TABLE("config", "Training Configuration of the Four Deployed Checkpoints",
    ["Model", "Architecture (init.)", "Epochs / batch / lr", "Selection on val."],
    [
      ["Tooth detector", "Faster R-CNN R50-FPN, 1 class (COCO)", "12 / 2 / 1e-4", "box mAP@[.5:.95]"],
      ["FDI numbering", "Faster R-CNN R50-FPN, 32 classes (COCO)", "16 / 2 / 1e-4", "box mAP@[.5:.95]"],
      ["Segmenter", "Mask R-CNN R50-FPN, 1 class (COCO)", "8 / 1 / 1e-4", "box mAP@[.5:.95]"],
      ["Finding classifier", "ResNet-50, 4 classes (ImageNet V2)", "15 / 32 / 3e-4", "macro-F1 (epoch 5)"],
    ], [1050, 1700, 1100, 1190], { center: [2], notes: ["Sources: Data/checkpoints/*.json sidecars. Classifier augmentation: horizontal flip (p = 0.5) and multiplicative contrast jitter of ±5 %. The checkpoints are legacy: image-level training membership was not recorded (Section VIII)."] }),
);

// ---------------------------------------------------------------- V. Experimental setup and metrics
add(H1("V. Experimental Setup and Evaluation Metrics"),
  Px("Fig. {F:splits} summarizes the data protocol behind all splits, and Fig. {F:eval} maps each task and study to its metrics and splits. Detection and segmentation use COCO-style average precision {c:coco}: AP50 uses an IoU match threshold of 0.5, and mAP averages AP over IoU 0.50:0.05:0.95. At the operating point (score ≥ 0.3, IoU ≥ 0.5) we also report precision {i}P{/i}, recall {i}R{/i} and F1 from true positives (TP), false positives (FP) and false negatives (FN):"),
  EQ([R("P="), frac(U("TP"), [U("TP"), R("+"), U("FP")]), R(",  R="), frac(U("TP"), [U("TP"), R("+"), U("FN")]), R(",  "), U("F1"), R("="), frac(R("2PR"), R("P+R"))]),
  PN("Macro-F1 is the unweighted mean of the per-class F1 values. Per-class sensitivity, specificity and one-vs-rest ROC AUC are reported for the test split, and mask IoU is computed on a grid subsampled by a factor of four. Numbering is scored on ground-truth teeth: {i}coverage{/i} is the fraction matched by a numbered prediction at IoU ≥ 0.5, {i}exact accuracy{/i} is the fraction of matched teeth with the correct FDI code, and {i}strict accuracy{/i} counts correct codes over all ground-truth teeth, so that missed teeth count as errors."),
  FIGURE("splits", "fig6_dataset_splits", "Dataset splitting and integrity protocol: pixel-hash grouping, seeded split into four splits, duplicate and leakage checks, and the gated test evaluation. Film counts are distinct labeled radiographs; the dashed note states what cannot be checked."),
  P("Calibration is measured by the expected calibration error over 15 equal-width confidence bins {i}B{/i}{sub}m{/sub} {c:naeini} and by the multi-class Brier score {c:brier},"),
  EQ([U("ECE"), R("="), sum([frac(R("|Bₘ|"), R("n")), R("|"), U("acc"), rb(R("Bₘ")), R("−"), U("conf"), rb(R("Bₘ")), R("|")], [R("m=1")], [R("15")])]),
  EQ([U("BS"), R("="), frac(R("1"), R("n")), sum([sum([sup(rb([sub(R("p"), R("ik")), R("−"), sub(R("y"), R("ik"))]), R("2"))], R("k"))], R("i"))]),
  PN("where {i}y{/i}{sub}ik{/sub} is the one-hot label. Temperature scaling {c:guo} divides the logits {b}z{/b} by a scalar {i}T{/i}, fitted by negative log-likelihood on the calibration split over a grid from 0.5 to 5.0 in steps of 0.05:"),
  EQ([sub(R("p"), R("k")), R("="), frac([U("exp"), rb([sub(R("z"), R("k")), R("/T")])], [sum([U("exp"), rb([sub(R("z"), R("j")), R("/T")])], R("j"))])]),
  PN("For abstention rules {c:geifman}, coverage is the fraction of crops that receive a class and risk is the error rate among them:"),
  EQ([U("cov"), R("="), frac([R("|"), U("acc."), R("|")], R("n")), R(",  "), U("risk"), R("="), frac([R("|"), U("wrong"), R("∩"), U("acc."), R("|")], [R("|"), U("acc."), R("|")])]),
  PN("How well a signal ranks errors is summarized by the AUROC (ties count one half)."),
  FIGURE("eval", "fig7_evaluation_framework", "Experimental evaluation framework: each task or study, its metrics and the splits on which it was evaluated. Classification on ground-truth crops and end-to-end evaluation on detector crops are listed separately."),
  P("Three conditions apply to every result below. Validation also selected each model’s training epoch, so validation numbers are optimistic. The internal test split was evaluated once for each of the four deployed checkpoints, on 2026-10-14, after model selection. All models were trained with one seed on one dataset, so no confidence intervals over seeds exist for the deployed models."),
);

// ---------------------------------------------------------------- VI. Results (former IX and X, plus inference cost)
add(H1("VI. Results"),
  H2("A. Tooth Detection and Segmentation"),
  Px("On the 63 test radiographs (1,790 teeth), the detector reaches AP50 0.966 and recall 0.974 at the operating point (Table {T:det}). The segmenter’s mask AP50 is 0.974, and matched instances have mean mask IoU 0.780 and mean Dice 0.873. The much lower mAP@[.5:.95] (0.515 for detection) means that boxes lie close to the annotations but are not tight, which matters once the classifier receives detector crops (Section VI-D)."),
  TABLE("det", "Tooth Detection and Instance Segmentation",
    ["Metric", "Det. val", "Det. test", "Seg. val", "Seg. test"],
    [
      ["Radiographs / GT teeth", "69 / 2,000", "63 / 1,790", "69 / 2,000", "63 / 1,790"],
      ["Box mAP@[.5:.95]", "0.560", "0.515", "0.569", "0.530"],
      ["Box AP50", "0.978", "0.966", "0.981", "0.974"],
      ["Mask AP50", NA, NA, "0.980", "0.974"],
      ["Mean mask IoU / Dice (matched)", NA, NA, "n.r.", "0.780 / 0.873"],
      ["TP / FP / FN @ 0.3", "1968/78/32", "1743/73/47", "1972/70/28", "1754/69/36"],
      ["Precision @ 0.3", "0.962", "0.960", "0.966", "0.962"],
      ["Recall @ 0.3", "0.984", "0.974", "0.986", "0.980"],
    ], [1640, 850, 850, 850, 850], { center: [1, 2, 3, 4], notes: ["Sources: eval_dentex_teeth_detection_v1_{val,test}.json and eval_dentex_teeth_segmentation_v1_{val,test}.json, rounded to three decimals. n.r. = not recorded in the validation report. Mask IoU on a 4× subsampled grid; 1,753 matched test instances."] }),
  H2("B. FDI Tooth Numbering"),
  Px("On test, 96.9 % of ground-truth teeth are matched by a numbered prediction, and 96.8 % of those receive the exact FDI code (Table {T:num}). Counting missed teeth as errors gives a strict accuracy of 93.8 %. Quadrant accuracy is 0.999, so most errors put the wrong index within the right quadrant. The higher test than validation accuracy (0.968 vs. 0.936) is within small-sample variation for 63 and 69 radiographs, and we do not interpret it."),
  TABLE("num", "FDI Tooth Numbering",
    ["Metric", "Validation", "Test"],
    [
      ["Radiographs / GT teeth", "69 / 2,000", "63 / 1,790"],
      ["Box mAP@[.5:.95] / AP50 (32 classes)", "0.524 / 0.928", "0.507 / 0.952"],
      ["Precision / recall @ 0.3 (any class)", "0.872 / 0.992", "0.882 / 0.983"],
      ["Coverage (matched / GT)", "0.979 (1,957)", "0.969 (1,734)"],
      ["Exact accuracy among matched", "0.936", "0.968"],
      ["Quadrant accuracy among matched", "0.997", "0.999"],
      ["Strict accuracy over all GT teeth", "0.916", "0.938"],
      ["Lowest per-tooth exact accuracy", "36: 0.825; 47: 0.862", "47: 0.912; 27: 0.917"],
    ], [2240, 1400, 1400], { center: [1, 2], notes: ["Source: eval_dentex_fdi_numbering_v1_{val,test}.json. Third molars (18, 28, 38, 48) have the fewest ground-truth teeth (34 to 50 per split), so their per-tooth accuracies are the least stable."] }),
  H2("C. Finding Classification on Ground-Truth Crops"),
  Px("On ground-truth test crops, the classifier reaches accuracy 0.785 and macro-F1 0.646 (Table {T:clsres}). Impacted teeth are recognized reliably (F1 0.926, AUC 0.990) and Caries reasonably well (F1 0.842), but Deep Caries (F1 0.453) and Periapical Lesion (F1 0.364, recall 0.308) are poor. The confusion matrices in Table {T:conf} locate the main error: Caries and Deep Caries are confused in both directions (30 and 22 test crops), and 9 of the 13 test Periapical Lesions are labeled as some form of caries. The macro ROC AUC of 0.910 shows that the scores rank the classes better than the argmax decisions suggest."),
  TABLE("clsres", "Finding Classification on Ground-Truth Crops",
    ["Class", "Split", "P", "R", "F1", "n", "Spec.", "AUC"],
    [
      ["Caries", "val", "0.885", "0.863", "0.874", "205", "", ""],
      ["", "test", "0.866", "0.820", "0.842", "228", "0.770", "0.895"],
      ["Deep Caries", "val", "0.500", "0.467", "0.483", "45", "", ""],
      ["", "test", "0.414", "0.500", "0.453", "48", "0.889", "0.834"],
      ["Impacted", "val", "0.919", "0.944", "0.932", "72", "", ""],
      ["", "test", "0.887", "0.969", "0.926", "65", "0.972", "0.990"],
      ["Periapical Lesion", "val", "0.467", "0.778", "0.583", "9", "", ""],
      ["", "test", "0.444", "0.308", "0.364", "13", "0.985", "0.921"],
      ["Macro / accuracy", "val", "0.693", "0.763", "0.718", "331", "acc. 0.825", ""],
      ["", "test", "0.653", "0.649", "0.646", "354", "acc. 0.785", "0.910"],
    ], [1190, 450, 520, 520, 520, 450, 750, 640], { center: [1, 2, 3, 4, 5, 6, 7], notes: ["Source: eval_dentex_findings_classification_v1_{val,test}.json (65 and 73 radiographs). Specificity and one-vs-rest AUC were computed for the test split only. Validation macro-F1 was also the epoch-selection criterion."] }),
  TABLE("conf", "Confusion Matrices of the Finding Classifier (Rows: True Class)",
    ["True \\ predicted", "Caries", "Deep C.", "Impacted", "Periap."],
    [
      ["Caries (val / test)", "177 / 187", "18 / 30", "5 / 6", "5 / 5"],
      ["Deep Caries", "20 / 22", "21 / 24", "1 / 2", "3 / 0"],
      ["Impacted", "2 / 1", "2 / 1", "68 / 63", "0 / 0"],
      ["Periapical Lesion", "1 / 6", "1 / 3", "0 / 0", "7 / 4"],
    ], [1440, 900, 900, 900, 900], { center: [1, 2, 3, 4], notes: ["Each cell gives validation / test counts of ground-truth crops. Source: same reports as Table " + T("clsres") + "."] }),
  H2("D. End-to-End Validation on Detector Crops"),
  Px("The classifier results above assume perfect boxes. A dedicated study ran the production path (detector, crop, classifier) on the 65 validation radiographs of the findings sub-set, with 331 findings, without touching calibration or test data (Table {T:e2e}). Production and evaluation preprocessing gave byte-identical pixels and identical predictions on all 331 crops, ruling out a preprocessing mismatch. On the 24 radiographs that also have a complete tooth annotation, the detector found 716 of 719 teeth at IoU 0.5 but only 582 at IoU 0.75. Detector boxes matched 323 of the 331 findings. Of the 8 unmatched findings, 4 were genuine detector misses; the other 4 were second findings on a tooth, since one detector box can match only one annotation."),
  TABLE("e2e", "End-to-End Validation (65 Radiographs, 331 Findings)",
    ["Measure", "GT boxes", "Detector boxes"],
    [
      ["Detection on 24 fully annotated films: P / R / F1 @ IoU 0.5", NA, "0.977 / 0.996 / 0.986"],
      ["Same at IoU 0.75", NA, "0.794 / 0.809 / 0.802"],
      ["Same 323 matched teeth: accuracy", "0.830", "0.811"],
      ["Same 323 teeth: macro-F1", "0.717", "0.649"],
      ["Same 323 teeth: macro recall", "0.777", "0.688"],
      ["All 331 findings (miss = wrong): accuracy", "0.825", "0.792"],
      ["All 331: macro-F1", "0.718", "0.634"],
      ["All 331: Deep Caries recall (n = 45)", "0.467", "0.333"],
      ["All 331: Periapical Lesion recall (n = 9)", "0.778", "0.444"],
      ["Unlabeled detector boxes given a finding class", NA, "1,580 of 1,903"],
    ], [2640, 900, 1500], { center: [1, 2], notes: ["Source: Data/reports/end_to_end_validation_evaluation.md/.json (2026-10-15). Validation also selected the epochs, so all numbers are optimistic."] }),
  P("Accuracy fell from 0.825 to 0.792, a net loss of 11 findings: 20 findings became wrong with detector boxes, 14 became right, and 5 correct findings were lost to non-matching. About 10 % of predictions changed even when the detector box overlapped the annotation with IoU 0.8 to 1.0, so the classifier is sensitive to small crop shifts and not only to badly placed boxes. The loss falls mostly on the rare classes. Periapical Lesion recall fell from 7/9 to 4/9, and its precision on matched teeth from 0.46 to 0.29. Eight of the 331 findings (2.4 %), including 4 of the 9 validation Periapical Lesions, sit on teeth with a second finding, and a single-label classifier cannot be right for both."),
  P("The largest practical problem lies outside these metrics. Of the 1,903 detector boxes on the 65 radiographs, 1,580 match no annotated finding, yet without a “no finding” class the application names a closest class for each of them. On the 24 fully annotated films, 584 such boxes cover real teeth without a finding label, and the classifier called them Caries 475, Periapical Lesion 71, Deep Caries 23 and Impacted 15 times. DENTEX does not certify that unlabeled teeth are healthy, so these outputs cannot be scored as false positives, but the user sees them. This is a design limitation, not a threshold problem."),
  H2("E. Attempts to Improve the Classifier"),
  Px("Table {T:improve} summarizes the controlled experiments run to improve the classifier. All used validation data, five seeds and acceptance criteria fixed in advance: a detector-box macro-F1 gain above 0.027 in at least four of five paired seeds, no loss of Deep Caries or Periapical Lesion recall, and limits on per-class losses. No variant met them, and every alternative imbalance method lowered Deep Caries recall relative to C0. Re-running the production trainer with seed 42 reproduced the deployed classifier bit for bit, while five seeds of the same recipe gave detector-box macro-F1 from 0.651 (the deployed seed) to 0.776. The deployed checkpoint is thus the weakest of five draws of its recipe; promoting the best seed would be selection on validation, so none was promoted. Crop jitter shifted the operating point toward the minority classes (Deep Caries recall +0.117) at the cost of precision instead of stabilizing predictions."),
  TABLE("improve", "Classifier-Improvement Experiments (Validation, 5 Seeds)",
    ["Study", "Variant", "Macro-F1", "Verdict"],
    [
      ["Class imbalance, GT boxes", "inverse-freq. weights, cap 5 (C0)", "0.764 ± 0.027", "baseline"],
      ["", "oversampling (best mean)", "0.774 ± 0.016", "not accepted"],
      ["", "sampler, focal loss (γ = 2), sqrt weights, minority aug., none", "0.742 to 0.766", "not accepted"],
      ["Crop jitter, det. boxes", "C0r (baseline)", "0.723 ± 0.016", "baseline"],
      ["", "jittered training boxes", "0.720 ± 0.038", "rejected"],
      ["Training recipe, det. boxes", "production recipe P", "0.722 ± 0.045", "baseline"],
      ["", "experimental recipe E", "0.724 ± 0.015", "rejected"],
      ["Kaggle re-run, det. boxes", "BASE", "0.726 ± 0.026", "baseline"],
      ["", "6 variants (best mean gain +0.004)", "0.712 to 0.730", "none accepted"],
    ], [1250, 1790, 1000, 1000], { center: [2], size: 14, notes: ["Sources: docs/audit_evidence/ml_improvement/imbalance/report.md, Data/reports/crop_robustness_experiment.md, training_recipe_comparison_results.md, checkpoints/kaggle_candidates/dc9c505b/README.md. “None” is the no-rebalancing reference (0.751 ± 0.017). GT-box and detector-box rows are not comparable."] }),
  H2("F. Inference Cost and Software Checks"),
  P("On the RTX 3050 Laptop GPU, timed over 10 panoramic images of up to 3,076 × 1,536 pixels after two warm-up runs with no failures, mean inference took 0.110 s for detection (peak GPU memory 613 MB), 0.285 s for segmentation (1,653 MB), 0.334 s for detection plus numbering and 0.252 s for detection plus classification (the numbering harness runs the detector twice). In the archived UI audit of 2026-10-14, a full analysis of one image, flipped passes included, took 1.92 s. The project’s 309 tests, which cover label mapping, split isolation, abstention rules, the final-result rule and resumed-training determinism, all passed after the last training run; they verify software behavior, not clinical performance."),
);

// ---------------------------------------------------------------- VII. Uncertainty, calibration, active learning and review
add(H1("VII. Uncertainty, Calibration and Human Review"),
  H2("A. Error Capture and Calibration"),
  Px("Thresholds and the temperature were fitted on the calibration split and then applied once to the test crops (Table {T:unc}). The entropy flag marks 54.2 % of test crops. Their error rate is 34.4 %, against 6.2 % for unflagged crops, and they contain 86.8 % of all errors (66 of 76). The flag therefore catches most errors, but it still misses 13.2 % of them and sends more than half of all regions to review. The signals do carry information about errors (AUROC 0.768 for entropy and 0.745 for flip disagreement), although the simpler 1 − max-probability score ranked test errors slightly better (0.790)."),
  TABLE("unc", "Uncertainty and Calibration of the Finding Classifier",
    ["Measure", "Calibration", "Test"],
    [
      ["Crops / accuracy", "324 / 0.830", "354 / 0.785"],
      ["ECE (15 bins) / Brier, raw scores", "0.071 / 0.277", "0.048 / 0.291"],
      ["ECE / Brier after temperature T = 0.95", "0.076 / 0.276", "0.036 / 0.291"],
      ["AUROC for errors: entropy", "0.721", "0.768"],
      ["AUROC: flip disagreement", "0.709", "0.745"],
      ["AUROC: 1 − max probability", "0.713", "0.790"],
      ["Flagged by entropy ≥ 0.397", "threshold fitted", "54.2 %"],
      ["Error rate flagged / unflagged", NA, "0.344 / 0.062"],
      ["Errors inside flagged set", NA, "0.868"],
      ["Flip-unstable (≥ 0.076): share; error rate vs. stable", "90th pct.", "9.3 %; 0.485 vs. 0.187"],
    ], [2440, 1150, 1450], { center: [1, 2], notes: ["Source: Data/reports/uncertainty_evaluation.json (2026-10-14; test-ledger entry 5). Temperature scaling is not applied in the application."] }),
  P("Temperature scaling gave a mixed result. The fitted temperature (0.95) lowered test ECE from 0.048 to 0.036 but raised calibration ECE from 0.071 to 0.076 on the very split it was fitted on, and it left the Brier score almost unchanged. Because the effect is small and inconsistent between splits, the application keeps raw scores and labels them as uncalibrated."),
  H2("B. Flip Instability of the Detector and Segmenter"),
  P("A check on 30 validation radiographs, run through the live API, asked whether flip instability flags poor masks or false detections. Mask instability ranked masks with IoU below 0.8 (51.8 % of 851 masks) only weakly, with AUROC 0.593; masks above the median signal had an error rate of 0.598 against 0.439 at or below it. Detection instability ranked the 27 false positives among 878 detections (3.1 %) with AUROC 0.644, an estimate that rests on few events. Neither is a validated error detector (source: instability_validation.json)."),
  H2("C. Abstention Rules"),
  Px("An offline experiment compared 33 abstention rules (entropy, maximum-probability and top-2-margin thresholds) on detector crops (Table {T:abst}). Rules were selected on calibration and confirmed on validation, and the test split was never read. Only “abstain if max {i}p{/i} < 0.75” passed the calibration criteria. On validation it raised coverage from 0.520 to 0.638 at almost the same risk (bootstrap 95 % CI of the risk difference −0.018 to +0.026), but it failed the minority-class criterion: Periapical Lesion precision fell from 0.50 to 0.43. The production entropy rule was therefore kept. The candidate would also have named a class for 345 instead of 250 of the 584 unlabeled tooth boxes, with unmeasurable correctness."),
  TABLE("abst", "Abstention Rules on Detector Crops",
    ["Rule / split", "Coverage", "Risk", "Macro-F1 (all)", "PL P / R"],
    [
      ["Entropy ≥ 0.397, cal.", "0.506", "0.093", "0.570", "0.80 / 0.50"],
      ["max p < 0.75, cal.", "0.623", "0.096", "0.620", "0.75 / 0.56"],
      ["Entropy ≥ 0.397, val.", "0.520", "0.119", "0.518", "0.50 / 0.43"],
      ["max p < 0.75, val.", "0.638", "0.121", "0.571", "0.43 / 0.43"],
    ], [1640, 800, 650, 950, 1000], { center: [1, 2, 3, 4], notes: ["Source: docs/audit_evidence/ml_improvement/abstention/report.md (2026-10-15). Calibration 318 and validation 323 matched findings. “All” counts abstained and missing crops as not recalled. PL = Periapical Lesion; precision is over accepted crops."] }),
  H2("D. Active Learning and Human Review in Practice"),
  P("An offline simulation measured whether ranking unlabeled pool radiographs by uncertainty saves labels {c:wangAL}. Labels already present in the training split were revealed on selection, and a ResNet-18 was retrained at each budget (160 px, 8 epochs, three seeds; pool of 476 radiographs; evaluation on the 331 validation crops). Neither entropy nor combined selection beat random selection. Paired differences against random over budgets of 120 to 300 films averaged −0.005 for entropy (better in 7 of 12 comparisons) and −0.011 for combined selection (better in 4 of 12), well within seed variation. At 300 labeled films, validation macro-F1 was 0.706 ± 0.014 (random), 0.706 ± 0.029 (entropy) and 0.720 ± 0.027 (combined). The study (source: active_learning_experiment.md) measures label efficiency, not annotator effort, and the Label Studio loop was not run against a live server."),
  Px("The review mechanism is implemented and unit-tested, but its clinical value is unmeasured. No study with qualified dental reviewers has been run, reviewer identities are not verified, and retraining with approved reviews is implemented but has never been executed. In the archived UI audit on an unlabeled DENTEX validation radiograph, the application reported 32 regions, 27 with a number and 30 with a mask, and recommended 26 of the 32 for review. With the present thresholds, much of the work moves to the reviewer, as the flag rate in Table {T:unc} predicts."),
);

// ---------------------------------------------------------------- VIII. Data integrity and reproducibility
add(H1("VIII. Data Integrity and Reproducibility"),
  P("The leakage check run on 2026-10-15 passed 17 of 18 checks and gave one warning (source: leakage_check.md). By SHA-256 of file bytes, no radiograph appears in two splits, no image used for training or epoch selection is in the test split, and neither the deduplicated unlabeled pool nor approved-review items overlap the held-out splits. Near-duplicate candidates found by perceptual hashing were all rejected by a pixel-correlation test (r ≥ 0.97). The warning concerns three unlabeled {i}validation_data{/i} images that duplicate test radiographs; they are used in no metric. The splits contain 794, 113, 113 and 113 distinct annotated radiographs (train, validation, calibration, test). These checks rule out only identical or near-identical films. DENTEX has no patient identifiers, so two radiographs of one patient could fall into different splits, and patient-level leakage cannot be excluded {c:kapoor}."),
  Px("Use of the test split is gated in code. A test evaluation needs an explicit flag, a named authorizer, a written reason and a prior validation report for the same checkpoint hash. Partial and repeated runs are refused, and every run is appended to a hash-chained ledger (Table {T:ledger}). The four deployed checkpoints were test-evaluated on 2026-10-14, before the authorization fields existed, so their entries have no authorizer. We also found two uses outside the ledger. The Kaggle re-run evaluated its BASE recipe once on the test split on 2026-10-16 (ground-truth-box macro-F1 0.693 ± 0.030 over five seeds), and a later external-data run evaluated its five BASE seeds on the same split on 2026-10-24 (0.705 ± 0.031). Neither run selected or changed a deployed model, and neither result is used elsewhere in this paper. Disclosure records were prepared for both, but the entries have not yet been appended to the ledger."),
  TABLE("ledger", "Recorded Uses of the Internal Test Split",
    ["#", "Checkpoint / run", "Task", "Date", "Films"],
    [
      ["1", "dentex_fdi_numbering_v1", "numbering", "2026-10-14", "63"],
      ["2", "dentex_findings_classification_v1", "classification", "2026-10-14", "73"],
      ["3", "dentex_teeth_detection_v1", "detection", "2026-10-14", "63"],
      ["4", "dentex_teeth_segmentation_v1", "segmentation", "2026-10-14", "63"],
      ["5", "classifier uncertainty evaluation", "calibration", "2026-10-14", "crops"],
      ["(6)", "Kaggle BASE, seeds 42 to 46", "classification", "2026-10-16", "73"],
      ["(7)", "External-data run, BASE seeds 42 to 46", "classification", "2026-10-24", "73"],
    ], [380, 2020, 980, 980, 680], { center: [0, 3, 4], size: 14, notes: ["Entries 1 to 5: Data/reports/test_set_ledger.json. Entries (6) and (7) are not in the ledger; sources: reports/p5_disclosure_entry.json and kaggle/artifacts_external_run1/ledger_disclosure_entry.json."] }),
  P("Every evaluation report records the dataset fingerprint, manifest and split hashes and software versions, and checkpoint SHA-256 values match those recorded at training. The four deployed checkpoints, however, predate image-level training manifests; their recorded image counts match the current split, which is consistent with, but does not prove, training on exactly these images. Later checkpoints carry a manifest that the model registry verifies."),
);

// ---------------------------------------------------------------- IX. Limitations and ethics
add(H1("IX. Limitations and Ethical Considerations"),
  P("All models were trained and tested on one dataset from three institutions, with one seed and a single hold-out split, so performance on other scanners, pediatric patients or unusual images is unknown. The validation and test splits are small (63 to 73 radiographs per task), and Periapical Lesion has only 9 validation and 13 test findings, so its metrics move in large steps when a single crop changes. Validation numbers are optimistic because validation chose the epochs, and since the internal test split has now been used, an unbiased estimate needs an external test set."),
  P("The classifier has no healthy class, returns one label per tooth, names a closest finding for every detected tooth, and produces uncalibrated scores. The entropy flag sends more than half of the regions to review and still misses 13 % of errors. The thresholds are provisional, and no study has measured whether review by qualified clinicians improves accuracy or safety. Reviewer identities are self-declared, and the Hindi and Marathi report wording has not been reviewed by native-speaking dental professionals."),
  P(`The deployed application applies only the routing of Fig. ${F("review")} and Algorithm 1 to raw scores. Temperature scaling, the alternative abstention rules, retraining with approved reviews and the active-learning simulation were evaluated offline and are not active. DentaMind AI does not diagnose; its reports are unconfirmed drafts that require review by a qualified professional, and we make no claim of clinical validation, autonomous diagnosis or improved patient outcomes. DENTEX images are de-identified public research data released under the CC BY-NC-SA 4.0 license {c:hamamciArxiv}, whose terms apply to any reuse. All figures are schematic diagrams, and no radiograph is reproduced.`),
);

// ---------------------------------------------------------------- X. Conclusion
add(H1("X. Conclusion"),
  P("On DENTEX, standard detectors localize and number teeth well: test AP50 is 0.966 for detection and mask AP50 0.974 for segmentation, and 96.8 % of matched teeth receive the exact FDI number. Finding classification is the weak link. Macro-F1 is 0.646 on ground-truth test crops; on validation it drops from 0.718 to 0.634 once the classifier receives detector boxes, and Deep Caries and Periapical Lesion are recognized poorly in both settings. Uncertainty flags capture most classifier errors only by routing over half of all regions to review, no improvement attempt met its pre-set criteria, and active learning did not beat random selection. These negative results mark the limits of what the system can claim and point to what is needed next: more rare-class labels, labels for teeth without findings (enabling a “no finding” class and real false-positive rates), a multi-label formulation, patient-grouped splits, an external test set evaluated once, and a reader study with qualified dentists."),
  P("After the evaluation reported here, a radiograph-grouped five-fold cross-validation of the baseline ResNet-50 classifier recipe was run on the DENTEX training and validation pool (541 radiographs, 2,851 findings, five seeds). Its out-of-fold macro-F1 was 0.677 ± 0.008 on detector boxes and 0.698 ± 0.007 on ground-truth boxes (mean ± SD over seeds). It was not used to select any model and does not change the results above."),
);

// ---------------------------------------------------------------- acknowledgment (unchanged in scope from v4; awaiting author confirmation)
add(new Paragraph({ heading: HeadingLevel.HEADING_1, children: runs("Acknowledgment") }),
  P("The authors thank their guide, Dr. Pradnya Narkhede, Department of Computer Engineering, PCCOE, for guidance and supervision. AI-generated content is disclosed following IEEE policy. The text of all sections, the figure-drawing code and the resulting diagrams (Figs. 1 to 7), and the reference search were produced with the assistance of an AI system (Claude, Anthropic), working from the project’s own source code and evaluation reports. Every reported number was reconciled against those reports, and every added reference was checked against its bibliographic record. The authors are responsible for the content of this paper."),
);

// ---------------------------------------------------------------- references
const refParas = [new Paragraph({ heading: HeadingLevel.HEADING_1, children: runs("References") })];
order.forEach((k, i) => refParas.push(new Paragraph({ alignment: AlignmentType.LEFT, spacing: { after: 30 },
  indent: { left: 400, hanging: 400 }, tabStops: [{ type: TabStopType.LEFT, position: 400 }],
  children: [new TextRun({ text: `[${i + 1}]`, font: FONT, size: 16 }), new TextRun({ children: [new Tab()], font: FONT, size: 16 }), ...runs(REFS[k].t, { size: 16 })] })));
const unused = Object.keys(REFS).filter((k) => !order.includes(k));
if (unused.length) throw new Error("uncited references: " + unused.join(", "));

// BibTeX in citation order
if (BIB) {
  const esc = (v) => v.replace(/&/g, "\\&").replace(/_/g, "\\_");
  const bib = order.map((k, i) => {
    const [type, f] = REFS[k].bib;
    const fields = Object.entries(f).map(([a, v]) => `  ${a} = {${a === "doi" || a === "eprint" ? v : esc(v)}}`).join(",\n");
    return `% [${i + 1}]\n@${type}{${k},\n${fields}\n}`;
  }).join("\n\n");
  fs.writeFileSync(BIB, "% References for DentaMind_AI_IEEE_v5.docx, in IEEE citation order.\n% Metadata re-checked against Crossref on 2026-10-26; see QC_REPORT_v5.md.\n\n" + bib + "\n");
}

// ============================================================ document
const page = { size: { width: 12240, height: 15840 }, margin: { top: 1080, bottom: 1440, left: 900, right: 900, footer: 720 } };
const footer = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16 })] })] });
const doc = new Document({
  creator: "Nilesh Sonawane, Saurabh Mali, Sadhyoj Hanwate, Sachet Lothe", title: TITLE,
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
  numbering: { config: [{ reference: "contrib", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1)", alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 576, hanging: 288 } }, run: { font: FONT, size: 20 } } }] }] },
  sections: [
    { properties: { page }, footers: { default: footer }, children: front },
    { properties: { page, type: SectionType.CONTINUOUS, column: { count: 2, space: 360, equalWidth: true } }, footers: { default: footer }, children: [...body, ...refParas] },
  ],
});

async function postprocess(buf) {
  const JSZip = require("jszip");
  const zip = await JSZip.loadAsync(buf);
  let xml = await zip.file("word/document.xml").async("string");
  xml = xml.replace(/<m:r><m:t([^>]*)>\uE000/g, '<m:r><m:rPr><m:sty m:val="p"/></m:rPr><m:t$1>');
  if (xml.includes("\uE000")) throw new Error("unprocessed upright marker");
  // OMML schema: <m:nary> needs both <m:sub> and <m:sup>, even when one is hidden; docx omits the empty <m:sup>
  xml = xml.replace(/(<m:supHide m:val="1"\/><\/m:naryPr>)(<m:sub>(?:(?!<m:e>)[\s\S])*?<\/m:sub>)<m:e>/g, "$1$2<m:sup/><m:e>");
  zip.file("word/document.xml", xml);
  return zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
}
Packer.toBuffer(doc).then(postprocess).then((buf) => {
  fs.writeFileSync(OUT, buf);
  console.log("wrote", OUT, "| refs", order.length, "| tables", tabNo, "| figures", figNo, "| equations", eqNo);
  console.log("citation order:", order.join(", "));
});

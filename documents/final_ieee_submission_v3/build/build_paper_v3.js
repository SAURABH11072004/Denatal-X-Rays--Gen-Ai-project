// Generator for the final IEEE submission of the DentaMind AI paper (2026-10-25): revised prose, 8 verified 2024+ references, Algorithm 1, schematic block-diagram figures; v3 pre-submission audit corrections (IEEE two-column, US Letter).
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
  ayhan: { t: "B. Ayhan, E. Ayan, and Y. Bayraktar, \u201cA novel deep learning-based perspective for tooth numbering and caries detection,\u201d {i}Clin. Oral Investig.{/i}, vol. 28, no. 3, Art. no. 178, Feb. 2024, doi: 10.1007/s00784-024-05566-w.",
    bib: ["article", { author: "Ayhan, Baturalp and Ayan, Enes and Bayraktar, Yusuf", title: "A novel deep learning-based perspective for tooth numbering and caries detection", journal: "Clinical Oral Investigations", volume: "28", number: "3", pages: "178", year: "2024", doi: "10.1007/s00784-024-05566-w" }] },
  peker: { t: "R. B. Peker and C. O. Kurtoglu, \u201cEvaluation of the performance of a YOLOv10-based deep learning model for tooth detection and numbering on panoramic radiographs of patients in the mixed dentition period,\u201d {i}Diagnostics{/i}, vol. 15, no. 4, Art. no. 405, Feb. 2025, doi: 10.3390/diagnostics15040405.",
    bib: ["article", { author: "Peker, Ramazan Berkay and Kurtoglu, Celal Oguz", title: "Evaluation of the Performance of a {YOLOv10}-Based Deep Learning Model for Tooth Detection and Numbering on Panoramic Radiographs of Patients in the Mixed Dentition Period", journal: "Diagnostics", volume: "15", number: "4", pages: "405", year: "2025", doi: "10.3390/diagnostics15040405" }] },
  tang: { t: "Z. Tang, T. Mameno, T. Hayami, C. Lee, S. Date, K. Ikebe, and K. Nozaki, \u201cAssessment of the impact of missing teeth on deep learning-based tooth numbering method from panoramic X-rays,\u201d {i}IEEE Access{/i}, vol. 13, pp. 50274\u201350281, 2025, doi: 10.1109/ACCESS.2025.3552203.",
    bib: ["article", { author: "Tang, Zhongbo and Mameno, Tomoaki and Hayami, Tomonori and Lee, Chonho and Date, Susumu and Ikebe, Kazunori and Nozaki, Kazunori", title: "Assessment of the Impact of Missing Teeth on Deep Learning-Based Tooth Numbering Method From Panoramic {X}-Rays", journal: "IEEE Access", volume: "13", pages: "50274--50281", year: "2025", doi: "10.1109/ACCESS.2025.3552203" }] },
  szabo: { t: "V. Szab\u00f3, K. Orhan, C. Dob\u00f3-Nagy, D. S. Veres, D. Manulis, M. Ezhov, A. Sanders, and B. T. Szab\u00f3, \u201cDeep learning-based periapical lesion detection on panoramic radiographs,\u201d {i}Diagnostics{/i}, vol. 15, no. 4, Art. no. 510, Feb. 2025, doi: 10.3390/diagnostics15040510.",
    bib: ["article", { author: "Szab{\\'o}, Viktor and Orhan, Kaan and Dob{\\'o}-Nagy, Csaba and Veres, D{\\'a}niel S{\\'a}ndor and Manulis, David and Ezhov, Matvey and Sanders, Alex and Szab{\\'o}, Bence Tam{\\'a}s", title: "Deep Learning-Based Periapical Lesion Detection on Panoramic Radiographs", journal: "Diagnostics", volume: "15", number: "4", pages: "510", year: "2025", doi: "10.3390/diagnostics15040510" }] },
  raeisi: { t: "Z. Raeisi, S. Rokhva, F. Rahmani, A. Goodarzi, and H. Najafzadeh, \u201cMulti-label diagnosis of dental conditions from panoramic x-rays using attention-enhanced deep learning,\u201d {i}Oral Maxillofac. Surg.{/i}, vol. 29, no. 1, Art. no. 166, Oct. 2025, doi: 10.1007/s10006-025-01463-y.",
    bib: ["article", { author: "Raeisi, Zahra and Rokhva, Shayan and Rahmani, Fatemeh and Goodarzi, Ali and Najafzadeh, Hossein", title: "Multi-label diagnosis of dental conditions from panoramic x-rays using attention-enhanced deep learning", journal: "Oral and Maxillofacial Surgery", volume: "29", number: "1", pages: "166", year: "2025", doi: "10.1007/s10006-025-01463-y" }] },
  yalim: { t: "A. Yal\u0131m, E. Aytugar, F. Kalabal\u0131k, and \u0130. Akda\u011f, \u201cComparative analysis of deep learning architectures for automatic tooth segmentation in panoramic dental radiographs: Balancing accuracy and computational efficiency,\u201d {i}Diagnostics{/i}, vol. 16, no. 2, Art. no. 336, Jan. 2026, doi: 10.3390/diagnostics16020336.",
    bib: ["article", { author: "Yal{\\i}m, Alperen and Aytugar, Emre and Kalabal{\\i}k, Fahrettin and Akda{\\u{g}}, {\\.I}smail", title: "Comparative Analysis of Deep Learning Architectures for Automatic Tooth Segmentation in Panoramic Dental Radiographs: Balancing Accuracy and Computational Efficiency", journal: "Diagnostics", volume: "16", number: "2", pages: "336", year: "2026", doi: "10.3390/diagnostics16020336" }] },
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
  vazhentsev: { t: "A. Vazhentsev, I. Sviridov, A. Barseghyan, G. Kuzmin, A. Panchenko, A. Nesterov, A. Shelmanov, and M. Panov, \u201cUncertainty-aware abstention in medical diagnosis based on medical texts,\u201d {i}npj Artif. Intell.{/i}, 2026, doi: 10.1038/s44387-026-00097-z.",
    bib: ["article", { author: "Vazhentsev, Artem and Sviridov, Ivan and Barseghyan, Alvard and Kuzmin, Gleb and Panchenko, Alexander and Nesterov, Aleksandr and Shelmanov, Artem and Panov, Maxim", title: "Uncertainty-aware abstention in medical diagnosis based on medical texts", journal: "npj Artificial Intelligence", year: "2026", doi: "10.1038/s44387-026-00097-z" }] },
  wangAL: { t: "H. Wang, Q. Jin, S. Li, S. Liu, M. Wang, and Z. Song, \u201cA comprehensive survey on deep active learning in medical image analysis,\u201d {i}Med. Image Anal.{/i}, vol. 95, Art. no. 103201, Jul. 2024, doi: 10.1016/j.media.2024.103201.",
    bib: ["article", { author: "Wang, Haoran and Jin, Qiuye and Li, Shiman and Liu, Siyu and Wang, Manning and Song, Zhijian", title: "A comprehensive survey on deep active learning in medical image analysis", journal: "Medical Image Analysis", volume: "95", pages: "103201", year: "2024", doi: "10.1016/j.media.2024.103201" }] },
  // ---- added 2026-10-25; metadata verified against Crossref (and PubMed where indexed)
  zhangJBHI: { t: "Y. Zhang, Y. Yu, Q. Li, H. Chen, Y. Liang, J. Chen, and J. Yin, “A reliable multi-stage system for tooth instance segmentation and numbering in panoramic radiographs,” {i}IEEE J. Biomed. Health Inform.{/i}, early access, pp. 1–13, 2025, doi: 10.1109/JBHI.2025.3643805.",
    bib: ["article", { author: "Zhang, Yani and Yu, Yuzhou and Li, Qiankun and Chen, Huabao and Liang, Yuci and Chen, Junxin and Yin, Jiayue", title: "A Reliable Multi-Stage System for Tooth Instance Segmentation and Numbering in Panoramic Radiographs", journal: "IEEE Journal of Biomedical and Health Informatics", pages: "1--13", year: "2025", note: "Early access", doi: "10.1109/JBHI.2025.3643805" }] },
  brahmi: { t: "W. Brahmi, I. Jdey, and F. Drira, “Exploring the role of convolutional neural networks (CNN) in dental radiography segmentation: A comprehensive systematic literature review,” {i}Eng. Appl. Artif. Intell.{/i}, vol. 133, Art. no. 108510, Jul. 2024, doi: 10.1016/j.engappai.2024.108510.",
    bib: ["article", { author: "Brahmi, Walid and Jdey, Imen and Drira, Fadoua", title: "Exploring the role of Convolutional Neural Networks ({CNN}) in dental radiography segmentation: A comprehensive Systematic Literature Review", journal: "Engineering Applications of Artificial Intelligence", volume: "133", pages: "108510", year: "2024", doi: "10.1016/j.engappai.2024.108510" }] },
  huangUQ: { t: "L. Huang, S. Ruan, Y. Xing, and M. Feng, “A review of uncertainty quantification in medical image analysis: Probabilistic and non-probabilistic methods,” {i}Med. Image Anal.{/i}, vol. 97, Art. no. 103223, Oct. 2024, doi: 10.1016/j.media.2024.103223.",
    bib: ["article", { author: "Huang, Ling and Ruan, Su and Xing, Yucheng and Feng, Mengling", title: "A review of uncertainty quantification in medical image analysis: Probabilistic and non-probabilistic methods", journal: "Medical Image Analysis", volume: "97", pages: "103223", year: "2024", doi: "10.1016/j.media.2024.103223" }] },
  lambertUQ: { t: "B. Lambert, F. Forbes, S. Doyle, H. Dehaene, and M. Dojat, “Trustworthy clinical AI solutions: A unified review of uncertainty quantification in deep learning models for medical image analysis,” {i}Artif. Intell. Med.{/i}, vol. 150, Art. no. 102830, Apr. 2024, doi: 10.1016/j.artmed.2024.102830.",
    bib: ["article", { author: "Lambert, Benjamin and Forbes, Florence and Doyle, Senan and Dehaene, Harmonie and Dojat, Michel", title: "Trustworthy clinical {AI} solutions: A unified review of uncertainty quantification in Deep Learning models for medical image analysis", journal: "Artificial Intelligence in Medicine", volume: "150", pages: "102830", year: "2024", doi: "10.1016/j.artmed.2024.102830" }] },
  balanya: { t: "S. A. Balanya, J. Maroñas, and D. Ramos, “Adaptive temperature scaling for robust calibration of deep neural networks,” {i}Neural Comput. Appl.{/i}, vol. 36, no. 14, pp. 8073–8095, May 2024, doi: 10.1007/s00521-024-09505-4.",
    bib: ["article", { author: "Balanya, Sergio A. and Maro{\\~n}as, Juan and Ramos, Daniel", title: "Adaptive temperature scaling for Robust calibration of deep neural networks", journal: "Neural Computing and Applications", volume: "36", number: "14", pages: "8073--8095", year: "2024", doi: "10.1007/s00521-024-09505-4" }] },
  truong: { t: "T. Truong, F. Khun Jush, and M. Lenga, “Benchmarking pretrained vision embeddings for near- and duplicate detection in medical images,” in {i}Proc. IEEE Int. Symp. Biomed. Imaging (ISBI){/i}, 2024, pp. 1–5, doi: 10.1109/ISBI56570.2024.10635550.",
    bib: ["inproceedings", { author: "Truong, Tuan and Khun Jush, Farnaz and Lenga, Matthias", title: "Benchmarking Pretrained Vision Embeddings for Near- and Duplicate Detection in Medical Images", booktitle: "2024 IEEE International Symposium on Biomedical Imaging (ISBI)", pages: "1--5", year: "2024", doi: "10.1109/ISBI56570.2024.10635550" }] },
  huangDup: { t: "Y. Huang, Z. Sun, J. Chen, T. Yang, L. Xie, and X. Lin, “Near-duplicate contamination inflates brain MRI benchmark performance: A size-matched, multi-seed MedNeXt-B study,” {i}Front. Med.{/i}, vol. 13, Art. no. 1955863, Oct. 2026, doi: 10.3389/fmed.2026.1955863.",
    bib: ["article", { author: "Huang, Yuhan and Sun, Zhipeng and Chen, Jinghui and Yang, Tao and Xie, Lianxin and Lin, Xinchen", title: "Near-duplicate contamination inflates brain {MRI} benchmark performance: a size-matched, multi-seed {MedNeXt-B} study", journal: "Frontiers in Medicine", volume: "13", pages: "1955863", year: "2026", doi: "10.3389/fmed.2026.1955863" }] },
  rajpurkar: { t: "P. Rajpurkar and E. J. Topol, “Beyond assistance: The case for role separation in AI-human radiology workflows,” {i}Radiology{/i}, vol. 316, no. 1, Art. no. e250477, Jul. 2025, doi: 10.1148/radiol.250477.",
    bib: ["article", { author: "Rajpurkar, Pranav and Topol, Eric J.", title: "Beyond Assistance: The Case for Role Separation in {AI}-Human Radiology Workflows", journal: "Radiology", volume: "316", number: "1", pages: "e250477", year: "2025", doi: "10.1148/radiol.250477" }] },
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
function FIGURE(id, file, caption) {
  const n = F(id);
  const png = fs.readFileSync(path.join(FIG, "preview_png", file + ".png"));
  const svg = fs.readFileSync(path.join(FIG, "embed_svg", file + ".svg"));
  const wpx = png.readUInt32BE(16), hpx = png.readUInt32BE(20);
  const w = Math.min(3.45, wpx / 600) * 96;
  const h = w * hpx / wpx;
  return [
    new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, spacing: { before: 120, after: 60 },
      children: [new ImageRun({ type: "svg", data: svg, transformation: { width: w, height: h }, fallback: { type: "png", data: png },
        altText: { title: `Fig. ${n}`, description: caption.replace(/\{[^}]+\}/g, ""), name: file } })] }),
    new Paragraph({ alignment: AlignmentType.LEFT, spacing: { after: 160 }, children: runs(`Fig. ${n}.  ${caption}`, { size: 16 }) }),
  ];
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

// ============================================================ CONTENT
const TITLE = "DentaMind AI: An Uncertainty-Aware Pipeline for Tooth Detection, FDI Numbering, Segmentation and Finding Classification on Panoramic Dental Radiographs";
const front = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 }, children: runs(TITLE, { size: 44 }) }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: runs("Nilesh Sonawane, Saurabh Mali, Sadhyoj Hanwate, and Sachet Lothe", { size: 22 }) }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: runs("Guide: Dr. Pradnya Narkhede", { size: 20, italics: true }) }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: runs("Department of Computer Engineering, Pimpri Chinchwad College of Engineering (PCCOE), Pune, Maharashtra, India", { size: 20, italics: true }) }),
  new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 }, children: [
    ...runs("Abstract", { size: 18, bold: true, italics: true }),
    ...runs("\u2014Reading a panoramic radiograph means locating every tooth, numbering it and checking it for findings, yet published dental AI results are often hard to trace back to the data behind them. This paper presents DentaMind AI, a research prototype built on the public DENTEX dataset that detects teeth, assigns FDI numbers, segments tooth instances and names the closest of four finding classes (Caries, Deep Caries, Impacted, Periapical Lesion) for each detected tooth, while routing uncertain regions to a human reviewer. On a held-out internal test split of 63 radiographs, the detector reached AP50 0.966, the segmenter mask AP50 0.974 (mean matched Dice 0.873), and 96.8 % of matched teeth received the correct FDI number. On ground-truth crops from 73 test radiographs, the finding classifier reached accuracy 0.785 and macro-F1 0.646, but recall for Periapical Lesion was only 0.308. Replacing ground-truth boxes with detector boxes lowered validation macro-F1 from 0.718 to 0.634. An entropy rule flagged 54.2 % of test crops, which contained 86.8 % of the classifier\u2019s errors; temperature scaling reduced test ECE from 0.048 to 0.036 but was not adopted. Four classifier-improvement attempts with acceptance criteria fixed in advance, and an uncertainty-based active-learning study, were all negative. Splits are grouped by pixel hash and every use of the test split is logged, but DENTEX has no patient identifiers, so patient-level leakage cannot be ruled out. The system has not been clinically validated and is not a diagnostic device.", { size: 18, bold: true }),
  ] }),
  new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 200 }, children: [
    ...runs("Index Terms", { size: 18, bold: true, italics: true }),
    ...runs("\u2014Dental panoramic radiography, DENTEX, tooth detection, FDI tooth numbering, instance segmentation, finding classification, uncertainty estimation, calibration, selective prediction, human review, data leakage, reproducibility.", { size: 18, bold: true }),
  ] }),
];

const body = [];
const add = (...xs) => xs.forEach((x) => (Array.isArray(x) ? body.push(...x) : body.push(x)));

// ---------------------------------------------------------------- I. Introduction
add(H1("I. Introduction"),
  P("A panoramic radiograph records both dental arches, the alveolar bone and the temporomandibular region in a single exposure, which is why it is so often the first image taken in a dental examination. The same breadth makes it demanding to read: every tooth has to be located and numbered, and each one checked for findings such as caries, impaction or periapical lesions. Deep learning now addresses each of these steps, from tooth detection, numbering and segmentation {c:putra,peker,tang,zhangJBHI,brahmi} to the detection of specific findings {c:szabo,raeisi,bittar}, and the DENTEX benchmark made it possible to study enumeration and diagnosis on the same public panoramic images {c:hamamciArxiv,hamamciMiccai}."),
  P("Two practical questions receive less attention than they deserve. The first is how the stages behave together. Classifiers are usually scored on hand-drawn tooth boxes, whereas a deployed system crops whatever the detector returns, so errors propagate from one stage to the next. The second is whether the evaluation itself can be trusted: how the data were split, whether duplicate radiographs crossed splits, and how often the test set was consulted. Leakage of this kind inflates reported performance across machine-learning research {c:kapoor}, and near-duplicate contamination has been shown to raise benchmark scores in medical imaging {c:huangDup}."),
  P("DentaMind AI was built to answer these questions on DENTEX. It chains a tooth detector, an FDI numbering model, an instance segmenter and a finding classifier, links their outputs region by region, attaches uncertainty signals to every region and sends uncertain regions to human review. We report every evaluation recorded in the project, including negative and unfavorable results, and each number in the paper can be traced to a named evaluation report. The system is a research prototype: it has not been clinically validated and does not make diagnoses."),
  P(`Fig. ${F("arch")} gives an overview of the system and Fig. ${F("flow")} its processing workflow. Figs. ${F("num")}, ${F("cls")} and ${F("review")} detail the numbering, classification and review stages, Fig. ${F("splits")} the data protocol and Fig. ${F("eval")} the evaluation framework. Section II reviews related work and Section III states the contributions. Sections IV\u2013VII describe the data, architecture, methods and training, and Section VIII defines the evaluation. Sections IX\u2013XI report the results, the error analysis and the uncertainty study, Section XII covers active learning, inference cost and software checks, and Sections XIII\u2013XV address data integrity, limitations and future work.`),
);

// ---------------------------------------------------------------- II. Related work
add(H1("II. Related Work"),
  Px("Table {T:related} summarizes the studies closest to this work. Tooth detection and numbering on panoramic radiographs have been approached with two-stage detectors and, more recently, single-stage YOLO models. Putra {i}et al.{/i} {c:putra} detect and number permanent teeth, and Peker and Kurtoglu {c:peker} apply YOLOv10 to 200 pediatric patients in the mixed dentition. Tang {i}et al.{/i} {c:tang} show that missing teeth degrade deep-learning numbering, a failure mode that also appears in our per-tooth results. Zhang {i}et al.{/i} {c:zhangJBHI} couple instance segmentation with FDI-compliant numbering in a multi-stage system that treats supernumerary and missing teeth explicitly. For segmentation, Brahmi {i}et al.{/i} {c:brahmi} review convolutional networks in dental radiography, and Yal\u0131m {i}et al.{/i} {c:yalim} relate the accuracy of U-Net variants to their computational cost. Ayhan {i}et al.{/i} {c:ayhan} combine numbering with caries detection, but on bitewing rather than panoramic radiographs."),
  P("For findings, Szab\u00f3 {i}et al.{/i} {c:szabo} evaluate a commercial system for periapical lesion detection on 616 teeth from 357 panoramic radiographs, and Raeisi {i}et al.{/i} {c:raeisi} study multi-label diagnosis of dental conditions on panoramic X-rays with attention-enhanced networks. Bittar {i}et al.{/i} {c:bittar} summarize the evidence on AI for caries detection in an umbrella review. Hamamci {i}et al.{/i} introduced the DENTEX benchmark {c:hamamciArxiv} together with a diffusion-based hierarchical detector for its enumeration-and-diagnosis task {c:hamamciMiccai}."),
  P("Reliability has a literature of its own. Recent reviews survey uncertainty quantification for medical image analysis, covering both probabilistic and non-probabilistic methods {c:huangUQ,lambertUQ}. Selective classification lets a model withhold a prediction when it is uncertain {c:geifman}, and uncertainty-aware abstention has recently been examined for medical diagnosis {c:vazhentsev}. Test-time augmentation gives an inexpensive uncertainty estimate from a single network {c:wangTTA}. Temperature scaling {c:guo} remains the standard post-hoc calibration method, adaptive variants have been proposed to make it more robust {c:balanya}, and the expected calibration error (ECE) {c:naeini} is the usual summary measure. Active learning aims to reduce labeling effort in medical imaging {c:wangAL}."),
  P("On the data side, Kapoor and Narayanan {c:kapoor} identify leakage as a common cause of irreproducible machine-learning results, Truong {i}et al.{/i} {c:truong} benchmark pretrained vision embeddings for detecting exact and near duplicates among 3-D medical images, and Huang {i}et al.{/i} {c:huangDup} measure how near-duplicate contamination inflates performance on a brain-MRI benchmark. On the human side, it has been argued that radiology workflows should assign distinct roles to AI and human readers instead of treating AI as a generic assistant {c:rajpurkar}. DentaMind AI takes a narrower, measurable position: the models draft, a person decides, and we report how often review is triggered. Throughout, we use these ideas as tools and measure how much they help on DENTEX; we do not propose new methods for them."),
  TABLE("related", "Recent Studies Related to This Work",
    ["Study", "Task and data", "Relation to this work"],
    [
      [`Putra {i}et al.{/i} ${citeText(["putra"])}`, "Permanent-tooth detection and numbering, panoramic", "Same tasks; we add end-to-end and uncertainty evaluation"],
      [`Peker, Kurtoglu ${citeText(["peker"])}`, "YOLOv10 detection and numbering, mixed dentition (200 patients)", "Numbering task; our data are adult DENTEX films"],
      [`Tang {i}et al.{/i} ${citeText(["tang"])}`, "Effect of missing teeth on numbering, panoramic", "Explains a failure mode seen in our per-tooth results"],
      [`Zhang {i}et al.{/i} ${citeText(["zhangJBHI"])}`, "Multi-stage instance segmentation and FDI numbering, panoramic", "Same task pair; we link stages by IoU and add review routing"],
      [`Brahmi {i}et al.{/i} ${citeText(["brahmi"])}`, "Systematic review (45 studies), CNN segmentation in dental imaging", "Context for CNN-based tooth segmentation"],
      [`Ayhan {i}et al.{/i} ${citeText(["ayhan"])}`, "Tooth numbering and caries detection, bitewing", "Combined numbering and finding task, different modality"],
      [`Szab\u00f3 {i}et al.{/i} ${citeText(["szabo"])}`, "Commercial system, periapical lesions, 357 panoramics", "Our weakest class is Periapical Lesion"],
      [`Raeisi {i}et al.{/i} ${citeText(["raeisi"])}`, "Multi-label dental conditions, panoramic", "Our classifier is single-label (Section X)"],
      [`Yal\u0131m {i}et al.{/i} ${citeText(["yalim"])}`, "U-Net tooth segmentation, accuracy vs. cost", "We use Mask R-CNN instances and report latency"],
      [`Bittar {i}et al.{/i} ${citeText(["bittar"])}`, "Umbrella review, AI caries detection", "Context for caries results"],
      [`Hamamci {i}et al.{/i} ${citeText(["hamamciArxiv", "hamamciMiccai"])}`, "DENTEX benchmark; hierarchical diffusion detector", "Source of our data and finding taxonomy"],
    ], [1240, 1950, 1850]),
);

// ---------------------------------------------------------------- III. Research gap and contributions
add(H1("III. Research Gap and Contributions"),
  P("The models we use\u2014Faster R-CNN {c:ren}, Mask R-CNN {c:maskrcnn} with a ResNet-50 {c:resnet} feature pyramid {c:fpn}, and a ResNet-50 classifier\u2014are standard, and we do not claim any architectural novelty. The gap we address is evidence: what a complete panoramic-radiograph pipeline achieves when every stage is measured on the same held-out data, how the stages interact, and whether common uncertainty and data-efficiency techniques actually help. Our contributions are:"),
  LI("an integrated, open pipeline that links detection, FDI numbering, segmentation and finding classification region by region through IoU matching, never by list position;"),
  LI("an end-to-end validation study that measures how detector boxes, rather than ground-truth boxes, change finding classification, with the sources of the gap broken down;"),
  LI("an evaluation of uncertainty-based review routing, calibration and abstention rules with thresholds fixed on a separate calibration split, including the rules that failed;"),
  LI("four controlled attempts to improve the finding classifier (class-imbalance methods, crop jitter, a training-recipe comparison and a cloud re-run) with acceptance criteria fixed before the results were known, plus an active-learning study; all were negative; and"),
  LI("an auditable data protocol: pixel-hash grouped splits, leakage checks, and a hash-chained test-set ledger that records every use of the test split."),
);

// ---------------------------------------------------------------- IV. Dataset
add(H1("IV. Dataset and Data Preparation"),
  H2("A. DENTEX Sub-Sets"),
  Px("We use the DENTEX panoramic radiographs {c:hamamciArxiv}, which come from three institutions and several scanners. Table {T:sources} lists the sub-sets found on disk, as measured by the project\u2019s dataset audit. The {i}quadrant{/i} sub-set labels quadrants. The {i}quadrant-enumeration{/i} sub-set labels every tooth with its quadrant and tooth index, which together give the two-digit FDI code {c:iso3950}. The {i}quadrant-enumeration-disease{/i} sub-set labels only teeth that carry one of four findings. All annotations include both boxes and polygon masks."),
  TABLE("sources", "DENTEX Sub-Sets Present in the Project (Dataset Audit, 2026-10-14)",
    ["Sub-set", "Images", "Annotations", "Use"],
    [
      ["quadrant", "693", "2,772", "not used by the current models"],
      ["quadrant-enumeration", "634", "18,095", "detection, numbering, segmentation"],
      ["quadrant-enumeration-disease", "705", "3,529", "finding classification"],
      ["unlabelled", "1,571", "\u2014", "active-learning pool"],
      ["validation_data (unlabeled)", "50", "\u2014", "inference demonstration only"],
      ["All files on disk", "3,653", "", "2,716 distinct radiographs by pixels"],
    ], [1650, 650, 900, 1840], { center: [1, 2], notes: ["Source: Data/reports/dataset_audit.md. Annotated entries total 2,005 but contain only 1,133 distinct radiographs, because the sub-sets reuse the same films under different file names. In the disease sub-set, 27 images have no annotation."] }),
  P("The sub-sets overlap heavily. The 3,653 files contain only 2,716 distinct radiographs, and the 2,005 annotated entries only 1,133. For example, 235 radiographs appear in all three annotated sub-sets, sometimes under different file names. Image counts quoted for DENTEX therefore count entries, not independent patients."),
  H2("B. Finding Taxonomy and Excluded Data"),
  P("The disease sub-set contains 2,189 Caries, 578 Deep Caries, 604 Impacted and 158 Periapical Lesion annotations. There is no \u201chealthy\u201d label: a tooth without a finding is simply not annotated. The official DENTEX test release uses a Turkish, treatment-oriented label set (for example \u201c1-\u00e7\u00fcr\u00fck\u201d and \u201c3-kanal\u201d). The project found no verified equivalence between those labels and the four English finding classes. On the one radiograph shared between the two releases, the English labels contradicted the mapping. The official test set is therefore excluded from every evaluation in this paper. The project also found that 95 of the 250 official test images are byte-identical to radiographs in DENTEX\u2019s own training sub-sets. The 50 unlabeled {i}validation_data{/i} images are used only to demonstrate inference; 20 of them duplicate labeled radiographs."),
  H2("C. Splitting Procedure"),
  Px("Each radiograph is identified by the SHA-256 hash of its pixels, so identical copies across sub-sets form one group and always share a split. Groups are assigned with seed 42 to train, validation, calibration and test splits in proportions 0.70/0.10/0.10/0.10. The split file is append-only: images that already have a split never move. Fig. {F:splits} summarizes the procedure, and Table {T:splits} gives the resulting counts per task. Each split has a fixed role. Train is used to fit weights. Validation selects the training epoch and provides the reported validation metrics. Calibration fits thresholds and the temperature. Test is reserved for final metrics."),
  TABLE("splits", "Split Statistics per Task",
    ["Task (sub-set)", "Train", "Val.", "Cal.", "Test"],
    [
      ["Detection, numbering, segmentation: radiographs", "440", "69", "62", "63"],
      ["Detection: tooth boxes", "\u2014", "2,000", "\u2014", "1,790"],
      ["Findings: radiographs", "476", "65", "64", "73"],
      ["Findings: Caries", "1,550", "205", "206", "228"],
      ["Findings: Deep Caries", "438", "45", "47", "48"],
      ["Findings: Impacted", "412", "72", "55", "65"],
      ["Findings: Periapical Lesion", "120", "9", "16", "13"],
    ], [2440, 650, 650, 650, 650], { center: [1, 2, 3, 4], notes: ["Sources: dataset_audit.md, eval_*.json and reports/training_summary.md. Finding counts are ground-truth finding boxes (crops). The training imbalance between Caries and Periapical Lesion is 12.9 : 1. Calibration finding count: 324 crops."] }),
);

// ---------------------------------------------------------------- V. System architecture
add(H1("V. System Architecture"),
  Px("Fig. {F:arch} shows the implemented system. A FastAPI back end runs the full-analysis pipeline. A SQLite store keeps images, analyses, reviews and reports, and a React front end displays them. The original upload is never modified. Models receive the RGB image as floating-point values in [0, 1] at full resolution, and torchvision\u2019s internal transform resizes it (shorter side 800 px, longer side at most 1,333 px). Grayscale contrast statistics are computed only to raise image-quality flags and never change the model input."),
  Px("Fig. {F:flow} lists the ten pipeline steps in execution order. Each step is timed and records its status. A step whose model is missing is reported as \u201cunavailable\u201d and a crashed step as \u201cfailed\u201d. Later steps that do not depend on it still run, and a missing signal is reported as unavailable rather than as zero. Regions carry a content-derived identifier (image, rounded box and model version), so a review stays attached to the region the reviewer actually saw."),
);

// ---------------------------------------------------------------- VI. Methodology
add(H1("VI. Methodology"),
  H2("A. Tooth Detection and Instance Segmentation"),
  P("Tooth detection uses Faster R-CNN {c:ren} with a ResNet-50 feature pyramid {c:resnet,fpn} and a single foreground class, \u201ctooth\u201d. Detections with score \u2265 0.3 are kept. The detector does not number teeth. Instance segmentation uses Mask R-CNN {c:maskrcnn} trained on DENTEX\u2019s polygon masks; boxes are never converted into masks. A mask instance and a detector box are linked by one-to-one greedy matching at intersection over union (IoU) \u2265 0.5:"),
  EQ([U("IoU"), rb([R("A,B")]), R("="), frac([R("|A\u2229B|")], [R("|A\u222aB|")])]),
  PN("where {i}A{/i} and {i}B{/i} are boxes or binary masks. Mask quality is also summarized by the Dice coefficient,"),
  EQ([U("Dice"), rb([R("A,B")]), R("="), frac([R("2|A\u2229B|")], [R("|A|+|B|")])]),
  FIGURE("arch", "fig1_architecture", "System architecture of DentaMind AI as implemented. The tooth detector feeds number assignment, mask matching and finding classification; per-region uncertainty signals become review flags before the final result, report drafting and human review. Bold outlines mark trained networks."),
  H2("B. FDI Tooth Numbering"),
  Px("Numbering uses a second Faster R-CNN with 32 foreground classes, one per permanent FDI code {c:iso3950}. Faster R-CNN suppresses overlapping boxes only within a class, so one tooth can come back with several numbers. The raw output is therefore resolved: boxes below score 0.3 are dropped, class-agnostic non-maximum suppression at IoU 0.5 is applied, and the best box per FDI code is kept. Detector boxes are then visited in descending score order, and each takes the unused numbering box with the highest IoU if that IoU is at least 0.5 (Fig. {F:num}a). A tooth without such a box stays \u201cunassigned\u201d: the system never guesses a number. A rule-based check then marks a number for review when it is duplicated, when its confidence is below 0.5, or when the box lies on the wrong side or arch for its quadrant. The panoramic convention used is that image-left is patient-right."),
  FIGURE("flow", "fig2_workflow", "End-to-end processing workflow: the ten implemented pipeline steps in execution order, the two outputs, and (dashed) the behavior when a step is unavailable or fails."),
  H2("C. Finding Classification"),
  Px("Each tooth box is cropped with 10 % padding, resized to 224 \u00d7 224 pixels, normalized with ImageNet statistics {c:imagenet} and classified by a ResNet-50 with a new four-way output layer (Fig. {F:cls}). The application crops detector boxes. The classifier evaluation crops ground-truth finding boxes, and Section X measures the difference. The softmax over Caries, Deep Caries, Impacted and Periapical Lesion is an answer to \u201cwhich of these four does this crop most resemble\u201d, not to \u201cis this tooth diseased\u201d, because the training data contain no healthy class. Training uses inverse-frequency class weights,"),
  EQ([sub(R("w"), R("c")), R("="), frac(R("N"), [R("K"), sub(R("n"), R("c"))])]),
  PNx("where {i}N{/i} = 2,520 training crops, {i}K{/i} = 4 and {i}n{/i}{sub}c{/sub} is the class count. This gives weights 0.41, 1.44, 1.53 and 5.25 (Fig. {F:cls})."),
  FIGURE("num", "fig3_detection_numbering_segmentation", "(a) How detector boxes, the numbering model and the segmentation model are combined into a region record. (b) FDI two-digit tooth notation (ISO 3950) used for the 32 numbering classes, drawn as the teeth appear on a panoramic radiograph: the patient\u2019s right is on the image left, and molars are drawn wider."),
  H2("D. Uncertainty Signals"),
  P("All signals come from a single network; none is an ensemble or a Bayesian estimate. For a softmax vector {b}p{/b} over {i}K{/i} = 4 classes, the normalized entropy is"),
  EQ([R("H"), rb([R("p")]), R("=\u2212"), frac([sum([sub(R("p"), R("k")), U("\u2009ln\u2009"), sub(R("p"), R("k"))], R("k"))], [U("ln\u2009"), R("K")])]),
  PN("and the flip disagreement is the Jensen\u2013Shannon divergence {c:linJS} between the prediction {b}p{/b} on a crop and the prediction {b}q{/b} on its horizontal flip, a two-pass form of test-time augmentation {c:wangTTA}:"),
  EQ([U("JS"), rb([R("p,q")]), R("="), frac([R("H\u2032"), rb([frac([R("p+q")], R("2"))]), R("\u2212"), frac([R("H\u2032"), rb([R("p")]), R("+H\u2032"), rb([R("q")])], R("2"))], [U("ln\u2009"), R("2")])]),
  PN("where {i}H\u2032{/i} is the unnormalized entropy. Mask instability and detection instability are both 1 \u2212 IoU between an instance and its best match on the horizontally flipped image (flipped back); an instance with no counterpart counts as 1:"),
  EQ([sub(R("u"), U("mask")), R("=1\u2212"), U("IoU"), rb([R("m,"), sub(R("m\u0303"), U("flip"))])]),
  PN("The image-level combined score used to order the review queue is the weighted mean of the available signals,"),
  EQ([R("S="), frac([sum([sub(R("\u03b1"), R("j")), sub(R("s"), R("j"))], [R("j\u2208"), U("avail")])], [sum([sub(R("\u03b1"), R("j"))], [R("j\u2208"), U("avail")])])]),
  PN("with weights 0.4 (entropy), 0.4 (flip disagreement) and 0.2 (mask instability); the weights are renormalized over the signals that are available. Detection instability is shown but excluded from {i}S{/i}."),
  FIGURE("cls", "fig4_classification", "Finding-classification workflow: tooth box, crop with 10 % padding, resize to 224 \u00d7 224, ImageNet normalization, ResNet-50 and a four-class softmax. Each class box gives its training-crop count and class weight from the checkpoint sidecar; the dashed note states that there is no healthy class."),
  H2("E. Review Routing and Final Result"),
  Px("Fig. {F:review} shows which thresholds are deployed. The entropy threshold 0.397 maximizes Youden\u2019s index {c:youden},"),
  EQ([R("J="), U("TPR"), R("\u2212"), U("FPR")]),
  PNx("where a \u201cpositive\u201d is a classifier error on calibration crops. The flip-disagreement threshold 0.076 is the 90th percentile on calibration crops. Both values were fixed once, on one seed and one dataset, and are provisional. A region at or above the entropy threshold gets status \u201cabstained\u201d and is sent for review. Since a project decision on 2026-10-16, its highest-scoring class is still shown, marked \u201cNeeds human review \u2014 high classifier uncertainty\u201d, and an abstained tooth is never reported as healthy. Mask instability \u2265 0.30, detection score < 0.50 and numbering problems also trigger review. Scores shown to users are raw softmax values; they are not calibrated probabilities."),
  PN("Algorithm 1 summarizes how one radiograph is analyzed and routed. It follows the production pipeline step by step."),
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
    [0, "10: {i}S{/i} ← weighted mean of the available image-level signals (7); store region records"],
    [0, "11: draft the report as an unconfirmed draft; place the image in the review queue ordered by {i}S{/i}"],
  ]),
  FIGURE("review", "fig5_uncertainty_review", "Uncertainty-aware review routing. Upper part: thresholds and routing deployed in the application. Lower dashed panel: methods evaluated offline only, which are not active in the application."),
  H2("F. Human Review and Reports"),
  P("A reviewer can confirm, correct or reject a region\u2019s class, set or clear its tooth number, or mark the image for specialist review or as unusable. Each record stores the model output the reviewer saw. A changed decision creates a new revision, and an identical resubmission is refused. Approval requires a second named person. Reviewer names are self-declared and stored as such, and nothing is labeled expert-verified. Only approved records on unlabeled-pool or uploaded images can be exported for training. Reports are drafted from structured findings with fixed templates in English, Hindi and Marathi. A validator rejects text that cites teeth, labels or numbers absent from the findings, and every report remains an unconfirmed research draft until a named reviewer signs it. The Hindi and Marathi wording has not been reviewed by a native-speaking dental professional."),
);

// ---------------------------------------------------------------- VII. Models and training
add(H1("VII. Model Architectures and Training Configuration"),
  Px("Table {T:config} lists the training configuration recorded in each checkpoint\u2019s sidecar file. All models are torchvision implementations. Detectors start from COCO weights {c:coco} and the classifier from ImageNet weights {c:imagenet}; these are general-domain, not dental, starting points. All models use AdamW with weight decay 10{sup}\u22124{/sup}, a cosine learning-rate schedule and seed 42, and each keeps the epoch that scores best on validation. Horizontal flipping is used for the one-class detector and segmenter but not for the numbering model, because a flip would swap left and right FDI codes. Training ran on an NVIDIA RTX 3050 Laptop GPU (4 GB) with PyTorch 2.6 and CUDA 12.4."),
  TABLE("config", "Training Configuration of the Four Deployed Checkpoints",
    ["Model", "Architecture (init.)", "Epochs / batch / lr", "Selection on val."],
    [
      ["Tooth detector", "Faster R-CNN R50-FPN, 1 class (COCO)", "12 / 2 / 1e-4", "box mAP@[.5:.95]"],
      ["FDI numbering", "Faster R-CNN R50-FPN, 32 classes (COCO)", "16 / 2 / 1e-4", "box mAP@[.5:.95]"],
      ["Segmenter", "Mask R-CNN R50-FPN, 1 class (COCO)", "8 / 1 / 1e-4", "box mAP@[.5:.95]"],
      ["Finding classifier", "ResNet-50, 4 classes (ImageNet V2)", "15 / 32 / 3e-4", "macro-F1 (epoch 5)"],
    ], [1050, 1700, 1100, 1190], { center: [2], notes: ["Sources: Data/checkpoints/*.json sidecars. Classifier augmentation: horizontal flip p = 0.5 and multiplicative contrast jitter of \u00b15 %. The detector, numbering and segmentation models used 440 training and 69 validation radiographs. The checkpoints are legacy: image-level training membership was not recorded (Section XIII)."] }),
);

// ---------------------------------------------------------------- VIII. Experimental setup and metrics
add(H1("VIII. Experimental Setup and Evaluation Metrics"),
  Px("Fig. {F:eval} maps each task and study to its metrics and splits. Detection and segmentation use COCO-style average precision (AP). For one class, AP is the area under the precision envelope with all-point interpolation,"),
  EQ([U("AP"), R("="), sum([rb([sub(R("r"), R("k")), R("\u2212"), sub(R("r"), R("k\u22121"))]), U("\u2009max"), sub(R("p"), R("r\u2265r\u2096"))], R("k"))]),
  PN("where {i}r{/i}{sub}k{/sub} are recall levels and {i}p{/i} precision. AP50 uses an IoU match threshold of 0.5, and mAP averages AP over IoU 0.50:0.05:0.95. Precision {i}P{/i} and recall {i}R{/i} are also reported at the operating point (score \u2265 0.3, IoU \u2265 0.5) from true positives (TP), false positives (FP) and false negatives (FN):"),
  EQ([R("P="), frac(U("TP"), [U("TP"), R("+"), U("FP")]), R(",  R="), frac(U("TP"), [U("TP"), R("+"), U("FN")]), R(",  "), U("F1"), R("="), frac(R("2PR"), R("P+R"))]),
  PN("For classification, macro-F1 (F1{sub}macro{/sub}) is the unweighted mean of the per-class F1 values,"),
  EQ([sub(U("F1"), U("macro")), R("="), frac(R("1"), R("K")), sum([sub(U("F1"), R("k"))], [R("k=1")], [R("K")])]),
  PN("Per-class sensitivity, specificity and one-vs-rest ROC AUC are reported for the test split. Mask IoU is computed on a grid subsampled by a factor of four. Numbering is scored on ground-truth teeth: {i}coverage{/i} is the fraction matched by a numbered prediction at IoU \u2265 0.5, {i}exact accuracy{/i} is the fraction of matched teeth with the correct FDI code, and {i}strict accuracy{/i} counts correct codes over all ground-truth teeth, so that missed teeth count as errors."),
  P("Calibration uses the expected calibration error with 15 equal-width confidence bins {i}B{/i}{sub}m{/sub} {c:naeini},"),
  EQ([U("ECE"), R("="), sum([frac(R("|B\u2098|"), R("n")), R("|"), U("acc"), rb(R("B\u2098")), R("\u2212"), U("conf"), rb(R("B\u2098")), R("|")], [R("m=1")], [R("15")])]),
  PN("and the multi-class Brier score {c:brier},"),
  EQ([U("BS"), R("="), frac(R("1"), R("n")), sum([sum([sup(rb([sub(R("p"), R("ik")), R("\u2212"), sub(R("y"), R("ik"))]), R("2"))], R("k"))], R("i"))]),
  PN("where {i}y{/i}{sub}ik{/sub} is the one-hot label. Temperature scaling {c:guo} divides the logits {b}z{/b} by a scalar {i}T{/i} fitted by negative log-likelihood on the calibration split (grid 0.5\u20135.0, step 0.05):"),
  EQ([sub(R("p"), R("k")), R("="), frac([U("exp"), rb([sub(R("z"), R("k")), R("/T")])], [sum([U("exp"), rb([sub(R("z"), R("j")), R("/T")])], R("j"))])]),
  PN("For abstention rules {c:geifman}, coverage is the fraction of crops that receive a class and risk is the error rate among them:"),
  EQ([U("cov"), R("="), frac([R("|"), U("acc."), R("|")], R("n")), R(",  "), U("risk"), R("="), frac([R("|"), U("wrong"), R("\u2229"), U("acc."), R("|")], [R("|"), U("acc."), R("|")])]),
  PN("The ability of a signal to rank errors is summarized by the AUROC: the probability that a randomly chosen misclassified crop scores higher than a correctly classified one, with ties counted as one half."),
  P(`The data protocol behind all splits is summarized in Fig. ${F("splits")}; the roles of the splits are those of Section IV-C.`),
  FIGURE("splits", "fig6_dataset_splits", "Dataset splitting and integrity protocol: pixel-hash grouping, seeded split into four splits, duplicate and leakage checks, and the gated test evaluation. Film counts are distinct labeled radiographs; the dashed note states what cannot be checked."),
  P("Three conditions apply to every result below. First, validation also selected each model\u2019s training epoch, so validation numbers are optimistic. Second, the internal test split was evaluated once for each of the four checkpoints on 2026-10-14, after model selection. Third, all models were trained with one seed on one dataset, so no confidence intervals over seeds exist for the deployed models."),
);

// ---------------------------------------------------------------- IX. Quantitative results
add(H1("IX. Quantitative Results"),
  H2("A. Tooth Detection and Segmentation"),
  Px("Table {T:det} reports detection and segmentation. On the 63 test radiographs (1,790 teeth), the detector reaches AP50 0.966 and recall 0.974 at the operating point. The segmenter\u2019s mask AP50 is 0.974, and matched instances have mean mask IoU 0.780 and mean Dice 0.873. The much lower mAP@[.5:.95] (0.515 for detection) shows that boxes are close to the annotation but not tight, which Section X confirms."),
  FIGURE("eval", "fig7_evaluation_framework", "Experimental evaluation framework: each task or study, its metrics and the splits on which it was evaluated. Classification on ground-truth crops and end-to-end evaluation on detector crops are listed separately."),
  TABLE("det", "Tooth Detection and Instance Segmentation",
    ["Metric", "Det. val", "Det. test", "Seg. val", "Seg. test"],
    [
      ["Radiographs / GT teeth", "69 / 2,000", "63 / 1,790", "69 / 2,000", "63 / 1,790"],
      ["Box mAP@[.5:.95]", "0.560", "0.515", "0.569", "0.530"],
      ["Box AP50", "0.978", "0.966", "0.981", "0.974"],
      ["Mask AP50", "\u2014", "\u2014", "0.980", "0.974"],
      ["Mean mask IoU / Dice (matched)", "\u2014", "\u2014", "n.r.", "0.780 / 0.873"],
      ["TP / FP / FN @ 0.3", "1968/78/32", "1743/73/47", "1972/70/28", "1754/69/36"],
      ["Precision @ 0.3", "0.962", "0.960", "0.966", "0.962"],
      ["Recall @ 0.3", "0.984", "0.974", "0.986", "0.980"],
    ], [1640, 850, 850, 850, 850], { center: [1, 2, 3, 4], notes: ["Sources: eval_dentex_teeth_detection_v1_{val,test}.json and eval_dentex_teeth_segmentation_v1_{val,test}.json, rounded to three decimals. n.r. = not recorded in the validation report. Mask IoU is computed on a 4\u00d7 subsampled grid; 1,753 matched test instances."] }),
  H2("B. FDI Tooth Numbering"),
  Px("Table {T:num} reports numbering. On test, 96.9 % of ground-truth teeth are matched by a numbered prediction, and 96.8 % of those receive the exact FDI code. Counting missed teeth as errors gives a strict accuracy of 93.8 %. Quadrant accuracy is almost perfect (0.999), so most errors put the wrong index within the correct quadrant. The test result is higher than the validation result (exact accuracy 0.968 vs. 0.936). With 63 and 69 radiographs this difference is within the range expected from small samples, and we do not interpret it."),
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
    ], [2240, 1400, 1400], { center: [1, 2], notes: ["Source: eval_dentex_fdi_numbering_v1_{val,test}.json. Third molars (18, 28, 38, 48) have the fewest ground-truth teeth (34\u201350 per split), so their per-tooth accuracies are the least stable."] }),
  H2("C. Finding Classification"),
  Px("Table {T:clsres} reports the classifier on ground-truth finding crops. Test accuracy is 0.785 and macro-F1 0.646. Impacted teeth are recognized reliably (F1 0.926, AUC 0.990), and Caries reasonably well (F1 0.842). Deep Caries (F1 0.453) and Periapical Lesion (F1 0.364, recall 0.308) are poor. The confusion matrices in Table {T:conf} show the main error: Caries and Deep Caries are confused in both directions (30 and 22 test crops), and 9 of the 13 test Periapical Lesions are labeled as some form of caries. Macro ROC AUC is 0.910, so the scores rank classes better than the argmax decisions suggest."),
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
    ], [1190, 450, 520, 520, 520, 450, 750, 640], { center: [1, 2, 3, 4, 5, 6, 7], notes: ["Source: eval_dentex_findings_classification_v1_{val,test}.json (65 and 73 radiographs). Specificity and AUC (one-vs-rest) were computed for the test split only. The validation macro-F1 was also the epoch-selection criterion."] }),
  TABLE("conf", "Confusion Matrices of the Finding Classifier (Rows: True Class)",
    ["True \\ predicted", "Caries", "Deep C.", "Impacted", "Periap."],
    [
      ["Caries (val / test)", "177 / 187", "18 / 30", "5 / 6", "5 / 5"],
      ["Deep Caries", "20 / 22", "21 / 24", "1 / 2", "3 / 0"],
      ["Impacted", "2 / 1", "2 / 1", "68 / 63", "0 / 0"],
      ["Periapical Lesion", "1 / 6", "1 / 3", "0 / 0", "7 / 4"],
    ], [1440, 900, 900, 900, 900], { center: [1, 2, 3, 4], notes: ["Each cell gives validation / test counts of ground-truth crops. Source: same reports as Table " + T("clsres") + "."] }),
);

// ---------------------------------------------------------------- X. Detailed results and error analysis
add(H1("X. Detailed Results and Error Analysis"),
  H2("A. End-to-End Validation: Detector Boxes Instead of Ground Truth"),
  Px("The classifier numbers above assume perfect boxes. A dedicated study ran the production path\u2014detector, then crop, then classifier\u2014on the 65 validation radiographs of the findings sub-set (331 findings) without touching calibration or test data (Table {T:e2e}). It first confirmed that production and evaluation pre-processing give byte-identical pixels and identical predictions on all 331 crops, which rules out a train/inference pre-processing mismatch."),
  P("Detection precision could be scored only on the 24 radiographs that also have a complete tooth annotation. On those, the detector found 716 of 719 teeth at IoU 0.5, but only 582 at IoU 0.75. On the 65 finding radiographs, detector boxes matched 323 of the 331 findings. Of the 8 unmatched findings, 4 were genuine detector misses. The other 4 were teeth carrying two findings, where one detector box can match only one annotation."),
  TABLE("e2e", "End-to-End Validation (65 Radiographs, 331 Findings)",
    ["Measure", "GT boxes", "Detector boxes"],
    [
      ["Detection on 24 fully annotated films: P / R / F1 @ IoU 0.5", "\u2014", "0.977 / 0.996 / 0.986"],
      ["Same at IoU 0.75", "\u2014", "0.794 / 0.809 / 0.802"],
      ["Same 323 matched teeth: accuracy", "0.830", "0.811"],
      ["Same 323 teeth: macro-F1", "0.717", "0.649"],
      ["Same 323 teeth: macro recall", "0.777", "0.688"],
      ["All 331 findings (miss = wrong): accuracy", "0.825", "0.792"],
      ["All 331: macro-F1", "0.718", "0.634"],
      ["All 331: Deep Caries recall (n = 45)", "0.467", "0.333"],
      ["All 331: Periapical Lesion recall (n = 9)", "0.778", "0.444"],
      ["Unlabeled detector boxes given a finding class", "\u2014", "1,580 of 1,903"],
    ], [2640, 900, 1500], { center: [1, 2], notes: ["Source: Data/reports/end_to_end_validation_evaluation.md/.json (2026-10-15). Validation also selected the epochs, so all numbers are optimistic."] }),
  P("The accuracy loss from 0.825 to 0.792 (11 findings) breaks down into 20 findings that became wrong with detector boxes, 14 that became right, and 5 correct findings lost to non-matching. Predictions changed for about 10 % of teeth even when the detector box overlapped the annotation with IoU 0.8\u20131.0. The classifier is therefore sensitive to small crop shifts, not only to badly placed boxes. The loss is concentrated in the two rare classes: Periapical Lesion recall fell from 7/9 to 4/9 and its precision on matched teeth from 0.46 to 0.29. Eight of the 331 findings (2.4 %) sit on teeth with a second finding, including 4 of the 9 validation Periapical Lesions, and a single-label classifier cannot be right for both."),
  P("The largest practical limitation is outside these metrics. Of 1,903 detector boxes on the 65 radiographs, 1,580 match no annotated finding. Because the classifier has no \u201cno finding\u201d class, the application shows a closest finding class for each of them. On the 24 fully annotated films, 584 such boxes cover real teeth without a finding label, and the classifier called them Caries 475, Periapical Lesion 71, Deep Caries 23 and Impacted 15 times. DENTEX does not certify that unlabeled teeth are healthy, so these outputs cannot be scored as false positives, but the user sees them. This is a design limitation, not a threshold problem."),
  H2("B. Attempts to Improve the Classifier (Ablations)"),
  Px("Table {T:improve} summarizes the controlled experiments run to improve the finding classifier. All were evaluated on validation only, with acceptance criteria fixed before the results were known. The criteria were a detector-box macro-F1 gain larger than 0.027 in at least four of five paired seeds, no loss of Deep Caries or Periapical Lesion recall, and limits on per-class losses. None of the experiments met them."),
  TABLE("improve", "Classifier-Improvement Experiments (Validation, 5 Seeds)",
    ["Study", "Variant", "Macro-F1", "Verdict"],
    [
      ["Class imbalance, GT boxes", "inverse-freq. weights, cap 5 (C0)", "0.764 ± 0.027", "baseline"],
      ["", "weighted sampler", "0.766 ± 0.009", "not accepted"],
      ["", "oversampling", "0.774 ± 0.016", "not accepted"],
      ["", "focal loss (γ = 2)", "0.750 ± 0.022", "not accepted"],
      ["", "square-root weights", "0.742 ± 0.024", "not accepted"],
      ["", "no rebalancing", "0.751 ± 0.017", "reference"],
      ["", "minority geometric aug.", "0.751 ± 0.020", "not accepted"],
      ["Crop jitter, det. boxes", "C0r (baseline)", "0.723 ± 0.016", "baseline"],
      ["", "jittered training boxes", "0.720 ± 0.038", "rejected"],
      ["Training recipe, det. boxes", "production recipe P", "0.722 ± 0.045", "baseline"],
      ["", "experimental recipe E", "0.724 ± 0.015", "rejected"],
      ["Kaggle re-run, det. boxes", "BASE", "0.726 ± 0.026", "baseline"],
      ["", "6 variants (best mean gain +0.004)", "0.712–0.730", "none accepted"],
    ], [1250, 1790, 1000, 1000], { center: [2], size: 14, notes: ["Sources: docs/audit_evidence/ml_improvement/imbalance/report.md, Data/reports/crop_robustness_experiment.md, training_recipe_comparison_results.md, checkpoints/kaggle_candidates/dc9c505b/README.md. GT-box and detector-box rows are not comparable with each other. Every alternative imbalance method lowered Deep Caries recall relative to C0."] }),
  P("Two findings from these studies matter for interpreting Table " + T("clsres") + ". First, re-running the production trainer with seed 42 reproduced the deployed classifier bit for bit. Five seeds of the same recipe gave detector-box macro-F1 between 0.651 (the deployed seed) and 0.776. The deployed checkpoint is therefore the weakest of five draws of its recipe, not evidence that the recipe is worse. Choosing the best seed by validation score would, however, be selection on validation, so no replacement was promoted. Second, crop jitter shifted the operating point toward the minority classes (Deep Caries recall +0.117) at the cost of precision, instead of making predictions more stable."),
);

// ---------------------------------------------------------------- XI. Uncertainty, calibration and human review
add(H1("XI. Uncertainty Estimation, Calibration and Human Review"),
  H2("A. Error Capture and Calibration"),
  Px("Table {T:unc} reports the classifier\u2019s uncertainty on ground-truth crops, with thresholds and the temperature fitted on the calibration split and then applied once to the test split. On test, the entropy flag marks 54.2 % of crops. Their error rate is 34.4 %, against 6.2 % for unflagged crops, and they contain 86.8 % of all errors (66 of 76). The flag therefore catches most errors, but it misses 13.2 % of them and sends more than half of all regions to review. The signals carry real information about errors (AUROC 0.768 for entropy and 0.745 for flip disagreement). On test, the simpler 1 \u2212 max-probability score ranked errors slightly better (0.790)."),
  TABLE("unc", "Uncertainty and Calibration of the Finding Classifier",
    ["Measure", "Calibration", "Test"],
    [
      ["Crops / accuracy", "324 / 0.830", "354 / 0.785"],
      ["ECE (15 bins) / Brier, raw scores", "0.071 / 0.277", "0.048 / 0.291"],
      ["ECE / Brier after temperature T = 0.95", "0.076 / 0.276", "0.036 / 0.291"],
      ["AUROC for errors: entropy", "0.721", "0.768"],
      ["AUROC: flip disagreement", "0.709", "0.745"],
      ["AUROC: 1 \u2212 max probability", "0.713", "0.790"],
      ["Flagged by entropy \u2265 0.397", "threshold fitted", "54.2 %"],
      ["Error rate flagged / unflagged", "\u2014", "0.344 / 0.062"],
      ["Errors inside flagged set", "\u2014", "0.868"],
      ["Flip-unstable (\u2265 0.076): share; error rate vs. stable", "90th pct.", "9.3 %; 0.485 vs. 0.187"],
    ], [2440, 1150, 1450], { center: [1, 2], notes: ["Source: Data/reports/uncertainty_evaluation.json (2026-10-14; test-ledger entry 5). Temperature scaling is not applied in the application."] }),
  P("Temperature scaling gives a mixed result. The fitted temperature (0.95) is close to 1. It lowered test ECE from 0.048 to 0.036 but raised calibration ECE from 0.071 to 0.076, on the very split it was fitted on, and left the Brier score almost unchanged. Because the effect is small and inconsistent between splits, the application keeps raw scores and labels them as uncalibrated."),
  H2("B. Flip-Instability Signals of the Detector and Segmenter"),
  Px("A separate check on 30 validation radiographs, run through the live API with the real models, tested whether flip instability flags poor masks or false detections (Table {T:inst}). Mask instability ranked masks with IoU below 0.8 only weakly (AUROC 0.593), and detection instability ranked false positives with AUROC 0.644. With only 27 false positives among 878 detections, this second estimate rests on few events. Neither signal should be presented as a validated error detector."),
  TABLE("inst", "Flip-Instability Validation (30 Validation Radiographs)",
    ["Signal", "Regions", "Target event", "AUROC"],
    [
      ["Mask instability", "851", "mask IoU vs. GT < 0.8 (51.8 %)", "0.593"],
      ["Detection instability", "878", "false-positive box (27; 3.1 %)", "0.644"],
    ], [1340, 700, 2300, 700], { center: [1, 3], notes: ["Source: Data/reports/instability_validation.json (2026-10-14). Error rate above vs. at or below the median mask signal: 0.598 vs. 0.439."] }),
  H2("C. Abstention Rules"),
  Px("An offline experiment compared 33 abstention rules\u2014entropy, maximum-probability and top-2-margin thresholds\u2014on detector crops (Table {T:abst}). Rules were selected on calibration and confirmed on validation, and the test split was never read. Only \u201cabstain if max {i}p{/i} < 0.75\u201d passed the calibration criteria. It raised validation coverage from 0.520 to 0.638 at almost the same risk (bootstrap 95 % CI of the risk difference \u22120.018 to +0.026). It failed the minority-class criterion, however: Periapical Lesion precision fell from 0.50 to 0.43. The production entropy rule was therefore kept. The candidate would also have named a class for 345 instead of 250 of the 584 unlabeled tooth boxes, whose correctness cannot be measured."),
  TABLE("abst", "Abstention Rules on Detector Crops",
    ["Rule / split", "Coverage", "Risk", "Macro-F1 (all)", "PL P / R"],
    [
      ["Entropy \u2265 0.397, cal.", "0.506", "0.093", "0.570", "0.80 / 0.50"],
      ["max p < 0.75, cal.", "0.623", "0.096", "0.620", "0.75 / 0.56"],
      ["Entropy \u2265 0.397, val.", "0.520", "0.119", "0.518", "0.50 / 0.43"],
      ["max p < 0.75, val.", "0.638", "0.121", "0.571", "0.43 / 0.43"],
    ], [1640, 800, 650, 950, 1000], { center: [1, 2, 3, 4], notes: ["Source: docs/audit_evidence/ml_improvement/abstention/report.md (2026-10-15). Calibration 318 and validation 323 matched findings. \u201cAll\u201d counts abstained and missing crops as not recalled. PL = Periapical Lesion; precision is over accepted crops."] }),
  H2("D. Human Review in Practice"),
  Px("The review mechanism is implemented and unit-tested, but its clinical value is unmeasured. No study with qualified dental reviewers has been run, reviewer identities are not verified, and retraining with approved reviews is implemented but has never been executed. In the archived UI audit (2026-10-14) on an unlabeled DENTEX validation radiograph, the application reported 32 regions, 27 with a number and 30 with a mask, and recommended 26 of the 32 for review. The review rate matches the high flag rate of Table {T:unc}: with the present thresholds, a large share of the work moves to the reviewer."),
);

// ---------------------------------------------------------------- XII. End-to-end implementation
add(H1("XII. Active Learning, Inference Cost and Software Verification"),
  H2("A. Active Learning"),
  Px("The application can rank unlabeled pool radiographs by uncertainty for annotation. A simulated study measured whether this saves labels (Table {T:al}). Labels already present in the training split were revealed on selection, and a ResNet-18 was retrained at each budget (160 px, 8 epochs, three seeds). Entropy and combined selection did not beat random selection. Paired differences against random over budgets 120\u2013300 averaged \u22120.005 (entropy, better in 7 of 12) and \u22120.011 (combined, better in 4 of 12), well within seed variation {c:wangAL}. The study measures label efficiency, not annotator effort, and the Label Studio loop was not exercised against a live server."),
  TABLE("al", "Active Learning: Validation Macro-F1 (Mean \u00b1 SD, 3 Seeds)",
    ["Labeled films", "Random", "Entropy", "Combined"],
    [
      ["60", "0.553 \u00b1 0.053", "0.553 \u00b1 0.053", "0.553 \u00b1 0.053"],
      ["120", "0.626 \u00b1 0.014", "0.639 \u00b1 0.011", "0.618 \u00b1 0.013"],
      ["180", "0.680 \u00b1 0.019", "0.665 \u00b1 0.035", "0.640 \u00b1 0.013"],
      ["240", "0.712 \u00b1 0.029", "0.695 \u00b1 0.010", "0.702 \u00b1 0.026"],
      ["300", "0.706 \u00b1 0.014", "0.706 \u00b1 0.029", "0.720 \u00b1 0.027"],
    ], [1080, 1320, 1320, 1320], { center: [0, 1, 2, 3], notes: ["Source: Data/reports/active_learning_experiment.md/.json (pool 476 radiographs; evaluation 331 validation crops). Paired differences: docs/UNCERTAINTY_AND_ACTIVE_LEARNING.md."] }),
  H2("B. Inference Cost"),
  Px("Table {T:bench} gives inference times on the RTX 3050 Laptop GPU for 10 panoramic images of up to 3,076 \u00d7 1,536 pixels, after two warm-up runs. Detection takes about 0.1 s per image and segmentation about 0.3 s, with peak GPU memory up to 1.65 GB. The detection-plus-numbering harness runs the detector twice, so it overstates the application\u2019s cost. In the same UI audit, the application reported 1.92 s for the full analysis of one image, including the flipped passes."),
  TABLE("bench", "Inference Benchmark (RTX 3050 Laptop GPU, 10 Images)",
    ["Stage", "Mean s", "Median s", "p95 s", "Img/s", "Peak MB"],
    [
      ["Detection", "0.110", "0.099", "0.153", "9.08", "613"],
      ["Segmentation", "0.285", "0.298", "0.339", "3.51", "1,653"],
      ["Detection + numbering", "0.334", "0.332", "0.367", "2.99", "985"],
      ["Detection + classification", "0.252", "0.246", "0.291", "3.96", "1,039"],
    ], [1500, 660, 760, 660, 660, 800], { center: [1, 2, 3, 4, 5], notes: ["Source: Data/reports/benchmark_inference.json (2026-10-14), 0 failures. The report lists 11 distinct image sizes because they were collected over all 12 loaded files, including the two byte-identical warm-up copies (2872 \u00d7 1504 px) excluded from timing; the 10 timed images have 10 distinct sizes."] }),
  H2("C. Software Verification"),
  P("The project test suite reported 309 passing tests and no failures after the last training run (reports/training_summary.md). The tests cover label mapping, split isolation, abstention rules, the final-result rule and resumed-training determinism. These tests verify software behavior, not clinical performance."),
);

// ---------------------------------------------------------------- XIII. Data integrity and reproducibility
add(H1("XIII. Data Integrity and Reproducibility"),
  Px("Table {T:leak} summarizes the leakage check of 2026-10-15: 17 of 18 checks passed and one gave a warning. No radiograph, identified by file-byte hash, appears in two splits. No image used for training or epoch selection of any model is in the test split. Near-duplicate candidates found by perceptual hashing were all rejected by a pixel-correlation test (r \u2265 0.97); embedding-based detection {c:truong} is an alternative that we have not applied. The warning concerns three unlabeled {i}validation_data{/i} images that duplicate test radiographs; they are not used in any metric. These checks prove only the absence of identical or near-identical films across splits. DENTEX has no patient identifiers, so two different radiographs of the same patient could fall into different splits. Patient-level leakage therefore cannot be excluded {c:kapoor}."),
  TABLE("leak", "Leakage Checks (Held-Out Test Split)",
    ["Check (unit: SHA-256 of file bytes)", "Overlap", "Result"],
    [
      ["All six split pairs (train/val/cal/test)", "0", "pass"],
      ["Per task: training images vs. all test films (4 tasks)", "0", "pass"],
      ["Per task: epoch-selection images vs. all test films", "0", "pass"],
      ["Unlabeled pool (after duplicate exclusion) vs. test", "0", "pass"],
      ["Approved-review training items vs. val/cal/test", "0", "pass"],
      ["Near duplicates across splits (r \u2265 0.97)", "0", "pass"],
      ["validation_data (unlabeled) vs. test", "3", "warning"],
    ], [3240, 800, 1000], { center: [1, 2], notes: ["Source: Data/reports/leakage_check.md. Distinct annotated radiographs: train 794, validation 113, calibration 113, test 113."] }),
  Px("Use of the test split is gated in code. A test evaluation needs an explicit flag, a named authorizer, a written reason and a prior validation report for the same checkpoint hash. Partial test runs and repeated test runs for the same purpose are refused, and every run is appended to a hash-chained ledger. Table {T:ledger} lists all recorded uses. The four deployed checkpoints were test-evaluated on 2026-10-14, before the authorization fields existed, so their entries have no authorizer. We also found two uses outside the ledger. The Kaggle re-run evaluated its BASE recipe once on the test split on 2026-10-16 (ground-truth-box macro-F1 0.693 \u00b1 0.030 over five seeds), and a later external-data run evaluated its five BASE seeds on the same split on 2026-10-24 (0.705 \u00b1 0.031). Neither run selected or changed a deployed model, and neither result is used elsewhere in this paper. Disclosure records were prepared for both, but the entries have not yet been appended to the ledger."),
  TABLE("ledger", "Recorded Uses of the Internal Test Split",
    ["#", "Checkpoint / run", "Task", "Date", "Films"],
    [
      ["1", "dentex_fdi_numbering_v1", "numbering", "2026-10-14", "63"],
      ["2", "dentex_findings_classification_v1", "classification", "2026-10-14", "73"],
      ["3", "dentex_teeth_detection_v1", "detection", "2026-10-14", "63"],
      ["4", "dentex_teeth_segmentation_v1", "segmentation", "2026-10-14", "63"],
      ["5", "classifier uncertainty evaluation", "calibration", "2026-10-14", "crops"],
      ["(6)", "Kaggle BASE, seeds 42\u201346", "classification", "2026-10-16", "73"],
      ["(7)", "External-data run, BASE seeds 42\u201346", "classification", "2026-10-24", "73"],
    ], [380, 2020, 980, 980, 680], { center: [0, 3, 4], size: 14, notes: ["Entries 1\u20135: Data/reports/test_set_ledger.json. Entries (6) and (7) are not in the ledger; sources: reports/p5_disclosure_entry.json and kaggle/artifacts_external_run1/ledger_disclosure_entry.json."] }),
  P("Reproducibility is supported but limited. Every evaluation report records the dataset fingerprint, manifest and split hashes, and the software versions. Checkpoint SHA-256 values match the prefixes recorded at training time. The four deployed checkpoints are, however, legacy: they were trained before image-level training manifests existed. Their recorded image counts match the current split, which is consistent with, but does not prove, training on exactly these images. Checkpoints trained later carry a manifest that the model registry verifies."),
);

// ---------------------------------------------------------------- XIV. Limitations and ethics
add(H1("XIV. Limitations and Ethical Considerations"),
  P("The evidence has clear boundaries. All models were trained and tested on one dataset, from three institutions, with one seed and a single hold-out split, so performance on other scanners, pediatric patients or unusual images is unknown. The validation and test splits are small (65\u201373 radiographs per task), and Periapical Lesion has only 9 validation and 13 test findings, so its metrics move by large steps when a single crop changes. Validation numbers are optimistic because validation chose the epochs. The internal test split has now been used, so later results on it are not untouched estimates, and an external test set would be needed for an unbiased estimate. Patient-level leakage cannot be excluded."),
  P("The classifier\u2019s design limits what the system can say. It has no healthy class, returns one label per tooth, names a closest finding for every detected tooth, and its scores are not calibrated probabilities. The entropy flag sends more than half of the regions to review and still misses 13 % of errors. The thresholds are provisional, and no study has measured whether review by qualified clinicians improves accuracy or safety. Reviewer identities are self-declared, and the Hindi and Marathi report wording has not been reviewed by native-speaking dental professionals."),
  P("Ethically, DentaMind AI is a research prototype. It does not diagnose, and its reports are marked as unconfirmed drafts that require a qualified professional\u2019s review. We make no claim of clinical validation, autonomous diagnosis or improved patient outcomes. DENTEX images are de-identified public research data released under the CC BY-NC-SA 4.0 license {c:hamamciArxiv}, and its terms apply to any reuse. All figures are schematic diagrams; no radiograph is reproduced."),
);

// ---------------------------------------------------------------- XV. Conclusion and future work
add(H1("XV. Conclusion and Future Work"),
  P("On DENTEX, standard detectors localize and number teeth well: test AP50 is 0.966 for detection and mask AP50 0.974 for segmentation, and 96.8 % of matched teeth receive the exact FDI number. Finding classification is the weak link. Macro-F1 is 0.646 on ground-truth test crops, and on validation it drops from 0.718 to 0.634 once the classifier receives detector boxes; Deep Caries and Periapical Lesion are recognized poorly in both settings. Uncertainty flags capture most classifier errors, but only by routing more than half of all regions to review. None of the four controlled attempts to improve the classifier met its pre-set criteria, and active learning did not outperform random selection. We report these negative results because they mark the limits of what the system can currently claim, and because they show where effort is most needed: better labels for the rare classes, a “no finding” class, and external data."),
  P("Future work follows directly from these limits: a separately sourced external test set evaluated once under the documented protocol; patient identifiers that allow patient-grouped splits; labels for teeth without findings, so that a \u201cno finding\u201d class and real false-positive rates become measurable; a multi-label formulation for teeth with several findings; and a reader study with qualified dentists to measure whether uncertainty-guided review improves accuracy. After the evaluation reported here, a radiograph-grouped five-fold cross-validation of the baseline ResNet-50 classifier recipe was run on the DENTEX training and validation pool (541 radiographs, 2,851 findings, five seeds). Its out-of-fold macro-F1 was 0.677 ± 0.008 on detector boxes and 0.698 ± 0.007 on ground-truth boxes (mean ± SD over seeds). It is reported separately, was not used to select any model in this paper, and does not change the results above."),
);

// ---------------------------------------------------------------- acknowledgment (added for submission)
add(new Paragraph({ heading: HeadingLevel.HEADING_1, children: runs("Acknowledgment") }),
  P("The authors thank their guide, Dr. Pradnya Narkhede, Department of Computer Engineering, PCCOE, for guidance and supervision. AI-generated content is disclosed following IEEE policy. The text of all sections, the figure-drawing code and the resulting diagrams (Figs. 1\u20137), and the reference search were produced with the assistance of an AI system (Claude, Anthropic), working from the project\u2019s own source code and evaluation reports. Every reported number was reconciled against those reports, and every added reference was checked against its bibliographic record. The authors are responsible for the content of this paper."),
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
  fs.writeFileSync(BIB, "% References for dentist-research-paper.docx, in IEEE citation order.\n% DOIs verified against Crossref / DataCite on 2026-10-24; entries without a DOI are noted in the QC report.\n\n" + bib + "\n");
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

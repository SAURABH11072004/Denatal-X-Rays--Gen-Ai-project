const { ch, sec, sub, p, pn, bul, ol, tab, cols } = require("./blocks.js");

module.exports = [
  // =============================================================== CHAPTER 1
  ch(1, "Introduction"),
  sec("1.1", "Overview of Generative AI"),
  p("Generative artificial intelligence refers to models that learn the structure of a body of data well enough to produce new data of the same kind: images, text, audio or structured records. Three families dominate current practice. Generative adversarial networks train a generator against a discriminator until the generated samples become hard to tell apart from real ones {c:goodfellow}. Diffusion models learn to reverse a gradual noising process and produce samples by denoising step by step {c:ho}. Transformer language models, built on self-attention {c:vaswani}, generate text one token at a time, and at large scale they can follow instructions and solve new tasks from a few examples {c:brown}."),
  p("Large language models have already been tested on medical questions. Singhal {i}et al.{/i} showed that such models encode a substantial amount of clinical knowledge {c:singhal}, and Thirunavukarasu {i}et al.{/i} reviewed both the opportunities and the risks of using them in medicine {c:thirunavukarasu}. The main risk for this project is hallucination: fluent text that is not supported by the input {c:ji}. Retrieval-augmented generation reduces the problem by conditioning the generator on retrieved documents {c:lewis}, but it does not remove it. In a clinical setting, a sentence that names the wrong tooth or invents a finding is worse than no sentence at all."),
  p("DentaMind AI uses generative AI in one clearly bounded place. The perception models that locate, number, segment and classify teeth are discriminative networks; they are not generative and the report does not describe them as such. The generative component is the reporting layer, which turns the structured output of those models into readable draft reports in English, Hindi and Marathi. It is built so that it can only restate what the models produced: every draft is checked against the structured evidence, and text that adds a tooth, a number, a finding name or a diagnostic phrase is rejected. Section {S:s3_5} lists the requirements this places on the generator, and Section {S:s5_3} explains why this conservative design was chosen."),

  sec("1.2", "Project Background"),
  p("A panoramic radiograph shows both dental arches, the supporting bone and the temporomandibular region in a single exposure, which makes it one of the most common images in a dental examination. Reading it takes time. The reader has to find every tooth, assign it a two-digit FDI number (ISO 3950 {c:iso3950}) and look at each tooth for findings such as caries, impaction or a periapical lesion. Convolutional neural networks have been studied for many of these tasks {c:schwendicke}, from early tooth detection and numbering {c:tuzoff} to recent multi-stage systems that combine segmentation and numbering {c:putra,zhangJBHI}."),
  p("The public DENTEX dataset made it possible to study enumeration and diagnosis on the same panoramic images. Its annotations are hierarchical: quadrants, then teeth with their quadrant and index, then teeth that carry one of four findings {c:hamamciArxiv}. The DENTEX authors also published a diffusion-based hierarchical detector for the combined task {c:hamamciMiccai}, which is itself an example of a generative model used for perception."),
  p("The DentaMind code base started from the open-source CCB computer vision repository, which provides template notebooks for classification, detection, instance segmentation and Grad-CAM on the DENTEX data {c:ccbrepo}. Those research notebooks were kept unchanged. The team added everything that makes up the system described in this report: the core library, the FastAPI back end, the React front end, the configuration, the training and evaluation scripts, the report generator and the test suite."),

  sec("1.3", "Motivation"),
  p("Three observations motivated the project. The first is that published results for dental AI are often reported per task, while a usable tool has to run the tasks in sequence. A finding classifier is usually scored on hand-drawn tooth boxes, but in a real system it receives whatever the detector returns, so detection errors propagate. We wanted to measure that effect rather than assume it away."),
  p("The second is that a model which is wrong without warning is hard to use safely. A tool that marks the regions it is unsure about, and hands them to a person, can still be useful even when its accuracy is modest, provided the uncertainty signals actually separate correct from incorrect outputs. This had to be tested, not claimed."),
  p("The third concerns the written output. Clinicians and patients read reports, not tables of scores, and in Maharashtra a report in Hindi or Marathi can be easier to follow than one in English. Generative AI makes fluent drafting cheap, but it also makes confident errors cheap. The project therefore needed a way to produce readable multilingual drafts that cannot say more than the models found."),

  sec("1.4", "Problem Statement"),
  p("To design, implement and evaluate a research system that takes a panoramic dental radiograph and (i) detects, numbers and segments the teeth, (ii) names the closest of the four DENTEX finding classes for each detected tooth, (iii) estimates the uncertainty of each region and routes uncertain regions to a human reviewer, and (iv) generates evidence-grounded draft reports in English, Hindi and Marathi that cannot introduce content absent from the model output. The system has to be evaluated on held-out data with a documented protocol that prevents duplicate radiographs from leaking across splits, and its limitations have to be reported as clearly as its results."),

  sec("1.5", "Objectives"),
  ol([
    "To audit the DENTEX data, remove the effect of duplicated radiographs, and build train, validation, calibration and test splits grouped by pixel content.",
    "To train and evaluate a tooth detector, an FDI numbering model, a tooth instance segmenter and a four-class finding classifier, and to link their outputs region by region through IoU matching.",
    "To measure how finding classification changes when the classifier receives detector crops instead of ground-truth crops.",
    "To compute per-region uncertainty signals, fix review thresholds on a separate calibration split, and test whether the signals capture the classifier’s errors.",
    "To build an evidence-grounded report generator with English, Hindi and Marathi output, an automatic validator and named-reviewer sign-off.",
    "To deliver a working local application (FastAPI back end and React front end) with human review, and to verify it with automated and acceptance tests.",
    "To report negative results, unfavorable metrics and data-integrity limitations alongside the positive findings.",
  ]),

  sec("1.6", "Scope of the Work"),
  p("The work covers adult panoramic radiographs from the DENTEX dataset, the four finding classes that DENTEX annotates, and a locally deployed prototype that runs on a single workstation. Within that scope it includes data auditing, model training and evaluation, uncertainty estimation and review routing, evidence-grounded report drafting in three languages, a human-review workflow with a second approver, an active-learning study and a full software test campaign."),
  p("Several things are deliberately outside the scope. The system is not a diagnostic device and makes no clinical claim; no clinical study has been carried out. The classifier has no healthy class, so it cannot declare a tooth healthy. Pediatric and mixed-dentition images, other imaging modalities and other datasets were not studied. The optional language-model path for rewording reports is implemented but was never connected to a live model, and the Hindi and Marathi wording has not been reviewed by a native-speaking dental professional. These limits are restated in Chapter 8."),

  // =============================================================== CHAPTER 2
  ch(2, "Literature Survey"),
  sec("2.1", "Review of Recent Literature"),
  p("Deep learning for dental radiographs has moved from single tasks to multi-stage pipelines. Schwendicke {i}et al.{/i} mapped the early use of convolutional networks for dental image diagnostics in a scoping review {c:schwendicke}. Tuzoff {i}et al.{/i} detected and numbered teeth on panoramic radiographs with a Faster R-CNN detector followed by a classification network {c:tuzoff}. More recently, Putra {i}et al.{/i} detected and numbered permanent teeth with a deep detector {c:putra}, and Zhang {i}et al.{/i} built a multi-stage system that couples instance segmentation with FDI-compliant numbering and treats missing and supernumerary teeth explicitly {c:zhangJBHI}."),
  p("For findings, Szabó {i}et al.{/i} evaluated a commercial system for periapical lesions on 616 teeth from 357 panoramic radiographs {c:szabo}, and Bittar {i}et al.{/i} summarized the evidence on AI for caries detection in an umbrella review {c:bittar}. Hamamci {i}et al.{/i} released DENTEX {c:hamamciArxiv} together with a diffusion-based hierarchical detector for its enumeration-and-diagnosis task {c:hamamciMiccai}. Two lessons from this literature shaped the project: results depend strongly on how the data were split, and rare findings such as periapical lesions are much harder than common ones. {T:litcomp} places these studies next to DentaMind AI."),
  tab({ id: "litcomp", title: "Comparison of Related Studies with DentaMind AI", head: ["Study", "Task and data", "Relation to this project"],
    widths: cols(22, 40, 38), size: 20, rows: [
      ["Schwendicke {i}et al.{/i} {c:schwendicke}", "Scoping review of CNNs for dental image diagnostics", "Background on early CNN work in dental imaging"],
      ["Tuzoff {i}et al.{/i} {c:tuzoff}", "Tooth detection and numbering, panoramic radiographs", "Same tasks; we add segmentation, findings and uncertainty"],
      ["Putra {i}et al.{/i} {c:putra}", "Permanent-tooth detection and numbering, panoramic", "Same tasks; we add end-to-end evaluation"],
      ["Zhang {i}et al.{/i} {c:zhangJBHI}", "Multi-stage instance segmentation and FDI numbering", "Same task pair; we link stages by IoU and add review routing"],
      ["Szabó {i}et al.{/i} {c:szabo}", "Commercial periapical-lesion detection, 357 panoramic radiographs", "Periapical Lesion is our weakest class"],
      ["Bittar {i}et al.{/i} {c:bittar}", "Umbrella review of AI caries detection", "Context for the Caries and Deep Caries results"],
      ["Hamamci {i}et al.{/i} {c:hamamciArxiv,hamamciMiccai}", "DENTEX benchmark; diffusion-based hierarchical detector", "Source of our data and finding taxonomy"],
    ] }),

  sec("2.2", "Generative AI: Existing Approaches"),
  p("Generative models differ in what they generate and in how much control the user has over the output. Adversarial networks {c:goodfellow} and diffusion models {c:ho} generate images and have been used in medical imaging for synthesis and, in the DENTEX baseline, for detection {c:hamamciMiccai}. Transformer language models {c:vaswani,brown} generate text and can describe structured data in natural language. Retrieval-augmented generation adds documents retrieved at run time to the model’s input, so that the text can be grounded in a knowledge source {c:lewis}. Older data-to-text systems generate text from structured records with explicit document plans and sentence templates; they are less fluent but fully predictable {c:reiter}."),
  p("{T:genapproaches} compares these approaches for the specific job DentaMind needs done: turning a list of model findings into a short, faithful report. The deciding factor was not fluency but control. A report generator in this setting must never add a tooth, a number or a diagnosis that the models did not produce."),
  tab({ id: "genapproaches", title: "Generative Approaches and Their Suitability for Evidence-Grounded Dental Reports", head: ["Approach", "What it generates", "Main risk for reports", "Use in DentaMind AI"],
    widths: cols(20, 24, 30, 26), size: 20, rows: [
      ["GAN {c:goodfellow}", "Images", "Not designed for text; synthetic images could be mistaken for data", "Not used"],
      ["Diffusion model {c:ho}", "Images; also used for detection {c:hamamciMiccai}", "Heavy computation for a 4 GB GPU", "Not used"],
      ["Large language model {c:vaswani,brown}", "Fluent free text", "Hallucinated teeth, numbers or diagnoses {c:ji}", "Optional rewording only, behind the validator; never run live"],
      ["Retrieval-augmented generation {c:lewis}", "Text grounded in retrieved documents", "Retrieved text can still be misused; needs a curated corpus", "Not used (no curated dental corpus)"],
      ["Template-based data-to-text {c:reiter}", "Text from structured records", "Less fluent; wording must be written by hand", "Default generator in English, Hindi and Marathi"],
    ] }),

  sec("2.3", "Review of Related Generative AI Systems"),
  p("Automatic report generation for medical images has its own line of work. Jing {i}et al.{/i} generated medical imaging reports, including chest X-ray reports, with a co-attention model that first predicts tags and then writes the text {c:jing}. Chen {i}et al.{/i} introduced R2Gen, a memory-driven Transformer that writes complete radiology reports directly from images {c:r2gen}. These systems learn from large collections of paired images and reports. DENTEX contains no reports at all, so this approach was not available to us even in principle."),
  p("General-purpose biomedical models point in the same direction. Singhal {i}et al.{/i} reported strong results for the Med-PaLM models on medical question-answering benchmarks, while their human evaluation still found gaps relative to clinicians {c:singhal}, and Tu {i}et al.{/i} extended the idea to a single model that handles images, text and genomics {c:tu}. Both papers are careful to note failure modes, and the survey by Ji {i}et al.{/i} shows that hallucination is a property of neural text generation in general rather than of any one model {c:ji}. For a student project without clinical reviewers, these results argue for keeping the generator on a short leash: let it rephrase, never let it decide."),

  sec("2.4", "Existing Solutions and State-of-the-Art Methods"),
  sub("2.4.1", "Detection, Segmentation and Classification"),
  p("Faster R-CNN proposes candidate regions with a region-proposal network and classifies them in a second stage {c:ren}. A feature pyramid network gives the detector features at several scales {c:fpn}, which suits panoramic images, where incisors and molars differ greatly in size. Mask R-CNN adds a mask branch to Faster R-CNN and produces one binary mask per instance {c:maskrcnn}. Residual networks make very deep classifiers trainable through identity shortcuts {c:resnet}. In practice all of these are initialized from weights pre-trained on large general-purpose datasets, COCO for detection {c:coco} and ImageNet for classification {c:imagenet}, and then fine-tuned on the target data."),
  sub("2.4.2", "Uncertainty, Calibration and Selective Prediction"),
  p("Huang {i}et al.{/i} review uncertainty quantification for medical image analysis and distinguish probabilistic from non-probabilistic methods {c:huangUQ}. Test-time augmentation gives an inexpensive estimate from a single network by comparing predictions on transformed copies of the input {c:wangTTA}. Selective classification lets a model abstain when it is unsure, trading coverage for lower risk {c:geifman}. Modern networks tend to be over-confident; temperature scaling is the standard post-hoc correction {c:guo}, and the expected calibration error {c:naeini} and the Brier score {c:brier} are the usual measures. Youden’s index {c:youden} is a common way to pick a decision threshold, and the Jensen-Shannon divergence {c:linJS} measures how far two probability vectors differ."),
  sub("2.4.3", "Explainability, Active Learning and Data Integrity"),
  p("Grad-CAM produces a coarse heat map of the image regions that drive a classifier’s decision {c:selvaraju}. Active learning tries to reduce labeling effort by choosing which images to annotate next, and Wang {i}et al.{/i} survey its use in medical imaging {c:wangAL}. On the data side, Kapoor and Narayanan show that leakage between training and test data is a common cause of irreproducible machine-learning results {c:kapoor}, and Huang {i}et al.{/i} measured how near-duplicate images inflate a brain-MRI benchmark {c:huangDup}. These two papers explain why so much of this project’s effort went into the data protocol of Section {S:s5_2}."),

  sec("2.5", "Gap Identification"),
  p("Reading the literature against the needs of a usable tool shows five gaps. {T:gaps} lists them with the way the project responds. The responses are evaluations and safeguards rather than new network architectures; the contribution of this project is evidence about how a complete pipeline behaves, not a new model."),
  tab({ id: "gaps", title: "Gaps in Existing Work and the Response in This Project", head: ["Gap", "Response in DentaMind AI"],
    widths: cols(45, 55), size: 20, rows: [
      ["Stages are evaluated separately; classifiers are scored on ground-truth boxes", "An end-to-end study on detector crops (Section {S:s7_5})"],
      ["Uncertainty is rarely tied to an operational review decision", "Thresholds fixed on a calibration split, then tested once on held-out data (Section {S:s7_4})"],
      ["Generated reports can hallucinate content", "Template generation by default, an evidence validator for every draft, LLM output rejected on any violation (Section {S:s6_2})"],
      ["Duplicate radiographs and repeated test use inflate results", "Pixel-hash grouped splits, leakage checks and a hash-chained test-set ledger (Section {S:s7_6})"],
      ["Negative results are seldom reported", "Four improvement attempts and an active-learning study reported with their failed criteria (Section {S:s7_6})"],
    ] }),

  sec("2.6", "Common Findings from Literature"),
  bul([
    "Detecting and numbering teeth on panoramic radiographs is now reliable on curated data, while recognizing findings, especially rare ones, remains much harder.",
    "Most models are fine-tuned from general-purpose pre-trained weights, and results depend heavily on dataset composition and splitting.",
    "Uncertainty estimates are useful only if they are checked against actual errors on data that were not used to tune them.",
    "Neural text generators are fluent but can produce unsupported statements, so medical text generation needs grounding and checking.",
    "Leakage and duplicate images are a recognized source of inflated performance, and patient-level grouping requires identifiers that public datasets often lack.",
  ]),
];

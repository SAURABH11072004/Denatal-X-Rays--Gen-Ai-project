// DentaMind AI - B.Tech. MDM (Generative AI) capstone report in the PCCOE format (2026-10-26).
// Layout follows documents/Capstone Project_Report_Format2.pdf: A4, margins 23.4 / 37 / 32 / 23.4 mm (top/left/bottom/right),
// Times New Roman 12 pt, justified, 1.5 line spacing, single blank line between paragraphs, 0.5 in (five-space) indent,
// chapter titles 14 pt bold capitals centred, section headings 12 pt bold capitals left, subheadings title case left,
// figure number and title below (10 pt), table number and title above (10 pt), footer text 10 pt centred with the page
// number centred below it, small Roman numerals for preliminary pages and Arabic numbers from the Introduction.
// Contents, figure and table lists are PAGEREF fields to bookmarks; build/export_report.ps1 has Word update them, saves the DOCX and exports the PDF.
// Usage (docx@9.5.1 and jszip on NODE_PATH):  node build_report.js <capstone_report_dir> <out.docx>
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, AlignmentType, HeadingLevel, WidthType,
  BorderStyle, SectionType, Footer, PageNumber, NumberFormat, TabStopType, Tab, VerticalAlign, Bookmark, PageReference,
  PageBorderOffsetFrom, PageBorderDisplay, PageBorderZOrder, LevelFormat,
  LineRuleType,
  Math: OMath, MathRun, MathFraction, MathSubScript, MathSuperScript, MathRoundBrackets, MathSum,
} = require("docx");

const [ROOT, OUT] = process.argv.slice(2);
const FONT = "Times New Roman";
const COVER_FONT = "Segoe UI";
const MM = 56.6929;                                   // twips per mm
const PAGE = { w: 11906, h: 16838 };                  // A4
const MARGIN = { top: Math.round(23.4 * MM), left: Math.round(37 * MM), bottom: Math.round(32 * MM), right: Math.round(23.4 * MM) };
const TEXTW = PAGE.w - MARGIN.left - MARGIN.right;    // 8481 twips = 149.6 mm
const FOOTER_TEXT = "PCCOE, Department of Computer Science and Engineering (AI & ML) 2026-27";

const content = require("./content_report.js");
const META = content.META;
const REFS = content.REFS;

// ------------------------------------------------------------------ numbering pass (figures, tables, equations, sections)
const DOC = content.body();                            // ordered list of plain descriptors
const num = { fig: {}, tab: {}, eq: {}, sec: {}, algo: {} };
{
  let ch = 0, f = 0, t = 0, e = 0, a = 0;
  for (const d of DOC) {
    if (d.t === "ch") { ch = d.n; f = 0; t = 0; e = 0; num.sec[d.id || `ch${d.n}`] = String(d.n); }
    if (d.t === "sec" || d.t === "sub") { if (d.id) num.sec[d.id] = d.num; }
    if (d.t === "fig") { if (num.fig[d.id]) throw new Error("dup fig " + d.id); num.fig[d.id] = `${ch}.${++f}`; }
    if (d.t === "tab") { if (num.tab[d.id]) throw new Error("dup tab " + d.id); num.tab[d.id] = `${ch}.${++t}`; }
    if (d.t === "eq") { if (num.eq[d.id]) throw new Error("dup eq " + d.id); num.eq[d.id] = `${ch}.${++e}`; }
    if (d.t === "algo") { num.algo[d.id] = String(++a); }
  }
}
// appendix tables and figures are numbered A.1, A.2, ...
const APP = content.appendices();
{
  let f = 0, t = 0;
  for (const d of APP) {
    if (d.t === "fig") num.fig[d.id] = `A.${++f}`;
    if (d.t === "tab") num.tab[d.id] = `A.${++t}`;
  }
}
const ALL = DOC.concat(APP);
const cited = [];
function cite(keys) {
  const n = [...new Set(keys.map((k) => {
    if (!REFS[k]) throw new Error("unknown reference " + k);
    if (!cited.includes(k)) cited.push(k);
    return cited.indexOf(k) + 1;
  }))].sort((a, b) => a - b);
  const parts = [];
  for (let i = 0; i < n.length;) {
    let j = i;
    while (j + 1 < n.length && n[j + 1] === n[j] + 1) j++;
    if (j - i >= 2) parts.push(`[${n[i]}]–[${n[j]}]`);            // IEEE citation range notation
    else for (let k = i; k <= j; k++) parts.push(`[${n[k]}]`);
    i = j + 1;
  }
  return parts.join(", ");
}
function resolve(s) {
  return s
    .replace(/\{c:([^}]+)\}/g, (_, k) => cite(k.split(",").map((x) => x.trim())))
    .replace(/\{F:(\w+)\}/g, (_, id) => { if (!num.fig[id]) throw new Error("fig ref " + id); return `Figure ${num.fig[id]}`; })
    .replace(/\{T:(\w+)\}/g, (_, id) => { if (!num.tab[id]) throw new Error("tab ref " + id); return `Table ${num.tab[id]}`; })
    .replace(/\{E:(\w+)\}/g, (_, id) => { if (!num.eq[id]) throw new Error("eq ref " + id); return `(${num.eq[id]})`; })
    .replace(/\{S:(\w+)\}/g, (_, id) => { if (!num.sec[id]) throw new Error("sec ref " + id); return num.sec[id]; })
    .replace(/\{A:(\w+)\}/g, (_, id) => { if (!num.algo[id]) throw new Error("algo ref " + id); return `Algorithm ${num.algo[id]}`; });
}

// ------------------------------------------------------------------ inline runs: {i} {b} {sub} {sup} {u}
function runs(src, base = {}) {
  src = resolve(src);
  const out = [];
  const st = { i: false, b: false, sub: false, sup: false, u: false };
  for (const tok of src.split(/(\{\/?(?:i|b|sub|sup|u)\})/)) {
    const m = tok.match(/^\{(\/?)(i|b|sub|sup|u)\}$/);
    if (m) { st[m[2]] = !m[1]; continue; }
    if (!tok) continue;
    out.push(new TextRun({ text: tok, font: base.font || FONT, size: base.size || 24, italics: base.italics ? !st.i : st.i,
      bold: base.bold || st.b, subScript: st.sub, superScript: st.sup, underline: st.u ? {} : undefined, smallCaps: base.smallCaps }));
  }
  return out;
}

const LINE = 360;                                     // 1.5 line spacing
const BODY = (t, o = {}) => new Paragraph({ alignment: AlignmentType.JUSTIFIED, indent: { firstLine: 720 },
  spacing: { line: LINE, after: 240 }, ...o, children: runs(t) });

// ------------------------------------------------------------------ equations (OMML)
const R = (t) => new MathRun(t);
const U = (t) => new MathRun("" + t);           // upright text inside math (styled in postprocess)
const sub = (b, s) => new MathSubScript({ children: [].concat(b), subScript: [].concat(s) });
const sup = (b, s) => new MathSuperScript({ children: [].concat(b), superScript: [].concat(s) });
const frac = (n, d) => new MathFraction({ numerator: [].concat(n), denominator: [].concat(d) });
const rb = (c) => new MathRoundBrackets({ children: [].concat(c) });
const sum = (c, s, p) => new MathSum({ children: [].concat(c), subScript: s ? [].concat(s) : undefined, superScript: p ? [].concat(p) : undefined });
const M = { R, U, sub, sup, frac, rb, sum };

// ------------------------------------------------------------------ tables
const thin = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
const none = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
function cell(t, w, { bold = false, align = AlignmentType.LEFT, size = 20, keepNext = false, borders, shade } = {}) {
  const paras = String(t).split("\n").map((line, k, arr) => new Paragraph({ alignment: align, keepNext: keepNext || k < arr.length - 1,
    spacing: { after: 0, line: 240 }, children: runs(line, { size, bold }) }));
  return new TableCell({ width: { size: w, type: WidthType.DXA }, borders: borders || { top: thin, bottom: thin, left: thin, right: thin },
    verticalAlign: VerticalAlign.CENTER, margins: { top: 40, bottom: 40, left: 90, right: 90 },
    shading: shade ? { fill: shade } : undefined, children: paras });
}
function caption(kind, id, title) {
  const n = kind === "Figure" ? num.fig[id] : num.tab[id];
  const bm = `${kind === "Figure" ? "fig" : "tab"}_${id}`;
  return new Paragraph({ alignment: AlignmentType.CENTER, keepNext: kind === "Table",
    spacing: kind === "Table" ? { before: 120, after: 80, line: 240 } : { before: 60, after: 240, line: 240 },
    children: [new Bookmark({ id: bm, children: runs(`{b}${kind} ${n}:{/b} ${title}`, { size: 20 }) })] });
}
function TABLE(d) {
  const total = d.widths.reduce((a, b) => a + b, 0);
  if (total !== TEXTW) throw new Error(`table ${d.id}: widths ${total} != ${TEXTW}`);
  const center = d.center || [];
  const al = (c) => (center.includes(c) ? AlignmentType.CENTER : AlignmentType.LEFT);
  const size = d.size || 20;
  const short = d.rows.length <= 14;
  const out = [caption("Table", d.id, d.title),
    new Table({ width: { size: TEXTW, type: WidthType.DXA }, columnWidths: d.widths, rows: [
      new TableRow({ tableHeader: true, cantSplit: true, children: d.head.map((h, c) => cell(h, d.widths[c], { bold: true, align: al(c), size, keepNext: true })) }),
      ...d.rows.map((r, i) => new TableRow({ cantSplit: true, children: r.map((t, c) => cell(t, d.widths[c],
        { align: al(c), size, bold: (d.boldRows || []).includes(i), keepNext: short && i < d.rows.length - 1 })) })),
    ] })];
  if (d.note) out.push(new Paragraph({ alignment: AlignmentType.LEFT, spacing: { before: 60, after: 240, line: 240 }, children: runs(d.note, { size: 18 }) }));
  else out.push(new Paragraph({ spacing: { after: 120, line: 240 }, children: [] }));
  return out;
}

// ------------------------------------------------------------------ figures (vector SVG with PNG fallback, or PNG)
function pngSize(buf) { return [buf.readUInt32BE(16), buf.readUInt32BE(20)]; }
function FIG(d) {
  const png = fs.readFileSync(path.join(ROOT, d.png));
  const [wpx, hpx] = pngSize(png);
  const wIn = d.width || 5.2;
  let w = wIn * 96, h = w * hpx / wpx;
  const maxH = (d.maxHeight || 8.2) * 96;
  if (h > maxH) { w = w * maxH / h; h = maxH; }
  const img = d.svg
    ? new ImageRun({ type: "svg", data: fs.readFileSync(path.join(ROOT, d.svg)), transformation: { width: w, height: h }, fallback: { type: "png", data: png },
      altText: { title: d.title, description: d.title, name: d.id } })
    : new ImageRun({ type: "png", data: png, transformation: { width: w, height: h }, altText: { title: d.title, description: d.title, name: d.id } });
  const frame = d.frame ? { top: { ...thin, space: 2 }, bottom: { ...thin, space: 2 }, left: { ...thin, space: 2 }, right: { ...thin, space: 2 } } : undefined;
  const out = [new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, pageBreakBefore: !!d.pageBreakBefore, spacing: { before: 120, after: 60, line: 240 }, border: frame, children: [img] }),
    caption("Figure", d.id, d.title)];
  if (d.legend) {   // template: legend below the title, 10 pt
    out[1] = new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, spacing: { before: 60, after: 0, line: 240 },
      children: [new Bookmark({ id: `fig_${d.id}`, children: runs(`{b}Figure ${num.fig[d.id]}:{/b} ${d.title}`, { size: 20 }) })] });
    out.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 20, after: 240, line: 240 }, children: runs(d.legend, { size: 20, italics: true }) }));
  }
  return out;
}

// ------------------------------------------------------------------ equation paragraph, numbered (chapter.k) at the right margin
function EQ(d) {
  return new Paragraph({ tabStops: [{ type: TabStopType.CENTER, position: TEXTW / 2 }, { type: TabStopType.RIGHT, position: TEXTW }],
    spacing: { before: 120, after: 120, line: 276 }, keepLines: true, keepNext: !!d.keepNext,
    children: [new TextRun({ children: [new Tab()], font: FONT }), new OMath({ children: d.math(M) }),
      new TextRun({ children: [new Tab(), `(${num.eq[d.id]})`], font: FONT, size: 24 })] });
}

// ------------------------------------------------------------------ algorithm box (ruled top and bottom)
function ALGO(d) {
  const rule = { style: BorderStyle.SINGLE, size: 8, color: "000000" };
  const paras = d.lines.map(([indent, text], k) => new Paragraph({ keepNext: k < d.lines.length - 1, spacing: { after: 20, line: 260 },
    indent: { left: 300 + indent * 360, hanging: 300 }, children: runs(text, { size: 22 }) }));
  return [
    new Paragraph({ keepNext: true, spacing: { before: 120, after: 60, line: 240 },
      children: [new Bookmark({ id: `algo_${d.id}`, children: runs(`{b}Algorithm ${num.algo[d.id]}:{/b} ${d.title}`, { size: 22 }) })] }),
    new Table({ width: { size: TEXTW, type: WidthType.DXA }, columnWidths: [TEXTW], rows: [new TableRow({ cantSplit: true, children: [
      new TableCell({ width: { size: TEXTW, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 80, right: 80 },
        borders: { top: rule, bottom: rule, left: none, right: none }, children: paras })] })] }),
    new Paragraph({ spacing: { after: 200 }, children: [] }),
  ];
}

// ------------------------------------------------------------------ headings
const chapterTitles = [];
function CH(d) {
  chapterTitles.push(d);
  return [
    new Paragraph({ alignment: AlignmentType.CENTER, pageBreakBefore: true, keepNext: true, spacing: { after: 120, line: 240 },
      children: runs(`CHAPTER ${d.n}`, { size: 28, bold: true }) }),
    new Paragraph({ heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, keepNext: true,
      children: [new Bookmark({ id: `ch${d.n}`, children: runs(d.title.toUpperCase(), { size: 28, bold: true }) })] }),
  ];
}
function SEC(d) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, keepNext: true,
    children: [new Bookmark({ id: `sec_${d.num.replace(/\./g, "_")}`, children: runs(`${d.num} ${d.title.toUpperCase()}`, { size: 24, bold: true }) })] });
}
function SUB(d) {
  return new Paragraph({ heading: HeadingLevel.HEADING_3, keepNext: true, children: runs(`${d.num} ${d.title}`, { size: 24, bold: true }) });
}
function UNNUMBERED(title, id, { pageBreak = true } = {}) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, pageBreakBefore: pageBreak, keepNext: true,
    children: [new Bookmark({ id, children: runs(title.toUpperCase(), { size: 28, bold: true }) })] });
}
let listInstance = 0;
function BULLETS(items, ordered = false) {
  const instance = ordered ? ++listInstance : 0;     // one instance per list, so each ordered list restarts at 1
  return items.map((t) => new Paragraph({ numbering: { reference: ordered ? "ordered" : "bullets", level: 0, instance },
    alignment: AlignmentType.JUSTIFIED, spacing: { line: LINE, after: 60 }, children: runs(t) }));
}

// ------------------------------------------------------------------ render body
function render(list) {
  const out = [];
  for (const d of list) {
    if (d.t === "ch") out.push(...CH(d));
    else if (d.t === "sec") out.push(SEC(d));
    else if (d.t === "sub") out.push(SUB(d));
    else if (d.t === "p") out.push(BODY(d.text, d.noIndent ? { indent: { firstLine: 0 } } : {}));
    else if (d.t === "bul") { const ps = BULLETS(d.items, d.ordered); out.push(...ps); out.push(new Paragraph({ spacing: { after: 120 }, children: [] })); }
    else if (d.t === "tab") out.push(...TABLE(d));
    else if (d.t === "fig") out.push(...FIG(d));
    else if (d.t === "eq") out.push(EQ(d));
    else if (d.t === "algo") out.push(...ALGO(d));
    else if (d.t === "where") out.push(BODY(d.text, { indent: { firstLine: 0 } }));
    else if (d.t === "unnumbered") out.push(UNNUMBERED(d.title, d.id));
    else if (d.t === "raw") out.push(...d.make({ runs, BODY, cell, TEXTW, FONT }));
    else throw new Error("unknown block " + d.t);
  }
  return out;
}
const bodyParas = render(DOC);

// ------------------------------------------------------------------ references (IEEE, order of first citation)
const refParas = [UNNUMBERED("References", "references")];
cited.forEach((k, i) => refParas.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 120, line: 276 },
  indent: { left: 600, hanging: 600 }, tabStops: [{ type: TabStopType.LEFT, position: 600 }],
  children: [new TextRun({ text: `[${i + 1}]`, font: FONT, size: 22 }), new TextRun({ children: [new Tab()], font: FONT, size: 22 }), ...runs(REFS[k], { size: 22 })] })));
const unused = Object.keys(REFS).filter((k) => !cited.includes(k));
if (unused.length) throw new Error("uncited references: " + unused.join(", "));

// appendices
const appendix = render(APP);

// ------------------------------------------------------------------ preliminary pages
function C(t, o = {}) {   // cover line: Segoe UI 12, centred, 16 pt line pitch as in the template; o.gap = space before (pt)
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: (o.gap || 0) * 20, after: 0, line: 320, lineRule: LineRuleType.EXACT },
    indent: { left: -500, right: -500 }, children: runs(t, { font: COVER_FONT, size: 24, bold: o.bold !== false }) });
}
const blank = (n = 1, size = 24) => Array.from({ length: n }, () => new Paragraph({ spacing: { after: 0, line: 240 }, children: [new TextRun({ text: "", size })] }));
const logo = fs.readFileSync(path.join(ROOT, "assets", "pccoe_logo_from_template.jpeg"));
const LOGO = (wIn) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 },
  children: [new ImageRun({ type: "jpg", data: logo, transformation: { width: wIn * 96, height: wIn * 96 * 228 / 288 },
    altText: { title: "PCCOE logo", description: "Logo of Pimpri Chinchwad College of Engineering, taken from the official report template", name: "pccoe_logo" } })] });

const cover = [
  C(`GROUP ID: ${META.groupId}`, { gap: 6 }),
  C("A PROJECT REPORT ON", { gap: 11 }),
  ...wrapTitle(META.title.toUpperCase()).map((t) => C(t)),
  C("SUBMITTED TO THE PIMPRI CHINCHWAD COLLEGE OF ENGINEERING", { gap: 11 }),
  C("AN AUTONOMOUS INSTITUTE, PUNE"),
  C("IN THE FULFILLMENT OF THE REQUIREMENTS", { gap: 11 }),
  C("FOR THE AWARD OF THE DEGREE"),
  C("{u}OF{/u}", { bold: false, gap: 11 }),
  C(`B. TECH. IN ${META.degreeDept.toUpperCase()}`),
  C("{u}FOR THE SUBJECT{/u}", { bold: false }),
  C("GENERATIVE AI MDM CAPSTONE PROJECT", { gap: 11 }),
  C("UNDER THE DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING (AI & ML)"),
  C("{u}SUBMITTED BY{/u}", { bold: false, gap: 11 }),
  new Paragraph({ spacing: { after: 0, line: 160, lineRule: LineRuleType.EXACT }, children: [] }),
  new Table({ alignment: AlignmentType.CENTER, width: { size: 6200, type: WidthType.DXA }, columnWidths: [3700, 2500],
    rows: META.students.map((s) => new TableRow({ children: [
      new TableCell({ width: { size: 3700, type: WidthType.DXA }, borders: { top: none, bottom: none, left: none, right: none },
        children: [new Paragraph({ spacing: { after: 0, line: 320, lineRule: LineRuleType.EXACT }, children: runs(s.name.toUpperCase(), { font: COVER_FONT, size: 24, bold: true }) })] }),
      new TableCell({ width: { size: 2500, type: WidthType.DXA }, borders: { top: none, bottom: none, left: none, right: none },
        children: [new Paragraph({ spacing: { after: 0, line: 320, lineRule: LineRuleType.EXACT }, children: runs(`PRN: ${s.prn}`, { font: COVER_FONT, size: 24, bold: true }) })] }),
    ] })) }),
  C("{u}UNDER THE GUIDANCE OF{/u}", { bold: false, gap: 11 }),
  C(META.guide.toUpperCase(), { gap: 11 }),
  new Paragraph({ spacing: { before: 120, after: 0 }, children: [] }),
  LOGO(1.44),
  C("DEPARTMENT OF COMPUTER ENGINEERING", { gap: 11 }),
  C("PCET’S PIMPRI CHINCHWAD COLLEGE OF ENGINEERING", { gap: 11 }),
  C("Sector No. 26, Pradhikaran, Nigdi, Pimpri-Chinchwad, PUNE – 411044", { gap: 11 }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 220, after: 0 }, children: runs("2026-2027", { size: 24 }) }),
];
// break the long title into balanced cover lines (about 55 characters each)
function wrapTitle(t, max = 58) {
  const words = t.split(" "), lines = [];
  let cur = "";
  for (const w of words) { if (cur && (cur + " " + w).length > max) { lines.push(cur); cur = w; } else cur = (cur ? cur + " " : "") + w; }
  if (cur) lines.push(cur);
  return lines;
}

const T12 = (t, o = {}) => new Paragraph({ alignment: o.align || AlignmentType.CENTER, spacing: { after: o.after ?? 0, line: o.line || 276, before: o.before || 0 },
  indent: o.indent, children: runs(t, { size: o.size || 24, bold: o.bold }) });
const sig = (lines, w) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: { top: none, bottom: none, left: none, right: none },
  children: lines.map(([t, b]) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0, line: 276 }, children: runs(t, { size: 24, bold: b }) })) });
const certificate = [
  T12("{b}PCET’S PIMPRI CHINCHWAD COLLEGE OF ENGINEERING{/b}"),
  T12("{b}Sector No. 26, Pradhikaran, Nigdi, Pimpri-Chinchwad, PUNE 411044{/b}"),
  ...blank(1),
  T12("{b}2026-2027{/b}"),
  LOGO(1.44),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 360 }, children: runs("CERTIFICATE", { size: 28, bold: true }) }),
  T12("This is to certify that the project report entitled"),
  T12(`{b}“${META.title.toUpperCase()}”{/b}`, { after: 240 }),
  T12("Submitted by", { after: 240 }),
  new Table({ alignment: AlignmentType.CENTER, width: { size: 6400, type: WidthType.DXA }, columnWidths: [3600, 2800],
    rows: META.students.map((s) => new TableRow({ children: [
      new TableCell({ width: { size: 3600, type: WidthType.DXA }, borders: { top: none, bottom: none, left: none, right: none },
        children: [new Paragraph({ spacing: { after: 0, line: 276 }, children: runs(s.name.toUpperCase(), { size: 24, bold: true }) })] }),
      new TableCell({ width: { size: 2800, type: WidthType.DXA }, borders: { top: none, bottom: none, left: none, right: none },
        children: [new Paragraph({ spacing: { after: 0, line: 276 }, children: runs(`PRN: ${s.prn}`, { size: 24, bold: true }) })] }),
    ] })) }),
  ...blank(1),
  new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { before: 240, after: 0, line: LINE }, children: runs(
    `are bonafide students of this institute and the work has been carried out by them under the supervision of {b}${META.guide}{/b} and it is approved for the partial fulfillment of the requirement of Pimpri Chinchwad College of Engineering, an autonomous institute, for the award of the B. Tech. degree in ${META.degreeDept}.`) }),
  ...blank(4),
  new Table({ width: { size: TEXTW, type: WidthType.DXA }, columnWidths: [TEXTW / 2, TEXTW / 2], rows: [new TableRow({ children: [
    sig([[`(${META.guide})`, true], ["Guide", false], [META.guideDeptLine, false]], TEXTW / 2),
    sig([["(Prof. Dr. Anuradha Thakare)", true], ["Head,", false], ["Department of CSE (AI & ML)", false]], TEXTW / 2),
  ] })] }),
  ...blank(2),
  T12("Place: Pune", { align: AlignmentType.LEFT }),
  T12("Date:", { align: AlignmentType.LEFT }),
];

const prelim = [...certificate, ...render(content.prelims())];

// ------------------------------------------------------------------ contents, list of figures, list of tables (PAGEREF)
function tocTable() {
  const W = [1100, 6200, 1181];
  const rows = [new TableRow({ tableHeader: true, children: ["Sr. No.", "Title of Chapter", "Page No."].map((h, c) => cell(h, W[c], { bold: true, align: c === 1 ? AlignmentType.LEFT : AlignmentType.CENTER, size: 24 })) })];
  const add = (sr, title, bm, { bold = false, top = false, last = false } = {}) => {
    const b = { top: top ? thin : none, bottom: last ? thin : none, left: thin, right: thin };
    rows.push(new TableRow({ cantSplit: true, children: [
      cell(sr, W[0], { bold: true, align: AlignmentType.CENTER, size: 24, borders: b }),
      cell(title, W[1], { bold, size: 24, borders: b }),
      new TableCell({ width: { size: W[2], type: WidthType.DXA }, borders: b, verticalAlign: VerticalAlign.CENTER, margins: { top: 20, bottom: 20, left: 90, right: 90 },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0, line: 240 }, children: bm ? [new PageReference(bm)] : [] })] }),
    ] }));
  };
  for (const ch of chapterTitles) {
    add(String(ch.n).padStart(2, "0"), ch.title, `ch${ch.n}`, { bold: true, top: true });
    for (const s of DOC.filter((d) => d.t === "sec" && d.num.startsWith(ch.n + "."))) add("", `${s.num} ${s.title}`, `sec_${s.num.replace(/\./g, "_")}`);
  }
  add("", "References", "references", { bold: true, top: true });
  add("", "Appendix A: Publication details (paper, reviewer comments, certificates)", "appendix_a", { bold: true, top: true });
  add("", "Appendix B: Plagiarism report of the project report", "appendix_b", { bold: true, top: true, last: true });
  return new Table({ width: { size: TEXTW, type: WidthType.DXA }, columnWidths: W, rows });
}
function listTable(kind) {
  const W = [1300, 6000, 1181];
  const ids = ALL.filter((d) => d.t === (kind === "Figure" ? "fig" : "tab"));
  const rows = [new TableRow({ tableHeader: true, children: [kind.toUpperCase(), "ILLUSTRATION", "PAGE NO."].map((h, c) =>
    cell(h, W[c], { bold: true, align: c === 1 ? AlignmentType.LEFT : AlignmentType.CENTER, size: 22 })) })];
  for (const d of ids) {
    const n = kind === "Figure" ? num.fig[d.id] : num.tab[d.id];
    rows.push(new TableRow({ cantSplit: true, children: [
      cell(n, W[0], { align: AlignmentType.CENTER, size: 22 }), cell(d.short || d.title, W[1], { size: 22 }),
      new TableCell({ width: { size: W[2], type: WidthType.DXA }, borders: { top: thin, bottom: thin, left: thin, right: thin }, verticalAlign: VerticalAlign.CENTER,
        margins: { top: 20, bottom: 20, left: 90, right: 90 },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0, line: 240 }, children: [new PageReference(`${kind === "Figure" ? "fig" : "tab"}_${d.id}`)] })] }),
    ] }));
  }
  return new Table({ width: { size: TEXTW, type: WidthType.DXA }, columnWidths: W, rows });
}
function simpleTable(head, rows, W, size = 22) {
  return new Table({ width: { size: TEXTW, type: WidthType.DXA }, columnWidths: W, rows: [
    new TableRow({ tableHeader: true, children: head.map((h, c) => cell(h, W[c], { bold: true, align: c === 0 ? AlignmentType.CENTER : AlignmentType.LEFT, size })) }),
    ...rows.map((r) => new TableRow({ cantSplit: true, children: r.map((t, c) => cell(t, W[c], { size, align: c === 0 ? AlignmentType.CENTER : AlignmentType.LEFT })) })),
  ] });
}
const lists = [
  UNNUMBERED("Table of Contents", "toc"), new Paragraph({ spacing: { after: 120 }, children: [] }), tocTable(),
  UNNUMBERED("List of Abbreviations", "abbrev"), new Paragraph({ spacing: { after: 120 }, children: [] }),
  simpleTable(["ABBREVIATION", "ILLUSTRATION"], content.ABBREVIATIONS, [2400, 6081]),
  UNNUMBERED("Nomenclature", "nomenclature"), new Paragraph({ spacing: { after: 120 }, children: [] }),
  simpleTable(["SYMBOL", "MEANING"], content.SYMBOLS, [2400, 6081]),
  UNNUMBERED("List of Figures", "lof"), new Paragraph({ spacing: { after: 120 }, children: [] }), listTable("Figure"),
  UNNUMBERED("List of Tables", "lot"), new Paragraph({ spacing: { after: 120 }, children: [] }), listTable("Table"),
];

// ------------------------------------------------------------------ document
const border = { style: BorderStyle.SINGLE, size: 6, color: "000000", space: 24 };
const pageProps = (pageNumbers) => ({
  page: { size: { width: PAGE.w, height: PAGE.h }, margin: { ...MARGIN, header: 708, footer: 600 },
    borders: { pageBorders: { display: PageBorderDisplay.ALL_PAGES, offsetFrom: PageBorderOffsetFrom.PAGE, zOrder: PageBorderZOrder.FRONT },
      pageBorderTop: border, pageBorderRight: border, pageBorderBottom: border, pageBorderLeft: border },
    pageNumbers },
});
const footer = new Footer({ children: [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ text: FOOTER_TEXT, font: FONT, size: 20 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 20 })] }),
] });
const emptyFooter = new Footer({ children: [new Paragraph({ children: [] })] });

const doc = new Document({
  creator: META.students.map((s) => s.name).join(", "), title: META.title, description: "B. Tech. MDM Generative AI capstone project report",
  styles: {
    default: { document: { run: { font: FONT, size: 24 }, paragraph: { spacing: { line: LINE } } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: FONT, size: 28, bold: true, color: "000000" },
        paragraph: { alignment: AlignmentType.CENTER, spacing: { before: 0, after: 480, line: 240 }, keepNext: true, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: FONT, size: 24, bold: true, color: "000000" },
        paragraph: { spacing: { before: 480, after: 240, line: 240 }, keepNext: true, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: FONT, size: 24, bold: true, color: "000000" },
        paragraph: { spacing: { before: 240, after: 120, line: 240 }, keepNext: true, outlineLevel: 2 } },
    ],
  },
  numbering: { config: [
    { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } }, run: { font: FONT } } }] },
    { reference: "ordered", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } }, run: { font: FONT } } }] },
  ] },
  sections: [
    { properties: pageProps(undefined), footers: { default: emptyFooter }, children: cover },
    { properties: { ...pageProps({ start: 1, formatType: NumberFormat.LOWER_ROMAN }), type: SectionType.NEXT_PAGE }, footers: { default: footer },
      children: [...prelim, ...lists] },
    { properties: { ...pageProps({ start: 1, formatType: NumberFormat.DECIMAL }), type: SectionType.NEXT_PAGE }, footers: { default: footer },
      children: [...bodyParas, ...refParas, ...appendix] },
  ],
});

async function postprocess(buf) {
  const JSZip = require("jszip");
  const zip = await JSZip.loadAsync(buf);
  let xml = await zip.file("word/document.xml").async("string");
  xml = xml.replace(/<m:r><m:t([^>]*)>/g, '<m:r><m:rPr><m:sty m:val="p"/></m:rPr><m:t$1>');
  if (xml.includes("")) throw new Error("unprocessed upright marker");
  xml = xml.replace(/(<m:supHide m:val="1"\/><\/m:naryPr>)(<m:sub>(?:(?!<m:e>)[\s\S])*?<\/m:sub>)<m:e>/g, "$1$2<m:sup/><m:e>");
  zip.file("word/document.xml", xml);
  return zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
}
Packer.toBuffer(doc).then(postprocess).then((buf) => {
  fs.writeFileSync(OUT, buf);
  const count = (o) => Object.keys(o).length;
  console.log(`wrote ${OUT} | chapters ${chapterTitles.length} | figures ${count(num.fig)} | tables ${count(num.tab)} | equations ${count(num.eq)} | references ${cited.length}`);
  fs.writeFileSync(OUT.replace(/\.docx$/, "_numbering.json"), JSON.stringify({ num, cited }, null, 1));
});

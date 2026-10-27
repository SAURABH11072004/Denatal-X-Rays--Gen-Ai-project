// Plain descriptors for the report body; build_report.js numbers and renders them.
const TEXTW = 8481;     // text width in twips (A4 with 37 mm / 23.4 mm side margins)

// column widths from relative weights, summing exactly to the text width
function cols(...w) {
  const s = w.reduce((a, b) => a + b, 0);
  const out = w.map((x) => Math.floor((x / s) * TEXTW));
  out[out.length - 1] += TEXTW - out.reduce((a, b) => a + b, 0);
  return out;
}

module.exports = {
  TEXTW, cols,
  ch: (n, title) => ({ t: "ch", n, title }),
  sec: (num, title) => ({ t: "sec", num, title, id: "s" + num.replace(/\./g, "_") }),
  sub: (num, title) => ({ t: "sub", num, title, id: "s" + num.replace(/\./g, "_") }),
  p: (text) => ({ t: "p", text }),
  pn: (text) => ({ t: "p", text, noIndent: true }),
  bul: (items) => ({ t: "bul", items }),
  ol: (items) => ({ t: "bul", items, ordered: true }),
  tab: (o) => ({ t: "tab", ...o }),
  fig: (o) => ({ t: "fig", ...o }),
  eq: (id, math, keepNext = false) => ({ t: "eq", id, math, keepNext }),
  where: (text) => ({ t: "where", text }),
  algo: (id, title, lines) => ({ t: "algo", id, title, lines }),
  unnumbered: (title, id) => ({ t: "unnumbered", title, id }),
  raw: (make) => ({ t: "raw", make }),
};

"""Local, indicative text-overlap check of the v3 manuscript (NOT an institutional similarity report).

Method: shingle matching (as in the 2026-10-24 check). A body word counts as matched when it lies inside a run of >= N
consecutive words that also occurs verbatim in a source, after lower-casing and removing punctuation. Prose only:
paragraphs of >= 12 words before the reference list; tables, equations and references are excluded.
Sources: available abstracts of the cited works (OpenAlex / earlier check) and the project's own documents.
Run:  python similarity_check.py  -> ../evidence/similarity_v3.json and similarity_v3.md
"""
import glob
import json
import re
import time
import urllib.request
import zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
V3 = HERE.parent
REPO = V3.parents[1]
OLD_ABS = Path(r"C:/Users/chand/AppData/Local/Temp/claude/D--Dentex-Gen-Ai/f3c708e5-68de-4725-a372-fe50e5eaa018/scratchpad/simcheck/abstracts")
NEW_DOIS = {"zhangJBHI": "10.1109/jbhi.2025.3643805", "brahmi": "10.1016/j.engappai.2024.108510", "huangUQ": "10.1016/j.media.2024.103223",
            "lambertUQ": "10.1016/j.artmed.2024.102830", "balanya": "10.1007/s00521-024-09505-4", "truong": "10.1109/isbi56570.2024.10635550",
            "huangDup": "10.3389/fmed.2026.1955863", "rajpurkar": "10.1148/radiol.250477"}


def toks(s):
    return re.findall(r"[a-z0-9]+(?:[.\-'][a-z0-9]+)*", s.lower())


def docx_paras(p):
    x = zipfile.ZipFile(p).read("word/document.xml").decode("utf8", errors="ignore")
    return [re.sub(r"<[^>]+>", "", q) for q in x.split("</w:p>")]


def openalex_abstract(doi):
    u = "https://api.openalex.org/works/https://doi.org/" + doi + "?mailto=btechgd@gmail.com"
    m = json.load(urllib.request.urlopen(u, timeout=60))
    inv = m.get("abstract_inverted_index") or {}
    return " ".join(w for _, w in sorted((p, w) for w, ps in inv.items() for p in ps))


paras = docx_paras(V3 / "DentaMind_AI_IEEE_v3.docx")
cut = next(i for i, q in enumerate(paras) if q.strip() == "References")
prose = [q for q in paras[:cut] if len(q.split()) >= 12]
P = toks("\n".join(prose))

sources, missing = {}, []
for f in sorted(glob.glob(str(OLD_ABS / "*.txt"))):
    sources[f"abstract (earlier check) {Path(f).stem}"] = ("literature", Path(f).read_text(encoding="utf-8"))
for k, d in NEW_DOIS.items():
    try:
        a = openalex_abstract(d)
    except Exception as e:  # noqa: BLE001
        a = ""
    if a:
        sources[f"abstract {k}"] = ("literature", a)
    else:
        missing.append(k)
    time.sleep(0.3)
own = [*glob.glob(str(REPO / "docs" / "*.md")), *glob.glob(str(REPO / "Data" / "reports" / "*.md")), *glob.glob(str(REPO / "reports" / "*.md")),
       str(REPO / "README.md")]
for f in own:
    if Path(f).exists():
        sources["project doc: " + str(Path(f).relative_to(REPO))] = ("own", Path(f).read_text(encoding="utf-8", errors="ignore"))
for f, grp in [(REPO / "documents/final_capstone/DentaMind_AI_Capstone_Report.docx", "own"),
               (REPO / "documents/123B1B260-Research_Paper_IEEE_Updated.docx", "own"),
               ]:
    if f.exists():
        sources["project doc: " + str(f.relative_to(REPO))] = (grp, "\n".join(docx_paras(f)))
_pdf = REPO / "documents/dentist-research-paper.pdf"     # the earlier version's .docx is no longer on disk; its PDF is
if _pdf.exists():
    import fitz
    sources["earlier version (PDF): documents/dentist-research-paper.pdf"] = (
        "earlier version of this paper", "".join(pg.get_text() for pg in fitz.open(_pdf)))

out = {"prose_words": len(P), "missing_abstracts": missing, "n_sources": len(sources), "results": {}}
for N in (8, 5):
    groups = {}
    per = []
    for name, (grp, text) in sources.items():
        S = toks(text)
        grams = {tuple(S[i:i + N]) for i in range(len(S) - N + 1)}
        cov = [False] * len(P)
        for i in range(len(P) - N + 1):
            if tuple(P[i:i + N]) in grams:
                for j in range(i, i + N):
                    cov[j] = True
        groups.setdefault(grp, [False] * len(P))
        groups[grp] = [a or b for a, b in zip(groups[grp], cov)]
        m = sum(cov)
        if m:
            best, cur, end = 0, 0, 0
            for i, c in enumerate(cov):
                cur = cur + 1 if c else 0
                if cur > best:
                    best, end = cur, i
            per.append({"source": name, "group": grp, "matched_words": m, "pct": round(100 * m / len(P), 2),
                        "longest_run": " ".join(P[end - best + 1:end + 1])[:160]})
    excl_earlier = [any(g[i] for k, g in groups.items() if k != "earlier version of this paper") for i in range(len(P))]
    out["results"][f"N={N}"] = {
        "by_group_pct": {k: round(100 * sum(v) / len(P), 2) for k, v in groups.items()},
        "overall_excluding_earlier_version_pct": round(100 * sum(excl_earlier) / len(P), 2),
        "top_sources": sorted(per, key=lambda r: -r["matched_words"])[:8]}
(V3 / "evidence").mkdir(exist_ok=True)
(V3 / "evidence" / "similarity_v3.json").write_text(json.dumps(out, indent=1), encoding="utf-8")
print(json.dumps({k: v for k, v in out.items() if k != "results"}, indent=1))
for k, r in out["results"].items():
    print(k, r["by_group_pct"], "| overall excl. earlier version:", r["overall_excluding_earlier_version_pct"])
    for t in r["top_sources"][:5]:
        print(f"   {t['pct']:5.2f}%  {t['source'][:70]}  | '{t['longest_run'][:90]}'")

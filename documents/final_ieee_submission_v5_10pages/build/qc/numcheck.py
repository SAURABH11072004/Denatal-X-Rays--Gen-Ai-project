import re, sys, zipfile, collections
def text(path):
    x=zipfile.ZipFile(path).read("word/document.xml").decode("utf8")
    x=re.sub(r"</w:p>","\n",x); x=re.sub(r"<[^>]+>","",x)
    import html; return html.unescape(x)
v4=text("../final_ieee_submission_v4/DentaMind_AI_IEEE_v4.docx"); v5=text(sys.argv[1])
# strip reference lists (numbers in bib entries differ legitimately because refs were removed)
cut=lambda t: t[:t.rfind("References")]
b4,b5=cut(v4),cut(v5)
num=re.compile(r"(?<![\w.])[-−+]?\d[\d,]*(?:\.\d+)?")
n4=collections.Counter(num.findall(b4)); n5=collections.Counter(num.findall(b5))
new=sorted(k for k in n5 if k not in n4)
print("numbers in v5 body not present anywhere in v4 body:", new)
gone=sorted((k for k in n4 if k not in n5), key=lambda s: s)
print("numbers in v4 body absent from v5 body:", gone)
pass

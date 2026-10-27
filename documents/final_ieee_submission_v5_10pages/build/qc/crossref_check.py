# Compare every DOI-bearing reference in the v5 .bib against its Crossref (or DataCite) record.
import re, json, sys, urllib.request, unicodedata
bib=open(sys.argv[1],encoding="utf8").read()
entries=re.findall(r"% \[(\d+)\]\n@(\w+)\{(\w+),\n(.*?)\n\}", bib, re.S)
norm=lambda s: re.sub(r"[^a-z0-9]","", unicodedata.normalize("NFKD", re.sub(r"\[a-z]+|[{}\'\"`~^.]","",s or "")).encode("ascii","ignore").decode().lower())
out=[]
for n,typ,key,body in entries:
    f=dict(re.findall(r"  (\w+) = \{(.*)\}", body))
    doi=f.get("doi")
    if not doi: out.append((n,key,"NO DOI","")); continue
    try:
        req=urllib.request.Request("https://api.crossref.org/works/"+urllib.parse.quote(doi), headers={"User-Agent":"ref-check (mailto:btechgd@gmail.com)"})
        m=json.load(urllib.request.urlopen(req,timeout=30))["message"]; src="crossref"
        title=(m.get("title") or [""])[0]; year=(m.get("issued",{}).get("date-parts") or [[None]])[0][0]
        vol=m.get("volume"); pages=m.get("page") or m.get("article-number"); fam=[a.get("family","") for a in m.get("author",[])]
    except Exception as e:
        try:
            req=urllib.request.Request("https://api.datacite.org/dois/"+doi.lower())
            a=json.load(urllib.request.urlopen(req,timeout=30))["data"]["attributes"]; src="datacite"
            title=a["titles"][0]["title"]; year=a.get("publicationYear"); vol=None; pages=None; fam=[c.get("familyName","") for c in a.get("creators",[])]
        except Exception as e2:
            out.append((n,key,"LOOKUP FAILED",str(e2))); continue
    probs=[]
    if norm(title)[:60]!=norm(f.get("title",""))[:60]: probs.append(f"title: crossref='{title[:70]}'")
    if str(year)!=f.get("year"): probs.append(f"year {year} vs {f.get('year')}")
    if vol and f.get("volume") and str(vol)!=f["volume"]: probs.append(f"volume {vol} vs {f['volume']}")
    if pages and f.get("pages") and norm(str(pages))!=norm(f["pages"]) : probs.append(f"pages {pages} vs {f['pages']}")
    first=norm(f.get("author","").split(" and ")[0].split(",")[0])
    if fam and first and norm(fam[0])!=first: probs.append(f"first author {fam[0]} vs {first}")
    if fam and "others" not in f.get("author","") and len(fam)!=len(f.get("author","").split(" and ")): probs.append(f"author count {len(fam)} vs {len(f['author'].split(' and '))}")
    out.append((n,key,src,"; ".join(probs) or "OK"))
for r in out: print(f"[{r[0]:>2}] {r[1]:<14} {r[2]:<9} {r[3]}")

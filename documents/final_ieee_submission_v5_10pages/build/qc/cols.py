import sys, pymupdf
d=pymupdf.open(sys.argv[1]); pages=[int(x) for x in sys.argv[2].split(",")]
for n in pages:
    p=d[n-1]; mid=p.rect.width/2
    for side in (0,1):
        bl=[b for b in p.get_text("blocks") if (b[0]>mid-5)==bool(side) and b[4].strip() and b[1]<740]
        bl.sort(key=lambda b:b[1])
        print(f"p{n}{'LR'[side]}:")
        for b in bl:
            t=b[4].strip().replace("\n"," ")
            print(f"   {b[1]:4.0f}-{b[3]:4.0f} {t[:75].encode('ascii','replace').decode()}")

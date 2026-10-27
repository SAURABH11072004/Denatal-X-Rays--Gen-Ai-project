"""One-off patch: adapts build_paper_schematic.js to the schematic-only figures (no photographs or screenshots)."""
import re
from pathlib import Path

P = Path(__file__).with_name("build_paper_schematic.js")
s = P.read_text(encoding="utf8")


def sub_line(prefix, new_line):
    """Replace the whole source line that starts (after indentation) with prefix."""
    global s
    pat = re.compile(r"^(\s*)" + re.escape(prefix) + r".*$", re.M)
    m = pat.findall(s)
    assert len(m) == 1, (prefix, len(m))
    s = pat.sub(lambda mm: mm.group(1) + new_line, s, count=1)


s = s.replace('fs.readFileSync(path.join(FIG, file + ".png"))', 'fs.readFileSync(path.join(FIG, "preview_png", file + ".png"))')
s = s.replace('fs.readFileSync(path.join(FIG, file + ".svg"))', 'fs.readFileSync(path.join(FIG, "embed_svg", file + ".svg"))')

sub_line('FIGURE("flow", "fig2_workflow",',
         'FIGURE("flow", "fig2_workflow", "End-to-end processing workflow: the ten implemented pipeline steps in execution order, the two outputs, and (dashed) the behavior when a step is unavailable or fails."),')
sub_line('FIGURE("num", "fig3_detection_numbering_segmentation",',
         'FIGURE("num", "fig3_detection_numbering_segmentation", "(a) How detector boxes, the numbering model and the segmentation model are combined into a region record. (b) FDI two-digit tooth notation (ISO 3950) used for the 32 numbering classes, drawn as the teeth appear on a panoramic radiograph: the patient\\u2019s right is on the image left, and molars are drawn wider."),')
sub_line('FIGURE("cls", "fig4_classification",',
         'FIGURE("cls", "fig4_classification", "Finding-classification workflow: tooth box, crop with 10 % padding, resize to 224 \\u00d7 224, ImageNet normalization, ResNet-50 and a four-class softmax. Each class box gives its training-crop count and class weight from the checkpoint sidecar; the dashed note states that there is no healthy class."),')
sub_line('FIGURE("splits", "fig6_dataset_splits",',
         'FIGURE("splits", "fig6_dataset_splits", "Dataset splitting and integrity protocol: pixel-hash grouping, seeded split into four splits, duplicate and leakage checks, and the gated test evaluation. Film counts are distinct labeled radiographs; the dashed note states what cannot be checked."),')
sub_line('FIGURE("eval", "fig7_evaluation_framework",',
         'FIGURE("eval", "fig7_evaluation_framework", "Experimental evaluation framework: each task or study, its metrics and the splits on which it was evaluated. Classification on ground-truth crops and end-to-end evaluation on detector crops are listed separately."),')

old = " Fig. {F:num}b shows the same radiograph re-analyzed with the deployed checkpoints, which reproduce the 32 regions, 27 numbers and 30 masks exactly."
assert s.count(old) == 1
s = s.replace(old, "")
old = ("released under the CC BY-NC-SA 4.0 license {c:hamamciArxiv}; the radiograph content in Figs. \" + F(\"num\") + \"b and \" + "
       "F(\"cls\") + \" is reproduced from DENTEX with attribution for non-commercial academic use.\"),")
assert s.count(old) == 1, "ethics"
s = s.replace(old, "released under the CC BY-NC-SA 4.0 license {c:hamamciArxiv}, and its terms apply to any reuse. All figures are schematic diagrams; no radiograph is reproduced.\"),")
s = s.replace("genuine-image figures (IEEE two-column, US Letter).", "schematic block-diagram figures (IEEE two-column, US Letter).")
P.write_text(s, encoding="utf8")
assert "embed_svg" in s and "re-analyzed" not in s and "Genuine output" not in s and "genuine ground-truth" not in s
print("paper generator patched")

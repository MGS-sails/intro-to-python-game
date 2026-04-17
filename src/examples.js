/* ═══════════════════════════════════════════════════
   PyLab — Module Examples (one runnable snippet per module)
   Context: Python for Life Scientists who already know R
   Runtime: Pyodide (browser WASM) — stdlib + numpy + pandas only
   ═══════════════════════════════════════════════════ */

module.exports = [

  // ──────────────────────────────────────────────────
  // Module 1 — Orientation
  // ──────────────────────────────────────────────────
  {
    id: 1,
    icon: '🧬',
    title: 'Module 1 — Orientation',
    subtitle: 'Why Python for life scientists?',
    description: `## Why Python?

If you already know R, you have a real advantage. Python covers similar scientific ground with a slightly different philosophy:

| R concept | Python equivalent |
|---|---|
| \`dplyr\` | \`pandas\` |
| \`Bioconductor\` | \`Biopython\` |
| \`ggplot2\` | \`matplotlib / seaborn\` |
| \`limma / DESeq2\` | \`pydeseq2 / statsmodels\` |
| \`data.frame\` | \`pd.DataFrame\` |
| \`list\` (named) | \`dict\` |
| \`vector\` | \`np.ndarray\` |

The snippet below shows a classic R → Python translation: **filtering a gene expression table** using just the Python standard library. When you reach Module 5, you will do the same thing with pandas in two lines.`,
    code: `# ── Module 1: Orientation ──────────────────────────────────────────────────
# Goal: see that Python can do everything R can — often with similar syntax.
# We reproduce a simple dplyr pipeline using only Python stdlib.

# ── R equivalent ──────────────────────────────────────────────────────────
# library(dplyr)
# gene_data <- data.frame(
#   gene    = c("BRCA1","TP53","MYC","GAPDH","EGFR"),
#   log2fc  = c(2.3, -1.8, 3.1, 0.1, -2.5),
#   padj    = c(0.001, 0.023, 0.0004, 0.87, 0.015)
# )
# sig <- gene_data %>% filter(abs(log2fc) > 1, padj < 0.05) %>%
#          arrange(desc(abs(log2fc)))

# ── Python (stdlib only) ───────────────────────────────────────────────────
genes = [
    {"gene": "BRCA1", "log2fc":  2.3,  "padj": 0.001},
    {"gene": "TP53",  "log2fc": -1.8,  "padj": 0.023},
    {"gene": "MYC",   "log2fc":  3.1,  "padj": 0.0004},
    {"gene": "GAPDH", "log2fc":  0.1,  "padj": 0.87},
    {"gene": "EGFR",  "log2fc": -2.5,  "padj": 0.015},
]

# filter(abs(log2fc) > 1, padj < 0.05)  →  list comprehension
sig = [g for g in genes if abs(g["log2fc"]) > 1 and g["padj"] < 0.05]

# arrange(desc(abs(log2fc)))  →  sorted(..., key=..., reverse=True)
sig = sorted(sig, key=lambda g: abs(g["log2fc"]), reverse=True)

# ── Print results ───────────────────────────────────────────────────────────
print("Significant DEGs (|log2FC| > 1, padj < 0.05)")
print(f"{'Gene':<8} {'log2FC':>8} {'padj':>10}")
print("-" * 30)
for g in sig:
    direction = "↑" if g["log2fc"] > 0 else "↓"
    print(f"{g['gene']:<8} {g['log2fc']:>+8.2f} {g['padj']:>10.4f}  {direction}")

print(f"\\n{len(sig)} of {len(genes)} genes pass the filter.")
print("\\nKey insight: Python lists are NOT vectorised.")
print("abs(log2fc) on a plain list would fail — that's why we use pandas/numpy later.")
`
  },

  // ──────────────────────────────────────────────────
  // Module 2 — Fundamentals
  // ──────────────────────────────────────────────────
  {
    id: 2,
    icon: '🔬',
    title: 'Module 2 — Fundamentals',
    subtitle: 'Types, indexing, None vs NA, string I/O',
    description: `## Python Fundamentals for R Users

Three classic traps when coming from R:

1. **0-based indexing** — \`x[0]\` is the first element, \`x[1]\` is the second
2. **\`None\` is not \`NA\`** — \`None\` propagates differently; arithmetic on \`None\` raises \`TypeError\`
3. **Types are strict** — \`"2" + 2\` is a \`TypeError\`, not silent coercion

The snippet walks through all of these with biological examples.`,
    code: `# ── Module 2: Fundamentals ─────────────────────────────────────────────────

# ── 1. Basic types ─────────────────────────────────────────────────────────
# R: numeric / character / logical / NA
# Python: int / float / str / bool / None

read_count  = 42_150      # int   (underscores allowed for readability)
expression  = 3.14159     # float
gene_name   = "BRCA1"     # str
is_coding   = True        # bool  (capitalised, unlike R's TRUE)
missing_val = None        # None  (R's NA equivalent — but NOT the same!)

print("=== Types ===")
print(f"read_count : {read_count!r:>12}  type={type(read_count).__name__}")
print(f"expression : {expression!r:>12}  type={type(expression).__name__}")
print(f"gene_name  : {gene_name!r:>12}  type={type(gene_name).__name__}")
print(f"is_coding  : {is_coding!r:>12}  type={type(is_coding).__name__}")
print(f"missing_val: {missing_val!r:>12}  type={type(missing_val).__name__}")

# ── 2. 0-based indexing ────────────────────────────────────────────────────
# R: exons[1] is the FIRST element
# Python: exons[0] is the FIRST element
print("\\n=== 0-based indexing ===")
exons = ["exon1", "exon2", "exon3", "exon4", "exon5"]
print(f"exons[0]  = {exons[0]!r}   # first  (R: exons[1])")
print(f"exons[-1] = {exons[-1]!r}  # last   (R: exons[length(exons)])")
print(f"exons[1:3]= {exons[1:3]}   # slice  (R: exons[2:3])")

# ── 3. None vs NA ──────────────────────────────────────────────────────────
# R: NA propagates silently in arithmetic → 3 + NA == NA
# Python: None raises TypeError immediately
print("\\n=== None vs NA ===")
counts = [120, None, 340, None, 89]
# R: sum(counts, na.rm=TRUE)  →  Python: must handle None explicitly
valid = [c for c in counts if c is not None]    # is not None, not != None
print(f"counts       : {counts}")
print(f"valid counts : {valid}")
print(f"sum (na.rm)  : {sum(valid)}")

# ── 4. String formatting ────────────────────────────────────────────────────
# R: sprintf("Gene %s: %.2f TPM", gene, tpm)
# Python: f-string (preferred since Python 3.6)
print("\\n=== String formatting ===")
for gene, tpm in [("ACTB", 1203.4), ("GAPDH", 987.1), ("MYC", 45.2)]:
    bar = "█" * int(tpm / 100)
    print(f"  {gene:<6} {tpm:>8.1f} TPM  {bar}")

print("\\nDone — no silent type coercion, 0-based indexing, None ≠ NA.")
`
  },

  // ──────────────────────────────────────────────────
  // Module 3 — Data Structures
  // ──────────────────────────────────────────────────
  {
    id: 3,
    icon: '🧪',
    title: 'Module 3 — Data Structures',
    subtitle: 'Lists, dicts, sets, tuples — with bio data',
    description: `## Python Data Structures

Coming from R, the key mental shift is:

- **Python lists** — ordered, mutable, *not vectorised* (no \`log2(my_list)\`)
- **dicts** — R's named lists, but faster and more explicit
- **sets** — native set algebra (\`&\`, \`|\`, \`-\`) replacing \`intersect()\`, \`union()\`, \`setdiff()\`
- **tuples** — immutable pairs/triples; great for unpacking

All examples use gene sets and sample metadata to keep the context biological.`,
    code: `# ── Module 3: Data Structures ──────────────────────────────────────────────

# ── Lists: ordered, mutable, NOT vectorised ────────────────────────────────
# R: c("BRCA1","TP53","MYC")  →  works like a vector
# Python list: a container, not a vector — no element-wise math
print("=== Lists ===")
oncogenes   = ["MYC", "RAS", "EGFR", "HER2", "BCL2"]
suppressors = ["TP53", "BRCA1", "RB1", "PTEN", "APC"]

oncogenes.append("CDK4")          # R: c(oncogenes, "CDK4")
oncogenes.insert(0, "FOS")        # R: c("FOS", oncogenes)
removed = oncogenes.pop()         # R: oncogenes[-length(oncogenes)]
print(f"oncogenes : {oncogenes}")
print(f"removed   : {removed!r}")
print(f"length    : {len(oncogenes)}  (R: length(oncogenes))")

# ── Dicts: named containers ────────────────────────────────────────────────
# R: list(gene="BRCA1", chrom="17", strand="-")
# Python: dict — keys must be unique, insertion order preserved (3.7+)
print("\\n=== Dicts ===")
sample = {
    "id":       "TCGA-AO-A12D",
    "tissue":   "breast",
    "stage":    "III",
    "age":      54,
    "er_status": True,
}
print(f"Sample ID   : {sample['id']}")
print(f"Stage       : {sample.get('stage', 'unknown')}")   # safe get with default
sample["her2"] = False                                       # add key
print(f"Keys        : {list(sample.keys())}")

# ── Sets: native set algebra ───────────────────────────────────────────────
# R: intersect(a, b) / union(a, b) / setdiff(a, b)
# Python: & / | / -   (operators, cleaner for chaining)
print("\\n=== Sets ===")
rnaseq_hits  = {"BRCA1", "TP53", "MYC", "CDH1", "PIK3CA"}
chip_hits    = {"BRCA1", "EGFR", "CDH1", "PTEN",  "AKT1"}

overlap  = rnaseq_hits & chip_hits          # intersect()
combined = rnaseq_hits | chip_hits          # union()
rna_only = rnaseq_hits - chip_hits          # setdiff()

print(f"RNA-seq hits : {sorted(rnaseq_hits)}")
print(f"ChIP hits    : {sorted(chip_hits)}")
print(f"Overlap      : {sorted(overlap)}")
print(f"RNA-seq only : {sorted(rna_only)}")
print(f"Total unique : {len(combined)}")

# ── Tuples: immutable, great for unpacking ─────────────────────────────────
# R: no direct equivalent — closest is a fixed-length list
print("\\n=== Tuples & Unpacking ===")
locus = ("BRCA1", "chr17", 43_044_294, 43_125_483, "-")
gene, chrom, start, end, strand = locus    # destructuring (R has no clean syntax)
length_kb = (end - start) / 1000
print(f"Gene   : {gene}  ({chrom}{strand})")
print(f"Region : {start:,} – {end:,}  ({length_kb:.1f} kb)")

# pairs from zip() return tuples
pairs = list(zip(["sample1","sample2","sample3"], [12.3, 8.7, 15.1]))
for sid, tpm in pairs:                     # R: mapply / Map
    print(f"  {sid}: {tpm:.1f} TPM")
`
  },

  // ──────────────────────────────────────────────────
  // Module 4 — Control Flow & Functions
  // ──────────────────────────────────────────────────
  {
    id: 4,
    icon: '⚙️',
    title: 'Module 4 — Control Flow & Functions',
    subtitle: 'if/elif, for+enumerate, comprehensions, default args',
    description: `## Control Flow & Functions

Key translations from R:

- \`if / elif / else\` — same logic, no braces, use indentation
- \`for x in collection\` — replaces most \`for (x in ...)\` loops
- \`enumerate()\` — gives index+value (replaces \`seq_along\`)
- **List comprehensions** — the idiomatic \`sapply\` / \`lapply\` replacement
- **Functions** with default arguments and explicit \`return\`

The snippet processes a mini RNA-seq result table to show each concept.`,
    code: `# ── Module 4: Control Flow & Functions ─────────────────────────────────────

# ── if / elif / else ───────────────────────────────────────────────────────
# R: if (...) ... else if (...) ... else ...
# Python: elif (one word), colon, indentation — no braces
def classify_expression(log2fc, padj, fc_thresh=1.0, p_thresh=0.05):
    """Classify a gene as UP, DOWN, or NS (not significant).

    Parameters
    ----------
    log2fc    : log2 fold-change
    padj      : adjusted p-value
    fc_thresh : |log2FC| cutoff  (default 1.0)
    p_thresh  : padj cutoff      (default 0.05)
    """
    # R: case_when(padj < p_thresh & log2fc > fc_thresh ~ "UP", ...)
    if padj >= p_thresh:
        return "NS"
    elif log2fc >= fc_thresh:
        return "UP"
    elif log2fc <= -fc_thresh:
        return "DOWN"
    else:
        return "NS"

# ── for + enumerate ────────────────────────────────────────────────────────
# R: for (i in seq_along(genes)) { cat(i, genes[i], "\n") }
# Python: for i, gene in enumerate(genes, start=1):
print("=== enumerate (seq_along equivalent) ===")
genes = ["BRCA1", "TP53", "MYC", "GAPDH", "EGFR", "CDH1"]
for rank, gene in enumerate(genes, start=1):
    print(f"  {rank}. {gene}")

# ── List comprehensions (sapply / vapply equivalent) ───────────────────────
# R: sapply(genes, nchar)
# Python: [len(g) for g in genes]
print("\\n=== List comprehension (sapply equivalent) ===")
name_lengths = [len(g) for g in genes]
print(f"genes       : {genes}")
print(f"name lengths: {name_lengths}")

# conditional comprehension — R: ifelse(condition, yes, no)
labels = ["short" if n <= 4 else "long" for n in name_lengths]
print(f"labels      : {labels}")

# ── Functions: default args and explicit return ────────────────────────────
# R: my_fn <- function(x, threshold = 0.05) { ... }
# Python: def my_fn(x, threshold=0.05): ...  (no assignment arrow)
print("\\n=== Function with defaults + classify ===")
results = [
    ("BRCA1",  2.3,  0.001),
    ("TP53",  -1.8,  0.023),
    ("MYC",    3.1,  0.0004),
    ("GAPDH",  0.1,  0.87),
    ("EGFR",  -2.5,  0.015),
    ("CDH1",   0.8,  0.03),
]

print(f"{'Gene':<8} {'log2FC':>7} {'padj':>8}  Class")
print("-" * 38)
for gene, lfc, pval in results:
    cls = classify_expression(lfc, pval)          # uses default thresholds
    tag = {"UP": "↑", "DOWN": "↓", "NS": "–"}[cls]
    print(f"{gene:<8} {lfc:>+7.2f} {pval:>8.4f}  {tag} {cls}")

# summary using Counter-style dict comprehension
from collections import Counter
counts = Counter(classify_expression(l, p) for _, l, p in results)
print(f"\\nSummary: {dict(counts)}")
`
  },

  // ──────────────────────────────────────────────────
  // Module 5 — Pandas
  // ──────────────────────────────────────────────────
  {
    id: 5,
    icon: '🐼',
    title: 'Module 5 — Pandas',
    subtitle: 'DataFrames, filtering, .apply(), .groupby()',
    description: `## Pandas — Your dplyr in Python

The table below is the essential R → pandas translation:

| dplyr | pandas |
|---|---|
| \`data.frame()\` | \`pd.DataFrame()\` |
| \`filter()\` | \`df[bool_mask]\` |
| \`mutate()\` | \`df.assign()\` or direct column assignment |
| \`select()\` | \`df[['col1','col2']]\` |
| \`group_by() %>% summarise()\` | \`df.groupby().agg()\` |
| \`arrange(desc(x))\` | \`df.sort_values('x', ascending=False)\` |

Boolean filtering uses \`&\` and \`|\` (not \`&&\`/\`||\`) and conditions must be wrapped in parentheses.`,
    code: `# ── Module 5: Pandas ───────────────────────────────────────────────────────
import pandas as pd

# ── Create a DataFrame ─────────────────────────────────────────────────────
# R: data.frame(gene=c(...), log2fc=c(...), ...)
data = {
    "gene":    ["BRCA1","TP53","MYC","GAPDH","EGFR","CDH1","PIK3CA","PTEN"],
    "log2fc":  [  2.3,  -1.8,  3.1,   0.1,  -2.5,   1.2,    1.9,   -1.1],
    "padj":    [0.001, 0.023, 4e-4,  0.87, 0.015,  0.041,  0.003,  0.018],
    "basemean":[1200,   890,   450,  8500,   320,    780,    560,    430],
    "pathway": ["DDR","DDR","Prolif","HK","RTK","Adh","PI3K","PI3K"],
}
df = pd.DataFrame(data)
print("=== Full DataFrame ===")
print(df.to_string(index=False))

# ── Boolean filtering ──────────────────────────────────────────────────────
# R: filter(df, abs(log2fc) > 1, padj < 0.05)
# Python: df[(condition1) & (condition2)]   ← parentheses are REQUIRED
print("\\n=== filter: |log2FC| > 1 and padj < 0.05 ===")
sig = df[(df["log2fc"].abs() > 1) & (df["padj"] < 0.05)]
print(sig[["gene","log2fc","padj"]].to_string(index=False))

# ── mutate: add columns ────────────────────────────────────────────────────
# R: mutate(df, neg_log10p = -log10(padj), direction = ifelse(log2fc>0,"UP","DOWN"))
# Python: direct column assignment (or .assign() for chaining)
df["-log10(padj)"] = df["padj"].apply(lambda p: -__import__("math").log10(p))
df["direction"]    = df["log2fc"].apply(lambda x: "UP" if x > 0 else "DOWN")
print("\\n=== mutate: -log10(padj) and direction ===")
print(df[["gene","log2fc","-log10(padj)","direction"]].to_string(index=False))

# ── groupby + agg ──────────────────────────────────────────────────────────
# R: df %>% group_by(pathway) %>% summarise(n=n(), mean_lfc=mean(log2fc), ...)
# Python: df.groupby("pathway").agg(...)
print("\\n=== group_by + summarise (by pathway) ===")
summary = (
    df.groupby("pathway")
    .agg(
        n         =("gene",    "count"),
        mean_lfc  =("log2fc",  "mean"),
        min_padj  =("padj",    "min"),
    )
    .round(3)
    .sort_values("mean_lfc", ascending=False)
)
print(summary.to_string())

# ── arrange + select ───────────────────────────────────────────────────────
# R: arrange(desc(abs(log2fc))) %>% select(gene, log2fc, padj)
print("\\n=== arrange(desc(abs(log2fc))) ===")
top = (df.assign(abs_lfc=df["log2fc"].abs())
         .sort_values("abs_lfc", ascending=False)
         [["gene","log2fc","padj"]]
         .head(4))
print(top.to_string(index=False))
`
  },

  // ──────────────────────────────────────────────────
  // Module 6 — NumPy
  // ──────────────────────────────────────────────────
  {
    id: 6,
    icon: '🔢',
    title: 'Module 6 — NumPy',
    subtitle: 'Vectorised arrays, random seeds, 2D matrices',
    description: `## NumPy — Vectorised Computing

This is where Python *finally* gets R-style vectorised operations. NumPy arrays behave like R vectors:

- \`np.log2(arr)\` works element-wise — plain Python lists do NOT
- \`np.random.default_rng(42)\` replaces \`set.seed(42)\`
- 2D arrays are matrices; \`axis=0\` means "across rows" (like \`colMeans\`)

Key difference: NumPy arrays are **homogeneous** (all same type). For mixed-type tabular data, use pandas DataFrames (which are backed by NumPy internally).`,
    code: `# ── Module 6: NumPy ────────────────────────────────────────────────────────
import numpy as np

# ── 1. Arrays ARE vectorised (unlike plain lists) ──────────────────────────
# R: counts <- c(120, 450, 89, 1203, 34)
#    log2(counts + 1)   # works directly
counts = np.array([120, 450, 89, 1203, 34], dtype=float)

# Plain list would fail: log2([120, 450, ...]) → TypeError
# NumPy: element-wise, just like R
log2_counts = np.log2(counts + 1)   # +1 avoids log(0)
print("=== Vectorised ops ===")
print(f"raw counts : {counts}")
print(f"log2(c+1)  : {np.round(log2_counts, 2)}")
print(f"mean       : {np.mean(log2_counts):.3f}   (R: mean(log2_counts))")
print(f"std        : {np.std(log2_counts, ddof=1):.3f}  (R: sd(log2_counts))")

# ── 2. Reproducible random numbers ────────────────────────────────────────
# R: set.seed(42); rnorm(5, mean=8, sd=1.5)
# Python: rng = np.random.default_rng(42); rng.normal(8, 1.5, 5)
print("\\n=== Reproducible random (set.seed equivalent) ===")
rng = np.random.default_rng(42)
ctrl  = rng.normal(loc=8.0, scale=1.2, size=6)   # control expression
treat = rng.normal(loc=9.8, scale=1.4, size=6)   # treatment expression
print(f"control   : {np.round(ctrl,  2)}")
print(f"treatment : {np.round(treat, 2)}")
print(f"fold-change (mean ratio): {np.mean(treat)/np.mean(ctrl):.3f}x")

# ── 3. Boolean indexing ───────────────────────────────────────────────────
# R: counts[counts > 200]
print("\\n=== Boolean indexing ===")
mask = counts > 200
print(f"counts > 200 mask : {mask}")
print(f"filtered values   : {counts[mask]}")          # R: counts[mask]
print(f"n above threshold : {np.sum(mask)}")           # R: sum(mask)

# ── 4. 2D arrays (matrices) ───────────────────────────────────────────────
# R: matrix(data, nrow=3, ncol=4)
#    colMeans(m)  /  rowMeans(m)
print("\\n=== 2D array (expression matrix) ===")
genes   = ["BRCA1", "TP53", "MYC"]
samples = ["S1", "S2", "S3", "S4"]
rng2    = np.random.default_rng(7)
expr    = rng2.lognormal(mean=5.0, sigma=1.2, size=(3, 4)).round(1)

print(f"{'Gene':<8}", "  ".join(f"{s:>6}" for s in samples))
for g, row in zip(genes, expr):
    print(f"{g:<8}", "  ".join(f"{v:>6.1f}" for v in row))

col_means = np.mean(expr, axis=0)   # R: colMeans(expr)
row_means = np.mean(expr, axis=1)   # R: rowMeans(expr)
print(f"\\ncolMeans : {np.round(col_means, 1)}")
print(f"rowMeans : {np.round(row_means, 1)}")

# ── 5. Broadcasting ───────────────────────────────────────────────────────
# Normalise each gene (row) to zero mean, unit variance
# R: t(scale(t(expr)))
z = (expr - expr.mean(axis=1, keepdims=True)) / expr.std(axis=1, keepdims=True, ddof=1)
print("\\n=== Z-scored expression (broadcasting) ===")
for g, row in zip(genes, z.round(2)):
    print(f"{g:<8} {row}")
`
  },

  // ──────────────────────────────────────────────────
  // Module 7 — Visualisation
  // ──────────────────────────────────────────────────
  {
    id: 7,
    icon: '📊',
    title: 'Module 7 — Visualisation',
    subtitle: 'Volcano plot data + text table (matplotlib in comments)',
    description: `## Visualisation

Plots cannot render to stdout in Pyodide, but we can **prepare and inspect the data** that would feed a volcano plot, then show the matplotlib/seaborn code as comments.

This module focuses on:
- Computing volcano plot coordinates (\`-log10(padj)\` vs \`log2FC\`)
- Assigning colour categories (UP / DOWN / NS)
- Pretty-printing a formatted text table with Unicode indicators

In a real notebook you would then pass the same DataFrame straight to \`matplotlib.pyplot\` or \`seaborn.scatterplot\`.`,
    code: `# ── Module 7: Visualisation ────────────────────────────────────────────────
# Plots can't render here, so we prepare volcano-plot data and
# display it as a formatted text table with directional indicators.

import math

# ── What the matplotlib code would look like ──────────────────────────────
# import matplotlib.pyplot as plt
# import seaborn as sns
#
# fig, ax = plt.subplots(figsize=(8, 6))
# colors = df["color"].map({"UP":"#e74c3c","DOWN":"#3498db","NS":"#95a5a6"})
# ax.scatter(df["log2fc"], df["-log10padj"], c=colors, alpha=0.7, s=40)
# ax.axhline(-math.log10(0.05), ls="--", color="grey")
# ax.axvline( 1, ls="--", color="grey")
# ax.axvline(-1, ls="--", color="grey")
# ax.set_xlabel("log2 Fold-Change"); ax.set_ylabel("-log10(padj)")
# ax.set_title("Volcano Plot — Treatment vs Control")
# for _, row in labeled.iterrows():
#     ax.annotate(row.gene, (row.log2fc, row["-log10padj"]))
# plt.tight_layout(); plt.show()

# ── ggplot2 equivalent (R) ─────────────────────────────────────────────────
# ggplot(df, aes(log2fc, -log10(padj), color=class)) +
#   geom_point(alpha=0.7) +
#   geom_hline(yintercept=-log10(0.05), linetype="dashed") +
#   geom_vline(xintercept=c(-1,1), linetype="dashed") +
#   scale_color_manual(values=c(UP="red",DOWN="blue",NS="grey")) +
#   theme_bw()

# ── Prepare volcano data ──────────────────────────────────────────────────
raw = [
    ("BRCA1",   2.30,  0.0010), ("TP53",   -1.80,  0.0230),
    ("MYC",     3.10,  0.0004), ("GAPDH",   0.10,  0.8700),
    ("EGFR",   -2.50,  0.0150), ("CDH1",    1.20,  0.0410),
    ("PIK3CA",  1.90,  0.0030), ("PTEN",   -1.10,  0.0180),
    ("AKT1",    0.60,  0.1200), ("BCL2",    2.80,  0.0007),
    ("RB1",    -0.30,  0.5500), ("CCND1",   1.50,  0.0250),
    ("MDM2",    0.80,  0.0900), ("VEGFA",   2.10,  0.0020),
    ("HIF1A",   1.70,  0.0110),
]

def classify(lfc, p):
    if p >= 0.05:
        return "NS"
    return "UP" if lfc > 1 else ("DOWN" if lfc < -1 else "NS")

volcano = [
    {
        "gene":     gene,
        "log2fc":   lfc,
        "padj":     padj,
        "nlp":      -math.log10(padj),   # y-axis
        "class":    classify(lfc, padj),
    }
    for gene, lfc, padj in raw
]

# ── Print as formatted table ──────────────────────────────────────────────
icons = {"UP": "▲ UP  ", "DOWN": "▼ DOWN", "NS": "● NS  "}
print(f"{'Gene':<9} {'log2FC':>7}  {'-log10(padj)':>13}  {'Class'}")
print("─" * 42)
for r in sorted(volcano, key=lambda x: -x["nlp"]):
    print(f"{r['gene']:<9} {r['log2fc']:>+7.2f}  {r['nlp']:>13.2f}  {icons[r['class']]}")

ups   = sum(1 for r in volcano if r["class"] == "UP")
downs = sum(1 for r in volcano if r["class"] == "DOWN")
ns    = sum(1 for r in volcano if r["class"] == "NS")
print(f"\\nTotals: ▲ UP={ups}  ▼ DOWN={downs}  ● NS={ns}")
print("In a notebook, pass this data to matplotlib or seaborn to render the plot.")
`
  },

  // ──────────────────────────────────────────────────
  // Module 8 — Statistics & Bioinformatics
  // ──────────────────────────────────────────────────
  {
    id: 8,
    icon: '📐',
    title: 'Module 8 — Statistics & Bioinformatics',
    subtitle: "Welch's t-test from scratch, GC content, reverse complement, Kozak regex",
    description: `## Statistics & Bioinformatics

Python's \`statistics\` module covers basic descriptive stats. For tests, scipy is the standard library — but since it isn't pre-loaded here, we implement **Welch's t-test from scratch** using only \`math\` and \`statistics\`, which is a great exercise in understanding the formula.

Sequence analysis uses plain string operations and \`re\` (regex), showing:
- GC content calculation
- Reverse complement
- Kozak consensus motif scanning with regex
`,
    code: `# ── Module 8: Statistics & Bioinformatics ──────────────────────────────────
import math, statistics, re

# ── What scipy would look like (not available here) ───────────────────────
# from scipy.stats import ttest_ind
# stat, pval = ttest_ind(ctrl, treat, equal_var=False)  # Welch's t-test

# ── Welch's t-test from scratch ────────────────────────────────────────────
# R: t.test(ctrl, treat, var.equal=FALSE)
def welch_t_test(a, b):
    """Two-sample Welch's t-test; returns (t_stat, p_approx, df)."""
    na, nb   = len(a), len(b)
    ma, mb   = statistics.mean(a), statistics.mean(b)
    va, vb   = statistics.variance(a), statistics.variance(b)
    se       = math.sqrt(va/na + vb/nb)
    t        = (ma - mb) / se
    # Welch–Satterthwaite degrees of freedom
    df_num   = (va/na + vb/nb)**2
    df_den   = (va/na)**2/(na-1) + (vb/nb)**2/(nb-1)
    df       = df_num / df_den
    # Approximation: |t| > 2 → p < 0.05 for df > ~30 (demo only!)
    p_approx = "< 0.05" if abs(t) > 2.0 else ">= 0.05"
    return t, p_approx, df

ctrl  = [6.2, 7.1, 5.9, 6.8, 7.3, 6.0]
treat = [9.1, 8.7, 9.8, 10.2, 8.5, 9.4]
t, p_approx, df = welch_t_test(ctrl, treat)
print("=== Welch's t-test (BRCA1 expression: ctrl vs treat) ===")
print(f"  ctrl mean  : {statistics.mean(ctrl):.2f}  sd={statistics.stdev(ctrl):.2f}")
print(f"  treat mean : {statistics.mean(treat):.2f}  sd={statistics.stdev(treat):.2f}")
print(f"  t-statistic: {t:.3f}")
print(f"  df (approx): {df:.1f}")
print(f"  p-value    : {p_approx}  (use scipy.stats.ttest_ind for exact value)")

# ── GC content ─────────────────────────────────────────────────────────────
# R: library(Biostrings); letterFrequency(seq, "GC") / width(seq)
def gc_content(seq):
    """Return GC fraction of a DNA sequence (case-insensitive)."""
    seq = seq.upper()
    return (seq.count("G") + seq.count("C")) / len(seq)

print("\\n=== GC Content ===")
sequences = {
    "BRCA1 exon11": "ATGCGATCGATCGTAGCTAGCTAGCGATCGATCGTAGCTAGCTAGCGATCG",
    "TP53 promoter": "GCGCGCGCATATATAGCGCGCATGCATGCATGCGCGCGCGCGCGCGC",
    "AT-rich region": "ATATATAT AAATTTAAAT ATATAT".replace(" ",""),
}
for name, seq in sequences.items():
    gc = gc_content(seq)
    bar = "█" * int(gc * 20)
    print(f"  {name:<20} GC={gc:.1%}  |{bar:<20}|")

# ── Reverse complement ─────────────────────────────────────────────────────
# R: reverseComplement(DNAString("ATGCATGC"))
def reverse_complement(seq):
    """Return the reverse complement of a DNA string."""
    comp = str.maketrans("ACGT", "TGCA")
    return seq.upper().translate(comp)[::-1]

print("\\n=== Reverse Complement ===")
for seq in ["ATGCATGC", "GAATTC", "AAGCTT"]:
    rc = reverse_complement(seq)
    print(f"  5'-{seq}-3'  →  5'-{rc}-3'")

# ── Kozak consensus (regex) ────────────────────────────────────────────────
# R: matchPattern("RCCATGG", dna, fixed=FALSE) — IUPAC codes
# Python: re.finditer with expanded pattern
KOZAK = re.compile(r"[AG]CC(ATG)G")   # simplified Kozak (R=purine)
print("\\n=== Kozak site scanning ===")
mrna = ("GCGCAGCCATGGCGAAGTCGATCGATCGTAGCTAGCGATCG"
        "GCTAGCATGCGCATCGATCGATCGATCGATCGATCGCATG"
        "GCCATGGTCGATCGTAGCTAGCGATCGATCGATCGATCG")
for m in KOZAK.finditer(mrna):
    print(f"  pos {m.start():>3}: {mrna[m.start()-2:m.end()+3]}  (ATG at {m.start()+3})")
`
  },

  // ──────────────────────────────────────────────────
  // Module 9 — Files & External Data
  // ──────────────────────────────────────────────────
  {
    id: 9,
    icon: '📂',
    title: 'Module 9 — Files & External Data',
    subtitle: 'pathlib, json, csv.DictReader, requests pattern',
    description: `## Files & External Data

Python's file/data ecosystem for bioinformatics:

| Task | Python | R equivalent |
|---|---|---|
| File paths | \`pathlib.Path\` | \`file.path()\` |
| JSON (API) | \`json.loads/dumps\` | \`jsonlite::fromJSON\` |
| CSV | \`csv.DictReader\` | \`read.csv()\` |
| HTTP | \`requests.get\` | \`httr::GET\` |

Since we can't access the filesystem or network in the browser, we demonstrate **pathlib path construction** conceptually, parse an **inline JSON** string mimicking an Ensembl REST response, and read an **inline CSV** using \`io.StringIO\`.`,
    code: `# ── Module 9: Files & External Data ───────────────────────────────────────
import json, csv, io
from pathlib import Path, PurePosixPath

# ── pathlib — conceptual path construction ────────────────────────────────
# R: file.path("data", "rnaseq", "counts.csv")
# Python: Path("data") / "rnaseq" / "counts.csv"
print("=== pathlib.Path ===")
project   = PurePosixPath("/home/user/projects/tcga_breast")
data_dir  = project / "data" / "rnaseq"
counts_f  = data_dir / "raw_counts.csv"
results_f = project / "results" / "deseq2_results.tsv"

print(f"project root : {project}")
print(f"data dir     : {data_dir}")
print(f"counts file  : {counts_f}")
print(f"  stem       : {counts_f.stem}")
print(f"  suffix     : {counts_f.suffix}")
print(f"  parent     : {counts_f.parent}")

# ── JSON — Ensembl-like REST API response ──────────────────────────────────
# R: jsonlite::fromJSON(url)
# Python: json.loads(response.text)   (requests.get shown below)
print("\\n=== JSON parsing (Ensembl-style) ===")

# What the requests call would look like:
# import requests
# url = "https://rest.ensembl.org/lookup/id/ENSG00000012048?content-type=application/json"
# response = requests.get(url, headers={"Content-Type": "application/json"})
# gene_info = response.json()

ensembl_json = '''
{
  "id":           "ENSG00000012048",
  "display_name": "BRCA1",
  "biotype":      "protein_coding",
  "seq_region_name": "17",
  "start":        43044294,
  "end":          43125483,
  "strand":       -1,
  "description":  "BRCA1 DNA repair associated [Source:HGNC Symbol;Acc:HGNC:1100]",
  "transcripts":  [
    {"id": "ENST00000357654", "is_canonical": true,  "length": 81189},
    {"id": "ENST00000493795", "is_canonical": false, "length": 3748}
  ]
}
'''
gene = json.loads(ensembl_json)          # R: jsonlite::fromJSON(ensembl_json)
length_kb = (gene["end"] - gene["start"]) / 1000
print(f"Gene      : {gene['display_name']} ({gene['id']})")
print(f"Location  : chr{gene['seq_region_name']}:{gene['start']:,}-{gene['end']:,}  ({length_kb:.1f} kb)")
print(f"Biotype   : {gene['biotype']}")
canonical = next(t for t in gene["transcripts"] if t["is_canonical"])
print(f"Canonical : {canonical['id']}  ({canonical['length']:,} bp)")

# Round-trip back to JSON
compact = json.dumps({"gene": gene["display_name"], "length_kb": round(length_kb, 1)})
print(f"Re-serialised: {compact}")

# ── CSV — inline parsing with csv.DictReader ──────────────────────────────
# R: read.csv(text=csv_string)
# Python: csv.DictReader(io.StringIO(csv_string))
print("\\n=== CSV parsing (clinical metadata) ===")
csv_text = """sample_id,tissue,stage,er_status,her2_status,age
TCGA-AO-A12D,breast,III,Positive,Negative,54
TCGA-BH-A18V,breast,II,Negative,Positive,47
TCGA-A2-A04P,breast,I,Positive,Negative,62
TCGA-C8-A12Z,breast,IV,Negative,Negative,58
TCGA-A2-A0YM,breast,II,Positive,Positive,43"""

reader = csv.DictReader(io.StringIO(csv_text))
samples = list(reader)                   # R: df <- read.csv(text=csv_text)
print(f"{'Sample':<16} {'Stage':>5} {'ER':>10} {'HER2':>10} {'Age':>4}")
print("-" * 52)
for s in samples:
    print(f"{s['sample_id']:<16} {s['stage']:>5} {s['er_status']:>10} {s['her2_status']:>10} {s['age']:>4}")
print(f"\\n{len(samples)} samples loaded.")
`
  },

  // ──────────────────────────────────────────────────
  // Module 10 — Reproducibility
  // ──────────────────────────────────────────────────
  {
    id: 10,
    icon: '♻️',
    title: 'Module 10 — Reproducibility',
    subtitle: 'Type hints, docstrings, requirements.txt, conda/venv',
    description: `## Reproducibility

The final module covers the practices that make Python bioinformatics code shareable and reproducible:

1. **Type hints** (\`Optional[float]\`, \`List[str]\`) — analogous to R's implicit contracts, but explicit
2. **Docstrings** (NumPy/Google style) — richer than R's \`#' roxygen2\` for scripts
3. **\`requirements.txt\`** — pin exact versions for pip environments
4. **conda / venv** workflow — the Python equivalent of \`renv\`

The snippet defines a fully-typed, well-documented analysis function and prints the environment manifest that would accompany the project.`,
    code: `# ── Module 10: Reproducibility ─────────────────────────────────────────────
from typing import Optional, List, Dict, Tuple
import math, statistics

# ── Type-annotated, documented function ───────────────────────────────────
# R equivalent (roxygen2):
# #' Summarise a numeric expression vector
# #' @param values  numeric vector of expression values
# #' @param name    gene symbol
# #' @param log2_transform  logical, apply log2(x+1)?
# #' @return  named list with summary statistics

def summarise_expression(
    values: List[float],
    name: str = "unknown",
    log2_transform: bool = True,
    pseudocount: float = 1.0,
) -> Dict[str, object]:
    """Compute summary statistics for a gene expression vector.

    Parameters
    ----------
    values : list of float
        Raw expression values (counts or TPM).
    name : str, optional
        Gene symbol for labelling. Default: 'unknown'.
    log2_transform : bool, optional
        Apply log2(x + pseudocount) before summarising. Default: True.
    pseudocount : float, optional
        Value added before log-transformation to avoid log(0). Default: 1.0.

    Returns
    -------
    dict with keys: gene, n, mean, median, sd, min, max, cv

    Examples
    --------
    >>> result = summarise_expression([120, 450, 89, 1203], name="BRCA1")
    >>> result["gene"]
    'BRCA1'
    """
    if not values:
        raise ValueError(f"Empty expression vector for gene '{name}'")

    data: List[float] = (
        [math.log2(v + pseudocount) for v in values]
        if log2_transform else list(values)
    )
    mu: float = statistics.mean(data)
    sd: float = statistics.stdev(data) if len(data) > 1 else 0.0
    return {
        "gene":   name,
        "n":      len(data),
        "mean":   round(mu, 3),
        "median": round(statistics.median(data), 3),
        "sd":     round(sd, 3),
        "min":    round(min(data), 3),
        "max":    round(max(data), 3),
        "cv":     round(sd / mu if mu != 0 else float("nan"), 3),
    }

# ── Demonstrate the function ───────────────────────────────────────────────
print("=== summarise_expression() ===")
genes_data: Dict[str, List[float]] = {
    "BRCA1":  [120, 450,  89, 1203,  34, 780],
    "TP53":   [890, 230, 670,  410, 920, 310],
    "GAPDH":  [8500, 9200, 7800, 8100, 8700, 9000],
}
for gene, vals in genes_data.items():
    s = summarise_expression(vals, name=gene)
    print(f"  {s['gene']:<8}  mean={s['mean']:>7.3f}  sd={s['sd']:>6.3f}  cv={s['cv']:.3f}")

# ── requirements.txt ──────────────────────────────────────────────────────
# R equivalent: renv.lock (managed by renv::snapshot())
print("\\n=== requirements.txt (pin exact versions for reproducibility) ===")
requirements = """# Core data science
numpy==1.26.4
pandas==2.2.2
scipy==1.13.0
statsmodels==0.14.2

# Bioinformatics
biopython==1.83
pydeseq2==0.4.7

# Visualisation
matplotlib==3.9.0
seaborn==0.13.2

# Notebook
jupyterlab==4.2.1
ipykernel==6.29.4
"""
print(requirements.strip())

# ── Environment setup commands ─────────────────────────────────────────────
print("=== Conda / venv setup commands ===")
setup_steps = [
    ("conda",  "conda create -n pylab python=3.11"),
    ("conda",  "conda activate pylab"),
    ("pip",    "pip install -r requirements.txt"),
    ("",       ""),
    ("venv",   "python -m venv .venv"),
    ("venv",   "source .venv/bin/activate   # Windows: .venv\\\\Scripts\\\\activate"),
    ("pip",    "pip install -r requirements.txt"),
    ("renv",   "# R equivalent: renv::restore()"),
]
for tool, cmd in setup_steps:
    label = f"[{tool}]" if tool else ""
    print(f"  {label:<8}  {cmd}")

print("\\n✓ Pinned requirements + isolated environment = reproducible science.")
`
  },

];

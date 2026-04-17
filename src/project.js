'use strict';

const _R = '{"experiment":"lung_cancer_vs_control","genes":[{"symbol":"BRCA1","log2FC":-2.3,"pvalue":0.00001,"padj":0.00012,"baseMean":450.2},{"symbol":"TP53","log2FC":1.8,"pvalue":0.0003,"padj":0.0034,"baseMean":890.5},{"symbol":"MYC","log2FC":3.1,"pvalue":0.000001,"padj":0.000008,"baseMean":1200.0},{"symbol":"RB1","log2FC":-1.9,"pvalue":0.0005,"padj":0.0041,"baseMean":320.8},{"symbol":"KRAS","log2FC":2.5,"pvalue":0.00002,"padj":0.00018,"baseMean":760.3},{"symbol":"CDH1","log2FC":-0.3,"pvalue":0.21,"padj":null,"baseMean":230.1},{"symbol":"VIM","log2FC":1.1,"pvalue":0.08,"padj":0.19,"baseMean":580.4},{"symbol":"EGFR","log2FC":2.8,"pvalue":0.000005,"padj":0.00004,"baseMean":940.7},{"symbol":"PTEN","log2FC":-1.5,"pvalue":0.003,"padj":0.018,"baseMean":410.2},{"symbol":"APC","log2FC":-2.1,"pvalue":0.00008,"padj":0.0007,"baseMean":350.6}]}';

module.exports = [
  {
    id: 1,
    icon: '📡',
    title: 'Fetch & Parse',
    subtitle: 'Simulate an API call · parse JSON into Python',
    description: `In a real pipeline you would call \`requests.get(url).json()\`, but since we are in the browser we use a pre-loaded JSON string — the data structure is identical.

**Your task:**
1. Parse \`raw_json\` into a Python dict using \`json.loads()\`
2. Extract the gene list from the dict using the correct key

| Field | Description |
|-------|-------------|
| \`symbol\` | HGNC gene name |
| \`log2FC\` | Log₂ fold-change (treated vs control) |
| \`padj\` | Benjamini–Hochberg adjusted p-value |
| \`baseMean\` | Normalised mean expression |

\`null\` in JSON becomes \`None\` in Python and \`NaN\` in pandas (step 2).`,
    code: `import json

# ── Simulated GET /api/deseq2?exp=lung_cancer ────────────────────────────
raw_json = '${_R}'

# TODO: Parse the JSON string into a Python dict
data = json.loads("???")          # ← replace "???" with:  raw_json

# TODO: Extract the list of gene records
genes = data["???"]               # ← replace "???" with the correct key name

print(f"Experiment: {data['experiment']}")
print(f"Loaded {len(genes)} genes")
for g in genes[:3]:
    print(f"  {g['symbol']:<8}  log2FC={g['log2FC']:+.1f}  padj={g['padj']}")
`,
    tests: [
      {
        description: "data is a dict with 'experiment' and 'genes' keys",
        testCode: `assert isinstance(data, dict) and "experiment" in data, "use json.loads(raw_json) to parse the JSON string"`,
      },
      {
        description: "experiment name matches the dataset",
        testCode: `assert data.get("experiment") == "lung_cancer_vs_control", "experiment should be 'lung_cancer_vs_control'"`,
      },
      {
        description: "genes is a list of 10 records",
        testCode: `assert isinstance(genes, list) and len(genes) == 10, f"genes should be a list of 10 items — use data['genes']"`,
      },
    ],
  },

  {
    id: 2,
    icon: '🧹',
    title: 'Wrangle with Pandas',
    subtitle: 'Clean · transform · engineer features',
    description: `Load the gene records into a **DataFrame**, remove entries with missing adjusted p-values, and create two new columns for downstream analysis.

**Your task:**
1. Drop rows where \`padj\` is \`NaN\` — one gene (CDH1) has no adjusted p-value
2. Add \`neg_log_p\` = −log₁₀(padj) — the **y-axis** of a volcano plot
3. Add \`direction\`: **up** (log2FC > 1), **down** (log2FC < −1), **ns** otherwise

**Useful methods:**
- \`df.dropna(subset=["col"])\`
- \`-np.log10(df["col"])\` — vectorised, no loop needed
- \`df["col"].apply(lambda x: ...)\``,
    code: `import json, pandas as pd, numpy as np

raw_json = '${_R}'
data = json.loads(raw_json)
df_raw = pd.DataFrame(data["genes"])
print(f"Raw shape: {df_raw.shape}  ({df_raw['padj'].isna().sum()} gene missing padj)")

# TODO: Remove genes that have no adjusted p-value
df = "???"               # ← df_raw.dropna(subset=["padj"])

df = df.copy()

# TODO: Add -log10(padj) as the volcano y-axis
df["neg_log_p"] = "???"  # ← -np.log10(df["padj"])

# TODO: Classify each gene's regulation direction
df["direction"] = "???"  # ← df["log2FC"].apply(lambda x: "up" if x > 1 else ("down" if x < -1 else "ns"))

print(df[["symbol","log2FC","padj","neg_log_p","direction"]].to_string(index=False))
`,
    tests: [
      {
        description: "df has fewer rows than df_raw (missing padj dropped)",
        testCode: `assert isinstance(df, pd.DataFrame) and df.shape[0] < df_raw.shape[0], "use df_raw.dropna(subset=['padj'])"`,
      },
      {
        description: "neg_log_p column exists and contains positive values",
        testCode: `assert "neg_log_p" in df.columns and df["neg_log_p"].min() > 0, "add neg_log_p = -np.log10(df['padj'])"`,
      },
      {
        description: "direction column contains only 'up', 'down', or 'ns'",
        testCode: `assert "direction" in df.columns and set(df["direction"].unique()).issubset({"up","down","ns"}), "direction values must be 'up', 'down', or 'ns'"`,
      },
    ],
  },

  {
    id: 3,
    icon: '📊',
    title: 'Analyse',
    subtitle: 'groupby · aggregation · ranking',
    description: `Use pandas **groupby** and aggregation to summarise the dataset, identify the most significant hits, and compare expression levels across groups.

**Your task:**
1. Group genes by \`direction\` — count and mean log2FC per group
2. Find the **top 5** most significant genes (smallest \`padj\`)
3. Compute mean \`baseMean\` expression per direction group

**Key methods:**
- \`df.groupby("col")["val"].agg(count="count", mean_val="mean")\`
- \`df.nsmallest(n, "col")\`
- \`df.groupby("col")["val"].mean()\``,
    code: `import json, pandas as pd, numpy as np

raw_json = '${_R}'
data = json.loads(raw_json)
df_raw = pd.DataFrame(data["genes"])
df = df_raw.dropna(subset=["padj"]).copy()
df["neg_log_p"] = -np.log10(df["padj"])
df["direction"] = df["log2FC"].apply(lambda x: "up" if x > 1 else ("down" if x < -1 else "ns"))

# TODO: Group by direction — count and mean log2FC per group
summary = "???"     # ← df.groupby("direction")["log2FC"].agg(count="count", mean_log2FC="mean")

# TODO: Top 5 most significant genes (smallest padj)
top5 = "???"        # ← df.nsmallest(5, "padj")

# TODO: Mean baseMean expression per direction
mean_expr = "???"   # ← df.groupby("direction")["baseMean"].mean()

if isinstance(summary, pd.DataFrame):
    print("=== Direction Summary ===")
    print(summary.to_string())
if isinstance(top5, pd.DataFrame):
    print("\\n=== Top 5 Most Significant Genes ===")
    print(top5[["symbol","log2FC","padj"]].to_string(index=False))
if isinstance(mean_expr, pd.Series):
    print("\\n=== Mean Expression per Direction ===")
    print(mean_expr.to_string())
`,
    tests: [
      {
        description: "summary is a DataFrame with a 'count' column",
        testCode: `assert isinstance(summary, pd.DataFrame) and "count" in summary.columns, "use df.groupby('direction')['log2FC'].agg(count='count', mean_log2FC='mean')"`,
      },
      {
        description: "top5 contains exactly 5 genes",
        testCode: `assert isinstance(top5, pd.DataFrame) and len(top5) == 5, "use df.nsmallest(5, 'padj')"`,
      },
      {
        description: "mean_expr is a Series indexed by direction",
        testCode: `assert isinstance(mean_expr, pd.Series) and set(mean_expr.index).issubset({"up","down","ns"}), "use df.groupby('direction')['baseMean'].mean()"`,
      },
    ],
  },

  {
    id: 4,
    icon: '🌋',
    title: 'Visualise',
    subtitle: 'ASCII volcano plot · data storytelling',
    description: `Build an **ASCII volcano plot** — a standard way to visualise differential expression. Position encodes direction and significance.

**Volcano plot axes:**
- **x-axis:** log₂ fold-change (right = up-regulated, left = down-regulated)
- **y-axis:** −log₁₀(padj) — higher means more significant

**Your task:**
1. Sort \`df\` by \`log2FC\` ascending for display order
2. Inside the loop, choose a symbol: **▲** (up), **▼** (down), **·** (ns)

The bar length is already calculated — just pick the right symbol.`,
    code: `import json, pandas as pd, numpy as np

raw_json = '${_R}'
data = json.loads(raw_json)
df_raw = pd.DataFrame(data["genes"])
df = df_raw.dropna(subset=["padj"]).copy()
df["neg_log_p"] = -np.log10(df["padj"])
df["direction"] = df["log2FC"].apply(lambda x: "up" if x > 1 else ("down" if x < -1 else "ns"))

# TODO: Sort by log2FC ascending for the plot
sorted_df = "???"    # ← df.sort_values("log2FC")

print("=== Volcano Plot (ASCII) ===")
print(f"  {'Symbol':<8}  {'log2FC':>7}  {'-log10p':>8}   Chart")
print("  " + "─" * 42)

if isinstance(sorted_df, pd.DataFrame):
    for _, row in sorted_df.iterrows():
        # TODO: pick the right symbol for each direction
        symbol = "???"   # ← "▲" if row["direction"]=="up" else ("▼" if row["direction"]=="down" else "·")

        bar = symbol * min(int(row["neg_log_p"] * 2), 20)
        print(f"  {row['symbol']:<8}  {row['log2FC']:>7.2f}  {row['neg_log_p']:>8.2f}   {bar}")
`,
    tests: [
      {
        description: "sorted_df is a DataFrame sorted by log2FC ascending",
        testCode: `assert isinstance(sorted_df, pd.DataFrame) and list(sorted_df["log2FC"]) == sorted(sorted_df["log2FC"]), "use df.sort_values('log2FC')"`,
      },
      {
        description: "volcano plot contains ▲ for up-regulated genes",
        testCode: `assert "▲" in _stdout, "use '▲' as the symbol when direction == 'up'"`,
      },
      {
        description: "volcano plot contains ▼ for down-regulated genes",
        testCode: `assert "▼" in _stdout, "use '▼' as the symbol when direction == 'down'"`,
      },
      {
        description: "volcano plot contains · for non-significant genes",
        testCode: `assert "·" in _stdout, "use '·' as the symbol when direction == 'ns'"`,
      },
    ],
  },

  {
    id: 5,
    icon: '📦',
    title: 'Export',
    subtitle: 'Filter · sort · to_csv()',
    description: `The final step: filter to **significant genes only**, sort by statistical significance, and export to CSV — the format expected by downstream tools like GSEA or pathway databases.

**Significance thresholds (standard DESeq2):**
- \`padj < 0.05\` — passes multiple-testing correction
- \`|log2FC| > 1\` — at least 2× fold-change

**Your task:**
1. Filter \`df\` and sort by \`padj\` ascending (chain \`.sort_values()\` directly)
2. Export selected columns as a CSV string with \`.to_csv(index=False)\``,
    code: `import json, pandas as pd, numpy as np

raw_json = '${_R}'
data = json.loads(raw_json)
df_raw = pd.DataFrame(data["genes"])
df = df_raw.dropna(subset=["padj"]).copy()
df["neg_log_p"] = -np.log10(df["padj"])
df["direction"] = df["log2FC"].apply(lambda x: "up" if x > 1 else ("down" if x < -1 else "ns"))

# TODO: Keep significant genes (padj < 0.05 AND |log2FC| > 1), sorted by padj
sig_df = "???"       # ← df[(df["padj"] < 0.05) & (df["log2FC"].abs() > 1)].sort_values("padj")

# TODO: Export symbol, log2FC, padj, direction columns as a CSV string
csv_output = "???"   # ← sig_df[["symbol","log2FC","padj","direction"]].to_csv(index=False)

n = len(sig_df) if isinstance(sig_df, pd.DataFrame) else "?"
print(f"=== Significant Genes ({n} total) ===")
print(csv_output)

if isinstance(sig_df, pd.DataFrame):
    print("\\n=== Pipeline Summary ===")
    print(f"Total genes analysed            : {len(df)}")
    print(f"Significant (padj<0.05, |FC|>1) : {len(sig_df)}")
    print(f"  Up-regulated   : {(sig_df['direction']=='up').sum()}")
    print(f"  Down-regulated : {(sig_df['direction']=='down').sum()}")
`,
    tests: [
      {
        description: "sig_df contains only padj<0.05 genes with |log2FC|>1",
        testCode: `assert isinstance(sig_df, pd.DataFrame) and (sig_df["padj"] < 0.05).all() and (sig_df["log2FC"].abs() > 1).all(), "filter: df[(df['padj']<0.05) & (df['log2FC'].abs()>1)]"`,
      },
      {
        description: "sig_df is sorted by padj ascending",
        testCode: `assert isinstance(sig_df, pd.DataFrame) and list(sig_df["padj"]) == sorted(sig_df["padj"]), "chain .sort_values('padj') after the filter"`,
      },
      {
        description: "csv_output is a CSV string with column headers",
        testCode: `assert isinstance(csv_output, str) and "symbol" in csv_output and "log2FC" in csv_output, "use sig_df[['symbol','log2FC','padj','direction']].to_csv(index=False)"`,
      },
    ],
  },
];

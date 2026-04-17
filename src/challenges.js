/* ═══════════════════════════════════════════════════
   PyLab — Challenges for "Python for Life Scientists (R Users)"
   Frame: "you already know this in R — here's the Python equivalent"
   ═══════════════════════════════════════════════════ */

module.exports = [

  // ══════════════════════════════════════════════════
  // TIER 1 — NUCLEOTIDE (100-150 XP)
  // Module 2: Python Fundamentals — R → Python basics
  // ══════════════════════════════════════════════════

  {
    id: 1,
    title: 'Hello from Python',
    tier: 'Nucleotide',
    tierLevel: 1,
    xp: 100,
    icon: '👋',
    type: 'coding',
    concepts: ['print()', 'strings', 'R comparison'],
    description: `**From R to Python: your first output**

In R you'd use:
\`\`\`r
cat("Hello from the lab!\\n")
# or
message("Hello from the lab!")
\`\`\`

In Python, \`print()\` is the universal output function. It adds a newline automatically — no \`\\n\` needed.

**Your task:** Print exactly:
\`Hello from the lab!\`

**Key difference:** \`print()\` in Python auto-adds a newline and converts non-strings for you — unlike R's \`cat()\` which needs explicit \`\\n\`.`,
    starterCode: `# In R: cat("Hello from the lab!\\n")
# In Python:
print("Hello from the lab!")
`,
    hints: [
      'Use print() with the string in quotes.',
      'The message must match exactly: Hello from the lab!',
    ],
    tests: [
      {
        description: 'Prints "Hello from the lab!"',
        testCode: `assert _stdout.strip() == "Hello from the lab!", f"Expected 'Hello from the lab!' but got: {repr(_stdout.strip())}"`,
      },
    ],
  },

  {
    id: 2,
    title: '0-Indexed Genome',
    tier: 'Nucleotide',
    tierLevel: 1,
    xp: 100,
    icon: '🔢',
    type: 'coding',
    concepts: ['indexing', '0-based', 'slicing', 'R comparison'],
    description: `**The #1 gotcha for R users: 0-based indexing**

In R, sequences are 1-indexed:
\`\`\`r
seq <- "ATGCGT"
substr(seq, 1, 1)   # "A" (first base)
substr(seq, 1, 3)   # "ATG"
\`\`\`

In Python, everything starts at 0, and slices exclude the end:
\`\`\`python
seq = "ATGCGT"
seq[0]    # "A"  (first base — NOT seq[1]!)
seq[0:3]  # "ATG"  (positions 0,1,2 — end is exclusive)
seq[-1]   # last character
\`\`\`

**Your task:** Given \`sequence = "ATGCGTAAC"\`, store:
- \`first_base\` = the first nucleotide
- \`codon\` = the first 3 nucleotides (positions 0–2)
- \`last_base\` = the last nucleotide (use negative indexing)`,
    starterCode: `sequence = "ATGCGTAAC"

# First base (index 0, not 1 like R!)
first_base = sequence[0]

# First codon: indices 0, 1, 2 (end is exclusive)
codon = sequence[0:3]

# Last base: negative indexing
last_base = sequence[-1]

print(first_base, codon, last_base)
`,
    hints: [
      'Python slice [0:3] gives characters at positions 0, 1, 2 — the end is exclusive.',
      'Negative index [-1] gives the last character — no need for len()-1.',
    ],
    tests: [
      {
        description: 'first_base is "A"',
        testCode: `assert _ns.get('first_base') == 'A', f"Expected 'A', got {repr(_ns.get('first_base'))}"`,
      },
      {
        description: 'codon is "ATG"',
        testCode: `assert _ns.get('codon') == 'ATG', f"Expected 'ATG', got {repr(_ns.get('codon'))}"`,
      },
      {
        description: 'last_base is "C"',
        testCode: `assert _ns.get('last_base') == 'C', f"Expected 'C', got {repr(_ns.get('last_base'))}"`,
      },
    ],
  },

  {
    id: 3,
    title: 'Type Detective',
    tier: 'Nucleotide',
    tierLevel: 1,
    xp: 100,
    icon: '🔎',
    type: 'coding',
    concepts: ['type()', 'int', 'float', 'str', 'bool', 'R comparison'],
    description: `**Python types vs R types**

| R | Python |
|---|--------|
| \`numeric\` (double) | \`float\` |
| \`integer\` (1L) | \`int\` |
| \`character\` | \`str\` |
| \`logical\` | \`bool\` |
| \`NA\` | \`None\` |

In R: \`class(x)\` or \`typeof(x)\`
In Python: \`type(x).__name__\` gives the type as a string.

**Your task:** Given the lab measurements below, store:
- \`gene_count_type\` = type name of \`gene_count\` as a string (e.g. \`"int"\`)
- \`expression_type\` = type name of \`expression_level\`
- \`is_significant\` = \`True\` if \`p_value < 0.05\` else \`False\``,
    starterCode: `gene_count = 847
expression_level = 3.14
p_value = 0.032
gene_name = "BRCA1"

# Get type names as strings
gene_count_type = type(gene_count).__name__   # "int"
expression_type = type(expression_level).__name__

# Boolean comparison (like R's logical, but True/False not TRUE/FALSE)
is_significant = p_value < 0.05

print(gene_count_type, expression_type, is_significant)
`,
    hints: [
      'type(x).__name__ gives the string name like "int", "float", "str".',
      'Python booleans are True/False (capitalised, no quotes).',
    ],
    tests: [
      {
        description: 'gene_count_type is "int"',
        testCode: `assert _ns.get('gene_count_type') == 'int', f"Got {repr(_ns.get('gene_count_type'))}"`,
      },
      {
        description: 'expression_type is "float"',
        testCode: `assert _ns.get('expression_type') == 'float', f"Got {repr(_ns.get('expression_type'))}"`,
      },
      {
        description: 'is_significant is True (p < 0.05)',
        testCode: `assert _ns.get('is_significant') == True, "p_value=0.032 should be significant"`,
      },
    ],
  },

  {
    id: 4,
    title: 'The None Trap',
    tier: 'Nucleotide',
    tierLevel: 1,
    xp: 120,
    icon: '🚫',
    type: 'coding',
    concepts: ['None', 'NA', 'is None', 'R comparison'],
    description: `**\`None\` vs \`NA\` — a critical difference**

In R, \`NA\` propagates silently:
\`\`\`r
x <- NA
x + 1          # NA  (propagates)
is.na(x)       # TRUE
\`\`\`

In Python, \`None\` does NOT propagate — arithmetic on \`None\` raises \`TypeError\`. Always check first.

**Critical:** Always use \`is None\` not \`== None\`:
\`\`\`python
x = None
x is None      # True  ✓ correct
x == None      # works but is bad practice
\`\`\`

**Your task:** Write \`safe_log2fc(treatment, control)\` that:
- Returns \`math.log2(treatment / control)\` if neither is \`None\` and \`control != 0\`
- Returns \`None\` otherwise`,
    starterCode: `import math

def safe_log2fc(treatment, control):
    if treatment is None or control is None:
        return None
    if control == 0:
        return None
    return math.log2(treatment / control)

print(safe_log2fc(8.0, 2.0))   # 2.0
print(safe_log2fc(None, 2.0))  # None
print(safe_log2fc(4.0, 0))     # None
`,
    hints: [
      'Use "is None" not "== None" — PEP 8 style and safer.',
      'Check for None BEFORE arithmetic to avoid TypeError.',
    ],
    tests: [
      {
        description: 'safe_log2fc(8.0, 2.0) returns 2.0',
        testCode: `import math; f = _ns['safe_log2fc']; r = f(8.0, 2.0); assert abs(r - 2.0) < 1e-9, f"Expected 2.0, got {r}"`,
      },
      {
        description: 'safe_log2fc(None, 2.0) returns None',
        testCode: `f = _ns['safe_log2fc']; assert f(None, 2.0) is None`,
      },
      {
        description: 'safe_log2fc(4.0, 0) returns None',
        testCode: `f = _ns['safe_log2fc']; assert f(4.0, 0) is None`,
      },
    ],
  },

  {
    id: 5,
    title: 'String Surgery',
    tier: 'Nucleotide',
    tierLevel: 1,
    xp: 150,
    icon: '✂️',
    type: 'coding',
    concepts: ['.upper()', '.replace()', '.strip()', '.split()', 'R comparison'],
    description: `**String methods: Python vs R**

| Task | R | Python |
|------|---|--------|
| Uppercase | \`toupper(s)\` | \`s.upper()\` |
| Replace | \`gsub("T","U",s)\` | \`s.replace("T","U")\` |
| Trim whitespace | \`trimws(s)\` | \`s.strip()\` |
| Split | \`strsplit(s,",")\` | \`s.split(",")\` |

Python strings are **objects** — methods are called ON the string with dot notation.

**Your task:** Process this annotation line:
\`"  brca1 | Breast cancer 1 | chr17:43044295-43125483  "\`

Produce:
- \`gene_id\` = uppercased first field, stripped: \`"BRCA1"\`
- \`chrom\` = third field: \`"chr17:43044295-43125483"\`
- \`fields\` = list of all 3 stripped fields`,
    starterCode: `raw = "  brca1 | Breast cancer 1 | chr17:43044295-43125483  "

# Strip outer whitespace, then split on "|"
fields = [f.strip() for f in raw.strip().split("|")]

gene_id = fields[0].upper()
chrom = fields[2]

print(gene_id)
print(chrom)
print(fields)
`,
    hints: [
      's.strip() removes leading/trailing whitespace — like R\'s trimws().',
      'Chain methods: s.strip().upper() works left to right.',
    ],
    tests: [
      {
        description: 'gene_id is "BRCA1"',
        testCode: `assert _ns.get('gene_id') == 'BRCA1', f"Got {repr(_ns.get('gene_id'))}"`,
      },
      {
        description: 'chrom is "chr17:43044295-43125483"',
        testCode: `assert _ns.get('chrom') == 'chr17:43044295-43125483', f"Got {repr(_ns.get('chrom'))}"`,
      },
      {
        description: 'fields has 3 stripped elements',
        testCode: `f = _ns.get('fields'); assert len(f) == 3 and all(s == s.strip() for s in f), f"Got {f}"`,
      },
    ],
  },

  // ══════════════════════════════════════════════════
  // TIER 2 — AMINO ACID (200-250 XP)
  // Module 3: Data Structures
  // ══════════════════════════════════════════════════

  {
    id: 6,
    title: 'Gene Expression List',
    tier: 'Amino Acid',
    tierLevel: 2,
    xp: 200,
    icon: '📋',
    type: 'coding',
    concepts: ['lists', 'list comprehension', 'sorted()', 'R comparison'],
    description: `**Python lists vs R vectors — the biggest mental shift**

In R, vectors are the fundamental unit and are vectorised:
\`\`\`r
expr <- c(2.1, 5.4, 0.3, 8.9, 1.2)
expr[expr > 2]           # vectorised filter — no loop needed
length(expr)             # 5
\`\`\`

Python lists are **not** vectorised — \`expr > 2\` doesn't work on a plain list. Use list comprehensions:
\`\`\`python
expr = [2.1, 5.4, 0.3, 8.9, 1.2]
[x for x in expr if x > 2]   # filter — like R's expr[expr > 2]
len(expr)                     # 5
\`\`\`

**Your task:** Given expression data:
- \`high_expr\` = list of values > 3.0
- \`n_genes\` = total number of genes
- \`top_two\` = top 2 values (sorted descending)`,
    starterCode: `expression = [2.1, 5.4, 0.3, 8.9, 1.2, 6.7, 0.8, 4.3]

# Filter — list comprehension replaces R's vectorised boolean indexing
high_expr = [x for x in expression if x > 3.0]

# Length
n_genes = len(expression)

# Sort descending, slice top 2
top_two = sorted(expression, reverse=True)[:2]

print(high_expr)
print(n_genes)
print(top_two)
`,
    hints: [
      '[x for x in lst if condition] is the Pythonic filter.',
      'sorted(lst, reverse=True)[:2] gives top 2.',
    ],
    tests: [
      {
        description: 'high_expr contains values > 3.0',
        testCode: `h = _ns.get('high_expr'); assert sorted(h) == sorted([5.4, 8.9, 6.7, 4.3]), f"Got {h}"`,
      },
      {
        description: 'n_genes is 8',
        testCode: `assert _ns.get('n_genes') == 8`,
      },
      {
        description: 'top_two is [8.9, 6.7]',
        testCode: `assert _ns.get('top_two') == [8.9, 6.7], f"Got {_ns.get('top_two')}"`,
      },
    ],
  },

  {
    id: 7,
    title: 'Codon Dictionary',
    tier: 'Amino Acid',
    tierLevel: 2,
    xp: 200,
    icon: '📖',
    type: 'coding',
    concepts: ['dict', '.get()', '.items()', 'R named list comparison'],
    description: `**Python dicts vs R named lists**

\`\`\`r
# R named list
codon_table[["ATG"]]   # "Met"
codon_table[["XYZ"]]   # NULL (no error — silent)
\`\`\`

\`\`\`python
# Python dict
codon_table["ATG"]          # "Met"
codon_table["XYZ"]          # KeyError! (not silent like R)
codon_table.get("XYZ")      # None — safe equivalent of R's NULL
codon_table.get("XYZ", "?") # "?" default value
\`\`\`

**Your task:**
- \`lookup(codon)\` returns the amino acid or \`"Unknown"\`
- \`start_codons\` = list of codons encoding \`"Met"\`
- \`n_stop_codons\` = count of stop codons`,
    starterCode: `codon_table = {
    "ATG": "Met",   "TTT": "Phe",  "TTC": "Phe",
    "TAA": "Stop",  "TAG": "Stop", "TGA": "Stop",
    "GCT": "Ala",   "TGG": "Trp",  "CGT": "Arg",
}

def lookup(codon):
    return codon_table.get(codon, "Unknown")

start_codons = [codon for codon, aa in codon_table.items() if aa == "Met"]
n_stop_codons = sum(1 for aa in codon_table.values() if aa == "Stop")

print(lookup("ATG"))
print(lookup("XYZ"))
print(start_codons)
print(n_stop_codons)
`,
    hints: [
      'dict.get(key, default) is the safe alternative to direct access.',
      'dict.items() gives (key, value) pairs for filtering.',
    ],
    tests: [
      {
        description: 'lookup("ATG") returns "Met"',
        testCode: `assert _ns['lookup']("ATG") == "Met"`,
      },
      {
        description: 'lookup("XYZ") returns "Unknown"',
        testCode: `assert _ns['lookup']("XYZ") == "Unknown"`,
      },
      {
        description: 'start_codons is ["ATG"]',
        testCode: `assert _ns.get('start_codons') == ['ATG'], f"Got {_ns.get('start_codons')}"`,
      },
      {
        description: 'n_stop_codons is 3',
        testCode: `assert _ns.get('n_stop_codons') == 3`,
      },
    ],
  },

  {
    id: 8,
    title: 'Unique Genes with Sets',
    tier: 'Amino Acid',
    tierLevel: 2,
    xp: 200,
    icon: '🔵',
    type: 'coding',
    concepts: ['sets', '&', '|', '-', 'R comparison'],
    description: `**Python sets vs R's set operations**

\`\`\`r
intersect(a, b)   # common elements
union(a, b)       # all elements
setdiff(a, b)     # in a but not b
\`\`\`

\`\`\`python
a & b   # intersection
a | b   # union
a - b   # difference
a ^ b   # symmetric difference
\`\`\`

**Your task:** Two RNA-seq experiments, find:
- \`shared_genes\` = expressed in BOTH
- \`experiment1_only\` = only in experiment 1
- \`all_genes\` = all unique genes
- \`n_unique\` = total count`,
    starterCode: `experiment1 = {"TP53", "BRCA1", "MYC", "EGFR", "PTEN"}
experiment2 = {"BRCA1", "MYC", "KRAS", "PTEN", "RB1"}

shared_genes = experiment1 & experiment2
experiment1_only = experiment1 - experiment2
all_genes = experiment1 | experiment2
n_unique = len(all_genes)

print("Shared:", sorted(shared_genes))
print("Exp1 only:", sorted(experiment1_only))
print("Total unique:", n_unique)
`,
    hints: [
      '& for intersection, | for union, - for difference.',
      'sorted(a_set) converts to a sorted list for display.',
    ],
    tests: [
      {
        description: 'shared_genes = {"BRCA1", "MYC", "PTEN"}',
        testCode: `assert _ns.get('shared_genes') == {"BRCA1","MYC","PTEN"}, f"Got {_ns.get('shared_genes')}"`,
      },
      {
        description: 'experiment1_only = {"TP53", "EGFR"}',
        testCode: `assert _ns.get('experiment1_only') == {"TP53","EGFR"}, f"Got {_ns.get('experiment1_only')}"`,
      },
      {
        description: 'n_unique is 7 (5+5 with 3 shared)',
        testCode: `assert _ns.get('n_unique') == 7, f"Got {_ns.get('n_unique')}"`,
      },
    ],
  },

  {
    id: 9,
    title: 'Genomic Coordinates (Tuples)',
    tier: 'Amino Acid',
    tierLevel: 2,
    xp: 200,
    icon: '📌',
    type: 'coding',
    concepts: ['tuples', 'unpacking', 'immutable', 'max with key'],
    description: `**Tuples — R has no real equivalent**

Tuples are immutable lists. Use them for fixed records like genomic coordinates. Unpacking is a key Python pattern:

\`\`\`python
coord = ("chr17", 43044295, 43125483)
chrom, start, end = coord   # unpacking — cleaner than coord[0], coord[1]...
\`\`\`

**Your task:** Write \`gene_length(coords)\` that returns the gene length (end - start), then:
- \`lengths\` = list of lengths for all genes
- \`longest_gene\` = name of the gene with the maximum length`,
    starterCode: `genes = {
    "BRCA1": ("chr17", 43044295, 43125483),
    "TP53":  ("chr17", 7668402,  7687550),
    "EGFR":  ("chr7",  55086725, 55324313),
    "MYC":   ("chr8",  127735434,127742951),
}

def gene_length(coords):
    chrom, start, end = coords   # tuple unpacking
    return end - start

lengths = [gene_length(coords) for coords in genes.values()]
longest_gene = max(genes.keys(), key=lambda name: gene_length(genes[name]))

print(lengths)
print(longest_gene)
`,
    hints: [
      'Unpack with: chrom, start, end = coords',
      'max(iterable, key=func) finds the element where func(element) is largest.',
    ],
    tests: [
      {
        description: 'gene_length on BRCA1 coords is 81188',
        testCode: `f = _ns['gene_length']; assert f(("chr17", 43044295, 43125483)) == 81188`,
      },
      {
        description: 'lengths has 4 positive values',
        testCode: `L = _ns.get('lengths'); assert len(L) == 4 and all(x > 0 for x in L)`,
      },
      {
        description: 'longest_gene is "EGFR"',
        testCode: `assert _ns.get('longest_gene') == 'EGFR', f"Got {repr(_ns.get('longest_gene'))}"`,
      },
    ],
  },

  {
    id: 10,
    title: 'Variant Classifier',
    tier: 'Amino Acid',
    tierLevel: 2,
    xp: 250,
    icon: '🧬',
    type: 'coding',
    concepts: ['if/elif/else', 'in operator', 'f-strings', 'R comparison'],
    description: `**if/elif/else — almost identical to R, watch the syntax**

\`\`\`r
if (variant %in% oncogenes) {
  category <- "oncogene"
} else if (variant %in% tumour_suppressors) {
  category <- "tumour suppressor"
} else { category <- "unknown" }
\`\`\`

\`\`\`python
# No parens needed; colon is mandatory; indentation = braces
if variant in oncogenes:
    category = "oncogene"
elif variant in tumour_suppressors:
    category = "tumour suppressor"
else:
    category = "unknown"
\`\`\`

**Your task:** Write \`classify_variant(gene)\` and apply it to produce a \`classifications\` dict.`,
    starterCode: `oncogenes = {"KRAS", "MYC", "EGFR", "BRAF", "PIK3CA"}
tumour_suppressors = {"TP53", "BRCA1", "BRCA2", "PTEN", "RB1"}

def classify_variant(gene):
    if gene in oncogenes:
        return "oncogene"
    elif gene in tumour_suppressors:
        return "tumour suppressor"
    else:
        return "unknown"

query_genes = ["TP53", "KRAS", "NOTCH1", "BRCA1", "IDH1"]
classifications = {gene: classify_variant(gene) for gene in query_genes}

for gene, cat in classifications.items():
    print(f"{gene}: {cat}")
`,
    hints: [
      '"in" checks membership — works on sets (fast!), lists, and dict keys.',
      'Dict comprehension: {k: f(k) for k in keys}',
    ],
    tests: [
      {
        description: 'classify_variant("TP53") returns "tumour suppressor"',
        testCode: `assert _ns['classify_variant']('TP53') == 'tumour suppressor'`,
      },
      {
        description: 'classify_variant("KRAS") returns "oncogene"',
        testCode: `assert _ns['classify_variant']('KRAS') == 'oncogene'`,
      },
      {
        description: 'classify_variant("NOTCH1") returns "unknown"',
        testCode: `assert _ns['classify_variant']('NOTCH1') == 'unknown'`,
      },
      {
        description: 'classifications dict has 5 entries',
        testCode: `assert len(_ns.get('classifications', {})) == 5`,
      },
    ],
  },

  // ══════════════════════════════════════════════════
  // TIER 3 — ORGANELLE (350-400 XP)
  // Module 4: Control Flow & Functions
  // ══════════════════════════════════════════════════

  {
    id: 11,
    title: 'For Loops & enumerate()',
    tier: 'Organelle',
    tierLevel: 3,
    xp: 350,
    icon: '🔁',
    type: 'coding',
    concepts: ['for loops', 'enumerate()', 'range()', 'R comparison'],
    description: `**Loops: R vs Python**

\`\`\`r
for (i in seq_along(genes)) {
  cat(i, genes[i], "\\n")   # 1-indexed
}
\`\`\`

\`\`\`python
for i, gene in enumerate(genes):   # 0-indexed by default
    print(i, gene)

for i, gene in enumerate(genes, start=1):  # start=1 → like R!
    print(i, gene)
\`\`\`

**Your task:** Given expression values:
- \`high_expression_samples\` = list of (index, value) tuples where value > 5.0 (0-indexed)
- \`cumulative_sum\` = running total list`,
    starterCode: `samples = [1.2, 6.8, 3.4, 9.1, 0.5, 7.3, 2.2, 5.8]

# enumerate gives (0-based index, value)
high_expression_samples = [(i, val) for i, val in enumerate(samples) if val > 5.0]

# Cumulative sum
cumulative_sum = []
total = 0
for val in samples:
    total += val
    cumulative_sum.append(round(total, 2))

print("High:", high_expression_samples)
print("Cumulative:", cumulative_sum)

# Print 1-based (like R) using start=1
for i, val in enumerate(samples, start=1):
    print(f"Sample {i}: {val}")
`,
    hints: [
      'enumerate(lst, start=1) makes the counter 1-based — handy for R-like output.',
      'Keep a running total and append to build cumulative sums.',
    ],
    tests: [
      {
        description: 'high_expression_samples: indices 1,3,5,7 (values 6.8,9.1,7.3,5.8)',
        testCode: `h = _ns.get('high_expression_samples'); assert h == [(1,6.8),(3,9.1),(5,7.3),(7,5.8)], f"Got {h}"`,
      },
      {
        description: 'cumulative_sum has 8 elements, last is total',
        testCode: `cs = _ns.get('cumulative_sum'); assert len(cs) == 8 and abs(cs[-1] - round(sum([1.2,6.8,3.4,9.1,0.5,7.3,2.2,5.8]),2)) < 0.01`,
      },
    ],
  },

  {
    id: 12,
    title: 'List Comprehensions',
    tier: 'Organelle',
    tierLevel: 3,
    xp: 350,
    icon: '⚡',
    type: 'coding',
    concepts: ['list comprehension', 'sapply equivalent', 'filtering', 'R comparison'],
    description: `**List comprehensions — Python's answer to sapply/lapply**

\`\`\`r
# R
squared <- sapply(values, function(x) x^2)
filtered <- Filter(function(x) x > 0, values)
\`\`\`

\`\`\`python
# Python
squared  = [x**2 for x in values]
filtered = [x for x in values if x > 0]
# Unpack tuples inline:
names = [gene for gene, lfc, padj in results if lfc > 1]
\`\`\`

**Your task:** Given DESeq2-like results:
- \`upreg\` = genes with log2fc > 1
- \`downreg\` = genes with log2fc < -1
- \`abs_fc\` = absolute fold-change values for ALL genes
- \`sig_genes\` = genes where abs(log2fc) > 1 AND padj < 0.05`,
    starterCode: `results = [
    ("BRCA1", -2.3, 0.001),
    ("MYC",    3.1, 0.0001),
    ("TP53",  -0.4, 0.42),
    ("EGFR",   1.8, 0.003),
    ("PTEN",  -1.5, 0.02),
    ("KRAS",   0.7, 0.15),
    ("RB1",   -2.1, 0.008),
]

upreg    = [gene for gene, lfc, padj in results if lfc > 1]
downreg  = [gene for gene, lfc, padj in results if lfc < -1]
abs_fc   = [abs(lfc) for gene, lfc, padj in results]
sig_genes = [gene for gene, lfc, padj in results if abs(lfc) > 1 and padj < 0.05]

print("Up:", upreg)
print("Down:", downreg)
print("Significant:", sig_genes)
`,
    hints: [
      'Unpack tuples in the for clause: for gene, lfc, padj in results',
      'Use "and" (not R\'s &) to combine conditions in a comprehension.',
    ],
    tests: [
      {
        description: 'upreg = ["MYC", "EGFR"]',
        testCode: `assert _ns.get('upreg') == ['MYC','EGFR'], f"Got {_ns.get('upreg')}"`,
      },
      {
        description: 'downreg = ["BRCA1", "PTEN", "RB1"]',
        testCode: `assert _ns.get('downreg') == ['BRCA1','PTEN','RB1'], f"Got {_ns.get('downreg')}"`,
      },
      {
        description: 'sig_genes = ["BRCA1", "MYC", "EGFR", "PTEN", "RB1"]',
        testCode: `assert _ns.get('sig_genes') == ['BRCA1','MYC','EGFR','PTEN','RB1'], f"Got {_ns.get('sig_genes')}"`,
      },
    ],
  },

  {
    id: 13,
    title: 'Functions & Defaults',
    tier: 'Organelle',
    tierLevel: 3,
    xp: 350,
    icon: '⚙️',
    type: 'coding',
    concepts: ['def', 'return', 'default arguments', 'R comparison'],
    description: `**Defining functions: R vs Python**

\`\`\`r
calc_stats <- function(values, ddof = 1) {
  list(mean=mean(values), sd=sd(values), n=length(values))
}
\`\`\`

\`\`\`python
def calc_stats(values, ddof=1):    # default arg same syntax
    n    = len(values)
    mean = sum(values) / n
    var  = sum((x - mean)**2 for x in values) / (n - ddof)
    return {"mean": mean, "sd": var**0.5, "n": n}
\`\`\`

**Key difference:** Python requires an explicit \`return\` — without it, the function returns \`None\` (unlike R where the last expression is the return value).

**Your task:** Write \`calc_stats(values, ddof=1)\` returning a dict with \`mean\`, \`std\`, \`min\`, \`max\`, \`n\`.`,
    starterCode: `def calc_stats(values, ddof=1):
    n    = len(values)
    mean = sum(values) / n
    var  = sum((x - mean) ** 2 for x in values) / (n - ddof)
    std  = var ** 0.5
    return {
        "mean": round(mean, 4),
        "std":  round(std, 4),
        "min":  min(values),
        "max":  max(values),
        "n":    n,
    }

expression = [4.2, 6.1, 3.8, 5.5, 7.2, 4.9]
stats = calc_stats(expression)
print(stats)
`,
    hints: [
      'sum((x - mean)**2 for x in values) uses a generator inside sum().',
      'Python requires explicit return — last expression is NOT auto-returned.',
    ],
    tests: [
      {
        description: 'calc_stats returns dict with correct keys',
        testCode: `r = _ns['calc_stats']([1.0,2.0,3.0]); assert set(r.keys()) >= {"mean","std","min","max","n"}`,
      },
      {
        description: 'mean of [1,2,3] is 2.0',
        testCode: `r = _ns['calc_stats']([1.0,2.0,3.0]); assert abs(r['mean'] - 2.0) < 0.01`,
      },
      {
        description: 'ddof=1 std of [2,4,4,4,5,5,7,9] matches statistics.stdev',
        testCode: `import statistics; expected = round(statistics.stdev([2.0,4.0,4.0,4.0,5.0,5.0,7.0,9.0]),4); r = _ns['calc_stats']([2.0,4.0,4.0,4.0,5.0,5.0,7.0,9.0]); assert abs(r['std'] - expected) < 0.01, f"Got {r['std']}, expected {expected}"`,
      },
      {
        description: 'n is correctly counted',
        testCode: `r = _ns['calc_stats']([4.2,6.1,3.8,5.5,7.2,4.9]); assert r['n'] == 6`,
      },
    ],
  },

  {
    id: 14,
    title: 'f-strings & Formatting',
    tier: 'Organelle',
    tierLevel: 3,
    xp: 350,
    icon: '📝',
    type: 'coding',
    concepts: ['f-strings', 'format specifiers', 'R paste/glue comparison'],
    description: `**String formatting: R's paste/glue vs Python's f-strings**

\`\`\`r
sprintf("Gene: %s, FC: %.2f", gene, fc)
glue::glue("Gene: {gene}, FC: {fc}")  # tidyverse
\`\`\`

\`\`\`python
f"Gene: {gene}, FC: {fc:.2f}"    # :.2f = 2 decimal places
f"p = {pval:.2e}"                # scientific notation
f"{gene:<8}"                     # left-align in 8 chars
f"{value:,}"                     # 1,234,567
\`\`\`

**Your task:** Write \`format_deseq_row(gene, log2fc, padj, basemean)\` returning:
\`"BRCA1    | log2FC: -2.30 | padj: 1.00e-03 | mean: 1,234.5"\`
(gene left-padded to 8 chars, log2fc 2dp with sign, padj scientific, mean comma+1dp)`,
    starterCode: `def format_deseq_row(gene, log2fc, padj, basemean):
    return (
        f"{gene:<8} | "
        f"log2FC: {log2fc:+.2f} | "
        f"padj: {padj:.2e} | "
        f"mean: {basemean:,.1f}"
    )

print(format_deseq_row("BRCA1", -2.3, 0.001, 1234.5))
print(format_deseq_row("MYC", 3.1, 0.00001, 45678.9))
`,
    hints: [
      '{gene:<8} left-aligns in a field of width 8.',
      '{val:+.2f} always shows the sign (+/-). {val:.2e} = scientific notation.',
    ],
    tests: [
      {
        description: 'BRCA1 row contains correct formatted values',
        testCode: `r = _ns['format_deseq_row']("BRCA1", -2.3, 0.001, 1234.5); assert "BRCA1" in r and "-2.30" in r and "1.00e-03" in r and "1,234.5" in r, f"Got: {r}"`,
      },
      {
        description: 'Gene name padded to 8 characters (left-aligned)',
        testCode: `r = _ns['format_deseq_row']("MYC", 3.1, 0.00001, 45678.9); assert r.startswith("MYC     "), f"Got: {repr(r[:12])}"`,
      },
    ],
  },

  {
    id: 15,
    title: 'Error Handling',
    tier: 'Organelle',
    tierLevel: 3,
    xp: 400,
    icon: '🛡️',
    type: 'coding',
    concepts: ['try/except', 'ValueError', 'TypeError', 'R tryCatch'],
    description: `**Error handling: R's tryCatch vs Python's try/except**

\`\`\`r
result <- tryCatch({ log(x) }, error = function(e) NA)
\`\`\`

\`\`\`python
try:
    result = math.log(x)
except ValueError:       # specific error
    result = None
except Exception as e:   # catch-all
    print(f"Unexpected: {e}")
\`\`\`

**Your task:** Write \`parse_expression_value(raw)\` that:
- Converts a string measurement to float
- Returns \`None\` if empty, "N/A", non-numeric, or negative`,
    starterCode: `def parse_expression_value(raw):
    if not raw or raw.strip() in ("N/A", "NA", ""):
        return None
    try:
        value = float(raw.strip())
        if value < 0:
            return None
        return value
    except ValueError:
        return None

tests = ["3.14", "  6.2  ", "N/A", "", "not_a_number", "-1.5", "0", "1e4"]
results = [parse_expression_value(x) for x in tests]
print(results)
`,
    hints: [
      'float("not_a_number") raises ValueError — catch it specifically.',
      'Check for negative AFTER conversion, not before.',
    ],
    tests: [
      {
        description: 'parse_expression_value("3.14") returns 3.14',
        testCode: `f = _ns['parse_expression_value']; assert f("3.14") == 3.14`,
      },
      {
        description: 'parse_expression_value("N/A") returns None',
        testCode: `f = _ns['parse_expression_value']; assert f("N/A") is None`,
      },
      {
        description: 'parse_expression_value("not_a_number") returns None',
        testCode: `f = _ns['parse_expression_value']; assert f("not_a_number") is None`,
      },
      {
        description: 'parse_expression_value("-1.5") returns None',
        testCode: `f = _ns['parse_expression_value']; assert f("-1.5") is None`,
      },
      {
        description: 'parse_expression_value("1e4") returns 10000.0',
        testCode: `f = _ns['parse_expression_value']; assert f("1e4") == 10000.0`,
      },
    ],
  },

  // ══════════════════════════════════════════════════
  // TIER 4 — ORGANISM (500 XP)
  // Modules 5+6: Data wrangling & statistics (stdlib)
  // ══════════════════════════════════════════════════

  {
    id: 16,
    title: 'CSV Data Wrangling',
    tier: 'Organism',
    tierLevel: 4,
    xp: 500,
    icon: '📊',
    type: 'coding',
    concepts: ['csv.DictReader', 'type casting', 'pandas preview'],
    description: `**Reading structured data — what pandas does under the hood**

In a real analysis you'd use \`pandas.read_csv()\`. Python's built-in \`csv\` module shows you what happens underneath.

\`\`\`python
import csv, io
reader = csv.DictReader(io.StringIO(csv_text))
rows = list(reader)
# rows[0] → {"gene": "BRCA1", "log2fc": "-2.3", ...}
# ALL values are strings — you must cast!
\`\`\`

**Your task:**
- \`genes_df\` = list of dicts with \`gene\` (str), \`log2fc\` (float), \`padj\` (float)
- \`sig_up\` = gene names with log2fc > 1 AND padj < 0.05, sorted
- \`mean_log2fc\` = mean across ALL genes, rounded to 4dp`,
    starterCode: `import csv, io

csv_data = """gene,log2fc,padj
BRCA1,-2.3,0.001
MYC,3.1,0.0001
TP53,-0.4,0.42
EGFR,1.8,0.003
PTEN,-1.5,0.02
KRAS,0.7,0.15
RB1,-2.1,0.008
STAT3,2.5,0.04
"""

reader = csv.DictReader(io.StringIO(csv_data.strip()))

# Cast types — CSV values are always strings!
genes_df = [
    {"gene": row["gene"], "log2fc": float(row["log2fc"]), "padj": float(row["padj"])}
    for row in reader
]

sig_up = sorted([r["gene"] for r in genes_df if r["log2fc"] > 1 and r["padj"] < 0.05])

mean_log2fc = round(sum(r["log2fc"] for r in genes_df) / len(genes_df), 4)

print("Significant up:", sig_up)
print("Mean log2FC:", mean_log2fc)
`,
    hints: [
      'csv.DictReader returns rows as dicts, but values are always strings.',
      'Cast with float(row["log2fc"]) — same as R\'s as.numeric().',
    ],
    tests: [
      {
        description: 'genes_df has 8 rows with float values',
        testCode: `df = _ns.get('genes_df'); assert len(df) == 8 and isinstance(df[0]['log2fc'], float)`,
      },
      {
        description: 'sig_up = ["EGFR", "MYC", "STAT3"]',
        testCode: `assert _ns.get('sig_up') == ['EGFR','MYC','STAT3'], f"Got {_ns.get('sig_up')}"`,
      },
      {
        description: 'mean_log2fc is correct',
        testCode: `m = _ns.get('mean_log2fc'); expected = round((-2.3+3.1-0.4+1.8-1.5+0.7-2.1+2.5)/8, 4); assert abs(m - expected) < 0.001`,
      },
    ],
  },

  {
    id: 17,
    title: 'GroupBy from Scratch',
    tier: 'Organism',
    tierLevel: 4,
    xp: 500,
    icon: '🗂️',
    type: 'coding',
    concepts: ['defaultdict', 'groupby', 'aggregation', 'pandas preview'],
    description: `**GroupBy — the pandas .groupby() concept in pure Python**

\`\`\`r
# dplyr
df %>% group_by(tissue) %>% summarise(mean_expr = mean(expression))
\`\`\`

\`\`\`python
from collections import defaultdict
groups = defaultdict(list)
for row in data:
    groups[row["tissue"]].append(row["expression"])
# Then aggregate each group
\`\`\`

\`defaultdict(list)\` auto-creates an empty list for new keys — no \`KeyError\`, no need to check if the key exists first.

**Your task:**
- \`by_tissue\` = dict mapping tissue → list of expression values
- \`tissue_means\` = dict mapping tissue → mean expression (2dp)
- \`most_expressed_tissue\` = tissue with highest mean`,
    starterCode: `from collections import defaultdict

samples = [
    {"tissue": "liver",  "gene": "ALB",   "expression": 8.4},
    {"tissue": "brain",  "gene": "SNAP",  "expression": 6.1},
    {"tissue": "liver",  "gene": "CYP3A4","expression": 7.2},
    {"tissue": "lung",   "gene": "SFTPC", "expression": 9.3},
    {"tissue": "brain",  "gene": "MAPT",  "expression": 5.8},
    {"tissue": "lung",   "gene": "AGER",  "expression": 8.1},
    {"tissue": "liver",  "gene": "APOB",  "expression": 6.9},
    {"tissue": "brain",  "gene": "GBP",   "expression": 7.4},
]

by_tissue = defaultdict(list)
for s in samples:
    by_tissue[s["tissue"]].append(s["expression"])

tissue_means = {
    tissue: round(sum(vals) / len(vals), 2)
    for tissue, vals in by_tissue.items()
}

most_expressed_tissue = max(tissue_means, key=tissue_means.get)

print(dict(by_tissue))
print(tissue_means)
print(most_expressed_tissue)
`,
    hints: [
      'defaultdict(list) auto-creates empty lists — no KeyError.',
      'max(dict, key=dict.get) finds the key with the highest value.',
    ],
    tests: [
      {
        description: 'by_tissue["liver"] has 3 values',
        testCode: `bt = _ns.get('by_tissue'); assert len(bt['liver']) == 3`,
      },
      {
        description: 'tissue_means["lung"] ≈ 8.7',
        testCode: `tm = _ns.get('tissue_means'); assert abs(tm['lung'] - round((9.3+8.1)/2, 2)) < 0.01`,
      },
      {
        description: 'most_expressed_tissue is "lung"',
        testCode: `assert _ns.get('most_expressed_tissue') == 'lung'`,
      },
    ],
  },

  {
    id: 18,
    title: 'Statistical Summary',
    tier: 'Organism',
    tierLevel: 4,
    xp: 500,
    icon: '📈',
    type: 'coding',
    concepts: ['statistics module', 'Welch t-test', 'scipy preview'],
    description: `**Python statistics module vs R's built-in stats**

| R | Python |
|---|--------|
| \`mean(x)\` | \`statistics.mean(x)\` |
| \`sd(x)\` | \`statistics.stdev(x)\` |
| \`median(x)\` | \`statistics.median(x)\` |

For a proper t-test in Python you'd use \`scipy.stats.ttest_ind()\`. Here we implement it from scratch to understand the maths.

**Your task:**
- \`stats_ctrl\` and \`stats_treat\` = dicts with mean, stdev, n
- \`t_stat\` = Welch's t-statistic: **(mean1 - mean2) / sqrt(var1/n1 + var2/n2)**
- \`conclusion\` = "significant" if abs(t_stat) > 2.0`,
    starterCode: `import statistics, math

control   = [2.1, 1.8, 2.4, 2.0, 1.9, 2.3, 1.7, 2.2]
treatment = [4.5, 5.1, 4.8, 5.3, 4.7, 5.0, 4.9, 5.2]

def summarise(values):
    return {
        "mean":  round(statistics.mean(values), 4),
        "stdev": round(statistics.stdev(values), 4),
        "n":     len(values),
    }

stats_ctrl  = summarise(control)
stats_treat = summarise(treatment)

def welch_t(s1, s2):
    se = math.sqrt(s1["stdev"]**2 / s1["n"] + s2["stdev"]**2 / s2["n"])
    return (s1["mean"] - s2["mean"]) / se

t_stat = round(welch_t(stats_ctrl, stats_treat), 4)
conclusion = "significant" if abs(t_stat) > 2.0 else "not significant"

print(f"t = {t_stat}  → {conclusion}")
`,
    hints: [
      'statistics.stdev() uses ddof=1 (sample std), matching R\'s sd().',
      'math.sqrt() for square root.',
    ],
    tests: [
      {
        description: 'stats_ctrl mean is ~2.05',
        testCode: `import statistics; sc = _ns.get('stats_ctrl'); assert abs(sc['mean'] - statistics.mean([2.1,1.8,2.4,2.0,1.9,2.3,1.7,2.2])) < 0.01`,
      },
      {
        description: 't_stat is large negative (treatment >> control)',
        testCode: `t = _ns.get('t_stat'); assert t < -2.0, f"Expected large negative t, got {t}"`,
      },
      {
        description: 'conclusion is "significant"',
        testCode: `assert _ns.get('conclusion') == 'significant'`,
      },
    ],
  },

  {
    id: 19,
    title: 'Regex for Bioinformatics',
    tier: 'Organism',
    tierLevel: 4,
    xp: 500,
    icon: '🔍',
    type: 'coding',
    concepts: ['re', 'regex', 'findall', 'groups', 'R stringr comparison'],
    description: `**Regex: R's stringr vs Python's re module**

\`\`\`r
library(stringr)
str_detect(x, "ATG")
str_extract_all(x, "[GC]")
\`\`\`

\`\`\`python
import re
bool(re.search("ATG", x))     # like str_detect()
re.findall("[GC]", x)         # all matches
m = re.search(r"(\\w+):(\\d+)", x)
m.group(1), m.group(2)        # capture groups
\`\`\`

**Your task:**
- \`parse_coord(s)\` parses \`"chr17:43044295-43125483"\` → dict \`{chrom, start, end}\` or \`None\`
- \`kozak_sites\` = all matches of Kozak pattern \`[AG]CCATGG\` in \`test_seq\``,
    starterCode: `import re

def parse_coord(s):
    m = re.match(r"(chr[\\w]+):(\\d+)-(\\d+)", s)
    if not m:
        return None
    return {
        "chrom": m.group(1),
        "start": int(m.group(2)),
        "end":   int(m.group(3)),
    }

def find_kozak(seq):
    return re.findall(r"[AG]CCATGG", seq)

print(parse_coord("chr17:43044295-43125483"))
print(parse_coord("invalid"))

test_seq = "ATTGCCATGGCGTACCATGGTTAACCATGGA"
kozak_sites = find_kozak(test_seq)
print(kozak_sites)
`,
    hints: [
      'Use raw strings r"..." for patterns to avoid double-escaping \\.',
      're.match() anchors at start; re.search() finds anywhere in string.',
    ],
    tests: [
      {
        description: 'parse_coord("chr17:43044295-43125483") returns correct dict',
        testCode: `r = _ns['parse_coord']("chr17:43044295-43125483"); assert r == {"chrom":"chr17","start":43044295,"end":43125483}`,
      },
      {
        description: 'parse_coord("invalid") returns None',
        testCode: `assert _ns['parse_coord']("invalid") is None`,
      },
      {
        description: 'kozak_sites finds [AG]CCATGG patterns',
        testCode: `import re; expected = re.findall(r'[AG]CCATGG', "ATTGCCATGGCGTACCATGGTTAACCATGGA"); assert _ns.get('kozak_sites') == expected`,
      },
    ],
  },

  // ══════════════════════════════════════════════════
  // TIER 5 — ECOSYSTEM (750-1000 XP)
  // ══════════════════════════════════════════════════

  {
    id: 20,
    title: 'FASTA Parser',
    tier: 'Ecosystem',
    tierLevel: 5,
    xp: 750,
    icon: '🗄️',
    type: 'coding',
    concepts: ['FASTA', 'multi-line parsing', 'generators', 'biopython preview'],
    description: `**FASTA parsing from scratch — daily bread of bioinformatics**

Biopython:
\`\`\`python
from Bio import SeqIO
records = list(SeqIO.parse("seqs.fasta", "fasta"))
\`\`\`

In R with Biostrings:
\`\`\`r
seqs <- readDNAStringSet("seqs.fasta")
\`\`\`

Understanding the format: lines starting with \`>\` are headers; subsequent lines are the sequence (may span multiple lines).

**Your task:** Write \`parse_fasta(text)\` → list of \`{"id", "seq"}\` dicts. Then:
- \`gc_contents\` = dict of id → GC% (1dp)
- \`longest_seq_id\` = id of the longest sequence`,
    starterCode: `def parse_fasta(text):
    records = []
    current_id = None
    current_seq = []
    for line in text.strip().splitlines():
        line = line.strip()
        if line.startswith(">"):
            if current_id is not None:
                records.append({"id": current_id, "seq": "".join(current_seq)})
            current_id = line[1:].split()[0]
            current_seq = []
        else:
            current_seq.append(line)
    if current_id is not None:
        records.append({"id": current_id, "seq": "".join(current_seq)})
    return records

fasta_text = """>BRCA1 breast cancer 1
ATGCGTACGTAGCTAGCTAGCGATCGATCG
ATCGATCGATCGTAGCTAGCTAGCTAGCTA
>TP53 tumour protein p53
ATGCCCAGACTGCTTTAGACTTGACCTGGAG
>EGFR epidermal growth factor receptor
ATGCGACCCTCCGGGACGGCCGGGGCAGCGC
TGCGATCGATCGATCGATCGATCGATCGAT
CGTAGCTAGCTAGCTAGCTAGCTAGCTAGC"""

records = parse_fasta(fasta_text)

def gc_percent(seq):
    gc = seq.count('G') + seq.count('C')
    return round(gc / len(seq) * 100, 1)

gc_contents = {r["id"]: gc_percent(r["seq"]) for r in records}
longest_seq_id = max(records, key=lambda r: len(r["seq"]))["id"]

print(gc_contents)
print(longest_seq_id)
`,
    hints: [
      'Accumulate sequence lines until the next ">" header.',
      'Don\'t forget to append the last record after the loop.',
    ],
    tests: [
      {
        description: 'parse_fasta returns 3 records',
        testCode: `r = _ns['parse_fasta'](_ns.get('fasta_text','')); assert len(r) == 3`,
      },
      {
        description: 'Sequences contain no newlines',
        testCode: `r = _ns['parse_fasta'](_ns.get('fasta_text','')); assert all('\\n' not in rec['seq'] for rec in r)`,
      },
      {
        description: 'gc_contents has 3 entries (0-100%)',
        testCode: `gc = _ns.get('gc_contents'); assert len(gc) == 3 and all(0 <= v <= 100 for v in gc.values())`,
      },
      {
        description: 'longest_seq_id is "EGFR"',
        testCode: `assert _ns.get('longest_seq_id') == 'EGFR'`,
      },
    ],
  },

  {
    id: 21,
    title: 'K-mer Counter',
    tier: 'Ecosystem',
    tierLevel: 5,
    xp: 750,
    icon: '🧩',
    type: 'coding',
    concepts: ['sliding window', 'Counter', 'dict comprehension'],
    description: `**K-mer counting — the basis of genome assembly and repeat detection**

\`\`\`r
# R with Biostrings
oligonucleotideFrequency(dna, width=3)
\`\`\`

\`\`\`python
from collections import Counter
def count_kmers(seq, k):
    return Counter(seq[i:i+k] for i in range(len(seq) - k + 1))
\`\`\`

**Your task:**
- \`count_kmers(seq, k)\` → dict of k-mer counts
- \`top_3mers\` = top 5 most common 3-mers (list of (kmer, count) tuples)
- \`cpg_sites\` = count of "CG" dinucleotides
- \`kmer_diversity\` = unique 3-mers / 64 (all possible 3-mers), rounded to 3dp`,
    starterCode: `from collections import Counter

sequence = (
    "ATGCGTACGATCGATCGCGCGATCGATCGTAGCTAGCTAGCTAGCG"
    "CGCGATCGCGATCGATCGATCGATCGATCGATCGATCGATCGATCG"
    "ATCGATCGATCGATCGCGCGATCGATCGTAGCTAGCTAGCTAGCG"
)

def count_kmers(seq, k):
    return dict(Counter(seq[i:i+k] for i in range(len(seq) - k + 1)))

kmer_counts = count_kmers(sequence, 3)
top_3mers = sorted(kmer_counts.items(), key=lambda x: x[1], reverse=True)[:5]
cpg_sites = count_kmers(sequence, 2).get("CG", 0)
kmer_diversity = round(len(kmer_counts) / 64, 3)

print("Top 3-mers:", top_3mers)
print("CpG sites:", cpg_sites)
print("Diversity:", kmer_diversity)
`,
    hints: [
      'range(len(seq) - k + 1) gives the correct number of positions.',
      'Counter.most_common(n) gives the n most frequent items.',
    ],
    tests: [
      {
        description: 'count_kmers("ATGC", 2) = {"AT":1,"TG":1,"GC":1}',
        testCode: `f = _ns['count_kmers']; assert f("ATGC", 2) == {"AT":1,"TG":1,"GC":1}`,
      },
      {
        description: 'top_3mers is a list of 5 (kmer, count) tuples',
        testCode: `t = _ns.get('top_3mers'); assert len(t) == 5 and all(len(x)==2 for x in t)`,
      },
      {
        description: 'cpg_sites > 0',
        testCode: `assert _ns.get('cpg_sites') > 0`,
      },
      {
        description: 'kmer_diversity between 0 and 1',
        testCode: `d = _ns.get('kmer_diversity'); assert 0 < d <= 1.0`,
      },
    ],
  },

  {
    id: 22,
    title: 'The DESeq2 Pipeline',
    tier: 'Ecosystem',
    tierLevel: 5,
    xp: 1000,
    icon: '🔬',
    type: 'coding',
    concepts: ['pipeline', 'data integration', 'dict unpacking', 'dplyr equivalent'],
    description: `**The Grand Pipeline — mimicking dplyr/DESeq2 downstream analysis**

\`\`\`r
res %>%
  filter(!is.na(padj)) %>%
  mutate(direction = case_when(
    log2FoldChange > 1 & padj < 0.05 ~ "up",
    log2FoldChange < -1 & padj < 0.05 ~ "down",
    TRUE ~ "ns")) %>%
  arrange(padj)
\`\`\`

**Your task — build this pipeline in pure Python:**
1. Filter out rows with \`padj = None\` (like \`na.omit()\`)
2. Add \`"direction"\` field: \`"up"\`, \`"down"\`, or \`"ns"\`
3. Sort by padj ascending
4. Produce \`clean_results\`, \`volcano_data\` (log2fc, -log10padj) tuples, and \`summary\` dict`,
    starterCode: `import math

raw_results = [
    {"gene": "MYC",   "log2fc":  3.1, "padj": 0.0001},
    {"gene": "TP53",  "log2fc": -0.4, "padj": 0.42},
    {"gene": "BRCA1", "log2fc": -2.3, "padj": 0.001},
    {"gene": "KRAS",  "log2fc":  0.7, "padj": 0.15},
    {"gene": "PTEN",  "log2fc": -1.5, "padj": 0.02},
    {"gene": "EGFR",  "log2fc":  1.8, "padj": 0.003},
    {"gene": "RB1",   "log2fc": -2.1, "padj": 0.008},
    {"gene": "STAT3", "log2fc":  2.5, "padj": 0.04},
    {"gene": "IDH1",  "log2fc":  0.3, "padj": None},
    {"gene": "NOTCH1","log2fc": -0.1, "padj": None},
]

def direction(log2fc, padj):
    if abs(log2fc) > 1 and padj < 0.05:
        return "up" if log2fc > 0 else "down"
    return "ns"

# Filter, add direction, sort
clean_results = sorted(
    [{**r, "direction": direction(r["log2fc"], r["padj"])}
     for r in raw_results if r["padj"] is not None],
    key=lambda r: r["padj"]
)

volcano_data = [(r["log2fc"], round(-math.log10(r["padj"]), 3)) for r in clean_results]

from collections import Counter
counts = Counter(r["direction"] for r in clean_results)
summary = {"up": counts["up"], "down": counts["down"], "ns": counts["ns"]}

print(f"Genes: {len(clean_results)}, Summary: {summary}")
`,
    hints: [
      '{**r, "direction": ...} merges a new key — like dplyr\'s mutate().',
      'sorted(..., key=lambda r: r["padj"]) = arrange(padj).',
    ],
    tests: [
      {
        description: 'clean_results has 8 genes (2 None rows removed)',
        testCode: `assert len(_ns.get('clean_results',[])) == 8`,
      },
      {
        description: 'clean_results sorted by padj ascending',
        testCode: `cr = _ns.get('clean_results'); padjs = [r['padj'] for r in cr]; assert padjs == sorted(padjs)`,
      },
      {
        description: 'summary = {up:3, down:3, ns:2}',
        testCode: `s = _ns.get('summary'); assert s == {'up':3,'down':3,'ns':2}, f"Got {s}"`,
      },
      {
        description: 'volcano_data has correct shape',
        testCode: `vd = _ns.get('volcano_data'); assert len(vd) == 8 and all(len(t)==2 for t in vd)`,
      },
    ],
  },

  // ══════════════════════════════════════════════════
  // BUG HUNT (300-500 XP) — Classic R→Python mistakes
  // ══════════════════════════════════════════════════

  {
    id: 23,
    title: 'Debug: Off-by-One Index',
    tier: 'Bug Hunt',
    tierLevel: 5,
    xp: 300,
    icon: '🐛',
    type: 'bugHunt',
    concepts: ['0-based indexing', 'R vs Python', 'off-by-one'],
    description: `**Bug: R→Python indexing mistake**

This R user forgot Python is 0-indexed. They want the **first** nucleotide and the **first codon** (bases 1–3).

In R: \`seq[1]\` = first element. In Python: \`seq[0]\` = first element.

Find and fix the off-by-one bugs.`,
    starterCode: `sequence = "ATGCGTAACGTA"

# Bug: R-style 1-based indexing
first_base = sequence[1]    # ← BUG: should be [0]

# Bug: R-style slice
first_codon = sequence[1:4] # ← BUG: should be [0:3]

# Correct (negative indexing works the same)
last_base = sequence[-1]

print(first_base, first_codon, last_base)
`,
    hints: [
      'Python first element is index 0, not 1.',
      'sequence[0:3] gives positions 0, 1, 2.',
    ],
    tests: [
      {
        description: 'first_base is "A" (index 0)',
        testCode: `assert _ns.get('first_base') == 'A', f"Expected 'A', got {repr(_ns.get('first_base'))} — Python is 0-indexed!"`,
      },
      {
        description: 'first_codon is "ATG" (slice 0:3)',
        testCode: `assert _ns.get('first_codon') == 'ATG', f"Expected 'ATG', got {repr(_ns.get('first_codon'))} — use [0:3]"`,
      },
      {
        description: 'last_base is "A"',
        testCode: `assert _ns.get('last_base') == 'A'`,
      },
    ],
  },

  {
    id: 24,
    title: 'Debug: The Mutation Trap',
    tier: 'Bug Hunt',
    tierLevel: 5,
    xp: 350,
    icon: '🐛',
    type: 'bugHunt',
    concepts: ['mutability', '.copy()', 'reference vs value', 'R comparison'],
    description: `**Bug: Python lists are mutable — \`=\` copies the reference, not the data**

In R, \`b <- a\` makes a copy (copy-on-modify). In Python, \`b = a\` makes both point to the same list:
\`\`\`python
a = [1, 2, 3]
b = a          # SAME list!
b[0] = 99      # also changes a!
# Fix:
b = a.copy()   # or b = list(a) or b = a[:]
\`\`\`

Fix the code so \`original_samples\` is unchanged after normalisation.`,
    starterCode: `original_samples = [4.2, 6.1, 3.8, 5.5, 7.2, 4.9]

# Bug: copies the reference, not the data!
normalised = original_samples   # ← BUG: use .copy()

mean_val = sum(normalised) / len(normalised)
normalised = [x / mean_val for x in normalised]

print("Original:", original_samples)
print("Normalised:", normalised)
`,
    hints: [
      'normalised = original_samples.copy() creates an independent copy.',
      'Or: normalised = original_samples[:]',
    ],
    tests: [
      {
        description: 'original_samples unchanged: [4.2, 6.1, 3.8, 5.5, 7.2, 4.9]',
        testCode: `assert _ns.get('original_samples') == [4.2, 6.1, 3.8, 5.5, 7.2, 4.9], f"original_samples was mutated: {_ns.get('original_samples')}"`,
      },
      {
        description: 'normalised values sum to ~6.0',
        testCode: `n = _ns.get('normalised'); assert abs(sum(n) - 6.0) < 0.01`,
      },
    ],
  },

  {
    id: 25,
    title: 'Debug: String + Number',
    tier: 'Bug Hunt',
    tierLevel: 5,
    xp: 300,
    icon: '🐛',
    type: 'bugHunt',
    concepts: ['TypeError', 'str()', 'type coercion', 'R comparison'],
    description: `**Bug: Python does not silently coerce types like R**

In R:
\`\`\`r
paste0("GC content: ", 0.623)  # "GC content: 0.623" — works silently
\`\`\`

In Python:
\`\`\`python
"GC content: " + 0.623     # TypeError!
"GC content: " + str(0.623) # ✓ explicit conversion
f"GC content: {0.623:.1%}" # ✓ f-string (even better)
\`\`\`

Fix the two TypeError bugs below.`,
    starterCode: `sequence = "ATGCCCGTAGCTAGCGCCC"
gc_count = sequence.count('G') + sequence.count('C')
gc_fraction = gc_count / len(sequence)

# Bug 1: str + float → TypeError
report_line = "GC content: " + gc_fraction   # ← BUG

# Bug 2: str + int → TypeError
count_line = "G+C bases: " + gc_count        # ← BUG

print(report_line)
print(count_line)
`,
    hints: [
      'f"GC content: {gc_fraction:.1%}" formats as percentage.',
      'Or wrap in str(): "GC content: " + str(gc_fraction)',
    ],
    tests: [
      {
        description: 'report_line is a string containing GC info',
        testCode: `rl = _ns.get('report_line'); assert isinstance(rl, str) and 'GC' in rl.upper() or 'gc' in rl.lower(), f"Got {repr(rl)}"`,
      },
      {
        description: 'count_line is a string (no TypeError)',
        testCode: `cl = _ns.get('count_line'); assert isinstance(cl, str), f"Got {repr(cl)}"`,
      },
    ],
  },

  {
    id: 26,
    title: 'Debug: KeyError',
    tier: 'Bug Hunt',
    tierLevel: 5,
    xp: 400,
    icon: '🐛',
    type: 'bugHunt',
    concepts: ['KeyError', 'dict.get()', 'R NULL comparison'],
    description: `**Bug: Direct dict access raises KeyError; R returns NULL silently**

In R:
\`\`\`r
annot[["NOTCH1"]]  # NULL (no error)
\`\`\`

In Python:
\`\`\`python
annot["NOTCH1"]               # KeyError!
annot.get("NOTCH1")           # None — safe
annot.get("NOTCH1", "Unknown") # with default
\`\`\`

Fix the loop so missing genes return \`"Unknown"\` instead of crashing.`,
    starterCode: `gene_annotations = {
    "TP53":  {"function": "tumour suppressor", "pathway": "DNA repair"},
    "BRCA1": {"function": "DNA repair",         "pathway": "homologous recombination"},
    "MYC":   {"function": "transcription factor","pathway": "cell cycle"},
}

query_genes = ["TP53", "NOTCH1", "MYC", "BRAF", "BRCA1"]

results = {}
for gene in query_genes:
    # Bug: crashes on missing keys
    results[gene] = gene_annotations[gene]["function"]   # ← BUG

print(results)
`,
    hints: [
      'gene_annotations.get(gene, {}) returns empty dict for missing keys.',
      'Chain: gene_annotations.get(gene, {}).get("function", "Unknown")',
    ],
    tests: [
      {
        description: 'No KeyError — all 5 genes handled',
        testCode: `r = _ns.get('results'); assert len(r) == 5, f"Expected 5 keys, got {len(r) if r else 0}"`,
      },
      {
        description: 'Known genes have correct annotations',
        testCode: `r = _ns.get('results'); assert r.get('TP53') == 'tumour suppressor' and r.get('MYC') == 'transcription factor'`,
      },
      {
        description: 'Missing genes return a string (not crash)',
        testCode: `r = _ns.get('results'); assert isinstance(r.get('NOTCH1'), str)`,
      },
    ],
  },

  {
    id: 27,
    title: 'Debug: Integer Division',
    tier: 'Bug Hunt',
    tierLevel: 5,
    xp: 350,
    icon: '🐛',
    type: 'bugHunt',
    concepts: ['floor division', '//', '/', 'R comparison'],
    description: `**Bug: \`//\` is floor division, not "divide"**

In Python:
- \`5 / 2\` → \`2.5\` (true division — like R)
- \`5 // 2\` → \`2\` (floor division — truncates!)

An R user used \`//\` thinking it meant "divide". This silently produces wrong results.

Fix the GC content and mean read depth calculations:`,
    starterCode: `# Bug 1: floor division gives truncated mean
total_reads = 1_500_000
n_samples = 4
mean_reads = total_reads // n_samples   # ← BUG: use /

# Bug 2: order of operations + floor division = wrong GC%
gc_bases = 423
total_bases = 1000
gc_percent = gc_bases // total_bases * 100  # ← BUG: // first → 0 * 100 = 0!

print(f"Mean reads: {mean_reads}")
print(f"GC%: {gc_percent}")
`,
    hints: [
      'Use / (not //) for float division.',
      'gc_bases / total_bases * 100 — single slash first.',
    ],
    tests: [
      {
        description: 'mean_reads is 375000 (not truncated)',
        testCode: `mr = _ns.get('mean_reads'); assert mr == 375000.0 or mr == 375000`,
      },
      {
        description: 'gc_percent is 42.3 (not 0)',
        testCode: `gc = _ns.get('gc_percent'); assert abs(gc - 42.3) < 0.01, f"Expected 42.3, got {gc}"`,
      },
    ],
  },

  {
    id: 28,
    title: 'Debug: Scope Bug',
    tier: 'Bug Hunt',
    tierLevel: 5,
    xp: 350,
    icon: '🐛',
    type: 'bugHunt',
    concepts: ['scope', 'global', 'UnboundLocalError', 'R comparison'],
    description: `**Bug: Python functions can READ outer variables but not REASSIGN them without \`global\`**

In R, \`<<-\` modifies the parent environment. In Python, reassigning an outer variable inside a function without \`global\` causes \`UnboundLocalError\`:
\`\`\`python
count = 0
def increment():
    count += 1   # UnboundLocalError!

def increment():
    global count
    count += 1   # ✓ with global declaration
\`\`\`

**Better practice:** don't use global state — return values instead.

Fix the counter function (either add \`global\`, or refactor to avoid it):`,
    starterCode: `passed_qc = 0

def check_gene(expression_value, threshold=1.0):
    if expression_value >= threshold:
        passed_qc += 1   # ← UnboundLocalError!
    return expression_value >= threshold

expression_values = [0.5, 2.1, 0.3, 4.8, 1.1, 0.9, 3.2]
results = [check_gene(v) for v in expression_values]
print(f"Passed QC: {passed_qc}")
print(f"Results: {results}")
`,
    hints: [
      'Option 1: add "global passed_qc" inside check_gene.',
      'Option 2 (better): passed_qc = sum(check_gene(v) for v in expression_values)',
    ],
    tests: [
      {
        description: 'No crash — code runs without UnboundLocalError',
        testCode: `assert _ns.get('results') is not None, "Code crashed — fix the scope bug"`,
      },
      {
        description: 'passed_qc is 4 (values >= 1.0: 2.1, 4.8, 1.1, 3.2)',
        testCode: `assert _ns.get('passed_qc') == 4, f"Expected 4, got {_ns.get('passed_qc')}"`,
      },
      {
        description: 'results has 7 booleans',
        testCode: `r = _ns.get('results'); assert len(r) == 7 and all(isinstance(x, bool) for x in r)`,
      },
    ],
  },

  {
    id: 29,
    title: 'Debug: Mutable Default Arg',
    tier: 'Bug Hunt',
    tierLevel: 5,
    xp: 500,
    icon: '🐛',
    type: 'bugHunt',
    concepts: ['mutable default arguments', "Python gotcha", 'None default'],
    description: `**Python's most infamous gotcha — mutable default arguments**

\`\`\`python
def add_gene(gene, gene_list=[]):   # default created ONCE at definition!
    gene_list.append(gene)
    return gene_list

add_gene("TP53")   # ["TP53"]
add_gene("MYC")    # ["TP53", "MYC"]  ← persists between calls!
\`\`\`

Fix: use \`None\` as default and create a new list inside:
\`\`\`python
def add_gene(gene, gene_list=None):
    if gene_list is None:
        gene_list = []
    gene_list.append(gene)
    return gene_list
\`\`\``,
    starterCode: `def build_gene_set(gene, existing_genes=[]):   # ← BUG: mutable default
    existing_genes.append(gene)
    return existing_genes

# Each call should start fresh
set_a = build_gene_set("TP53")
set_b = build_gene_set("BRCA1")   # Should be ["BRCA1"] not ["TP53", "BRCA1"]!
set_c = build_gene_set("MYC")

print("A:", set_a)  # Should be ["TP53"]
print("B:", set_b)  # Should be ["BRCA1"]
print("C:", set_c)  # Should be ["MYC"]
`,
    hints: [
      'Change default from [] to None.',
      'Add inside function: if existing_genes is None: existing_genes = []',
    ],
    tests: [
      {
        description: 'Each call returns an independent list',
        testCode: `f = _ns['build_gene_set']; r1 = f("A_GENE"); r2 = f("B_GENE"); assert r1 != r2, f"Same list returned: {r1}"`,
      },
      {
        description: 'build_gene_set with single gene returns list of one',
        testCode: `f = _ns['build_gene_set']; r = f("X_TEST"); assert r == ["X_TEST"], f"Got {r}"`,
      },
    ],
  },

  {
    id: 30,
    title: 'Debug: None Comparison',
    tier: 'Bug Hunt',
    tierLevel: 5,
    xp: 300,
    icon: '🐛',
    type: 'bugHunt',
    concepts: ['is None', '== None', 'PEP 8', 'logical bugs'],
    description: `**Bug: \`== None\` vs \`is None\`, and the \`not x == None\` trap**

Always use \`is None\` / \`is not None\`:
\`\`\`python
x = None
x is None       # True  ✓
x == None       # True but bad practice
not x == None   # True (parsed as: (not x) == None → False == None → False)
x is not None   # True ✓ correct way to check "not None"
\`\`\`

The QC filter below has two None-comparison bugs. Fix them:`,
    starterCode: `def qc_filter(samples):
    clean = []
    for sample in samples:
        # Bug 1: != None works but use 'is not None'
        if sample["qc_score"] != None:
            # Bug 2: 'not sample["batch"] == None' is wrong precedence!
            # It parses as '(not sample["batch"]) == None' = 'False == None' = False
            if not sample["batch"] == None:   # ← BUG: use 'is not None'
                clean.append(sample)
    return clean

samples = [
    {"id": "S1", "qc_score": 0.95, "batch": "B1"},
    {"id": "S2", "qc_score": None, "batch": "B1"},
    {"id": "S3", "qc_score": 0.87, "batch": None},
    {"id": "S4", "qc_score": 0.91, "batch": "B2"},
]

clean_samples = qc_filter(samples)
print([s["id"] for s in clean_samples])
`,
    hints: [
      'Replace != None with "is not None".',
      'Replace "not sample[\\"batch\\"] == None" with "sample[\\"batch\\"] is not None".',
    ],
    tests: [
      {
        description: 'clean_samples = ["S1", "S4"] only',
        testCode: `ids = [s['id'] for s in _ns.get('clean_samples', [])]; assert ids == ['S1','S4'], f"Got {ids}"`,
      },
      {
        description: 'qc_filter handles all None variants',
        testCode: `f = _ns['qc_filter']; r = f([{"id":"X","qc_score":None,"batch":"B"},{"id":"Y","qc_score":1.0,"batch":"B"}]); assert len(r)==1 and r[0]["id"]=="Y"`,
      },
    ],
  },

];

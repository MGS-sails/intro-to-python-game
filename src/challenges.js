module.exports = [
  // ═══════════════════════════════════════════════
  // TIER 1 — NUCLEOTIDE  (100–150 XP)
  // ═══════════════════════════════════════════════
  {
    id: 1,
    title: 'Hello, Lab!',
    tier: 'Nucleotide',
    tierLevel: 1,
    xp: 100,
    icon: '🧪',
    concepts: ['print()', 'strings'],
    description: `Welcome to **PyLab**! Your first experiment is simple: print the message **"Hello, Lab!"** to the screen.

In Python you use the \`print()\` function to display text. String values must be wrapped in quotes.

\`\`\`python
print("some text")
\`\`\``,
    starterCode: `# Your first experiment begins!
# Use print() to display: Hello, Lab!
`,
    hints: [
      'Use the `print()` function.',
      'print("Hello, Lab!")',
    ],
    tests: [
      {
        description: 'Output is exactly "Hello, Lab!"',
        testCode: `assert _stdout.strip() == "Hello, Lab!", f"Expected 'Hello, Lab!' but got: '{_stdout.strip()}'"`,
      },
    ],
  },

  {
    id: 2,
    title: 'DNA Storage',
    tier: 'Nucleotide',
    tierLevel: 1,
    xp: 100,
    icon: '🧬',
    concepts: ['variables', 'strings'],
    description: `Every experiment needs data. Store the DNA sequence \`"ATCGATCGATCG"\` in a variable named \`dna_sequence\`, then **print** it.

Variables are assigned with \`=\`:
\`\`\`python
variable_name = "value"
\`\`\``,
    starterCode: `# Store the DNA sequence in a variable
dna_sequence =

# Print the sequence
print(dna_sequence)`,
    hints: [
      'Assignment: `name = "value"`',
      'dna_sequence = "ATCGATCGATCG"',
    ],
    tests: [
      {
        description: 'Variable dna_sequence is defined',
        testCode: `assert _ns.get('dna_sequence') is not None, "Variable 'dna_sequence' not found — did you assign it?"`,
      },
      {
        description: 'dna_sequence equals "ATCGATCGATCG"',
        testCode: `assert _ns.get('dna_sequence') == "ATCGATCGATCG", f"Expected 'ATCGATCGATCG', got '{_ns.get('dna_sequence')}'"`,
      },
      {
        description: 'The sequence is printed',
        testCode: `assert "ATCGATCGATCG" in _stdout, "Make sure you call print(dna_sequence)"`,
      },
    ],
  },

  {
    id: 3,
    title: 'Sequence Length',
    tier: 'Nucleotide',
    tierLevel: 1,
    xp: 100,
    icon: '📏',
    concepts: ['len()', 'variables'],
    description: `How long is a DNA sequence? Use Python's built-in \`len()\` function to find out.

\`\`\`python
len("ATCG")  # → 4
\`\`\`

Given \`sequence = "GCTAGCTAGCTA"\`, store its length in \`seq_length\` and print it.`,
    starterCode: `sequence = "GCTAGCTAGCTA"

# Get the length of the sequence
seq_length =

print(seq_length)`,
    hints: [
      '`len()` returns the number of characters in a string.',
      'seq_length = len(sequence)',
    ],
    tests: [
      {
        description: 'seq_length is defined',
        testCode: `assert _ns.get('seq_length') is not None, "Variable 'seq_length' not found"`,
      },
      {
        description: 'seq_length equals 12',
        testCode: `assert _ns.get('seq_length') == 12, f"Expected 12, got {_ns.get('seq_length')}"`,
      },
      {
        description: '12 is printed',
        testCode: `assert "12" in _stdout, "Make sure you print(seq_length)"`,
      },
    ],
  },

  {
    id: 4,
    title: 'GC Content',
    tier: 'Nucleotide',
    tierLevel: 1,
    xp: 150,
    icon: '🔬',
    concepts: ['.count()', 'arithmetic'],
    description: `GC content — the percentage of G and C bases — is a key property of any DNA sequence.

Use the \`.count()\` string method to count occurrences of a character:
\`\`\`python
"ATCG".count("A")  # → 1
\`\`\`

For \`sequence = "ATCGCGATCG"\`, calculate the **total** number of G's and C's. Store it in \`gc_count\` and print it.`,
    starterCode: `sequence = "ATCGCGATCG"

# Count G's and C's
gc_count = sequence.count("G") +

print(gc_count)`,
    hints: [
      'Use .count() twice — once for "G" and once for "C".',
      'gc_count = sequence.count("G") + sequence.count("C")',
    ],
    tests: [
      {
        description: 'gc_count is defined',
        testCode: `assert _ns.get('gc_count') is not None, "Variable 'gc_count' not found"`,
      },
      {
        description: 'gc_count equals 6',
        testCode: `assert _ns.get('gc_count') == 6, f"Expected 6 (4 G's + 2 C's in ATCGCGATCG), got {_ns.get('gc_count')}"`,
      },
      {
        description: '6 is printed',
        testCode: `assert "6" in _stdout, "Make sure you print(gc_count)"`,
      },
    ],
  },

  {
    id: 5,
    title: 'RNA Transcription',
    tier: 'Nucleotide',
    tierLevel: 1,
    xp: 150,
    icon: '🔁',
    concepts: ['.replace()', 'strings'],
    description: `During transcription, DNA is converted to RNA by replacing every **T** with **U**.

Use the \`.replace()\` string method:
\`\`\`python
"ATG".replace("T", "U")  # → "AUG"
\`\`\`

Transcribe \`dna = "ATCGATCGTTAA"\` into RNA. Store it in \`rna_sequence\` and print it.`,
    starterCode: `dna = "ATCGATCGTTAA"

# Replace every T with U to get RNA
rna_sequence =

print(rna_sequence)`,
    hints: [
      '`string.replace("old", "new")` replaces all occurrences.',
      'rna_sequence = dna.replace("T", "U")',
    ],
    tests: [
      {
        description: 'rna_sequence is defined',
        testCode: `assert _ns.get('rna_sequence') is not None, "Variable 'rna_sequence' not found"`,
      },
      {
        description: 'rna_sequence is correct',
        testCode: `assert _ns.get('rna_sequence') == "AUCGAUCGUUAA", f"Expected 'AUCGAUCGUUAA', got '{_ns.get('rna_sequence')}'"`,
      },
      {
        description: 'RNA sequence is printed',
        testCode: `assert "AUCGAUCGUUAA" in _stdout, "Make sure you print(rna_sequence)"`,
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // TIER 2 — AMINO ACID  (200–250 XP)
  // ═══════════════════════════════════════════════
  {
    id: 6,
    title: 'Slicing the Genome',
    tier: 'Amino Acid',
    tierLevel: 2,
    xp: 200,
    icon: '✂️',
    concepts: ['string slicing', 'indexing'],
    description: `Extract specific regions from a genome using Python **slicing**: \`sequence[start:end]\` (0-indexed, end is exclusive).

\`\`\`python
"ATCGATCG"[0:3]  # → "ATC"
"ATCGATCG"[:3]   # → "ATC"   (start defaults to 0)
"ATCGATCG"[3:]   # → "GATCG" (end defaults to len)
\`\`\`

From \`genome = "TATAATGCGATCGTTAA"\`:
- Store the **first 6 characters** in \`promoter\`
- Store characters **6 to 12** in \`coding_region\`
- Print both`,
    starterCode: `genome = "TATAATGCGATCGTTAA"

# First 6 characters — the promoter region
promoter =

# Characters 6 to 12 — the coding region
coding_region =

print(f"Promoter: {promoter}")
print(f"Coding region: {coding_region}")`,
    hints: [
      'Slicing: `genome[:6]` gives the first 6 characters.',
      'promoter = genome[:6]',
      'coding_region = genome[6:12]',
    ],
    tests: [
      {
        description: 'promoter equals "TATAAT"',
        testCode: `assert _ns.get('promoter') == "TATAAT", f"Expected 'TATAAT', got '{_ns.get('promoter')}'"`,
      },
      {
        description: 'coding_region equals "GCGATC"',
        testCode: `assert _ns.get('coding_region') == "GCGATC", f"Expected 'GCGATC', got '{_ns.get('coding_region')}'"`,
      },
      {
        description: 'Both regions are printed',
        testCode: `assert "TATAAT" in _stdout and "GCGATC" in _stdout, "Make sure you print both regions"`,
      },
    ],
  },

  {
    id: 7,
    title: 'Protein Inventory',
    tier: 'Amino Acid',
    tierLevel: 2,
    xp: 200,
    icon: '🧫',
    concepts: ['lists', 'indexing', 'len()'],
    description: `A Python **list** stores multiple items in order: \`["item1", "item2", "item3"]\`

Create a list named \`proteins\` containing: \`"Hemoglobin"\`, \`"Insulin"\`, \`"Collagen"\`, \`"Actin"\`.

Then:
1. Print the **first** protein (index \`0\`)
2. Print the **last** protein (index \`-1\`)
3. Print the total **count** using \`len()\``,
    starterCode: `# Create a list of proteins found in a cell sample
proteins = ["Hemoglobin", "Insulin",

# Print the first protein
print(proteins[0])

# Print the last protein
print(proteins[-1])

# Print the total number of proteins
print(len(proteins))`,
    hints: [
      'List: `["item1", "item2", ...]`',
      'proteins = ["Hemoglobin", "Insulin", "Collagen", "Actin"]',
      '`proteins[-1]` gives the last element.',
    ],
    tests: [
      {
        description: 'proteins list has exactly 4 items',
        testCode: `p = _ns.get('proteins', []); assert len(p) == 4, f"Expected 4 proteins, got {len(p)}"`,
      },
      {
        description: 'proteins contains all four proteins',
        testCode: `p = _ns.get('proteins', []); assert set(p) == {"Hemoglobin","Insulin","Collagen","Actin"}, f"Missing proteins: {set(p)}"`,
      },
      {
        description: '"Hemoglobin" and "Actin" are printed',
        testCode: `assert "Hemoglobin" in _stdout and "Actin" in _stdout, "Expected Hemoglobin and Actin in output"`,
      },
      {
        description: 'Count 4 is printed',
        testCode: `assert "4" in _stdout, "Expected the count '4' in output"`,
      },
    ],
  },

  {
    id: 8,
    title: 'Temperature Converter',
    tier: 'Amino Acid',
    tierLevel: 2,
    xp: 200,
    icon: '🌡️',
    concepts: ['arithmetic', 'variables', 'round()'],
    description: `Your incubator shows **Fahrenheit** but your protocol requires **Celsius**.

Formula: \`celsius = (fahrenheit - 32) × 5 / 9\`

Convert \`98.6 °F\` (body temperature — important for enzyme assays). Store the result in \`celsius\` and print it **rounded to 1 decimal place** using \`round(value, 1)\`.`,
    starterCode: `fahrenheit = 98.6

# Convert to Celsius
celsius =

# Print rounded to 1 decimal place
print(round(celsius, 1))`,
    hints: [
      'celsius = (fahrenheit - 32) * 5 / 9',
      '`round(number, decimal_places)` rounds to n decimals.',
    ],
    tests: [
      {
        description: 'celsius ≈ 37.0',
        testCode: `c = _ns.get('celsius'); assert c is not None and abs(c - 37.0) < 0.01, f"Expected ~37.0, got {c}"`,
      },
      {
        description: '"37.0" is printed',
        testCode: `assert "37.0" in _stdout, f"Expected '37.0' in output, got: {_stdout.strip()}"`,
      },
    ],
  },

  {
    id: 9,
    title: 'Cell Counter',
    tier: 'Amino Acid',
    tierLevel: 2,
    xp: 250,
    icon: '🔢',
    concepts: ['for loops', 'accumulator pattern'],
    description: `You're counting cells across 5 microscopy fields. Use a **for loop** to sum the counts.

\`\`\`python
for item in my_list:
    # item takes each value in turn
\`\`\`

Accumulate the total in \`total_cells\` starting at \`0\`, then print it.`,
    starterCode: `cell_counts = [23, 45, 12, 67, 34]
total_cells = 0

# Sum all counts using a for loop
for count in cell_counts:


print(f"Total cells: {total_cells}")`,
    hints: [
      'Inside the loop, add `count` to `total_cells`.',
      '`total_cells += count`  (same as `total_cells = total_cells + count`)',
    ],
    tests: [
      {
        description: 'total_cells equals 181',
        testCode: `assert _ns.get('total_cells') == 181, f"Expected 181, got {_ns.get('total_cells')}"`,
      },
      {
        description: '"Total cells: 181" is printed',
        testCode: `assert "181" in _stdout, f"Expected '181' in output"`,
      },
    ],
  },

  {
    id: 10,
    title: 'Mutation Alert',
    tier: 'Amino Acid',
    tierLevel: 2,
    xp: 250,
    icon: '⚠️',
    concepts: ['if/else', 'in operator', 'conditionals'],
    description: `Check whether a known mutation pattern exists in a DNA sequence.

Use the \`in\` keyword inside an **if/else** statement:
\`\`\`python
if "pattern" in sequence:
    print("Found!")
else:
    print("Not found")
\`\`\`

If \`mutation\` is in \`sequence\`, print \`"Mutation detected!"\`, otherwise print \`"Sequence is normal"\`.`,
    starterCode: `sequence = "ATCGTTTAAACGATCG"
mutation = "TTTAAA"

# Check if the mutation is present
if mutation in sequence:

else:
    `,
    hints: [
      '`if mutation in sequence:` checks if the pattern exists.',
      'print("Mutation detected!") in the if block.',
      'print("Sequence is normal") in the else block.',
    ],
    tests: [
      {
        description: '"Mutation detected!" is printed',
        testCode: `assert "Mutation detected!" in _stdout, f"Expected 'Mutation detected!' but got: '{_stdout.strip()}'"`,
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // TIER 3 — ORGANELLE  (350–400 XP)
  // ═══════════════════════════════════════════════
  {
    id: 11,
    title: 'Codon Dictionary',
    tier: 'Organelle',
    tierLevel: 3,
    xp: 350,
    icon: '📖',
    concepts: ['dictionaries', 'key-value pairs'],
    description: `The genetic code maps codons to amino acids — a perfect use case for a Python **dictionary**.

\`\`\`python
d = {"key": "value", "key2": "value2"}
d["key"]  # → "value"
\`\`\`

Create \`codon_table\` with these mappings:
| Codon | Amino Acid |
|-------|-----------|
| \`"AUG"\` | \`"Methionine"\` |
| \`"UUU"\` | \`"Phenylalanine"\` |
| \`"UAA"\` | \`"STOP"\` |

Then look up \`"AUG"\`, store in \`amino_acid\`, and print it.`,
    starterCode: `# Build the codon lookup table
codon_table = {
    "AUG": "Methionine",


}

# Look up the amino acid for AUG
amino_acid = codon_table["AUG"]

print(amino_acid)`,
    hints: [
      'Dict syntax: `{"key": "value", "key2": "value2"}`',
      'Add: `"UUU": "Phenylalanine"` and `"UAA": "STOP"`',
      '`codon_table["AUG"]` retrieves the value for key "AUG".',
    ],
    tests: [
      {
        description: 'codon_table has 3 entries',
        testCode: `ct = _ns.get('codon_table', {}); assert len(ct) == 3, f"Expected 3 entries in codon_table, got {len(ct)}"`,
      },
      {
        description: 'Codon mappings are correct',
        testCode: `ct = _ns.get('codon_table', {}); assert ct.get("AUG") == "Methionine" and ct.get("UUU") == "Phenylalanine" and ct.get("UAA") == "STOP", "Missing or incorrect codon mappings"`,
      },
      {
        description: 'amino_acid is "Methionine"',
        testCode: `assert _ns.get('amino_acid') == "Methionine", f"Expected 'Methionine', got '{_ns.get('amino_acid')}'"`,
      },
      {
        description: '"Methionine" is printed',
        testCode: `assert "Methionine" in _stdout, "Expected 'Methionine' in output"`,
      },
    ],
  },

  {
    id: 12,
    title: 'Expression Filter',
    tier: 'Organelle',
    tierLevel: 3,
    xp: 350,
    icon: '📊',
    concepts: ['loops', 'conditionals', 'list.append()'],
    description: `You have RNA-seq data. Only genes with expression **> 5.0** are considered significant.

Iterate over \`expression_data\` (a dict) using \`.items()\` which yields \`(key, value)\` pairs:
\`\`\`python
for gene, level in expression_data.items():
    ...
\`\`\`

Collect significant gene names into \`expressed_genes\` list and print it.`,
    starterCode: `expression_data = {
    "BRCA1": 7.2, "TP53": 3.1, "EGFR": 8.9,
    "MYC": 4.5, "KRAS": 6.7, "PTEN": 1.2
}

expressed_genes = []

# Collect genes with expression level > 5.0
for gene, level in expression_data.items():
    if level > 5.0:


print(expressed_genes)`,
    hints: [
      '`.items()` yields `(key, value)` pairs from a dict.',
      '`expressed_genes.append(gene)` adds to the list.',
    ],
    tests: [
      {
        description: 'expressed_genes is a list',
        testCode: `assert isinstance(_ns.get('expressed_genes'), list), "expressed_genes should be a list"`,
      },
      {
        description: 'expressed_genes contains BRCA1, EGFR, KRAS',
        testCode: `eg = set(_ns.get('expressed_genes', [])); assert eg == {"BRCA1","EGFR","KRAS"}, f"Expected {{BRCA1, EGFR, KRAS}}, got {eg}"`,
      },
      {
        description: 'List is printed',
        testCode: `assert "BRCA1" in _stdout and "EGFR" in _stdout and "KRAS" in _stdout, "Print the expressed_genes list"`,
      },
    ],
  },

  {
    id: 13,
    title: 'Reverse Complement',
    tier: 'Organelle',
    tierLevel: 3,
    xp: 400,
    icon: '🔃',
    concepts: ['string reversal', '.replace()', 'method chaining'],
    description: `The reverse complement is essential for PCR primer design.

**Steps:**
1. Reverse the sequence: \`seq[::-1]\`
2. Replace each base A↔T, G↔C

**Trick:** use a temporary character to avoid double-replacing:
\`\`\`python
"ATCG"
 .replace("A", "x").replace("T", "A").replace("x", "T")
 .replace("G", "y").replace("C", "G").replace("y", "C")
\`\`\`

Compute the reverse complement of \`dna = "ATCGATCG"\`. Store it in \`reverse_complement\` and print it.`,
    starterCode: `dna = "ATCGATCG"

# Step 1: reverse the sequence
reversed_dna = dna[::-1]

# Step 2: complement (use temp chars to avoid double-replacing)
reverse_complement = (reversed_dna
    .replace("A", "x").replace("T", "A").replace("x", "T")
    # Add G↔C replacements here...
)

print(reverse_complement)`,
    hints: [
      '`dna[::-1]` reverses a string.',
      'Chain: `.replace("G", "y").replace("C", "G").replace("y", "C")`',
      'Expected: "CGATCGAT"',
    ],
    tests: [
      {
        description: 'reverse_complement equals "CGATCGAT"',
        testCode: `rc = _ns.get('reverse_complement'); assert rc == "CGATCGAT", f"Expected 'CGATCGAT', got '{rc}'"`,
      },
      {
        description: '"CGATCGAT" is printed',
        testCode: `assert "CGATCGAT" in _stdout, "Make sure you print(reverse_complement)"`,
      },
    ],
  },

  {
    id: 14,
    title: 'Lab Statistics',
    tier: 'Organelle',
    tierLevel: 3,
    xp: 400,
    icon: '📈',
    concepts: ['sum()', 'min()', 'max()', 'round()'],
    description: `Analyse absorbance readings from a spectrophotometer.

Python has built-in aggregate functions: \`sum()\`, \`min()\`, \`max()\`, \`len()\`.

Calculate:
1. **mean** = \`sum(values) / len(values)\`
2. **min** and **max**

Store in \`mean_abs\`, \`min_abs\`, \`max_abs\`. Print each rounded to **3 decimal places**.`,
    starterCode: `absorbances = [0.423, 0.517, 0.389, 0.601, 0.445, 0.523, 0.412]

# Calculate statistics
mean_abs =
min_abs =
max_abs =

print(f"Mean: {round(mean_abs, 3)}")
print(f"Min:  {round(min_abs, 3)}")
print(f"Max:  {round(max_abs, 3)}")`,
    hints: [
      'mean_abs = sum(absorbances) / len(absorbances)',
      'Python has built-in `min()` and `max()` functions.',
    ],
    tests: [
      {
        description: 'mean_abs ≈ 0.473',
        testCode: `m = _ns.get('mean_abs'); assert m is not None and abs(m - 0.47285714) < 0.001, f"Expected ~0.473, got {m}"`,
      },
      {
        description: 'min_abs equals 0.389',
        testCode: `assert _ns.get('min_abs') == 0.389, f"Expected 0.389, got {_ns.get('min_abs')}"`,
      },
      {
        description: 'max_abs equals 0.601',
        testCode: `assert _ns.get('max_abs') == 0.601, f"Expected 0.601, got {_ns.get('max_abs')}"`,
      },
    ],
  },

  {
    id: 15,
    title: 'Reusable Assay',
    tier: 'Organelle',
    tierLevel: 3,
    xp: 400,
    icon: '⚗️',
    concepts: ['def', 'parameters', 'return', 'default arguments'],
    description: `Good science is **reproducible**. Write a function \`calculate_concentration\` that:

- Takes \`absorbance\` (float) and \`extinction_coefficient\` (float, **default 21.0**)
- **Returns** \`absorbance / extinction_coefficient\`

Then call it with \`absorbance = 0.84\` and print the result rounded to **4 decimal places**.`,
    starterCode: `def calculate_concentration(absorbance, extinction_coefficient=21.0):
    # Return absorbance divided by extinction_coefficient


# Test your function
result = calculate_concentration(0.84)
print(round(result, 4))`,
    hints: [
      'Use the `return` keyword: `return value`',
      'return absorbance / extinction_coefficient',
      'Expected output: 0.04',
    ],
    tests: [
      {
        description: 'calculate_concentration is defined',
        testCode: `assert callable(_ns.get('calculate_concentration')), "Function 'calculate_concentration' not found"`,
      },
      {
        description: 'Returns correct value for (0.84)',
        testCode: `f = _ns['calculate_concentration']; r = f(0.84); assert abs(r - 0.04) < 0.0001, f"Expected ~0.04, got {r}"`,
      },
      {
        description: 'Default extinction coefficient works',
        testCode: `f = _ns['calculate_concentration']; r = f(0.5, 10.0); assert abs(r - 0.05) < 0.0001, f"Expected 0.05 for (0.5, 10.0), got {r}"`,
      },
      {
        description: '"0.04" is printed',
        testCode: `assert "0.04" in _stdout, f"Expected '0.04' in output, got: {_stdout.strip()}"`,
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // TIER 4 — ORGANISM  (500 XP)
  // ═══════════════════════════════════════════════
  {
    id: 16,
    title: 'Unique Gene Finder',
    tier: 'Organism',
    tierLevel: 4,
    xp: 500,
    icon: '🔍',
    concepts: ['sets', 'set operations', 'sorted()'],
    description: `Two labs sequenced the same sample and found overlapping but different gene lists. Find the genes unique to **either** lab (symmetric difference).

Python **sets** enable efficient comparison:
\`\`\`python
set(list)    # convert list → set
setA ^ setB  # symmetric difference
setA - setB  # only in A
setA & setB  # intersection
\`\`\`

Store unique genes in \`unique_genes\`. Print each gene **sorted alphabetically**, one per line.`,
    starterCode: `lab_a_genes = ["BRCA1", "TP53", "EGFR", "MYC", "KRAS"]
lab_b_genes = ["TP53", "EGFR", "PTEN", "ALK", "MYC"]

# Genes present in one lab but not both
unique_genes =

# Print sorted, one per line
for gene in sorted(unique_genes):
    print(gene)`,
    hints: [
      'Convert to sets first: `set(lab_a_genes)`',
      '`^` gives the symmetric difference (items in A or B but not both).',
      'unique_genes = set(lab_a_genes) ^ set(lab_b_genes)',
    ],
    tests: [
      {
        description: 'unique_genes contains {ALK, BRCA1, KRAS, PTEN}',
        testCode: `ug = set(_ns.get('unique_genes', set())); assert ug == {"BRCA1","KRAS","PTEN","ALK"}, f"Expected {{ALK, BRCA1, KRAS, PTEN}}, got {ug}"`,
      },
      {
        description: 'Genes printed in alphabetical order',
        testCode: `lines = [l.strip() for l in _stdout.strip().split('\\n') if l.strip()]; assert lines == sorted(lines), f"Not alphabetical: {lines}"`,
      },
      {
        description: 'All 4 unique genes are printed',
        testCode: `assert all(g in _stdout for g in ["ALK","BRCA1","KRAS","PTEN"]), "Not all unique genes printed"`,
      },
    ],
  },

  {
    id: 17,
    title: 'Translate Codons',
    tier: 'Organism',
    tierLevel: 4,
    xp: 500,
    icon: '🔤',
    concepts: ['range(step)', 'dict.get()', 'string building', 'break'],
    description: `Translate an RNA sequence into a protein!

**Algorithm:**
1. Iterate over the RNA in steps of 3: \`range(0, len(rna), 3)\`
2. Extract each codon: \`rna[i:i+3]\`
3. Look it up in the codon table
4. Stop at a stop codon (\`"*"\`)
5. Append the amino acid to \`protein\`

Print the final protein string.`,
    starterCode: `codon_table = {
    "AUG": "M", "UUU": "F", "UUC": "F", "UUA": "L",
    "UCU": "S", "UAU": "Y", "UGU": "C", "UGG": "W",
    "CGU": "R", "AUU": "I", "AAU": "N", "ACU": "T",
    "GAU": "D", "GGU": "G", "GCU": "A", "GUU": "V",
    "UAA": "*", "UAG": "*", "UGA": "*"
}

rna = "AUGUUUUCUUAUUGGUGA"
protein = ""

# Iterate in steps of 3
for i in range(0, len(rna), 3):
    codon = rna[i:i+3]
    amino_acid = codon_table.get(codon, "?")
    if amino_acid == "*":
        break
    protein += amino_acid

print(protein)`,
    hints: [
      '`range(0, len(rna), 3)` gives indices 0, 3, 6, 9…',
      '`rna[i:i+3]` extracts the codon at position i.',
      'Expected output: MFSYW',
    ],
    tests: [
      {
        description: 'protein equals "MFSYW"',
        testCode: `p = _ns.get('protein'); assert p == "MFSYW", f"Expected 'MFSYW', got '{p}'"`,
      },
      {
        description: '"MFSYW" is printed',
        testCode: `assert "MFSYW" in _stdout, f"Expected 'MFSYW' in output"`,
      },
    ],
  },

  {
    id: 18,
    title: 'K-mer Counter',
    tier: 'Organism',
    tierLevel: 4,
    xp: 500,
    icon: '🧮',
    concepts: ['dict.get()', 'sliding window', 'sorted()'],
    description: `K-mer frequency analysis is fundamental in bioinformatics. Count all **3-mers** (overlapping) in a DNA sequence.

Use a sliding window:
\`\`\`python
for i in range(len(seq) - k + 1):
    kmer = seq[i:i+k]
\`\`\`

Store counts in \`kmer_counts\` dict. Print each k-mer and its count, **sorted alphabetically**.

Tip: \`kmer_counts[kmer] = kmer_counts.get(kmer, 0) + 1\``,
    starterCode: `sequence = "ATCGATCGATCG"
kmer_counts = {}
k = 3

# Count all 3-mers
for i in range(len(sequence) - k + 1):
    kmer = sequence[i:i+k]
    # Increment count (default 0 if not seen yet)


# Print sorted
for kmer in sorted(kmer_counts):
    print(f"{kmer}: {kmer_counts[kmer]}")`,
    hints: [
      '`dict.get(key, default)` returns the value or a default if missing.',
      'kmer_counts[kmer] = kmer_counts.get(kmer, 0) + 1',
      'ATC and TCG each appear 3 times.',
    ],
    tests: [
      {
        description: 'kmer_counts is a dictionary',
        testCode: `assert isinstance(_ns.get('kmer_counts'), dict), "kmer_counts should be a dict"`,
      },
      {
        description: 'ATC appears 3 times',
        testCode: `kc = _ns.get('kmer_counts', {}); assert kc.get('ATC') == 3, f"Expected ATC:3, got ATC:{kc.get('ATC')}"`,
      },
      {
        description: 'TCG appears 3 times',
        testCode: `kc = _ns.get('kmer_counts', {}); assert kc.get('TCG') == 3, f"Expected TCG:3, got TCG:{kc.get('TCG')}"`,
      },
      {
        description: 'K-mers are printed sorted',
        testCode: `assert "ATC" in _stdout and "3" in _stdout, "Print the k-mer counts"`,
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // TIER 5 — ECOSYSTEM  (750–1000 XP)
  // ═══════════════════════════════════════════════
  {
    id: 19,
    title: 'FASTA Parser',
    tier: 'Ecosystem',
    tierLevel: 5,
    xp: 750,
    icon: '🌐',
    concepts: ['string parsing', 'multi-line loops', 'dictionaries'],
    description: `FASTA is the universal format for biological sequences. Parse a multi-FASTA string into a dict mapping **name → sequence**.

Format:
\`\`\`
>GeneName optional description
SEQUENCEDATA
\`\`\`

Lines starting with \`>\` are headers. The name is the **first word** after \`>\`.

Complete the parser and print each name with its sequence length (in bp).`,
    starterCode: `fasta_data = """>BRCA1 breast cancer susceptibility gene
ATCGATCGATCGATCG
>TP53 tumor suppressor
GCTAGCTAGCTAGCTA
>EGFR epidermal growth factor receptor
TTAATTAATTAATTAA"""

sequences = {}
current_name = None
current_seq = []

for line in fasta_data.strip().split("\\n"):
    if line.startswith(">"):
        if current_name:
            sequences[current_name] = "".join(current_seq)
            current_seq = []
        current_name = line[1:].split()[0]  # first word after >
    else:
        current_seq.append(line)

# Don't forget to save the last sequence!


for name, seq in sequences.items():
    print(f"{name}: {len(seq)} bp")`,
    hints: [
      'After the loop ends, the last sequence has not been saved yet.',
      'Add: `if current_name: sequences[current_name] = "".join(current_seq)`',
      'Each sequence is 16 bp.',
    ],
    tests: [
      {
        description: 'sequences dict has 3 entries',
        testCode: `s = _ns.get('sequences', {}); assert len(s) == 3, f"Expected 3 sequences, got {len(s)}"`,
      },
      {
        description: 'BRCA1 sequence is correct',
        testCode: `s = _ns.get('sequences', {}); assert s.get('BRCA1') == 'ATCGATCGATCGATCG', f"BRCA1 sequence wrong: '{s.get('BRCA1')}'"`,
      },
      {
        description: 'TP53 sequence is correct',
        testCode: `s = _ns.get('sequences', {}); assert s.get('TP53') == 'GCTAGCTAGCTAGCTA', "TP53 sequence wrong"`,
      },
      {
        description: 'EGFR sequence is correct',
        testCode: `s = _ns.get('sequences', {}); assert s.get('EGFR') == 'TTAATTAATTAATTAA', "EGFR sequence wrong"`,
      },
      {
        description: 'Sequence lengths (16 bp) are printed',
        testCode: `assert "16" in _stdout, "Expected '16 bp' in output"`,
      },
    ],
  },

  {
    id: 20,
    title: 'The Grand Pipeline',
    tier: 'Ecosystem',
    tierLevel: 5,
    xp: 1000,
    icon: '🏆',
    concepts: ['functions', 'dicts', 'all Python fundamentals'],
    description: `**The final challenge!** Build a complete DNA analysis pipeline.

Write \`analyze_sequence(dna)\` that returns a dict with:
| Key | Value |
|-----|-------|
| \`"length"\` | number of bases |
| \`"gc_content"\` | % G+C, rounded to 2 dp |
| \`"rna"\` | RNA transcript (T→U) |
| \`"reverse_complement"\` | reverse complement |

Test it on \`"ATCGCGATCG"\` and print each key: value pair.`,
    starterCode: `def analyze_sequence(dna):
    length = len(dna)

    gc_count = dna.count("G") + dna.count("C")
    gc_content = round((gc_count / length) * 100, 2)

    rna = dna.replace("T", "U")

    rev = dna[::-1]
    reverse_complement = (rev
        .replace("A", "x").replace("T", "A").replace("x", "T")
        .replace("G", "y").replace("C", "G").replace("y", "C")
    )

    return {
        "length": length,
        "gc_content": gc_content,
        "rna": rna,
        "reverse_complement": reverse_complement
    }

result = analyze_sequence("ATCGCGATCG")

for key, value in result.items():
    print(f"{key}: {value}")`,
    hints: [
      'The starter code is nearly complete — read through it carefully.',
      'GC content: `round((gc_count / length) * 100, 2)`',
      'Expected reverse complement: "CGATCGCGAT"',
    ],
    tests: [
      {
        description: 'analyze_sequence is callable',
        testCode: `assert callable(_ns.get('analyze_sequence')), "Function 'analyze_sequence' not found"`,
      },
      {
        description: 'length is 10',
        testCode: `f = _ns['analyze_sequence']; r = f("ATCGCGATCG"); assert r.get('length') == 10, f"Expected length 10, got {r.get('length')}"`,
      },
      {
        description: 'gc_content is 60.0%',
        testCode: `f = _ns['analyze_sequence']; r = f("ATCGCGATCG"); assert abs(r.get('gc_content', 0) - 60.0) < 0.1, f"Expected 60.0%, got {r.get('gc_content')}"`,
      },
      {
        description: 'rna is "AUCGCGAUCG"',
        testCode: `f = _ns['analyze_sequence']; r = f("ATCGCGATCG"); assert r.get('rna') == 'AUCGCGAUCG', f"Expected 'AUCGCGAUCG', got {r.get('rna')}"`,
      },
      {
        description: 'reverse_complement is "CGATCGCGAT"',
        testCode: `f = _ns['analyze_sequence']; r = f("ATCGCGATCG"); assert r.get('reverse_complement') == 'CGATCGCGAT', f"Expected 'CGATCGCGAT', got {r.get('reverse_complement')}"`,
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // BUG HUNT CHALLENGES — find and fix the bugs!
  // ═══════════════════════════════════════════════════
  {
    id: 21,
    title: 'Debug: Case Blindness',
    tier: 'Bug Hunt',
    tierLevel: 3,
    type: 'bugHunt',
    xp: 300,
    icon: '🐛',
    concepts: ['string methods', 'case sensitivity'],
    description: `🐛 **This code has a bug — find it and fix it!**

The function below should count G and C nucleotides in a DNA sequence, but it always returns \`0\`.

Run the code to see the wrong output, then find and fix the bug. The correct answer for \`"GCTAGCTAGCTA"\` is \`6\`.

> **Hint:** Python strings are case-sensitive. \`"g" != "G"\``,
    starterCode: `sequence = "GCTAGCTAGCTA"

# Count GC content — but something is wrong...
g_count = sequence.count("g")
c_count = sequence.count("c")
gc_count = g_count + c_count

print(gc_count)`,
    hints: [
      'Run the code. What does it print?',
      'Python\'s .count() is case-sensitive. "GCTA".count("g") → 0',
      'Fix: use uppercase "G" and "C"',
    ],
    tests: [
      {
        description: 'gc_count equals 6',
        testCode: `assert _ns.get('gc_count') == 6, f"Expected 6, got {_ns.get('gc_count')} — check case sensitivity in .count()"`,
      },
      {
        description: '6 is printed',
        testCode: `assert "6" in _stdout, "Expected '6' in output"`,
      },
    ],
  },

  {
    id: 22,
    title: 'Debug: Missing Factor',
    tier: 'Bug Hunt',
    tierLevel: 3,
    type: 'bugHunt',
    xp: 300,
    icon: '🐛',
    concepts: ['arithmetic', 'percentages'],
    description: `🐛 **This code has a bug — find it and fix it!**

This script should calculate GC content as a **percentage** (0–100), but it outputs a decimal between 0 and 1 instead.

For \`"ATCGCGATCG"\` the correct answer is \`60.0\`.

> **Hint:** To convert a fraction to a percentage, multiply by 100.`,
    starterCode: `sequence = "ATCGCGATCG"

gc = sequence.count("G") + sequence.count("C")
percentage = gc / len(sequence)   # something missing here...

print(round(percentage, 1))`,
    hints: [
      'What does dividing give you? A number between 0 and 1.',
      'To get a percentage, multiply by 100.',
      'percentage = (gc / len(sequence)) * 100',
    ],
    tests: [
      {
        description: 'percentage equals 60.0',
        testCode: `p = _ns.get('percentage'); assert p is not None and abs(p - 60.0) < 0.01, f"Expected 60.0, got {p}"`,
      },
      {
        description: '"60.0" is printed',
        testCode: `assert "60.0" in _stdout, f"Expected '60.0' in output, got: {_stdout.strip()}"`,
      },
    ],
  },

  {
    id: 23,
    title: 'Debug: Off-By-One Codon',
    tier: 'Bug Hunt',
    tierLevel: 3,
    type: 'bugHunt',
    xp: 400,
    icon: '🐛',
    concepts: ['range()', 'string slicing', 'off-by-one'],
    description: `🐛 **This code has a bug — find it and fix it!**

This script slices an RNA sequence into codons (3-letter groups: AUG, UUU, …). But the step size is wrong, so the codons overlap and the result is incorrect.

For \`"AUGUUUCGUUGA"\` the correct codons are \`['AUG', 'UUU', 'CGU', 'UGA']\`.

> **Hint:** Codons are exactly **3** bases long. What should the step be in \`range()\`?`,
    starterCode: `rna = "AUGUUUCGUUGA"
codons = []

for i in range(0, len(rna), 4):   # bug is on this line
    codons.append(rna[i:i+3])

print(codons)`,
    hints: [
      'Run the code. How many codons does it produce?',
      'Codons are 3 bases long, so you step by 3, not 4.',
      'Change 4 → 3 in range()',
    ],
    tests: [
      {
        description: 'codons equals [\'AUG\', \'UUU\', \'CGU\', \'UGA\']',
        testCode: `c = _ns.get('codons', []); assert c == ['AUG','UUU','CGU','UGA'], f"Expected ['AUG','UUU','CGU','UGA'], got {c}"`,
      },
      {
        description: 'Codons are printed',
        testCode: `assert "AUG" in _stdout and "CGU" in _stdout, "Print the codons list"`,
      },
    ],
  },

  {
    id: 24,
    title: 'Debug: Wrong Value Appended',
    tier: 'Bug Hunt',
    tierLevel: 4,
    type: 'bugHunt',
    xp: 400,
    icon: '🐛',
    concepts: ['dict.items()', 'list.append()', 'variables'],
    description: `🐛 **This code has a bug — find it and fix it!**

This script should collect the **names** of large proteins (molecular weight > 50,000 Da) but it's appending the wrong thing.

For the given dict, the correct output is \`['Albumin', 'Hemoglobin']\`.

> **Hint:** In a \`for name, weight in dict.items():\` loop — you have two variables. Are you appending the right one?`,
    starterCode: `proteins = {
    "Insulin": 5733, "Albumin": 69000,
    "Hemoglobin": 64000, "Lysozyme": 14300
}

large = []
for name, weight in proteins.items():
    if weight > 50000:
        large.append(weight)   # bug is on this line

print(sorted(large))`,
    hints: [
      'Run it. What does it print? Numbers or names?',
      'You want to collect protein names, not their weights.',
      'Change large.append(weight) → large.append(name)',
    ],
    tests: [
      {
        description: 'large contains protein names (not numbers)',
        testCode: `l = _ns.get('large', []); assert all(isinstance(x, str) for x in l), f"Expected strings (names), got: {l}"`,
      },
      {
        description: 'large equals [\'Albumin\', \'Hemoglobin\'] (sorted)',
        testCode: `l = sorted(_ns.get('large', [])); assert l == ['Albumin','Hemoglobin'], f"Expected ['Albumin','Hemoglobin'], got {l}"`,
      },
      {
        description: 'Sorted names are printed',
        testCode: `assert "Albumin" in _stdout and "Hemoglobin" in _stdout, "Print the sorted list of large protein names"`,
      },
    ],
  },

  {
    id: 25,
    title: 'Debug: Frozen Counter',
    tier: 'Bug Hunt',
    tierLevel: 4,
    type: 'bugHunt',
    xp: 500,
    icon: '🐛',
    concepts: ['dict counters', 'increment bug', 'functions'],
    description: `🐛 **This code has a bug — find it and fix it!**

This function counts how many times each amino acid appears in a protein sequence. But all counts come out as \`1\` — even for amino acids that appear multiple times.

For \`"MFSYWMM"\`, the correct output is \`{'M': 3, 'F': 1, 'S': 1, 'Y': 1, 'W': 1}\`.

> **Hint:** Look very carefully at the line inside the loop. Is it actually incrementing the count?`,
    starterCode: `def count_aas(seq):
    counts = {}
    for aa in seq:
        if aa not in counts:
            counts[aa] = 1
        counts[aa] = counts[aa] + 0   # bug is on this line

    return counts

result = count_aas("MFSYWMM")
print(result)`,
    hints: [
      'Run it. What does it print for M? Should be 3.',
      'The counter never increments — look at what you\'re adding.',
      'Change + 0 → + 1',
    ],
    tests: [
      {
        description: 'count_aas is callable',
        testCode: `assert callable(_ns.get('count_aas')), "Function 'count_aas' not found"`,
      },
      {
        description: 'M is counted 3 times',
        testCode: `f = _ns['count_aas']; r = f("MFSYWMM"); assert r.get('M') == 3, f"Expected M:3, got M:{r.get('M')}"`,
      },
      {
        description: 'All amino acids counted correctly',
        testCode: `f = _ns['count_aas']; r = f("MFSYWMM"); assert r == {'M':3,'F':1,'S':1,'Y':1,'W':1}, f"Expected correct counts, got {r}"`,
      },
      {
        description: 'Result is printed',
        testCode: `assert "M" in _stdout and "3" in _stdout, "Print the result dict"`,
      },
    ],
  },
];

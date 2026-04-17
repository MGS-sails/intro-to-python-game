# Python for Life Scientists (R Users)

## Core Philosophy

Frame everything comparatively — "you already know this in R, here's the Python equivalent." Leverage their statistical intuition while easing the syntax shift.

---

## Module 1 — Orientation & Setup

The "why Python too" pitch: ecosystem (ML/AI, pipelines, web APIs), Bioconductor vs Biopython/scanpy, Snakemake, interoperability. Setting up environments (conda/mamba — familiar from Bioconductor), Jupyter notebooks (like RMarkdown), IDEs (VS Code).

## Module 2 — Python Fundamentals (R → Python Translation)

Variable assignment, data types, basic operators. Key gotchas for R users: 0-based indexing, `None` vs `NA`, mutable vs immutable objects, whitespace indentation. Basic I/O: reading/writing CSVs (`pandas` vs `read.csv`).

## Module 3 — Data Structures

Lists, tuples, dicts, sets — and how they map (imperfectly) to R vectors and lists. Why Python lists ≠ R vectors. When to use each.

## Module 4 — Control Flow & Functions

`if/elif/else`, `for`/`while` loops (and why vectorisation matters differently here). Defining functions, default arguments, `*args`/`**kwargs`. List comprehensions as a Pythonic alternative to `sapply`.

## Module 5 — Data Wrangling with Pandas

This is the heart of the course for life scientists. `DataFrame` and `Series` vs `data.frame` and vectors. Selecting, filtering, mutating (`.loc`, `.iloc`, boolean masks). Groupby → `summarise` equivalent. Merging/joining. Tidy data principles carry over from R.

## Module 6 — Numerical Computing with NumPy

Arrays, vectorised operations, broadcasting. Why this underpins everything (pandas, scipy, sklearn). Random number generation — equivalent of `set.seed()`.

## Module 7 — Visualisation

`matplotlib` (the base, like base R graphics) and `seaborn` (the ggplot2 spiritual cousin). Brief intro to `plotly` for interactivity. Reproducing common life science plots: volcano plots, heatmaps, PCA biplots.

## Module 8 — Statistics & Bioinformatics

`scipy.stats` for t-tests, ANOVA, correlation — mapping to familiar R functions. `statsmodels` for linear models. Introduction to Biopython: sequence parsing, BLAST, file format handling (FASTA, GenBank). Optionally: `scanpy` for single-cell if the audience is relevant.

## Module 9 — Working with Files & External Data

File paths (`pathlib` — much cleaner than R), working with compressed files, fetching data from REST APIs (`requests`), parsing JSON. Practical: querying UniProt or Ensembl APIs.

## Module 10 — Reproducibility & Best Practices

Scripts vs notebooks: when to use which. Virtual environments and `requirements.txt`/`environment.yml`. Writing readable, documented code. Introduction to version control with Git (if not already covered).

---

## What to *Skip* for this Audience

- Deep OOP (classes, inheritance) — introduce the concept but don't dwell
- Async programming, decorators, metaclasses
- Web development (Flask/Django)
- Low-level system programming

---

## Pedagogical Tips

- Use biological datasets throughout (gene expression, sequence data, clinical trial data)
- Every session: show the R way first, then Python
- Emphasise that neither language "wins" — the goal is fluency in both

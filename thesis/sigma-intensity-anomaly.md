# The Sigma Intensity Anomaly

**A non-monotonicity in distance-from-sigma discovered by numerical proof verification**

Brian Riggleman · March 31, 2026

---

## What Was Found

When numerically verifying the formal proofs for the thesis, Theorem 3 ("The geometric model reduces to single-axis models as special cases") failed. The claim was: when only valence varies (activation held at σ_a), distance from sigma should increase monotonically with |v − σ_v|. It doesn't.

There is a region near sigma where moving **away** from the personality setpoint in valence actually **decreases** the 3D distance from sigma. The effect is small (0.037 distance units for the deployed configuration) but mathematically real, and it means the single-axis reduction claim is false as stated.

24 of 26 theorem checks passed. These two failures led to this investigation.

---

## How It Was Missed

This is a story about a constant that looked reasonable but violated an unstated invariant.

### The constant

In `constants.py`, on both the Toughbook and the Linux deployment:

```python
SIGMA_VALENCE = 0.4
SIGMA_ACTIVATION = 0.2
SIGMA_INTENSITY = 0.2
SIGMA = (SIGMA_VALENCE, SIGMA_ACTIVATION, SIGMA_INTENSITY)
```

Sigma is (0.4, 0.2, 0.2). The third component — σ_i = 0.2 — is the source of the anomaly.

### Why σ_i = 0.2 looks reasonable

When configuring the agent's personality setpoint, σ_i = 0.2 reads as "the agent has a slight resting intensity — not completely flat, a little bit of baseline engagement." This is an appealing characterization. A personality that's truly at zero intensity would feel inert. Setting it to 0.2 gives the agent a low hum of aliveness at rest.

The value was likely set by analogy with the other two components: σ_v = 0.4 (mildly positive), σ_a = 0.2 (mildly calm), σ_i = 0.2 (mildly present). All three feel like the same kind of parameter — a baseline resting value for each axis.

### Why σ_i = 0.2 is a category error

But intensity is not the same kind of quantity as valence and activation. Here is the definition from the intensity-axis paper:

> Intensity is the magnitude of displacement from sigma in the valence/activation plane.

Intensity is **derived**. It is computed as:

```
I(v, a) = min(1, √((v − σ_v)² + (a − σ_a)²) / √2)
```

When the agent is at rest — at sigma — valence equals σ_v and activation equals σ_a. The displacement in the V/A plane is zero. Therefore intensity is zero. **By definition.**

Setting σ_i = 0.2 says: "The personality setpoint's resting intensity is 0.2." But intensity at sigma is I(σ_v, σ_a) = 0. This is a contradiction. The agent's resting state claims an intensity of 0.2 while the intensity function computes 0. The personality setpoint is not self-consistent.

This inconsistency was never caught because:

1. **Intensity was treated as a free parameter.** All three sigma components were set independently. Nothing in the code enforces that σ_i = I(σ_v, σ_a). They're just three numbers in a tuple.

2. **The inconsistency is invisible at operational distances.** All behavioral thresholds (deception at d ≥ 0.5, nightmare at d ≥ 0.5) are far from sigma. At those distances, the 0.037 dip near sigma is irrelevant. Every experiment, every test, every production heartbeat operated in the region where the anomaly doesn't matter.

3. **Quick-mode tests don't exercise the boundary.** The test suite verifies centroid math, spread monotonicity, deception thresholds — all at significant displacements. No test checks that distance increases monotonically for small perturbations near sigma, because no downstream behavior depends on it.

4. **The formal proofs were the first exhaustive check.** The mathematical claim "reduces to single-axis model" was stated in the thesis but never computationally verified across the full parameter space until the proof test generated 10,000 random trials. 165 of them fell in the non-monotone region.

### The mechanism

Here's exactly what happens. When σ_i = 0.2 and the agent is at rest:

- State = (σ_v, σ_a, 0) — valence and activation are at sigma, but intensity is 0 (computed from displacement)
- But σ = (σ_v, σ_a, 0.2) — sigma claims intensity is 0.2
- So d(s, σ) = √(0 + 0 + (0 − 0.2)²) = 0.2

**The agent at rest is 0.2 distance units away from its own personality setpoint.** It cannot reach sigma because doing so would require intensity = 0.2, but intensity at sigma is 0.

Now move valence slightly away from σ_v. Two things happen:

1. (v − σ_v)² increases — pushing distance **up**
2. I(v, a) increases from 0 toward 0.2 — so (I − σ_i)² = (I − 0.2)² **decreases**, pulling distance **down**

For small displacements, effect #2 dominates. The intensity gap is closing faster than the valence gap is opening. Distance actually drops.

The algebra:

```
d² = (3/2)·δ² − √2·σ_i·|δ| + σ_i²     where δ = v − σ_v
```

This is a quadratic in |δ| with a minimum at:

```
|δ*| = √2·σ_i / 3 ≈ 0.094
```

At that point, distance reaches its minimum of 0.163 (down from 0.200 at σ). Beyond |δ*|, the valence displacement takes over and distance increases normally.

The non-monotone band spans |δ| < 0.094 on each side of σ_v — a total valence range of about 0.19 centered on the personality setpoint. Within this band, the agent is paradoxically "closer to sigma" by being "farther from sigma."

### Why this is subtle

The non-monotonicity only appears when all three conditions hold:

1. σ_i > 0 (the inconsistent constant)
2. The agent is near sigma (|δ| < √2·σ_i/3)
3. Only one axis is varying (the special-case reduction scenario)

In normal operation, multiple axes vary simultaneously, the agent is rarely exactly at sigma, and behavioral thresholds are far from the affected region. The anomaly is real but operationally inert — which is precisely why it survived from the first Toughbook deployment through 14 test runs and three platform ports.

---

## The Fix

### Formal: Constrain σ_i = 0

Add to the thesis Definition 2 (Sigma):

> **Self-consistency constraint:** σ_i = I(σ_v, σ_a) = 0. The personality setpoint must satisfy the intensity function. Since intensity measures displacement from sigma, intensity at sigma is zero by definition.

This eliminates the non-monotonicity entirely. With σ_i = 0:

```
d² = δ² + (|δ|/√2)² = (3/2)·δ²
d = |δ| · √(3/2)
```

Perfectly monotonic. The single-axis reduction theorem holds exactly.

### Code: Update constants.py

```python
SIGMA_INTENSITY = 0.0  # was 0.2 — must be 0 for self-consistency (see sigma-intensity-anomaly.md)
```

### Impact assessment

Changing σ_i from 0.2 to 0.0 affects:

- **Distance from sigma at rest:** Changes from 0.2 to 0.0. The agent at rest is now truly at sigma.
- **Distance from sigma under displacement:** Slightly lower across the board (the 0.2 intensity offset is gone). For a fear state at (−0.8, 0.9, 0.8), distance changes from 1.455 to approximately 1.431.
- **Deception threshold:** Unchanged in practice — the threshold is 0.5, and the 0.024 difference doesn't move any states across the boundary for the tested scenarios.
- **All test results:** Need to re-run to confirm. Expect all 29 tests to still pass, possibly with minor numeric shifts in measured distances.

### What this does NOT affect

- Valence and activation axes — unchanged
- Centroid computation — unchanged (operates on source V/A positions)
- Spread computation — unchanged
- Memory decay, nightmare threshold, confession mechanic — all use distance, which shifts by < 0.03
- All 14 prior test runs — their results documented real behavior of the deployed system with σ_i = 0.2

---

## What This Teaches

1. **Derived quantities should not be independently parameterized.** Intensity is derived from V/A displacement. Giving it an independent resting value creates a contradiction that is invisible until you test the full parameter space.

2. **Operational testing misses boundary anomalies.** Every test and every production run operated at displacements where the anomaly is negligible. Only exhaustive mathematical verification across 10,000 random points caught it.

3. **Constants that "feel right" can encode category errors.** σ_i = 0.2 reads as "a little bit of baseline intensity," which is an intuitive personality trait. But intensity in this model is not a personality trait — it's a displacement magnitude. Zero is the only self-consistent value, even though it reads as "flat."

4. **Formal proofs find things that tests don't.** The thesis test regime (29 tests, 79 checks, 14 runs) validated every operational claim. The formal proof verification (26 theorems, 36 checks, 10,000 random trials per theorem) found a structural inconsistency that no operational test could surface because no operational behavior depends on it.

---

## Updated Proof

**Theorem 3 (corrected).** When σ_i = 0 (the self-consistency constraint) and two of the three axes are held constant at their sigma values, the geometric model reduces to a single-axis model with distance monotonically increasing with displacement from sigma.

**Case 1 (valence only, a = σ_a):**

    I(v, σ_a) = |v − σ_v| / √2
    d(s, σ)² = (v − σ_v)² + (|v − σ_v|/√2)² = (3/2)(v − σ_v)²
    d(s, σ) = |v − σ_v| · √(3/2)

Monotonically increasing in |v − σ_v|. ∎

**Case 2 (activation only, v = σ_v):** By symmetry. ∎

**Case 3 (circumplex, i = σ_i = 0):**

    d(s, σ) = √((v − σ_v)² + (a − σ_a)²)

Standard 2D Euclidean distance. ∎

---

## Timeline

| When | What | Why it didn't catch this |
|------|------|--------------------------|
| ~Feb 2026 | σ_i = 0.2 set in Toughbook constants.py | Looked like a reasonable personality parameter |
| Feb-Mar 2026 | 25 days production deployment | All activity far from the non-monotone region |
| Mar 25-26 | Original 4-scenario centroid validation | Scenarios operate at d > 0.5, anomaly is at d < 0.2 |
| Mar 28-30 | 14 test runs, 29 tests, 79 checks | No test checks monotonicity near sigma |
| Mar 31 | Formal proof verification | First exhaustive random sampling finds 165/10,000 violations |
| Mar 31 | This investigation | Root cause identified: σ_i ≠ 0 is a self-consistency violation |

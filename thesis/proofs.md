# Formal Proofs — Geometric Affective State Representation

**Companion to:** "Geometric Affective State Representation in Synthetic and Human Systems"
**Author:** Brian Riggleman · March 2026 (centroid revision: April 2026)

These proofs formalize the mathematical claims made in Chapter 3 (Theory) and Chapter 4 (Mechanism) of the thesis. Each proof is self-contained and references only the definitions established below.

**Centroid is 3D (canonical).** A source point is a 4-tuple `(v, a, i, w)`. The centroid is a 3D point `(c_v, c_a, c_i)` produced by weight-weighted averaging of all three position coordinates. Spread is the weight-weighted average full 3D Euclidean distance from each source to the centroid. This matches `heartbeat.py compute_centroid` and `heartbeat.py compute_spread` in the running architecture, and `run_thesis_tests.py computed_centroid` in the test regime. An earlier revision of this document defined the centroid in 2D (V/A only) with intensity treated as a derived coordinate. That formulation has been retired. All Theorem 4, 5, and 6 statements and proofs below are in 3D form.

---

## Definitions

**Definition 1 (Affective State Space).** The affective state space is the bounded subset of ℝ³:

    S = [-1, 1] × [-1, 1] × [0, 1]

where the axes are valence (v), activation (a), and intensity (i). A state s ∈ S is a triple s = (v, a, i).

**Definition 2 (Sigma).** The personality setpoint σ = (σ_v, σ_a, σ_i) ∈ S is a fixed point representing the agent's baseline affective state — the position to which the agent returns when no external inputs are active. Sigma is set at deployment and does not change during operation.

**Definition 3 (Intensity Function).** For a state with valence v and activation a, intensity is defined as:

    I(v, a) = ‖(v, a) − (σ_v, σ_a)‖₂ / √2
            = √((v − σ_v)² + (a − σ_a)²) / √2

The division by √2 normalizes the result to [0, 1] given that the maximum displacement in the v/a plane is √((2)² + (2)²) = 2√2...

*Correction:* The maximum displacement occurs when (v, a) and (σ_v, σ_a) are at opposite corners of [-1,1]², giving ‖(v,a) − (σ_v, σ_a)‖₂ ≤ √(2² + 2²) = 2√2. However, intensity is defined with the √2 normalization factor, so I(v, a) ∈ [0, 2] in the worst case. In practice, sigma is interior to the space and typical displacements keep I ≤ 1.0. The implementation clamps to [0, 1].

More precisely: I(v, a) = min(1, √((v − σ_v)² + (a − σ_a)²) / √2).

**Remark (constrained 3D manifold).** Because intensity is derived from valence and activation, a deployed agent's state always satisfies i = I(v, a). The system therefore occupies a constrained 3D manifold inside S rather than a fully independent 3D volume. In human survey extensions, intensity may be measured directly (self-reported) and tested against the computed form; whether the two are equivalent is an open question (Chapter 9 limitations).

**Definition 4 (Distance from Sigma).** For a state s = (v, a, i) and setpoint σ = (σ_v, σ_a, σ_i):

    d(s, σ) = √((v − σ_v)² + (a − σ_a)² + (i − σ_i)²)

This is the standard Euclidean distance in ℝ³ restricted to S.

**Definition 5 (Source Point).** A source point is a tuple p = (v, a, i, w) where (v, a, i) ∈ S is the position and w ∈ (0, 1] is the intensity weight. A set of n active source points is P = {p₁, p₂, ..., pₙ}.

**Definition 6 (Centroid).** Given n ≥ 1 active source points P = {p₁, ..., pₙ} with positions (vᵢ, aᵢ, iᵢ) and weights wᵢ, the centroid is the 3D point obtained by weight-weighted averaging of each position coordinate:

    c_v = Σᵢ(vᵢ · wᵢ) / Σᵢ(wᵢ)
    c_a = Σᵢ(aᵢ · wᵢ) / Σᵢ(wᵢ)
    c_i = Σᵢ(iᵢ · wᵢ) / Σᵢ(wᵢ)

The centroid c = (c_v, c_a, c_i) is itself a point in S. When n = 0 (no active sources), c = σ = (σ_v, σ_a, σ_i) by convention (failsafe rule).

**Definition 7 (Spread).** Given n ≥ 1 active source points with centroid c, spread is the weight-weighted average 3D Euclidean distance from each source to the centroid:

    spread = Σᵢ(d₃(pᵢ, c) · wᵢ) / Σᵢ(wᵢ)

where d₃(pᵢ, c) = √((vᵢ − c_v)² + (aᵢ − c_a)² + (iᵢ − c_i)²) is the full 3D Euclidean distance from source point i to the centroid in the affective state space.

---

## Proof 1: Distance from Sigma is a Metric

**Theorem 1.** The function d: S × S → ℝ defined by d(s, σ) = ‖s − σ‖₂ is a metric on S. Specifically, for all s, s', σ ∈ S:

(a) **Non-negativity:** d(s, σ) ≥ 0

(b) **Identity of indiscernibles:** d(s, σ) = 0 if and only if s = σ

(c) **Symmetry:** d(s, σ) = d(σ, s)

(d) **Triangle inequality:** d(s, s') ≤ d(s, σ) + d(σ, s')

**Proof.**

d is the standard Euclidean distance on ℝ³ restricted to the subset S ⊂ ℝ³. Since S is a subset of a metric space (ℝ³, ‖·‖₂), the restriction inherits all metric properties. We verify each explicitly.

**(a) Non-negativity.** d(s, σ) = √((v − σ_v)² + (a − σ_a)² + (i − σ_i)²). Each squared term is ≥ 0, so their sum is ≥ 0, and the square root of a non-negative real number is non-negative. ∎

**(b) Identity of indiscernibles.**
- If s = σ, then v = σ_v, a = σ_a, i = σ_i, so each squared term is 0, and d(s, σ) = 0.
- If d(s, σ) = 0, then (v − σ_v)² + (a − σ_a)² + (i − σ_i)² = 0. Since each term is non-negative and their sum is 0, each must be 0 individually. Therefore v = σ_v, a = σ_a, i = σ_i, so s = σ. ∎

**(c) Symmetry.** d(s, σ) = √(Σ(sⱼ − σⱼ)²) = √(Σ(σⱼ − sⱼ)²) = d(σ, s), since (sⱼ − σⱼ)² = (σⱼ − sⱼ)². ∎

**(d) Triangle inequality.** This is the Cauchy-Schwarz consequence for Euclidean norms. For any s, s', σ ∈ ℝ³:

    ‖s − s'‖₂ = ‖(s − σ) + (σ − s')‖₂ ≤ ‖s − σ‖₂ + ‖σ − s'‖₂

by the triangle inequality for the Euclidean norm on ℝ³. Since S ⊂ ℝ³ and the inequality holds for all vectors in ℝ³, it holds on S. ∎

**Corollary 1.1 (Bounded Range).** For all s ∈ S:

    0 ≤ d(s, σ) ≤ √(4 + 4 + 1) = 3

since the maximum displacement on each axis is: |v − σ_v| ≤ 2, |a − σ_a| ≤ 2, |i − σ_i| ≤ 1. In practice, d(s, σ) ≤ √3 ≈ 1.73 because sigma is typically interior to S, limiting effective displacement.

---

## Proof 2: Intensity is Derivable from the V/A Plane (Non-Circularity)

**Theorem 2.** The intensity function I(v, a) depends only on valence and activation. The distance function d(s, σ) depends on intensity. The dependency is strictly unidirectional: (v, a) → I → d. There is no circularity.

**Proof.**

Write out the computation graph explicitly.

**Step 1.** Intensity is computed from valence and activation alone:

    I(v, a) = min(1, √((v − σ_v)² + (a − σ_a)²) / √2)

The inputs are v, a, σ_v, σ_a. Sigma is a constant. Therefore I is a function of (v, a) only. Intensity does not appear on the right-hand side. Distance does not appear on the right-hand side. ✓

**Step 2.** The full state is constructed as:

    s = (v, a, I(v, a))

The third coordinate is determined by the first two (plus the constant σ).

**Step 3.** Distance from sigma is computed from the full state:

    d(s, σ) = √((v − σ_v)² + (a − σ_a)² + (I(v, a) − σ_i)²)

Distance uses intensity as an input, but intensity was already fully determined in Step 1 without reference to distance.

**Step 4 (No backward edge).** Neither the definition of I nor its computation references d. The function d references I, but I does not reference d. The dependency graph is a directed acyclic graph:

    (v, a) → I(v, a) → s = (v, a, I) → d(s, σ)

with no cycles. ∎

**Corollary 2.1 (Intensity as Normalized 2D Distance).** Intensity is the Euclidean distance from the current (v, a) position to (σ_v, σ_a) in the valence/activation plane, normalized by √2:

    I(v, a) = d₂((v, a), (σ_v, σ_a)) / √2

where d₂ is the 2D Euclidean distance. This means intensity is a *projection* of the 3D distance onto the V/A plane, scaled to [0, 1]. It adds information about displacement magnitude without introducing circularity.

**Corollary 2.2 (Relationship Between I and d).** Substituting:

    d(s, σ)² = (v − σ_v)² + (a − σ_a)² + (I(v, a) − σ_i)²
             = 2 · I(v, a)² + (I(v, a) − σ_i)²        [when I < 1, unclamped]

This shows that distance from sigma can be expressed purely in terms of I and σ_i, confirming that the 2D displacement and the 3D distance are algebraically related but not circularly defined.

---

## Proof 3: The System Reduces to Single-Axis Models as Special Cases

**Theorem 3.** When two of the three axes are held constant at their sigma values, the geometric model reduces to a system driven by a single input variable. The distance function d(s, σ) is determined entirely by the varying axis. However, the mapping from single-axis displacement to distance is monotonic only beyond a critical displacement |δ*| = √2·σ_i/3. Below this threshold, a non-monotone region exists when σ_i > 0.

**Proof.**

**Case 1: Only valence varies.** Set a = σ_a. Let δ = v − σ_v. Then:
- I(v, σ_a) = |δ| / √2  (displacement only along valence)
- d(s, σ)² = δ² + (|δ|/√2 − σ_i)² = (3/2)·δ² − √2·σ_i·|δ| + σ_i²

This is a quadratic in |δ|. The distance function is determined entirely by δ (and the constants σ_i), confirming single-variable dependence.

**Monotonicity analysis.** Taking the derivative of d² with respect to |δ|:

    ∂(d²)/∂|δ| = 3|δ| − √2·σ_i

This is zero at |δ*| = √2·σ_i/3, negative for |δ| < |δ*|, and positive for |δ| > |δ*|.

- **When σ_i = 0:** d² = (3/2)·δ², so d = |δ|·√(3/2). Perfectly monotonic. The model reduces exactly to a single-axis model equivalent to existing scalar representations.

- **When σ_i > 0:** d² has a minimum at |δ*| = √2·σ_i/3. For |δ| < |δ*|, distance *decreases* as the state moves away from sigma in valence, because the intensity gap (I rising toward σ_i) closes faster than the valence gap opens. Beyond |δ*|, distance increases monotonically.

    For the deployed configuration (σ_i = 0.2): |δ*| = 0.094, and the distance dip is 0.037 units (from d = 0.200 at sigma to d = 0.163 at the minimum). All behavioral thresholds (deception at d ≥ 0.5, nightmare at d ≥ 0.5) lie well beyond this region.

**The non-monotone region reflects a structural property of derived intensity.** At rest (δ = 0), the agent's computed intensity is 0, but σ_i > 0 places the personality setpoint at nonzero intensity. The agent at rest is displaced from sigma along the intensity axis. Small valence displacements *resolve* this intensity gap before the direct displacement dominates. This is a consequence of intensity being derived from V/A displacement while also serving as a coordinate — a dual role that enriches the model but introduces a non-monotone near-sigma region.

**Case 2: Only activation varies.** Set v = σ_v. By symmetry with Case 1, the same analysis applies with |δ| = |a − σ_a| and the same critical threshold |δ*| = √2·σ_i/3. ∎

**Case 3: The circumplex (intensity held constant).** Set i = σ_i (constant intensity). Then:
- d(s, σ) = √((v − σ_v)² + (a − σ_a)²) = d₂((v,a), (σ_v, σ_a))
- The system operates in the V/A plane with Euclidean distance.

This case has no non-monotone region because intensity is held constant rather than derived. It is structurally equivalent to Russell's (1980) circumplex model with a personality baseline added. The circumplex is a special case of the geometric model with the intensity axis collapsed. ∎

**Corollary 3.1 (Practical monotonicity).** For any σ_i, the distance function is strictly monotonic in single-axis displacement for |δ| > √2·σ_i/3. Since all downstream behavioral thresholds in the current architecture require d ≥ 0.5 (well above the non-monotone region for any σ_i < 0.5·3/√2 ≈ 1.06), the non-monotonicity does not affect any operational mechanism.

---

## Proof 4: Centroid Properties

### Theorem 4a: Single-Source Collapse

**Theorem.** When exactly one source point is active, the centroid equals that source point in all three coordinates.

**Proof.** Let P = {p₁} with p₁ = (v₁, a₁, i₁, w₁). Then:

    c_v = (v₁ · w₁) / w₁ = v₁
    c_a = (a₁ · w₁) / w₁ = a₁
    c_i = (i₁ · w₁) / w₁ = i₁

The centroid is (v₁, a₁, i₁), the source point's 3D position. ∎

### Theorem 4b: Zero-Source Failsafe

**Theorem.** When no source points are active, the centroid equals sigma.

**Proof.** By Definition 6, when n = 0, c = σ = (σ_v, σ_a, σ_i) by convention. This is a defined boundary condition, not a limiting case. It ensures continuity of the system: as all source weights approach zero, the agent's operational position returns to its personality baseline (a 3D point in S). ∎

### Theorem 4c: Centroid Lies Within Convex Hull

**Theorem.** The centroid lies within the 3D convex hull of the source points.

**Proof.** Each coordinate of the centroid is a weighted average with positive weights:

    c = Σᵢ(λᵢ · (vᵢ, aᵢ, iᵢ))

where λᵢ = wᵢ / Σⱼ(wⱼ). Since wᵢ > 0 for all active sources, we have λᵢ > 0 and Σᵢ λᵢ = 1. Therefore c is a convex combination of the 3D source positions, which by definition lies in their convex hull. ∎

**Corollary 4c.1.** The centroid can never exceed the extremes of its source points on any axis. If all sources have valence in [v_min, v_max], activation in [a_min, a_max], and intensity in [i_min, i_max], then c_v ∈ [v_min, v_max], c_a ∈ [a_min, a_max], and c_i ∈ [i_min, i_max].

### Theorem 4d: Dominance by Weight

**Theorem.** As one source weight w_k → ∞ (relative to all others), the centroid converges to source k's 3D position.

**Proof.** For each coordinate (we show valence; activation and intensity follow by identical argument):

    c_v = (Σᵢ vᵢ · wᵢ) / (Σᵢ wᵢ)
        = (v_k · w_k + Σᵢ≠ₖ vᵢ · wᵢ) / (w_k + Σᵢ≠ₖ wᵢ)

Dividing numerator and denominator by w_k:

    c_v = (v_k + Σᵢ≠ₖ vᵢ · (wᵢ/w_k)) / (1 + Σᵢ≠ₖ (wᵢ/w_k))

As w_k → ∞, wᵢ/w_k → 0 for all i ≠ k, so c_v → v_k/1 = v_k. The same argument with aᵢ in place of vᵢ shows c_a → a_k, and with iᵢ in place of vᵢ shows c_i → i_k. The full 3D centroid converges to (v_k, a_k, i_k). ∎

This formalizes the thesis claim that "if one source point has weight far above all others, the centroid collapses onto that point."

### Theorem 4e: Centroid is Continuous

**Theorem.** The centroid is a continuous function of source positions and weights in all three coordinates.

**Proof.** Each coordinate of the centroid (c_v, c_a, c_i) is a rational function of (vᵢ, aᵢ, iᵢ, wᵢ) with denominator Σ(wᵢ). The denominator is strictly positive when n ≥ 1 (all weights are positive). Rational functions are continuous wherever their denominators are nonzero. Therefore each centroid coordinate is continuous in all source positions and weights, and the 3D centroid is continuous as a vector-valued function. ∎

---

## Proof 5: Spread Properties

### Theorem 5a: Spread is Non-Negative

**Theorem.** spread ≥ 0, with equality if and only if all source points occupy the same 3D position.

**Proof.** Each term d₃(pᵢ, c) · wᵢ ≥ 0 since 3D Euclidean distance is non-negative and weights are positive. Therefore spread = Σ(d₃(pᵢ, c) · wᵢ) / Σ(wᵢ) ≥ 0.

For equality: spread = 0 requires d₃(pᵢ, c) = 0 for all i (since wᵢ > 0). This means every source point coincides with the centroid in all three coordinates, which means all source points are at the same 3D position. ∎

### Theorem 5b: Single-Source Spread is Zero

**Theorem.** When exactly one source is active, spread = 0.

**Proof.** By Theorem 4a, c = (v₁, a₁, i₁) = p₁'s position. Therefore d₃(p₁, c) = 0, and spread = 0 · w₁ / w₁ = 0. ∎

### Theorem 5c: Spread Monotonicity (Two Equal Sources)

**Theorem.** For two source points with equal weights at 3D positions (v₁, a₁, i₁) and (v₂, a₂, i₂), spread is a monotonically increasing function of the 3D distance between the sources.

**Proof.** Let w₁ = w₂ = w. The centroid is the 3D midpoint:

    c = ((v₁ + v₂)/2, (a₁ + a₂)/2, (i₁ + i₂)/2)

The 3D distance from each source to the centroid is:

    d₃(p₁, c) = d₃(p₂, c) = ‖p₁ − p₂‖₂ / 2

(Each source is equidistant from the 3D midpoint, at half the inter-source distance.)

Therefore:

    spread = (d₃(p₁, c) · w + d₃(p₂, c) · w) / (2w)
           = d₃(p₁, c)
           = ‖p₁ − p₂‖₂ / 2

Spread is exactly half the 3D Euclidean distance between the two sources. Since 3D Euclidean distance is monotonically increasing with separation (by definition), spread is monotonically increasing with source separation. ∎

**Corollary 5c.1.** For equal-weight two-source configurations, spread = 0 when sources coincide and spread increases linearly with 3D source separation. This validates the experimental observation: spread(S1) < spread(S2) < spread(S3) in the thesis validation.

### Theorem 5d: Spread Monotonicity (General Case)

**Theorem.** For n ≥ 2 source points with fixed weights, uniformly scaling all source positions away from their centroid by factor k > 1 (in all three coordinates) strictly increases spread.

**Proof.** Let c be the centroid and define scaled source positions as:

    p'ᵢ = c + k · (pᵢ − c)     for some k > 1

where the scaling applies to each of the three coordinates: v'ᵢ = c_v + k(vᵢ − c_v), a'ᵢ = c_a + k(aᵢ − c_a), i'ᵢ = c_i + k(iᵢ − c_i).

The centroid of the scaled sources is:

    c' = Σ(p'ᵢ · wᵢ) / Σ(wᵢ) = Σ((c + k(pᵢ − c)) · wᵢ) / Σ(wᵢ)
       = c · Σ(wᵢ)/Σ(wᵢ) + k · Σ((pᵢ − c) · wᵢ) / Σ(wᵢ)
       = c + k · (c − c)     [since Σ(pᵢ · wᵢ)/Σ(wᵢ) = c by definition]
       = c

The centroid is unchanged in all three coordinates. The 3D distance from each scaled source to the centroid is:

    d₃(p'ᵢ, c) = ‖c + k(pᵢ − c) − c‖ = k · ‖pᵢ − c‖ = k · d₃(pᵢ, c)

Therefore:

    spread' = Σ(k · d₃(pᵢ, c) · wᵢ) / Σ(wᵢ) = k · spread

Since k > 1 and spread > 0 (by Theorem 5a, assuming not all sources coincide), spread' > spread. ∎

---

## Proof 6: Centroid and Spread are Independently Informative

**Theorem 6.** Centroid position and spread are independent quantities: knowing one does not determine the other. Specifically, for any 3D centroid position c in the interior of S, there exist source configurations producing arbitrarily different spread values.

**Proof.** Fix target centroid c = (c_v, c_a, c_i) in the interior of S.

**Configuration A (zero spread):** A single source at position (c_v, c_a, c_i). By Theorems 4a and 5b, centroid = c and spread = 0.

**Configuration B (arbitrary spread):** Two sources with equal weight w at 3D positions, symmetric about c along the valence axis:

    p₁ = (c_v + δ, c_a, c_i),  p₂ = (c_v − δ, c_a, c_i)

for any δ > 0 such that both points remain in S. The centroid is:

    c' = ((c_v + δ + c_v − δ)/2, (c_a + c_a)/2, (c_i + c_i)/2) = (c_v, c_a, c_i) = c

The spread is δ (by Theorem 5c, since the 3D separation between p₁ and p₂ is 2δ entirely along the valence axis).

By choosing different δ, we produce the same 3D centroid c with spread ranging from 0 to any positive value (up to the bounds of S). The construction is symmetric in any axis: substituting (c_a + δ, c_a − δ) in activation, or (c_i + δ, c_i − δ) in intensity (with δ small enough to keep iᵢ ∈ [0, 1]), produces the same result. Therefore centroid does not determine spread, and they are independent quantities. ∎

This formalizes the thesis claim from Chapter 4.4: "A centroid at neutral valence with zero spread means the agent is genuinely neutral. A centroid at neutral valence with high spread means two opposing forces are canceling."

---

## Proof 7: Deception Threshold is a Half-Space Intersection

**Theorem 7.** The deception activation region D ⊂ S is the intersection of a closed half-space and the exterior of a ball centered at sigma:

    D = {s ∈ S : d(s, σ) ≥ 0.5 ∧ v < 0}

This is a connected, geometrically well-defined region. Deception activates if and only if the state enters D.

**Proof.** The condition d(s, σ) ≥ 0.5 defines the exterior of the closed ball B(σ, 0.5) = {s : d(s, σ) < 0.5}. The condition v < 0 defines the open half-space H⁻ = {s ∈ S : v < 0}. Therefore:

    D = (S \ B(σ, 0.5)) ∩ H⁻

Both sets are connected (the exterior of a ball in a convex space intersected with a half-space), and their intersection in S is non-empty whenever σ has non-negative valence (which is typical). The boundary ∂D consists of the sphere d(s, σ) = 0.5 restricted to v < 0, and the hyperplane v = 0 restricted to d(s, σ) ≥ 0.5.

The deception state is therefore a geometric property of position, not a threshold on any individual axis. Two states at the same valence or the same distance can have different deception status depending on the other condition. This confirms that the geometric formulation (distance + direction) is strictly more informative than either scalar alone. ∎

---

## Summary of Proof Status

| Claim | Theorem | Status |
|-------|---------|--------|
| Distance from sigma is a proper metric | Theorem 1 | Proven |
| Intensity is non-circular with distance | Theorem 2 | Proven |
| Model reduces to single-axis dependence; monotonic beyond |δ*| = √2·σ_i/3; non-monotone near sigma when σ_i > 0 | Theorem 3 | Proven |
| Centroid collapses to single source | Theorem 4a | Proven |
| Centroid returns to sigma with no sources | Theorem 4b | Proven (by definition) |
| Centroid lies in convex hull | Theorem 4c | Proven |
| Dominant source captures centroid | Theorem 4d | Proven |
| Centroid is continuous | Theorem 4e | Proven |
| Spread is non-negative | Theorem 5a | Proven |
| Single-source spread is zero | Theorem 5b | Proven |
| Spread increases with source separation (equal weights) | Theorem 5c | Proven |
| Spread increases with uniform scaling (general) | Theorem 5d | Proven |
| Centroid and spread are independent | Theorem 6 | Proven |
| Deception region is geometrically well-defined | Theorem 7 | Proven |

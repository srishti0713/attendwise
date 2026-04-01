function classesNeeded(attended, total, target) {
    if (total === 0) return 0;

    const P = target / 100;

    if (P === 1) {
        return attended === total ? 0 : Infinity;
    }

    const x = (P * total - attended) / (1 - P);

    return x <= 0 ? 0 : Math.ceil(x);
}
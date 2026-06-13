console.log("FORMULAS JS LOADED");
// INK LAB ERP - formulas.js
// Professional Color Match Engine

const COLORS = [
    "cyan","magenta","yellow","black","white",
    "reflex_blue","violet","green","silver","gold",
    "varnish","transparent_base","fluor_pink","fluor_yellow","rubine_red"
];

const COLOR_LABELS = {
    cyan:"Cyan", magenta:"Magenta", yellow:"Yellow",
    black:"Black", white:"White", reflex_blue:"Reflex Blue",
    violet:"Violet", green:"Green", silver:"Silver", gold:"Gold",
    varnish:"Varnish", transparent_base:"Transparent Base",
    fluor_pink:"Fluor Pink", fluor_yellow:"Fluor Yellow", rubine_red:"Rubine Red"
};

const INK_KS = {
    cyan: {
        K: [0.02,0.02,0.02,0.02,0.05,0.30,0.80,1.20,1.00,0.50,0.10,0.02,0.01,0.01,0.01,0.01],
        S: [1.00,1.00,1.00,1.00,0.95,0.80,0.60,0.50,0.55,0.70,0.90,1.00,1.00,1.00,1.00,1.00]
    },
    magenta: {
        K: [0.05,0.05,0.10,0.30,0.80,1.20,0.90,0.30,0.10,0.05,0.05,0.10,0.40,0.80,0.50,0.10],
        S: [0.95,0.95,0.90,0.80,0.60,0.50,0.60,0.80,0.90,0.95,0.95,0.90,0.75,0.60,0.75,0.90]
    },
    yellow: {
        K: [0.80,0.60,0.30,0.10,0.05,0.02,0.01,0.01,0.01,0.01,0.02,0.05,0.05,0.05,0.05,0.05],
        S: [0.60,0.75,0.85,0.92,0.97,0.99,1.00,1.00,1.00,1.00,0.99,0.97,0.97,0.97,0.97,0.97]
    },
    black: {
        K: [1.80,1.80,1.80,1.80,1.80,1.80,1.80,1.80,1.80,1.80,1.80,1.80,1.80,1.80,1.80,1.80],
        S: [0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05]
    },
    white: {
        K: [0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01],
        S: [1.50,1.50,1.50,1.50,1.50,1.50,1.50,1.50,1.50,1.50,1.50,1.50,1.50,1.50,1.50,1.50]
    },
    reflex_blue: {
        K: [0.05,0.05,0.05,0.10,0.30,0.80,1.50,1.80,1.20,0.40,0.10,0.05,0.05,0.05,0.05,0.05],
        S: [0.95,0.95,0.95,0.90,0.80,0.60,0.40,0.30,0.50,0.75,0.90,0.95,0.95,0.95,0.95,0.95]
    },
    violet: {
        K: [0.10,0.10,0.20,0.60,1.20,1.50,1.20,0.50,0.20,0.10,0.10,0.10,0.10,0.10,0.10,0.10],
        S: [0.90,0.90,0.85,0.70,0.55,0.45,0.55,0.75,0.88,0.92,0.92,0.92,0.92,0.92,0.92,0.92]
    },
    green: {
        K: [0.30,0.20,0.10,0.05,0.05,0.10,0.50,1.00,0.80,0.20,0.05,0.02,0.02,0.02,0.02,0.02],
        S: [0.80,0.88,0.92,0.97,0.97,0.92,0.72,0.55,0.65,0.88,0.97,0.99,0.99,0.99,0.99,0.99]
    },
    silver: {
        K: [0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05],
        S: [0.80,0.80,0.80,0.80,0.80,0.80,0.80,0.80,0.80,0.80,0.80,0.80,0.80,0.80,0.80,0.80]
    },
    gold: {
        K: [0.20,0.15,0.10,0.08,0.05,0.05,0.05,0.05,0.05,0.08,0.20,0.50,0.80,0.60,0.30,0.15],
        S: [0.85,0.88,0.92,0.94,0.97,0.97,0.97,0.97,0.97,0.94,0.85,0.72,0.60,0.72,0.82,0.88]
    },
    varnish: {
        K: [0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01],
        S: [0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05]
    },
    transparent_base: {
        K: [0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01,0.01],
        S: [0.08,0.08,0.08,0.08,0.08,0.08,0.08,0.08,0.08,0.08,0.08,0.08,0.08,0.08,0.08,0.08]
    },
    fluor_pink: {
        K: [0.05,0.05,0.10,0.30,1.00,1.50,1.00,0.30,0.10,0.05,0.05,0.08,0.30,0.80,0.40,0.10],
        S: [0.95,0.95,0.92,0.82,0.55,0.40,0.55,0.82,0.92,0.95,0.95,0.93,0.82,0.62,0.78,0.92]
    },
    fluor_yellow: {
        K: [0.60,0.40,0.20,0.08,0.03,0.01,0.01,0.01,0.01,0.01,0.01,0.03,0.03,0.03,0.03,0.03],
        S: [0.68,0.78,0.88,0.95,0.99,1.00,1.00,1.00,1.00,1.00,1.00,0.99,0.99,0.99,0.99,0.99]
    },
    rubine_red: {
        K: [0.05,0.05,0.10,0.40,1.00,1.40,1.00,0.30,0.10,0.05,0.05,0.05,0.05,0.05,0.05,0.05],
        S: [0.95,0.95,0.92,0.78,0.55,0.42,0.55,0.82,0.92,0.95,0.95,0.95,0.95,0.95,0.95,0.95]
    }
};

const CMF_X = [0.0143,0.0435,0.1344,0.2839,0.3483,0.3362,0.2908,0.1954,0.0956,0.0320,0.0049,0.0093,0.0633,0.1655,0.2904,0.3597];
const CMF_Y = [0.0004,0.0012,0.0040,0.0116,0.0230,0.0380,0.0600,0.0910,0.1390,0.2080,0.3230,0.5030,0.7100,0.8620,0.9540,0.9950];
const CMF_Z = [0.0679,0.2074,0.6456,1.3856,1.7471,1.7721,1.6692,1.2876,0.8130,0.4652,0.2720,0.1582,0.0782,0.0422,0.0203,0.0087];
const D65 = [82.75,91.49,93.43,86.68,104.87,117.01,117.81,114.86,115.92,108.81,109.35,107.80,104.79,107.69,104.41,104.05];
const SUBSTRATE_R = [0.88,0.89,0.90,0.90,0.91,0.91,0.92,0.92,0.92,0.92,0.92,0.91,0.91,0.91,0.91,0.91];

const COLOR_WEIGHT = {
    cyan:1.8, magenta:1.9, yellow:1.2, black:3.5, white:0.6,
    reflex_blue:2.2, violet:2.1, green:1.7, silver:0.4, gold:0.4,
    varnish:0.1, transparent_base:0.1, fluor_pink:2.0, fluor_yellow:1.4, rubine_red:2.3
};
const INK_STRENGTH = COLOR_WEIGHT;

let allFormulas = [];
let formOpen = false;
let matchTimer = null;
let matchMode = "ratio";

if (typeof startClock === "function") startClock();

function htmlEscape(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function jsString(value) {
    return JSON.stringify(String(value ?? ""));
}

function supabaseValue(value) {
    return encodeURIComponent(String(value ?? ""));
}

function numberOr(value, fallback = 0) {
    const n = parseFloat(value);
    return Number.isFinite(n) ? n : fallback;
}

function kmMix(f) {
    const drum = f.drum_kg || 20;
    const R = new Array(16).fill(0);

    for (let band = 0; band < 16; band++) {
        let Km = 0, Sm = 0, totalConc = 0;

        COLORS.forEach(c => {
            const kg = f[c] || 0;
            if (kg <= 0) return;
            const conc = kg / drum;
            const ks = INK_KS[c];
            if (!ks) return;
            Km += conc * ks.K[band];
            Sm += conc * ks.S[band];
            totalConc += conc;
        });

        const subConc = Math.max(0, 1 - totalConc);
        Km += subConc * 0.01;
        Sm += subConc * 1.5;

        if (Sm > 0) {
            const ratio = Km / Sm;
            R[band] = 1 + ratio - Math.sqrt(ratio * ratio + 2 * ratio);
            R[band] = Math.max(0.001, Math.min(0.999, R[band]));
        } else {
            R[band] = SUBSTRATE_R[band];
        }
    }

    return R;
}

function reflectanceToLab(R) {
    let X = 0, Y = 0, Z = 0;
    let Xn = 0, Yn = 0, Zn = 0;

    for (let i = 0; i < 16; i++) {
        X += R[i] * D65[i] * CMF_X[i];
        Y += R[i] * D65[i] * CMF_Y[i];
        Z += R[i] * D65[i] * CMF_Z[i];
        Xn += SUBSTRATE_R[i] * D65[i] * CMF_X[i];
        Yn += SUBSTRATE_R[i] * D65[i] * CMF_Y[i];
        Zn += SUBSTRATE_R[i] * D65[i] * CMF_Z[i];
    }

    const xr = X / Xn, yr = Y / Yn, zr = Z / Zn;
    const f3 = v => v > 0.008856 ? Math.cbrt(v) : 7.787 * v + 16 / 116;
    const fx = f3(xr), fy = f3(yr), fz = f3(zr);

    return {
        L: Math.max(0, 116 * fy - 16),
        a: Math.max(-128, 500 * (fx - fy)),
        b: Math.max(-128, 200 * (fy - fz))
    };
}

function simulateMixedLab(f) {
    try {
        return reflectanceToLab(kmMix(f));
    } catch (e) {
        return { L: 50, a: 0, b: 0 };
    }
}

function toggleForm() {
    formOpen = !formOpen;
    document.getElementById("formula-form").style.display = formOpen ? "block" : "none";
    document.getElementById("toggle-btn").textContent = formOpen ? "x Close" : "+ Add Formula";
    if (!formOpen) resetForm();
}

function resetForm() {
    ["f-code","f-name","f-notes"].forEach(id => document.getElementById(id).value = "");
    document.getElementById("f-drum").value = "20";
    document.getElementById("f-lab_l").value = "";
    document.getElementById("f-lab_a").value = "";
    document.getElementById("f-lab_b").value = "";
    COLORS.forEach(c => document.getElementById("f-" + c).value = "0");
    document.getElementById("match-box").style.display = "none";
}

function readForm() {
    const f = {
        code: document.getElementById("f-code").value.trim().toUpperCase(),
        name: document.getElementById("f-name").value.trim(),
        drum_kg: parseFloat(document.getElementById("f-drum").value) || 20,
        pantone: document.getElementById("pantoneNumber")?.value.trim().toUpperCase() || "",
        notes: document.getElementById("f-notes").value.trim(),
        lab_l: parseFloat(document.getElementById("f-lab_l").value) || null,
        lab_a: parseFloat(document.getElementById("f-lab_a").value) || null,
        lab_b: parseFloat(document.getElementById("f-lab_b").value) || null
    };
    COLORS.forEach(c => f[c] = parseFloat(document.getElementById("f-" + c).value) || 0);
    return f;
}
function checkPantoneMatch() {
    const pantone = document.getElementById("pantoneNumber").value.trim().toUpperCase();
    const box = document.getElementById("pantone-match-box");

    if (!pantone) { box.style.display = "none"; return; }

    const found = allFormulas.find(f => (f.pantone || "").toUpperCase() === pantone);

    if (!found) { box.style.display = "none"; return; }

    box.style.display = "block";
    box.innerHTML = `
        <div style="margin-top:10px;padding:12px;border-radius:10px;border:2px solid #22c55e;background:#0f172a">
            <b>🎯 Pantone Match Found</b><br><br>
            Code: ${found.code}<br>
            Name: ${found.name}<br><br>
            <button class="btn btn-primary" onclick="viewFormula(${found.id})">Open Formula</button>
        </div>
    `;
}
    


function getWeightedProfile(f) {
    const drum = f.drum_kg || 20;
    const profile = {};
    let totalWeight = 0;

    COLORS.forEach(c => {
        const kg = f[c] || 0;
        const pct = kg / drum;
        const w = COLOR_WEIGHT[c] || 1;
        profile[c] = pct * w;
        totalWeight += profile[c];
    });

    if (totalWeight > 0) {
        COLORS.forEach(c => profile[c] /= totalWeight);
    }

    return profile;
}

function cosineSimilarity(A, B) {
    let dot = 0, magA = 0, magB = 0;
    COLORS.forEach(c => {
        dot += A[c] * B[c];
        magA += A[c] * A[c];
        magB += B[c] * B[c];
    });
    if (magA === 0 || magB === 0) return 0;
    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

function magnitudePenalty(f1, f2) {
    const d1 = f1.drum_kg || 20;
    const d2 = f2.drum_kg || 20;
    let penalty = 0;
    let totalWeight = 0;

    COLORS.forEach(c => {
        const r1 = (f1[c] || 0) / d1;
        const r2 = (f2[c] || 0) / d2;
        const w = COLOR_WEIGHT[c] || 1;
        const maxR = Math.max(r1, r2);
        if (maxR > 0.001) {
            penalty += Math.abs(r1 - r2) / maxR * w;
            totalWeight += w;
        } else if (r1 > 0 || r2 > 0) {
            penalty += w;
            totalWeight += w;
        }
    });

    return totalWeight > 0 ? Math.min(1, penalty / totalWeight) : 0;
}

function structureMatch(f1, f2) {
    const a1 = new Set(COLORS.filter(c => (f1[c] || 0) > 0));
    const a2 = new Set(COLORS.filter(c => (f2[c] || 0) > 0));
    if (a1.size === 0 && a2.size === 0) return 1;
    const union = new Set([...a1, ...a2]);
    const intersection = [...a1].filter(c => a2.has(c));
    return intersection.length / union.size;
}

function deltaE2000(L1, a1, b1, L2, a2, b2) {
    const kL = 1, kC = 1, kH = 1;
    const C1 = Math.sqrt(a1*a1 + b1*b1);
    const C2 = Math.sqrt(a2*a2 + b2*b2);
    const Cb = (C1 + C2) / 2;
    const Cb7 = Math.pow(Cb, 7);
    const G = 0.5 * (1 - Math.sqrt(Cb7 / (Cb7 + 6103515625)));
    const a1p = a1 * (1 + G), a2p = a2 * (1 + G);
    const C1p = Math.sqrt(a1p*a1p + b1*b1);
    const C2p = Math.sqrt(a2p*a2p + b2*b2);
    let h1p = Math.atan2(b1, a1p) * 180 / Math.PI; if (h1p < 0) h1p += 360;
    let h2p = Math.atan2(b2, a2p) * 180 / Math.PI; if (h2p < 0) h2p += 360;
    const dLp = L2 - L1;
    const dCp = C2p - C1p;
    let dhp = 0;
    if (C1p * C2p !== 0) {
        if (Math.abs(h2p - h1p) <= 180) dhp = h2p - h1p;
        else if (h2p - h1p > 180) dhp = h2p - h1p - 360;
        else dhp = h2p - h1p + 360;
    }
    const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(dhp * Math.PI / 360);
    const Lbp = (L1 + L2) / 2;
    const Cbp = (C1p + C2p) / 2;
    let Hbp;
    if (C1p * C2p === 0) Hbp = h1p + h2p;
    else if (Math.abs(h1p - h2p) <= 180) Hbp = (h1p + h2p) / 2;
    else if (h1p + h2p < 360) Hbp = (h1p + h2p + 360) / 2;
    else Hbp = (h1p + h2p - 360) / 2;
    const T = 1 - 0.17 * Math.cos((Hbp - 30) * Math.PI / 180)
        + 0.24 * Math.cos(2 * Hbp * Math.PI / 180)
        + 0.32 * Math.cos((3 * Hbp + 6) * Math.PI / 180)
        - 0.20 * Math.cos((4 * Hbp - 63) * Math.PI / 180);
    const SL = 1 + 0.015 * Math.pow(Lbp - 50, 2) / Math.sqrt(20 + Math.pow(Lbp - 50, 2));
    const SC = 1 + 0.045 * Cbp;
    const SH = 1 + 0.015 * Cbp * T;
    const Cbp7 = Math.pow(Cbp, 7);
    const RC = 2 * Math.sqrt(Cbp7 / (Cbp7 + 6103515625));
    const dTh = 30 * Math.exp(-Math.pow((Hbp - 275) / 25, 2));
    const RT = -Math.sin(2 * dTh * Math.PI / 180) * RC;
    return Math.sqrt(
        Math.pow(dLp / (kL * SL), 2) +
        Math.pow(dCp / (kC * SC), 2) +
        Math.pow(dHp / (kH * SH), 2) +
        RT * (dCp / (kC * SC)) * (dHp / (kH * SH))
    );
}

function calcRatioScore(newF, existing) {
    const labNew = simulateMixedLab(newF);
    const labEx = simulateMixedLab(existing);
    const de = deltaE2000(labNew.L, labNew.a, labNew.b, labEx.L, labEx.a, labEx.b);
    const colorScore = Math.max(0, 100 - de * 8);
    const A = getWeightedProfile(newF);
    const B = getWeightedProfile(existing);
    const cosine = cosineSimilarity(A, B);
    const magScore = 1 - magnitudePenalty(newF, existing);
    const ratioScore = (cosine * 0.45 + magScore * 0.55) * 100;
    const structure = structureMatch(newF, existing);
    if (structure < 0.15) return Math.round(structure * 25);
    const score = colorScore * 0.50 + ratioScore * 0.35 + structure * 100 * 0.15;
    return Math.max(0, Math.min(100, Math.round(score)));
}

function getSimulatedLabString(f) {
    const lab = simulateMixedLab(f);
    return `L* ${lab.L.toFixed(1)}  a* ${lab.a.toFixed(1)}  b* ${lab.b.toFixed(1)}`;
}

function getCorrections(newF, targetF) {
    const d1 = newF.drum_kg || 20;
    const d2 = targetF.drum_kg || 20;
    const corrections = [];

    COLORS.forEach(c => {
        const r1 = (newF[c] || 0) / d1;
        const r2 = (targetF[c] || 0) / d2;
        const diff = r2 - r1;
        if (Math.abs(diff) > 0.001) corrections.push({ color: c, diff: diff * d1, r1, r2 });
    });

    return corrections.sort((a,b) => Math.abs(b.diff) - Math.abs(a.diff));
}

function getCluster(f) {
    const drum = f.drum_kg || 20;
    const ratios = {};
    COLORS.forEach(c => ratios[c] = (f[c] || 0) / drum);

    const chromatic = ["cyan","magenta","yellow","reflex_blue","violet","green","fluor_pink","fluor_yellow","rubine_red"];
    let dominant = null, maxVal = 0;
    chromatic.forEach(c => {
        if (ratios[c] > maxVal) { maxVal = ratios[c]; dominant = c; }
    });

    const hasBlack = ratios.black > 0.15;
    const hasWhite = ratios.white > 0.15;
    const isNeutral = !dominant || maxVal < 0.05;

    if (isNeutral && hasBlack) return { name: "Black Family", icon: "Black", color: "#666" };
    if (isNeutral && hasWhite) return { name: "White / Pastel", icon: "White", color: "#aaa" };
    if (ratios.silver > 0.2) return { name: "Metallic Silver", icon: "Silver", color: "#94a3b8" };
    if (ratios.gold > 0.2) return { name: "Metallic Gold", icon: "Gold", color: "#f59e0b" };

    const clusterMap = {
        cyan: { name: "Cyan Family", icon: "Cyan", color: "#06b6d4" },
        magenta: { name: "Magenta Family", icon: "Magenta", color: "#ec4899" },
        yellow: { name: "Yellow Family", icon: "Yellow", color: "#eab308" },
        reflex_blue: { name: "Blue Family", icon: "Blue", color: "#3b82f6" },
        violet: { name: "Violet Family", icon: "Violet", color: "#8b5cf6" },
        green: { name: "Green Family", icon: "Green", color: "#22c55e" },
        fluor_pink: { name: "Fluorescent Pink", icon: "Pink", color: "#f472b6" },
        fluor_yellow: { name: "Fluorescent Yellow", icon: "Fluor Yellow", color: "#facc15" },
        rubine_red: { name: "Red Family", icon: "Red", color: "#ef4444" }
    };

    return clusterMap[dominant] || { name: "Mixed", icon: "Mixed", color: "#6393ff" };
}

function setMatchMode(mode) {
    matchMode = mode;
    const rBtn = document.getElementById("btn-match-ratio");
    const dBtn = document.getElementById("btn-match-deltae");
    if (rBtn && dBtn) {
        rBtn.className = mode === "ratio" ? "btn btn-primary" : "btn btn-ghost";
        dBtn.className = mode === "deltae" ? "btn btn-primary" : "btn btn-ghost";
    }
    runMatch();
}

function onColorInput() {
    clearTimeout(matchTimer);
    matchTimer = setTimeout(runMatch, 350);
}

function runMatch() {
    const newF = readForm();
    const box = document.getElementById("match-box");
    if (!box) return;
    if (matchMode === "deltae") runDeltaEMatch(newF, box);
    else runRatioMatch(newF, box);
}

async function getFormulaStock(formulaId) {
    try {
        // Use dbGet — already has HEADERS from config.js
        const batches = await dbGet("batches",
            `?formula_id=eq.${formulaId}&select=target_kg,returned_kg`
        );
        if (!Array.isArray(batches) || !batches.length) {
            return null;
        }
        let target = 0, returned = 0;
        batches.forEach(b => {
            target   += parseFloat(b.target_kg   || 0);
            returned += parseFloat(b.returned_kg || 0);
        });
        return {
            count:         batches.length,
            totalTarget:   target,
            totalProduced: target,
            totalReturned: returned,
            totalNet:      Math.max(0, target - returned)
        };
    } catch(e) {
        console.error("getFormulaStock:", e);
        return null;
    }
}

function renderStockBadge(formulaId, containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `<span style="color:var(--text-3);font-size:0.8rem">Checking stock...</span>`;
    getFormulaStock(formulaId).then(stock => {
        if (!stock) {
            el.innerHTML = `<span style="color:var(--text-3);font-size:0.8rem">Unable to load batches</span>`;
            return;
        }
        if (stock.count === 0) {
            el.innerHTML = `<span style="font-weight:700;font-size:0.85rem;color:var(--text-3)">No production yet</span>`;
            return;
        }

        const isModal = containerId.startsWith("modal-stock-");
        if (isModal) {
            const netColor = stock.totalNet > 0 ? "var(--green)" : "#ff4d6a";
            const netIcon = stock.totalNet > 0 ? "OK" : "Empty";
            el.innerHTML = `
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;width:100%">
                    <div style="background:var(--bg2);padding:10px 12px;border-radius:8px;border:1px solid var(--border);text-align:center">
                        <div style="font-size:0.68rem;font-weight:700;color:var(--text-3);text-transform:uppercase;margin-bottom:4px">Total Production</div>
                        <div style="font-size:1.1rem;font-weight:800;color:var(--accent)">${stock.totalProduced.toFixed(2)} KG</div>
                        <div style="font-size:0.7rem;color:var(--text-3);margin-top:2px">${stock.count} completed batches</div>
                    </div>
                    <div style="background:var(--bg2);padding:10px 12px;border-radius:8px;border:1px solid var(--border);text-align:center">
                        <div style="font-size:0.68rem;font-weight:700;color:var(--text-3);text-transform:uppercase;margin-bottom:4px">Returned</div>
                        <div style="font-size:1.1rem;font-weight:800;color:var(--warn)">${stock.totalReturned.toFixed(2)} KG</div>
                        <div style="font-size:0.7rem;color:var(--text-3);margin-top:2px">returned KG</div>
                    </div>
                    <div style="background:var(--bg2);padding:10px 12px;border-radius:8px;border:1px solid var(--border);text-align:center">
                        <div style="font-size:0.68rem;font-weight:700;color:var(--text-3);text-transform:uppercase;margin-bottom:4px">Net Stock</div>
                        <div style="font-size:1.1rem;font-weight:800;color:${netColor}">${netIcon} ${stock.totalNet.toFixed(2)} KG</div>
                        <div style="font-size:0.7rem;color:var(--text-3);margin-top:2px">net KG</div>
                    </div>
                </div>`;
        } else {
            const col = stock.totalNet > 0 ? "var(--green)" : "#ff4d6a";
            const icon = stock.totalNet > 0 ? "OK" : "Empty";
            el.innerHTML = `<span style="font-weight:700;font-size:0.85rem;color:${col}">${icon}: ${stock.totalNet.toFixed(2)} KG</span>`
                + `<span style="color:var(--text-3);font-size:0.78rem;margin-left:8px">| Returned: ${stock.totalReturned.toFixed(2)} KG | ${stock.count} batches</span>`;
        }
    });
}

function runRatioMatch(newF, box) {
    const hasInk = COLORS.some(c => newF[c] > 0);
    if (!hasInk || !allFormulas.length) { box.style.display = "none"; return; }

    const results = allFormulas
        .filter(ex => ex.code !== newF.code)
        .map(ex => ({ f: ex, score: calcRatioScore(newF, ex) }))
        .filter(r => r.score >= 20)
        .sort((a,b) => b.score - a.score);

    if (!results.length) { box.style.display = "none"; return; }

    const best = results[0];
    const score = best.score;
    const color = score >= 85 ? "var(--danger)" : score >= 65 ? "var(--warn)" : "var(--accent)";
    const label = score >= 85 ? "Very High - Consider Reusing"
        : score >= 65 ? "High Similarity"
        : score >= 40 ? "Possible Match"
        : "Low Similarity";
    const d1 = newF.drum_kg || 20;
    const d2 = best.f.drum_kg || 20;
    const simNew = simulateMixedLab(newF);
    const simBest = simulateMixedLab(best.f);
    const simDE = deltaE2000(simNew.L, simNew.a, simNew.b, simBest.L, simBest.a, simBest.b);

    const compRows = COLORS
        .filter(c => (newF[c] || 0) > 0 || (best.f[c] || 0) > 0)
        .map(c => {
            const r1 = (newF[c] || 0) / d1 * 100;
            const r2 = (best.f[c] || 0) / d2 * 100;
            const diff = Math.abs(r1 - r2);
            const exact = diff < 0.5;
            const ok = diff <= 5;
            const bg = exact ? "var(--green-dim)" : ok ? "rgba(99,147,255,0.12)" : "var(--warn-dim)";
            const col = exact ? "var(--green)" : ok ? "var(--accent)" : "var(--warn)";
            const txt = exact ? "Match" : `Delta ${diff.toFixed(1)}%`;
            return `<tr>
                <td style="font-weight:600">${COLOR_LABELS[c]} <span style="font-size:0.7rem;color:var(--text-3);margin-left:4px">w:${COLOR_WEIGHT[c]}</span></td>
                <td style="font-family:var(--mono);color:var(--accent)">${r1.toFixed(2)}%</td>
                <td style="font-family:var(--mono);color:var(--text-2)">${r2.toFixed(2)}%</td>
                <td style="text-align:center"><span style="font-size:0.76rem;padding:2px 9px;border-radius:99px;font-weight:600;background:${bg};color:${col}">${txt}</span></td>
            </tr>`;
        }).join("");

    const corrHTML = getCorrections(newF, best.f).slice(0, 5).map(c => {
        const sign = c.diff > 0 ? "+" : "";
        const col = c.diff > 0 ? "var(--green)" : "var(--danger)";
        return `<div style="display:flex;align-items:center;justify-content:space-between;padding:7px 12px;border-radius:6px;background:var(--surface2);border:1px solid var(--border);margin-bottom:6px">
            <span style="font-weight:600;font-size:0.88rem">${COLOR_LABELS[c.color]}</span>
            <span style="font-family:var(--mono);font-size:0.85rem;color:${col};font-weight:700">${sign}${c.diff.toFixed(3)} KG</span>
        </div>`;
    }).join("");

    const others = results.slice(1, 3).map(r => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);margin-top:8px">
            <div><span style="color:var(--accent);font-weight:700">${htmlEscape(r.f.code)}</span><span style="color:var(--text-2);margin-left:8px">${htmlEscape(r.f.name)}</span></div>
            <div style="display:flex;align-items:center;gap:10px">
                <span style="font-weight:800;color:var(--text-2)">${r.score}%</span>
                <button class="btn btn-ghost" style="font-size:0.8rem;padding:5px 10px" onclick="viewFormula(${r.f.id})">View</button>
            </div>
        </div>`).join("");

    box.style.display = "block";
    box.innerHTML = `
        <div style="border:1.5px solid ${color};border-radius:12px;overflow:hidden">
            <div style="padding:12px 18px;background:rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border)">
                <span style="font-weight:700;font-size:0.95rem;color:${color}">Ratio Match Engine</span>
                <span style="font-size:0.8rem;color:var(--text-3)">${label}</span>
            </div>
            <div style="padding:12px 18px;border-bottom:1px solid var(--border);display:flex;gap:16px;align-items:center;flex-wrap:wrap">
                <div style="flex:1;min-width:200px">
                    <div style="font-size:0.72rem;font-weight:700;color:var(--text-3);text-transform:uppercase;margin-bottom:6px">Simulated Mix Result</div>
                    <div style="font-family:var(--mono);font-size:0.8rem;color:var(--text-3)">New: L*${simNew.L.toFixed(1)} a*${simNew.a.toFixed(1)} b*${simNew.b.toFixed(1)}</div>
                    <div style="font-family:var(--mono);font-size:0.8rem;color:var(--text-3)">${htmlEscape(best.f.code)}: L*${simBest.L.toFixed(1)} a*${simBest.a.toFixed(1)} b*${simBest.b.toFixed(1)}</div>
                </div>
                <div style="text-align:center;padding:0 10px">
                    <div style="font-size:0.72rem;color:var(--text-3);margin-bottom:4px">Delta E simulated</div>
                    <div style="font-size:1.4rem;font-weight:900;color:${color}">${simDE.toFixed(2)}</div>
                </div>
            </div>
            <div style="padding:16px 18px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;border-bottom:1px solid var(--border);background:var(--surface2)">
                <div>
                    <div style="font-size:1.1rem;font-weight:800;color:var(--accent)">${htmlEscape(best.f.code)}</div>
                    <div style="color:var(--text-2);margin-top:3px">${htmlEscape(best.f.name)}</div>
                    <div style="color:var(--text-3);font-size:0.82rem;margin-top:3px">Drum: ${Number(best.f.drum_kg).toFixed(1)} KG</div>
                </div>
                <div style="text-align:center">
                    <div style="font-size:3rem;font-weight:900;color:${color};line-height:1">${score}%</div>
                    <div style="font-size:0.75rem;color:${color};font-weight:600;margin-top:2px">Match Score</div>
                    <button class="btn btn-primary" style="margin-top:10px;font-size:0.82rem;padding:6px 14px" onclick="viewFormula(${best.f.id})">View Formula</button>
                </div>
            </div>
            <div style="padding:14px 18px;border-bottom:1px solid var(--border)">
                <div style="font-size:0.75rem;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px">Weighted Component Comparison</div>
                <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden">
                    <table>
                        <thead><tr><th>Material</th><th>New Formula %</th><th>${htmlEscape(best.f.code)} %</th><th style="text-align:center">Diff</th></tr></thead>
                        <tbody>${compRows}</tbody>
                    </table>
                </div>
            </div>
            ${corrHTML ? `<div style="padding:14px 18px;border-bottom:1px solid var(--border)"><div style="font-size:0.75rem;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px">Auto-Suggest: Adjust to match ${htmlEscape(best.f.code)}</div>${corrHTML}</div>` : ""}
            ${others ? `<div style="padding:14px 18px"><div style="font-size:0.75rem;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Other Matches</div>${others}</div>` : ""}
            <div style="padding:12px 18px;border-top:1px solid var(--border);background:rgba(0,0,0,0.15);display:flex;align-items:center;gap:10px;flex-wrap:wrap">
                <span style="font-size:0.72rem;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:0.5px;white-space:nowrap">Stock:</span>
                <span id="match-stock-ratio"></span>
            </div>
        </div>`;
    renderStockBadge(best.f.id, "match-stock-ratio");
}

function runDeltaEMatch(newF, box) {
    const hasLab = newF.lab_l !== null && newF.lab_a !== null && newF.lab_b !== null;

    if (!hasLab) {
        box.style.display = "block";
        box.innerHTML = `
            <div style="padding:24px;border:1.5px solid var(--border);border-radius:12px;background:var(--surface2);text-align:center">
                <div style="font-weight:700;color:var(--text);margin-bottom:6px;font-size:1rem">Enter L* a* b* Values</div>
                <div style="color:var(--text-3);font-size:0.88rem;line-height:1.6">Measure the mixed ink with your spectrophotometer<br>and enter the Lab values to use Delta E 2000</div>
            </div>`;
        return;
    }

    const results = allFormulas
        .filter(ex => ex.code !== newF.code && ex.lab_l !== null)
        .map(ex => ({
            f: ex,
            de: parseFloat(deltaE2000(newF.lab_l, newF.lab_a, newF.lab_b, ex.lab_l, ex.lab_a, ex.lab_b).toFixed(2))
        }))
        .sort((a,b) => a.de - b.de);

    if (!results.length) {
        box.style.display = "block";
        box.innerHTML = `<div style="padding:20px;border:1.5px solid var(--border);border-radius:12px;background:var(--surface2);text-align:center;color:var(--text-3)">No formulas with Lab values to compare</div>`;
        return;
    }

    const best = results[0];
    const de = best.de;
    const color = de < 1 ? "var(--danger)" : de < 2 ? "var(--warn)" : de < 5 ? "var(--accent)" : "var(--green)";
    const label = de < 1 ? "Nearly Identical Color"
        : de < 2 ? "Very Close"
        : de < 3 ? "Acceptable"
        : de < 5 ? "Noticeable Difference"
        : "Significant Color Difference";
    const pct = Math.max(0, Math.round(100 - de * 12));

    const labComp = `
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px">
            ${["L*","a*","b*"].map((ch, i) => {
                const keys = ["lab_l","lab_a","lab_b"];
                const v1 = newF[keys[i]];
                const v2 = best.f[keys[i]];
                const d = v2 !== null ? Math.abs(v1 - v2).toFixed(2) : "-";
                return `<div style="background:var(--bg2);padding:10px;border-radius:8px;border:1px solid var(--border);text-align:center">
                    <div style="font-size:0.72rem;color:var(--text-3);margin-bottom:4px">${ch}</div>
                    <div style="font-size:0.88rem;font-weight:700;color:var(--accent)">${v1}</div>
                    <div style="font-size:0.78rem;color:var(--text-2)">vs ${v2 ?? "-"}</div>
                    <div style="font-size:0.72rem;color:var(--text-3);margin-top:2px">Delta ${d}</div>
                </div>`;
            }).join("")}
        </div>`;

    const others = results.slice(1, 3).map(r => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);margin-top:8px">
            <div><span style="color:var(--accent);font-weight:700">${htmlEscape(r.f.code)}</span><span style="color:var(--text-2);margin-left:8px">${htmlEscape(r.f.name)}</span></div>
            <div style="display:flex;align-items:center;gap:10px"><span style="font-weight:800;color:var(--text-2)">Delta E ${r.de}</span><button class="btn btn-ghost" style="font-size:0.8rem;padding:5px 10px" onclick="viewFormula(${r.f.id})">View</button></div>
        </div>`).join("");

    box.style.display = "block";
    box.innerHTML = `
        <div style="border:1.5px solid ${color};border-radius:12px;overflow:hidden">
            <div style="padding:12px 18px;background:rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border)">
                <span style="font-weight:700;font-size:0.95rem;color:${color}">Delta E 2000</span>
                <span style="font-size:0.8rem;color:var(--text-3)">${label}</span>
            </div>
            <div style="padding:16px 18px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;border-bottom:1px solid var(--border);background:var(--surface2)">
                <div><div style="font-size:1.1rem;font-weight:800;color:var(--accent)">${htmlEscape(best.f.code)}</div><div style="color:var(--text-2);margin-top:3px">${htmlEscape(best.f.name)}</div></div>
                <div style="text-align:center"><div style="font-size:2.8rem;font-weight:900;color:${color};line-height:1">Delta E ${de}</div><div style="font-size:0.75rem;color:${color};font-weight:600;margin-top:2px">${pct}% perceptual match</div><button class="btn btn-primary" style="margin-top:10px;font-size:0.82rem;padding:6px 14px" onclick="viewFormula(${best.f.id})">View Formula</button></div>
            </div>
            <div style="padding:14px 18px;border-bottom:1px solid var(--border)">${labComp}</div>
            ${others ? `<div style="padding:14px 18px"><div style="font-size:0.75rem;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Other Matches</div>${others}</div>` : ""}
            <div style="padding:12px 18px;border-top:1px solid var(--border);background:rgba(0,0,0,0.15);display:flex;align-items:center;gap:10px;flex-wrap:wrap">
                <span style="font-size:0.72rem;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:0.5px;white-space:nowrap">Stock:</span>
                <span id="match-stock-deltae"></span>
            </div>
        </div>`;
    renderStockBadge(best.f.id, "match-stock-deltae");
}

async function saveFormula() {
    const f = readForm();
    if (!f.code) { showToast("Formula code is required", "warn"); return; }
    if (!f.name) { showToast("Formula name is required", "warn"); return; }

    const btn = document.getElementById("save-btn");
    btn.disabled = true;
    btn.textContent = "Saving...";
const duplicatePantone = allFormulas.find(x =>
    (x.pantone || "").toUpperCase() ===
    (f.pantone || "").toUpperCase()
);
    if (duplicatePantone) {

    alert(
        `Pantone ${f.pantone} already exists:\n` +
        duplicatePantone.code
    );

    viewFormula(duplicatePantone.id);
    return;
}
    const result = await dbPost("formulas", f);

    btn.disabled = false;
    btn.textContent = "Save Formula";

    if (result.ok) {
        const saved = Array.isArray(result.data) ? result.data[0] : result.data;
        if (saved?.id) {
            await dbPost("batches", {
                batch_no: f.code + "-001",
                formula_id: saved.id,
                formula_code: f.code,
                target_kg: f.drum_kg,
                returned_kg: 0,
                status: "pending",
                notes: "Auto from formula: " + f.name,
                qr_code: f.code + "-001",
                barcode: f.code + "-001"
            });
            showToast("Formula saved + Batch created", "success");
        } else {
            showToast("Formula saved", "success");
        }
        resetForm();
        toggleForm();
        loadFormulas();
    } else {
        showToast("Error: " + (result.data?.message || "Unknown"), "error");
    }
}

async function loadFormulas() {
    const tbody = document.getElementById("formulas-tbody");
    tbody.innerHTML = `<tr class="empty-row"><td colspan="8">Loading...</td></tr>`;

    const data = await dbGet("formulas", "?order=created_at.desc");
    if (!Array.isArray(data)) {
        showToast("Failed to load", "error");
        return;
    }

    allFormulas = data;

    // 🔥 أضف السطر ده
    const batches = await dbGet("batches");

    renderTable(data, batches);
    updateStats(data);
    loadTableStockBadges(data);
}

function updateStats(data) {
    const s = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    s("stat-total", data.length);
    s("stat-cyan", data.filter(f => f.cyan > 0).length);
    s("stat-magenta", data.filter(f => f.magenta > 0).length);
    s("stat-black", data.filter(f => f.black > 0).length);
}
function renderTable(data) {
    const tbody = document.getElementById("formulas-tbody");

    if (!data.length) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="7">No formulas yet</td></tr>`;
        return;
    }

    let rows = "";

    for (const f of data) {

        const comps = COLORS
            .filter(c => (f[c] || 0) > 0)
            .map(c => COLOR_LABELS[c])
            .join(", ");

        rows += `
<tr>
    <td class="td-code">${f.code}</td>

    <td style="font-weight:600">${f.name}</td>

    <td>${Number(f.drum_kg || 20).toFixed(1)} KG</td>

    <td style="color:var(--text-2)">
        ${comps || "-"}
    </td>

    <!-- Returned لازم يكون بعد Components -->
    <td id="tbl-return-${f.id}" style="font-weight:600;color:var(--warn)">
        Loading...
    </td>

    <td style="color:var(--text-3)">
        ${f.created_at ? new Date(f.created_at).toLocaleDateString() : "-"}
    </td>

    <td class="td-actions">
        <button class="btn btn-ghost" onclick="viewFormula(${f.id})">View</button>
        <button class="btn btn-danger" onclick="deleteFormula(${f.id}, '${f.code}')">Delete</button>
    </td>
</tr>
`;
    }

    tbody.innerHTML = rows;

    // تشغيل المرتجع بعد DOM
    requestAnimationFrame(() => {
        loadReturnedValues(data);

        console.log(
            "RETURN CELLS:",
            document.querySelectorAll("[id^='tbl-return']").length
        );
    });
}
async function loadReturnedValues(formulas) {

    const batches = await dbGet("batches");

    formulas.forEach(f => {

        const related = batches.filter(b =>
     String(b.formula_code).trim() === String(f.code).trim()        );

        const totalReturned = related.reduce((sum, b) =>
            sum + Number(b.returned_kg || 0)
        , 0);

        const el = document.getElementById(`tbl-return-${f.id}`);
        if (el) {
            el.innerHTML = `
                <div style="color:var(--warn);font-weight:700">
                    ${totalReturned.toFixed(2)} KG
                </div>
            `;
        }
    });
}
async function loadReturnValues(data) {
    for (const f of data) {
        const batches = await getFormulaBatchesByCode(f.code);

        const total = batches.reduce(
            (sum, b) => sum + Number(b.returned_kg || 0),
            0
        );

        const el = document.getElementById(`tbl-return-${f.id}`);
        if (el) el.textContent = `${total.toFixed(2)} KG`;
    }
}
function getSkuAction(batch) {
    if ((parseFloat(batch.returned_kg) || 0) > 0) return "Returned From Machine";
    if (batch.status === "done") return "Production Completed";
    if (batch.status === "mixing") return "Mixing In Progress";
    if (batch.status === "pending") return "Waiting Production";
    if (batch.status === "in_production") return "In Production";
    return "No Action";
}

function getBatchMovementLabel(batch) {
    const returned = numberOr(batch.returned_kg, 0);
    if (returned > 0) return `Returned / deducted ${returned.toFixed(1)} KG`;
    if (batch.status === "done") return "Production completed";
    if (batch.status === "mixing") return "Mixing in progress";
    if (batch.status === "in_production") return "In production";
    if (batch.status === "pending") return "Waiting production";
    return "No movement";
}

function loadTableStockBadges(data) {
    data.forEach(f => {
        const el = document.getElementById(`tbl-stock-${f.id}`);
        if (!el) return;

        getFormulaStock(f.id).then(stock => {
            if (!stock || stock.count === 0) {
                el.innerHTML = `<div style="color:#9aa4b2">No Production</div>`;
                return;
            }

            if (stock.totalNet <= 0) {
                el.innerHTML = `
                    <div style="color:#ff4d6a;font-weight:800">Empty</div>
                    <div style="font-size:0.7rem;color:var(--text-3);margin-top:2px">Returned ${stock.totalReturned.toFixed(1)} KG</div>`;
            } else {
                el.innerHTML = `
                    <div style="color:var(--green);font-weight:800">${stock.totalNet.toFixed(1)} KG</div>
                    <div style="font-size:0.7rem;color:var(--text-3);margin-top:2px">Available Stock</div>`;
            }
        });
    });
}

function loadTableBatchInfo(data) {
    data.forEach(f => {
        const el = document.getElementById(`tbl-batches-${f.id}`);
        if (!el) return;

        getFormulaBatchesByCode(f.code).then(batches => {
            if (!Array.isArray(batches) || !batches.length) {
                el.innerHTML = `<div style="color:var(--text-3);font-weight:700">No batches</div>`;
                return;
            }

            const totalProduced = batches.reduce((sum, b) => sum + numberOr(b.target_kg, 0), 0);
            const totalReturned = batches.reduce((sum, b) => sum + numberOr(b.returned_kg, 0), 0);
            const totalNet = totalProduced - totalReturned;
            const latest = batches[batches.length - 1];
            const status = latest.status || "no_status";
            const statusColor = batchStatusColor(status);
            const latestMovement = getBatchMovementLabel(latest);
            const lastDate = latest.updated_at || latest.created_at;
            const lastDateText = lastDate ? new Date(lastDate).toLocaleDateString() : "-";

            el.innerHTML = `
                <button type="button"
                    onclick="viewFormula(${f.id})"
                    title="Open formula batches"
                    style="width:100%;background:none;border:0;padding:0;margin:0;text-align:left;cursor:pointer;color:inherit">
                    <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px">
                        <span style="font-weight:800;color:var(--accent);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${htmlEscape(latest.batch_no || latest.id)}</span>
                        <span style="font-size:0.72rem;font-weight:800;color:${statusColor};white-space:nowrap">${htmlEscape(status.replace("_", " "))}</span>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 8px;color:var(--text-3);font-size:0.74rem">
                        <span>${batches.length} batch(es)</span>
                        <span style="font-family:var(--mono);text-align:right;color:${totalNet > 0 ? "var(--green)" : "#ff4d6a"}">${totalNet.toFixed(1)} KG left</span>
                        <span style="font-family:var(--mono);color:var(--accent)">${totalProduced.toFixed(1)} KG prod.</span>
                        <span style="font-family:var(--mono);text-align:right;color:${totalReturned > 0 ? "var(--warn)" : "var(--text-3)"}">${totalReturned.toFixed(1)} KG ret.</span>
                    </div>
                    <div style="margin-top:5px;padding-top:5px;border-top:1px solid var(--border);display:flex;justify-content:space-between;gap:8px;color:var(--text-2);font-size:0.72rem">
                        <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${htmlEscape(latestMovement)}</span>
                        <span style="color:var(--text-3);white-space:nowrap">${htmlEscape(lastDateText)}</span>
                    </div>
                </button>`;
        }).catch(err => {
            console.error(err);
            el.innerHTML = `<div style="color:#ff4d6a;font-weight:700">Batch load error</div>`;
        });
    });
}

async function patchBatch(batchId, body) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/batches?id=eq.${supabaseValue(batchId)}`, {
        method: "PATCH",
        headers: {
            ...headers,
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        },
        body: JSON.stringify(body)
    });

    let data = null;
    try { data = await res.json(); } catch (e) {}
    return { ok: res.ok, data };
}

async function getFormulaBatchesById(formulaId) {
    const query = [
        `formula_id=eq.${formulaId}`,
        "select=*",
        "order=created_at.asc"
    ].join("&");

    const res = await fetch(`${SUPABASE_URL}/rest/v1/batches?${query}`, {
        headers: HEADERS
    });

    const data = await res.json();
    return Array.isArray(data) ? data : [];
}

function closeReturnModal(e) {
    if (e && e.target !== e.currentTarget) return;

    const modal = document.getElementById("return-modal");
    if (modal) modal.style.display = "none";
}
async function getBatchById(batchId) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/batches?id=eq.${supabaseValue(batchId)}&select=*`, { headers });
    const data = await res.json();
    return Array.isArray(data) && data.length ? data[0] : null;
}

function batchStatusColor(status) {
    if (status === "done") return "var(--green)";
    if (status === "mixing" || status === "in_production") return "var(--warn)";
    if (status === "pending") return "var(--accent)";
    return "var(--text-3)";
}

async function renderFormulaBatchList(formulaCode, containerId, detailsId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
        <div style="color:var(--text-3);font-size:0.82rem;padding:10px">
            Loading batches...
        </div>
    `;

    try {
        const batches = await getFormulaBatchesByCode(formulaCode);

        if (!batches.length) {
            el.innerHTML = `
                <div style="
                    color:var(--text-3);
                    font-size:0.82rem;
                    padding:10px;
                    border:1px solid var(--border);
                    border-radius:8px;
                    background:var(--bg2)">
                    No batches found for this formula
                </div>
            `;
            return;
        }

        const totalProduced = batches.reduce(
            (sum, b) => sum + Number(b.target_kg || b.produced_kg || 0),
            0
        );

        const totalReturned = batches.reduce(
            (sum, b) => sum + Number(b.returned_kg || 0),
            0
        );

        const availableKg = totalProduced - totalReturned;

        let html = `
            <div class="batch-summary-grid">

                <div class="summary-card">
                    <div class="summary-value">${batches.length}</div>
                    <div class="summary-label">Batches</div>
                </div>

                <div class="summary-card">
                    <div class="summary-value">${totalProduced.toFixed(1)}</div>
                    <div class="summary-label">Produced KG</div>
                </div>

                <div class="summary-card">
                    <div class="summary-value">${totalReturned.toFixed(1)}</div>
                    <div class="summary-label">Returned KG</div>
                </div>

                <div class="summary-card">
                    <div class="summary-value">${availableKg.toFixed(1)}</div>
                    <div class="summary-label">Available KG</div>
                </div>

            </div>
        `;

        batches.forEach(batch => {

            const target = parseFloat(batch.target_kg || 0);
            const returned = parseFloat(batch.returned_kg || 0);
            const net = Math.max(0, target - returned);

            const statusColor = batchStatusColor(batch.status);

           html += `
<button
    type="button"
    class="btn btn-ghost"
    style="
        width:100%;
        display:flex;
        flex-direction:column;
        align-items:flex-start;
        gap:6px;
        padding:12px;
        margin-bottom:8px;
        border-radius:8px;
        border:1px solid var(--border);
        background:var(--surface2)
    "
    onclick="viewBatchFromFormula(${jsString(batch.id)}, ${jsString(detailsId)})">

    <div style="font-weight:800;color:var(--accent)">
        ${htmlEscape(batch.batch_no || batch.id)}
    </div>

    <div style="font-size:0.82rem;color:var(--text-2)">
        Produced: ${target.toFixed(1)} KG
    </div>

    <div style="font-size:0.82rem;color:var(--warn)">
        Returned: ${returned.toFixed(1)} KG
    </div>

    <div style="font-size:0.82rem;color:${net > 0 ? "var(--green)" : "#ff4d6a"}">
        Available: ${net.toFixed(1)} KG
    </div>

    <div style="font-size:0.75rem;font-weight:700;color:${statusColor}">
        ${htmlEscape(batch.status || "No Status")}
    </div>

</button>
`;
            
        });

        el.innerHTML = html;

    } catch (err) {
        console.error(err);

        el.innerHTML = `
            <div style="
                color:#ff4d6a;
                font-size:0.82rem;
                padding:10px;
                border:1px solid var(--border);
                border-radius:8px;
                background:var(--bg2)">
                Failed to load batches
            </div>
        `;
    }
}
async function viewBatchFromFormula(batchId, detailsId) {
    const el = document.getElementById(detailsId);
    if (!el) return;

    el.innerHTML = `<div style="color:var(--text-3);font-size:0.82rem;padding:10px">Loading batch details...</div>`;

    try {
        const batch = await getBatchById(batchId);
        if (!batch) {
            el.innerHTML = `<div style="color:#ff4d6a;font-size:0.82rem;padding:10px">Batch not found</div>`;
            return;
        }

        const target = parseFloat(batch.target_kg || 0);
        const returned = parseFloat(batch.returned_kg || 0);
        const net = Math.max(0, target - returned);
        const statusColor = batchStatusColor(batch.status);
        const created = batch.created_at ? new Date(batch.created_at).toLocaleString() : "-";
        const updated = batch.updated_at ? new Date(batch.updated_at).toLocaleString() : "-";

        el.innerHTML = `
            <div style="padding:14px;border-radius:10px;border:1px solid var(--border);background:var(--bg2)">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:12px">
                    <div>
                        <div style="font-size:0.72rem;font-weight:700;color:var(--text-3);text-transform:uppercase;margin-bottom:3px">Selected Batch</div>
                        <div style="font-size:1rem;font-weight:900;color:var(--accent)">${htmlEscape(batch.batch_no || batch.id)}</div>
                    </div>
                    <span style="font-size:0.78rem;font-weight:800;color:${statusColor};border:1px solid ${statusColor};border-radius:999px;padding:4px 10px">${htmlEscape(batch.status || "No Status")}</span>
                </div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px">
                    <div style="padding:10px;border:1px solid var(--border);border-radius:8px;background:rgba(255,255,255,0.03);text-align:center">
                        <div style="font-size:0.7rem;color:var(--text-3);font-weight:700;text-transform:uppercase">Target</div>
                        <div style="font-family:var(--mono);font-weight:900;color:var(--accent);margin-top:4px">${target.toFixed(2)} KG</div>
                    </div>
                    <div style="padding:10px;border:1px solid var(--border);border-radius:8px;background:rgba(255,255,255,0.03);text-align:center">
                        <div style="font-size:0.7rem;color:var(--text-3);font-weight:700;text-transform:uppercase">Deducted / Returned</div>
                        <div style="font-family:var(--mono);font-weight:900;color:var(--warn);margin-top:4px">${returned.toFixed(2)} KG</div>
                    </div>
                    <div style="padding:10px;border:1px solid var(--border);border-radius:8px;background:rgba(255,255,255,0.03);text-align:center">
                        <div style="font-size:0.7rem;color:var(--text-3);font-weight:700;text-transform:uppercase">Available</div>
                        <div style="font-family:var(--mono);font-weight:900;color:${net > 0 ? "var(--green)" : "#ff4d6a"};margin-top:4px">${net.toFixed(2)} KG</div>
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:0.82rem;color:var(--text-2);margin-bottom:12px">
                    <div><strong style="color:var(--text-3)">Formula:</strong> ${htmlEscape(batch.formula_code || "-")}</div>
                    <div><strong style="color:var(--text-3)">Batch ID:</strong> ${htmlEscape(batch.id)}</div>
                    <div><strong style="color:var(--text-3)">Created:</strong> ${htmlEscape(created)}</div>
                    <div><strong style="color:var(--text-3)">Updated:</strong> ${htmlEscape(updated)}</div>
                    <div><strong style="color:var(--text-3)">QR:</strong> ${htmlEscape(batch.qr_code || "-")}</div>
                    <div><strong style="color:var(--text-3)">Barcode:</strong> ${htmlEscape(batch.barcode || "-")}</div>
                </div>
                ${batch.notes ? `<div style="font-size:0.82rem;color:var(--text-2);padding:10px;border-radius:8px;background:rgba(255,255,255,0.03);border:1px solid var(--border);margin-bottom:12px">${htmlEscape(batch.notes)}</div>` : ""}
                <div style="display:flex;gap:8px;flex-wrap:wrap">
                    <button class="btn btn-ghost" style="font-size:0.82rem;padding:6px 12px" onclick="window.location.href='batches.html?batch=${encodeURIComponent(batch.batch_no || batch.id)}'">Open in Batches Page</button>
                    <button class="btn btn-ghost" style="font-size:0.82rem;padding:6px 12px;color:var(--warn);border-color:var(--warn)" onclick="deductFormulaStockByBatch(${jsString(batch.id)}, ${jsString(detailsId)})">Deduct From This Batch</button>
                </div>
            </div>`;
    } catch (err) {
        console.error(err);
        el.innerHTML = `<div style="color:#ff4d6a;font-size:0.82rem;padding:10px">Failed to load batch details</div>`;
    }
}

async function deductFormulaStockByBatch(batchId, detailsId) {
    const batch = await getBatchById(batchId);
    if (!batch) {
        showToast("Batch not found", "error");
        return;
    }

    const target = parseFloat(batch.target_kg || 0);
    const returned = parseFloat(batch.returned_kg || 0);
    const available = Math.max(0, target - returned);
    if (available <= 0) {
        showToast("This batch has no available stock", "warn");
        return;
    }

    const input = prompt(`Deduct from batch ${batch.batch_no || batch.id}\n\nAvailable: ${available.toFixed(2)} KG\nEnter quantity:`, available.toFixed(2));
    if (!input) return;

    const deductKg = parseFloat(input);
    if (!Number.isFinite(deductKg) || deductKg <= 0) {
        showToast("Invalid KG value", "warn");
        return;
    }
    if (deductKg > available + 0.0001) {
        showToast(`Not enough stock. Available: ${available.toFixed(2)} KG`, "warn");
        return;
    }

    const newReturned = returned + deductKg;
    const result = await patchBatch(batch.id, {
        returned_kg: Number(newReturned.toFixed(3)),
        status: newReturned >= target - 0.0001 ? "done" : batch.status
    });

    if (!result.ok) {
        showToast("Batch update failed", "error");
        console.error(result.data);
        return;
    }

    showToast(`Deducted ${deductKg.toFixed(2)} KG from batch`, "success");
    await viewBatchFromFormula(batch.id, detailsId);
    await loadFormulas();
}

async function deductFormulaStock(formulaId) {
    const f = allFormulas.find(x => x.id === formulaId);
    if (!f) return;

    const stock = await getFormulaStock(formulaId);
    if (!stock || stock.totalNet <= 0) {
        showToast("No available stock for this formula", "warn");
        return;
    }

    const input = prompt(
        `Deduct stock from "${f.code} - ${f.name}"\n\nAvailable: ${stock.totalNet.toFixed(2)} KG\nEnter quantity to deduct:`,
        stock.totalNet.toFixed(2)
    );
    if (!input) return;

    const deductKg = parseFloat(input);
    if (!Number.isFinite(deductKg) || deductKg <= 0) {
        showToast("Invalid KG value", "warn");
        return;
    }
    if (deductKg > stock.totalNet + 0.0001) {
        showToast(`Not enough stock. Available: ${stock.totalNet.toFixed(2)} KG`, "warn");
        return;
    }

    if (!confirm(`Deduct ${deductKg.toFixed(2)} KG from ${f.code}?`)) return;

    const batches = await getFormulaBatchesByCode(f.id);
    let remaining = deductKg;
    let updatedCount = 0;

    for (const batch of batches) {
        if (remaining <= 0.0001) break;

        const target = parseFloat(batch.target_kg || 0);
        const returned = parseFloat(batch.returned_kg || 0);
        const available = Math.max(0, target - returned);
        if (available <= 0) continue;

        const used = Math.min(available, remaining);
        const newReturned = returned + used;
        const newStatus = newReturned >= target - 0.0001 ? "done" : batch.status;
        const result = await patchBatch(batch.id, {
            returned_kg: Number(newReturned.toFixed(3)),
            status: newStatus
        });

        if (!result.ok) {
            showToast("Stock deduction failed", "error");
            console.error(result.data);
            return;
        }

        remaining -= used;
        updatedCount++;
    }

    if (remaining > 0.0001) {
        showToast("Could not deduct the full quantity", "error");
        return;
    }

    showToast(`Deducted ${deductKg.toFixed(2)} KG from ${updatedCount} batch(es)`, "success");
    await loadFormulas();
}

function filterFormulas() {
    const q = (document.getElementById("search-input")?.value || "").toLowerCase();
    const filtered = allFormulas.filter(f =>
        String(f.code || "").toLowerCase().includes(q) ||
        String(f.name || "").toLowerCase().includes(q)
    );
    renderTable(filtered);
}

function viewFormula(id) {
    const f = allFormulas.find(x => x.id === id);
    if (!f) return;

    const cluster = getCluster(f);
    document.getElementById("modal-title").textContent = f.code + " - " + f.name;

    const rows = COLORS.filter(c => f[c] > 0).map(c => `
        <tr>
            <td style="font-weight:600">${COLOR_LABELS[c]}</td>
            <td style="font-family:var(--mono);color:var(--accent)">${Number(f[c]).toFixed(3)} KG</td>
            <td style="color:var(--text-3)">${((f[c] / f.drum_kg) * 100).toFixed(2)}%</td>
            <td style="color:var(--text-3);font-size:0.78rem">w: ${COLOR_WEIGHT[c]}</td>
        </tr>`).join("");

    const labSection = f.lab_l !== null ? `
        <div style="margin-bottom:16px">
            <div style="font-size:0.75rem;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Lab Values (CIE L*a*b*)</div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
                ${["L*","a*","b*"].map((ch,i) => {
                    const v = [f.lab_l, f.lab_a, f.lab_b][i];
                    return `<div style="background:var(--bg2);padding:12px;border-radius:8px;border:1px solid var(--border);text-align:center">
                        <div style="font-size:0.7rem;color:var(--text-3);margin-bottom:4px">${ch}</div>
                        <div style="font-size:1.4rem;font-weight:800;color:var(--accent)">${v}</div>
                    </div>`;
                }).join("")}
            </div>
        </div>` : "";

    const qrId = "qr-" + id;
    const barId = "bar-" + id;
    const batchListId = "formula-batches-" + id;
    const batchDetailsId = "formula-batch-details-" + id;

    document.getElementById("modal-body").innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;padding:10px 14px;background:${cluster.color}11;border-radius:8px;border:1px solid ${cluster.color}33">
            <span style="font-weight:700;color:${cluster.color}">${htmlEscape(cluster.icon)} - ${htmlEscape(cluster.name)}</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
            <div style="background:var(--bg2);padding:14px;border-radius:10px;border:1px solid var(--border)">
                <div style="font-size:0.72rem;font-weight:700;color:var(--text-3);margin-bottom:4px;text-transform:uppercase">Drum Size</div>
                <div style="font-size:1.6rem;font-weight:800;color:var(--accent)">${Number(f.drum_kg).toFixed(1)} KG</div>
            </div>
            <div style="background:var(--bg2);padding:14px;border-radius:10px;border:1px solid var(--border)">
                <div style="font-size:0.72rem;font-weight:700;color:var(--text-3);margin-bottom:4px;text-transform:uppercase">Date</div>
                <div>${f.created_at ? new Date(f.created_at).toLocaleDateString() : "-"}</div>
            </div>
        </div>
        ${labSection}
        <div style="margin-bottom:14px">
            <div style="font-size:0.72rem;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Formula Production</div>
            <span id="modal-stock-${f.id}"><span style="color:var(--text-3);font-size:0.82rem">Loading...</span></span>
        </div>
        <div style="margin-bottom:16px">
            <div style="font-size:0.72rem;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Related Batches</div>
            <div id="${batchListId}"></div>
            <div id="${batchDetailsId}" style="margin-top:10px"></div>
        </div>
        ${f.notes ? `<div style="padding:12px;background:var(--bg2);border-radius:8px;border:1px solid var(--border);margin-bottom:14px;color:var(--text-2)">${htmlEscape(f.notes)}</div>` : ""}
        <div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px">
            <table>
                <thead><tr><th>Material</th><th>KG</th><th>%</th><th>Weight</th></tr></thead>
                <tbody>${rows || `<tr><td colspan="4" style="text-align:center;color:var(--text-3);padding:20px">No components</td></tr>`}</tbody>
            </table>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
            <div style="text-align:center;background:var(--bg2);padding:14px;border-radius:10px;border:1px solid var(--border)">
                <div style="font-size:0.72rem;font-weight:700;color:var(--text-3);margin-bottom:10px;text-transform:uppercase">QR Code</div>
                <div id="${qrId}" style="display:inline-block;background:white;padding:8px;border-radius:6px"></div>
            </div>
            <div style="text-align:center;background:var(--bg2);padding:14px;border-radius:10px;border:1px solid var(--border)">
                <div style="font-size:0.72rem;font-weight:700;color:var(--text-3);margin-bottom:10px;text-transform:uppercase">Barcode</div>
                <div style="background:white;padding:8px;border-radius:6px;display:inline-block"><svg id="${barId}"></svg></div>
            </div>
        </div>
        <div class="btn-row">
           <button class="btn btn-primary" onclick="exportFormulaPDF(${id})">
  Export PDF
</button>
            <button class="btn btn-ghost" style="color:var(--green);border-color:var(--green)" onclick="convertToProduction(${id})">Convert to Production</button>
            <button class="btn btn-ghost" onclick="closeModal()">Close</button>
        </div>`;

    document.getElementById("view-modal").classList.add("open");
    setTimeout(() => {
        try { new QRCode(document.getElementById(qrId), { text: JSON.stringify({ code: f.code, name: f.name, drum_kg: f.drum_kg }), width: 110, height: 110, colorDark: "#000000", colorLight: "#ffffff" }); } catch (e) {}
        try { JsBarcode("#" + barId, f.code, { format: "CODE128", width: 2, height: 55, displayValue: true, fontSize: 11, background: "#ffffff", lineColor: "#000000" }); } catch (e) {}
    }, 200);
    renderStockBadge(f.id, `modal-stock-${f.id}`);
    renderFormulaBatchList(f.code, batchListId, batchDetailsId);
}

function closeModal() {
    document.getElementById("view-modal").classList.remove("open");
    document.getElementById("modal-body").innerHTML = "";
}
function exportFormulaPDF(id) {
  const formula = allFormulas.find(x => x.id == id);

  if (!formula) return alert("Formula not found");

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // =========================
  // HEADER 3P COLORS
  // =========================
  doc.setFontSize(22);

  doc.setTextColor(255, 0, 0);
  doc.text("3", 20, 20);

  doc.setTextColor(0, 255, 0);
  doc.text("P", 28, 20);

 
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.text("INK LAB FORMULA REPORT", 60, 20);

  // =========================
  // BASIC INFO
  // =========================
  doc.setFontSize(12);
  doc.text(`Code: ${formula.code || "-"}`, 20, 40);
  doc.text(`Name: ${formula.name || "-"}`, 20, 50);
  

  // =========================
  // COLORS (only with quantities > 0)
  // =========================
  doc.setFontSize(12);
  doc.text("Colors:", 20, 80);

  const colors = [
    ["Cyan", formula.cyan],
    ["Magenta", formula.magenta],
    ["Yellow", formula.yellow],
    ["Black", formula.black],
    ["White", formula.white],
    ["Reflex Blue", formula.reflex_blue],
    ["Violet", formula.violet],
    ["Green", formula.green],
    ["Silver", formula.silver],
    ["Gold", formula.gold],
    ["Varnish", formula.varnish],
    ["Transparent Base", formula.transparent_base],
    ["Fluor Pink", formula.fluor_pink],
    ["Fluor Yellow", formula.fluor_yellow],
    ["Rubine Red", formula.rubine_red],
  ].filter(c => Number(c[1]) > 0);

  let y = 90;

  colors.forEach(c => {
    doc.text(`${c[0]}: ${Number(c[1]).toFixed(3)} KG`, 20, y);
    y += 7;
  });

  // =========================
  // BARCODE
  // =========================
  const barcodeCanvas = document.createElement("canvas");

  JsBarcode(barcodeCanvas, formula.code, {
    format: "CODE128",
    displayValue: true,
    width: 2,
    height: 50
  });

  const barcodeImg = barcodeCanvas.toDataURL("image/png");
  doc.addImage(barcodeImg, "PNG", 120, 35, 70, 25);

  // =========================
  // QR CODE (safe async handling)
  // =========================
  const qrDiv = document.createElement("div");

  new QRCode(qrDiv, {
    text: JSON.stringify({
      code: formula.code,
      name: formula.name,
      drum_kg: formula.drum_kg
    }),
    width: 120,
    height: 120
  });

  setTimeout(() => {
    const qrImg = qrDiv.querySelector("img")?.src;

    if (qrImg) {
      doc.addImage(qrImg, "PNG", 145, 70, 45, 45);
    }

    // =========================
    // FOOTER
    // =========================
    doc.setFontSize(10);
    doc.text("QUALITY FIRST - 3P Ink Lab System", 20, 280);
    doc.text("Approved By: ____________", 120, 280);

    doc.save(`${formula.code || "formula"}.pdf`);
  }, 300);
}
async function convertToProduction(id) {
    const f = allFormulas.find(x => x.id === id);
    if (!f) return;

    const input = prompt(`Convert "${f.code} - ${f.name}" to Production\n\nEnter target KG (drum size: ${f.drum_kg} KG):`, f.drum_kg);
    if (!input) return;

    const targetKg = parseFloat(input);
    if (!targetKg || targetKg <= 0) {
        showToast("Invalid KG value", "warn");
        return;
    }

    const now = new Date();
    const dateStr = now.getFullYear().toString()
        + String(now.getMonth() + 1).padStart(2, "0")
        + String(now.getDate()).padStart(2, "0");
    const existing = await dbGet("batches", `?formula_code=eq.${f.code}&select=id`);
    const count = Array.isArray(existing) ? existing.length + 1 : 1;
    const batchNo = `${f.code}-${dateStr}-${String(count).padStart(3, "0")}`;

    const result = await dbPost("batches", {
        batch_no: batchNo,
        formula_id: f.id,
        formula_code: f.code,
        target_kg: targetKg,
        returned_kg: 0,
        status: "in_production",
        notes: `Production run for: ${f.name}`,
        qr_code: batchNo,
        barcode: batchNo
    });

    if (result.ok) {
        showToast(`Batch ${batchNo} created - In Production`, "success");
        closeModal();
        setTimeout(() => {
            window.location.href = `batches.html?formula=${encodeURIComponent(f.code)}`;
        }, 1000);
    } else {
        showToast("Error: " + (result.data?.message || "Unknown"), "error");
    }
}

function goConvertToProduction(id, code, drumKg) {
    convertToProduction(id);
}

function handleOverlayClick(e) {
    if (e.target === document.getElementById("view-modal")) closeModal();
}
function calculateFormulaCorrection(formulaId) {

    const actualL = parseFloat(document.getElementById("corr-l").value);
    const actualA = parseFloat(document.getElementById("corr-a").value);
    const actualB = parseFloat(document.getElementById("corr-b").value);

    if (isNaN(actualL) || isNaN(actualA) || isNaN(actualB)) {
        document.getElementById("correction-result").innerHTML =
            `<div style="color:red;padding:10px">Please enter valid LAB values</div>`;
        return;
    }

    // لو في formula محدد نقارن بيه
    let baseL = 0, baseA = 0, baseB = 0;
    if (formulaId) {
        const formula = allFormulas.find(f => f.id == formulaId);
        if (formula) {
            baseL = Number(formula.lab_l ?? 0);
            baseA = Number(formula.lab_a ?? 0);
            baseB = Number(formula.lab_b ?? 0);
        }
    }

    const deltaL = actualL - baseL;
    const deltaA = actualA - baseA;
    const deltaB = actualB - baseB;
    const deltaE = Math.sqrt(deltaL**2 + deltaA**2 + deltaB**2);

    let correction = [];
    if (deltaL > 0.5)  correction.push("⬛ Add Black (too light)");
    if (deltaL < -0.5) correction.push("⬜ Add White (too dark)");
    if (deltaA > 0.5)  correction.push("🟢 Add Green (too red)");
    if (deltaA < -0.5) correction.push("🔴 Add Rubine Red (too green)");
    if (deltaB > 0.5)  correction.push("🔵 Add Reflex Blue (too yellow)");
    if (deltaB < -0.5) correction.push("🟡 Add Yellow (too blue)");

    document.getElementById("correction-result").innerHTML = `
        <div class="batch-summary-grid">
            <div class="summary-card">
                <div class="summary-value">${deltaL.toFixed(2)}</div>
                <div class="summary-label">ΔL</div>
            </div>
            <div class="summary-card">
                <div class="summary-value">${deltaA.toFixed(2)}</div>
                <div class="summary-label">Δa</div>
            </div>
            <div class="summary-card">
                <div class="summary-value">${deltaB.toFixed(2)}</div>
                <div class="summary-label">Δb</div>
            </div>
            <div class="summary-card">
                <div class="summary-value" style="color:${deltaE < 2 ? 'var(--green)' : deltaE < 5 ? 'var(--warn)' : 'var(--danger)'}">
                    ${deltaE.toFixed(2)}
                </div>
                <div class="summary-label">ΔE</div>
            </div>
        </div>
        <div style="margin-top:12px;padding:12px;background:var(--bg2);border:1px solid var(--border);border-radius:10px">
            ${correction.length ? correction.join("<br>") : "✅ No correction required"}
        </div>
    `;
}
async function deleteFormula(id, code) {
    if (!confirm(`Delete formula "${code}"?`)) return;
    const result = await dbDelete("formulas", id);
    if (result.ok) {
        showToast("Deleted", "success");
        loadFormulas();
    } else {
        showToast("Delete failed", "error");
    }
}

loadFormulas();
setTimeout(() => setMatchMode("ratio"), 200);

setInterval(() => {
    if (document.hidden || !allFormulas.length) return;
    loadTableStockBadges(allFormulas);
    loadTableBatchInfo(allFormulas);
}, 20000);

// Auto-refresh stock when returning to this page
window.addEventListener("focus", () => {
    if (allFormulas.length) loadTableStockBadges(allFormulas);
});
window.COLORS = window.COLORS || [
    "cyan","magenta","yellow","black","white",
    "reflex_blue","violet","green","silver","gold",
    "varnish","transparent_base","fluor_pink","fluor_yellow","rubine_red"
];

window.COLOR_LABELS = window.COLOR_LABELS || {
    cyan: "Cyan",
    magenta: "Magenta",
    yellow: "Yellow",
    black: "Black",
    white: "White",
    reflex_blue: "Reflex Blue",
    violet: "Violet",
    green: "Green",
    silver: "Silver",
    gold: "Gold",
    varnish: "Varnish",
    transparent_base: "Transparent Base",
    fluor_pink: "Fluor Pink",
    fluor_yellow: "Fluor Yellow",
    rubine_red: "Rubine Red"
};
window.addEventListener("batch-updated", () => {
    loadReturnedValues(allFormulas);
});
window.openReturnHistory = openReturnHistory;
window.closeReturnModal = closeReturnModal;
window.openReturnHistory = function (formulaId, code) {
    console.log("OPEN OK", formulaId, code);

    const modal = document.getElementById("return-modal");
    const body = document.getElementById("return-modal-body");

    modal.style.display = "flex";
    body.innerHTML = "Loading...";

    getFormulaBatchesById(formulaId).then(batches => {

        if (!batches.length) {
            body.innerHTML = "<div>No data</div>";
            return;
        }

        const total = batches.reduce((s, b) => s + Number(b.returned_kg || 0), 0);

        body.innerHTML = `
            <h3>${code}</h3>
            <p>Total Returned: ${total.toFixed(2)} KG</p>
            ${batches.map(b => `
                <div style="padding:6px;border-bottom:1px solid #333">
                    ${b.batch_no} - ${Number(b.returned_kg || 0).toFixed(2)} KG
                </div>
            `).join("")}
        `;
    });
};
function runAIEngine(newF) {

    const box = document.getElementById("match-box");

    // 1. Ratio Match
    const ratioResult = runRatioMatch(newF, box);

    // 2. Delta E Match
    runDeltaEMatch(newF, box);

    // 3. Suggestions (لو موجود عندك بالفعل)
    const best = ratioResult?.best || null;

    if (best) {
        const suggestions = getCorrections(newF, best.f);

        console.log("AI Suggestions:", suggestions);
    }
}
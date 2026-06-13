// INK LAB ERP — formulas.js

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

// Tolerance per component in KG
const KG_TOLERANCE = 0.5;

let allFormulas = [];
let formOpen    = false;
let matchTimer  = null;

startClock();

// ── TOGGLE ───────────────────────────────────────────────────
function toggleForm() {
    formOpen = !formOpen;
    document.getElementById("formula-form").style.display = formOpen ? "block" : "none";
    document.getElementById("toggle-btn").textContent     = formOpen ? "✕ Close" : "+ Add Formula";
    if (!formOpen) resetForm();
}

// ── RESET ────────────────────────────────────────────────────
function resetForm() {
    document.getElementById("f-code").value  = "";
    document.getElementById("f-name").value  = "";
    document.getElementById("f-notes").value = "";
    document.getElementById("f-drum").value  = "20";
    COLORS.forEach(c => document.getElementById("f-" + c).value = "0");
    document.getElementById("match-box").style.display = "none";
}

// ── READ FORM ────────────────────────────────────────────────
function readForm() {
    const f = {
        code:    document.getElementById("f-code").value.trim().toUpperCase(),
        name:    document.getElementById("f-name").value.trim(),
        drum_kg: parseFloat(document.getElementById("f-drum").value) || 20,
        notes:   document.getElementById("f-notes").value.trim(),
    };
    COLORS.forEach(c => f[c] = parseFloat(document.getElementById("f-" + c).value) || 0);
    return f;
}

// ── SMART MATCH ──────────────────────────────────────────────
// Compares KG values directly with 0.5 KG tolerance per component
function calcSimilarity(newF, existing) {
    const newActive = COLORS.filter(c => (newF[c]||0) > 0);
    const exActive  = COLORS.filter(c => (existing[c]||0) > 0);
    const allActive = COLORS.filter(c => (newF[c]||0) > 0 || (existing[c]||0) > 0);

    if (allActive.length === 0) return 0;

    // Must share at least one component
    const common = newActive.filter(c => exActive.includes(c));
    if (common.length === 0) return 0;

    // Structure match: same components used?
    const structScore = (common.length / Math.max(newActive.length, exActive.length)) * 100;

    // KG accuracy: how close per component
    let kgScore = 0;
    allActive.forEach(c => {
        const diff = Math.abs((newF[c]||0) - (existing[c]||0));
        // Within tolerance = full score, beyond = 0
        kgScore += diff <= KG_TOLERANCE ? (1 - diff / KG_TOLERANCE) : 0;
    });
    const avgKgScore = (kgScore / allActive.length) * 100;

    // 30% structure + 70% KG accuracy
    return Math.round(structScore * 0.3 + avgKgScore * 0.7);
}

function onColorInput() {
    clearTimeout(matchTimer);
    matchTimer = setTimeout(runMatch, 400);
}

function runMatch() {
    const newF   = readForm();
    const hasInk = COLORS.some(c => newF[c] > 0);
    const box    = document.getElementById("match-box");
    if (!box) return;
    if (!hasInk || allFormulas.length === 0) { box.style.display = "none"; return; }

    const results = allFormulas
        .filter(ex => ex.code !== newF.code)
        .map(ex => ({ f: ex, pct: calcSimilarity(newF, ex) }))
        .filter(r => r.pct >= 40)
        .sort((a,b) => b.pct - a.pct);

    if (!results.length) { box.style.display = "none"; return; }

    const best  = results[0];
    const pct   = best.pct;
    const color = pct >= 85 ? "var(--danger)" : pct >= 65 ? "var(--warn)" : "var(--accent)";
    const label = pct >= 85 ? "⚠ Very High — Consider Reusing"
                : pct >= 65 ? "Similar Formula Found"
                : "Possible Match";

    // Per-component diff table
    const compRows = COLORS
        .filter(c => (newF[c]||0) > 0 || (best.f[c]||0) > 0)
        .map(c => {
            const nv    = newF[c]    || 0;
            const ev    = best.f[c]  || 0;
            const diff  = Math.abs(nv - ev);
            const exact = diff < 0.001;
            const ok    = diff <= KG_TOLERANCE;
            const txt   = exact ? "✓ Exact" : `Δ ${diff.toFixed(3)} KG`;
            const bg    = exact ? "var(--green-dim)"          : ok ? "rgba(99,147,255,0.12)" : "var(--warn-dim)";
            const col   = exact ? "var(--green)"              : ok ? "var(--accent)"          : "var(--warn)";
            return `<tr>
                <td style="font-weight:600">${COLOR_LABELS[c]}</td>
                <td style="font-family:var(--mono);color:var(--accent)">${nv.toFixed(3)} KG</td>
                <td style="font-family:var(--mono);color:var(--text-2)">${ev.toFixed(3)} KG</td>
                <td style="text-align:center">
                    <span style="font-size:0.76rem;padding:2px 9px;border-radius:99px;
                        font-weight:600;background:${bg};color:${col}">${txt}</span>
                </td>
            </tr>`;
        }).join("");

    const others = results.slice(1, 3).map(r => `
        <div style="display:flex;align-items:center;justify-content:space-between;
            padding:10px 14px;border-radius:8px;border:1px solid var(--border);
            background:var(--surface2);margin-top:8px">
            <div>
                <span style="color:var(--accent);font-weight:700">${r.f.code}</span>
                <span style="color:var(--text-2);margin-left:8px">${r.f.name}</span>
            </div>
            <div style="display:flex;align-items:center;gap:10px">
                <span style="font-weight:800;color:var(--text-2)">${r.pct}%</span>
                <button class="btn btn-ghost" style="font-size:0.8rem;padding:5px 10px"
                    onclick="viewFormula(${r.f.id})">View</button>
            </div>
        </div>`).join("");

    box.style.display = "block";
    box.innerHTML = `
        <div style="border:1.5px solid ${color};border-radius:12px;overflow:hidden">
            <div style="padding:12px 18px;background:rgba(0,0,0,0.2);
                display:flex;align-items:center;justify-content:space-between;
                border-bottom:1px solid var(--border)">
                <span style="font-weight:700;font-size:0.95rem;color:${color}">🏆 Best Match</span>
                <span style="font-size:0.8rem;color:var(--text-3)">${label}</span>
            </div>
            <div style="padding:16px 18px;display:flex;align-items:center;
                justify-content:space-between;gap:16px;flex-wrap:wrap;
                border-bottom:1px solid var(--border);background:var(--surface2)">
                <div>
                    <div style="font-size:1.1rem;font-weight:800;color:var(--accent)">${best.f.code}</div>
                    <div style="color:var(--text-2);margin-top:3px">${best.f.name}</div>
                    <div style="color:var(--text-3);font-size:0.82rem;margin-top:3px">
                        Drum: ${Number(best.f.drum_kg).toFixed(1)} KG
                    </div>
                </div>
                <div style="text-align:center">
                    <div style="font-size:3rem;font-weight:900;color:${color};line-height:1">${pct}%</div>
                    <div style="font-size:0.75rem;color:${color};font-weight:600;margin-top:2px">Similarity</div>
                    <button class="btn btn-primary" style="margin-top:10px;font-size:0.82rem;padding:6px 14px"
                        onclick="viewFormula(${best.f.id})">👁 View Formula</button>
                </div>
            </div>
            <div style="padding:14px 18px">
                <div style="font-size:0.75rem;font-weight:700;color:var(--text-3);
                    text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px">
                    Component Comparison — Tolerance ±${KG_TOLERANCE} KG per component
                </div>
                <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden">
                    <table>
                        <thead><tr>
                            <th>Material</th>
                            <th>New Formula</th>
                            <th>${best.f.code}</th>
                            <th style="text-align:center">Diff</th>
                        </tr></thead>
                        <tbody>${compRows}</tbody>
                    </table>
                </div>
            </div>
            ${others ? `<div style="padding:0 18px 14px">
                <div style="font-size:0.75rem;font-weight:700;color:var(--text-3);
                    text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">
                    Other Matches
                </div>${others}
            </div>` : ""}
        </div>`;
}

// ── SAVE ─────────────────────────────────────────────────────
async function saveFormula() {
    const f = readForm();
    if (!f.code) { showToast("Formula code is required", "warn"); return; }
    if (!f.name) { showToast("Formula name is required", "warn"); return; }

    // Warn if very high match
    const top = allFormulas
        .filter(ex => ex.code !== f.code)
        .map(ex => ({ f: ex, pct: calcSimilarity(f, ex) }))
        .sort((a,b) => b.pct - a.pct)[0];

    if (top && top.pct >= 85) {
        const ok = confirm(`"${top.f.code}" is ${top.pct}% similar.\nSave anyway?`);
        if (!ok) return;
    }

    const btn = document.getElementById("save-btn");
    btn.disabled    = true;
    btn.textContent = "Saving...";

    const result = await dbPost("formulas", f);

    btn.disabled    = false;
    btn.textContent = "💾 Save Formula";

    if (result.ok) {
        showToast("Formula saved ✓", "success");
        resetForm();
        toggleForm();
        loadFormulas();
    } else {
        const msg = result.data?.message || "Unknown error";
        showToast("Error: " + msg, "error");
    }
}

// ── LOAD ─────────────────────────────────────────────────────
async function loadFormulas() {
    const tbody = document.getElementById("formulas-tbody");
    tbody.innerHTML = `<tr class="empty-row"><td colspan="6">Loading...</td></tr>`;
    const data = await dbGet("formulas", "?order=created_at.desc");
    if (!Array.isArray(data)) { showToast("Failed to load", "error"); return; }
    allFormulas = data;
    renderTable(data);
    updateStats(data);
}

function updateStats(data) {
    const s = (id, v) => { const el = document.getElementById(id); if(el) el.textContent = v; };
    s("stat-total",   data.length);
    s("stat-cyan",    data.filter(f => f.cyan > 0).length);
    s("stat-magenta", data.filter(f => f.magenta > 0).length);
    s("stat-black",   data.filter(f => f.black > 0).length);
}



function filterFormulas() {
    const q = (document.getElementById("search-input")?.value || "").toLowerCase();
    renderTable(allFormulas.filter(f =>
        f.code.toLowerCase().includes(q) || f.name.toLowerCase().includes(q)
    ));
}

// ── VIEW MODAL ───────────────────────────────────────────────
function viewFormula(id) {
    const f = allFormulas.find(x => x.id === id);
    if (!f) return;
    document.getElementById("modal-title").textContent = f.code + " — " + f.name;
    const rows = COLORS.filter(c => f[c] > 0).map(c => `
        <tr>
            <td style="font-weight:600">${COLOR_LABELS[c]}</td>
            <td style="font-family:var(--mono);color:var(--accent)">${Number(f[c]).toFixed(3)} KG</td>
            <td style="color:var(--text-3)">${((f[c]/f.drum_kg)*100).toFixed(2)}%</td>
        </tr>`).join("");
    const qrId = "qr-" + id, barId = "bar-" + id;
    document.getElementById("modal-body").innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
            <div style="background:var(--bg2);padding:14px;border-radius:10px;border:1px solid var(--border)">
                <div style="font-size:0.72rem;font-weight:700;color:var(--text-3);margin-bottom:4px;text-transform:uppercase">Drum Size</div>
                <div style="font-size:1.6rem;font-weight:800;color:var(--accent)">${Number(f.drum_kg).toFixed(1)} KG</div>
            </div>
            <div style="background:var(--bg2);padding:14px;border-radius:10px;border:1px solid var(--border)">
                <div style="font-size:0.72rem;font-weight:700;color:var(--text-3);margin-bottom:4px;text-transform:uppercase">Date</div>
                <div style="font-size:0.95rem">${new Date(f.created_at).toLocaleDateString()}</div>
            </div>
        </div>
        ${f.notes ? `<div style="padding:12px;background:var(--bg2);border-radius:8px;border:1px solid var(--border);margin-bottom:14px;color:var(--text-2)">${f.notes}</div>` : ""}
        <div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px">
            <table>
                <thead><tr><th>Material</th><th>KG / Drum</th><th>%</th></tr></thead>
                <tbody>${rows || `<tr><td colspan="3" style="text-align:center;color:var(--text-3);padding:20px">No components</td></tr>`}</tbody>
            </table>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
            <div style="text-align:center;background:var(--bg2);padding:14px;border-radius:10px;border:1px solid var(--border)">
                <div style="font-size:0.72rem;font-weight:700;color:var(--text-3);margin-bottom:10px;text-transform:uppercase">QR Code</div>
                <div id="${qrId}" style="display:inline-block;background:white;padding:8px;border-radius:6px"></div>
            </div>
            <div style="text-align:center;background:var(--bg2);padding:14px;border-radius:10px;border:1px solid var(--border)">
                <div style="font-size:0.72rem;font-weight:700;color:var(--text-3);margin-bottom:10px;text-transform:uppercase">Barcode</div>
                <div style="background:white;padding:8px;border-radius:6px;display:inline-block">
                    <svg id="${barId}"></svg>
                </div>
            </div>
        </div>
        <div class="btn-row">
            <button class="btn btn-primary" onclick="exportFormulaPDF(allFormulas.find(x=>x.id===${id}))">🖨 Export PDF</button>
            <button class="btn btn-ghost" onclick="closeModal()">Close</button>
        </div>`;
    document.getElementById("view-modal").classList.add("open");
    setTimeout(() => {
        try { new QRCode(document.getElementById(qrId), { text: JSON.stringify({code:f.code,name:f.name,drum_kg:f.drum_kg}), width:110, height:110, colorDark:"#000000", colorLight:"#ffffff" }); } catch(e) {}
        try { JsBarcode("#"+barId, f.code, { format:"CODE128", width:2, height:55, displayValue:true, fontSize:11, background:"#ffffff", lineColor:"#000000" }); } catch(e) {}
    }, 200);
}

function closeModal() {
    document.getElementById("view-modal").classList.remove("open");
    document.getElementById("modal-body").innerHTML = "";
}

function handleOverlayClick(e) {
    if (e.target === document.getElementById("view-modal")) closeModal();
}

// ── DELETE ───────────────────────────────────────────────────
async function deleteFormula(id, code) {
    if (!confirm(`Delete formula "${code}"?`)) return;
    const result = await dbDelete("formulas", id);
    if (result.ok) { showToast("Deleted", "success"); loadFormulas(); }
    else showToast("Delete failed", "error");
}

// ── INIT ─────────────────────────────────────────────────────
loadFormulas();
// INK LAB ERP — batches.js

let allBatches   = [];
let editReturnId = null;

startClock();

const FORMULA_MATERIALS = [
    ["cyan","Cyan"],["magenta","Magenta"],["yellow","Yellow"],
    ["black","Black"],["white","White"],["reflex_blue","Reflex Blue"],
    ["violet","Violet"],["green","Green"],["silver","Silver"],
    ["gold","Gold"],["varnish","Varnish"],["transparent_base","Transparent Base"],
    ["fluor_pink","Fluor Pink"],["fluor_yellow","Orange"],["rubine_red","Warm Red"]
];

// ── FORM ─────────────────────────────────────────────────────
function toggleForm() {
    const form = document.getElementById("batch-form");
    const btn  = document.getElementById("toggle-btn");
    const open = form.style.display === "none";
    form.style.display = open ? "block" : "none";
    btn.textContent    = open ? "✕ CLOSE" : "+ ADD BATCH";
}

function resetForm() {
    ["b-batch_no","b-notes"].forEach(id => document.getElementById(id).value = "");
    document.getElementById("b-formula_id").value  = "";
    document.getElementById("b-target_kg").value   = "";
    document.getElementById("b-returned_kg").value = "0";
    document.getElementById("b-status").value      = "pending";
}

// ── LOAD FORMULAS SELECT ──────────────────────────────────────
async function loadFormulasSelect() {
    const data = await dbGet("formulas","?select=id,code,name&order=code.asc");
    const sel  = document.getElementById("b-formula_id");
    if (!Array.isArray(data)) return;
    data.forEach(f => {
        const opt = document.createElement("option");
        opt.value        = f.id;
        opt.textContent  = `${f.code} — ${f.name}`;
        opt.dataset.code = f.code;
        sel.appendChild(opt);
    });
}

// ── SAVE BATCH ────────────────────────────────────────────────
async function saveBatch() {
    const batch_no    = document.getElementById("b-batch_no").value.trim().toUpperCase();
    const formula_id  = document.getElementById("b-formula_id").value;
    const target_kg   = parseFloat(document.getElementById("b-target_kg").value);
    const returned_kg = parseFloat(document.getElementById("b-returned_kg").value) || 0;
    const status      = document.getElementById("b-status").value;
    const notes       = document.getElementById("b-notes").value.trim();

    if (!batch_no)              { showToast("Batch No required","warn"); return; }
    if (!target_kg || target_kg <= 0) { showToast("Target KG required","warn"); return; }
    if (returned_kg > target_kg)      { showToast("Returned cannot exceed Target","warn"); return; }

    const sel          = document.getElementById("b-formula_id");
    const formula_code = sel.selectedOptions[0]?.dataset?.code || "";

    const body = { batch_no, target_kg, returned_kg, status, notes,
                   formula_code, qr_code: batch_no, barcode: batch_no };
    if (formula_id) body.formula_id = parseInt(formula_id);

    const result = await dbPost("batches", body);
    if (result.ok) {
        showToast("✓ Batch saved","success");
        resetForm(); toggleForm(); loadBatches();
    } else {
        showToast("Error: " + (result.data?.message || "Unknown"),"error");
    }
}

// ── LOAD BATCHES ──────────────────────────────────────────────
async function loadBatches() {
    const data = await dbGet("batches","?order=created_at.desc");
    if (!Array.isArray(data)) { showToast("Load failed","error"); return; }
    allBatches = data;
    renderBatches(data);
    updateStats(data);
}

function updateStats(data) {
    const s = (id,v) => { const el=document.getElementById(id); if(el) el.textContent=v; };
    s("stat-total",   data.length);
    s("stat-pending", data.filter(b=>b.status==="pending").length);
    s("stat-inprod",  data.filter(b=>b.status==="in_production").length);
    s("stat-done",    data.filter(b=>b.status==="done").length);
}

function filterBatches() {
    const q  = document.getElementById("search-input").value.toLowerCase();
    const st = document.getElementById("filter-status").value;
    renderBatches(allBatches.filter(b => {
        const matchQ  = b.batch_no.toLowerCase().includes(q) || (b.formula_code||"").toLowerCase().includes(q);
        const matchSt = !st || b.status === st;
        return matchQ && matchSt;
    }));
}

// ── RENDER ────────────────────────────────────────────────────
function renderBatches(data) {
    const tbody = document.getElementById("batches-tbody");
    if (!data.length) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="8">No batches yet</td></tr>`;
        return;
    }
    tbody.innerHTML = data.map(b => {
        const net = (Number(b.target_kg) - Number(b.returned_kg)).toFixed(1);
        return `<tr>
            <td class="td-code">${b.batch_no}</td>
            <td>
                <button onclick="showFormulaTracking('${b.formula_code}')"
                    style="background:none;border:none;cursor:pointer;
                    color:var(--accent);font-weight:700;font-family:var(--mono);
                    font-size:0.85rem;padding:0;text-decoration:underline;
                    text-underline-offset:3px">
                    ${b.formula_code || "—"}
                </button>
            </td>
            <td>${Number(b.target_kg).toFixed(1)} KG</td>
            <td style="color:var(--green)">${Number(b.returned_kg).toFixed(1)} KG</td>
            <td style="color:var(--accent)">${net} KG</td>
            <td><span class="badge badge-${b.status}">${b.status.replace("_"," ").toUpperCase()}</span></td>
            <td style="color:var(--text-3)">${new Date(b.created_at).toLocaleDateString()}</td>
            <td class="td-actions">
                <button class="btn btn-ghost" style="font-size:0.75rem;padding:5px 10px"
                    onclick="viewBatch(${b.id})">👁 View</button>
                <button class="btn btn-ghost" style="font-size:0.75rem;padding:5px 10px;
                    color:var(--green);border-color:var(--green)"
                    onclick="openReturnModal(${b.id})">↩ Return</button>
                <button class="btn btn-ghost" style="font-size:0.75rem;padding:5px 10px"
                    onclick="updateStatus(${b.id},'${b.status}')">⚙ Status</button>
                <button class="btn btn-danger" style="font-size:0.75rem;padding:5px 10px"
                    onclick="deleteBatch(${b.id},'${b.batch_no}')">✕</button>
            </td>
        </tr>`;
    }).join("");
}

// ── FORMULA TRACKING ──────────────────────────────────────────
async function showFormulaTracking(code) {
    if (!code || code === "—") return;

    // Get all batches for this formula
    const batches = allBatches.filter(b => b.formula_code === code);

    // Get formula details from Supabase
    const fData = await dbGet("formulas", `?code=eq.${code}&select=*`);
    const formula = Array.isArray(fData) ? fData[0] : null;

    // Calculate stats
    const totalBatches  = batches.length;
    const totalTarget   = batches.reduce((s,b) => s + Number(b.target_kg||0), 0);
    const totalReturned = batches.reduce((s,b) => s + Number(b.returned_kg||0), 0);
    const totalNet      = totalTarget - totalReturned;
    const lastUsed      = batches.length ? new Date(batches[0].created_at).toLocaleDateString() : "—";
    const doneBatches   = batches.filter(b => b.status === "done").length;
    const activeBatches = batches.filter(b => b.status === "in_production").length;

    // Drum tracking
    const drumKg   = formula?.drum_kg || 20;
    const drums    = Math.floor(totalNet / drumKg);
    const drumRem  = (totalNet % drumKg).toFixed(1);

    // Status breakdown
    const statusRows = batches.map(b => {
        const net = (Number(b.target_kg) - Number(b.returned_kg)).toFixed(1);
        return `<tr>
            <td class="td-code" style="font-size:0.8rem">${b.batch_no}</td>
            <td style="font-size:0.85rem">${Number(b.target_kg).toFixed(1)} KG</td>
            <td style="color:var(--green);font-size:0.85rem">${Number(b.returned_kg).toFixed(1)} KG</td>
            <td style="color:var(--accent);font-size:0.85rem">${net} KG</td>
            <td><span class="badge badge-${b.status}" style="font-size:0.7rem">
                ${b.status.replace("_"," ").toUpperCase()}</span></td>
            <td style="color:var(--text-3);font-size:0.8rem">
                ${new Date(b.created_at).toLocaleDateString()}</td>
        </tr>`;
    }).join("");

    // Formula components
    const compRows = formula ? FORMULA_MATERIALS
        .filter(([f]) => formula[f] > 0)
        .map(([f, label]) => {
            const kgPerDrum  = Number(formula[f]);
            const totalUsed  = (kgPerDrum / drumKg) * totalNet;
            return `<tr>
                <td style="font-weight:600;font-size:0.85rem">${label}</td>
                <td style="font-family:var(--mono);color:var(--accent);font-size:0.85rem">
                    ${kgPerDrum.toFixed(3)} KG/drum</td>
                <td style="font-family:var(--mono);color:var(--warn);font-size:0.85rem">
                    ${totalUsed.toFixed(3)} KG total</td>
            </tr>`;
        }).join("") : "";

    document.getElementById("modal-batch-title").textContent = `Formula Tracking — ${code}`;
    document.getElementById("modal-body").innerHTML = `

        <!-- HEADER STATS -->
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px">
            <div style="background:var(--bg2);padding:14px;border-radius:10px;
                border:1px solid var(--border);text-align:center">
                <div style="font-size:0.7rem;font-weight:700;color:var(--text-3);
                    text-transform:uppercase;margin-bottom:4px">Total Batches</div>
                <div style="font-size:1.8rem;font-weight:800;color:var(--accent)">${totalBatches}</div>
                <div style="font-size:0.75rem;color:var(--text-3);margin-top:2px">
                    ${doneBatches} done · ${activeBatches} active</div>
            </div>
            <div style="background:var(--bg2);padding:14px;border-radius:10px;
                border:1px solid var(--border);text-align:center">
                <div style="font-size:0.7rem;font-weight:700;color:var(--text-3);
                    text-transform:uppercase;margin-bottom:4px">Total Produced</div>
                <div style="font-size:1.8rem;font-weight:800;color:var(--accent)">
                    ${totalNet.toFixed(1)}</div>
                <div style="font-size:0.75rem;color:var(--text-3);margin-top:2px">KG net used</div>
            </div>
            <div style="background:var(--bg2);padding:14px;border-radius:10px;
                border:1px solid var(--border);text-align:center">
                <div style="font-size:0.7rem;font-weight:700;color:var(--text-3);
                    text-transform:uppercase;margin-bottom:4px">Last Used</div>
                <div style="font-size:1rem;font-weight:700;color:var(--text);margin-top:6px">
                    ${lastUsed}</div>
            </div>
        </div>

        <!-- DRUM BREAKDOWN -->
        <div style="padding:14px 16px;background:rgba(99,147,255,0.06);border-radius:10px;
            border:1px solid rgba(99,147,255,0.2);margin-bottom:20px;
            display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
            <div>
                <div style="font-size:0.75rem;font-weight:700;color:var(--text-3);
                    text-transform:uppercase;margin-bottom:4px">Drum Breakdown (${drumKg} KG/drum)</div>
                <div style="font-size:1.1rem;font-weight:800;color:var(--accent)">
                    ${drums} full drums
                    ${drumRem > 0 ? `+ ${drumRem} KG remaining` : ""}
                </div>
            </div>
            <div style="display:flex;gap:16px">
                <div style="text-align:center">
                    <div style="font-size:0.7rem;color:var(--text-3)">Target</div>
                    <div style="font-weight:700;color:var(--text)">${totalTarget.toFixed(1)} KG</div>
                </div>
                <div style="text-align:center">
                    <div style="font-size:0.7rem;color:var(--text-3)">Returned</div>
                    <div style="font-weight:700;color:var(--green)">${totalReturned.toFixed(1)} KG</div>
                </div>
                <div style="text-align:center">
                    <div style="font-size:0.7rem;color:var(--text-3)">Net Used</div>
                    <div style="font-weight:700;color:var(--accent)">${totalNet.toFixed(1)} KG</div>
                </div>
            </div>
        </div>

        ${compRows ? `
        <!-- MATERIAL CONSUMPTION -->
        <div style="font-size:0.75rem;font-weight:700;color:var(--text-3);
            text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px">
            Total Material Consumption
        </div>
        <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;margin-bottom:20px">
            <table>
                <thead><tr>
                    <th>Material</th><th>Per Drum</th><th>Total Used</th>
                </tr></thead>
                <tbody>${compRows}</tbody>
            </table>
        </div>` : ""}

        <!-- BATCH HISTORY -->
        <div style="font-size:0.75rem;font-weight:700;color:var(--text-3);
            text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px">
            Batch History
        </div>
        <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;margin-bottom:16px">
            <table>
                <thead><tr>
                    <th>Batch No</th><th>Target</th><th>Returned</th>
                    <th>Net</th><th>Status</th><th>Date</th>
                </tr></thead>
                <tbody>
                    ${statusRows || `<tr><td colspan="6" style="text-align:center;
                        color:var(--text-3);padding:20px">No batches</td></tr>`}
                </tbody>
            </table>
        </div>

        <div class="btn-row">
            <button class="btn btn-ghost" onclick="closeModal()">Close</button>
        </div>`;

    document.getElementById("view-modal").classList.add("open");
}

// ── VIEW BATCH MODAL ──────────────────────────────────────────
function viewBatch(id) {
    const b = allBatches.find(x => x.id === id);
    if (!b) return;

    document.getElementById("modal-batch-title").textContent = `Batch — ${b.batch_no}`;

    const net  = (Number(b.target_kg) - Number(b.returned_kg)).toFixed(1);
    const yld  = b.target_kg > 0
        ? ((Number(b.returned_kg) / Number(b.target_kg)) * 100).toFixed(1)
        : 0;
    const qrId = "qr-b-" + b.id;
    const brId = "br-b-" + b.id;

    document.getElementById("modal-body").innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px">
            <div style="background:var(--bg2);padding:12px;border-radius:10px;
                border:1px solid var(--border);text-align:center">
                <div style="font-size:0.7rem;font-weight:700;color:var(--text-3);
                    text-transform:uppercase;margin-bottom:4px">Target</div>
                <div style="font-size:1.4rem;font-weight:800;color:var(--accent)">
                    ${Number(b.target_kg).toFixed(1)} KG</div>
            </div>
            <div style="background:var(--bg2);padding:12px;border-radius:10px;
                border:1px solid var(--border);text-align:center">
                <div style="font-size:0.7rem;font-weight:700;color:var(--text-3);
                    text-transform:uppercase;margin-bottom:4px">Returned</div>
                <div style="font-size:1.4rem;font-weight:800;color:var(--green)">
                    ${Number(b.returned_kg).toFixed(1)} KG</div>
            </div>
            <div style="background:var(--bg2);padding:12px;border-radius:10px;
                border:1px solid var(--border);text-align:center">
                <div style="font-size:0.7rem;font-weight:700;color:var(--text-3);
                    text-transform:uppercase;margin-bottom:4px">Net Used</div>
                <div style="font-size:1.4rem;font-weight:800;color:var(--warn)">
                    ${net} KG</div>
            </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px">
            <div style="background:var(--bg2);padding:12px;border-radius:8px;
                border:1px solid var(--border)">
                <div style="font-size:0.7rem;color:var(--text-3);margin-bottom:3px">Formula</div>
                <div style="font-weight:700;color:var(--accent)">
                    <button onclick="showFormulaTracking('${b.formula_code}')"
                        style="background:none;border:none;cursor:pointer;
                        color:var(--accent);font-weight:700;padding:0;
                        text-decoration:underline;text-underline-offset:3px">
                        ${b.formula_code || "—"}
                    </button>
                </div>
            </div>
            <div style="background:var(--bg2);padding:12px;border-radius:8px;
                border:1px solid var(--border)">
                <div style="font-size:0.7rem;color:var(--text-3);margin-bottom:3px">Status</div>
                <span class="badge badge-${b.status}">${b.status.replace("_"," ").toUpperCase()}</span>
            </div>
            <div style="background:var(--bg2);padding:12px;border-radius:8px;
                border:1px solid var(--border)">
                <div style="font-size:0.7rem;color:var(--text-3);margin-bottom:3px">Yield</div>
                <div style="font-weight:700;color:var(--text)">${yld}%</div>
            </div>
        </div>

        ${b.notes ? `<div style="padding:12px;background:var(--bg2);border-radius:8px;
            border:1px solid var(--border);margin-bottom:14px;
            color:var(--text-2);font-size:0.9rem">${b.notes}</div>` : ""}

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
            <div style="text-align:center;background:var(--bg2);padding:14px;
                border-radius:10px;border:1px solid var(--border)">
                <div style="font-size:0.72rem;font-weight:700;color:var(--text-3);
                    margin-bottom:10px;text-transform:uppercase">QR Code</div>
                <div id="${qrId}" style="display:inline-block;background:white;
                    padding:8px;border-radius:6px"></div>
            </div>
            <div style="text-align:center;background:var(--bg2);padding:14px;
                border-radius:10px;border:1px solid var(--border)">
                <div style="font-size:0.72rem;font-weight:700;color:var(--text-3);
                    margin-bottom:10px;text-transform:uppercase">Barcode</div>
                <div style="background:white;padding:8px;border-radius:6px;display:inline-block">
                    <svg id="${brId}"></svg>
                </div>
            </div>
        </div>

        <div class="btn-row">
            <button class="btn btn-primary"
                onclick="exportBatchPDF(allBatches.find(x=>x.id===${b.id}))">🖨 PDF</button>
            <button class="btn btn-ghost"
                onclick="openReturnModal(${b.id});closeModal()">↩ Update Return</button>
            <button class="btn btn-ghost" onclick="closeModal()">Close</button>
        </div>`;

    document.getElementById("view-modal").classList.add("open");

    setTimeout(() => {
        try { new QRCode(document.getElementById(qrId), {
            text: JSON.stringify({batch_no:b.batch_no,formula:b.formula_code,target_kg:b.target_kg}),
            width:110, height:110, colorDark:"#000000", colorLight:"#ffffff"
        }); } catch(e) {}
        try { JsBarcode("#"+brId, b.batch_no, {
            format:"CODE128", width:2, height:55,
            displayValue:true, fontSize:11, background:"#ffffff", lineColor:"#000000"
        }); } catch(e) {}
    }, 200);
}

// ── EXPORT BATCH PDF ──────────────────────────────────────────
function exportBatchPDF(b) {
    if (!b) return alert("Batch not found");

    if (!window.jspdf || !window.jspdf.jsPDF) {
        showToast("PDF library not loaded — check that jspdf script tag is in batches.html <head>", "error");
        console.error("window.jspdf is undefined. Make sure this script tag is present in batches.html <head>:\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js\"></script>");
        return;
    }
    if (typeof QRCode === "undefined") {
        showToast("QRCode library not loaded — check batches.html <head>", "error");
        return;
    }
    if (typeof JsBarcode === "undefined") {
        showToast("JsBarcode library not loaded — check batches.html <head>", "error");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const pageW = doc.internal.pageSize.getWidth();
    const marginX = 16;
    const contentW = pageW - marginX * 2;

    function hr(y, color) {
        doc.setDrawColor(...(color || [225, 228, 232]));
        doc.setLineWidth(0.4);
        doc.line(marginX, y, pageW - marginX, y);
    }

    // ════════════════════════════════════════════
    // HEADER BAND with 3P logo
    // ════════════════════════════════════════════
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageW, 28, "F");

    // "3P" logo — 3 in red, P in green, tight kerning, baseline-aligned
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(226, 75, 74);   // red
    doc.text("3", marginX, 16);
    const threeWidth = doc.getTextWidth("3");
    doc.setTextColor(99, 153, 34);   // green
    doc.text("P", marginX + threeWidth - 0.5, 16);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text("INK LAB ERP \u2014 BATCH RECORD", marginX, 22.5);

    const now = new Date();
    const dateStr = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated ${dateStr}`, pageW - marginX, 13, { align: "right" });
    doc.setTextColor(96, 165, 250); // blue-400
    doc.setFont("helvetica", "bold");
    doc.text(String(b.batch_no || "-"), pageW - marginX, 19.5, { align: "right" });

    // ════════════════════════════════════════════
    // TITLE
    // ════════════════════════════════════════════
    let y = 40;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.text(`Batch ${b.batch_no || "-"}`, marginX, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Formula: ${b.formula_code || "-"}`, marginX, y + 6);

    y += 16;

    // ════════════════════════════════════════════
    // KEY METRIC CARDS — target / returned / net
    // ════════════════════════════════════════════
    const target = Number(b.target_kg) || 0;
    const returned = Number(b.returned_kg) || 0;
    const net = target - returned;
    const yieldPct = target > 0 ? (returned / target * 100) : 0;

    const cardW = (contentW - 8) / 3;
    const cardH = 20;
    const cards = [
        ["TARGET", `${target.toFixed(1)} KG`, [37, 99, 235]],
        ["RETURNED", `${returned.toFixed(1)} KG`, [22, 163, 74]],
        ["NET USED", `${net.toFixed(1)} KG`, [217, 119, 6]]
    ];

    cards.forEach((card, i) => {
        const cx = marginX + i * (cardW + 4);
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.roundedRect(cx, y, cardW, cardH, 2, 2, "FD");

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text(card[0], cx + 4, y + 6.5);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(...card[2]);
        doc.text(card[1], cx + 4, y + 15);
    });

    y += cardH + 12;

    // ════════════════════════════════════════════
    // BATCH DETAILS TABLE
    // ════════════════════════════════════════════
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("BATCH DETAILS", marginX, y);
    y += 5;
    hr(y, [203, 213, 225]);
    y += 8;

    const statusLabel = String(b.status || "-").replace(/_/g, " ").toUpperCase();
    const details = [
        ["Status", statusLabel],
        ["Yield", `${yieldPct.toFixed(1)}%`],
        ["Created", b.created_at ? new Date(b.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-"],
        ["Updated", b.updated_at ? new Date(b.updated_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-"]
    ];

    details.forEach(([label, value], i) => {
        if (i % 2 === 0) {
            doc.setFillColor(250, 250, 251);
            doc.rect(marginX, y - 4, contentW, 7.2, "F");
        }
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(label, marginX + 4, y + 1);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59);
        doc.text(String(value), marginX + 60, y + 1);

        y += 7.2;
    });

    y += 4;
    hr(y, [203, 213, 225]);
    y += 10;

    // ════════════════════════════════════════════
    // NOTES (optional)
    // ════════════════════════════════════════════
    if (b.notes) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.text("NOTES", marginX, y);
        y += 5;
        hr(y, [203, 213, 225]);
        y += 6;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        const noteLines = doc.splitTextToSize(String(b.notes), contentW);
        doc.text(noteLines, marginX, y);
        y += noteLines.length * 4.5 + 6;
    }

    // ════════════════════════════════════════════
    // CODES SECTION — barcode + QR, pinned near bottom
    // ════════════════════════════════════════════
    const codesY = Math.max(y + 4, 235);

    hr(codesY, [203, 213, 225]);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("TRACEABILITY", marginX, codesY + 8);

    const barcodeCanvas = document.createElement("canvas");
    JsBarcode(barcodeCanvas, b.batch_no || "NOBATCH", {
        format: "CODE128",
        displayValue: true,
        width: 2,
        height: 50,
        margin: 4
    });
    const barcodeImg = barcodeCanvas.toDataURL("image/png");
    doc.addImage(barcodeImg, "PNG", marginX, codesY + 13, 70, 18);

    const qrDiv = document.createElement("div");
    new QRCode(qrDiv, {
        text: JSON.stringify({ batch_no: b.batch_no, formula: b.formula_code, target_kg: b.target_kg }),
        width: 160,
        height: 160
    });

    setTimeout(() => {
        const qrImg = qrDiv.querySelector("img")?.src;
        if (qrImg) {
            doc.addImage(qrImg, "PNG", pageW - marginX - 24, codesY + 6, 24, 24);
        }

        // ── Footer ──
        const footerY = 285;
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.line(marginX, footerY - 6, pageW - marginX, footerY - 6);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.text("3P Ink Lab ERP \u2014 Quality First", marginX, footerY);

        doc.setTextColor(100, 116, 139);
        doc.text("Approved by: ______________________", pageW - marginX, footerY, { align: "right" });

        doc.save(`${b.batch_no || "batch"}.pdf`);
    }, 300);
}

function closeModal() {
    document.getElementById("view-modal").classList.remove("open");
    document.getElementById("modal-body").innerHTML = "";
}

// ── RETURN MODAL ──────────────────────────────────────────────
function openReturnModal(id) {
    const b = allBatches.find(x => x.id === id);
    if (!b) return;
    editReturnId = id;
    document.getElementById("ret-batch-no").value = b.batch_no;
    document.getElementById("ret-kg").value        = b.returned_kg || 0;
    document.getElementById("return-modal").classList.add("open");
}

function closeReturnModal() {
    document.getElementById("return-modal").classList.remove("open");
    editReturnId = null;
}

async function saveReturned() {
    const kg = parseFloat(document.getElementById("ret-kg").value);

    if (isNaN(kg) || kg < 0) {
        showToast("Invalid value","warn");
        return;
    }

    const result = await dbPatch("batches", editReturnId, { returned_kg: kg });

    if (result.ok) {
        showToast("✓ Returned KG updated","success");

        try {
            localStorage.setItem("inklab_stock_updated", Date.now());
        } catch(e){}

        // 🔥 هنا التحديث الصح
        window.dispatchEvent(new Event("batch-updated"));

        closeReturnModal();
        loadBatches();
    } else {
        showToast("Update failed","error");
    }
}

// ── STATUS ────────────────────────────────────────────────────
async function updateStatus(id, current) {
    const list = ["pending","in_production","done","cancelled"];
    const next = list[(list.indexOf(current) + 1) % list.length];
    if (!confirm(`Change status to "${next.replace("_"," ").toUpperCase()}"?`)) return;
    const result = await dbPatch("batches", id, { status: next });
    if (result.ok) { showToast("✓ Status updated","success"); loadBatches(); }
    else showToast("Update failed","error");
}

// ── DELETE ────────────────────────────────────────────────────
async function deleteBatch(id, batch_no) {
    if (!confirm(`Delete batch "${batch_no}"?`)) return;
    const result = await dbDelete("batches", id);
    if (result.ok) { showToast("Deleted","success"); loadBatches(); }
    else showToast("Delete failed","error");
}

// ── FILTER ────────────────────────────────────────────────────

// ── INIT ──────────────────────────────────────────────────────
loadFormulasSelect();
loadBatches().then(() => {
    // Auto-filter if coming from formulas page
    const params  = new URLSearchParams(window.location.search);
    const formula = params.get("formula");
    if (formula) {
        const input = document.getElementById("search-input");
        if (input) {
            input.value = formula;
            filterBatches();
            // Show tracking modal automatically
            setTimeout(() => showFormulaTracking(formula), 500);
        }
    }
});
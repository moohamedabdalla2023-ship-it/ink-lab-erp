let allDrums = [];

startClock();

// ===== TOGGLE FORM =====
function toggleForm() {
    const form = document.getElementById("drum-form");
    const btn  = document.getElementById("toggle-btn");
    const open = form.style.display === "none";
    form.style.display = open ? "block" : "none";
    btn.textContent = open ? "✕ CLOSE" : "+ ADD DRUM";
}

function resetForm() {
    document.getElementById("d-drum_no").value  = "";
    document.getElementById("d-formula_id").value = "";
    document.getElementById("d-batch_id").value   = "";
    document.getElementById("d-fill_kg").value    = "";
    document.getElementById("d-status").value     = "active";
}

// ===== LOAD SELECTS =====
async function loadSelects() {
    const formulas = await dbGet("formulas", "?select=id,code,name&order=code.asc");
    const batches  = await dbGet("batches",  "?select=id,batch_no&order=created_at.desc");

    const fSel = document.getElementById("d-formula_id");
    if (Array.isArray(formulas)) {
        formulas.forEach(f => {
            const opt = document.createElement("option");
            opt.value = f.id;
            opt.textContent = `${f.code} — ${f.name}`;
            opt.dataset.code = f.code;
            fSel.appendChild(opt);
        });
    }

    const bSel = document.getElementById("d-batch_id");
    if (Array.isArray(batches)) {
        batches.forEach(b => {
            const opt = document.createElement("option");
            opt.value = b.id;
            opt.textContent = b.batch_no;
            bSel.appendChild(opt);
        });
    }
}

// ===== SAVE DRUM =====
async function saveDrum() {
    const drum_no  = document.getElementById("d-drum_no").value.trim().toUpperCase();
    const formula_id = document.getElementById("d-formula_id").value;
    const batch_id   = document.getElementById("d-batch_id").value;
    const fill_kg    = parseFloat(document.getElementById("d-fill_kg").value) || 0;
    const status     = document.getElementById("d-status").value;

    if (!drum_no) { showToast("⚠ DRUM NO REQUIRED", "warn"); return; }

    const body = { drum_no, fill_kg, status };
    if (formula_id) body.formula_id = parseInt(formula_id);
    if (batch_id)   body.batch_id   = parseInt(batch_id);

    const result = await dbPost("drums", body);
    if (result.ok) {
        showToast("✓ DRUM SAVED", "success");
        resetForm();
        toggleForm();
        loadDrums();
    } else {
        showToast("✗ ERROR: " + (result.data?.message || "Unknown"), "error");
    }
}

// ===== LOAD DRUMS =====
async function loadDrums() {
    const data = await dbGet("drums", "?order=created_at.desc");
    if (!Array.isArray(data)) { showToast("✗ FAILED TO LOAD", "error"); return; }

    // Enrich with formula/batch names
    const formulas = await dbGet("formulas", "?select=id,code");
    const batches  = await dbGet("batches",  "?select=id,batch_no");

    const fMap = {};
    const bMap = {};
    if (Array.isArray(formulas)) formulas.forEach(f => fMap[f.id] = f.code);
    if (Array.isArray(batches))  batches.forEach(b  => bMap[b.id] = b.batch_no);

    allDrums = data.map(d => ({
        ...d,
        formula_code: fMap[d.formula_id] || "—",
        batch_no:     bMap[d.batch_id]   || "—"
    }));

    renderDrums(allDrums);
    updateStats(allDrums);
}

function updateStats(data) {
    document.getElementById("stat-total").textContent   = data.length;
    document.getElementById("stat-active").textContent  = data.filter(d => d.status === "active").length;
    document.getElementById("stat-empty").textContent   = data.filter(d => d.status === "empty").length;
    document.getElementById("stat-retired").textContent = data.filter(d => d.status === "retired").length;
}

function renderDrums(data) {
    const tbody = document.getElementById("drums-tbody");
    if (!data.length) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="7">NO DRUMS YET</td></tr>`;
        return;
    }

    const statusColor = { active: "done", empty: "pending", retired: "cancelled" };

    tbody.innerHTML = data.map(d => `
        <tr>
            <td class="td-code">${d.drum_no}</td>
            <td>${d.formula_code}</td>
            <td>${d.batch_no}</td>
            <td>${Number(d.fill_kg).toFixed(1)} KG</td>
            <td><span class="badge badge-${statusColor[d.status]}">${d.status.toUpperCase()}</span></td>
            <td>${new Date(d.created_at).toLocaleDateString()}</td>
            <td class="td-actions">
                <button class="btn btn-ghost" style="font-size:0.6rem;padding:5px 10px" onclick="viewDrum(${d.id})">👁 VIEW</button>
                <button class="btn btn-ghost" style="font-size:0.6rem;padding:5px 10px" onclick="cycleStatus(${d.id},'${d.status}')">⚙ STATUS</button>
                <button class="btn btn-danger" style="font-size:0.6rem;padding:5px 10px" onclick="deleteDrum(${d.id},'${d.drum_no}')">✕</button>
            </td>
        </tr>
    `).join("");
}

// ===== FILTER =====
function filterDrums() {
    const q  = document.getElementById("search-input").value.toLowerCase();
    const st = document.getElementById("filter-status").value;
    const filtered = allDrums.filter(d => {
        const matchQ  = d.drum_no.toLowerCase().includes(q) || d.formula_code.toLowerCase().includes(q);
        const matchSt = !st || d.status === st;
        return matchQ && matchSt;
    });
    renderDrums(filtered);
}

// ===== VIEW MODAL =====
function viewDrum(id) {
    const d = allDrums.find(x => x.id === id);
    if (!d) return;

    document.getElementById("modal-drum-title").textContent = `DRUM — ${d.drum_no}`;

    const qrId = "qr-d-" + d.id;
    const brId = "br-d-" + d.id;
    const statusColor = { active: "done", empty: "pending", retired: "cancelled" };

    document.getElementById("modal-body").innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:20px;padding:16px;background:var(--surface2);border-radius:2px">
            <div>
                <div style="font-size:0.6rem;letter-spacing:3px;color:var(--text-dim);margin-bottom:6px">FORMULA</div>
                <div style="color:var(--accent);font-size:1rem">${d.formula_code}</div>
            </div>
            <div>
                <div style="font-size:0.6rem;letter-spacing:3px;color:var(--text-dim);margin-bottom:6px">BATCH</div>
                <div style="font-size:1rem">${d.batch_no}</div>
            </div>
            <div>
                <div style="font-size:0.6rem;letter-spacing:3px;color:var(--text-dim);margin-bottom:6px">FILL KG</div>
                <div style="font-family:var(--font-display);font-size:1.2rem;color:var(--accent)">${Number(d.fill_kg).toFixed(1)} KG</div>
            </div>
        </div>

        <div style="margin-bottom:20px">
            <div style="font-size:0.6rem;letter-spacing:3px;color:var(--text-dim);margin-bottom:8px">STATUS</div>
            <span class="badge badge-${statusColor[d.status]}">${d.status.toUpperCase()}</span>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:16px">
            <div style="text-align:center">
                <div style="font-size:0.6rem;letter-spacing:3px;color:var(--text-dim);margin-bottom:12px">QR CODE</div>
                <div id="${qrId}" style="display:inline-block;background:white;padding:10px;border-radius:2px"></div>
            </div>
            <div style="text-align:center">
                <div style="font-size:0.6rem;letter-spacing:3px;color:var(--text-dim);margin-bottom:12px">BARCODE</div>
                <div style="background:white;padding:10px;border-radius:2px;display:inline-block">
                    <svg id="${brId}"></svg>
                </div>
            </div>
        </div>

        <div class="btn-row" style="margin-top:20px">
            <button class="btn btn-ghost" onclick="cycleStatus(${d.id},'${d.status}');closeModal()">⚙ CHANGE STATUS</button>
            <button class="btn btn-ghost" onclick="closeModal()">CLOSE</button>
        </div>
    `;

    document.getElementById("view-modal").classList.add("open");

    setTimeout(() => {
        new QRCode(document.getElementById(qrId), {
            text: JSON.stringify({ drum_no: d.drum_no, formula: d.formula_code, batch: d.batch_no, fill_kg: d.fill_kg }),
            width: 120, height: 120, colorDark: "#000", colorLight: "#fff"
        });
        JsBarcode("#" + brId, d.drum_no, {
            format: "CODE128", width: 2, height: 60,
            displayValue: true, fontSize: 12, background: "#ffffff", lineColor: "#000000"
        });
    }, 100);
}

function closeModal() {
    document.getElementById("view-modal").classList.remove("open");
}

// ===== CYCLE STATUS =====
async function cycleStatus(id, current) {
    const statuses = ["active", "empty", "retired"];
    const next = statuses[(statuses.indexOf(current) + 1) % statuses.length];
    if (!confirm(`Change status to "${next.toUpperCase()}"?`)) return;
    const result = await dbPatch("drums", id, { status: next });
    if (result.ok) {
        showToast("✓ STATUS UPDATED", "success");
        loadDrums();
    } else {
        showToast("✗ UPDATE FAILED", "error");
    }
}

// ===== DELETE =====
async function deleteDrum(id, drum_no) {
    if (!confirm(`DELETE drum "${drum_no}"?`)) return;
    const result = await dbDelete("drums", id);
    if (result.ok) {
        showToast("✓ DRUM DELETED", "success");
        loadDrums();
    } else {
        showToast("✗ DELETE FAILED", "error");
    }
}

// ===== INIT =====
loadSelects();
loadDrums();
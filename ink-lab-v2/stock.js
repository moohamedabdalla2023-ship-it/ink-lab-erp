let allStock = [];
let editId = null;

startClock();

// ===== TOGGLE FORMS =====
function toggleForm() {
    const form = document.getElementById("stock-form");
    const btn  = document.getElementById("toggle-btn");
    const open = form.style.display === "none";
    form.style.display = open ? "block" : "none";
    btn.textContent = open ? "✕ CLOSE" : "+ ADD STOCK";
}

function toggleDeduct() {
    const form = document.getElementById("deduct-form");
    const btn  = document.getElementById("toggle-deduct-btn");
    const open = form.style.display === "none";
    form.style.display = open ? "block" : "none";
    btn.textContent = open ? "✕ CLOSE" : "- DEDUCT";
}

function resetForm() {
    document.getElementById("s-material").value   = "";
    document.getElementById("s-add_kg").value     = "";
    document.getElementById("s-threshold").value  = "";
    document.getElementById("s-batch_code").value = "";
    document.getElementById("s-expiry").value     = "";
}

// ===== SAVE STOCK (add KG to existing material) =====
async function saveStock() {
    const material   = document.getElementById("s-material").value;
    const add_kg     = parseFloat(document.getElementById("s-add_kg").value);
    const threshold  = parseFloat(document.getElementById("s-threshold").value);
    const batch_code = document.getElementById("s-batch_code").value.trim();
    const expiry     = document.getElementById("s-expiry").value;

    if (!material)           { showToast("⚠ SELECT MATERIAL", "warn"); return; }
    if (!add_kg || add_kg <= 0) { showToast("⚠ ENTER VALID KG", "warn"); return; }

    // Find existing
    const existing = allStock.find(s => s.material === material);

    if (existing) {
        const newTotal = Number(existing.total_kg) + add_kg;
        const patch = { total_kg: newTotal };
        if (!isNaN(threshold)) patch.min_threshold = threshold;
        if (batch_code) patch.batch_code = batch_code;
        if (expiry)     patch.expiry_date = expiry;

        const result = await dbPatch("stock", existing.id, patch);
        if (result.ok) {
            showToast(`✓ ADDED ${add_kg} KG TO ${material}`, "success");
            resetForm();
            loadStock();
        } else {
            showToast("✗ UPDATE FAILED", "error");
        }
    } else {
        // New material
        const body = {
            material, total_kg: add_kg, used_kg: 0,
            min_threshold: !isNaN(threshold) ? threshold : 5,
        };
        if (batch_code) body.batch_code = batch_code;
        if (expiry)     body.expiry_date = expiry;

        const result = await dbPost("stock", body);
        if (result.ok) {
            showToast(`✓ ${material} ADDED TO STOCK`, "success");
            resetForm();
            loadStock();
        } else {
            showToast("✗ ERROR: " + (result.data?.message || "Unknown"), "error");
        }
    }
}

// ===== DEDUCT STOCK =====
async function deductStock() {
    const material = document.getElementById("d-material").value;
    const kg       = parseFloat(document.getElementById("d-kg").value);

    if (!material)        { showToast("⚠ SELECT MATERIAL", "warn"); return; }
    if (!kg || kg <= 0)   { showToast("⚠ ENTER VALID KG", "warn"); return; }

    const existing = allStock.find(s => s.material === material);
    if (!existing) { showToast("⚠ MATERIAL NOT FOUND", "warn"); return; }

    const available = Number(existing.total_kg) - Number(existing.used_kg);
    if (kg > available) {
        showToast(`⚠ ONLY ${available.toFixed(1)} KG AVAILABLE`, "warn");
        return;
    }

    const newUsed = Number(existing.used_kg) + kg;
    const result  = await dbPatch("stock", existing.id, { used_kg: newUsed });

    if (result.ok) {
        showToast(`✓ DEDUCTED ${kg} KG FROM ${material}`, "success");
        document.getElementById("d-kg").value = "";
        loadStock();
    } else {
        showToast("✗ DEDUCT FAILED", "error");
    }
}

// ===== LOAD STOCK =====
async function loadStock() {
    const data = await dbGet("stock", "?order=material.asc");
    if (!Array.isArray(data)) { showToast("✗ FAILED TO LOAD", "error"); return; }
    allStock = data;
    renderStock(data);
    updateStats(data);
    populateDeductSelect(data);
}

function updateStats(data) {
    let totalAvail = 0, ok = 0, low = 0, empty = 0;
    data.forEach(s => {
        const avail = Number(s.total_kg) - Number(s.used_kg);
        totalAvail += avail;
        if (avail <= 0) empty++;
        else if (avail <= Number(s.min_threshold)) low++;
        else ok++;
    });
    document.getElementById("stat-total").textContent = totalAvail.toFixed(1) + " KG";
    document.getElementById("stat-ok").textContent    = ok;
    document.getElementById("stat-low").textContent   = low;
    document.getElementById("stat-empty").textContent = empty;
}

function renderStock(data) {
    const tbody = document.getElementById("stock-tbody");
    if (!data.length) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="8">NO STOCK DATA</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map(s => {
        const avail = Number(s.total_kg) - Number(s.used_kg);
        const pct   = Number(s.total_kg) > 0 ? (avail / Number(s.total_kg)) * 100 : 0;

        let statusBadge, statusColor;
        if (avail <= 0) {
            statusBadge = "EMPTY";
            statusColor = "cancelled";
            } else if (avail <= Number(s.min_threshold)) {
            statusBadge = "LOW";
            statusColor = "pending";
        } else {
            statusBadge = "OK";
            statusColor = "done";
        }

        const expiry = s.expiry_date
            ? `<span style="color:${new Date(s.expiry_date) < new Date() ? 'var(--danger)' : 'var(--text-dim)'}">${s.expiry_date}</span>`
            : "—";

        return `<tr>
            <td class="td-code">${s.material}</td>
            <td>${Number(s.total_kg).toFixed(1)} KG</td>
            <td style="color:var(--warn)">${Number(s.used_kg).toFixed(1)} KG</td>
            <td>
                <div style="display:flex;align-items:center;gap:10px">
                    <span style="color:var(--accent);font-weight:600">${avail.toFixed(1)} KG</span>
                    <div style="flex:1;min-width:60px;height:3px;background:var(--surface2);border-radius:2px">
                        <div style="width:${Math.min(pct,100)}%;height:100%;background:${pct>50?'var(--green)':pct>20?'var(--warn)':'var(--danger)'};border-radius:2px;transition:width 0.8s"></div>
                    </div>
                </div>
            </td>
            <td>${Number(s.min_threshold).toFixed(1)} KG</td>
            <td>${expiry}</td>
            <td><span class="badge badge-${statusColor}">${statusBadge}</span></td>
            <td class="td-actions">
                <button class="btn btn-ghost" style="font-size:0.6rem;padding:5px 10px" onclick="openEditModal(${s.id})">⚙ THRESHOLD</button>
                <button class="btn btn-danger" style="font-size:0.6rem;padding:5px 10px" onclick="resetMaterial(${s.id},'${s.material}')">↺ RESET</button>
            </td>
        </tr>`;
    }).join("");
}

function populateDeductSelect(data) {
    const sel = document.getElementById("d-material");
    sel.innerHTML = `<option value="">— SELECT MATERIAL —</option>`;
    data.forEach(s => {
        const avail = Number(s.total_kg) - Number(s.used_kg);
        if (avail > 0) {
            const opt = document.createElement("option");
            opt.value       = s.material;
            opt.textContent = `${s.material} (${avail.toFixed(1)} KG available)`;
            sel.appendChild(opt);
        }
    });
}

// ===== EDIT THRESHOLD MODAL =====
function openEditModal(id) {
    const s = allStock.find(x => x.id === id);
    if (!s) return;
    editId = id;
    document.getElementById("edit-material").value  = s.material;
    document.getElementById("edit-threshold").value = s.min_threshold;
    document.getElementById("edit-modal").classList.add("open");
}

function closeEditModal() {
    document.getElementById("edit-modal").classList.remove("open");
    editId = null;
}

async function saveThreshold() {
    const threshold = parseFloat(document.getElementById("edit-threshold").value);
    if (isNaN(threshold) || threshold < 0) { showToast("⚠ INVALID VALUE", "warn"); return; }

    const result = await dbPatch("stock", editId, { min_threshold: threshold });
    if (result.ok) {
        showToast("✓ THRESHOLD UPDATED", "success");
        closeEditModal();
        loadStock();
    } else {
        showToast("✗ UPDATE FAILED", "error");
    }
}

// ===== RESET MATERIAL =====
async function resetMaterial(id, material) {
    if (!confirm(`RESET "${material}" stock to 0?\nThis will clear total & used KG.`)) return;
    const result = await dbPatch("stock", id, { total_kg: 0, used_kg: 0 });
    if (result.ok) {
        showToast(`✓ ${material} RESET TO 0`, "success");
        loadStock();
    } else {
        showToast("✗ RESET FAILED", "error");
    }
}

// ===== INIT =====
loadStock();
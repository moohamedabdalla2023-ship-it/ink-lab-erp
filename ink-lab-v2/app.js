const SUPABASE_URL = "https://irpyrvykhltuqmbzskfw.supabase.co";
const SUPABASE_KEY = "sb_secret_3xAjBuT4C2TJYTZS9l9ohQ_ZyDsNRvy";

// =========================
// LOAD FORMULAS
// =========================
async function loadFormulas() {

    const res = await fetch(
        `${SUPABASE_URL}/rest/v1/formulas`,
        {
            headers: {
                apikey: SUPABASE_KEY,
                Authorization: "Bearer " + SUPABASE_KEY
            }
        }
    );

    const data = await res.json();

    document.getElementById("formulas").innerText = data.length;
}

// =========================
// LOAD STOCK
// =========================
async function loadStock() {

    const res = await fetch(
        `${SUPABASE_URL}/rest/v1/stock`,
        {
            headers: {
                apikey: SUPABASE_KEY,
                Authorization: "Bearer " + SUPABASE_KEY
            }
        }
    );

    const data = await res.json();

    let total = 0;

    data.forEach(item => {
        total += Number(item.total_kg || 0);
    });

    document.getElementById("stock").innerText = total + " KG";
}

// =========================
// LOAD BATCHES
// =========================
async function loadBatches() {

    const res = await fetch(
        `${SUPABASE_URL}/rest/v1/batches`,
        {
            headers: {
                apikey: SUPABASE_KEY,
                Authorization: "Bearer " + SUPABASE_KEY
            }
        }
    );

    const data = await res.json();

    document.getElementById("batches").innerText = data.length;
}

// =========================
// ADD STOCK
// =========================
async function addStock() {

    const batch = document.getElementById("batch").value;
    const kg = document.getElementById("kg").value;

    const res = await fetch(
        `${SUPABASE_URL}/rest/v1/stock`,
        {
            method: "POST",

            headers: {
                apikey: SUPABASE_KEY,
                Authorization: "Bearer " + SUPABASE_KEY,
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            },

            body: JSON.stringify({
                batch_code: batch,
                total_kg: Number(kg),
                used_kg: 0
            })
        }
    );

    if (res.ok) {

        alert("Stock Added 🚀");

        loadStock();

    } else {

        alert("Error Adding Stock");

        console.log(await res.text());
    }
}

// =========================
// INIT
// =========================
function initERP() {

    loadFormulas();

    loadStock();

    loadBatches();
}

initERP();
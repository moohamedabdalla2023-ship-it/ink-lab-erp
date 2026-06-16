let data = [];

function showPage(page) {

    document.querySelectorAll(".page").forEach(p => {
        p.style.display = "none";
    });

    document.getElementById(page).style.display = "block";
}

function add() {

    const date = document.getElementById("date").value;
    const order_no = document.getElementById("order_no").value;
    const supplier = document.getElementById("supplier").value;
    const color = document.getElementById("color").value;
    const qty = +document.getElementById("qty").value;
    const price = +document.getElementById("price").value;

    if (!date || !qty || !price) {
        alert("Fill required fields");
        return;
    }

    data.push({
    date,
    order_no,
    supplier,
    type,
    color,
    qty,
    price,
    cost: qty * price
});
    };

    render();
    clearInputs();


function render() {

    const filterType = document.getElementById("filterType")?.value;
    const filterMonth = document.getElementById("filterMonth")?.value;

    let filtered = data;

    // Filter by Type
    if (filterType) {
        filtered = filtered.filter(d => d.type === filterType);
    }

    // Filter by Month (YYYY-MM)
    if (filterMonth) {
        filtered = filtered.filter(d => d.date.startsWith(filterMonth));
    }

    let html = "";

    let totalCost = 0;
    let totalQty = 0;

    // Monthly grouping
    let monthly = {};

    filtered.forEach(d => {

        totalCost += d.cost;
        totalQty += d.qty;

        // group by month
        let month = d.date.slice(0,7);

        if (!monthly[month]) {
            monthly[month] = {
                cost: 0,
                qty: 0,
                count: 0
            };
        }

        monthly[month].cost += d.cost;
        monthly[month].qty += d.qty;
        monthly[month].count += 1;

        html += `
        <tr>
            <td>${d.date}</td>
            <td>${d.order_no || "-"}</td>
            <td>${d.supplier || "-"}</td>
            <td>${d.type}</td>
            <td>${d.material}</td>
            <td>${d.qty}</td>
            <td>${d.price}</td>
            <td>${d.cost.toFixed(2)}</td>
        </tr>
        `;
    });

    document.getElementById("table").innerHTML = html;

    // MAIN SUMMARY
    document.getElementById("totalCost").innerText = totalCost.toFixed(2);
    document.getElementById("totalQty").innerText = totalQty.toFixed(2);
    document.getElementById("count").innerText = filtered.length;

    // MONTHLY SUMMARY UI
    let monthlyHtml = "";

    Object.keys(monthly).forEach(m => {

        monthlyHtml += `
        <tr>
            <td>${m}</td>
            <td>${monthly[m].qty.toFixed(2)}</td>
            <td>${monthly[m].cost.toFixed(2)}</td>
            <td>${monthly[m].count}</td>
        </tr>
        `;
    });

    if (document.getElementById("monthlyTable")) {
        document.getElementById("monthlyTable").innerHTML = monthlyHtml;
    }
}
function clearInputs() {

    document.getElementById("qty").value = "";
    document.getElementById("price").value = "";
}
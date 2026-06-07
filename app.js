// ========================================================
// GLOBAL STATE MEMORY
// ========================================================
let currentNairaRate = 1500;

// ========================================================
// LOCAL STORAGE VAULT
// ========================================================
let savedLeads = JSON.parse(localStorage.getItem("leadsVault")) || [];

// ========================================================
// DOM ELEMENTS
// ========================================================
const syncButton = document.getElementById("sync-btn");
const rateDisplay = document.getElementById("rate-display");

const leadForm = document.getElementById("lead-form");
const clientNameInput = document.getElementById("client-name");
const projectTypeInput = document.getElementById("project-type");
const clientBudgetInput = document.getElementById("client-budget");

const outputBox = document.getElementById("output-box");
const resultName = document.getElementById("res-name");
const resultProject = document.getElementById("res-project");
const resultValuation = document.getElementById("res-valuation");
const resultStatus = document.getElementById("res-status");

const ledgerRows = document.getElementById("ledger-rows");

// ========================================================
// MODULE 1: LIVE MARKET SYNC ENGINE
// ========================================================
syncButton.addEventListener("click", async function () {
    try {
        const response = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await response.json();

        currentNairaRate = data.rates.NGN;

        rateDisplay.textContent = `1 USD = ₦${currentNairaRate.toFixed(2)} NGN`;
    } catch (error) {
        rateDisplay.textContent = "Failed to fetch exchange rate.";
        console.error(error);
    }
});

// ========================================================
// MODULE 2: LEAD INTAKE TERMINAL
// ========================================================
leadForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const clientName = clientNameInput.value;
    const projectType = projectTypeInput.value;
    const clientBudget = Number(clientBudgetInput.value);

    // Calculate local valuation
    const localValuation = clientBudget * currentNairaRate;

    // Reveal results card
    outputBox.style.display = "block";

    // Populate results
    resultName.textContent = clientName;
    resultProject.textContent = projectType;
    resultValuation.textContent =
        "₦" + localValuation.toLocaleString();

    // ========================================================
    // SAVE LEAD TO LOCAL STORAGE
    // ========================================================
    let newLead = {
        name: clientName,
        project: projectType,
        budget: clientBudget,
        valuation: localValuation
    };

    savedLeads.push(newLead);

    localStorage.setItem(
        "leadsVault",
        JSON.stringify(savedLeads)
    );

    renderLedger();

    console.log(
        "Vault Updated! Total Leads Stored Permanently:",
        savedLeads.length
    );

    // ========================================================
    // LEAD SCORING
    // ========================================================
    if (clientBudget >= 1000) {
        resultStatus.textContent =
            "🟢 HIGH-VALUE RADAR TARGET - INITIATE OUTREACH IMMEDIATELY";
        resultStatus.style.backgroundColor = "#0f3d20";
    } else {
        resultStatus.textContent =
            "🔴 PASS - Low priority budget tier for this crawl.";
        resultStatus.style.backgroundColor = "#4a1515";
    }

    // Optional: Clear form after submission
    leadForm.reset();
});

// ========================================================
// MODULE 3: LEDGER RENDER ENGINE
// ========================================================
function renderLedger() {
    // Clear old rows
    ledgerRows.innerHTML = "";

    // Render all saved leads
    savedLeads.forEach(function (lead) {
        let rowHTML = `
            <tr style="border-bottom: 1px solid #323238;">
                <td style="padding: 8px;">${lead.name}</td>
                <td style="padding: 8px;">${lead.project}</td>
                <td style="padding: 8px;">$${lead.budget.toLocaleString()}</td>
                <td style="padding: 8px;">₦${lead.valuation.toLocaleString()}</td>
            </tr>
        `;

        ledgerRows.innerHTML += rowHTML;
    });
}

// ========================================================
// INITIAL PAGE LOAD
// ========================================================
renderLedger();
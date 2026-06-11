// ========================================================
// GLOBAL STATE MEMORY (Stores the full live exchange rates array)
// ========================================================
let exchangeRatesData = null;

// Currency Symbol Lookups
const currencySymbols = {
    NGN: "₦",
    GHS: "₵",
    GBP: "£",
    EUR: "€",
    ZAR: "R"
};

// ========================================================
// LOCAL STORAGE VAULT
// ========================================================
let savedLeads = JSON.parse(localStorage.getItem("globalLeadsVault")) || [];

// ========================================================
// DOM ELEMENTS HOOKS
// ========================================================
const syncButton = document.getElementById("sync-btn");
const rateDisplay = document.getElementById("rate-display");

const leadForm = document.getElementById("lead-form");
const clientNameInput = document.getElementById("client-name");
const projectTypeInput = document.getElementById("project-type");
const clientBudgetInput = document.getElementById("client-budget");
const clientSpeedInput = document.getElementById("client-speed");
const targetCurrencySelect = document.getElementById("target-currency"); // New dropdown hook

const outputBox = document.getElementById("output-box");
const resultName = document.getElementById("res-name");
const resultProject = document.getElementById("res-project");
const resultValuation = document.getElementById("res-valuation");
const resultStatus = document.getElementById("res-status");

const ledgerRows = document.getElementById("ledger-rows");

// ========================================================
// MODULE 1: LIVE MARKET SYNC ENGINE (Pulls whole network map)
// ========================================================
syncButton.addEventListener("click", async function () {
    try {
        const response = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await response.json();

        // Store entire data payload to memory
        exchangeRatesData = data.rates; 
        rateDisplay.textContent = "Global Market Matrix Synced Successfully!";
    } catch (error) {
        rateDisplay.textContent = "Failed to fetch live network exchange rates.";
        console.error(error);
    }
});

// ========================================================
// MODULE 2: LEAD INTAKE & MONETIZATION TERMINAL
// ========================================================
leadForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Fallback safety filter if user forgot to click the Sync button
    if (!exchangeRatesData) {
        alert("CRITICAL ERROR: Please click the green 'Sync Exchange Engine' button first to fetch live currency matrix data.");
        return;
    }

    const clientName = clientNameInput.value;
    const projectType = projectTypeInput.value;
    const clientBudget = Number(clientBudgetInput.value);
    const clientSpeed = Number(clientSpeedInput.value);
    const selectedCurrency = targetCurrencySelect.value;

    // Dynamically look up the exchange rate and symbol based on user choices
    const rate = exchangeRatesData[selectedCurrency] || 1;
    const symbol = currencySymbols[selectedCurrency] || "$";
    const localValuation = clientBudget * rate;

    // Reveal results UI card
    outputBox.style.display = "block";

    // Populate foundational metrics
    resultName.textContent = clientName;
    resultProject.textContent = projectType;
    resultValuation.textContent = `${symbol}${localValuation.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

    // ========================================================
    // ADVANCED MONETIZATION SCORING ENGINE
    // ========================================================
    if (clientSpeed > 3.0 && clientBudget >= 1000) {
        resultStatus.textContent = "⚠️ HIGH-VALUE RETENTION RISK: Client losing up to 40% traffic due to load times! Pitch custom optimized API architecture.";
        resultStatus.style.backgroundColor = "#4a3b00";
        resultStatus.style.color = "#fff";
    } else if (clientBudget >= 1000) {
        resultStatus.textContent = "🟢 HIGH-VALUE RADAR TARGET - SPEED STABLE. INITIATE DIRECT OUTREACH FOR FEATURE EXPANSION.";
        resultStatus.style.backgroundColor = "#0f3d20";
        resultStatus.style.color = "#fff";
    } else {
        resultStatus.textContent = "🔴 PASS / LOW PRIORITY - Budget tier below premium parameters.";
        resultStatus.style.backgroundColor = "#4a1515";
        resultStatus.style.color = "#fff";
    }

    // ========================================================
    // SAVE ARCHIVE TO LOCAL STORAGE VAULT
    // ========================================================
    let newLead = {
        name: clientName,
        project: projectType,
        budget: clientBudget,
        speed: clientSpeed,
        valuationDisplay: `${symbol}${localValuation.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
    };

    savedLeads.push(newLead);
    localStorage.setItem("globalLeadsVault", JSON.stringify(savedLeads));

    // Refresh display
    renderLedger();
    leadForm.reset();
});

// ========================================================
// MODULE 3: LEDGER RENDER ENGINE
// ========================================================
function renderLedger() {
    ledgerRows.innerHTML = "";

    savedLeads.forEach(function (lead) {
        let rowHTML = `
            <tr style="border-bottom: 1px solid #323238;">
                <td style="padding: 8px;">${lead.name}</td>
                <td style="padding: 8px;">${lead.project}</td>
                <td style="padding: 8px;">$${lead.budget.toLocaleString()} (at ${lead.speed}s)</td>
                <td style="padding: 8px; font-weight: bold; color: #04d361;">${lead.valuationDisplay}</td>
            </tr>
        `;
        ledgerRows.innerHTML += rowHTML;
    });
}

// ========================================================
// INITIAL INITIALIZATION RUNTIME
// ========================================================
renderLedger();

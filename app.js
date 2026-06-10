// ========================================================
// GLOBAL STATE MEMORY
// ========================================================
let currentNairaRate = 1500;

// ========================================================
// LOCAL STORAGE VAULT
// ========================================================
let savedLeads = JSON.parse(localStorage.getItem("leadsVault")) || [];

// ========================================================
// DOM ELEMENTS HOOKS
// ========================================================
const syncButton = document.getElementById("sync-btn");
const rateDisplay = document.getElementById("rate-display");

const leadForm = document.getElementById("lead-form");
const clientNameInput = document.getElementById("client-name");
const projectTypeInput = document.getElementById("project-type");
const clientBudgetInput = document.getElementById("client-budget");
const clientSpeedInput = document.getElementById("client-speed"); // New Monetization input

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
// MODULE 2: LEAD INTAKE & MONETIZATION TERMINAL
// ========================================================
leadForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const clientName = clientNameInput.value;
    const projectType = projectTypeInput.value;
    const clientBudget = Number(clientBudgetInput.value);
    const clientSpeed = Number(clientSpeedInput.value);

    // Calculate local valuation using active state rate
    const localValuation = clientBudget * currentNairaRate;

    // Reveal results UI card
    outputBox.style.display = "block";

    // Populate foundational metrics
    resultName.textContent = clientName;
    resultProject.textContent = projectType;
    resultValuation.textContent = "₦" + localValuation.toLocaleString();

    // ========================================================
    // ADVANCED MONETIZATION SCORING ENGINE
    // ========================================================
    if (clientSpeed > 3.0 && clientBudget >= 1000) {
        resultStatus.textContent = "⚠️ HIGH-VALUE RETENTION RISK: Client losing up to 40% traffic due to load times! Pitch custom optimized API architecture.";
        resultStatus.style.backgroundColor = "#4a3b00"; // Alert Yellow/Orange
        resultStatus.style.color = "#fff";
    } else if (clientBudget >= 1000) {
        resultStatus.textContent = "🟢 HIGH-VALUE RADAR TARGET - SPEED STABLE. INITIATE DIRECT OUTREACH FOR FEATURE EXPANSION.";
        resultStatus.style.backgroundColor = "#0f3d20"; // Premium Green
        resultStatus.style.color = "#fff";
    } else {
        resultStatus.textContent = "🔴 PASS / LOW PRIORITY - Budget tier below premium parameters.";
        resultStatus.style.backgroundColor = "#4a1515"; // Red
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
        valuation: localValuation
    };

    savedLeads.push(newLead);
    localStorage.setItem("leadsVault", JSON.stringify(savedLeads));

    // Refresh the historical ledger display instantly
    renderLedger();

    // Reset the input fields automatically for the next crawl loop
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
                <td style="padding: 8px;">₦${lead.valuation.toLocaleString()}</td>
            </tr>
        `;
        ledgerRows.innerHTML += rowHTML;
    });
}

// ========================================================
// INITIAL INITIALIZATION RUNTIME
// ========================================================
renderLedger();

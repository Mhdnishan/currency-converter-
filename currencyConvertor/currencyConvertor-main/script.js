const container = document.querySelector(".container");
const fromCurr = document.querySelector("#fromCurr");
const toCurr = document.querySelector("#toCurr");
const fromAmt = document.querySelector("#fromAmt");
const toAmt = document.querySelector("#toAmt");
const fromFlag = document.querySelector(".fromFlag");
const toFlag = document.querySelector(".toFlag");
const result = document.querySelector(".result");

// Populate country dropdowns
for (let key in countryList) {
    const option1 = document.createElement("option");
    option1.value = key;
    option1.textContent = key;
    fromCurr.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = key;
    option2.textContent = key;
    toCurr.appendChild(option2);
}

// Set default values
fromCurr.value = "USD";
toCurr.value = "INR";
fromFlag.src = updateFlag(fromCurr.value);
toFlag.src = updateFlag(toCurr.value);

// Update flag images
fromCurr.addEventListener("change", () => {
    fromFlag.src = updateFlag(fromCurr.value);
});
toCurr.addEventListener("change", () => {
    toFlag.src = updateFlag(toCurr.value);
});

// Function to generate flag URL
function updateFlag(curr) {
    let code = countryList[curr];
    return `https://flagsapi.com/${code}/flat/64.png`;
}

// Convert currency
const convert = async () => {
    let amount = parseFloat(fromAmt.value);
    if (isNaN(amount) || amount < 1) {
        amount = 1;
        fromAmt.value = "1";
    }

    const fromCurrency = fromCurr.value;
    const toCurrency = toCurr.value;
    result.innerText = "Fetching Exchange Rates...";

    try {
        const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        const data = await res.json();
        const rate = data.rates[toCurrency];

        if (typeof rate === "undefined") {
            result.innerText = "Exchange rate data for selected country is not available.";
            toAmt.value = "";
        } else {
            const convertedAmt = (amount * rate).toFixed(2);
            toAmt.value = convertedAmt;
            result.innerText = `1 ${fromCurrency} = ${rate} ${toCurrency}`;
        }
    } catch (error) {
        container.innerHTML = `<h2>Error fetching exchange rates. Please try again.</h2>`;
    }
};

// Convert on button click
document.querySelector("#convertBtn").addEventListener("click", convert);

// Convert on load
window.addEventListener("load", convert);

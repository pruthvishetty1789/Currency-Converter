const BASE_URL = "https://api.exchangerate-api.com/v4/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns with currency options
document.addEventListener("DOMContentLoaded", () => {
    for (let select of dropdowns) {
        for (let currCode in countryList) {
            let newOption = document.createElement("option");
            newOption.innerText = currCode;
            newOption.value = currCode;

            if (select.name === "from" && currCode === "USD") {
                newOption.selected = "selected";
            } else if (select.name === "to" && currCode === "INR") {
                newOption.selected = "selected";
            }

            select.append(newOption);
        }

        // Update flag when currency is changed
        select.addEventListener("change", (evt) => {
            updateFlag(evt.target);
        });
    }

    updateExchangeRate(); // Fetch initial exchange rate
});

// Function to fetch exchange rate
const updateExchangeRate = async () => {
    try {
        let amount = document.querySelector(".amount input");
        let amtVal = amount.value;

        if (amtVal === "" || amtVal < 1) {
            amtVal = 1;
            amount.value = "1";
        }

        const URL = `${BASE_URL}/${fromCurr.value}`;
        
        console.log("Fetching data from:", URL); // Debugging step

        let response = await fetch(URL);
        if (!response.ok) throw new Error("Failed to fetch exchange rate");

        let data = await response.json();
        let rate = data.rates[toCurr.value];

        let finalAmount = amtVal * rate;
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
    } catch (error) {
        msg.innerText = "Error fetching exchange rate";
        console.error("API Error:", error);
    }
};

// Function to update flag when currency changes
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];

    if (!countryCode) return;

    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

// Handle button click
btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

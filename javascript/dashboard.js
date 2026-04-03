/**
 * Dashboard JavaScript file for the Quantity Measurement Application.
 * This file handles the user interface for selecting measurement types,
 * units, and performing calculations (arithmetic operations, comparisons, conversions).
 * It communicates with the backend API to perform quantity calculations.
 */

// Global state variables to track user selections
let selectedType = "LengthUnit"; // Default measurement type
let selectedAction = "add"; // Default arithmetic action
let isArithmeticMode = true; // Flag to determine if in arithmetic mode

// Units object synced with backend Java Enums
// Contains arrays of units for each measurement type
const units = {
    LengthUnit: ["FEET", "INCHES", "YARD", "CENTIMETRE"],
    WeightUnit: ["KG", "GRAM", "POUND"],
    VolumeUnit: ["MILILITRE", "LITRE", "GALLON"],
    TemperatureUnit: ["CELSIUS", "FAHRENHEIT", "KELVIN"]
};

// Initialize the dashboard when the window loads
window.onload = () => {
    loadUnits();
};

/**
 * Sets the selected measurement type and updates the UI.
 * @param {string} type - The measurement type (e.g., "LengthUnit")
 * @param {Element} element - The clicked element to highlight
 */
function setType(type, element) {
    selectedType = type;

    // Update UI active state for type cards
    document.querySelectorAll('.type-card').forEach(card => card.classList.remove('active'));
    element.classList.add('active');

    // Reload units for the new type
    loadUnits();
}

/**
 * Loads the unit options into the select dropdowns based on the selected type.
 */
function loadUnits() {
    const unit1 = document.getElementById("unit1");
    const unit2 = document.getElementById("unit2");

    // Clear existing options
    unit1.innerHTML = "";
    unit2.innerHTML = "";

    // Populate dropdowns with units from the selected type
    units[selectedType].forEach(u => {
        const option1 = new Option(u, u);
        const option2 = new Option(u, u);
        unit1.add(option1);
        unit2.add(option2);
    });
}

/**
 * Sets the selected action (arithmetic, compare, convert) and updates the UI.
 * @param {string} action - The action type ("arithmetic", "compare", "convert")
 * @param {Element} element - The clicked element to highlight
 */
function setAction(action, element) {
    const opSelect = document.getElementById("operator-select");
    const opStatic = document.getElementById("operator-static");

    // Update UI active state for action buttons
    document.querySelectorAll('.action-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');

    if (action === 'arithmetic') {
        isArithmeticMode = true;
        opSelect.style.display = "block";
        opStatic.style.display = "none";
        updateSelectedAction(); // Update from dropdown
    } else {
        isArithmeticMode = false;
        selectedAction = action;
        opSelect.style.display = "none";
        opStatic.style.display = "flex";
        opStatic.innerText = action === 'compare' ? "VS" : "→";
    }
}

/**
 * Updates the selected action from the operator dropdown in arithmetic mode.
 */
function updateSelectedAction() {
    if (isArithmeticMode) {
        selectedAction = document.getElementById("operator-select").value;
    }
}

/**
 * Performs the calculation by sending a request to the backend API.
 * Displays the result in the UI.
 */
async function calculate() {
    // Retrieve authentication token and input values
    const token = localStorage.getItem("token");
    const val1 = document.getElementById("value1").value;
    const val2 = document.getElementById("value2").value;
    const u1 = document.getElementById("unit1").value;
    const u2 = document.getElementById("unit2").value;

    // Prepare request body with quantity DTOs
    const requestBody = {
        thisQuantityDTO: { value: parseFloat(val1), unit: u1, measurementType: selectedType },
        thatQuantityDTO: { value: parseFloat(val2), unit: u2, measurementType: selectedType }
    };

    // Construct API URL based on selected action
    let url = `http://localhost:8080/api/v1/quantities/${selectedAction}`;

    try {
        // Send POST request to backend
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(requestBody)
        });

        // Parse response and display result
        const result = await response.json();
        document.getElementById("result-box").style.display = "block";
        document.getElementById("result-text").innerText = result.resultValue.toFixed(3);
        document.getElementById("result-unit-label").innerText = result.resultUnit;
    } catch (error) {
        console.error("Error during calculation:", error);
        // TODO: Add user-friendly error handling
    }
}
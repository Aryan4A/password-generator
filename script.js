const passwordInput = document.getElementById("password");
const lengthInput = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");

const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");

const strengthFill = document.getElementById("strengthFill");
const strengthText = document.getElementById("strengthText");


// ===============================
// CHARACTER SETS
// ===============================

const characterSets = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?"
};


// ===============================
// SECURE RANDOM CHARACTER
// ===============================

function secureRandom(max) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);

    return array[0] % max;
}


// ===============================
// GENERATE PASSWORD
// ===============================

function generatePassword() {

    const length = Number(lengthInput.value);

    let availableCharacters = "";
    let requiredCharacters = [];

    if (uppercase.checked) {
        availableCharacters += characterSets.uppercase;
        requiredCharacters.push(
            characterSets.uppercase[
                secureRandom(characterSets.uppercase.length)
            ]
        );
    }

    if (lowercase.checked) {
        availableCharacters += characterSets.lowercase;
        requiredCharacters.push(
            characterSets.lowercase[
                secureRandom(characterSets.lowercase.length)
            ]
        );
    }

    if (numbers.checked) {
        availableCharacters += characterSets.numbers;
        requiredCharacters.push(
            characterSets.numbers[
                secureRandom(characterSets.numbers.length)
            ]
        );
    }

    if (symbols.checked) {
        availableCharacters += characterSets.symbols;
        requiredCharacters.push(
            characterSets.symbols[
                secureRandom(characterSets.symbols.length)
            ]
        );
    }


    // No options selected
    if (availableCharacters.length === 0) {

        passwordInput.value = "";

        strengthText.textContent = "Select options";
        strengthFill.style.width = "0%";

        alert("Select at least one character type.");

        return;
    }


    // Prevent length from being smaller
    // than the number of required character types
    if (length < requiredCharacters.length) {

        lengthInput.value = requiredCharacters.length;
        lengthValue.textContent = requiredCharacters.length;

    }


    const finalLength = Math.max(
        Number(lengthInput.value),
        requiredCharacters.length
    );


    let passwordCharacters = [...requiredCharacters];


    // Fill remaining characters
    while (passwordCharacters.length < finalLength) {

        passwordCharacters.push(
            availableCharacters[
                secureRandom(availableCharacters.length)
            ]
        );

    }


    // Fisher-Yates shuffle
    for (let i = passwordCharacters.length - 1; i > 0; i--) {

        const randomIndex = secureRandom(i + 1);

        [passwordCharacters[i], passwordCharacters[randomIndex]] =
        [passwordCharacters[randomIndex], passwordCharacters[i]];

    }


    const password = passwordCharacters.join("");

    passwordInput.value = password;

    updateStrength(password);
}


// ===============================
// PASSWORD STRENGTH
// ===============================

function calculateStrength(password) {

    let score = 0;

    const length = password.length;


    // Length
    if (length >= 8) score++;
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (length >= 24) score++;


    // Character types
    if (/[A-Z]/.test(password)) score++;

    if (/[a-z]/.test(password)) score++;

    if (/[0-9]/.test(password)) score++;

    if (/[^A-Za-z0-9]/.test(password)) score++;


    return score;
}


function updateStrength(password) {

    if (!password) {

        strengthFill.style.width = "0%";
        strengthText.textContent = "—";

        return;
    }


    const score = calculateStrength(password);


    let percentage;
    let label;


    if (score <= 2) {

        percentage = 25;
        label = "Weak";

    } else if (score <= 4) {

        percentage = 50;
        label = "Medium";

    } else if (score <= 6) {

        percentage = 75;
        label = "Strong";

    } else {

        percentage = 100;
        label = "Very Strong";

    }


    strengthFill.style.width = `${percentage}%`;

    strengthText.textContent = label;
}


// ===============================
// COPY PASSWORD
// ===============================

async function copyPassword() {

    const password = passwordInput.value;

    if (!password) {
        return;
    }


    try {

        await navigator.clipboard.writeText(password);

        const button = document.querySelector(".copy-btn");

        const originalText = button.textContent;

        button.textContent = "Copied!";

        setTimeout(() => {
            button.textContent = originalText;
        }, 1500);

    } catch (error) {

        // Fallback for older browsers
        passwordInput.select();

        document.execCommand("copy");

        const button = document.querySelector(".copy-btn");

        button.textContent = "Copied!";

        setTimeout(() => {
            button.textContent = "Copy";
        }, 1500);
    }
}


// ===============================
// DARK / LIGHT THEME
// ===============================

function toggleTheme() {

    const body = document.body;
    const themeButton = document.querySelector(".theme-btn");


    if (body.classList.contains("dark")) {

        body.classList.remove("dark");
        body.classList.add("light");

        themeButton.textContent = "☀️";

        localStorage.setItem("theme", "light");

    } else {

        body.classList.remove("light");
        body.classList.add("dark");

        themeButton.textContent = "🌙";

        localStorage.setItem("theme", "dark");
    }
}


// ===============================
// LOAD SAVED THEME
// ===============================

function loadTheme() {

    const savedTheme = localStorage.getItem("theme");

    const themeButton = document.querySelector(".theme-btn");


    if (savedTheme === "light") {

        document.body.classList.remove("dark");
        document.body.classList.add("light");

        themeButton.textContent = "☀️";

    } else {

        document.body.classList.remove("light");
        document.body.classList.add("dark");

        themeButton.textContent = "🌙";
    }
}


// ===============================
// LENGTH SLIDER
// ===============================

lengthInput.addEventListener("input", () => {

    lengthValue.textContent = lengthInput.value;

    if (passwordInput.value) {
        generatePassword();
    }

});


// ===============================
// OPTION CHANGES
// ===============================

[
    uppercase,
    lowercase,
    numbers,
    symbols
].forEach(option => {

    option.addEventListener("change", () => {

        if (passwordInput.value) {
            generatePassword();
        }

    });

});


// ===============================
// GENERATE ON PAGE LOAD
// ===============================

loadTheme();
generatePassword();


// ===============================
// KEYBOARD SHORTCUT
// Ctrl + Enter
// ===============================

document.addEventListener("keydown", event => {

    if (event.ctrlKey && event.key === "Enter") {

        event.preventDefault();

        generatePassword();

    }

});

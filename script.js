const lengthSlider = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");
const passwordField = document.getElementById("password");
const strengthFill = document.getElementById("strengthFill");

// Load saved password + theme
window.onload = () => {
    let saved = localStorage.getItem("password");
    if (saved) passwordField.value = saved;

    let theme = localStorage.getItem("theme") || "dark";
    document.body.classList.add(theme);
};

lengthSlider.addEventListener("input", () => {
    lengthValue.textContent = lengthSlider.value;
});

function generatePassword() {
    let length = lengthSlider.value;

    let upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let lower = "abcdefghijklmnopqrstuvwxyz";
    let numbers = "0123456789";
    let symbols = "!@#$%^&*()";

    let chars = "";

    if (document.getElementById("uppercase").checked) chars += upper;
    if (document.getElementById("lowercase").checked) chars += lower;
    if (document.getElementById("numbers").checked) chars += numbers;
    if (document.getElementById("symbols").checked) chars += symbols;

    if (chars === "") {
        alert("Select at least one option!");
        return;
    }

    let password = "";

    for (let i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }

    passwordField.value = password;

    localStorage.setItem("password", password);

    updateStrength(password);
}

function copyPassword() {
    passwordField.select();
    document.execCommand("copy");
    alert("Copied!");
}

function updateStrength(password) {
    let strength = 0;

    if (password.length > 6) strength++;
    if (password.length > 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    let width = (strength / 5) * 100;
    strengthFill.style.width = width + "%";

    if (width < 40) strengthFill.style.background = "red";
    else if (width < 70) strengthFill.style.background = "orange";
    else strengthFill.style.background = "green";
}

function toggleTheme() {
    if (document.body.classList.contains("dark")) {
        document.body.classList.remove("dark");
        document.body.classList.add("light");
        localStorage.setItem("theme", "light");
    } else {
        document.body.classList.remove("light");
        document.body.classList.add("dark");
        localStorage.setItem("theme", "dark");
    }
}
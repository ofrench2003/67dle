// ── Pick daily hero (same for everyone each day) ──────────────────
function getDailyNummy() {
    return nummy[66];
}

const target = getDailyNummy();
const guessedNames = new Set();
let gameOver = false;

// ── Elements ──────────────────────────────────────────────────────
const input      = document.getElementById("search-input");
const dropdown   = document.getElementById("dropdown");
const guessesEl  = document.getElementById("guesses");
const tableContainer = document.getElementById("table-container");
const message    = document.getElementById("message");
const giveUpBtn  = document.getElementById("give-up-btn");

// ── Search input → dropdown ───────────────────────────────────────
input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();

    if (!query) {
        dropdown.classList.add("hidden");
        return;
    }

    // Filter out already guessed numbers
    const matches = nummy.filter(h =>
        h.name.toLowerCase().includes(query) &&
        !guessedNames.has(h.name)
    );

    if (matches.length === 0) {
        dropdown.classList.add("hidden");
        return;
    }

    // Build dropdown items
    dropdown.innerHTML = "";
    matches.forEach(num => {
        const item = document.createElement("div");
        item.classList.add("dropdown-item");
        item.textContent = num.name;
        item.addEventListener("click", () => selectNummy(num));
        dropdown.appendChild(item);
    });

    dropdown.classList.remove("hidden");
});

// Close dropdown if clicking outside
document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-container")) {
        dropdown.classList.add("hidden");
    }
});

// ── Select a number from dropdown ───────────────────────────────────
function selectNummy(num) {
    if (gameOver) return;

    input.value = "";
    dropdown.classList.add("hidden");
    guessedNames.add(num.name);

    addGuessRow(num);

    if (num.name === target.name) {
        endGame(true);
    }
}

// ── Add a guess row to the grid ───────────────────────────────────
function addGuessRow(guess) {
    tableContainer.classList.remove("hidden");

    const fields = ["name", "number"];
    const row = document.createElement("div");
    row.classList.add("guess-row");

    fields.forEach((field, i) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.textContent = guess[field];

        const isCorrect = guess[field] === target[field];
        cell.classList.add(isCorrect ? "correct" : "wrong");

        // Stagger the flip animation
        cell.style.animationDelay = `${i * 100}ms`;

        row.appendChild(cell);
    });

    guessesEl.prepend(row); // newest guess at the top
}

// ── Give up ───────────────────────────────────────────────────────
giveUpBtn.addEventListener("click", () => {
    if (gameOver) return;
    endGame(false);
});

// ── End game ──────────────────────────────────────────────────────
function endGame(won) {
    gameOver = true;
    input.disabled = true;
    giveUpBtn.disabled = true;
    message.classList.remove("hidden");

    if (won) {
        const count = guessedNames.size;
        message.textContent = `Correct! You got it in ${count} ${count === 1 ? "guess" : "guesses"}!`;
        message.classList.add("win");
    } else {
        message.textContent = `The number was ${target.name}. Better luck tomorrow!`;
        message.classList.add("lose");
    }
}
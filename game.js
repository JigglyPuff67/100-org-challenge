const SAVE_PREFIX = "OrgGame_";

let lines = [];
let currentLine = 0;
let currentGame = "";

const output = document.getElementById("output");

function loadGame() {

    currentGame = document.getElementById("gameSelect").value;

    // Remove the Continue button if it exists
    const button = document.getElementById("continueButton");
    if (button)
        button.remove();

    fetch("scripts/" + currentGame)
        .then(response => response.text())
        .then(text => {

            lines = text.split("\n");
            currentLine = 0;

            output.textContent = "Ready.\nPress NEXT.";

            // Save the new game
            localStorage.setItem(SAVE_PREFIX + "game", currentGame);
            localStorage.setItem(SAVE_PREFIX + "line", currentLine);

        });

}

function nextLine() {

    if (currentLine < lines.length) {

        output.textContent += "\n\n" + lines[currentLine];

        currentLine++;

        // Save progress
        localStorage.setItem(SAVE_PREFIX + "game", currentGame);
        localStorage.setItem(SAVE_PREFIX + "line", currentLine);

        window.scrollTo(0, document.body.scrollHeight);

    } else {

        output.textContent += "\n\n--- END OF GAME ---";

        // Clear the save
        localStorage.removeItem(SAVE_PREFIX + "game");
        localStorage.removeItem(SAVE_PREFIX + "line");

    }

}

document.addEventListener("keydown", function(event){

    if(event.key === "Enter"){
        nextLine();
    }

});

function continueGame() {

    const savedGame = localStorage.getItem(SAVE_PREFIX + "game");

    if (!savedGame)
        return;

    const savedLine = parseInt(localStorage.getItem(SAVE_PREFIX + "line")) || 0;

    currentGame = savedGame;

    document.getElementById("gameSelect").value = currentGame;

    fetch("scripts/" + currentGame)
        .then(response => response.text())
        .then(text => {

            lines = text.split("\n");

            output.textContent = "";

            currentLine = savedLine;

            // Remove the Continue button
            const button = document.getElementById("continueButton");
            if (button)
                button.remove();

        });

}

function checkForSavedGame() {

    const savedGame = localStorage.getItem(SAVE_PREFIX + "game");

    if (!savedGame)
        return;

    const savedLine = localStorage.getItem(SAVE_PREFIX + "line");

    const button = document.createElement("button");

    button.id = "continueButton";

    button.textContent =
        "▶ Continue " +
        savedGame.replace(".txt", "") +
        " (Line " + savedLine + ")";

    button.onclick = continueGame;

    document.body.insertBefore(button, output);

}

window.onload = checkForSavedGame;

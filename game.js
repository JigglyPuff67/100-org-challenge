const SAVE_PREFIX = "OrgGame_";

let lines = [];
let currentLine = 0;
let currentGame = "";

const output = document.getElementById("output");

function loadGame() {

    currentGame = document.getElementById("gameSelect").value;

    fetch("scripts/" + currentGame)
        .then(response => response.text())
        .then(text => {

            lines = text.split("\n");
            currentLine = 0;

            output.textContent = "Ready.\nPress NEXT.";

            // Save the newly started game
            localStorage.setItem(SAVE_PREFIX + "game", currentGame);
            localStorage.setItem(SAVE_PREFIX + "line", currentLine);

        });

}

function nextLine() {

    if (currentLine < lines.length) {

        output.textContent += "\n\n" + lines[currentLine];

        currentLine++;

        // Save progress after every line
        localStorage.setItem(SAVE_PREFIX + "game", currentGame);
        localStorage.setItem(SAVE_PREFIX + "line", currentLine);

        window.scrollTo(0, document.body.scrollHeight);

    } else {

        output.textContent += "\n\n--- END OF JOURNEY ---";

        // Clear the save once the game is finished
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

            output.textContent = "Session restored.\nPress NEXT to continue.";

            currentLine = savedLine;

        });

}

window.onload = continueGame;

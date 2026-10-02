import { WORDS } from "./words.js";

const NUMBER_OF_GUESSES = 8;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]
let solved = false
console.log(rightGuessString)
let redLetters = new Set();
let yellowLetters = []
let greenLetters = []
let darkMode = false


function checkGuess() {
   let row = document.getElementsByClassName("letter-row")[8 - guessesRemaining]
   let input = ''
    for (const val of currentGuess) {
        input += val
    }

    if (!WORDS.includes(input)) {
        console.log(input)
        console.log("Dit woord staat niet in de woordenlijst.")
        alert("Dit woord staat niet in de woordenlijst.")
        return;
    }
    
    if (input.length != 5) {
        alert("Niet genoeg letters.")
        return
    }
    

    const score = checkWoord(input, rightGuessString)

    if (score.Rood == 5) {
        for (const letter of input) {
            redLetters.add(letter)
        }
    }
    let box = row.children[5]
    box.textContent = score.Groen
    box = row.children[6]
    box.textContent = score.Geel
    box = row.children[7]
    box.textContent = score.Rood
    guessesRemaining -= 1
    currentGuess = []
    nextLetter = 0;
    updateFouteLetters();
    
    if (score.Groen == 5) {
        solved = true
        document.getElementById("message").textContent = "Goed geraden!";
        document.getElementById("yordi").style = "width: 10%"

        let rows = document.querySelectorAll('.letter-row')
        rows.forEach(row => {
            let boxes = row.childNodes
            let index = 0
            boxes.forEach(box => {
                if (index < 5 && box.textContent != '') {
                    box.classList.remove("red-box", "yellow-box", "green-box");
                    if (rightGuessString[index] == box.textContent) {
                        box.classList.add("green-box");
                    }
                    else if (rightGuessString.indexOf(box.textContent) > -1) {
                        box.classList.add("yellow-box");
                    }
                    else {
                        box.classList.add("red-box");
                    }
                    index += 1
                }
            })
        })
    }
}

function checkWoord(poging, antwoord){
  let geel = 0
  let groen = 0
  let rood = 0
  let checkedAntwoord = antwoord
  for(let i = 0; i < poging.length; i++){
    let index = checkedAntwoord.indexOf(poging[i])
    if(index != -1){
      checkedAntwoord = checkedAntwoord.slice(0,index) + checkedAntwoord.slice(index+1)
      geel += 1
    }
    if(poging[i] == antwoord[i]){
      groen += 1
    }
  }
  geel = geel - groen
  rood = antwoord.length - groen - geel
  return {'Groen':groen, 'Geel': geel, 'Rood': rood}
}
function initBoard() {
    let board = document.getElementById("game-board");

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div")
        row.className = "letter-row"


        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div")
            box.className = "letter-box"
            box.addEventListener("click", () => {
                if (solved) {
                    return
                }

                if (redLetters.has(box.textContent)) {
                    box.dataset.color = "red";
                    box.classList.remove("yellow-box", "green-box");
                    box.classList.add("red-box");
                    return;
                }
                box.classList.remove("yellow-box", "green-box", "red-box");

                if (!box.dataset.color && box.textContent != "") {
                    box.dataset.color = "red";
                    box.classList.add("red-box");
                }
                else if (box.dataset.color === "red" && box.textContent != "") {
                    box.dataset.color = "yellow";
                    box.classList.add("yellow-box");
                }
                else if (box.dataset.color === "yellow" && box.textContent != "") {
                    box.dataset.color = "green";
                    box.classList.add("green-box");
                }
                else if (box.dataset.color === "green" && box.textContent != "") {
                    box.dataset.color = "";
                    
                }
                else {
                    box.dataset.color = "";
                }
            });
            row.appendChild(box)
        }


        let scoreBox = document.createElement("div")
        scoreBox.className = "green-box score-box"
        row.appendChild(scoreBox)
        scoreBox = document.createElement("div")
        scoreBox.className = "yellow-box score-box"
        row.appendChild(scoreBox)
        scoreBox = document.createElement("div")
        scoreBox.className = "red-box score-box"
        row.appendChild(scoreBox)

        board.appendChild(row)
    }
}

initBoard()

document.addEventListener("keyup", (e) => {
    if (solved) {
        return
    }

    if (guessesRemaining === 0) {
        return
    }

    let pressedKey = String(e.key)
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter()
        return
    }

    if (pressedKey === "Enter") {
        checkGuess()
        return
    }

    if (!/^[a-zA-Z]$/.test(pressedKey)) {
        return
    }

    insertLetter(pressedKey)
})

function insertLetter(pressedKey) {
    if (nextLetter === 5) {
        return
    }
    pressedKey = pressedKey.toUpperCase()

    let row = document.getElementsByClassName("letter-row")[8 - guessesRemaining]
    let box = row.children[nextLetter]
    box.textContent = pressedKey
    if (darkMode) { box.classList.add("filled-box-dark-mode") }
    else { box.classList.add("filled-box-light-mode") }
    currentGuess.push(pressedKey)
    nextLetter += 1
}

function deleteLetter() {
    let row = document.getElementsByClassName("letter-row")[8 - guessesRemaining]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box-dark-mode", "filled-box-light-mode")
    currentGuess.pop()
    nextLetter -= 1
}

function resetColours() {
    if (solved) {
        return
    }
    const boxes = document.querySelectorAll(".letter-box");
    boxes.forEach(box => {
        const letter = box.textContent;
        box.classList.remove("red-box", "yellow-box", "green-box");
        box.dataset.color = "";
        if (letter !== "" && redLetters.has(letter)) {
            box.dataset.color = "red";
            box.classList.remove("yellow-box", "green-box");
            box.classList.add("red-box");
        }
    });
}

function updateFouteLetters() {
    const boxes = document.querySelectorAll(".letter-box");

    boxes.forEach(box => {
        const letter = box.textContent;

        if (letter !== "" && redLetters.has(letter)) {
            box.dataset.color = "red";
            box.classList.remove("yellow-box", "green-box");
            box.classList.add("red-box");
        }
    });
    const keys = document.querySelectorAll(".keyboard-button");
    keys.forEach(key => {
        const letter = key.textContent;
        if (letter !== "" && redLetters.has(letter)) {
            console.log(letter)
            key.classList.add("keyboard-button-wrong")
        }
    });

}

function newGame() {
    guessesRemaining = NUMBER_OF_GUESSES;
    currentGuess = [];
    nextLetter = 0;
    rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]
    console.log(rightGuessString)
    redLetters = new Set();
    yellowLetters = []
    greenLetters = []
    solved = false

    const boxes = document.querySelectorAll(".letter-box");
    boxes.forEach(box => {
        box.textContent = ""
        box.classList.remove("red-box", "yellow-box", "green-box", "filled-box-dark-mode", "filled-box-light-mode");
    });
    const scoreBoxes = document.querySelectorAll(".score-box");
    scoreBoxes.forEach(box => {
        box.textContent = ""
    });
    const keys = document.querySelectorAll(".keyboard-button-wrong");
    keys.forEach(key => {
        key.classList.remove("keyboard-button-wrong")
    });
    document.getElementById("message").textContent = "";
    document.getElementById("yordi").style = "display: none"
}

function switchMode() {
    if (darkMode) {
        document.getElementById("body").style.backgroundColor = "white";
        document.getElementById("body").style.color = "black";
        console.log(document.getElementsByClassName("fa-sun"))
        let modebtn = document.getElementsByClassName("fa-sun")[0]
        modebtn.classList.remove("fa-sun")
        modebtn.classList.add("fa-moon")
        document.getElementById("logo-dark-mode").style.display = 'none';
        document.getElementById("logo-light-mode").style.display = '';
        const boxes = document.querySelectorAll(".filled-box-dark-mode");
        boxes.forEach(box => {
            box.classList.remove("filled-box-dark-mode");
            box.classList.add("filled-box-light-mode");
        });
        const btns = document.querySelectorAll(".settings-btn");
        btns.forEach(btn => {
            btn.classList.remove("settings-btn-dark-mode");
            btn.classList.add("settings-btn-light-mode");
        });
        darkMode = false
    }
    else {
        document.getElementById("body").style.backgroundColor = "#111318";
        document.getElementById("body").style.color = "white";
        console.log(document.getElementsByClassName("fa-moon"))
        let modebtn = document.getElementsByClassName("fa-moon")[0]
        modebtn.classList.remove("fa-moon")
        modebtn.classList.add("fa-sun")
        document.getElementById("logo-dark-mode").style.display = ''
        document.getElementById("logo-light-mode").style.display = 'none';
        const boxes = document.querySelectorAll(".filled-box-light-mode");
        boxes.forEach(box => {
            box.classList.remove("filled-box-light-mode");
            box.classList.add("filled-box-dark-mode");
        });
        const btns = document.querySelectorAll(".settings-btn");
        btns.forEach(btn => {
            btn.classList.remove("settings-btn-light-mode");
            btn.classList.add("settings-btn-dark-mode");
        });
        darkMode = true
    }
}

document.getElementById("reset").addEventListener("click", () => {
    resetColours();
    document.getElementById("new").blur();
});
document.getElementById("new").addEventListener("click", () => {
    newGame();
    document.getElementById("new").blur();
});
document.getElementById("mode").addEventListener("click", () => {
    switchMode();
    document.getElementById("mode").blur();
});

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target

    if (!target.classList.contains("keyboard-button")) {
        return
    }
    let key = target.textContent

    if (key === "Del") {
        key = "Backspace"
    }

    document.dispatchEvent(new KeyboardEvent("keyup", { 'key': key }))
})

function resizeGame() {
    const app = document.getElementById("app");

    const designWidth = 500;
    const designHeight = 900;

    const scaleX = window.innerWidth / designWidth;
    const scaleY = window.innerHeight / designHeight;

    const scale = Math.min(scaleX, scaleY, 1);

    app.style.setProperty("--game-scale", scale);
}

window.addEventListener("resize", resizeGame);
resizeGame();
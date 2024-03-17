type Display = boolean[][];

// Inicializace proměnných
let cursorX = 0;
let cursorY = 0;
let frames: Display[] = [];

// Vytvoření základního displaye
const display: Display = [
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false]
];

// Funkce pro zobrazení kurzoru
function showCursor() {
    led.plot(cursorX, cursorY);
}

// Funkce pro skrytí kurzoru
function hideCursor() {
    led.unplot(cursorX, cursorY);
}

// Vytvoření kopie displaye a zapnutých pozic
function copy(display: Display): Display {
    const newDisplay: Display = [
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false]
    ];

    for (let y = 0; y < display.length; y++) {
        for (let x = 0; x < display.length; x++) {
            newDisplay[y][x] = display[y][x]
        }
    }

    return newDisplay
}

let wasLogoPressed: boolean = false
let lastLogoPressTime: number = 0
    basic.forever(() => {
    //Podržení loga pro uložení snímku
    if (input.logoIsPressed() && !wasLogoPressed) {
        wasLogoPressed = true
        lastLogoPressTime = control.millis()
    } else if (input.logoIsPressed() && wasLogoPressed && control.millis() - lastLogoPressTime >= 2000) {
        frames.push(copy(display))
        lastLogoPressTime = 99999999999999999999999999999999999999999999
        basic.clearScreen()
        basic.showIcon(IconNames.Yes);
        basic.pause(800);
        basic.clearScreen()
    } else if (!input.logoIsPressed()) {
        wasLogoPressed = false
    }

// Spuštění funkce pro zobrazení a skrytí kurzoru
    if (!lock) {
        showCursor();
        basic.pause(800);
        hideCursor();
        basic.pause(800);
    }
});

//Zobrazení zapnutých pozic
loops.everyInterval(10, function () {
    if (!lock) {
        for (let y = 0; y < display.length; y++) {
            for (let x = 0; x < display.length; x++) {
                if (display[y][x]) {
                    led.plot(x, y);
                }
            }
        }
    }
})

// Čtení vstupu od uživatele
input.onButtonPressed(Button.A, () => {
    hideCursor();
    // Pokud dojde na kraj, teleportuj se na druhou stranu
    cursorX = cursorX === 0 ? 4 : cursorX - 1;
    showCursor();
});

input.onButtonPressed(Button.B, () => {
    hideCursor();
    // Pokud dojde na kraj, teleportuj se na druhou stranu
    cursorX = cursorX === 4 ? 0 : cursorX + 1;
    showCursor();
});

input.onButtonPressed(Button.AB, () => {
    // Změna stavu vybrané LED
    display[cursorY][cursorX] = !display[cursorY][cursorX];
    // Zobrazí nebo skryje LED podle nového stavu
    if (display[cursorY][cursorX]) {
        led.plot(cursorX, cursorY);
    } else {
        led.unplot(cursorX, cursorY);
    }
    // Zobrazí kurzor na aktualizované pozici
    showCursor();
});

input.onLogoEvent(TouchButtonEvent.Pressed, () => {
    hideCursor();

    if (cursorY - 1 < 0){
        cursorY = 4
    } else {
        cursorY -= 1
    }
    showCursor();
});

input.onPinPressed(TouchPin.P1, () => {
    hideCursor();
    cursorY = (cursorY + 1) % 5;
    showCursor();
});

let lock: boolean = false
input.onGesture(Gesture.Shake, () => {
    // Po dokončení tvorby animace přehraje všechny snímky ve smyčce
    lock = true
    basic.clearScreen()
    for (const frame of frames) {
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                if (frame[y][x]) {
                    led.plot(x, y);
                } else {
                    led.unplot(x, y);
                }
            }
        }
        basic.pause(2000); // Rychlost 1/5 fps
    }
    lock = false
});

input.onPinPressed(TouchPin.P2, () => {
    // Resetování snímků a zobrazení posledního
    frames = [];
    basic.showIcon(IconNames.Yes);
    basic.pause(200)
    basic.clearScreen()
});
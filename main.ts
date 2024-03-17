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

// Spuštění funkce pro zobrazení a skrytí kurzoru v samostatném vlákně
basic.forever(() => {
    showCursor();
    basic.pause(800);
    hideCursor();
    basic.pause(800);
});

loops.everyInterval(10, function () {
    for (let y = 0; y < display.length; y++) {
        for (let x = 0; x < display.length; x++) {
            if (display[y][x]) {
                led.plot(x, y);
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
    cursorY = (cursorY - 1) % 5;
    showCursor();
});

input.onPinPressed(TouchPin.P1, () => {
    hideCursor();
    cursorY = (cursorY + 1) % 5;
    showCursor();
});

input.onGesture(Gesture.Shake, () => {
    // Po dokončení tvorby animace přehraj všechny snímky ve smyčce
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
        basic.pause(200); // Rychlost 5 fps
    }
});

input.onPinPressed(TouchPin.P2, () => {
    // Resetování všech snímků a návrat do editačního režimu
    frames = [];
    basic.showIcon(IconNames.Yes);
});

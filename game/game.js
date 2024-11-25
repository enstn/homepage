/* main.css */
class brainGame {
    constructor() {
        this.isActive = false;
        this.introBox = null;
        this.init();
    }

    init() {
        // introBox
        this.createIntroBox();
    }

    createIntroBox () {
        this.introBox = document.createElement('div');
        this.introBox.id = 'game-intro-box';
        this.introBox.className = 'intro-box';

        // intro box content
        this.introBox.innerHTML = `
            <h2>start game=</h2>
            <button id="yes-button">Yes</button>
            <button id="no-button">No>/button>
        `;

        // event listener for button click
        document.getElementById("yes-button").addEventListener("click", () => startGame());
        document.getElementById("no-button").addEventListener("click", () => closeBox());
    }

    // functions for introBox buttons
    closeBox() {

    }

}

export function showBox() {
    console.log('showBox function reached');
}
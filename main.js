import { createOptions, createEvent } from "./scripts/eventsManager.js";
import { Events } from "./scripts/events.js";
import { PlayerStats } from "./scripts/playerStats.js";
import JourneyStatusHandler from "./scripts/journeyStatusHandler.js";
import { GameLossText, GameWinText } from "./scripts/gameOverText.js";

const events = document.querySelector('#events')
const journeyStatus = document.querySelector('#status')

const eventKeys = Object.keys(Events);

// const gameOverDiv1 = document.createElement('div'); 
// const gameOverDiv2 = document.createElement('div');
// const gameOverDiv3 = document.createElement('div');

// const gameOverDivs = [gameOverDiv1, gameOverDiv2, gameOverDiv3]

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class Game {

    static state = null;
    static running = true;

    static async beginRound() {
        JourneyStatusHandler.initializeJourneyStatus(journeyStatus);

        const travelDescription = JourneyStatusHandler.createTravelDescription();
        events.appendChild(travelDescription);

        // TODO: implement a Player class and move all of the player stats logic there
        // preferably to the updateStates function
        await sleep(1000);

        for (let i = 0; i < 10; i++) {
            if (PlayerStats.food < 2) {
                PlayerStats.health -= 3;
            } else {
                PlayerStats.food -= 2;
            }

            if (PlayerStats.water < 2) {
                PlayerStats.health -= 4;
            } else {
                PlayerStats.water -= 2;
            }

            PlayerStats.days += 1;
            PlayerStats.km += 20;

            PlayerStats.updateStats(["food", "health", "water", "days", "km"]);
            JourneyStatusHandler.updateJourneyStatus(journeyStatus);

            if (PlayerStats.health <= 0) {
                this.state = "loss";
                return;
            } else {
                await sleep(1000);
            }
        }
    }

    static async eventBegin(event) {

        journeyStatus.textContent = event.journeyText
        await createEvent(event, events);

        if (event.textOnly === false) {
            await sleep(3000);
            await createOptions(event.options, events);
        }

    }

    static async generateEvent() {
        const randNum = Math.floor(Math.random() * eventKeys.length);
        console.log("event chosen: #" + randNum);
        await this.eventBegin(Events[eventKeys[randNum]]);
    }

    static async gameLost() {
        console.log("game lost");
        
        let gameOverElements = [];
        for (let i = 0; i < 3; i++) {
            const gameOverTextContainer = document.createElement('div');
            gameOverTextContainer.classList.add('event');
            gameOverTextContainer.textContent = GameLossText[i];
            gameOverElements.push(gameOverTextContainer);
        }
        
        journeyStatus.textContent = "an end.";
        events.replaceChildren();

        const continueDiv = document.createElement('div');
        continueDiv.classList.add('continue', 'player', 'clickable');
        continueDiv.textContent = "continue..."

        let count = 0;
        for (let div of gameOverElements) {
            events.appendChild(div);
            await sleep(3000);

            if (count == 2) {
                continueDiv.textContent = "reload the page to try again...";
            }

            events.appendChild(continueDiv);
            
            await new Promise(resolve => {
                const continueHandler = () => {
                    events.removeChild(div);
                    events.removeChild(continueDiv);
                    continueDiv.removeEventListener('click', continueHandler);
                    resolve();
                };
                continueDiv.addEventListener('click', continueHandler);
            });

            count+=1;
        }

        window.location.reload();
    }

    static async gameWin() {
        console.log("game won");

        let gameOverElements = [];
        for (let i = 0; i < 3; i++) {
            const gameOverTextContainer = document.createElement('div');
            gameOverTextContainer.classList.add('event');
            gameOverTextContainer.textContent = GameWinText[i];
            gameOverElements.push(gameOverTextContainer);
        }

        journeyStatus.textContent = "an end.";
        events.replaceChildren();

        const continueDiv = document.createElement('div');
        continueDiv.classList.add('continue', 'player', 'clickable');
        continueDiv.textContent = "continue..."

        let count = 0;
        for (let div of gameOverElements) {
            events.appendChild(div);
            await sleep(3000);

            if (count == 2) {
                continueDiv.textContent = "reload the page to try again...";
            }

            events.appendChild(continueDiv);
            
            await new Promise(resolve => {
                const continueHandler = () => {
                    events.removeChild(div);
                    events.removeChild(continueDiv);
                    continueDiv.removeEventListener('click', continueHandler);
                    resolve();
                };
                continueDiv.addEventListener('click', continueHandler);
            });

            count+=1;
        }

        window.location.reload();
    }
}

async function main() {
    while (Game.running) {
        await Game.beginRound();
        if (Game.state === "loss" || Game.state === "win") {
            Game.running = false;
        } else {
            await Game.generateEvent();
        }
    }

    if (Game.state === "loss") {
        await Game.gameLost();
    } else if (Game.state === "win") {
        await Game.gameWin();
    }

}

main();
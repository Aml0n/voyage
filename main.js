import { createOptions, createEvent, OptionControllerManager, ContinueControllerManager } from "./scripts/eventsManager.js";
import { Events } from "./scripts/events.js";
import { PlayerStats } from "./scripts/playerStats.js";
import JourneyStatusHandler from "./scripts/journeyStatusHandler.js";
import { GameLossText, GameWinText } from "./scripts/gameOverText.js";

const events = document.querySelector('#events')
const eventList = [];
const journeyStatus = document.querySelector('#status')

const eventKeys = Object.keys(Events);

const gameOverDiv1 = document.createElement('div'); 
const gameOverDiv2 = document.createElement('div');
const gameOverDiv3 = document.createElement('div');

const gameOverDivs = [gameOverDiv1, gameOverDiv2, gameOverDiv3]

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// let templateOptions = [
//     'take his coins',
//     'give him water',
//     'ignore him',
//     'skibidi rizz ohio gyatt'
// ]

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
        await createEvent(event);

        if (event.textOnly === false) {
            await sleep(3000);
            await createOptions(event.options);
        }

    }

    static async generateEvent() {
        const randNum = Math.floor(Math.random() * eventKeys.length);
        console.log(randNum)
        await this.eventBegin(Events[eventKeys[randNum]]);
    }

    static gameLost() {
        let divNumber = 0;
        for (let div of gameOverDivs) {
            div.classList.add('event');
            div.textContent = GameLossText[divNumber];
            divNumber += 1; 
        }

        let whichDiv = 0;
        journeyStatus.textContent = "an end.";
        events.replaceChildren();
        const continueDiv = document.createElement('div');
        continueDiv.classList.add('continue', 'player', 'clickable');
        continueDiv.textContent = "continue..."
        continueDiv.addEventListener('click', () => {
            events.appendChild(gameOverDivs[whichDiv]);
            events.removeChild(continueDiv);
            whichDiv += 1;
            if (whichDiv === 3) {
                ContinueControllerManager.abort();
                continueDiv.textContent = "reload the page to try again...";
                setTimeout(() => {
                    events.appendChild(continueDiv);
                }, 2000);

            } else {
                setTimeout(() => {
                    events.appendChild(continueDiv);
                }, 2000); 
            }
            
        }, ContinueControllerManager.getSignal());
        events.appendChild(gameOverDiv1);
        whichDiv += 1;
        setTimeout(() => {
            events.appendChild(continueDiv);
        }, 2000);
    }

    static gameWin() {
        let divNumber = 0;
        for (let div of gameOverDivs) {
            div.classList.add('event');
            div.textContent = GameWinText[divNumber];
            divNumber += 1; 
        }

        let whichDiv = 0;
        journeyStatus.textContent = "an end.";
        events.replaceChildren();
        const continueDiv = document.createElement('div');
        continueDiv.classList.add('continue', 'player', 'clickable');
        continueDiv.textContent = "continue..."
        continueDiv.addEventListener('click', () => {
            events.appendChild(gameOverDivs[whichDiv]);
            events.removeChild(continueDiv);
            whichDiv += 1;
            if (whichDiv === 3) {
                ContinueControllerManager.abort();
                continueDiv.textContent = "reload the page to play again...";
                setTimeout(() => {
                    events.appendChild(continueDiv);
                }, 2000);

            } else {
                setTimeout(() => {
                    events.appendChild(continueDiv);
                }, 2000); 
            }
            
            }, ContinueControllerManager.getSignal()
        );

        events.appendChild(gameOverDiv1);
        whichDiv += 1;
        setTimeout(() => {
            events.appendChild(continueDiv);
        }, 2000);
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
}

main();
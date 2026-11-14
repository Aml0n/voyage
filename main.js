import { createOptions, createEvent, OptionControllerManager, ContinueControllerManager } from "./scripts/eventsManager.js";
import { Events } from "./scripts/events.js";
import { PlayerStats } from "./scripts/playerStats.js";
import { JourneyStatusHandler, TravelDescriptions, aJourney } from "./scripts/journeyStatusHandler.js";
import { GameLossText, GameWinText } from "./scripts/gameOverText.js";

const events = document.querySelector('#events')
const eventList = [];
const journeyStatus = document.querySelector('#status')

const eventKeys = Object.keys(Events);

const gameOverDiv1 = document.createElement('div');
const gameOverDiv2 = document.createElement('div');
const gameOverDiv3 = document.createElement('div');

const gameOverDivs = [gameOverDiv1, gameOverDiv2, gameOverDiv3]

// let templateOptions = [
//     'take his coins',
//     'give him water',
//     'ignore him',
//     'skibidi rizz ohio gyatt'
// ]

// createOptions(Events.dehydratedMan.options);
// createEvent(Events.dehydratedMan.text);
// createOptions(Events.dehydratedMan.options);

// refreshEvents()

// events.replaceChildren();

function replaceFirstTwoChar(string, charToReplace, replacementChar) {
    const firstString = string.replace(charToReplace, replacementChar);
    return firstString.replace(charToReplace, replacementChar);
};

export const Game = {

    state: null,

    roundBegin: function() {
        if (PlayerStats.km >= 4000) {
            Game.state = "win"
            this.gameWin();
        } else {
            JourneyStatusHandler.initializeJourneyStatus(journeyStatus);

            const travelDescription = document.createElement('div');
            travelDescription.classList.add('event');
            travelDescription.textContent = TravelDescriptions[Math.floor((Math.random() * TravelDescriptions.length))]
            events.appendChild(travelDescription);

            let loopConsume = setInterval(() => {

                if (PlayerStats.food < 2) {
                    PlayerStats.health -= 3;
                } else {
                    PlayerStats.food -= 2;
                };
                
                if (PlayerStats.water < 2) {
                    PlayerStats.health -= 4;
                } else {
                    PlayerStats.water -= 2;
                }
                PlayerStats.days += 1;
                PlayerStats.km += 20;
                // console.log(`${PlayerStats.food}, ${PlayerStats.water}, ${PlayerStats.health}`)
                PlayerStats.updateStats(["food", "health", "water", "days", "km"]);
                JourneyStatusHandler.updateJourneyStatus(journeyStatus);

                if (PlayerStats.health <= 0) {
                    this.state = "loss";
                    this.gameLost();
                    clearInterval(loopConsume);
                    clearTimeout(loopEnder);
                }
            }, 1000)
            
            let loopEnder = setTimeout(() => {
                if (this.state === "loss") {
                    this.gameLost();
                } if (this.state === "win") {
                    this.gameWin();
                } else {
                    clearInterval(loopConsume);
                    const randNum = Math.floor(Math.random() * eventKeys.length);
                    console.log(randNum)
                    this.eventBegin(Events[eventKeys[randNum]]);  
                }
            }, 10000)
        }

        

    },

    eventBegin: function(event) {

        journeyStatus.textContent = event.journeyText
        createEvent(event);

        if (event.textOnly === false) {
            setTimeout(() => {
                createOptions(event.options)
            }, 3000);
        };

    },

    gameLost: function() {
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
    },

    gameWin: function() {
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
            
        }, ContinueControllerManager.getSignal());
        events.appendChild(gameOverDiv1);
        whichDiv += 1;
        setTimeout(() => {
            events.appendChild(continueDiv);
        }, 2000);
    }
}

Game.roundBegin();
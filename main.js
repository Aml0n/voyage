import { createOptions, createEvent, OptionControllerManager, ContinueControllerManager } from "./scripts/eventsManager.js";
import { Events } from "./scripts/events.js";
import { PlayerStats } from "./scripts/playerStats.js";
import { TravelDescriptions, aJourney } from "./scripts/splashText.js";
import { GameLossText, GameWinText } from "./scripts/gameOverText.js";

const events = document.querySelector('#events')
const eventList = [];
const journeyStatus = document.querySelector('#status')

const eventKeys = Object.keys(Events);

const gameOverDiv1 = document.createElement('div');
const gameOverDiv2 = document.createElement('div');
const gameOverDiv3 = document.createElement('div');

const gameOverDivs = [gameOverDiv1, gameOverDiv2, gameOverDiv3]
// * Initial testing code
// 

// const option1 = document.querySelector(".option1");
// const option2 = document.querySelector(".option2");
// const option3 = document.querySelector(".option3");

// option1.textContent = "Hello";


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
            journeyStatus.textContent = aJourney[Math.floor((Math.random() * aJourney.length))]
            journeyStatus.textContent += " [____________________]"

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
                journeyStatus.textContent = replaceFirstTwoChar(journeyStatus.textContent, "_", "#");

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
                    this.eventBegin(Events[eventKeys[randNum]]);  
                }
            }, 10000)
        }

        

    },

    eventBegin: function(evnt) {

        journeyStatus.textContent = evnt.journeyText
        createEvent(evnt);

        if (evnt.textOnly === false) {
            setTimeout(() => {
                createOptions(evnt.options)
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
// Game.eventBegin(Events.dehydratedMan);
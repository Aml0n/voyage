import { createOptions, createEvent, OptionControllerManager, ContinueControllerManager } from "./scripts/eventsManager.js";
import { Events } from "./scripts/events.js";
import { PlayerStats } from "./scripts/playerStats.js";
import { TravelDescriptions } from "./scripts/travelDescriptions.js";

const events = document.querySelector('#events')
const eventList = [];
const journeyStatus = document.querySelector('#status')

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
    roundBegin: function() {
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
        }, 1000)
        
        setTimeout(() => {
            clearInterval(loopConsume);
            this.eventBegin(Events.dehydratedMan);
        }, 10000)

    },

    eventBegin: function(evnt) {

        journeyStatus.textContent = evnt.journeyText
        createEvent(evnt);

        if (evnt.textOnly === false) {
            setTimeout(() => {
                createOptions(evnt.options)
            }, 3000);
        };

    }
}

Game.roundBegin();
// Game.eventBegin(Events.dehydratedMan);
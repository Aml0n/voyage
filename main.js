import { createOptions, createEvent, ControllerManager } from "./scripts/eventsManager.js";
import { Events } from "./scripts/events.js";
import { PlayerStats } from "./scripts/playerStats.js";

const events = document.querySelector('#events')
const eventList = [];

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

function eventBegin(evnt) {

    createEvent(evnt);

    if (evnt.textOnly === false) {
        setTimeout(() => {
            createOptions(evnt.options)
            setTimeout(() => {
                createContinueButton();
            }, 1000);
        }, 3000);
    } else {
        
        setTimeout(() => {
            createContinueButton();    
        }, 1000);
    };

    

};

eventBegin(Events.dehydratedMan);
import { PlayerStats } from "./playerStats.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Controller manager to handle reusable controllers
export const OptionControllerManager = {
    currentController: null,
    
    getController() {
        if (!this.currentController || this.currentController.signal.aborted) {
            this.currentController = new AbortController();
        }
        return this.currentController;
    },
    
    getSignal() {
        return this.getController().signal;
    },
    
    abort() {
        if (this.currentController) {
            this.currentController.abort();
        }
    },
    
    reset() {
        this.currentController = new AbortController();
        return this.currentController;
    }
};

export const ContinueControllerManager = {
    currentController: null,
    
    getController() {
        if (!this.currentController || this.currentController.signal.aborted) {
            this.currentController = new AbortController();
        }
        return this.currentController;
    },
    
    getSignal() {
        return this.getController().signal;
    },
    
    abort() {
        if (this.currentController) {
            this.currentController.abort();
        }
    },
    
    reset() {
        this.currentController = new AbortController();
        return this.currentController;
    }
};

async function createContinueButton(events) {

    // create the continue button + append it to the events div
    const continueDiv = document.createElement('div');
    continueDiv.classList.add('continue', 'player', 'clickable');
    continueDiv.textContent = "continue..."
    events.appendChild(continueDiv);

    // wait for the player to click the continue button
    await new Promise(resolve => {
        continueDiv.addEventListener('click', () => {
            events.replaceChildren(); // clear the events div
            ContinueControllerManager.abort();
            resolve();
        }, ContinueControllerManager.getSignal());
    });
}

function isOptionClickable(opt) {
    // Check if the option is clickable based on the player's current stats
    // if the stat goes negative, the option is not clickable
    let isClickable = true;
    if (opt.statusChanges.length > 0) {

        for (const change of opt.statusChanges) {
            const stat = change[0]; // select the name of the stat to be changed

            // change[1] is the value to be added to the stat.
            // if it is negative, it will be subtracted
            if ((PlayerStats[stat] + change[1]) < 0) {
                isClickable = false;
                break;
            }
        }
    }
    return isClickable;
}

export async function createOptions(options, events) {

    // create an options container to hold the options
    const optionsContainer = document.createElement("div");
    optionsContainer.classList.add('event', 'options', 'player');

    // create a div for each option and append it to the options container
    for (const option of options) {

        const optionElement = document.createElement('div');
        
        optionElement.textContent = option.text;

        const optionIndexClass = 'option' + (options.indexOf(option) + 1);
        optionElement.classList.add('option', optionIndexClass);

        optionsContainer.appendChild(optionElement);
    }

    events.appendChild(optionsContainer);

    // wait for the player to click an option
    await new Promise(resolve => {
        for (const option of options) {
            const optionIndexClass = 'option' + (options.indexOf(option) + 1);
            const optionElement = optionsContainer.querySelector(`.${optionIndexClass}`);

            // check if the option is clickable based on the player's current stats
            // if the stat goes negative, the option is not clickable   
            if (!isOptionClickable(option)) {
                optionElement.classList.add('unclickable');
            } else {
                optionElement.addEventListener('click', async () => {
                    await optionOnClick(optionElement, option, events);

                    // when the option is clicked, 
                    // resolve the promise to continue the game flow
                    resolve(); 
                }, OptionControllerManager.getSignal());
            }
        }
    });
}

async function optionOnClick(optionElement, option, events) {
    OptionControllerManager.abort();

    const optionParent = optionElement.parentNode;
    optionParent.remove();

    const playerDiv = document.createElement('div');
    playerDiv.textContent = optionElement.textContent + ".";
    playerDiv.classList.add('player', 'event');
    events.appendChild(playerDiv);

    const delay = 1500;

    await sleep(delay);

    const effect = option.effect;
    const effectDiv = document.createElement("div");
    effectDiv.textContent = typeof effect === "string" ? effect : JSON.stringify(effect);
    effectDiv.classList.add('event');
    events.appendChild(effectDiv);

    const statusChanges = option.statusChanges;

    if (statusChanges.length > 0) {

        await sleep(delay);

        const statDiv = document.createElement('div');
        statDiv.classList.add('statChange');
        
        for (let change of statusChanges) {
            const stat = change[0];
            const changeValue = change[1];
            
            let statNumChange;

            if (changeValue > 0) {
                statNumChange = `↑${changeValue}`;
            } else if (changeValue < 0) {
                statNumChange = `↓${Math.abs(changeValue)}`;
            } else {
                statNumChange = "0";
            }

            statDiv.textContent += `${stat} ${statNumChange}. `;
            
            PlayerStats[stat] += changeValue;
            PlayerStats.updateStats(stat);
            console.log(PlayerStats[stat])
            console.log(`PlayerStats.${stat} updated to ${PlayerStats[stat]}`);
        }


        effectDiv.appendChild(statDiv);
    }

    await sleep(delay);
    await createContinueButton(events);

}

export async function createEvent(event, events) {
    const tempEvent = document.createElement('div');
    tempEvent.classList.add('event');
    tempEvent.textContent = event.text;
    events.appendChild(tempEvent);

    if (event.statusChanges.length > 0) {
        await sleep(3000);

        const statusChangesDiv = document.createElement('div');
        statusChangesDiv.classList.add('statChange')
        
        for (let change of event.statusChanges) {
            const stat = change[0];
            const changeValue = change[1];
            
            let statNumChange;
            
            if (changeValue > 0) {
                statNumChange = `↑${changeValue}`;

            } else if (changeValue < 0) {
                statNumChange = `↓${Math.abs(changeValue)}`;

            } else {
                statNumChange = "0";

            }

            statusChangesDiv.textContent += `${stat} ${statNumChange}. `;
        }

        tempEvent.appendChild(statusChangesDiv);
        
        await sleep(1000);

        // TODO: recreate createContinueButton function to wait for the player to click the continue button
        // make it async
        await createContinueButton(events);
    };
}
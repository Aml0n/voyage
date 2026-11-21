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

export async function createContinueButton(events) {

    // create the continue button
    const continueDiv = document.createElement('div');
    continueDiv.classList.add('continue', 'player', 'clickable');
    continueDiv.textContent = "continue..."

    // assign the click event listener to the continue button
    ContinueControllerManager.getController();
    continueDiv.addEventListener('click', () => {
        
    }, ContinueControllerManager.getSignal());

    // append it to the events div
    events.appendChild(continueDiv);

    await new Promise(resolve => {
        continueDiv.addEventListener('click', () => {
            events.replaceChildren(); // clear the events div
            ContinueControllerManager.abort();
            resolve();
        }, ContinueControllerManager.getSignal());
    });
}

export async function createOptions(opts, events) {
    return new Promise(resolve => {
        OptionControllerManager.getController();

        const options = document.createElement("div");
        options.classList.add('event', 'options', 'player');

        for (const opt in opts) {

            let optClickable = true;

            if (opts[opt].statusChanges.length !== 0) {

                for (const change of opts[opt].statusChanges) {
                    const stat = change[0];

                    if ((PlayerStats[stat] + change[1]) < 0) {
                        optClickable = false;
                        break
                    }
                }
            }

            const tempOpt = document.createElement('div');

            const optionText = opts[opt].text;
            tempOpt.textContent = optionText;

            const optionSpecific = 'option' + (opt + 1);
            tempOpt.classList.add('option', optionSpecific);

            if (optClickable === false) {
                tempOpt.classList.add('unclickable');
            } else {
                tempOpt.addEventListener('click', () => {
                    resolve();
                    optionOnClick(tempOpt, opts[opt], events);
                }, OptionControllerManager.getSignal());
            }

            options.appendChild(tempOpt);
        }

        events.appendChild(options);
    });
}

export async function optionOnClick(opt, optData, events) {
    OptionControllerManager.abort();

    const optionParent = opt.parentNode;
    optionParent.remove();

    const delay = 1500;

    const playerDiv = document.createElement('div');
    playerDiv.textContent = opt.textContent + ".";
    playerDiv.classList.add('player', 'event');
    events.appendChild(playerDiv);

    await sleep(delay);

    const effect = optData.effect;
    const effectDiv = document.createElement("div");
    effectDiv.textContent = typeof effect === "string" ? effect : JSON.stringify(effect);
    effectDiv.classList.add('event');
    events.appendChild(effectDiv);

    const statusChanges = optData.statusChanges;

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
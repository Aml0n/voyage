import { PlayerStats } from "./playerStats.js";
import { Game } from "../main.js";

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

export function createContinueButton() {
    const continueDiv = document.createElement('div');
    continueDiv.classList.add('continue', 'player', 'clickable');
    continueDiv.textContent = "continue..."

    ContinueControllerManager.getController();
    continueDiv.addEventListener('click', () => {
        events.replaceChildren();
        ContinueControllerManager.abort();
        Game.roundBegin();
    }, ContinueControllerManager.getSignal());
    events.appendChild(continueDiv);
}

export function createOptions(opts) {

    OptionControllerManager.getController();

    const options = document.createElement("div");
    options.classList.add('event', 'options', 'player');

    let totalOptions = 0;   
    let totalUnclickables = 0;

    for (const opt in opts) {

        let optClickable = true;

        if (opts[opt].statusChanges.length !== 0) {

            for (const change of opts[opt].statusChanges) {
                const stat = change[0];
                
                // console.log(PlayerStats[stat] + change[1])

                if ((PlayerStats[stat] + change[1]) < 0) {
                    optClickable = false;
                    break
                }
            }
        }

        // console.log(optClickable);

        const tempOpt = document.createElement('div');

        const optionText = opts[opt].text;
        tempOpt.textContent = optionText;

        const optionSpecific = 'option' + (opt + 1);
        tempOpt.classList.add('option', optionSpecific);

        if (optClickable === false) {
            tempOpt.classList.add('unclickable');
            totalUnclickables += 1;
        } else {
            tempOpt.addEventListener('click', () => optionOnClick(tempOpt, opts[opt]), OptionControllerManager.getSignal());
        }

        options.appendChild(tempOpt);
        totalOptions += 1;
    }
    
    if (totalOptions === totalUnclickables) {
        const skip = document.createElement('div');
        skip.classList.add('option')
        options.appendChild(skip);
        skip.addEventListener('click', () => skipEvent(skip), OptionControllerManager.getSignal())
    }

    events.appendChild(options);
}

export function skipEvent(skip) {
    OptionControllerManager.abort();

    const optionParent = opt.parentNode;
    optionParent.remove();

    const delay = 1500;

    const playerDiv = document.createElement('div');
    playerDiv.textContent = opt.textContent + ".";
    playerDiv.classList.add('player', 'event');
    events.appendChild(playerDiv);

    const effectDiv = document.createElement('div');
    effectDiv.textContent = "you somehow skip this interaction because jersev is a lazy dev and needs to do homework. :)"
    effectDiv.classList.add('event');

    setTimeout(() => {
        events.appendChild(effectDiv);

        setTimeout(() => {
            createContinueButton();
        }, delay);  

    }, delay); 
}

export function optionOnClick(opt, optData) {
    // "opt" is an HTMLDivElement!
    // optData is a class!

    // const optionElements = opt.parentNode.children;
    OptionControllerManager.abort();
    
    // console.log("this should only print once!")

    const optionParent = opt.parentNode;
    optionParent.remove();

    const delay = 1500;

    const playerDiv = document.createElement('div');
    playerDiv.textContent = opt.textContent + ".";
    playerDiv.classList.add('player', 'event');
    events.appendChild(playerDiv);

    setTimeout(() => {

        const effect = optData.effect;
        const effectDiv = document.createElement("div");
        effectDiv.textContent = typeof effect === "string" ? effect : JSON.stringify(effect);
        effectDiv.classList.add('event');
        events.appendChild(effectDiv);

        const statusChanges = optData.statusChanges;

        if (statusChanges.length > 0) {

            setTimeout(() => {

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
                    // console.log(PlayerStats[stat])
                }


                effectDiv.appendChild(statDiv);

                setTimeout(() => {
                    createContinueButton();
                }, delay);

            }, delay);
        } else {
            setTimeout(() => {
                createContinueButton();
            }, delay);
        }

    }, delay);
}

export function createEvent(event) {
    const tempEvent = document.createElement('div');
    tempEvent.classList.add('event');
    tempEvent.textContent = event.text;
    events.appendChild(tempEvent);

    if (event.statusChanges.length > 0) {
        setTimeout(() => {
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

                PlayerStats[stat] += changeValue;
                PlayerStats.updateStats(stat);
            }

            tempEvent.appendChild(statusChangesDiv);
            
            setTimeout(() => {
                createContinueButton();
            }, 1000);

        }, 3000);
    };
}
import { PlayerStats } from "./playerStats.js";

// Controller manager to handle reusable controllers
export const ControllerManager = {
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

export function createOptions(opts) {

    ControllerManager.getController();

    const options = document.createElement("div");
    options.classList.add('event', 'options', 'player');

    for (const opt in opts) {

        let optClickable = true;

        if (opts[opt].statusChanges.length !== 0) {

            for (const change of opts[opt].statusChanges) {
                const stat = change[0];
                
                console.log(PlayerStats[stat] + change[1])

                if ((PlayerStats[stat] + change[1]) < 0) {
                    optClickable = false;
                    break
                }
            }
        }

        console.log(optClickable);

        const tempOpt = document.createElement('div');

        const optionText = opts[opt].text;
        tempOpt.textContent = optionText;

        const optionSpecific = 'option' + (opt + 1);
        tempOpt.classList.add('option', optionSpecific);

        if (optClickable === false) {
            tempOpt.classList.add('unclickable');
        } else {
            tempOpt.addEventListener('click', () => optionOnClick(tempOpt, opts[opt]), ControllerManager.getSignal());
        }

        options.appendChild(tempOpt);
    }
    
    events.appendChild(options);

}

export function optionOnClick(opt, optData) {
    // "opt" is an HTMLDivElement!
    // optData is a class!

    // const optionElements = opt.parentNode.children;
    ControllerManager.abort();
    
    // console.log("this should only print once!")

    const optionParent = opt.parentNode;
    optionParent.remove();

    const playerDiv = document.createElement('div');
    playerDiv.textContent = opt.textContent + ".";
    playerDiv.classList.add('player', 'event');
    events.appendChild(playerDiv);

    const effect = optData.effect;

    const effectDiv = document.createElement("div");
    effectDiv.textContent = typeof effect === "string" ? effect : JSON.stringify(effect);
    // console.log(effect);
    effectDiv.classList.add('event');
    events.appendChild(effectDiv);

    const statusChanges = optData.statusChanges

    if (statusChanges.length === 0) {
        return;

    }

    const statDiv = document.createElement('div');
    statDiv.classList.add('statChange')
    
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
    }
    // console.log(statDiv.textContent);


    effectDiv.appendChild(statDiv);

    // TODO: make things appear one-after-another
}

export function createEvent(eventText) {
    const tempEvent = document.createElement('div');
    tempEvent.classList.add('event');
    tempEvent.textContent = eventText;
    events.appendChild(tempEvent);
}
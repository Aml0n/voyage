import { PlayerStats } from "./playerStats.js";
import { ContinueControllerManager } from "./continueControllerManager.js";
import { OptionControllerManager } from "./optionControllerManager.js";

export class EventsManager {
    static continueControllerManager = new ContinueControllerManager();
    static optionControllerManager = new OptionControllerManager();

    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static async createContinueButton(events) {
        const continueDiv = document.createElement('div');
        continueDiv.classList.add('continue', 'player', 'clickable');
        continueDiv.textContent = "continue..."
        events.appendChild(continueDiv);

        await new Promise(resolve => {
            continueDiv.addEventListener('click', () => {
                events.replaceChildren();
                this.continueControllerManager.abort();
                resolve();
            }, this.continueControllerManager.getSignal());
        });
    }

    static #isOptionClickable(opt) {
        let isClickable = true;
        if (opt.statusChanges.length > 0) {

            for (const change of opt.statusChanges) {
                const stat = change[0];

                if ((PlayerStats[stat] + change[1]) < 0) {
                    isClickable = false;
                    break;
                }
            }
        }
        return isClickable;
    }

    static async createOptions(options, events) {
        const optionsContainer = document.createElement("div");
        optionsContainer.classList.add('event', 'options', 'player');

        for (const option of options) {
            const optionElement = document.createElement('div');
            optionElement.textContent = option.text;

            const optionIndexClass = 'option' + (options.indexOf(option) + 1);
            optionElement.classList.add('option', optionIndexClass);

            optionsContainer.appendChild(optionElement);
        }

        events.appendChild(optionsContainer);

        await new Promise(resolve => {
            for (const option of options) {
                const optionIndexClass = 'option' + (options.indexOf(option) + 1);
                const optionElement = optionsContainer.querySelector(`.${optionIndexClass}`);

                if (!this.#isOptionClickable(option)) {
                    optionElement.classList.add('unclickable');
                } else {
                    optionElement.addEventListener('click', async () => {
                        await this.optionOnClick(optionElement, option, events);
                        resolve();
                    }, this.optionControllerManager.getSignal());
                }
            }
        });
    }

    static async optionOnClick(optionElement, option, events) {
        this.optionControllerManager.abort();

        const optionParent = optionElement.parentNode;
        optionParent.remove();

        const playerDiv = document.createElement('div');
        playerDiv.textContent = optionElement.textContent + ".";
        playerDiv.classList.add('player', 'event');
        events.appendChild(playerDiv);

        const delay = 1500;

        await this.sleep(delay);

        const effect = option.effect;
        const effectDiv = document.createElement("div");
        effectDiv.textContent = typeof effect === "string" ? effect : JSON.stringify(effect);
        effectDiv.classList.add('event');
        events.appendChild(effectDiv);

        const statusChanges = option.statusChanges;

        if (statusChanges.length > 0) {
            await this.sleep(delay);

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
                console.log(PlayerStats[stat]);
                console.log(`PlayerStats.${stat} updated to ${PlayerStats[stat]}`);
            }

            effectDiv.appendChild(statDiv);
        }

        await this.sleep(delay);
        await this.createContinueButton(events);
    }

    static async createEvent(event, events) {
        const tempEvent = document.createElement('div');
        tempEvent.classList.add('event');
        tempEvent.textContent = event.text;
        events.appendChild(tempEvent);

        if (event.statusChanges.length > 0) {
            await this.sleep(3000);

            const statusChangesDiv = document.createElement('div');
            statusChangesDiv.classList.add('statChange');

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

            await this.sleep(1000);
            await this.createContinueButton(events);
        };
    }
}
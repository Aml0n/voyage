import { PlayerStats } from "./playerStats.js";
import { ContinueControllerManager } from "./continueControllerManager.js";
import { OptionControllerManager } from "./optionControllerManager.js";

export class EventsManager {
    static continueControllerManager = new ContinueControllerManager();
    static optionControllerManager = new OptionControllerManager();

    static sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    static async createContinueButton(events) {
        const continueDiv = document.createElement("div");
        continueDiv.classList.add("continue", "player", "clickable");
        continueDiv.textContent = "continue...";
        events.appendChild(continueDiv);

        await new Promise((resolve) => {
            continueDiv.addEventListener(
                "click",
                () => {
                    events.replaceChildren();
                    this.continueControllerManager.abort();
                    resolve();
                },
                this.continueControllerManager.getSignal(),
            );
        });
    }

    static #isOptionClickable(option) {
        let isClickable = true;
        if (option.statusChanges.length > 0) {
            for (const change of option.statusChanges) {
                const stat = change[0];

                if (PlayerStats[stat] + change[1] < 0) {
                    isClickable = false;
                    break;
                }
            }
        }
        return isClickable;
    }

    static async createOptions(options, events) {

        console.log("creating options...");

        const optionsContainer = document.createElement("div");
        optionsContainer.classList.add("event", "options", "player");

        let totalUnavailable = 0;
        for (const option of options) {
            if (this.#isOptionClickable(option) === false)
                totalUnavailable += 1;
        }


        // TODO: refactor to use less tabs
        await new Promise((resolve) => {

            console.log("inside promise for creating options...");

            if (totalUnavailable === options.length) {
                const skipButton = document.createElement("div");
                skipButton.textContent =
                    "skip this event (no options available)";
                skipButton.classList.add("option");
                optionsContainer.appendChild(skipButton);

                skipButton.addEventListener(
                    "click",
                    async () => {
                        await this.skipEvent(skipButton, events);
                        this.optionControllerManager.abort();
                        resolve();
                    },
                    this.optionControllerManager.getSignal(),
                );
            } else {
                for (const option of options) {
                    const optionDiv = document.createElement("div");
                    optionDiv.textContent = option.text;
                    optionDiv.classList.add("option", "option" + (options.indexOf(option) + 1));
                    optionsContainer.appendChild(optionDiv);

                    if (!this.#isOptionClickable(option)) {
                        optionDiv.classList.add("unclickable");
                    } else {
                        optionDiv.addEventListener(
                            "click",
                            async () => {
                                await this.optionOnClick(
                                    optionDiv,
                                    option,
                                    events,
                                );
                                resolve();
                            },
                            this.optionControllerManager.getSignal(),
                        );
                    }
                }
            }

            events.appendChild(optionsContainer);
        });
    }

    static async skipEvent(skipButton, eventsContainer) {
        OptionControllerManager.abort();

        const optionsParentContainer = skipButton.parentNode;
        optionsParentContainer.remove();

        const delay = 1500;

        const playerDiv = document.createElement("div");
        playerDiv.textContent = skipButton.textContent + ".";
        playerDiv.classList.add("player", "event");
        eventsContainer.appendChild(playerDiv);

        const effectDiv = document.createElement("div");
        effectDiv.textContent =
            "you somehow skip this interaction because jersev is a lazy dev and needs to do homework. :)";
        effectDiv.classList.add("event");

        setTimeout(() => {
            eventsContainer.appendChild(effectDiv);

            setTimeout(() => {
                this.createContinueButton(eventsContainer);
            }, delay);
        }, delay);
    }

    static async optionOnClick(optionElement, option, events) {
        this.optionControllerManager.abort();

        const optionParent = optionElement.parentNode;
        optionParent.remove();

        const playerDiv = document.createElement("div");
        playerDiv.textContent = optionElement.textContent + ".";
        playerDiv.classList.add("player", "event");
        events.appendChild(playerDiv);

        const delay = 1500;

        await this.sleep(delay);

        const effect = option.effect;
        const effectDiv = document.createElement("div");
        effectDiv.textContent =
            typeof effect === "string" ? effect : JSON.stringify(effect);
        effectDiv.classList.add("event");
        events.appendChild(effectDiv);

        const statusChanges = option.statusChanges;

        if (statusChanges.length > 0) {
            await this.sleep(delay);

            const statDiv = document.createElement("div");
            statDiv.classList.add("statChange");

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
                console.log(
                    `PlayerStats.${stat} updated to ${PlayerStats[stat]}`,
                );
            }

            effectDiv.appendChild(statDiv);
        }

        await this.sleep(delay);
        await this.createContinueButton(events);
    }

    static async createEvent(event, eventsContainer) {
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        eventDiv.textContent = event.text;
        eventsContainer.appendChild(eventDiv);

        if (event.statusChanges.length > 0) {
            await this.sleep(3000);

            const statusChangesDiv = document.createElement("div");
            statusChangesDiv.classList.add("statChange");

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
            eventDiv.appendChild(statusChangesDiv);
        }

        await this.sleep(3000);

        if (!event.textOnly) {
            await this.createOptions(event.options, eventsContainer);
        } else {
            await this.createContinueButton(eventsContainer);
        }
    }
}

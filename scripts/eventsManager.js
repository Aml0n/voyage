import { PlayerStats } from "./playerStats.js";

export function createOptions(opts) {

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

        let tempOpt = document.createElement('div');

        const optionText = opts[opt].text;
        tempOpt.textContent = optionText;

        let optionSpecific = 'option' + (opt + 1);
        tempOpt.classList.add('option', optionSpecific);

        if (optClickable === false) {
            tempOpt.classList.add('unclickable');
        } else {
            tempOpt.addEventListener('click', () => optionOnClick(opt));
        }

        options.appendChild(tempOpt);
    }
    
    events.appendChild(options);

}

export function createEvent(eventText) {
    const tempEvent = document.createElement('div');
    tempEvent.classList.add('event');
    tempEvent.textContent = eventText;
    events.appendChild(tempEvent);
}
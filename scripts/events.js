export function createOptions(opts) {

    const options = document.createElement("div");
    options.classList.add('event', 'options', 'player');

    for (const opt in opts) {
        let tempOpt = document.createElement('div');
        tempOpt.textContent = opts[opt];
        let optionSpecific = 'option' + (opt + 1);
        tempOpt.classList.add('option', optionSpecific);
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
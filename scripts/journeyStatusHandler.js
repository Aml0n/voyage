export default class JourneyStatusHandler {
    static initializeJourneyStatus(div) {
        const rand = Math.floor((Math.random() * aJourney.length));
        div.textContent = aJourney[rand] + " [____________________]";
    }

    static updateJourneyStatus(div) {
        const currentText = div.textContent;
        const progressIndex = currentText.indexOf("[");
        const progress = currentText.substring(progressIndex + 1, currentText.length - 1);
        let newProgress = progress;
        for (let i = 0; i < 2; i++) {
            newProgress = newProgress.replace("_", "#");
        }
        div.textContent = currentText.substring(0, progressIndex + 1) + newProgress + "]";
    }

    static createTravelDescription() {
        const element = document.createElement('div');
        element.classList.add('event');
        const randNum = Math.floor((Math.random() * TravelDescriptions.length));
        element.textContent = TravelDescriptions[randNum];
        return element;
    }
}

const TravelDescriptions = [
    "the sound of tumbling wheels accompanies you.",
    "step by step. camel toe to camel toe.",
    "you look up. gaze at the vast nothing.",
    "the sun beats down like an aggressive hug.",
    "nothing much else.",
    `a song in your head. "it's aloha friday..." what could it mean?`,
    "no work 'till monday.",
    "you see tents. animals grazing. or do you?",
    "large mountain ranges reach for the sky."
]

const aJourney = [
    "a dusty journey.",
    "a lonely jouney.",
    "a long journey.",
    "a perilous journey.",
    "an unlikely journey.",
    "a patient voyage.",
    "a sandy voyage.",
    "a dusty voyage.",
    "a quiet voyage.",
    "a barren journey.",
]
import { createOptions } from "./scripts/events.js";

const events = document.querySelector('#events')


// * Initial testing code
// 

// const option1 = document.querySelector(".option1");
// const option2 = document.querySelector(".option2");
// const option3 = document.querySelector(".option3");

// option1.textContent = "Hello";


let templateOptions = [
    'take his coins',
    'give him water',
    'ignore him',
    'skibidi rizz ohio gyatt'
]

createOptions(templateOptions);
export const Events = {
    
    dehydratedMan: {
        journeyText: "a stranded man.",
        text: "you see a man on the side of the road. his caravan is on its side and without a horse. he doesn't look so good.",
        // Indicates if this event should display only text without options
        textOnly: false,
        options: [
            {
                text: "take his coins",
                effect: "he watches as you step off your caravan and rummage through his. you walk back and depart, a small fortune to be found.",
                statusChanges: [
                    ["coins", 25]
                ]
            },
            {
                text: 'give him water',
                effect: "you rummage through your caravan and find a small container of water. the man, now with a smile on his face, greets you in a different language as he pulls out an abundance of coins from his pockets.",
                statusChanges: [
                    ["coins", 75],
                    ["water", -8]
                ]
            },
            {
                text: 'ignore him',
                effect: "you continue on your way. after a quiet period of time, you look behind you. just a dot in the distance.",
                statusChanges: [] // No changes
            }   
        ],
        statusChanges: []
    },

    droppedWater: {
        journeyText: "a mild loss.",
        text: "you slowly take a small sip of water. the bumpy journey swipes your canteen and throws it overboard.",
        textOnly: true,
        options: [],
        statusChanges: [
            ["water", -10]
        ]

    },

    caravanShop: {
        journeyText: "a fellow seller.",
        text: "you see another caravan approaching driven by someone with a smile on his face. he speaks your language. offers goods for coins.",
        textOnly: false,
        options: [
            {
                text: 'trade coins (50) for silk goods (2)',
                effect: 'he searches through his caravan and pulls out two silk robes. he extends out his hand and you fill it with coins.',
                statusChanges: [
                    ['coins', -50],
                    ['silk', 2]
                ]
            },
            {
                text: 'trade coins (35) for two (2) handcrafted ceramic pots',
                effect: "he rummages through his belongings and pulls out two handcrafted pots. you hand him the money before he departs. some kilometers later, you notice one is majorly chipped.",
                statusChanges: [
                    ['coins', -35],
                    ['ceramics', 1]
                ]
            },
            {
                text: 'decline',
                effect: "you silently drive off with haste. some kilometers later, you find that your caravan is lighter than usual.",
                statusChanges: [
                    ['ceramics', -1]
                ]
            }
        ],
        statusChanges: []
    },

    caravansarai: {
        journeyText: "a send-off gift.",
        text: "after a restless night in the caravanserai, you pack up your belongings. a young child approaches your caravan. she says nothing.",
        textOnly: false,
        options: [
            {
                text: 'offer her some coins',
                effect: 'you search your caravan for some loose change and hold them out to her. she quietly takes some and runs off.',
                statusChanges: [
                    ['coins', -(Math.floor(Math.random() * 10))]
                ]
            },
            {
                text: 'give her some silk (1)',
                effect: 'you pull out a silk dress from your caravan and carefully place it in her hands. she smiles and hands you some coins before running off.',
                statusChanges: [
                    ['coins', Math.floor(Math.random() * 15)],
                    ['silk', -1]
                ]
            },
            {
                text: 'ignore her',
                effect: 'you hop onto your camel but the young girl tugs on your clothing. she points at a ceramic pot and looks at you. you ride off with one less ceramic pot.',
                statusChanges: [
                    ['ceramics', -1]
                ]
            }
        ],
        statusChanges: []
    },

    
}
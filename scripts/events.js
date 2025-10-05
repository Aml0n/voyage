export const Events = {
    
    dehydratedMan: {
        text: "you see a man on the side of the road. his caravan is on its side and without a horse. he doesn't look good.",
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
        text: "you slowly take a small sip of water. the bumpy journey swipes your canteen and throws it overboard.",
        textOnly: true,
        options: [],
        statusChanges: [
            ["water", -10]
        ]

    }
}
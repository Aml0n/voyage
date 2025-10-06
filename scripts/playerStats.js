export const PlayerStats = {
    days: 0,
    health: 100,
    km: 0,
    coins: 75,
    speed: 10.0,
    water: 100,
    food: 100,
    ceramics: 0,
    paper: 0,
    silk: 0,
    weight: 0,

    // TODO: make method for changing stats
    // input: statusChanges array

    statDays: document.querySelector('div.stat.days .statNum'),
    statHealth: document.querySelector('div.stat.health .statNum'),
    statKm: document.querySelector('div.stat.km .statNum'),
    statCoins: document.querySelector('div.stat.coins .statNum'),
    statSpeed: document.querySelector('div.stat.speed .statNum'),
    statWater: document.querySelector('div.stat.water .statNum'),
    statFood: document.querySelector('div.stat.food .statNum'),
    statCeramics: document.querySelector('div.stat.ceramics .statNum'),
    statPaper: document.querySelector('div.stat.paper .statNum'),
    statSilk: document.querySelector('div.stat.silk .statNum'),
    statWeight: document.querySelector('div.stat.weight .statNum'),

    updateStats: function(stats) {
        // stats can be:
        //      an array containing strings of the stats of interest
        //      or a string of just one stat

        if (typeof(stats) === 'string') {
            const statNum = document.querySelector(`div.stat.${stats} .statNum`)
            if (statNum) {
                statNum.textContent = this[stats];
            }
            // console.log("goodbye!")

        } else if (Array.isArray(stats)) {
            let statNum;
            for (let stat of stats) {
                statNum = document.querySelector(`div.stat.${stat} .statNum`)
                // console.log('hello')
                if (statNum) {
                    statNum.textContent = this[stat]
                }
            }
        }
    }
}
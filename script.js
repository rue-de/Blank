// =========================
// TOWER REBORN V0.3 PART 1
// =========================

const races = {
    Human: {
        hp: 100,
        attack: 10,
        description: "Adaptable and balanced."
    },
    HighElf: {
        hp: 85,
        attack: 12,
        description: "Gifted with magic."
    },
    DarkElf: {
        hp: 90,
        attack: 11,
        description: "Deadly and cunning."
    },
    Dwarf: {
        hp: 120,
        attack: 8,
        description: "Extremely durable."
    },
    Orc: {
        hp: 130,
        attack: 9,
        description: "Savage warrior."
    },
    Beastkin: {
        hp: 105,
        attack: 11,
        description: "Agile hunter."
    },
    Demon: {
        hp: 115,
        attack: 12,
        description: "Born for destruction."
    },
    Angel: {
        hp: 100,
        attack: 10,
        description: "Blessed by light."
    },
    Dragonkin: {
        hp: 140,
        attack: 13,
        description: "Descendants of dragons."
    },
    Vampire: {
        hp: 95,
        attack: 12,
        description: "Feeds on life force."
    }
};

const talents = {
    Warrior: {
        attack: 3,
        hp: 10
    },
    Mage: {
        attack: 2,
        hp: 0
    },
    Hunter: {
        attack: 2,
        hp: 5
    },
    Berserker: {
        attack: 5,
        hp: -10
    },
    Alchemist: {
        attack: 1,
        hp: 10
    },
    Blacksmith: {
        attack: 2,
        hp: 15
    },
    Noble: {
        attack: 0,
        hp: 20
    },
    Survivor: {
        attack: 0,
        hp: 25
    },
    Prodigy: {
        attack: 4,
        hp: 0
    },
    Lucky: {
        attack: 1,
        hp: 5
    }
};

let player = {};
let enemy = null;

// =========================
// SAVE SYSTEM
// =========================

function saveGame() {
    localStorage.setItem(
        "towerRebornSave",
        JSON.stringify(player)
    );
}

function deleteSave() {
    localStorage.removeItem(
        "towerRebornSave"
    );
}

// =========================
// LOAD GAME
// =========================

function loadGame() {

    let save =
        localStorage.getItem(
            "towerRebornSave"
        );

    if (!save) {
        startCharacterCreation();
        return;
    }

    player = JSON.parse(save);

    showStats();

    document.getElementById("game").innerHTML = `
        <h2>Saved Run Found</h2>

        <p>
        Level ${player.level}
        ${player.race}
        </p>

        <button onclick="continueRun()">
        Continue Run
        </button>

        <button onclick="newGame()">
        New Game
        </button>
    `;
}

// =========================
// NEW GAME
// =========================

function newGame() {
    deleteSave();
    location.reload();
}

function spawnEnemy() {

    let bossFloor =
        player.floor % 5 === 0;

    if (bossFloor) {

        enemy = {
            name: "Floor Boss",
            hp: 60 + player.floor * 10,
            attack: 8 + player.floor,
            exp: 20 + player.floor,
            gold: 15 + player.floor
        };

    } else {

        const enemyList = [
            "Goblin",
            "Wolf",
            "Bandit",
            "Slime",
            "Skeleton",
            "Spider"
        ];

        let name =
            enemyList[
                Math.floor(
                    Math.random() *
                    enemyList.length
                )
            ];

        enemy = {
            name: name,
            hp: 20 + player.floor * 5,
            attack: 2 + player.floor,
            exp: 5 + player.floor,
            gold: 3 + player.floor
        };
    }

    document.getElementById(
        "game"
    ).innerHTML = `
        <h2>
        Floor ${player.floor}
        </h2>

        <h3>
        ${enemy.name}
        </h3>

        HP:
        <span id="enemyHp">
        ${enemy.hp}
        </span>

        <br><br>

        <button onclick="attackEnemy()">
        Attack
        </button>
    `;
}

// =========================
// CHARACTER CREATION
// =========================

function startCharacterCreation() {

    let html =
        "<h2>Select Race</h2>";

    for (let race in races) {

        html += `
        <button onclick="chooseRace('${race}')">
        ${race}
        </button>
        `;
    }

    document.getElementById(
        "game"
    ).innerHTML = html;
}

function chooseRace(race) {

    player.race = race;

    let html =
        "<h2>Select Talent</h2>";

    for (let talent in talents) {

        html += `
        <button onclick="chooseTalent('${talent}')">
        ${talent}
        </button>
        `;
    }

    document.getElementById(
        "game"
    ).innerHTML = html;
}

function chooseTalent(talent) {

    player.name = "Climber";

    player.race = player.race;
    player.talent = talent;

    player.level = 1;
    player.exp = 0;
    player.expToNext = 25;

    player.gold = 0;
    player.floor = 1;

    player.maxHp =
        races[player.race].hp +
        talents[talent].hp;

    player.hp =
        player.maxHp;

    player.attack =
        races[player.race].attack +
        talents[talent].attack;

    player.inventory = [
        {
            name: "Small Healing Potion",
            type: "heal",
            value: 25
        }
    ];

    saveGame();

    showStats();

    document.getElementById(
        "game"
    ).innerHTML = `
        <h2>Character Created</h2>

        Race:
        ${player.race}

        <br>

        Talent:
        ${player.talent}

        <br><br>

        <button onclick="spawnEnemy()">
        Enter Tower
        </button>
    `;
}

// =========================
// XP SYSTEM
// =========================

function gainExp(amount) {

    player.exp += amount;

    while (
        player.exp >=
        player.expToNext
    ) {

        player.exp -=
            player.expToNext;

        player.level++;

        player.expToNext =
            Math.floor(
                player.expToNext * 1.4
            );

        player.maxHp += 10;
        player.attack += 2;

        player.hp =
            player.maxHp;

        alert(
            "Level Up! Level " +
            player.level
        );
    }

    saveGame();
}

// =========================
// UI
// =========================

function showStats() {

    if (!player.level) return;

    document.getElementById(
        "stats"
    ).innerHTML = `
        <b>${player.name}</b><br>

        Race:
        ${player.race}<br>

        Talent:
        ${player.talent}<br>

        Level:
        ${player.level}<br>

        EXP:
        ${player.exp}/${player.expToNext}<br>

        HP:
        ${player.hp}/${player.maxHp}<br>

        Attack:
        ${player.attack}<br>

        Floor:
        ${player.floor}<br>

        Gold:
        ${player.gold}<br>

        <button onclick="showInventory()">
        Inventory
        </button>
    `;
}

function showInventory() {

    let html =
        "<h2>Inventory</h2>";

    if (
        player.inventory.length === 0
    ) {
        html +=
            "Inventory Empty";
    }

    player.inventory.forEach(
        (item, index) => {

            html += `
            <div>

            ${item.name}

            <button
            onclick="useItem(${index})">
            Use
            </button>

            </div>
            `;
        }
    );

    html += `
    <br>
    <button onclick="spawnEnemy()">
    Back
    </button>
    `;

    document.getElementById(
        "game"
    ).innerHTML = html;
}

function useItem(index) {

    let item =
        player.inventory[index];

    if (
        item.type === "heal"
    ) {

        player.hp += item.value;

        if (
            player.hp >
            player.maxHp
        ) {
            player.hp =
                player.maxHp;
        }

        player.inventory.splice(
            index,
            1
        );

        saveGame();
        showStats();
        showInventory();
    }
}

// =========================
// TEMP PLACEHOLDER
// PART 2 WILL REPLACE THIS
// =========================

function spawnEnemy() {

    document.getElementById(
        "game"
    ).innerHTML = `
        <h2>Version 0.3 Loaded</h2>

        <p>
        Part 1 installed successfully.
        </p>

        <p>
        Next we will add:
        </p>

        <ul>
        <li>Combat</li>
        <li>Enemies</li>
        <li>Bosses</li>
        <li>Loot</li>
        </ul>
    `;
}

loadGame();

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
const itemDatabase = {

    rustySword: {
        name: "Rusty Sword",
        rarity: "Common",
        slot: "weapon",
        attack: 2,
        hp: 0
    },

    ironSword: {
        name: "Iron Sword",
        rarity: "Uncommon",
        slot: "weapon",
        attack: 4,
        hp: 0
    },

    leatherArmor: {
        name: "Leather Armor",
        rarity: "Common",
        slot: "chest",
        attack: 0,
        hp: 15
    },

    silverRing: {
        name: "Silver Ring",
        rarity: "Rare",
        slot: "ring",
        attack: 1,
        hp: ironSword: {
    name: "Iron Sword",
    rarity: "Uncommon",
    slot: "weapon",
    attack: 4,
    hp: 0
},

knightArmor: {
    name: "Knight Armor",
    rarity: "Rare",
    slot: "chest",
    attack: 0,
    hp: 30
},
        
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

function continueRun() {
    spawnEnemy();
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

player.equipment = {
    weapon: null,
    helmet: null,
    chest: null,
    gloves: null,
    boots: null,
    ring: null,
    necklace: null
};

player.knowledge = {
    enemies: [],
    bosses: [],
    items: []
};

player.hiddenSkills = [];

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

        Race: ${player.race}<br>

        Talent: ${player.talent}<br>

        Level: ${player.level}<br>

        EXP: ${player.exp}/${player.expToNext}<br>

        HP: ${player.hp}/${player.maxHp}<br>

        Attack: ${player.attack}<br>

        Floor: ${player.floor}<br>

        Gold: ${player.gold}<br>

        <button onclick="showInventory()">
        Inventory
        </button>

        <button onclick="showEquipment()">
        Equipment
        </button>
        <button onclick="showKnowledge()">
Knowledge
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

            let rarity =
                item.rarity
                ? `[${item.rarity}] `
                : "";

            html += `
            <div>

            ${rarity}${item.name}

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
function showEquipment() {

    let e = player.equipment;

    document.getElementById(
        "game"
    ).innerHTML = `

    <h2>Equipment</h2>

    Weapon:
    ${e.weapon ? e.weapon.name : "None"}

    <br>

    Helmet:
    ${e.helmet ? e.helmet.name : "None"}

    <br>

    Chest:
    ${e.chest ? e.chest.name : "None"}

    <br>

    Gloves:
    ${e.gloves ? e.gloves.name : "None"}

    <br>

    Boots:
    ${e.boots ? e.boots.name : "None"}

    <br>

    Ring:
    ${e.ring ? e.ring.name : "None"}

    <br>

    Necklace:
    ${e.necklace ? e.necklace.name : "None"}

    <br><br>

    <button onclick="spawnEnemy()">
    Back
    </button>

    `;
}
function showKnowledge(){

    document.getElementById(
        "game"
    ).innerHTML = `

        <h2>Book of Knowledge</h2>

        Enemies Discovered:
        <br>

        ${player.knowledge.enemies.join("<br>")}

        <br><br>

        <button onclick="spawnEnemy()">
        Back
        </button>
    `;
}
function useItem(index) {

    let item =
        player.inventory[index];

    if(item.type === "heal"){

        player.hp += item.value;

        if(player.hp > player.maxHp){
            player.hp = player.maxHp;
        }

        player.inventory.splice(index,1);

    } else if(item.slot){

        equipItem(index);

        return;
    }

    saveGame();

    showStats();

    showInventory();
}
function equipItem(index){

    let item =
        player.inventory[index];

    let slot =
        item.slot;

    if(player.equipment[slot]){

        let oldItem =
            player.equipment[slot];

        player.attack -=
            oldItem.attack || 0;

        player.maxHp -=
            oldItem.hp || 0;

        player.inventory.push(
            oldItem
        );
    }

    player.attack +=
        item.attack || 0;

    player.maxHp +=
        item.hp || 0;

    player.equipment[slot] =
        item;

    player.inventory.splice(
        index,
        1
    );

    if(player.hp > player.maxHp){
        player.hp = player.maxHp;
    }

    saveGame();

    showStats();

    showEquipment();
}
// =========================
// TEMP PLACEHOLDER
// PART 2 WILL REPLACE THIS
// =========================

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
if(
    !player.knowledge.enemies.includes(
        enemy.name
    )
){
    player.knowledge.enemies.push(
        enemy.name
    );
}
function attackEnemy() {

    enemy.hp -= player.attack;

    if (enemy.hp <= 0) {

        winBattle();
        return;
    }

    player.hp -= enemy.attack;

    if (player.hp <= 0) {

        player.hp = 0;

        deleteSave();

        document.getElementById(
            "stats"
        ).innerHTML = "";

        document.getElementById(
            "game"
        ).innerHTML = `
            <h1>
            You Died
            </h1>

            Floor Reached:
            ${player.floor}

            <br><br>

            Level:
            ${player.level}

            <br><br>

            Gold:
            ${player.gold}

            <br><br>

            <button onclick="location.reload()">
            New Run
            </button>
        `;

        return;
    }

    saveGame();
    showStats();

    document.getElementById(
        "enemyHp"
    ).innerText =
        enemy.hp;
}

function winBattle() {

    player.gold += enemy.gold;

    gainExp(enemy.exp);

    if (
        Math.random() < 0.30
    ) {

        player.inventory.push({
            name:
            "Small Healing Potion",
            type: "heal",
            value: 25
        });
    }
if(Math.random() < 0.15){

    player.inventory.push(
        structuredClone(
            itemDatabase.rustySword
        )
    );
}

if(Math.random() < 0.10){

    player.inventory.push(
        structuredClone(
            itemDatabase.leatherArmor
        )
    );
}
    if(Math.random() < 0.05){

    player.inventory.push(
        JSON.parse(
            JSON.stringify(
                itemDatabase.ironSword
            )
        )
    );
}

if(Math.random() < 0.02){

    player.inventory.push(
        JSON.parse(
            JSON.stringify(
                itemDatabase.knightArmor
            )
        )
    );
}

if(Math.random() < 0.01){

    player.inventory.push(
        JSON.parse(
            JSON.stringify(
                itemDatabase.silverRing
            )
        )
    );
}
    player.floor++;

    saveGame();

    showStats();

    if (
        (player.floor - 1) % 5 === 0
    ) {

        player.hp =
            player.maxHp;

        document.getElementById(
            "game"
        ).innerHTML = `
            <h2>
            Safe Room
            </h2>

            <p>
            Boss defeated.
            </p>

            <p>
            HP fully restored.
            </p>

            <button onclick="spawnEnemy()">
            Continue
            </button>
        `;

        return;
    }

    document.getElementById(
        "game"
    ).innerHTML = `
        <h2>
        Victory
        </h2>

        EXP:
        +${enemy.exp}

        <br>

        Gold:
        +${enemy.gold}

        <br><br>

        <button onclick="spawnEnemy()">
        Next Floor
        </button>
    `;
}
loadGame();

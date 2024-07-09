/**
 * Define maps here
 **/
let ZERO = V(0, 0);

let RIGHT = BOARD_WIDTH_INCH;
let BOTTOM = BOARD_HEIGHT_INCH;
let MIDDLE_X = BOARD_WIDTH_INCH / 2;
let MIDDLE_Y = BOARD_HEIGHT_INCH / 2;
let QUARTER_X = MIDDLE_X / 2;
let QUARTER_Y = MIDDLE_Y /2;

let TOP_LEFT = ZERO;
let TOP_RIGHT = V(RIGHT, 0);
let BOTTOM_LEFT = V(0, BOTTOM);
let BOTTOM_RIGHT = V(RIGHT, BOTTOM);

/**
 * Deployment
 * edges is always an array, but as a vararg it's more convenient to pass a single Edge
 */
function D(x, y, round, ...edges ) {

   return {
      "p": V( x, y ),
      "round": round,
      "edges": edges
   };
}


/**
 * Edge: define an edge of the map for deployment
 **/
function Edge( x, y, range) {
   return {
      "center": V(x,y),
      "range": range
   }
}

/**
 * Deployments are in DASH order (DAgger, Shield, Hammer). Locations are in inches starting from top left = (0,0)
 */
const predefined_battleplans = [

   /*********** Test maps **************************************************/
   {
      "key": "T-0",
      "set": "0 - test",
      "name": "GFX Test Deployment",
      "deployments": {
         "red": [ D(0, 0, 1), D(MIDDLE_X, 0, 2), D(RIGHT, QUARTER_Y, 2, Edge(RIGHT, QUARTER_Y, QUARTER_Y ) ) ],
         "blue": [ D(0, BOTTOM, 1, Edge(0, BOTTOM-QUARTER_Y, QUARTER_Y), Edge(QUARTER_X, BOTTOM, QUARTER_X) ), D(MIDDLE_X, BOTTOM, 1), D(RIGHT-QUARTER_X, BOTTOM, 2, Edge(RIGHT-QUARTER_X, BOTTOM, QUARTER_X/2) )  ]
      },
      "objectives": [  V(6, 4,1), V(MIDDLE_X, 6,1), V(RIGHT-10, 8,1),
                       V(0, MIDDLE_Y,1), V(MIDDLE_X, BOTTOM-6,1), V(RIGHT, MIDDLE_Y,1), V(MIDDLE_X, MIDDLE_Y,1),
                       V(6, BOTTOM-4,1), V(RIGHT-6, BOTTOM-4,1),
                       V(8, MIDDLE_Y,1), V(RIGHT-8, MIDDLE_Y,1), V(RIGHT, BOTTOM,1),
                       V(...line_delta(BOTTOM_LEFT, TOP_RIGHT, -6).v ,1)
                     ]
   },
   {
      "set": "0 - test",
      "name": "Center",
      "deployments": {
         "red": [ D(2, 6, 1), D(MIDDLE_X, 6, 1), D(RIGHT-2, 6, 1 ) ],
         "blue": [ D(2, BOTTOM-6, 1), D(MIDDLE_X, BOTTOM-6, 1), D(RIGHT-2, BOTTOM-6, 1 )  ]
      },
      "objectives": [ V(MIDDLE_X, MIDDLE_Y,1) ]
   },
   
   /********** Unknown ******************/
   {
      "set": "Unknown",
      "name": "Fend for Yourselves",
      "deployments": {
         "red": [ D(MIDDLE_X, 0, 2), D(MIDDLE_X-6, MIDDLE_Y, 1), D(RIGHT, MIDDLE_Y, 2 ) ],
         "blue": [ D(MIDDLE_X, BOTTOM, 2), D(MIDDLE_X+6, MIDDLE_Y, 1), D(0, MIDDLE_Y, 2 )  ]
      },
      "matched_play": true
   },
   /********** Rumble Pack ******************/
   {
      "set": "Rumble Pack",
      "name": "Loot and Pillage",
      "blurb": "A cache of useful supplies sits abandoned by its absent owners, piled high and yours for the taking. Any moral reservations in so doing must be put aside, for in the Gnarlwood, every resource must be exploited.",
      "deployments": {
         "red": [ D(0, 3, 2), D(RIGHT, MIDDLE_Y, 2), D(MIDDLE_X, 3, 1) ],
         "blue": [ D(RIGHT, BOTTOM-3, 2), D(0, MIDDLE_Y, 2), D(MIDDLE_X, BOTTOM-3, 1)  ]
      },
      "objectives": [ V(3,3,1), V(MIDDLE_X, MIDDLE_Y,1), V(RIGHT-3, BOTTOM-3,1) ],
      "victory": ["A fighter within 1\" of an objective can loot that objective as an action. If they do, that fighter is now carrying treasure and cannot use an action to drop that treasure.","If a fighter that cannot carry treasure loots an objective, that fighter immediately drops that treasure as a bonus action.","After a second loot action is made within 1\" of an objective, remove that objective from the battlefield.","When the battle ends, each player scores 2 victory points for each friendly fighter that is carrying treasure."],
      "rounds": 4
   },
   {
      "set": "Rumble Pack",
      "name": "Spoils of War",
      "blurb": "",
      "rounds": 4
   },
   {
      "set": "Rumble Pack",
      "name": "Seize and Control",
      "blurb": "",
      "rounds": 4
   },
   {
      "set": "Rumble Pack",
      "name": "Power Struggle",
      "blurb": "",
      "rounds": 4
   },
   {
      "set": "Rumble Pack",
      "name": "Supremacy",
      "blurb": "",
      "rounds": 4
   },
   {
      "set": "Rumble Pack",
      "name": "Tides of Battle",
      "blurb": "",
      "rounds": 4
   },

   /********** FEROCIOUS GNARLWOOD II: Electric Boogaloo ******************/
   {
      "set": "The Ferocious Gnarlwood II",
      "name": "Lightning Raid",
      "blurb": "Battle erupts over scant resources, some more valuable than others.",
      "deployments": {
         "red": [ D(RIGHT, 0, 1), D(0, 0, 2), D(MIDDLE_X,0,1) ],
         "blue": [ D(0, BOTTOM, 1), D(RIGHT, BOTTOM, 2), D(MIDDLE_X, BOTTOM, 1) ]
      },
      "objectives": [ V(3,6), V(MIDDLE_X-7, MIDDLE_Y), V(MIDDLE_X, MIDDLE_Y), V(MIDDLE_X+7, MIDDLE_Y), V(RIGHT-3,BOTTOM-6) ],
      "victory": ["Fighters cannot control more than one objective at a time in this battleplan. If a fighter is within 3” of multiple objectives, starting with the player that took the first activation that battle round, players decide which objectives all of such friendly fighters are controlling.","Devastate their Ranks: At the end of each battle round, each player determines the total Wounds characteristic of enemy fighters that are taken down this battle. This is their devastation total. The player whose devastation total is higher scores 2 victory points.", "At the end of each battle round, each player scores 1 victory point for each of the following that is true: They control any objective, They control two or more objectives, They control more objectives than their opponent.", "Glittering Hoard: After the initiative phase each battle round, if one player has fewer victory points, that player picks an objective. The player that controls that objective at the end of that battle round scores 1 additional victory point."],
      "rounds": 4
   },
   {
      "set": "The Ferocious Gnarlwood II",
      "name": "Blades of Blood",
      "blurb": "A deep and abiding hatred exists between two warbands, and when on the search for riches and artefacts in the mires, an opportunity arises to settle the matter once and for all.",
      "deployments": {
         "red": [ D(6, MIDDLE_Y, 1), D(MIDDLE_X, BOTTOM, 2), D( ...(line_delta(BOTTOM_LEFT, TOP_RIGHT, -6).v), 2) ],
         "blue": [ D(RIGHT-6, MIDDLE_Y, 1), D(MIDDLE_X, 0, 2), D( ...(line_delta(TOP_RIGHT,BOTTOM_LEFT, -6).v), 2) ]
      },
      "objectives": [ V(MIDDLE_X,MIDDLE_Y-6), V(MIDDLE_X, MIDDLE_Y), V(MIDDLE_X, MIDDLE_Y+6) ],
      "victory": ["At the end of each battle round, the players score 1 victory point for holding 1 or more objectives, 1 victory point for holding more objectives than the other player and 1 victory point for holding 2 or more objectives.", "A Bloody Victory, or None At All: Score 1 victory point each time an enemy fighter within 3\" of an objective is taken down."],
      "rounds": 4
   },
   {
      "set": "The Ferocious Gnarlwood II",
      "name": "Endless Struggle",
      "blurb": "Towards the end of a long and bitter campaign, two weary warbands tear into each other with all the bitterness a long rivalry can muster. The fighters are worn and weary, and must be careful they do not let their exhaustion overcome them.",
      "deployments": {
         "red": [ D(RIGHT, 0, 2), D(RIGHT-3, MIDDLE_Y, 1), D(MIDDLE_X, BOTTOM-3, 1) ],
         "blue": [ D(0, BOTTOM, 2), D(3, MIDDLE_Y, 1), D(MIDDLE_X, 3, 1)  ]
      },
      "objectives": [ V(6,3), V(RIGHT-6, 3), V(6, BOTTOM-3), V(RIGHT-6, BOTTOM-3) ]
   },
   {
      "set": "The Ferocious Gnarlwood II",
      "name": "Raze to the Ground",
      "blurb": "There are valuable artefacts to gather, but if you can’t have them, no-one will.",
      "deployments": {
         "red": [ D(RIGHT-5, 3, 1), D(5, 3, 1), D(MIDDLE_X, 0, 2) ],
         "blue": [ D(5, BOTTOM-3, 1), D(RIGHT-5, BOTTOM-3, 1), D(MIDDLE_X, BOTTOM, 2)  ]
      },
      "objectives": [ V(3, MIDDLE_Y), V(MIDDLE_X, MIDDLE_Y), V(RIGHT-3, MIDDLE_Y) ]
   },
   {
      "set": "The Ferocious Gnarlwood II",
      "name": "A Tithe of Blades",
      "blurb": "The time has come to put the un-worthies of the realm to the blade. Allow none to shirk their duties, and let fewer still escape your wrath.",
      "deployments": {
         "red": [ D(MIDDLE_X, 0, 1), D(3, MIDDLE_Y, 1), D(RIGHT+BOARD_MARGIN_INCH/2, MIDDLE_Y, 2, Edge(RIGHT, MIDDLE_Y, MIDDLE_Y)) ],
         "blue": [ D(5, BOTTOM-3, 1), D(RIGHT-5, BOTTOM-3, 1), D(MIDDLE_X, BOTTOM, 2)  ]
      },
      "objectives": [ V(3, MIDDLE_Y), V(MIDDLE_X, MIDDLE_Y), V(RIGHT-3, MIDDLE_Y) ]
   },
   {
      "key": "FG2-Blood-Moon",
      "set": "The Ferocious Gnarlwood II",
      "name": "Blood Moon",
      "blurb": "The New Moon begins to take on a dark and sinister visage, shining a bloodthirsty light on places where violence seems inevitable.",
      "deployments": {
         "red": [ D(3, MIDDLE_Y+3, 1), D(MIDDLE_X+QUARTER_X, BOTTOM, 2, Edge(MIDDLE_X+QUARTER_X, BOTTOM, QUARTER_X)), D(MIDDLE_X+3, 3, 1) ],
         "blue": [ D(RIGHT-3, MIDDLE_Y-3, 1), D(QUARTER_X, 0, 2, Edge(QUARTER_X, 0, QUARTER_X)), D(MIDDLE_X-3, BOTTOM-3, 1)  ]
      },
      "objectives": [ V(9, 6), V(RIGHT-5, 3), V(MIDDLE_X, MIDDLE_Y), V(5, BOTTOM-3), V(RIGHT-9, BOTTOM-6) ],
      "victory": ["At the end of each battle round, each player scores 1 victory point for each objective they control.", "New Moon Secondary: At the beginning of each battle round, the player with the fewest victory points picks an objective. The BLOOD MOON's light shines down on that objective. Any time a fighter is taken down while partially or wholly within the light of the BLOOD MOON, its controller's opponent scores 2 Victory Points"],
      "rounds": 4
   },
   {
      "key": "FG2-Mystic-Glade",
      "set": "The Ferocious Gnarlwood II",
      "name": "Mystic Glade",
      "blurb": "A glade brimming with arcane potential. Who better than you to drain it of its mystical powers to further your ambitions?",
      "deployments": {
         "red": [ D(MIDDLE_X, 0, 2, Edge(MIDDLE_X,0,MIDDLE_X)), D(RIGHT, MIDDLE_Y, 1), D(MIDDLE_X, BOTTOM-3, 1) ],
         "blue": [ D(MIDDLE_X, BOTTOM, 2, Edge(MIDDLE_X,BOTTOM,MIDDLE_X)), D(0, MIDDLE_Y, 1), D(MIDDLE_X, 3, 1)  ]
      },
      "victory": ["At the end of each battle round, each player scores 1 victory point for each of the following that is true: - They control any objective. - They control two or more objectives. - They control more objectives than their opponent.", "Fighters cannot control more than one objective at a time in this battleplan. If a fighter is within 3\" of multiple objectives, starting with the player that took the first activation that battle round, players decide which objectives all of such friendly fighters are controlling.","Might Makes Right: The first time an attack action made by a fighter within 3\" of the target takes an enemy fighter down in a battle round, that fighter is bloodgifted for the rest of the battle round. After determining control of objectives in the same battle round, if a bloodgifted fighter is within 1\" of an objective their controlling player controls, that player scores 2 victory points.","Pulsing Power: Before the initiative phase each battle round, if one player has fewer victory points, that player gains a number of wild dice equal to the difference in victory points between those players. Those additional wild dice are discarded after that initiative phase."],
      "rounds": 4
   },
   {
      "key": "FG2-Brutal-Encounter",
      "set": "The Ferocious Gnarlwood II",
      "name": "Brutal Encounter",
      "blurb": "You have happened upon an enemy warband deep within no-man’s land. In order to claim this area of relative safety, you must drive them back.",
      "deployments": {
         "red": [ D(MIDDLE_X, 3, 1), D(RIGHT, BOTTOM, 2), D(RIGHT-6, MIDDLE_Y, 1) ],
         "blue": [ D(MIDDLE_X, BOTTOM-3, 1), D(0,0,2), D(6, MIDDLE_Y, 1)  ]
      },
      "victory": ["At the end of each battle round, each player scores 1 victory point for each of the following that is true: - One or more enemy fighters were taken down in that battle round. - More enemy fighters than friendly fighters were taken down in that battle round. - For each enemy fighter with the Hero runemark that are taken down.*- For each enemy fighter with the Ally and/or Monster runemarks that are taken down.",
      "Control Ground: At the end of each battle round, a player scores 2 victory points if they control more table quarters as shown on the battleplan map than their opponent. To control a table quarter a player must have more fighters wholly within that table quarter than the other player.",
      "Tangled Roots: After the initiative phase each battle round, if one player has fewer victory points, that player picks an enemy fighter. That fighter makes 1 fewer actions in this battle round."],
      "rounds": 4
   },

   /********** The Salty Sea Tidal Pack ******************/
   {
      "set": "Tidal Pack",
      "name": "Might Makes Right",
      "blurb": "The victorious hordes of chaos have infused the local realmstone with their bloodthirsty energies. You must secure it, but note that violence done in the realmstone's presence has a fortifying effect on the perpetrators.",
      "deployments": {
         "red": [ D(MIDDLE_X, 3, 1), D(6, MIDDLE_Y, 1), D(MIDDLE_X, BOTTOM, 2) ],
         "blue": [ D(MIDDLE_X, BOTTOM-3, 1), D(RIGHT-6, MIDDLE_Y, 1), D(MIDDLE_X, 0, 2)  ]
      },
      "objectives": [ V(MIDDLE_X, MIDDLE_Y) ]
   },
   {
      "set": "Tidal Pack",
      "name": "The Most Dangerous Game",
      "blurb": "The gnarlwood is a vast and predatory place, where the hunter can become the hunted at any moment.",
      "deployments": {
         "red": [ D(8, BOTTOM-6, 1), D(QUARTER_X, 0, 2, Edge(QUARTER_X, 0, QUARTER_X) ), D(RIGHT-7, BOTTOM-5, 1) ],
         "blue": [ D(RIGHT-8, 6, 1), D(RIGHT-QUARTER_X, BOTTOM, 2, Edge(RIGHT-QUARTER_X, BOTTOM,QUARTER_X) ), D(7, 5, 1)  ]
      }
   },
   {
      "set": "Tidal Pack",
      "name": "Strewn Riches",
      "blurb": "Chaos leaves widespread desolation in its wake, but with a thorough search, you can find valuable artifacts their mindless armies ignored.",
      "deployments": {
         "red": [ D(RIGHT-QUARTER_X, 0, 2, Edge(RIGHT-QUARTER_X, 0, QUARTER_X)), D(RIGHT, MIDDLE_Y, 1), D(MIDDLE_X, MIDDLE_Y+6, 1) ],
         "blue": [ D(QUARTER_X, BOTTOM, 2, Edge(QUARTER_X, BOTTOM, QUARTER_X)), D(0, MIDDLE_Y, 1), D(MIDDLE_X, MIDDLE_Y-6, 1)  ]
      },
      "objectives": [ V(8,6,1), V(RIGHT-8, 6,1), V(MIDDLE_X,MIDDLE_Y,1), V(8, BOTTOM-6,1), V(RIGHT-8, BOTTOM-6,1) ],
      "victory": ["A fighter within 1\" of an objective can loot that objective as an action. If they do, that fighter is now carrying treasure and cannot use an action to drop that treasure.", "If a fighter that cannot carry treasure loots an objective, that fighter immediately drops that treasure as a bonus action.", "After a loot action is made within 1\" of an objective, remove that objective from the battlefield.","At the end of each battle round, score 1 victory point for each quarter of the battlefield that has 1 or more friendly fighters wholly within it.", "At the end of the 4th battle round, each player scores 2 victory points for each treasure they are carrying."],
      "rounds": 4
   },
   {
      "set": "Tidal Pack",
      "name": "Plant a Flag",
   },
   {
      "set": "Tidal Pack",
      "name": "Heroes' Graveyard",
   },
   {
      "set": "Tidal Pack",
      "name": "Heavy Head",
   },
   {
      "set": "Tidal Pack",
      "name": "Rising Dread",
   },
   {
      "set": "Tidal Pack",
      "name": "Helter Skelter",
   },
   {
      "set": "Tidal Pack",
      "name": "The Burning Past",
   },
   {
      "set": "Tidal Pack",
      "name": "Frantic Search",
   },
   {
      "set": "Tidal Pack",
      "name": "Great Hunt",
   },
   {
      "set": "Tidal Pack",
      "name": "Blood Tide",
   },


   /********** Optimal Game State - Mark of Chaos v1.1 ******************/
   {
      "set": "Mark of Chaos",
      "name": "Trapped Scouts",
      "blurb": "There are valuable artefacts to gather, but if you can’t have them, no-one will.",
      "deployments": {
         "red": [ D(MIDDLE_X, 3, 1), D(0, BOTTOM-3, 1), D(RIGHT-QUARTER_X, BOTTOM, 2, Edge(RIGHT-QUARTER_X, BOTTOM, QUARTER_X) ) ],
         "blue": [ D(MIDDLE_X, BOTTOM-3, 1), D(RIGHT, 3, 1), D(QUARTER_X, 0, 2, Edge(QUARTER_X,0,QUARTER_X) )  ]
      },
      "objectives": [ V(RIGHT-8, 6), V(MIDDLE_X, MIDDLE_Y), V(8, BOTTOM-6) ]
   },
   {
      "set": "Mark of Chaos",
      "name": "Sprint",
   },
   {
      "set": "Mark of Chaos",
      "name": "Fight for Quarters",
   },
   {
      "set": "Mark of Chaos",
      "name": "Borderlands",
   },
   {
      "set": "Mark of Chaos",
      "name": "Riverbed",
   },
   {
      "set": "Mark of Chaos",
      "name": "The Cross",
   },
   /********** Bladeborn Battles. 600 points, max 9 fighters ******************/
   {
      "set": "Bladeborn Battles",
      "name": "Site of Power",
      "blurb": "Two warbands have stumbled onto a site of arcane power that they cannot allow to fall into the hands of their rivals.",
      "deployments": {
         "red": [ D(0, BOTTOM, 1), D(6, BOTTOM-4, 1), D(MIDDLE_X, BOTTOM-6, 1) ],
         "blue": [ D(0, 0, 1), D(6, 4, 1), D(MIDDLE_X, 6, 1)  ]
      },
      "objectives": [ V(0, MIDDLE_Y), V(MIDDLE_X, MIDDLE_Y), V(RIGHT, MIDDLE_Y) ]
   },
   {
      "set": "Bladeborn Battles",
      "name": "Beset",
      "source": "White Dwarf 477",
      "blurb": "A warband has been caught out of position by its rivals and is now facing a bitter struggle to survive.",
      "deployments": {
         "red": [ D(8, BOTTOM-6, 1), D(RIGHT-8, 6, 1), D(RIGHT-8, BOTTOM-6, 1) ],
         "blue": [ D(MIDDLE_X, BOTTOM, 1), D(MIDDLE_X, MIDDLE_Y-6, 1), D(8, 6, 1)  ]
      },
      "objectives": [],
      "victory": ["The battle ends immediately if all of the fighters in a single warband's Shield and Dagger battle groups are taken down. When this happens the player of the other warband wins.","When the battle ends, each player adds up the total points value for the enemy fighters taken down by their warband. The player with the highest total wins the battle."],
      "rounds": 4
   },
   /********** Scales of Talaxis ******************/
   {
      "set": "Scales of Talaxis",
      "name": "Lurking Threats",
   },
   /********** Blood Hunt ******************/
   {
      "set": "Blood Hunt",
      "name": "Starting Fervour",
   },
   /********** Nightmare Quest ******************/
   {
      "set": "Nightmare Quest",
      "name": "Realmshaper Mishap",
   },
   /********** Heart of Ghur ******************/
   {
      "set": "Heart of Ghur",
      "name": "First Blood",
      "matched_play": true,
      "deployments": {
         "red": [ D(MIDDLE_X-9, MIDDLE_Y, 1), D( 0, MIDDLE_Y, 2, Edge(0, MIDDLE_Y, MIDDLE_Y) ), D(MIDDLE_X, 0, 1) ],
         "blue": [ D(MIDDLE_X+9, MIDDLE_Y, 1), D(RIGHT, MIDDLE_Y, 2, Edge( RIGHT, MIDDLE_Y, MIDDLE_Y ) ), D(MIDDLE_X, BOTTOM, 1) ]
      }
   },
   {
      "set": "Heart of Ghur",
      "name": "Death Blow",
      "matched_play": true,
      "deployments": {
         "red": [ D(MIDDLE_X+9, MIDDLE_Y, 1), D( 0, MIDDLE_Y, 2, Edge(0, MIDDLE_Y, MIDDLE_Y) ), D(RIGHT-8, 6, 1) ],
         "blue": [ D(MIDDLE_X-9, MIDDLE_Y, 1), D(RIGHT, MIDDLE_Y, 2, Edge( RIGHT, MIDDLE_Y, MIDDLE_Y ) ), D(8, BOTTOM-6, 1) ]
      }
   },
   {
      "set": "Heart of Ghur",
      "name": "Knife to the Back",
      "matched_play": true,
      "deployments": {
         "red": [ D(MIDDLE_X, BOTTOM, 2, Edge(MIDDLE_X, BOTTOM, MIDDLE_X)), D( MIDDLE_X, MIDDLE_Y-6, 1), D(0, MIDDLE_Y, 1) ],
         "blue": [ D(MIDDLE_X, 0, 2, Edge(MIDDLE_X, 0, MIDDLE_X)), D(MIDDLE_X, MIDDLE_Y+6, 1 ), D(RIGHT, MIDDLE_Y, 1) ]
      }
   },
   {
      "set": "Heart of Ghur",
      "name": "Bloodbath",
      "matched_play": true,
      "deployments": {
         "red": [ D(MIDDLE_X, MIDDLE_Y-6, 1), D( 8, 6, 1), D(RIGHT, MIDDLE_Y, 2) ],
         "blue": [ D(MIDDLE_X, MIDDLE_Y+6, 1), D(RIGHT-8, BOTTOM-6, 1 ), D(0, MIDDLE_Y, 2) ]
      }
   },
   {
      "set": "Heart of Ghur",
      "name": "Stand-off",
   },
   {
      "set": "Heart of Ghur",
      "name": "The Unseen Blade",
   },
   {
      "set": "Heart of Ghur",
      "name": "Clash of Blades",
   },
   {
      "set": "Heart of Ghur",
      "name": "Battle Lines",
   },
   {
      "set": "Heart of Ghur",
      "name": "Show of Strength",
   },
   {
      "set": "Heart of Ghur",
      "name": "Death Spiral",
   },
   {
      "set": "Heart of Ghur",
      "name": "The Duel",
   },
   {
      "set": "Heart of Ghur",
      "name": "Escalation",
   },
   {
      "set": "Heart of Ghur",
      "name": "",
   },
   /********** Red Harvest ******************/
   {
      "set": "Red Harvest",
      "name": "Swift Attack",
   },
   /********** Starter Set ******************/
   {
      "set": "Starter Set",
      "name": "Death Spiral",
   },
   /********** Catacombs ******************/
   {
      "set": "Catacombs",
      "name": "Hold Fast",
   },
   /********** Sundered Fate ******************/
   {
      "set": "Sundered Fate / Stealth and Stone",
      "name": "Unknown Territory",
   },
   /********** Test of Champions ******************/
   {
      "set": "Test of Champions",
      "name": "Cursed Prize",
   },
   {
      "set": "Test of Champions",
      "name": "Altar of Ascendancy",
   },
   {
      "set": "Test of Champions",
      "name": "Brutal Conquest",
   },
   /********** Test of Champions ******************/


]
.sort( (a,b) => ( (a.set ? a.set+" - " : "0") + a.name ).localeCompare(( (b.set ? b.set+" - " : "0") + b.name ), "en") );
// above sort uses "set - name" for sorting

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

/* Deployments are in DASH order (DAgger, Shield, Hammer). Locations are in inches starting from top left = (0,0)
 **/
const predefined_battleplans = [

{
   /*********** Test maps **************************************************/
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
   
   /********** Unknown ******************/

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
      "rules": ["Fighters cannot control more than one objective at a time in this battleplan. If a fighter is within 3” of multiple objectives, starting with the player that took the first activation that battle round, players decide which objectives all of such friendly fighters are controlling.","Devastate their Ranks: At the end of each battle round, each player determines the total Wounds characteristic of enemy fighters that are taken down this battle. This is their devastation total. The player whose devastation total is higher scores 2 victory points."],
      "scoring": ["At the end of each battle round, each player scores 1 victory point for each of the following that is true: They control any objective, They control two or more objectives, They control more objectives than their opponent.", "Glittering Hoard: After the initiative phase each battle round, if one player has fewer victory points, that player picks an objective. The player that controls that objective at the end of that battle round scores 1 additional victory point."],
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
      "rules": [],
      "scoring": ["At the end of each battle round, the players score 1 victory point for holding 1 or more objectives, 1 victory point for holding more objectives than the other player and 1 victory point for holding 2 or more objectives.", "A Bloody Victory, or None At All: Score 1 victory point each time an enemy fighter within 3\" of an objective is taken down."],
      "rounds": 4
   },
   {
      "set": "The Ferocious Gnarlwood II",
      "name": "Loot and Pillage",
      "blurb": "A cache of useful supplies sits abandoned by its absent owners, piled high and yours for the taking. Any moral reservations in so doing must be put aside, for in the Gnarlwood, every resource must be exploited.",
      "deployments": {
         "red": [ D(0, 3, 2), D(RIGHT, MIDDLE_Y, 2), D(MIDDLE_X, 3, 1) ],
         "blue": [ D(RIGHT, BOTTOM-3, 2), D(0, MIDDLE_Y, 2), D(MIDDLE_X, BOTTOM-3, 1)  ]
      },
      "objectives": [ V(3,3,1), V(MIDDLE_X, MIDDLE_Y,1), V(BOTTOM-3, BOTTOM-3,1) ],
      "rules": ["A fighter within 1\" of an objective can loot that objective as an action. If they do, that fighter is now carrying treasure and cannot use an action to drop that treasure.","If a fighter that cannot carry treasure loots an objective, that fighter immediately drops that treasure as a bonus action.","After a second loot action is made within 1\" of an objective, remove that objective from the battlefield."],
      "scoring": ["When the battle ends, each player scores 2 victory points for each friendly fighter that is carrying treasure."],
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
      "rules": ["A fighter within 1\" of an objective can loot that objective as an action. If they do, that fighter is now carrying treasure and cannot use an action to drop that treasure.", "If a fighter that cannot carry treasure loots an objective, that fighter immediately drops that treasure as a bonus action.", "After a loot action is made within 1\" of an objective, remove that objective from the battlefield."],
      "scoring": ["At the end of each battle round, score 1 victory point for each quarter of the battlefield that has 1 or more friendly fighters wholly within it.", "At the end of the 4th battle round, each player scores 2 victory points for each treasure they are carrying."],
      "rounds": 4
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
      "rules": ["The battle ends immediately if all of the fighters in a single warband's Shield and Dagger battle groups are taken down. When this happens the player of the other warband wins."],
      "scoring": ["When the battle ends, each player adds up the total points value for the enemy fighters taken down by their warband. The player with the highest total wins the battle."],
      "rounds": 4
   },
]
.sort( (a,b) => ( (a.set ? a.set+" - " : "0") + a.name ).localeCompare(( (b.set ? b.set+" - " : "0") + b.name ), "en") );
// above sort uses "set - name" for sorting

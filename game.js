/* Most code that actually does interesting stuff goes here 
- event handling
- drawing stuff
- contents
*/


// This is probably best when they circular icons in a square image
let DEPLOYMENT_TOKEN_SIZE_INCH = 1.5;

const IMAGE = {
   "background": "img/background/desert.jpg",
   "deployment": {
      // These index as D/S/H
      "red": ["img/deployment_red_dagger.png", "img/deployment_red_shield.png", "img/deployment_red_hammer.png"],
      "blue": ["img/deployment_blue_dagger.png", "img/deployment_blue_shield.png", "img/deployment_blue_hammer.png"]
   }
}


/**
 *           1.5π
 *          =  = 
 *       =        = 
 *    π =          = 0/2π
 *      =          = 
 *       =        = 
 *          =  =
 *           π/2
 * 
 * Drawing arcs on the canvas starts the the leftmost point of the circle
 * These ARCs are start/stop points in radians for drawing arcs for that position.
 * top_left: draw an arc in the top left of a box, so the arc is [π, 1.5π]
 **/
const ARC = {
   "top_left":     [ 0, PI2 ],
   "top":          [ 0, PI ],
   "top_right":    [ PI2, PI ],
   "right":        [ PI2, PI+PI2 ],
   "bottom_right": [ PI, PI+PI2 ],
   "bottom":       [ PI, 2*PI ],
   "bottom_left":  [ PI+PI2, 2*PI ],
   "left":         [ PI+PI2, PI2 ]
};

const LINE_DOTTED = [5, 5]; // a line made of 5 pixel long segments alternating off/on

const Z_INDEX = {
   "deployment": 20,
   "objective": 50,
   "bubble": 60,
   "axes": 90,
   "background": 100
};

const Color = {
   "DEBUG": "maroon",
   "background": "antiquewhite",
   "light": "moccasin",
   "round": "rgba(139, 189, 250, 1)",
   "brown": "peru",
   "white": "oldlace",
   "black": "black",
   "border": "black",
   "arrow": "black",
   "bubble": {
      "objective": "rgba(250, 180, 0, 0.8)",
      "red": "rgba(250, 80, 80, 0.8)",
      "blue": "rgba(80, 80, 250, 0.8)"
   },
   "transparant": "rgba(0,0,0,0)",
};

// It is pleasing these are the same number of characters
const DAGGER = 0;
const SHIELD = 1;
const HAMMER = 2;


function init_battleplan(index) {
   world.map.current_battleplan = index;
   let bp = predefined_battleplans[index];

   // Positioning arrows for objectives
   world.map.arrows = bp.objectives.flatMap( o => arrows_for_point( V(o.x, o.y) ) );

   // Positioning arrows for deployment tokens except for edges
   ["red", "blue"].forEach( color => {
      [DAGGER, SHIELD, HAMMER].forEach( group => {
         let deployment = bp.deployments[color][group];
         if( deployment["type"] != "edge" ) {            
            let arrows = arrows_for_point( deployment.p );
            world.map.arrows.push( ...arrows );
         }
      })
   });

   // display the mission text parts
   ["blurb", "rounds"].forEach( e => document.getElementById(e).innerText = bp[e] == undefined ? "" : bp[e] );
   
   ["scoring", "rules"].forEach( e => {
      if( bp[e] == undefined ) {
         return;
      }

      let element = document.getElementById(e);
      while( element.firstChild ) {
         element.removeChild(element.firstChild);
      }
      bp[e].forEach( r => {
         let s = document.createElement("span")
         s.innerText = r;
         element.appendChild(s);
      });
   });

}


function map_init() {

   ui_add_click_handler( process_click );

   // turn the list of deployments into groups and display as a select menu
   let groups = {};
   predefined_battleplans.forEach( e => {
      if( groups[e.set] == undefined ) {
         groups[e.set] = [];
      }
      groups[e.set].push( e.name );
   });

   create_select_optgroups( 
      document.getElementById("predefined_battleplans"),
      groups, 
      onOptionSelect( init_battleplan )
   );

   world.map = {
      "PPI": 0, // Pixels Per Inch. Calculated after canvas creation
      "current_battleplan": -1, // -1 is no plan set
      "scale": {},
      "arrows": [] // arrows to point to deployments or objectives
   };
   world.debug.map = {
      "text": [],
      "lines": []
   }

   // content

   // load the background image
   gfx_image_load( IMAGE.background, (image) => {
      let x = BOARD_WIDTH_INCH * PPI / image.width;
      let y = BOARD_HEIGHT_INCH * PPI / image.height;
      world.map.scale.background = V(x, y);
   } );

   // load the deployment tokens
   ["red", "blue"].forEach( color => {
      [DAGGER, SHIELD, HAMMER].forEach( group => {
         gfx_image_load( IMAGE.deployment[color][group] );
      });
   });

   // Calculate scaling factor for deployment tokens.
   // Assume the images are square and all the same size
   let source_width = ui.image_cache[IMAGE.deployment["red"][0]].image.width;
   let target_width = DEPLOYMENT_TOKEN_SIZE_INCH * PPI;
   let scale = target_width / source_width;
   world.map.scale.deployment_token = V(scale, scale);

   init_battleplan(0);
}


/* Click on the canvas, find out what you clicked on
 *
 */
function process_click( p ) {
   
   world.debug.map.lines = [];
   world.debug.map.highlight_shapes = [];

   var closest_distance = 1000000;
   var closest_image = null;

   // world.map.images.forEach( i => {

   //    const d = distance_p2p( p, i.center );
   //    if( d <  closest_distance ) {
   //       closest_image = i;
   //       closest_distance = d;
   //    }

   //    world.debug.map.lines.push( [p, i.center, "yellow" ] );
   // });

   // select the tile if we are within a circle with radius t from the center of the square
   // this means sometimes you select when you are just outside (but only if there are no adjacent tiles)
   // if( closest_distance <= 2*size ) {
   //    world.selected_image = closest_image;
   //    world.debug.map.highlight_shapes.push( closest_image ); 
   // }
}


function pixels_from_inches( inches ) {
   return vector_mul( PPI, inches );
}

/**
 * An arrow is a gfx that has a start and end, where the end has a pointy bit
 * 
 * This returns arrows: Either the shortest horizontal and shortest vertical arrows from
 * the board edge to the point or a diagonal one if the point is on a diagonal axis
 * It does not make arrows from edge to middle horizontally or vertically
 * 
 * p: point in inches on the board (excl margins)
 */
function arrows_for_point( p ) {

   let result = [];

   // Diagonal lines!
   // diagonal test?
   // rounding issues of course. 
   // if( line_test( V(0,0), V(RIGHT,BOTTOM), p ) ) {
      
   // }
   // if( line_test( V(RIGHT,0), V(0,BOTTOM), p ) ) {
      
   // }

   // Horizontal lines

   // from left edge
   if( p.x > 0 && p.x < MIDDLE_X ) {
      result.push( [V(0, p.y), p] );
   }

   // from right edge
   if( p.x > MIDDLE_X && p.x < RIGHT ) {
      result.push( [V(BOARD_WIDTH_INCH, p.y), p] );      
   }

   // Vertical lines

   // from the top
   if( p.y > 0 && p.y < MIDDLE_Y ) {
      result.push( [V(p.x, 0), p] );
   }

   // from the bottom
   if( p.y > MIDDLE_Y && p.y < BOTTOM ) {
      result.push( [V(p.x, BOARD_HEIGHT_INCH), p] );      
   }

   return result;
}

/*************** Convenience functions that wrap ui drawing, all take points in inches *********************/

// Take a point in board inches and convert to pixels taking board margins into account
function pix( location_inch ) {
   return pixels_from_inches( add( BOARD_ORIGIN_INCH, location_inch ) );
}

function bracket( center, range, horizontal = true ) {

   let line_width = 0.04*PPI;
   let cap_length = DEPLOYMENT_TOKEN_SIZE_INCH/6;

   var bracket_start_offset, bracket_end_offset; // start and end offsets relative to center
   var cap_start_offset, cap_end_offset; // start and end offsets relative to bracket start/end

   if( horizontal ) {

      // Draw a bracket with the token image in the center on top of it: |-----D-----|
      bracket_start_offset = V( -range, 0 );
      bracket_end_offset = V( range, 0 );

      // end caps
      cap_start_offset = V( 0, -cap_length );
      cap_end_offset = V( 0, cap_length );

   } else {

      // Draw a bracket with the token image in the center on top of it:
      // ---
      //  |
      //  D
      //  |
      // ___
      bracket_start_offset = V( 0, -range);
      bracket_end_offset = V( 0, range );

      cap_start_offset = V( -cap_length, 0);
      cap_end_offset = V( cap_length, 0 );
   }

   let bracket_start = add(center, bracket_start_offset );
   let bracket_end = add(center, bracket_end_offset );
   gfx_line( pix( bracket_start ), Z_INDEX.deployment+1, pix( bracket_end ), line_width, Color.black );

   // end caps
   gfx_line( pix( add( bracket_start, cap_start_offset ) ), Z_INDEX.deployment+1, pix( add( bracket_start, cap_end_offset ) ), line_width, Color.black );
   gfx_line( pix( add( bracket_end, cap_start_offset ) ), Z_INDEX.deployment+1, pix( add( bracket_end, cap_end_offset ) ), line_width, Color.black );

}

function deployment_edge( edge ) {

   let edge_offset = BOARD_MARGIN_INCH/2; // Distance of token to the board

   let p = edge.center;

   var horizontal = p.y % BOARD_HEIGHT_INCH == 0; // horizontal or vertical token/bracket
   var offset;

   if( horizontal ) { // top or bottom
      offset = p.y == 0 ? V(0, -edge_offset) : V(0, edge_offset);
   } else {  // left or right side
      offset = p.x == 0 ? V(-edge_offset, 0) : V(edge_offset, 0);
   }

   p = add(p, offset); // position the token
   bracket( p, edge.range, horizontal );

}

/**
 * A deployment zone
 **/
function deploy( d, image ) {

   let p = d.p;

   // Edge deployment means drawing a bracket for the width of the deployment along an edge
   d.edges.forEach( deployment_edge );

   // Only for deployments after round 1, draw RND2 or RND3 next to it
   if( d.round != 1 ) {
      let text = "R" + d.round;
      let text_size = DEPLOYMENT_TOKEN_SIZE_INCH/3.5;
      let dot_radius = DEPLOYMENT_TOKEN_SIZE_INCH/4;
      let text_width = -DEPLOYMENT_TOKEN_SIZE_INCH/4.5;
      text_width = ctx.measureText(text).width/PPI;
      let r = add(d.p, V(DEPLOYMENT_TOKEN_SIZE_INCH/2, -DEPLOYMENT_TOKEN_SIZE_INCH/3 ) );
      let t = add(r, V(-text_width/2, -dot_radius/2 + text_size/2 ) ); // vertically align text
      gfx_disk( pix( r ), Z_INDEX.deployment-1, PPI * dot_radius, Color.round, 0.1*PPI);
      gfx_text( pix( t ), Z_INDEX.deployment-2, text, Color.black, text_size*PPI + "px Menlo" );
   }

   ui_image( pix(p), Z_INDEX.deployment, image, true, world.map.scale.deployment_token );
}

// circle around deployment tokens, objectives etc.
function bubble( center, radius, color = Color.bubble.objective ) {

   let arc = [ 0, 2*PI ];

   if( center.x == 0 && center.y == 0 ) {
      arc = ARC.top_left;
   } else if ( center.x == RIGHT && center.y == 0) {
      arc = ARC.top_right;
   } else if( center.x == RIGHT && center.y == BOTTOM ) {
      arc = ARC.bottom_right;
   } else if( center.x == 0 && center.y == BOTTOM ) {
      arc = ARC.bottom_left;
   } else if( center.x == 0 ) {
      arc = ARC.left;
   } else if( center.x == RIGHT ) {
      arc = ARC.right;
   } else if ( center.y == 0) {
      arc = ARC.top;
   } else if( center.y == BOTTOM ) {
      arc = ARC.bottom;
   }
 
   // The width of the line is half inside and half outside of the circle.
   // Subtract half the width so the bubbles are including the whole perimeter and adjacent ones
   // touch instead of overlap
   let line_width = PPI * 0.15;
   gfx_arc( pix(center), Z_INDEX.bubble, radius-line_width/2, ...arc, color, line_width );
 
}

function objective( center ) {
   gfx_disk( pix(center), Z_INDEX.objective, PPI * 0.3, Color.black );
}

function arrow( tail, head ) {
   let text = distance_p2p(tail, head) + "\"";
   gfx_arrow( pix(tail), Z_INDEX.objective, pix(head), PPI*0.05, Color.arrow, text, PPI * 0.8 );
}

// Set the background image
function background( url ) {
   ui_image( pix(ZERO), Z_INDEX.background, url, false, world.map.scale.background );
}


/*********************************************************************************/

function map_draw() {

   ui.render_list = []; // Clear the list of things to draw

   game_draw_debug(); // Draw any debugging (lines, grids, mouse cursor distance to clickables, ...)

   if( SHOW_BACKGROUND ) {
      background( IMAGE.background );
   }

   // Draw a border around the board
   gfx_rect( pix(ZERO), Z_INDEX.background, BOARD_WIDTH_INCH * PPI, BOARD_HEIGHT_INCH * PPI , Color.black );

   if( SHOW_AXIS ) {
      // Draw center axes
      gfx_line( pix( V(0, BOARD_HEIGHT_INCH/2) ), Z_INDEX.axes, pix( V(BOARD_WIDTH_INCH, BOARD_HEIGHT_INCH/2) ), PPI * 0.02, Color.black, LINE_DOTTED );
      gfx_line( pix( V(BOARD_WIDTH_INCH/2, 0) ), Z_INDEX.axes, pix( V(BOARD_WIDTH_INCH/2, BOARD_HEIGHT_INCH) ), PPI * 0.02, Color.black, LINE_DOTTED );

      // Draw diagonal axes
      gfx_line( pix( V(0, 0) ), Z_INDEX.axes, pix( V(BOARD_WIDTH_INCH, BOARD_HEIGHT_INCH) ), PPI * 0.02, Color.black, LINE_DOTTED );
      gfx_line( pix( V(RIGHT, 0) ), Z_INDEX.axes, pix( V(0, BOARD_HEIGHT_INCH) ), PPI * 0.02, Color.black, LINE_DOTTED );
   }

   if( world.map.current_battleplan == -1 ) {
      return;
   }

   var bp = predefined_battleplans[world.map.current_battleplan];

   // Put deployment group token on the map based on current battleplan
   ["red", "blue"].forEach( color => {
      [DAGGER, SHIELD, HAMMER].forEach( group => {

         let deployment = bp.deployments[color][group];
         deploy( deployment, IMAGE.deployment[color][group] );

         // Show deployment area 
         if( SHOW_BUBBLE ) {
            if( deployment.edges.length > 0 ) {
               // field( center )
            } else {
               bubble( deployment.p, PPI * 3, Color.bubble[color] );
            }
         }

      });
   });

   // Put objectives on the map
   if( bp.objectives != undefined ) {
      bp.objectives.forEach( o => {

         objective( o );
         if( SHOW_BUBBLE ) {
            bubble( o, PPI * (o.v[2] == undefined ? 3 : o.v[2]), Color.bubble.grey );
         }
      });
   } 

   // Draw arrows for deployments and objectives
   if( SHOW_ARROW ) {
      world.map.arrows.forEach( a => arrow( a[1], a[0] ) );
   }
   
}

/******************** Debugging *****************************************/


function map_debug_draw_text() {

   ctx.fillStyle = "black";
   ctx.font = PPI * 0.5 + 'px serif';
   world.debug.map.text.forEach( i => {
      ctx.fillText( i[1], i[0].x, i[0].y );
   });

}

function map_debug_draw_lines() {
   
   world.debug.map.lines.forEach( l => stroke_line( ...l) );
}

function map_debug_draw_highlight_shapes() {
   
   ctx.lineWidth = "2";

   world.debug.map.highlight_shapes.forEach( t => fill_path( t.vertices, Color.highlight ) );
}


function game_draw_debug() {

   if( SHOW_GRID ) {
      for(let x=1; x<BOARD_WIDTH_INCH; x++) { // vertical lines
         gfx_line( pix( V(x,0) ), Z_INDEX.background-1, pix( V(x, BOARD_HEIGHT_INCH) ), 0.02 * PPI, Color.black );
      }      
      for(let y=1; y<BOARD_HEIGHT_INCH; y++) { // vertical lines
         gfx_line( pix( V(0,y) ), Z_INDEX.background-1, pix( V(BOARD_WIDTH_INCH, y) ), 0.02 * PPI, Color.black );
      }
   }

   map_debug_draw_lines();

   map_debug_draw_text();

}








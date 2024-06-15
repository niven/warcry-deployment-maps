/* Global state and variables */

var DEBUG = false;
var SHOW_FPS = true;
var SHOW_BACKGROUND = false;
var SHOW_GRID = true;
var SHOW_BUBBLE = true;

const BOARD_BACKGROUND_COLOR = "cornsilk";
const BOARD_WIDTH_INCH = 30;
const BOARD_HEIGHT_INCH = 22;
const BOARD_MARGIN_INCH = 2.5;

var CANVAS_WIDTH = 800;
// These are calculated whenever the canvas with changes and on init()
var CANVAS_HEIGHT, PPI, BOARD_ORIGIN_INCH, BOARD_ORIGIN_PIXELS;

var ctx, canvas;

var running = true;
var frame_render_time_ms = new Array(1000);

/* Data */

var world = {
   "width": CANVAS_WIDTH,
   "height": CANVAS_HEIGHT,
   "debug": {},
   "once": {} // things we execute once. Keep them around for handy debugging
};


/* Code */

// control values for playing around, read from the DOM, but set a global to
// avoid reading world.controls.smoke_density.value every frame a billion times
var control_values_need_update = true;
var controls = {

	"debug_toggle": { "dom_id": "debug_toggle", "var": "DEBUG" },
	"fps_toggle": { "dom_id": "fps_toggle", "var": "SHOW_FPS" },
	"background_toggle": { "dom_id": "background_toggle", "var": "SHOW_BACKGROUND" },
	"grid_toggle": { "dom_id": "grid_toggle", "var": "SHOW_GRID" },
	"bubble_toggle": { "dom_id": "bubble_toggle", "var": "SHOW_BUBBLE" },
	"canvas_width": { "dom_id": "canvas_width", "var": "CANVAS_WIDTH" }
}


function create_initial_objects() {

	   
   map_init();
   
}

function setup_init() {

	CANVAS_HEIGHT = CANVAS_WIDTH * (BOARD_HEIGHT_INCH + 2*BOARD_MARGIN_INCH) / (BOARD_WIDTH_INCH + 2*BOARD_MARGIN_INCH);
	canvas.setAttribute("width", CANVAS_WIDTH);
	canvas.setAttribute("height", CANVAS_HEIGHT);

	PPI = CANVAS_WIDTH / ( BOARD_WIDTH_INCH + 2*BOARD_MARGIN_INCH );
	console.log("PPI", PPI);
	BOARD_ORIGIN_INCH = V( BOARD_MARGIN_INCH, BOARD_MARGIN_INCH );
	BOARD_ORIGIN_PIXELS = V( BOARD_MARGIN_INCH * PPI, BOARD_MARGIN_INCH * PPI );

}

/* This runs once and sets up the event loop. Put any initialization here
*/
function main() {

	canvas = document.createElement("canvas");

   // setup_input( c );
	setup_init();

	canvas.setAttribute("id", "scene");
	document.body.appendChild(canvas);

   ui_init();
   create_initial_objects();
   ui_register_handlers();
   
	let trigger_reread_control_values = function() { control_values_need_update = true };
	Object.keys(controls).forEach( name => document.getElementById( controls[name].dom_id ).onchange = trigger_reread_control_values );

	ctx = document.getElementById("scene").getContext("2d", { alpha: true });
	ctx.font = "bold 48px Menlo";

	world.time_at_frame_end = Date.now();
	world.last_time_ms = 0;

	window.requestAnimationFrame( draw );
}

function read_control_values() {

	for( var key in controls ) {
		let el = document.getElementById( controls[key].dom_id );
		var new_value = null;
		switch( el.type ) {
			case "checkbox": {
				new_value = el.checked;
				break;
			}
			default:
				new_value = Number.parseFloat( el.value );
		}
		
		// console.log( key + " from " + window[controls[key].var] + " to " + new_value );
		window[ controls[key].var ] = new_value;
	}

	control_values_need_update = false;
}

function draw_debug() {
}



function draw( time_since_start_rendering_ms ) {

	let time_delta_ms = time_since_start_rendering_ms - world.last_time_ms;
	world.last_time_ms = time_since_start_rendering_ms;
	
	let time_start = performance.now();

	let time_delta_seconds = time_delta_ms / 1000;

	if( !running ) {
		window.requestAnimationFrame( draw );
		return;
	}

	if( control_values_need_update ) {
		read_control_values();		
	}

	if( canvas.width != CANVAS_WIDTH ) {
		setup_init();
	   ui_init();
	   create_initial_objects();		
	}

	ctx.clearRect(0 ,0, CANVAS_WIDTH, CANVAS_HEIGHT);

	// set background
	ctx.fillStyle = BOARD_BACKGROUND_COLOR;
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	canvas.style.border = "solid thin black";
	// ctx.globalCompositeOperation = "xor";

	map_draw();
   ui_draw();
 
	if( DEBUG ) {
		draw_debug();
	}
   
	frame_render_time_ms.push( performance.now() - time_start );
	frame_render_time_ms.shift();
	
   if( SHOW_FPS ) {
      const avg_time_ms = frame_render_time_ms.reduce( (sum, c) => sum + c , 0 ) / frame_render_time_ms.length;
      const fps = Math.floor(1000 / (avg_time_ms + 1) );
      fill_text( V(CANVAS_WIDTH - 160,40), "FPS: " + fps);
   }
   
	window.requestAnimationFrame( draw );
}

/* Because everything runs in a game loop, sometimes you want to log or do something only once without
 * creating external variables, sentinels or set some kind of hasRun var.
 */
function once( fn ) {
	if( world.once[fn.name] == undefined ) {
		world.once[fn.name] = {
			"function": fn,
			"result": fn()
		};
	}
	return world.once[fn.name].result;
}

/* Custom functions that interact with the world */


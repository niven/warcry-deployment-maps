/* UI stuff: draw on the canvas, UI elements like text and buttons. Do not use the global 'world' struct here */
const UI_BUTTON_WIDTH = 160;
const UI_BUTTON_HEIGHT = 80;

var ui = {
   "buttons": [],
   "click_listeners": [],
   "image_cache": {}, // url => (Image, loaded)
   "render_list": [] // list of things to render that will be z sorted first.
}

// Things to render to the screen (canvas)
const GFX = {
   "image": "image"
}
function Graphic( type, coordinates, z_index, attributes ) {
   return Object.assign(
      {
         "type": type,
         "p": coordinates,
         "z_index": z_index
      },
      attributes
   );
}


function ui_init() {

   ui = {
      "buttons": [],
      "click_listeners": [],
      "image_cache": {}, // url => (Image, loaded)
      "render_list": [] // list of things to render that will be z sorted first.
   }
   
   ui_add_click_handler( process_button_click );

}

function ui_draw() {
   
   // render things on the canvas
   render();

   // render UI elements like buttons
   // ui_buttons_draw();
   
}

function render() {

   // z-sort the items in the render list
   // lower numbers are in front, z coordinates increase into the screen.
   ui.render_list = ui.render_list.sort( function(a, b) {
      if( a.z_index == b.z_index ) {
         return 0;
      }

      return a.z_index < b.z_index ? -1 : 1;
   } )
   .reverse(); // draw from back to front

   once( function renderOrder(){console.log(ui.render_list)});
   ui.render_list.forEach( g => {

      switch( g.type ) {
      case "arc": {
         draw_arc( g.p, g.radius, g.start_radians, g.stop_radians, g.width, g.color );
         break;
      }
      case "arrow": {
         // Note: these arrows are always horizontal or vertical.
         // For any direction arrows do more math to orient the pointer correctly
         let line_width = PPI * 0.1;
         let arrowead_width = 6 * line_width;
         let shortened = line_delta(g.p, g.head, -arrowead_width);
         let text_center = lerp( g.p, shortened );
         // Move the text a lineswidth away so it does not touch the vertical lines
         // also move it up half the size because text is rendered baseline middle
         fill_text( V(text_center.x + line_width, text_center.y - line_width - g.font_size/2), g.text, g.color, g.font_size + "px Menlo");
         // triangle for the head
         stroke_line( g.p, shortened, line_width, g.color, [] );
         if( g.p.x == g.head.x ) { // this is a vertical line
            draw_triangle( V(shortened.x - arrowead_width/2, shortened.y), V(shortened.x + arrowead_width/2, shortened.y), g.head, g.color);
         } else { // horizontal line
            draw_triangle( V(shortened.x, shortened.y - arrowead_width/2), V(shortened.x , shortened.y+ arrowead_width/2), g.head, g.color);
         }
         break;
      }
      case "circle": {
         draw_circle( g.p, g.radius, g.width, g.color );
         break;
      }
      case "disk": {
         draw_disk( g.p, g.radius, g.color );
         break;
      }
      case "image": {
         let i = ui.image_cache[g.url];
         if( i.loaded ) {
            draw_image( g.p, i.image, g.centered, g.scale );
         }
         break;
      }
      case "line": {
         stroke_line( g.p, g.end, g.width, g.color, g.style );
      }
      case "rect": {
         draw_rect( g.p, g.width, g.height, g.color );
         break;
      }
      case "text": {
         fill_text( g.p, g.text, g.color, g.font );
         break;  
      }
      default:
         once( function dontKnowHowToRender(){
            console.log("Don't know how to draw: " + g.type);
         });
         
      }

   });


}



function ui_add_click_handler( handler ) {
   ui.click_listeners.push( handler );
}

function ui_register_handlers() {
   canvas.addEventListener("click", canvas_onclick, false);
}


function canvas_onclick(e) {
    var element = canvas;
    var offsetX = 0, offsetY = 0

  if (element.offsetParent) {
      do {
        offsetX += element.offsetLeft;
        offsetY += element.offsetTop;
      } while ((element = element.offsetParent));
    }

    x = e.pageX - offsetX;
    y = e.pageY - offsetY;

    const p = V(x,y);
    console.log(ui.click_listeners);
    ui.click_listeners.forEach( l => l(p) );
}

function process_button_click( p ) {
   console.log(p);
   
   const button = ui.buttons.find( b => p.x >= b.loc.x && p.x < (b.loc.x+UI_BUTTON_WIDTH) && p.y >= b.loc.y && p.y < (b.loc.y + UI_BUTTON_HEIGHT));
   if( button != undefined ) {
      console.log(button);
      button.callback();
   }
}

function create_button( top_left, text, callback ) {
   
   const b = {
      "loc": top_left,
      "text": text,
      "callback": callback
   }
   
   ui.buttons.push( b );
}

/**
 * Create a fully expanded select with optgroups.
 * 
 * @param select HTMLSelectElement
 * @param groups {"foo": [a,b,c], "bar": [d,e] }
 * @param optionSelectedHandler function that is called when an option is clicked
 */
function create_select_optgroups( select, groups, optionSelectedHandler ) {
   while( select.firstChild ) {
     select.removeChild( select.firstChild );
   }
   
   let options = 0;
   for( const group of Object.keys(groups) ) {
      options++;
      const optgroup = document.createElement('optgroup');
      optgroup.label = group;

      for( const option of groups[group] ) {
         const element = document.createElement("option");
         element.innerText = option;
         element.value = option;
         optgroup.appendChild( element );
         options++;
      }

      select.appendChild( optgroup );
   }
   select.setAttribute("size", options );


   if( optionSelectedHandler != null ) {
      select.onchange = optionSelectedHandler;
   }
}

function onOptionSelect( fn ) {
   return function( event ) {
      console.log( event, event.target.selectedIndex );

      console.log( "select: " + event.target.selectedIndex );
      fn( event.target.selectedIndex, event.target[event.target.selectedIndex].value );
   } 
}

/** Load an image to the image list to draw it at a specified location
 * Note: no z-index
 * on_load_completed_callback: will be called after the image has been loaded with the HTMLImage as parameter
 */
function gfx_image_load( url, on_load_completed_callback ) {

   if( ui.image_cache[url] == undefined ) {

      // Note: using 'let' creates local scope so addEventlistener closes over this i, and not some global one.
      let i = {
         "image": new Image(), // Create new img element
         "loaded": false
      };
      i.image.addEventListener("load", (e) => {
         i.loaded = true;
         if( DEBUG) { 
            console.log("Loaded " + url + " (" + i.image.width + "x" + i.image.height + ")");
         }
         if( on_load_completed_callback != undefined ) {
            on_load_completed_callback( i.image );
         }
      });
      i.image.src = url; // set source path to load image
      ui.image_cache[url] = i; // cache it
   }
}

/* Add an image to the draw list
 * Note: loads it on demand
 */
function ui_image( p, z_index, url, centered = false, scale = V(1,1) ) {

   gfx_image_load( url );

   let attributes = {
      "url": url,
      "centered": centered,
      "scale": scale
   };

   ui.render_list.push( Graphic(GFX.image, p, z_index, attributes) );

}

function gfx_circle( center, z_index, radius, color, width ) {
   let attributes = {
      "radius": radius,
      "color": color,
      "width": width
   };
   ui.render_list.push( Graphic( "circle", center, z_index, attributes ) );
}

function gfx_arc( center, z_index, radius, start_radians, stop_radians, color, width ) {
   let attributes = {
      "radius": radius,
      "color": color,
      "width": width,
      "start_radians": start_radians,
      "stop_radians": stop_radians
   };
   ui.render_list.push( Graphic( "arc", center, z_index, attributes ) );
}

function gfx_disk( center, z_index, radius, color ) {
   let attributes = {
      "radius": radius,
      "color": color
   };
   ui.render_list.push( Graphic( "disk", center, z_index, attributes ) );
}

function gfx_rect( location, z_index, width, height, color, centered = false ) {
   let attributes = {
      "width": width,
      "height": height,
      "color": color,
      "centered": centered
   };
   ui.render_list.push( Graphic( "rect", location, z_index, attributes ) );   
}

function gfx_arrow( tail, z_index, head, width, color, text, font_size ) {

   let attributes = {
      "head": head,
      "color": color,
      "text": text,
      "font_size": font_size
   };
   ui.render_list.push( Graphic( "arrow", tail, z_index, attributes ) );
}


function gfx_line( p, z_index, end, width, color, style = [0] ) {

   let attributes = {
      "end": end,
      "color": color,
      "width": width,
      "style": style
   };
   ui.render_list.push( Graphic( "line", p, z_index, attributes ) );   
}

function gfx_text( p, z_index, text, color = "black", font = "30px Menlo" ) {
   let attributes = {
      "text": text,
      "color": color,
      "font": font
   };
   ui.render_list.push( Graphic( "text", p, z_index, attributes ) );   
}


function ui_buttons_draw() {
      
   render_shadow( true );
   ctx.fillStyle = 'black';

   ui.buttons.forEach( b => {
      fill_rect( b.loc, UI_BUTTON_WIDTH, UI_BUTTON_HEIGHT, 'silver' );
      ctx.fillStyle = 'black';
      ctx.font = "bold 48px serif";
      ctx.fillText( b.text, b.loc.x + 30, b.loc.y + 60 );
      
   });
   
}

/* Functions that put pixels on the screen */

function draw_image( p, image, centered, scale ) {

   // Scale the image. Also scales the draw location
   ctx.scale(scale.x, scale.y);

   // Optionally center image
   let offsetX = centered ? scale.x*(image.width / 2) : 0;
   let offsetY = centered ? scale.y*(image.height / 2) : 0;

   ctx.drawImage(image, (p.x - offsetX)/scale.x, (p.y - offsetY)/scale.y );

   // Reset current transformation matrix to the identity matrix
   ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function stroke_line( from, to, width, color, pattern ) {
   ctx.save();
   ctx.strokeStyle = color;
   ctx.lineWidth = width;
   ctx.setLineDash( pattern );

   ctx.beginPath();
   ctx.moveTo( from.x, from.y);
   ctx.lineTo( to.x, to.y );
   ctx.stroke();
   
   ctx.restore();
}

function stroke_path( vertices, color ) {

   ctx.strokeStyle = color;

   ctx.beginPath();
   ctx.moveTo( vertices[0].x, vertices[0].y );
   for( var i=1; i<vertices.length; i++ ) {
      ctx.lineTo( vertices[i].x, vertices[i].y );
   }
   ctx.lineTo( vertices[0].x, vertices[0].y );
   ctx.stroke();
   
}


function draw_circle( center, radius, width, color ) {

   draw_arc( center, radius, 0, 2 * Math.PI, width, color );
}

function draw_arc( center, radius, start_radians, stop_radians, width, color ) {

   ctx.strokeStyle = color;
   ctx.lineWidth = width;
   ctx.beginPath();
   // ctx.arc( center.x, center.y, radius, start_radians, stop_radians);
   ctx.arc( center.x, center.y, radius, start_radians, stop_radians);
   ctx.stroke();
}


function draw_disk( center, radius, color ) {

   ctx.fillStyle = color;
   ctx.beginPath();
   ctx.arc( center.x, center.y, radius, 0, 2 * Math.PI);
   ctx.fill();
}

function draw_plane( top_left, width, height, color ) {
   
   ctx.fillStyle = color;
   ctx.fillRect( top_left.x, top_left.y, width, height );
}


function draw_rect( top_left, width, height, color ) {
   
   ctx.strokeStyle = color;
   ctx.lineWidth = 1;
   ctx.strokeRect( top_left.x, top_left.y, width, height );
}

function draw_triangle( a, b, c, color) {
   fill_path( [a,b,c], color );
}

function fill_path( vertices, color ) {
   ctx.fillStyle = color;

   ctx.beginPath();
   ctx.moveTo(vertices[0].x, vertices[0].y);
   for( var i=1; i<vertices.length; i++ ) {
      ctx.lineTo( vertices[i].x, vertices[i].y );
   }
   ctx.fill();

}

function fill_text( p, text, color, font ) {
   ctx.fillStyle = color;
   ctx.font = font;
   ctx.textBaseline = "middle";
   ctx.fillText( text, p.x, p.y );
}



function render_shadow( on ) {
   
   if( on ) {
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.shadowBlur = 3;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
   } else {
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 0;
   }
   
}


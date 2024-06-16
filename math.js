const PI = Math.PI;
const PI2 = Math.PI / 2;

function V(...elements) {
   return new Vector(...elements);
}

class Vector {

   v;

   constructor(...elements) {
      this.v = elements;
   }

   get x() {
      return this.v[0];
   }
   get y() {
      return this.v[1];
   }
   get z() {
      return this.v[2];
   }


   get r() {
      return this.v[0];
   }
   get g() {
      return this.v[1];
   }
   get b() {
      return this.v[2];
   }
   get a() {
      return this.v[3];
   }
}

function add( a, ...v ) {

   let result = v.reduce( 
      (accumulator, current_value) => V( 
         accumulator.x + current_value.x,
         accumulator.y + current_value.y,
         accumulator.z + current_value.z
      ), a );
   return result;
}

function minus( a ) {
   return V( -a.x, -a.y, -a.z );
}
/**
 * Interpolate between 2 vectors
 */
function lerp( a, b, d = 0.5 ) {
   return V(
      a.x * (1-d) + b.x * d,
      a.y * (1-d) + b.y * d,
      a.z * (1-d) + b.z * d,
   );
}

/**
 * Having a line from A to B, produce C where 
 * C is on the line A-----------C---B at the point before B
 * so that C-B == distance
 *        + B
 *     d /|
 *      / |dy
 *     +__|
 *    / dx|
 *   /    | Δy
 *  /θ    |    
 * +______+
 * A  Δx
 **/
function line_shorten(from, to, distance) {

   let delta_x = from.x - to.x;
   let delta_y = from.y - to.y;

   // for horizontal and vertical lines it's easy, and returning early
   // avoids division by zero for horizontal lines
   if( delta_x == 0 ) {
      return V( to.x, to.y + (delta_y < 0 ? -distance : distance ) );
   }
   if( delta_y == 0 ) {
      return V( to.x + (delta_x < 0 ? -distance : distance ), to.y );
   }

   let theta = Math.atan( delta_y / delta_x );

   let dx = (delta_x < 0 ? 1 : -1 ) * distance * Math.cos( theta );
   let dy = (delta_y < 0 ? -1 : 1 ) * distance * Math.sin( theta );

   return V( to.x + dx, to.y + dy );
}

function vector_length( a ) {
   let result = a.v.reduce( (accumulator, current_value) => accumulator + current_value*current_value, 0 );
   return Math.sqrt(result);
}

// 𝑟𝑧=(cos𝜃+𝑖sin𝜃)(𝑥+𝑖𝑦)=𝑥cos𝜃−𝑦sin𝜃+𝑖(𝑥sin𝜃+𝑦cos𝜃)
// x cosT - y sinT
// x sinT + y cosT
function rotate( center, points, angle ) {

   const cosTheta = Math.cos( 2*Math.PI*angle/360 );
   const sinTheta = Math.sin( 2*Math.PI*angle/360 );

   const translated = points.map( p => P( p.x - center.x, p.y - center.y ) );
   const rotated = translated.map( p =>
      P(
         p.x * cosTheta - p.y * sinTheta,
         p.x * sinTheta + p.y * cosTheta
      )
   )
   const retranslated = rotated.map( p => P( p.x + center.x, p.y + center.y ) );
   return retranslated;
}

function distance_p2p( a, b ) {

   const distance_x = a.x - b.x;
   const distance_y = a.y - b.y;
   
   const distance = Math.sqrt( distance_x*distance_x + distance_y*distance_y );
   return distance;
}

function hit_triangle(a,b,c,p) {
	var planeAB = (a.x - p.x) * (b.y - p.y) - (b.x - p.x) * (a.y-p.y);
	var planeBC = (b.x - p.x) * (c.y - p.y) - (c.x - p.x) * (b.y-p.y);
	var planeCA = (c.x - p.x) * (a.y - p.y) - (a.x - p.x) * (c.y-p.y);
   
	return sign(planeAB) == sign(planeBC) && sign(planeBC) == sign(planeCA);
}

function sign(n) {
   return Math.abs(n)/n;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
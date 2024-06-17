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

   let result = v.reduce( (accumulator, current_value) => {
         let e = V();
         for( i in accumulator.v ) {
            e.v[i] = accumulator.v[i] + current_value.v[i];
         }
         return e;
   }, a );
   
   return result;
}

function minus( vector ) {
   return V( ...vector.v.map( e => -e ) );
}

function vector_mul( scalar, vector ) {
   return V( ...vector.v.map( e => scalar * e ) );
}

/**
 * Interpolate between 2 vectors
 */
function lerp( a, b, d = 0.5 ) {
   return add( vector_mul( (1-d), a ), vector_mul( d, b ) );
}

/**
 * Having a line from A to B, produce C where 
 * C is on the line A-----B
 * so that distance == C-B
 * 
 * A-----------C---B distance is negative
 * A---------B-----C distance is positive
 **/
function line_delta(from, to, distance) {

   let v = add( to, minus(from) );

   let n = vector_normalize( v );

   return V( to.x + distance * n.x, to.y + distance * n.y );
}

/**
 * Test if a point is on a line
 * Note: does not bounds check, just if it's on the infinitely long line defined by (from,to)
 */
function line_test( from, to, point ) {

   let v = add( to, minus(from) ); // turn two points into vector
   let n0 = vector_normalize(v);
   let n1 = vector_normalize(point); // from 0 to point

   let diff = vector_length( add( n0, minus(n1) ) );

   // if they were opposite directions the distance is 0, if they are aligned then it's 2
   // But float rounding
   return diff == 0 || Math.fround(diff) == 2;
}

function vector_normalize( a ) {

   let result = V();
   let l = vector_length( a );

   for( i in a.v ) {
      result.v[i] = a.v[i] / l;
   }

   return result;
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
   
	return Math.sign(planeAB) == Math.sign(planeBC) && Math.sign(planeBC) == Math.sign(planeCA);
}

//The maximum is exclusive and the minimum is inclusive
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); 
}

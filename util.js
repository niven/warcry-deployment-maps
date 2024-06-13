// Fisher-Yates
function shuffle( array ) {
	
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}


// kind of sloppy almost murmurhash1-3 but I need this to be a fingerprint in less code.
function hash( data ) {
   var hash = 0xdeadbeef;

   var  k;
   for( var i=0; i<data.length; i+=4) {

      k = data[i] << 24 | data[i+1] << 16 | data[i+2] << 8 | data[i+3];

      k *= 0x5bd1e995;
      k ^= k >> 15;
      k *= 0x5bd1e995;

      hash *= 0x5bd1e995;
      hash ^= k;
   }

   return hash;
}

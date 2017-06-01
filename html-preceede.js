var fs=require('fs');
var Transform = require('readable-stream/transform');

function gulphtml_pre(file){
 var finalcode=fs.readFileSync(file,'utf8');
finalcode="<div class="+">\n"+finalcode+"\n</div>";
return finalcode;

};

module.exports = function() {
  // Monkey patch Transform or create your own subclass,
  // implementing `_transform()` and optionally `_flush()`
  var transformStream = new Transform({objectMode: true});
  /**
   * @param {Buffer|string} file
   * @param {string=} encoding - ignored if file contains a Buffer
   * @param {function(Error, object)} callback - Call this function (optionally with an
   *          error argument and data) when you are done processing the supplied chunk.
   */
  transformStream._transform = function(file, encoding, callback) {
    var error = null,
        output = gulphtml_pre(file);
    callback(error, output);
  };

  return transformStream;
};


var stream = require("stream");
var util = require("util");
var Queue = require("buffer-queue");

var Readable = module.exports = function Readable (buffer, options) {
  // Make `new` optional
  if (!(this instanceof Readable)) {
    return new Readable(buffer, options);
  }

  this.queue = new Queue();
  // Flag indicating whether all the data has been placed into
  // this stream for pushing
  this.NO_MORE_DATA = false;

  if (!Buffer.isBuffer(buffer)) {
    options = buffer || {};
    buffer = null;
  }
  options = options || {};

  this.frequency = options.frequency || Readable.FREQUENCY;
  this.chunkSize = options.chunkSize || Readable.DEFAULT_CHUNK_SIZE;

  // If supplied a buffer, accept no other
  // data via `put`
  if (buffer) {
    this.queue.push(buffer);
    this.NO_MORE_DATA = true;
  }

  stream.Readable.call(this, options);
};
util.inherits(Readable, stream.Readable);

Readable.FREQUENCY = 1;
Readable.DEFAULT_CHUNK_SIZE = Math.pow(2, 16); // 65536

Readable.prototype._read = function (bytes) {
  var self = this;
  setTimeout(function () {
    var data = self.queue.length() ? self.queue.shift(self.chunkSize) :
               self.NO_MORE_DATA ? null : "";
    self.push(data);
  }, this.frequency);
};

Readable.prototype.put = function (buffer) {
  if (Buffer.isBuffer(buffer)) {
    this.queue.push(buffer);
  } else if (buffer === null) {
    this.NO_MORE_DATA = true;
  }
  this.read(0);
};

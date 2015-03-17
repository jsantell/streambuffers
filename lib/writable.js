var stream = require("stream");
var util = require("util");
var Queue = require("buffer-queue");

var Writable = module.exports = function Writable (options) {
  // Make `new` optional
  if (!(this instanceof Writable)) {
    return new Writable(buffer, options);
  }

  this.queue = new Queue();
  stream.Writable.call(this, options);
};
util.inherits(Writable, stream.Writable);

Writable.prototype._write = function (chunk, enc, next) {
  this.queue.push(chunk);
  next();
};

Writable.prototype.end = function (chunk, enc, next) {
  this._buffer = this.queue.drain();
  stream.Writable.prototype.end.call(this, chunk, enc, next);
};

Writable.prototype.toBuffer = function () {
  return this._buffer;
};

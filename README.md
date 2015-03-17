# streambuffers

[![Build Status](http://img.shields.io/travis/jsantell/streambuffers.svg?style=flat-square)](https://travis-ci.org/jsantell/streambuffers)
[![Build Status](http://img.shields.io/npm/v/streambuffers.svg?style=flat-square)](https://www.npmjs.org/package/streambuffers)

Buffer-based writable and readable streams, using streams2-based inheritance.

## Install

```
npm install streambuffers
```

## Usage


```javascript
var stream = require("bufferstreams");

// Yes, you could just use fs.createReadStream here
var buffer = fs.readFileSync(__dirname + "/file.mp3")

// Turn a buffer into a readable stream right away
stream.Readable(buffer, { chunkSize: Math.pow(2, 16), frequency: 1 })
  .on("data", function (d) { console.log(d); })
  .on("end", function () { console.log("done!"); });

// Or push chunks afterwards
var readable = stream.Readable();

readable.put(new Buffer(100));
readable.put(new Buffer(100));
// Close by calling `put` with `null`
readable.put(null);

readable.on("data", function (d) { console.log(d); });

// Buffer write streams for piping data into a buffer

var writable = stream.Writable();
fs.createReadStream(__dirname + "/file.mp3")
  .pipe(writable)
  .on("end", function () {
    // Fetch buffer with `toBuffer`
    var buffer = writable.toBuffer();
  });
```

## API

### `stream.Writable(options)`

Constructor for Buffer Writable stream; takes options for [WritableStream](https://nodejs.org/api/stream.html#stream_class_stream_writable).

#### `writable.toBuffer()`

Returns the stored buffer after the writable stream is completed.

### `stream.Readable(buffer, options)`

Takes an optional buffer or optional [ReadableStream](https://nodejs.org/api/stream.html#stream_class_stream_readable) options. If supplied `buffer`, no further data can be added, but the stream starts being readable immediately, without having to specify `stream.put(null)` to explicitly close.

Takes additional options of `chunkSize` to specify how many bytes should each push contain, as well as a `frequency` to specify how fast the pushes should occur, in milliseconds.

#### `readable.put(buffer)`

Pushes a buffer to the Readable stream for it to push downstream. Cannot use if supplied a buffer in the constructor. Must call `readable.put(null)` to signify an end of the stream.

## Testing

```
npm test
```

## License

MIT License, Copyright (c) 2015 Jordan Santell

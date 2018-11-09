var expect = require("chai").expect;
var fs = require("fs");
var path = require("path");
var stream = require("stream");
var bufferEqual = require("buffer-equal");
var Readable = require("../").Readable;

var filePath = path.join(__dirname, "fixtures", "sine.mp3");

describe("Readable", function () {
  this.timeout(1000 * 10);

  it("instance of stream.Readable", function () {
    expect(new Readable(new Buffer(100))).to.be.instanceOf(stream.Readable);
  });

  it("instance of stream.Readable without 'new' keyword", function () {
    expect(Readable(new Buffer(100))).to.be.instanceOf(stream.Readable);
  });


  it("pushes provided buffer downstream and closes", function (done) {
    var buffer = fs.readFileSync(filePath);
    var stream = new Readable(buffer);
    var data = [];
    var length = 0;
    stream
      .on("data", function (d) {
        data.push(d);
        length += d.length;
      })
      .on("end", function () {
        expect(bufferEqual(buffer, Buffer.concat(data, length))).to.be.ok;
        done();
      });
  });

  it("has configurable push frequency and chunksize", function (done) {
    var buffer = fs.readFileSync(filePath);
    var stream = new Readable(buffer, { frequency: 50, chunkSize: 20000 });
    var data = [];
    var times = [Date.now()];
    var length = 0;
    stream
      .on("data", function (d) {
        expect(data.length).to.be.lessThan(20000);
        data.push(d);
        times.push(Date.now());
        length += d.length;
      })
      .on("end", function () {
        expect(bufferEqual(buffer, Buffer.concat(data, length))).to.be.ok;
        expect(data.length).to.be.equal(7);
        for (var i = 1; i < times.length; i++) {
          expect(times[i] > times[i-1] - 50).to.be.ok;
        }
        done();
      });
  });

  it("can push additional buffers if not provided one in ctor", function (done) {
    var stream = new Readable();
    var counter = 0;
    stream
      .on("data", function (d) {
        if (++counter === 5) {
          stream.put(null);
        } else {
          expect(d.length).to.be.equal(100);
          stream.put(new Buffer(100));
        }
      })
      .on("end", function () {
        done();
      });
    stream.put(new Buffer(100));
  });

  it("ensure subsequently added buffers kick starts pushing downstream", function (done) {
    var stream = new Readable();
    var counter = 0;
    stream
      .on("data", function () { counter++; })
      .on("end", function () {
        expect(counter).to.be.equal(1);
        done();
      });
    setTimeout(function () {
      stream.put(new Buffer(100));
      stream.put(null);
    }, 100);
  });
});

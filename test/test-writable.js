var expect = require("chai").expect;
var fs = require("fs");
var path = require("path");
var stream = require("stream");
var bufferEqual = require("buffer-equal");
var Writable = require("../").Writable;

var filePath = path.join(__dirname, "fixtures", "sine.mp3");

describe("Writable", function () {
  this.timeout(1000 * 10);

  it("instance of stream.Writable", function () {
    expect(new Writable()).to.be.instanceOf(stream.Writable);
  });

  it("instance of stream.Writable without 'new' keyword", function () {
    expect(Writable()).to.be.instanceOf(stream.Writable);
  });

  it("handles being piped", function (done) {
    var stream = new Writable();
    fs.createReadStream(filePath)
      .pipe(stream)
      .on("finish", function () {
        expect(bufferEqual(stream.toBuffer(), fs.readFileSync(filePath))).to.be.ok;
        done();
      });
  });

  it("writes the chunk passed to 'end'", function () {
    var out = new Writable();
    out.end(new Buffer("foo"));
    expect(out.toBuffer().toString()).to.equal("foo");
  });
});

const assert = require('chai').assert;
const expect = require('chai').expect
const path = require('path');
const fs = require('fs');

const { toKB, filePath, filename } = require('../server.js')

describe('Test:', function() {

  describe('toKB()', function() {
    it('should return a number', function() {
      let result = toKB(1)
      assert.typeOf(result, 'number')
    });
  });

  describe("stream.pipe()", function() {
    const home = process.cwd()
    it('should output a file to /output', function(done) {
      const stream = fs.createReadStream(filePath)
      const output = fs.createWriteStream(`${home}/output/${filename}`)
      stream.pipe(output)
      expect(fs.existsSync(`${home}/output/${filename}`)).to.be.true
      done()
    })
    it('should have the same filesize', function(done) {
      setTimeout(function() {
        const file1 = fs.statSync(`${home}/${filePath}`).size
        const file2 = fs.statSync(`${home}/output/${filename}`).size
        expect(file1).to.be.equal(file2)
        done();
      }, 50);
    });
  })

  describe("Upon invoking the log flag", function() {
    it('should create a logfile in /logs/logfile.txt', function() {
      const home = process.cwd()
      expect(fs.existsSync(`${home}/logs/logfile.txt`)).to.be.true
    })
  })

});

const assert = require('chai').assert;
const { toKB, filePath, output } = require('../server.js')

const fs = require('fs');
const path = require('path');


describe('Server', () => {

  describe('toKB()', () => {
    it('should return a number', () => {
      let result = toKB(1000)
      assert.typeOf(result,'number')
    });
  });

  describe("Stream", () => {
    it('should do something', () => {
      const stream = fs.createReadStream(filePath)
      stream.pipe(output)

    })
  })
});
//     it('should output a copy_FILENAME file', () => {
//       assert.equal();
//     });
//     it('should equal to the same size as original', () => {
//       assert.equal("");
//     });
//   });
// });
//
// describe('Providing arguments via terminal', () => {
//   it('should append to a logfile', () => {
//     assert.equal("");
//   });
//   it('should run a test file', () => {
//     assert.equal("");
//   });
// });

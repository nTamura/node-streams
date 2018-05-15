const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8080;
let filePath = process.argv[2]

// cosmetic vars
const YELLOW = '\x1b[33m%s\x1b[0m'
const GREEN = '\x1b[32m%s\x1b[0m'
const BLUE = '\x1b[34m%s\x1b[0m'
const RED = '\x1b[31m%s\x1b[0m'

// Mocha constructor
const Mocha = require('mocha')
const mocha = new Mocha({
  reporter: 'spec',
  useColors: true,
  fullTrace: true,
});

let data
let chunksKB = []

// argv option bools
const options = process.argv.slice(3)
let log = false
let test = false
let verbose = false

// start timer for program start
console.time('Program operation finished in');

// argv options logic
if (process.argv.length < 3) {
  console.log('File path parameter is required.');
  console.log('Try running "node server sample/small.txt [options]" \n');
  process.exit(1);
} else if (process.argv.length > 3) {
  options.forEach((flag) => {
    switch (flag) {
      case '-l':
        log = true
        break;
      case '-t':
        test = true
        break;
      case '-v':
        verbose = true
        break;
      default:
        console.log(RED,'\nERROR: Ommitted unrecognized option from user argument.');
    }
  })
}

// summary logfile class
class Summary {
  constructor (date, file, totalTime, size, transfer, chunks, lines) {
    this.date = date;
    this.file = file;
    this.totalTime = totalTime;
    this.size = size;
    this.transfer = transfer;
    this.chunks = chunks;
    this.lines = lines;
  }
  logMsg() {
    return (`
      =======================================
      ============= LOG OUTPUT ==============
      ${this.date}
      FILENAME: ${this.file}
      =======================================

      Data stream completed in: ${this.totalTime} ms
      ${this.size} bytes received
      Transfer rate of ${this.transfer} KB/ms
      Number of chunks received: ${this.chunks}
      Total number of lines: ${this.lines}

    `)
  }
  print() {
    console.log(GREEN,this.logMsg());
    if (!log) console.log('To save this log, add the -l flag\n');
  }
}

const toKB = (bytes) => {
  return parseFloat(bytes / 1000)
}

// if no filename is passed
if (!fs.existsSync(filePath)) {
  console.log(RED,`\n  FILEPATH ERROR`);
  console.log('==================');
  console.log(RED,`"${filePath}" is not a valid file`);
  console.log(RED,'Check the file path and extension \n');
  console.log('eg: "sample/small.txt"');
  console.log('eg: "../../somewhere/else.txt"\n');
  console.log('Program will now exit... \n\n');
  process.exit(1);
}

const time = process.hrtime();
const stream = fs.createReadStream(filePath)
const filename = path.parse(filePath).base;
const output = fs.createWriteStream(__dirname + `/output/${filename}`)
stream.pipe(output)

console.log('\n=============================');
console.log(GREEN,'Sending data from ' + filename);
console.log('=============================');

stream
  .on('data', (chunk, err) => {
    if (err) {
      console.log(err)
    } else {
      console.time('Received in');
      data += chunk
      console.log(YELLOW,'\n>>>> incoming chunk');
      console.log(toKB(chunk.length) + ' KB chunk')
      chunksKB.push(toKB(chunk.length))
      console.timeEnd('Received in')
    }
  })
  .on('error', err => console.error(err.stack))
  .on('end', (chunk) => {
    console.log('\n=============================');
    console.log(GREEN,'     Operation completed');
    console.log('=============================\n');

    chunksKBTotal = chunksKB.reduce((a, b) => a + b )
    endTime = process.hrtime(time)
    endTime = parseFloat((endTime[0] * 1000) + endTime[1]/1000000).toFixed(3);
    rate = (endTime / chunksKBTotal)
    rate = parseFloat(rate).toFixed(3)

    summaryLog = new Summary(
      new Date(),
      filename,
      endTime,
      data.length,
      rate,
      chunksKB.length,
      data.toString().split("\n").length
    );

    console.timeEnd('Program operation finished in');
    summaryLog.print()

    // argument actions
    if (options != 0) {
      if (verbose) {
        console.log('Argument flags: {')
          if (log) { console.log('  log: ' + YELLOW, log)}
          if (test) { console.log('  test: ' + YELLOW, test)}
          if (verbose) { console.log('  verbose: ' + YELLOW, verbose)}
        console.log('}');
        console.log('\nOutput file can be found at: ');
        console.log(BLUE,__dirname + `/output/${filename}`);
        if (log) {
          console.log('\nLog file can be found at ')
          console.log(BLUE, __dirname + '/logs/logfile.txt')
        } else {
          console.log('\nNo log argument present, logfile was not created\n');
        }
      }
      if (log) {
        fs.appendFileSync(__dirname + '/logs/logfile.txt', summaryLog)
      }
      if (test) {
        console.log('\nTest argument invoked, running default test file');
        console.log('Results from tests: ');
        mocha.addFile(__dirname + '/test/test-server.js')
        mocha.run();
      }
    }
  })

module.exports = {
  toKB, filePath, output, filename
}

const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8080;
const filePath = process.argv[2]

// cosmetic vars
const YELLOW = '\x1b[33m%s\x1b[0m'
const GREEN = '\x1b[32m%s\x1b[0m'
const BLUE = '\x1b[34m%s\x1b[0m'
const RED = '\x1b[31m%s\x1b[0m'


let data
let size
let chunksKB = []
let lines = 0

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
  options.forEach((o) => {
    switch (o) {
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
       console.log('Unrecognized option from user.');
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
  toString() {
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
    console.log(GREEN,this.toString());
    if (!log) console.log('To save this log, add the -l flag\n');
  }
}

const toKB = (bytes) => {
  return parseFloat(bytes / 1000)
}

const stream = fs.createReadStream(filePath)
let filename = path.parse(filePath).base;
const output = fs.createWriteStream(__dirname + `/output/${filename}`)


stream.pipe(output)


const time = process.hrtime();

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
      lines = data.toString().split("\n").length;
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


    console.timeEnd('Program operation finished in');

    summaryLog = new Summary(
      new Date(),
      filename,
      endTime,
      data.length,
      rate,
      chunksKB.length,
      lines
    );

    summaryLog.print()

    if (options != 0) {
      if (verbose) {
        console.log('Flags: {')
          if (log) { console.log('  log: ' + YELLOW, log)}
          if (test) { console.log('  test: ' + YELLOW, test)}
          if (verbose) { console.log('  verbose: ' + YELLOW, verbose)}
        console.log('}');
        console.log('\nOutput file can be found at: ');
        console.log(BLUE,__dirname + `/output/${filename}`);

        if (log) {
          console.log('\nLog file can be found at ')
          console.log(BLUE, __dirname + '/logs/logfile.txt')
        }
      }

      if (log) {
        fs.appendFileSync(__dirname + '/logs/logfile.txt', summaryLog)
      }
      if (test) {
        console.log('Run test file \n');
      }
    }
  })


// total elapsed time
// total length bytes
// total lines
// rate of input stream in bytes/sec

// $ tail -f mylogfile | myscript --verbose

// Try to avoid using third-party modules
// Stick to node.js core APIs
// Write a test to confirm your module works correctly

// Create a duplex stream
// consumes line-separated text
// outputs objects with keys for the elapsed time
// should have total length in bytes, and total lines.

// Create a stream that takes these objects and outputs one-line summary reports (human readable). The report should include the throughput rate of the input stream in bytes/sec.
//
// Use your new streams in a script that reads stdin (such as tailing a log file) and report on the number of lines and growth rate of the file.
// points if your script is configurable via argv (use your imagination).

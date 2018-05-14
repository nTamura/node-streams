const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8080;
const filePath = process.argv[2]

// cosmetic vars
const ORANGE = '\x1b[33m%s\x1b[0m'
const GREEN = '\x1b[32m%s\x1b[0m'


let chunks = []
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
    !log ? console.log('To save this log, add the -l flag\n') : '';
  }
}

const toKB = (bytes) => { parseFloat(bytes / 1000).toFixed(2) }

const stream = fs.createReadStream(filePath, 'utf8')
let filename = path.parse(filePath).base;

const output = fs.createWriteStream(__dirname + `/output/${filename}`, {'flags':'a'})
//pipe this
// const logfile = fs.createWriteStream(__dirname + '/logs/logfile.txt', {'flags':'a'})

// stream.pipe(output)


const time = process.hrtime();

console.log('\n=============================');
console.log('Sending data from ' + filePath);
console.log('=============================\n');

stream.on('data', (chunk, err) => {
  if (err) {
    console.log(err)
  } else {
    console.time('Received in');
    chunks += Array(chunk)
    lines = chunks.toString().split("\n").length;
    console.log(ORANGE,'\n>>>> incoming chunk');
    console.log(toKB(chunk.length) + ' KB chunk')
    chunksKB.push(parseInt(toKB(chunk.length)))
    console.timeEnd('Received in')
    console.log('');
    output.write(chunk)
  }
})

stream.on('error', err => console.error(err.stack));
stream.on('end', (chunk) => {
  console.log('\n=============================');
  console.log(GREEN,'==== operation completed ====');
  console.log('=============================\n');

  end = process.hrtime(time)
  end = parseFloat((end[0] * 1000) + end[1]/1000000).toFixed(3);

  chunksKBTotal = chunksKB.reduce((a, b) => a + b )
  rate = (end / chunksKBTotal)
  rate = parseFloat(rate).toFixed(3)

  console.timeEnd('Program operation finished in');

  summaryLog = new Summary(new Date(), filePath, end, chunks.length, rate, chunksKB.length, lines);
  summaryLog.print()

  if (options != 0) {
    console.log('Flags: {')
    if (log) {
      console.log('  log: ' + log);
      fs.appendFile(__dirname + '/logs/logfile.txt', summaryLog.toString(), (err) => {
        if (err) {
        console.log(err);
        } else {
          console.log(GREEN,'\nLog file can be found at logfile.txt \n')
        }
      })
    }
    if (test) {
      console.log('  test: ' + test);
      // run test file
    }
    console.log('}');
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

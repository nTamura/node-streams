# Node Streams
This project consumes a file and writes the file to a different location. It logs the read and write information to an optional log file, and reports the output to the terminal.
![screen](https://raw.githubusercontent.com/nTamura/node-streams/master/img/screen1.png)

### Starting the project
To start the program, copy `npm install && npm start` into the terminal

The custom start script will run the default script:

`node server sample/song_of_storms.mp3 -t -l -v`

### Custom Start
You can tell the program to consume your own file by specifying the path. Otherwise you may use the test files in `/sample`.

`node server <FILE PATH> [OPTIONS]`

example: `node server ../../someFile.js -l`

### Available options:
![screen](https://raw.githubusercontent.com/nTamura/node-streams/master/img/screen2.png)

The following custom arguments are provided by argv:
- `-v` Verbose provides extra informational text
- `-l` Log appends to the logfile at `/logs/logfile.txt`
- `-t` Test runs the test file at `/tests/server-test.js` using Mocha

### Logfile
- timestamp
- total elapsed time
- total length in bytes
- rate of input stream in bytes/ms
- total lines

### Testing
![screen](https://raw.githubusercontent.com/nTamura/node-streams/master/img/screen3.png)

Testing provided by passing the `-t` argument.

# Node Streams
project desc.

### Starting the project
To start the program, copy `npm install && npm start` into the terminal

The start script will run the default script `node server song_of_storms.mp3 -t -l`

It adds the -t (test) and -l (log) flags as arguments, the test file will be run, and a log will be provided

====

**Sample script**
You can run the program using your own file by:

`node server <FILE PATH> [OPTIONS]`

example: `node server ../../someFile.js -l`

====

**Available flags:**
- -l (provides a log at ./logs/logfile.txt)
- -t (runs a test by chai/mocha)

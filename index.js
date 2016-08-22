'use strict';

const fs = require('fs');
const glob = require('glob');
const parser = require('./app/parser');

const cwd = process.argv[1] || '/Users/michaelvogt/Downloads/HVSC_Update_65';

glob('**/*.sid', {cwd: cwd}, (err, files) => {
  if (err) {
    console.log(err);
    return -1;
  }

  files.forEach(file => {
    const buffer = fs.readFileSync(cwd + '/' + file);
    console.log();
    console.log();
    console.log();
    console.log(parser.sidToString(buffer));
  });
});

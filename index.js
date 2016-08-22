'use strict';

const fs = require('fs');
const glob = require('glob');
const parser = require('./app/parser');

const cwd = process.argv[2] || '';

glob('**/*.sid', {cwd: cwd}, (err, files) => {
  if (err || !files) {
    console.log(err);
    console.log('Usage: ', process.argv[1], '<directory with sid files>');
    return -1;
  }

  files.forEach(file => {
    const buffer = fs.readFileSync(cwd + '/' + file);
    console.log(parser.sidToString(buffer));
    console.log();
  });
});

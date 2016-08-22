'use strict';

const fs = require('fs');
const chai = require('chai');
const expect = chai.expect;

const parser = require('../../app/parser');

describe('app/parser.js - parse example file,', function() {

  it('should ignore undefined input', function() {
    expect(function() {
      parser.sidToString();
    }).to.throw(/Invalid input data/);
  });

  it('should ignore empty input', function() {
    expect(function() {
      parser.sidToString(new Buffer(0));
    }).to.throw(/Invalid Header: /);
  });

  it('should parse Gambler_2.sid', function() {
    //GIVEN
    const buffer = fs.readFileSync(__dirname + '/../assets/Gambler_2.sid');

    //WHEN
    const result = parser.sidToString(buffer);
    delete result.data;

    //THEN
    expect(result).to.deep.equal({
      magicId: 'PSID',
      version: 2,
      dataOffset: 124,
      loadAddress: 0,
      initAddress: 30080,
      playAddress: 30087,
      songs: 1,
      startSong: 1,
      speed: 1,
      author: 'Richard Mabry',
      name: 'The Gambler',
      released: '1985 Richard Mabry',
      pageLength: 0,
      secondSIDAddress: 0,
      startPage: 0,
      thirdSIDAddress: 0,
      flags: 24
    });
  });

  it('should parse Hey_Jude.sid', function() {
    //GIVEN
    const buffer = fs.readFileSync(__dirname + '/../assets/Hey_Jude.sid');

    //WHEN
    const result = parser.sidToString(buffer);
    delete result.data;

    //THEN
    expect(result).to.deep.equal({
      magicId: 'PSID',
      version: 2,
      dataOffset: 124,
      loadAddress: 0,
      initAddress: 30080,
      playAddress: 30087,
      songs: 1,
      startSong: 1,
      speed: 1,
      author: 'Walter J. Deobil',
      name: 'Hey Jude',
      released: '1985 Walter J. Deobil',
      pageLength: 0,
      secondSIDAddress: 0,
      startPage: 0,
      thirdSIDAddress: 0,
      flags: 24
     });
  });

  it('should parse I_Am_the_Walrus.sid', function() {
    //GIVEN
    const buffer = fs.readFileSync(__dirname + '/../assets/I_Am_the_Walrus.sid');

    //WHEN
    const result = parser.sidToString(buffer);
    delete result.data;

    //THEN
    expect(result).to.deep.equal({
      magicId: 'PSID',
      version: 2,
      dataOffset: 124,
      loadAddress: 0,
      initAddress: 30080,
      playAddress: 30087,
      songs: 1,
      startSong: 1,
      speed: 1,
      author: 'Robert Delio',
      name: 'I Am the Walrus',
      released: '1985 Robert Delio',
      pageLength: 0,
      secondSIDAddress: 0,
      startPage: 0,
      thirdSIDAddress: 0,
      flags: 24
     });
  });

  it('should result same sid when marshalling (json)', function() {
    //GIVEN
    const buffer = fs.readFileSync(__dirname + '/../assets/I_Am_the_Walrus.sid');
    const jsonInput = parser.sidToString(buffer);

    //WHEN
    const result = parser.stringToSid(jsonInput);

    //THEN
    expect(result.length).to.equal(buffer.length);
    const jsonOutput = parser.sidToString(result);
    expect(jsonOutput).to.deep.equal(jsonInput);
  });

  it('should result same sid when marshalling (binary)', function() {
    //GIVEN
    const buffer = fs.readFileSync(__dirname + '/../assets/I_Am_the_Walrus.sid');
    const jsonInput = parser.sidToString(buffer);

    //WHEN
    const result = parser.stringToSid(jsonInput);

    //THEN
    expect(result.length).to.equal(buffer.length);
    expect(result).to.deep.equal(buffer);
  });

});

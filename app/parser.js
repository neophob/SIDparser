'use strict';

function parsePrintableAsciiChars(string) {
  return string.split('\0')[0];
}

module.exports.stringToSid = function(json) {
  if (!json || !json.data) {
    throw new Error('No data found!');
  }
  let buffersize = 0x076;
  if (json.version > 1) {
    buffersize = 0x07C;
  }
  const data = new Buffer(json.data, 'hex');
  buffersize += data.length;
  const buffer = new Buffer(buffersize);
  buffer.fill(0);
  if (json.magicId === 'RSID') {
    buffer.write('RSID', 0, 4, 'ascii');
  } else {
    buffer.write('PSID', 0, 4, 'ascii');
  }

  let version = 2;
  if (json.version > 0 && json.version < 5) {
    version = json.version;
  }
  buffer.writeUIntBE(version, 4, 2);

  let dataOffset = 0x007C;
  if (json.version === 1 && json.dataOffset === 0x0076) {
    dataOffset = 0x0076;
  }
  buffer.writeUIntBE(dataOffset, 6, 2);

  buffer.writeUIntBE(json.loadAddress, 8, 2);
  buffer.writeUIntBE(json.initAddress, 0x0a, 2);
  buffer.writeUIntBE(json.playAddress, 0x0c, 2);
  buffer.writeUIntBE(json.songs, 0x0e, 2);
  buffer.writeUIntBE(json.startSong, 0x010, 2);
  buffer.writeUIntBE(json.speed, 0x012, 4);
  buffer.write(json.name, 0x016, 0x020, 'ascii');
  buffer.write(json.author, 0x036, 0x020, 'ascii');
  buffer.write(json.released, 0x056, 0x020, 'ascii');

  if (version === 1) {
    data.copy(buffer, dataOffset, 0);
    return buffer;
  }

  buffer.writeUIntBE(json.flags, 0x076, 2);
  buffer.writeUIntBE(json.startPage, 0x078, 1);
  buffer.writeUIntBE(json.pageLength, 0x079, 1);
  buffer.writeUIntBE(json.secondSIDAddress, 0x07A, 1);
  buffer.writeUIntBE(json.thirdSIDAddress, 0x07B, 1);
  data.copy(buffer, dataOffset, 0);
  return buffer;
};


module.exports.sidToString = function(buffer) {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error('Invalid input data');
  }

  const magicId = buffer.toString('ascii', 0, 4);
  if (magicId !== 'PSID' && magicId !== 'RSID') {
    throw new Error('Invalid Header: ' + magicId);
  }

  const version = buffer.readUIntBE(4, 2);
  if (version > 4) {
    throw new Error('Invalid version: ' + version);
  }

  const dataOffset = buffer.readUIntBE(6, 2);
  if (dataOffset !== 0x076 && dataOffset !== 0x07C) {
    throw new Error('Invalid data offset: ' + dataOffset);
  }

  const loadAddress = buffer.readUIntBE(8, 2);
  const initAddress = buffer.readUIntBE(0x0a, 2);
  const playAddress = buffer.readUIntBE(0x0c, 2);
  const songs = buffer.readUIntBE(0x0e, 2);
  const startSong = buffer.readUIntBE(0x010, 2);
  const speed = buffer.readUIntBE(0x012, 4);
  const name = parsePrintableAsciiChars(buffer.toString('ascii', 0x016, 0x016 + 0x20));
  const author = parsePrintableAsciiChars(buffer.toString('ascii', 0x036, 0x036 + 0x20));
  const released = parsePrintableAsciiChars(buffer.toString('ascii', 0x056, 0x056 + 0x20));

  if (version === 1) {
    return {
      magicId: magicId,
      version: version,
      dataOffset: dataOffset,
      loadAddress: loadAddress,
      initAddress: initAddress,
      playAddress: playAddress,
      songs: songs,
      startSong: startSong,
      speed: speed,
      name: name,
      author: author,
      released: released,
      data: buffer.toString('hex', 0x076)
    };
  }

  const flags = buffer.readUIntBE(0x076, 2);
  const startPage = buffer.readUIntBE(0x078, 1);
  const pageLength = buffer.readUIntBE(0x079, 1);
  const secondSIDAddress = buffer.readUIntBE(0x07A, 1);
  const thirdSIDAddress = buffer.readUIntBE(0x07B, 1);

  return {
    magicId: magicId,
    version: version,
    dataOffset: dataOffset,
    loadAddress: loadAddress,
    initAddress: initAddress,
    playAddress: playAddress,
    songs: songs,
    startSong: startSong,
    speed: speed,
    name: name,
    author: author,
    released: released,
    flags: flags,
    startPage: startPage,
    pageLength: pageLength,
    secondSIDAddress: secondSIDAddress,
    thirdSIDAddress: thirdSIDAddress,
    data: buffer.toString('hex', 0x07C)
  };

};

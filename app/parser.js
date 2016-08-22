'use stric';

function parsePrintableAsciiChars(string) {
  return string.split('\0')[0];
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

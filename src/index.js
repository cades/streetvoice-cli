const { getPlaylist, convertSongUrlToM3u8Url } = require('./lib');
const player = require('./player');
const UI = require('./ui');

(async () => {
  const hot50 = 'https://streetvoice.com/music/charts/24hr/';
  const playlist = await getPlaylist(hot50);

  UI.setup({
    songNameList: playlist.map(song => song.name),
    player,
    onSongSelect: async songName => {
      const song = playlist.find(song => song.name === songName);
      const m3u8Url = await convertSongUrlToM3u8Url(song.href);
      player.play(m3u8Url);
    },
    onQuit: () => {
      player.stop();
      return process.exit(0);
    }
  })
})();

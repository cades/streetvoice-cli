const { getPlaylist, convertSongUrlToM3u8Url } = require('./lib');
const player = require('./player')();
const UI = require('./ui');

(async () => {
  const hot50 = 'https://streetvoice.com/music/charts/24hr/';
  const playlist = await getPlaylist(hot50);

  player.launch();

  const { setTime } = UI.setup({
    songNameList: playlist.map(song => song.name),
    onSongSelect: async songName => {
      const song = playlist.find(song => song.name === songName);
      const m3u8Url = await convertSongUrlToM3u8Url(song.href);
      player.play(m3u8Url);
    },
    onTogglePause: () => {
      player.togglePause();
    },
    onSeek: (n) => {
      player.seek(n);
    },
    onQuit: () => {
      player.quit();
      return process.exit(0);
    }
  });

  player.on('stateChange', setTime);
})();

const { spawn } = require('child_process')

let player;

function launchPlayer(m3u8Url) {
  if (player) quitPlayer();
  player = spawn('vlc', [m3u8Url]);
}

function quitPlayer() {
  if (!player) return;
  player.kill();
  player = null;
}

module.exports = {
  play: launchPlayer,
  stop: quitPlayer
}

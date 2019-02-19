const { spawn } = require('child_process')
const EventEmitter = require('events');

module.exports = () => {
  let vlcProcess;
  let player = new EventEmitter();
  let intervalHandle;
  let currState = {};

  function launch() {
    if (vlcProcess) quitPlayer();
    vlcProcess = spawn('vlc', ['-I', 'rc', '--no-repeat', '--no-loop']);

    vlcProcess.stdout.on('data', buf => {
      const data = buf.toString();
      const parsed = data.split('\n').map(x => x.replace('\r', '')).filter(x => x !== '>');

      if (data.startsWith('VLC media player')) return;
      if (parsed.length < 2) return;

      const duration = +parsed[0];
      const position = +parsed[1];
      const status = parsed.find(str => str.includes('state')).split(' ')[2];

      const newState = { duration, position, status };
      if (JSON.stringify(newState) === JSON.stringify(currState)) return;
      currState = newState;
      player.emit('stateChange', newState);
    });

    intervalHandle = setInterval(() => {
      vlcProcess.stdin.write('get_length\nget_time\nstatus\n', 'utf8');
    }, 200);
  }

  function play(m3u8Url) {
    vlcProcess.stdin.write(`add ${m3u8Url}\nplay\n`, 'utf8');
  }

  function togglePause() {
    vlcProcess.stdin.write('pause\n', 'utf8');
  }

  function seek(n) {
    vlcProcess.stdin.write(`seek ${n}\n`, 'utf8');
  }

  function quitPlayer() {
    if (!vlcProcess) return;
    clearInterval(intervalHandle);
    vlcProcess.kill();
    vlcProcess = null;
  }

  player.launch = launch;
  player.play = play;
  player.togglePause = togglePause;
  player.seek = seek;
  player.quit = quitPlayer;

  return player;
};

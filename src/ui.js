const blessed = require('blessed');

module.exports = {
  setup: ({
    songNameList,
    onSongSelect,
    onTogglePause,
    onSeek,
    onQuit
  }) => {
    const screen = blessed.screen({
      smartCSR: true,
      fullUnicode: true
    })

    const list = blessed.list({
      top: 'center',
      left: 'center',
      width: '90%',
      height: '80%',
      label: '{bold}{cyan-fg}StreetVoice 即時熱門 Top 50{/cyan-fg}{/bold}',
      content: 'Hello {bold}world{/bold}!',
      tags: true,
      vi: true,
      border: {
        type: 'line'
      },
      style: {
        fg: 'white',
        bg: 'magenta',
        border: {
          fg: '#f0f0f0'
        },
        hover: {
          bg: 'green'
        }
      },
      keys: true
    });

    const nowPlayingText = blessed.box({
      bottm: 0,
      left: 0,
      height: '10%',
      width: '50%',
      content: 'Now playing: none'
    });
    const playerStatusText = blessed.box({
      bottom: 0,
      left: 0,
      height: '10%',
      width: '50%',
      content: 'Time:'
    });
    const progress = blessed.progressbar({
      width: '50%',
      height: 1,
      left: 0,
      bottom: 0,
      orientation: 'horizontal',
      style: {
        bg: 'cyan',
        bar: {
          bg: 'blue',
          fg: 'pink'
        }
      },
      filled: 0
    });

    screen.append(list);
    screen.append(nowPlayingText);
    screen.append(playerStatusText);
    screen.append(progress);

    songNameList.map(songName => list.add(songName));

    list.focus();

    list.on('select', item => {
      const songName = item.content;
      nowPlayingText.setContent(`Now playing: ${songName}`);
      screen.render();
      onSongSelect(songName);
    });

    // Quit on Escape, q, or Control-C.
    screen.key(['escape', 'q', 'C-c'], function(ch, key) {
      onQuit();
    });

    screen.key(['space'], function(ch, key) {
      onTogglePause();
    });

    let currPosition = 0;
    let currDuration = 0;

    screen.key(['right'], function(ch, key) {
      onSeek(Math.min(currPosition + 15, currDuration));
    });

    screen.key(['left'], function(ch, key) {
      onSeek(Math.max(currPosition - 15, 0));
    });

    screen.render();

    return {
      setTime: ({ position, duration, status }) => {
        currPosition = position;
        currDuration = duration;
        playerStatusText.setContent(`Time: ${position}/${duration} status: ${status}`);
        progress.setProgress(Math.ceil(position / duration * 100));
        screen.render();
      }
    };
  }
};

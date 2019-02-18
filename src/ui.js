const blessed = require('blessed');

module.exports = {
  setup: ({
    songNameList,
    onSongSelect,
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
      left: 'center',
      height: '10%',
      width: '90%',
      content: 'Now playing: none'
    });

    screen.append(list);
    screen.append(nowPlayingText);

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

    screen.render();

  }
};

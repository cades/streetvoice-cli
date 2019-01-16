const { getPlaylist, extractSongIdFromUrl, convertSongUrlToM3u8Url } = require('../src/lib');

describe('getPlaylist', () => {
  Given('top50', () => 'https://streetvoice.com/music/charts/24hr/')
  When('result', $ => getPlaylist($.top50))
  Then($ => Array.isArray($.result))
  And($ => $.result.length === 50)
  And($ => 'name' in $.result[0])
  And($ => 'href' in $.result[0])
})

describe('extractSongIdFromUrl', () => {
  Given('songUrl', () => 'https://streetvoice.com/goodband/songs/392681/')
  When('songId', $ => extractSongIdFromUrl($.songUrl))
  Then($ => $.songId === '392681')
})

describe('convertSongUrlToM3u8Url', () => {
  Given('songUrl', () => 'https://streetvoice.com/goodband/songs/392681/')
  When('m3u8Url', $ => convertSongUrlToM3u8Url($.songUrl))
  Then($ => $.m3u8Url === 'https://cfhls.streetvoice.com/music/go/od/goodband/gSkmhWjkkzA5y7dwXFs5RD.mp3.hls.mp3.m3u8')
})

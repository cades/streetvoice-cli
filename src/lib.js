const fetch = require('node-fetch');
const cheerio = require('cheerio');

function getPlaylist(url) {
  return fetch(url)
    .then(res => res.text())
    .then(body => cheerio.load(body))
    .then($ => {
      const links = $('.table-song a')
      return $(links)
        .filter((i, link) => $(link).text() && $(link).attr('href').match(/\/songs\//))
        .toArray()
        .map(link => ({
          name: $(link).text(),
          href: $(link).attr('href')
        }));
    });
}

function extractSongIdFromUrl(url) {
  const [_, catptured] = url.match(/\/songs\/(.*)\//);
  return catptured;
}

function convertSongUrlToM3u8Url(url) {
  const songId = extractSongIdFromUrl(url);
  return fetch(`https://streetvoice.com/api/v3/songs/${songId}/hls/`, { method: 'POST' })
    .then(res => res.json())
    .then(data => data.file);
}

module.exports = {
  getPlaylist,
  extractSongIdFromUrl,
  convertSongUrlToM3u8Url
};

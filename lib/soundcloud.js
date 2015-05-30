var request = require('request');

var SC_URL = 'https://api.soundcloud.com/tracks.json';
var SC_CLIENT_ID = '1c3aeb3f91390630d351f3c708148086';
var SC_EMBED_URL = 'https://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F';
var STATUS_OK = 200;

/**
 * Queries SoundCloud for tracks that match the given query.
 *
 * @param query -- the search query to send to SoundCloud
 *
 * Calls @param callback(error, results):
 *  error -- the error that occurred or null if no error
 *  results -- if error is null, contains the search results
 */
exports.search = function(query, callback) {
  var params = {
    q: query,
    client_id: SC_CLIENT_ID
  }

  request.get({
    url: SC_URL,
    qs: params
  }, function (error, response, body) {
    if (error) callback(error);
    else if (response.statusCode !== STATUS_OK) callback(new Exception('Received bad status code ' + response.statusCode));
    else {
      var results = JSON.parse(body).map(function (track) {
        return {
          title: track.title,
          source: SC_EMBED_URL + track.id
        };
      });

      callback(null, results);
    }
  });
};

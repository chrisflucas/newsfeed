var soundcloud = require('../lib/soundcloud');
var youtube = require('../lib/youtube');
var flickr = require('../lib/flickr');

var NUM_APIS = 3;

module.exports = function(app) {
  /* Renders the newsfeed landing page. */
  app.get('/', function (request, response) {
    response.render('index.html');
  });

  app.get('/search', function (request, response) {
    var query = request.query.query;
    var allResults = [];
    var apisDone = 0;

    soundcloud.search(query, function (error, results) {
      if (error) throw error;
      results[0].api = 'soundcloud';
      allResults.push(results[0]);

      apisDone++;
      if (apisDone === NUM_APIS) response.json(200, allResults);
    });

    youtube.search(query, function (error, results) {
      if (error) throw error;
      results[0].api = 'youtube';
      allResults.push(results[0]);

      apisDone++;
      if (apisDone === NUM_APIS) response.json(200, allResults);
    });

    flickr.search(query, function (error, results) {
      if (error) throw error;
      results[0].api = 'flickr';
      allResults.push(results[0]);

      apisDone++;
      if (apisDone === NUM_APIS) response.json(200, allResults);
    });
  });
};

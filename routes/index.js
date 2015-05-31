var soundcloud = require('../lib/soundcloud');
var youtube = require('../lib/youtube');
var flickr = require('../lib/flickr');

var Post = require('../models/post');

var NUM_APIS = 3;
var STATUS_OK = 200;

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
      if (apisDone === NUM_APIS) response.json(STATUS_OK, allResults);
    });

    youtube.search(query, function (error, results) {
      if (error) throw error;
      results[0].api = 'youtube';
      allResults.push(results[0]);

      apisDone++;
      if (apisDone === NUM_APIS) response.json(STATUS_OK, allResults);
    });

    flickr.search(query, function (error, results) {
      if (error) throw error;
      results[0].api = 'flickr';
      allResults.push(results[0]);

      apisDone++;
      if (apisDone === NUM_APIS) response.json(STATUS_OK, allResults);
    });
  });

  // Read posts
  app.get('/posts', function (request, response) {
    Post.find(function (error, posts) {
      if (error) throw error;
      response.json(STATUS_OK, posts);
    });
  });

  // Create new post
  app.post('/posts', function (request, response) {
    var post = new Post({
      api: request.body.api,
      source: request.body.source,
      title: request.body.title,
      upvotes: 0
    });

    post.save(function (error) {
      if (error) throw error;
      response.json(STATUS_OK, post);
    });
  });

  // Delete a post
  app.post('/posts/remove', function (request, response) {
    Post.findByIdAndRemove(request.body.id, function (error) {
      if (error) throw error;
      response.send(STATUS_OK);
    });
  });

  // Upvote a post
  app.post('/posts/upvote', function (request, response) {
    Post.findById(request.body.id, function (error, post) {
      if (error) throw error;

      post.upvotes++;
      post.save(function (error) {
        if (error) throw error;
        response.json(STATUS_OK, post);
      });
    });
  });
};

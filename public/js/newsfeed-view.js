(function(window, document, undefined) {
  // Retrieve and compile the Handlebars template for rendering posts
  var $newsfeedPostTemplate = $('#newsfeed-post-template');
  var templates = {
    renderPost: Handlebars.compile($newsfeedPostTemplate.html())
  };

  var NewsfeedView = {};

  /* Renders the newsfeed into the given $newsfeed element. */
  NewsfeedView.render = function($newsfeed) {
    PostModel.loadAll(function (error, results) {
      if (error) $('.error').html(error);

      results.forEach(function (post) {
        NewsfeedView.renderPost($newsfeed, post, false);
      });

      $newsfeed.imagesLoaded(function () {
        $newsfeed.masonry({
          columnWidth: '.post',
          itemSelector: '.post'
        });
      });
    });
  };

  /* Given post information, renders a post element into $newsfeed. */
  NewsfeedView.renderPost = function($newsfeed, post, updateMasonry) {
    var $post = $(templates.renderPost(post));
    $newsfeed.prepend($post);

    // Add event listeners
    $post.find('.remove').click(function (event) {
      PostModel.remove(post._id, function (error) {
        if (error) $('.error').html(error);

        $newsfeed.masonry('remove', $post);
        $newsfeed.masonry();
      });
    });

    $post.find('.upvote').click(function (event) {
      PostModel.upvote(post._id, function (error, post) {
        if (error) $('.error').html(error);

        $post.find('.upvote-count').html(post.upvotes);
      });
    });

    if (updateMasonry) {
      $newsfeed.imagesLoaded(function() {
        $newsfeed.masonry('prepended', $post);
      });
    }
  };

  window.NewsfeedView = NewsfeedView;
})(this, this.document);

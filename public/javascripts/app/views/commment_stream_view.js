app.views.CommentStream = app.views.Base.extend({

  template_name: "#comment-stream-template",

  className : "comment_stream",

  events: {
    "submit form": "createComment",
    "focus .comment_box": "commentTextareaFocused",
    "keyup .comment_box": "checkForComment",
    "click .toggle_post_comments": "expandComments"
  },

  initialize: function(options) {
    this.model.comments.bind('add', this.appendComment, this);

    // add autoexpanders to new comment textarea
    this.$('textarea').autoResize();
  },

  postRenderTemplate : function() {
    this.$("label").inFieldLabels();
    this.model.comments.each(this.appendComment, this);
  },

  checkForComment: function(evt) {
    if(this.$(".comment_box").val()) {
      this.$(".comment_submit").removeAttr('disabled');
    } else {
      this.disableCommentSubmit();
    }
  },

  disableCommentSubmit: function(){
    this.$(".comment_submit").attr('disabled', 'true');
  },

  createComment: function(evt) {
    if(evt){ evt.preventDefault(); }

    this.model.comments.create({
      "text" : this.$(".comment_box").val()
    });

    this.$(".comment_box").val("");
    this.disableCommentSubmit(evt);
    return this;
  },

  appendComment: function(comment) {
    this.$(".comments").append(new app.views.Comment({
      model: comment
    }).render().el);
  },

  commentTextareaFocused: function(evt){
    this.$("form").removeClass('hidden').addClass("open");
  },

  expandComments: function(evt){
    if(evt){ evt.preventDefault(); }

    var self = this;
    this.model.comments.fetch({
      success : function(){
        self.model.set({all_comments_loaded : true});
        self.render();
      }
    });
  }

});

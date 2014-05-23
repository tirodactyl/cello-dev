Tracker.Collections.Stories = Backbone.Collection.extend({
  url: function () {
    return 'api/projects/' + this.project.id + '/stories'
  },
  model: Tracker.Models.Story,
  comparator: 'story_rank',
  initialize: function (models, options) {
    this.project = options.project;
  },
  getOrFetch: function (id) {
    var stories = this;
    var story;
    if (!(story = stories.get(id))){
      story = new Tracker.Models.Story({ id: id });
      story.fetch({
        success: function () { stories.add(story); }
      })
    }
    return story;
  },
});
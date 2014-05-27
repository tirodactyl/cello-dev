Tracker.Views.IterationShow = Tracker.Views.CompositeView.extend({
  tagName: 'div',
  className: 'iteration-show clearfix',
  template: JST['iterations/show'],
  render: function () {
    this.$el.html(this.template({
      iteration: this.model
    }));
    
    this.attachSubviews();
    
    return this;
  },
  initialize: function () {
    var view = this;
    this.$el.attr('data-iteration-id', this.model.id);
    // this.storySelector = '.story-show[data-iteration-id="' + this.model.id + '"]'
    _.each(this.storyList(), function (story) {
      console.log(story.get('title'));
      view.addStory(story);
    });
  },
  events: {
    'click .iteration-toggle': 'toggleIteration',
    'dblclick .iteration-header': 'toggleIteration',
  },
  storyList: function () {
    var id = this.model.id
    this._storyList = this._storyList ||
        this.collection.filter(function(story) {
          return story.get('iteration_id') === id;
        });
    return this._storyList
  },
  reList: function () {
    this._storyList = undefined;
    this.storyList();
  },
  toggleIteration: function () {
    this.$('.iteration-toggle').toggleClass('glyphicon-chevron-right glyphicon-chevron-down');
    this.$('.story-views').toggleClass('show hide');
  },
  topRank: function () {
    return _.first(this.storyList()).get('story_rank')
  },
  bottomRank: function () {
    return _.last(this.storyList()).get('story_rank')
  },
  addStory: function (story) {
    var storyView = new Tracker.Views.StoryShow({
      model: story,
      collection: this.collection
    });

    this.addStoryShow(storyView);
  },
  addStoryShow: function (subview) {
    this.addSubview('.story-views', subview);
  },
  removeStoryShow: function (subview) {
    this.removeSubview('.story-views', subview);
  },
});
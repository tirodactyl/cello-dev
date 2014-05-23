Tracker.Views.StoriesPanel = Tracker.Views.CompositeView.extend({
  tagName: 'div',
  className: 'panel panel-default col-lg-4 stories-panel',
  template: JST['stories/panel'],
  title: 'storypanel',
  render: function () {
    this.$el.html(this.template({
      panel: this
    }));
    
    this.attachSubviews();
    
    return this;
  },
  initialize: function (options) {
    var storyView;
    var view = this;
    if (options && options.panelType) {
      this.title = options.panelType;
      this.$el.attr('id', this.title);
    }
    // this.collection.fetch();
    this.collection.each( function (story) {
      storyView = new Tracker.Views.StoryShow({
        model: story
      });
      view.addSubview('.story-views', storyView);
    });
  },
  events: {
    
  },
  addStory: function (story) {
    var storyView;
    if (story.id) {
      storyView = new Tracker.Views.StoryShow({
        model: story
      });
    } else {
      storyView = new Tracker.Views.StoryForm({
        model: story,
        collection: this.collection
      });
    }
    this.addSubview('.story-views', storyView);
  }
});
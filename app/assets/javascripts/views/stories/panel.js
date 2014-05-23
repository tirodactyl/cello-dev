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
    this.listenTo(this.collection, 'remove', this.removeStoryShow);
    this.collection.each( function (story) {
      view.addStory(story);
    });
  },
  events: {
    
  },
  addStory: function (story) {
    var storyView = new Tracker.Views.StoryShow({
      model: story,
      collection: this.collection
    });
    
    if (!story.id) {
      this.listenTo(storyView, 'cancelCreate', this.removeStoryShow)
    }

    this.addSubview('.story-views', storyView);
  },
  removeStoryShow: function (subview) {
    this.removeSubview('.story-views', subview);
  }
});
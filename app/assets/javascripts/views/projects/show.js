Tracker.Views.ProjectShow = Tracker.Views.CompositeView.extend({
  tagName: 'div',
  className: 'projects-show',
  template: JST['projects/show'],
  render: function () {
    this.$el.html(this.template({
      project: this.model
    }));
    
    this.attachSubviews()
    
    return this;
  },
  initialize: function () {
    var view = this;
    this.listenTo(this.model, 'sync', this.render);
    this.listenTo(this.model.stories(), 'toCurrent', this.toCurrent)
    this.model.fetch({
      success: function () {
        view.iterationPanel('done');
        view.iterationPanel('current');
        view.storyPanel('backlog');
        view.storyPanel('icebox');
      }
    });
  },
  events: {
    'showStories': 'showStories',
    'click #add-story': 'newStory',
  },
  storyPanel: function (panelType) {
    var subview = new Tracker.Views.StoriesPanel({
      collection: this.model.stories(),
      panelType: panelType,
    })
    this.addSubview('#project-panels', subview)
  },
  iterationPanel: function (panelType) {
    var subview = new Tracker.Views.IterationsPanel({
      collection: this.model.stories(),
      panelType: panelType,
    });
    this.addSubview('#project-panels', subview);
  },
  newStory: function () {
    if ($('.story-form.not-persisted').length !== 0) { return }
    var newStory = new Tracker.Models.Story({
      story_rank: Math.floor(this.model.stories().last().get('story_rank') + 1),
      project_id: this.model.id,
    });
    _.find(this.subviews('#project-panels'), function (subview) {
      return subview.panelType === 'icebox';
    }).addStory(newStory);
  },
  toCurrent: function (story) {
    var options = { reRank: undefined };
    if (story.iteration_id !== this.model.get('current_iteration_id')) {
      story.save({ iteration_id: this.model.get('current_iteration_id') })
      options.rerank = true;
    }
    
    _.find(this.subviews('#project-panels'), function (subview) {
      return subview.panelType === 'current';
    }).addStory(story, options);
  },
});
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
    this.listenTo(this.model.stories(), 'moveStory', this.moveStory)
    this.model.stories().fetch({
      success: function () {
        view.showPanel('done');
        view.showPanel('current');
        view.showPanel('backlog');
        view.showPanel('icebox');
      }
    });
  },
  events: {
    'showStories': 'showStories',
    'click #add-story': 'newStory',
  },
  showPanel: function (panelType) {
    var subview = new Tracker.Views.StoriesPanel({
      collection: this.model.stories(),
      panelType: panelType,
    })
    this.addSubview('#project-panels', subview)
  },
  newStory: function () {
    if ($('.story-form.not-persisted').length !== 0) { return }
    var newStory = new Tracker.Models.Story({
      story_rank: (this.model.stories().length + 1),
      project_id: this.model.id,
    });
    _.find(this.subviews('#project-panels'), function (subview) {
      return subview.panelType === 'icebox';
    }).addStory(newStory);
  },
  moveStory: function (view, panelTo) {
    this.subviews()
  },
});
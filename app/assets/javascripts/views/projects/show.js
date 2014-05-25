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
    this.model.stories().fetch({
      success: function () {
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
    var newStory = new Tracker.Models.Story({
      story_rank: (this.model.stories().length + 1),
      project_id: this.model.id,
    });
    _.each(this.subviews('#project-panels'), function (subview) {
      if (subview.title === 'icebox') {
        subview.addStory(newStory);
      }
    });
  }
  // addProject: function (project) {
  //   this.render();
  // },
  // removeProject: function (project) {
  //   var selector = 'li.project#' + project.id;
  //   $(this).find(selector).remove();
  //   this.render();
  // }
});
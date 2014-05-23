Tracker.Views.StoryShow = Tracker.Views.CompositeView.extend({
  tagName: 'div',
  className: 'story-show',
  template: JST['stories/show'],
  render: function () {
    this.$el.html(this.template({
      story: this.model
    }));
    return this;
  },
  initialize: function () {
    $(this).data('id', this.model.id);
    // $(this).data('rank', this.model.rank);
    this.listenTo(this.model, 'sync', this.render);
  },
  events: {
    
  },
  // addProject: function (project) {
  //   this.render();
  // },
  // removeProject: function (project) {
  //   var selector = 'li.project#' + project.id;
  //   $(this).find(selector).remove();
  //   this.render();
  // }
});
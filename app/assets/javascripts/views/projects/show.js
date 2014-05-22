Tracker.Views.ProjectShow = Backbone.View.extend({
  tagName: 'div',
  className: 'projects-show',
  template: JST['projects/show'],
  render: function () {
    this.$el.html(this.template({
      project: this.model
    }));
    return this;
  },
  initialize: function () {
    this.listenTo(this.model, 'sync', this.render);
    // this.model.stories().fetch();
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
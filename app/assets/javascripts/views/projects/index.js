Tracker.Views.ProjectIndex = Backbone.View.extend({
  tagName: 'div',
  className: 'projects-index',
  template: JST['projects/index'],
  render: function () {
    this.$el.html(this.template({
      projects: this.collection
    }));
    console.log(this.collection.models);
    return this;
  },
  initialize: function () {
    this.listenTo(this.collection, 'sync add remove', this.render)
    this.listenTo(this.collection, 'add', this.render)
    this.listenTo(this.collection, 'remove', this.render)
    this.collection.fetch();
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
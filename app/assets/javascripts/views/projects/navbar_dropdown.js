Tracker.Views.ProjectNavbar = Backbone.View.extend({
  tagName: 'ul',
  className: 'dropdown-menu projects-dropdown',
  template: JST['projects/navbar_dropdown'],
  render: function () {
    this.$el.html(this.template({
      projects: this.collection
    }));
    return this;
  },
  initialize: function () {
    this.listenTo(this.collection, 'add remove', this.render)
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
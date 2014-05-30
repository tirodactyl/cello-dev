Tracker.Routers.AppRouter = Backbone.Router.extend({
  routes: {
    '': 'projectIndex',
    'projects/new': 'projectNew',
    'projects/:id': 'projectShow',
  },
  initialize: function () {
    this.$rootEl = $('div#content');
    Tracker.Collections.projects = new Tracker.Collections.Projects;
    Tracker.Views.projectNav = new Tracker.Views.ProjectNavbar({
      collection: Tracker.Collections.projects
    });
    $('.navbar-nav.navbar-right').prepend(Tracker.Views.projectNav.render().$el);
  },
  projectIndex: function () {
    var indexView = new Tracker.Views.ProjectIndex({
      collection: Tracker.Collections.projects
    });
    this._swapView(indexView);
  },
  projectNew: function () {
    var newView = new Tracker.Views.ProjectNew();
    this._swapView(newView);
  },
  projectShow: function (id) {
    var showView = new Tracker.Views.ProjectShow({
      model: new Tracker.Models.Project({id: id})
    });
    this._swapView(showView);
  },
  _swapView: function (view) {
    this.currentView && this.currentView.remove();
    this.currentView = view;
    this.$rootEl.html(this.currentView.render().$el);
  },
});
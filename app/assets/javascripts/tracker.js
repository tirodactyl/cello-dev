window.Tracker = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    new Tracker.Routers.AppRouter();
    Backbone.history.start();
  }
};



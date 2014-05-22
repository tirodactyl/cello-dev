window.Tracker = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    console.log('Hello from Backbone!');
    new Tracker.Routers.AppRouter();
    Backbone.history.start();
  }
};

$(document).ready(function(){
  Tracker.initialize();
});

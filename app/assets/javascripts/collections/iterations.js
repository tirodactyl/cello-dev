Tracker.Collections.Iterations = Backbone.Collection.extend({
  url: function () {
    return 'api/projects/' + this.project.id + '/iterations'
  },
  model: Tracker.Models.Iteration,
  comparator: 'start_date',
  initialize: function (models, options) {
    this.project = options.project;
  },
  getOrFetch: function (id) {
    var iterations = this;
    var iteration;
    if (!(iteration = iterations.get(id))){
      iteration = new Tracker.Models.Iteration({ id: id });
      iteration.fetch({
        success: function () { iterations.add(iteration); }
      })
    }
    return iteration;
  },
});
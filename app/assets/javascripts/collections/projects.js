Tracker.Collections.Projects = Backbone.Collection.extend({
  url: 'api/projects',
  model: Tracker.Models.Project,
  comparator: function (project) {
    return moment(project.get('updated_at')) * -1
  },
  getOrFetch: function (id) {
    var projects = this;
    var project;
    if (!(project = projects.get(id))){
      project = new Tracker.Models.Project({ id: id });
      project.fetch({
        success: function () { projects.add(project) }
      })
    }
    return project;
  },
});
Tracker.Views.ProjectIndex = Backbone.View.extend({
  tagName: 'div',
  className: 'projects-index',
  template: JST['projects/index'],
  render: function () {
    this.$el.html(this.template({
      projects: this.collection
    }));
    return this;
  },
  initialize: function () {
    this.listenTo(this.collection, 'sync add remove', this.render)
    this.listenTo(this.collection, 'add', this.render)
    this.listenTo(this.collection, 'remove', this.render)
    this.collection.fetch();
  },
  events: {
    'submit form': 'saveNewProject'
  },
  saveNewProject: function (event) {
    event.preventDefault();
    var $form = $(event.target);
    var project = new Tracker.Models.Project();
    $('#new-project-modal').modal('hide');
    project.save($form.serializeJSON(), {
      success: function () {
        Tracker.Collections.projects.add(project)
        Backbone.history.navigate('/projects/' + project.id, { trigger: true })
      },
      error: function (errors) {
        alert(errors);
      }
    });
  },
});
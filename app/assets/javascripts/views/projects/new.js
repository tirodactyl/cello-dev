Tracker.Views.ProjectNew = Backbone.View.extend({
  tagName: 'div',
  className: 'projects-new',
  template: JST['projects/form'],
  render: function () {
    this.$el.html(this.template());
    return this;
  },
  events: {
    'submit form': 'saveNewProject'
  },
  saveNewProject: function (event) {
    event.preventDefault();
    var $form = $(event.target);
    var project = new Tracker.Models.Project();
    project.save($form.serializeJSON(), {
      success: function () {
        Backbone.history.navigate('/projects/' + project.id, { trigger: true })
      },
      error: function (errors) {
        alert(errors);
      }
    });
  },
});
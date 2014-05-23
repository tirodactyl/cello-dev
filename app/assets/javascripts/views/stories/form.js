Tracker.Views.StoryForm = Backbone.View.extend({
  tagName: 'div',
  className: 'stories-new form-group',
  template: JST['stories/form'],
  render: function () {
    this.$el.html(this.template({
      storyTypes: this.model.storyTypes,
      storyStates: this.model.storyStates,
      storyPointVals: this.model.storyPointVals,
      story: this.model,
      projectId: this.collection.project.id
    }));
    return this;
  },
  events: {
    'submit form': 'saveStory'
  },
  saveStory: function (event) {
    event.preventDefault();
    var $form = $(event.target);
    var story = this.model;
    var stories;
    console.log($form.serializeJSON())
    this.collection && (stories = this.collection);
    story.save($form.serializeJSON(), {
      success: function () {
        stories && stories.add(story);
      },
      error: function (errors) {
        alert(errors);
      }
    });
  },
});
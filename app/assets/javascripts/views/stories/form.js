Tracker.Views.StoryForm = Backbone.View.extend({
  tagName: 'div',
  className: 'stories-new form-group',
  template: JST['stories/form'],
  render: function () {
    this.$el.html(this.template({
      storyTypes: this.model.storyTypes,
      storyStates: this.model.storyStates,
      storyPointVals: this.model.storyPoints,
      story: this.model
    }));
    return this;
  },
  events: {
    'submit form': 'saveStory',
    'click .delete-story': 'destroyStory'
  },
  saveStory: function (event) {
    event.preventDefault();
    var $form = $(event.target);
    var story = this.model;
    var stories = this.collection;
    var view = this;
    story.save($form.serializeJSON().story, {
      success: function () {
        stories.get(story.id) || stories.add(story);
        view.$el.trigger('savedModel');
      },
      error: function (errors) {
        alert(errors);
      }
    });
  },
  destroyStory: function (event) {
    var view = this;
    this.model.destroy();
  }
});
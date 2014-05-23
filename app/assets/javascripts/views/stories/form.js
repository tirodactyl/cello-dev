Tracker.Views.StoryForm = Backbone.View.extend({
  tagName: 'div',
  className: 'stories-new form-group',
  template: JST['stories/form'],
  render: function () {
    this.$el.html(this.template({
      storyTypes: this.model.storyTypes,
      storyStates: this.model.storyStates,
      storyPointVals: this.model.storyPointVals,
      story: this.model
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
    var stories = this.collection;
    var view = this;
    story.save($form.serializeJSON().story, {
      success: function () {
        stories && stories.add(story);
        view.trigger('submit');
      },
      error: function (errors) {
        alert(errors);
      }
    });
  },
});
Tracker.Views.StoryForm = Backbone.View.extend({
  tagName: 'div',
  className: 'story-form clearfix',
  template: JST['stories/form'],
  render: function () {
    this.$el.html(this.template({
      storyTypes: this.model.storyTypes,
      storyStates: this.model.storyStates,
      storyPointVals: this.model.storyPoints,
      story: this.model
    }));
    
    if (!this.model.id) {
      this.$el.addClass('not-persisted');
    }
    
    return this;
  },
  events: {
    'submit form': 'saveStory',
    'click .delete-story': 'destroyStory',
  },
  saveStory: function (event) {
    event.preventDefault();
    var $form = $(event.target);
    var story = this.model;
    var stories = this.collection;
    var view = this;
    this.model.save($form.serializeJSON().story, {
      success: function () {
        stories.get(story.id) || stories.add(story);
        view.off('cancelCreate')
        story.trigger('savedModel');
      },
      error: function (errors) {
        alert(errors.errors);
      }
    });
  },
  destroyStory: function (event) {
    event.preventDefault();
    var view = this;
    this.model.destroy();
    this.trigger('removeStory', this)
  }
});
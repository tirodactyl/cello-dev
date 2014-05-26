Tracker.Models.Iteration = Backbone.Model.extend({
  urlRoot: 'api/iterations',
  stories: function () {
    if (!this._stories) {
      var id = this.id
      this._stories = this.collection.filter(function (story) {
        return story.get('iteration_id') === id;
      });
    }
  
    return this._stories;
  },
});
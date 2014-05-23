Tracker.Models.Project = Backbone.Model.extend({
  urlRoot: 'api/projects',
  stories: function () {
      if (!this._stories) {
        this._stories = new Tracker.Collections.Stories([], {
          project: this
        });
      }
    
      return this._stories;
    },
    parse: function (jsonResp) {
      if(jsonResp.stories) {
        this.stories().set(jsonResp.stories, {parse: true});
        delete jsonResp.stories;
      }
      return jsonResp
    },
});
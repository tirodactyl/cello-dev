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
  iterations: function () {
    if (!this._iterations) {
      this._iterations = new Tracker.Collections.Iterations([], {
        project: this
      });
    }
  
    return this._iterations;
  },
  parse: function (jsonResp) {
    if(jsonResp.stories) {
      this.stories().set(jsonResp.stories, {parse: true});
      delete jsonResp.stories;
    }
    
    if(jsonResp.iterations) {
      this.iterations().set(jsonResp.iterations, {parse: true});
      delete jsonResp.iterations;
    }
    
    return jsonResp
  },
});
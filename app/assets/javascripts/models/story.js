Tracker.Models.Story = Backbone.Model.extend({
  urlRoot: 'api/stories',
  storyTypes: ['feature', 'bug', 'task', 'release'],
  selectedStoryType: function (storyType) {
    if (storyType === this.get('story_type')) {
      return 'selected';
    } else {
      return '';
    }
  },
  storyStates: ['unscheduled', 'unstarted', 'started', 'finished', 'delivered', 'rejected', 'accepted'],
  selectedStoryState: function (storyState) {
    if (storyState === this.get('story_state')) {
      return 'selected';
    } else {
      return '';
    }
  },
  storyPoints: ['0', '1', '2', '3'],
  selectedStoryPointVal: function (pointVal) {
    if (pointVal === this.get('story_points')) {
      return 'selected';
    } else {
      return '';
    }
  }
});
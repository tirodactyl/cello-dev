Tracker.Views.StoriesPanel = Tracker.Views.CompositeView.extend({
  tagName: 'div',
  className: 'panel panel-default stories-panel',
  template: JST['stories/panel'],
  render: function () {
    this.$el.html(this.template({
      panel: this
    }));
    
    this.storiesSortable();
    
    this.attachSubviews();
    
    return this;
  },
  initialize: function (options) {
    var storyView;
    var view = this;
    this.panelType = options.panelType;
    this.$el.attr('id', this.panelType);
    this.panelFilter = this.panelFilters[this.panelType];
    
    this.listenTo(this.collection, 'remove', this.removeStoryShow);
    this.listenTo(this.collection, 'sync', this.reList)
    // remember to add listening to this._storyList - likely in the storyList method so it listens on init of the list
    
    _.each(this.storyList(), function (story) {
      view.addStory(story);
    });
  },
  events: {
    
  },
  panelFilters: {
    icebox: function (model) {
      return model.get('story_state') === 'unscheduled';
    },
    backlog: function (model) {
      return model.get('story_state') === 'unstarted';
    },
  },
  storyList: function () {
    this._storyList = this._storyList ||
        this.collection.filter(this.panelFilter);
    return this._storyList
  },
  reList: function () {
    this._storyList = undefined;
    this.storyList();
  },
  addStory: function (story) {
    var storyView = new Tracker.Views.StoryShow({
      model: story,
      collection: this.collection
    });
    
    if (!story.id) {
      this.listenTo(storyView, 'cancelCreate', this.removeStoryShow)
    }

    this.addStoryShow(storyView);
  },
  addStoryShow: function (subview) {
    this.addSubview('.story-views', subview);
  },
  removeStoryShow: function (story) {
    storyView = _.find(this.subviews('.story-views'), function (subview) {
      return subview.model.id === story.id;
    });
    this.removeSubview('.story-views', storyView);
  },
  
  /// ABANDON HOPE ALL YE WHO ENTER HERE
  
  storiesSortable: function () {
    var storyId, story, oldPanelTitle, newPanelTitle, newRank, oldIterationId, newIterationId;
    var view = this;
  
    this.$('.story-views').sortable({
      connectWith: '.story-views:not(.done)',
      tolerance: 'pointer',
      items: '.story-show:not(.accepted)',
      start: function (event, ui) {
        storyId = ui.item.attr('data-id');
        story = view.collection.get(storyId);
        oldPanelTitle = ui.item.parents('.stories-panel').attr('title');
        newPanelTitle = oldPanelTitle
      },
      receive: function (event, ui) {
        newPanelTitle = ui.item.parents('.stories-panel').attr('title');
      },
      // stop is fired in the original container view and will occur after recieve is fired if the story is moved to a different list
      stop: function (event, ui) {
        itemIndex = ui.item.index('.story-show')

        var prevRank = ui.item.prev('.story-show').data('rank') ||
            $($('.story-show')[itemIndex - 1]).data('rank');
        var postRank = ui.item.next('.story-show').data('rank') ||
            $($('.story-show')[itemIndex + 1]).data('rank');
        if (!prevRank || prevRank < 0) { prevRank = 0; }
        if (!postRank || postRank < 0) { postRank = prevRank + 1; }

        if (story.get('iteration_id') !== newIterationId) {
          story.set('iteration_id', newIterationId);
        }
        
        newRank = ((prevRank + postRank) / 2);
        story.save({story_rank: newRank});
      },
    });
  }
});
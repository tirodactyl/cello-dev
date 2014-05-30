Tracker.Views.StoriesPanel = Tracker.Views.CompositeView.extend({
  tagName: 'div',
  className: 'panel panel-default stories-panel show',
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
    
    this.listenTo(this.collection, 'remove', this.removeStory);
    this.listenTo(this.collection, 'sync', this.reList)
    // remember to add listening to this._storyList - likely in the storyList method so it listens on init of the list
    
    _.each(this.storyList(), function (story) {
      view.addStory(story);
    });
  },
  events: {
    'dropStory .story-views.unstarted': 'dropStory',
  },
  panelFilters: {
    icebox: function (model) {
      return model.get('story_state') === 'unscheduled';
    },
    backlog: function (model) {
      return (model.get('story_state') === 'unstarted') && (!model.get('iteration_id'));
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
  dropStory: function (event, story) {
    this.addStory(story, { reAttach: true });
  },
  addStory: function (story, options) {
    var storyView = new Tracker.Views.StoryShow({
      model: story,
      collection: this.collection
    });
    
    if (!story.id) {
      this.listenTo(storyView, 'cancelCreate', this.removeStoryShow)
    }
    
    this.listenTo(storyView, 'removeStory', this.removeStoryShow)

    this.addStoryShow(storyView);
    
    if (options && options.reAttach) { this.attachSubviews(); }
  },
  addStoryShow: function (subview) {
    this.addSubview('.story-views', subview);
  },
  removeStory: function (story) {
    var storyView = _.find(this.subviews('.story-views'), function (subview) {
      return subview.model.id === story.id;
    });
    if (storyView) {
      this.removeStoryShow(storyView)
    }
  },
  removeStoryShow: function (storyView) {
    this.removeSubview('.story-views', storyView);
    this.reList();
  },
  rank: function (story, $el, options) {
    var itemIndex = $el.index('.story-show')
    var prevRank = $el.prev('.story-show').data('rank') ||
        $($('.story-show')[itemIndex - 1]).data('rank');
    var postRank = $el.next('.story-show').data('rank') ||
        $($('.story-show')[itemIndex + 1]).data('rank');
    if (!prevRank || prevRank < 0) { prevRank = 0; }
    if (!postRank || postRank < 0) { postRank = prevRank + 1; }
    
    var view = this;
    var newRank = ((prevRank + postRank) / 2);
    story.save({story_rank: newRank}, {
      success: function () {
        if(options && options.newPanel) {
          $el.parents('.story-views').trigger('dropStory', story);
          view.removeStory(story);
        }
      }
    });
  },
  
  /// ABANDON HOPE ALL YE WHO ENTER HERE
  
  storiesSortable: function () {
    var storyId, story, oldPanelType, newPanelType,
        oldIterationId, newIterationId, options;
    var view = this;
  
    this.$('.story-views.unstarted').sortable({
      connectWith: '.story-views.unstarted',
      tolerance: 'pointer',
      items: '.story-show',
      start: function (event, ui) {
        storyId = ui.item.attr('data-id');
        story = view.collection.get(storyId);
        oldPanelType = ui.item.parents('.panel').attr('id');
      },
      receive: function (event, ui) {
      },
      // stop is fired in the original container view and will occur after recieve is fired if the story is moved to a different list
      stop: function (event, ui) {
        newPanelType = ui.item.parents('.panel').attr('id');
        newIterationId = ui.item.parents('.iteration-show').attr('data-iteration-id');

        if (story.get('iteration_id') !== newIterationId) {
          story.set('iteration_id', newIterationId);
        }
        
        if (oldPanelType !== newPanelType) {
          if (oldPanelType === 'icebox') {
            story.set('story_state', 'unstarted');
          } else if (newPanelType === 'icebox'){
            story.set('story_state', 'unscheduled');
          }
          options = {newPanel: true}
        }
        
        view.rank(story, ui.item, newPanelType);
      },
    });
  },
  compareBy: function (subviewA, subviewB) {
    var result = subviewA.model.get('story_rank') - subviewB.model.get('story_rank');
    if (result === 0) { return -1 } else { return result };
  },
});
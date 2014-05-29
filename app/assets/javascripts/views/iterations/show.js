Tracker.Views.IterationShow = Tracker.Views.CompositeView.extend({
  tagName: 'div',
  className: 'iteration-show clearfix',
  template: JST['iterations/show'],
  render: function () {
    this.$el.html(this.template({
      iteration: this.model
    }));
    
    this.storiesSortable();
    
    this.attachSubviews();
    
    return this;
  },
  initialize: function () {
    var view = this;
    this.$el.attr('data-iteration-id', this.model.id);
    this.listenTo(this.collection, 'remove', this.removeStory);
    // this.storySelector = '.story-show[data-iteration-id="' + this.model.id + '"]'
    this.listenTo(this.model, 'reList', this.reList)
    _.each(this.storyList(), function (story) {
      view.addStory(story);
    });
  },
  events: {
    'click .iteration-toggle': 'toggleIteration',
    'dblclick .iteration-header': 'toggleIteration',
    'dropStory .story-views.unstarted': 'dropStory'
  },
  storyList: function () {
    var id = this.model.id
    this._storyList =
        this.collection.filter(function(story) {
          return story.get('iteration_id') === id;
        });
    return this._storyList
  },
  // reList: function () {
  //   this._storyList = undefined;
  //   this.storyList();
  // },
  toggleIteration: function () {
    this.$('.iteration-toggle').toggleClass('glyphicon-chevron-right glyphicon-chevron-down');
    this.$('.story-views').toggleClass('show hide');
  },
  dropStory: function (event, story) {
    this.addStory(story, { reAttach: true });
  },
  addStory: function (story, options) {
    var storyView = new Tracker.Views.StoryShow({
      model: story,
      collection: this.collection
    });
    var state = story.get('story_state');
    if (state === 'unstarted') {
      this.addSubview('.story-views.unstarted', storyView, options);
    } else if (state === 'accepted') {
      this.addSubview('.story-views.done', storyView, options);
    } else {
      this.addSubview('.story-views.started', storyView, options);
    }
    if (options && options.reRank) { this.rank(storyView.model, storyView.$el); }
  },
  // addStoryShow: function (subview) {
  //   this.addSubview('.story-views', subview);
  // },
  removeStory: function (story) {
    var storyView = _.find(this.subviews('.story-views'), function (subview) {
      return subview.model.id === story.id;
    });
    if (storyView) {
      this.removeStoryShow(storyView)
    }
  },
  removeStoryShow: function (subview) {
    this.removeSubview('.story-views', subview);
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
  storiesSortable: function () {
    var storyId, story, oldPanelType, newPanelType,
        oldIterationId, newIterationId, options;
    var view = this;
  
    this.$('.story-views.unstarted').sortable({
      connectWith: '.story-views.unstarted',
      tolerance: 'pointer',
      items: '.story-show:not(.accepted)',
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
        
        if (oldPanelType !== newPanelType) {
          if (oldPanelType === 'icebox') {
            story.set('story_state', 'unstarted')
          } else if (newPanelType === 'icebox'){
            story.set('story_state', 'unscheduled')
          }
          options = {newPanel: true}
        }
        
        if (story.get('iteration_id') !== newIterationId) {
          story.set('iteration_id', newIterationId);
        }
        
        view.rank(story, ui.item, options);
      },
    });
    
    this.$('.story-views.started').sortable({
      connectWith: '.story-views.started',
      tolerance: 'pointer',
      items: '.story-show:not(.accepted)',
      start: function (event, ui) {
        storyId = ui.item.attr('data-id');
        story = view.collection.get(storyId);
      },
      receive: function (event, ui) {
      },
      // stop is fired in the original container view and will occur after recieve is fired if the story is moved to a different list
      stop: function (event, ui) {

        view.rank(story, ui.item, view.panelType);
      },
    });
  },
  compareBy: function (subviewA, subviewB) {
    var result = subviewA.model.get('story_rank') - subviewB.model.get('story_rank');
    if (result === 0) { return -1 } else { return result };
  },
});
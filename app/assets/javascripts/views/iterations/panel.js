Tracker.Views.IterationsPanel = Tracker.Views.CompositeView.extend({
  tagName: 'div',
  className: 'panel panel-default col-lg-4 iterations-panel',
  template: JST['iterations/panel'],
  render: function () {
    this.$el.html(this.template({
      panel: this
    }));
    
    this.storiesSortable();
    
    this.attachSubviews();
    
    return this;
  },
  initialize: function (options) {
    var view = this;
    if (options && options.panelType) {
      this.panelType = options.panelType;
      this.$el.attr('id', this.panelType);
      this.panelFilter = this.panelFilters[this.panelType];
    }
    
    this.listenTo(this.collection, 'remove', this.removeStoryShow);
    this.listenTo(this.collection, 'sync', this.reList)
    // remember to add listening to this._storyList - likely in the storyList method so it listens on init of the list
    
    _.each(this.iterationList(), function (iteration) {
      view.addIteration(iteration);
    });
  },
  events: {
    
  },
  panelFilters: {
    current: function (iteration) {
      return iteration.id === this.collection.project.get('current_iteration_id');
    },
    done: function (iteration) {
      return (moment(iteration.get('end_date')).diff(moment()) < 0) &&
          (iteration.id !== this.collection.project.get('current_iteration_id'));
    }
  },
  iterationList: function () {
    this._iterationList = this._iterationList ||
        this.collection.project.iterations().filter(this.panelFilter.bind(this));
    return this._iterationList
  },
  reList: function () {
    this._iterationList = undefined;
    this.iterationList();
  },
  topRank: function () {
    return _.first(this.storyList()).get('story_rank')
  },
  bottomRank: function () {
    return _.last(this.storyList()).get('story_rank')
  },
  addIteration: function (iteration) {
    var iterationView = new Tracker.Views.IterationShow({
      model: iteration,
      collection: this.collection
    });

    this.addSubview('.iteration-views', iterationView);
  },
  removeIteration: function (subview) {
    this.removeSubview('.iteration-views', subview);
  },
  
  /// PROBLEMS BEYOND THIS POINT
  
  storiesSortable: function () {
    var storyId, story, oldPanelTitle, newPanelTitle, newRank;
    var view = this;
  
    this.$('.story-views').sortable({
      connectWith: '.story-views:not(.done)',
      tolerance: 'pointer',
      items: '.story-show:not(.accepted)',
      start: function (event, ui) {
        storyId = ui.item.attr('data-id');
        story = view.collection.get(storyId);
        oldPanelTitle = ui.item.parents('.stories-panel').attr('title');
      },
      receive: function (event, ui) {
        // newPanelTitle = ui.item.parents('.stories-panel').attr('title');
        // view.collection.add(story);
        // console.log('recieve: '+view.model.id+' from:')
        // console.log(ui.sender.parents('.list-show').attr('id'))
        // storyId = ui.item.attr('id')
        // newPanelId = ui.item.parents('.list-show').attr('id')
        // var story = new Trellino.Models.Story({id: storyId});
        // story.fetch();
        // var storyIdsArray = $(this).sortable('toArray');
        // story.set({ list_id: newPanelId });
        // view.model.stories().add(story);
        // story.save({}, function (story) {
        //   // view.model.stories().add(story);
        //   view.sortStories(storyIdsArray, story);
        // });
        // var storyIdsArray = $(this).sortable('toArray');
        // view.model.stories().updateRanks(storyIdsArray);
        // view.render();
        // 
        // window.collection = view.model.stories()
      },
      // stop is fired in the original container view and will occur after recieve is fired if the story is moved to a different list
      stop: function (event, ui) {
        prevRank = ui.item.prev('.story-show').data('rank');
        console.log('prevRank: ' + typeof prevRank)
        postRank = ui.item.next('.story-show').data('rank');
        console.log('postRank: ' + typeof postRank)
        newRank = ((prevRank + postRank) / 2)
        
        story.save({story_rank: newRank}, {
          success: function () {
            ui.item.attr('data-rank', newRank)
          }
        });
        
        if (newPanelTitle && (newPanelTitle !== oldPanelTitle)) {
          view.removeStory(story);
          view.render();
        }
      },
    });
  }
});
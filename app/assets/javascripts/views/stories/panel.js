Tracker.Views.StoriesPanel = Tracker.Views.CompositeView.extend({
  tagName: 'div',
  className: 'panel panel-default col-lg-4 stories-panel',
  template: JST['stories/panel'],
  title: 'storypanel',
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
    if (options && options.panelType) {
      this.title = options.panelType;
      this.$el.attr('id', this.title);
    }
    this.listenTo(this.collection, 'remove', this.removeStoryShow);
    this.collection.each( function (story) {
      view.addStory(story);
    });
  },
  events: {
    
  },
  addStory: function (story) {
    var storyView = new Tracker.Views.StoryShow({
      model: story,
      collection: this.collection
    });
    
    if (!story.id) {
      this.listenTo(storyView, 'cancelCreate', this.removeStoryShow)
    }

    this.addSubview('.story-views', storyView);
  },
  removeStoryShow: function (subview) {
    this.removeSubview('.story-views', subview);
  },
  
  /// MANY PROBLEMS BEYOND THIS POINT
  
  storiesSortable: function () {
    var storyId, story, oldPanelTitle, newPanelTitle, newRank;
    var view = this;
  
    this.$('.story-views').sortable({
      connectWith: '.story-views',
      tolerance: 'pointer',
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
      stop: function (event, ui) {
        prevRank = ui.item.prev().data('rank');
        postRank = ui.item.next().data('rank');
        newRank = ((prevRank + postRank) / 2)
        
        window.v = ui.placeholder;
        
        story.save({story_rank: newRank}, {
          success: function () {
            ui.item.attr('data-rank', newRank)
          }
        });
        
        if (newPanelTitle && (newPanelTitle !== oldPanelTitle)) {
          view.collection.remove(story);
          view.render();
        }
      },
    });
  }
});
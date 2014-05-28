Tracker.Views.IterationsPanel = Tracker.Views.CompositeView.extend({
  tagName: 'div',
  className: 'panel panel-default iterations-panel',
  template: JST['iterations/panel'],
  render: function () {
    this.$el.html(this.template({
      panel: this
    }));
    
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
  removeStory: function (story) {
    iteration = _.find(this.iterationList(), function (iteration) {
      return iteration.id === story.get('iteration_id');
    });
    iteration.removeStory(story);
  },
  addStory: function (story) {
    this.subviews('.iteration-views')[0].addStory(story)
  }
});
Tracker.Views.StoryShow = Tracker.Views.CompositeView.extend({
  tagName: 'div',
  className: 'story-show show',
  template: JST['stories/show'],
  buttonTemplate: JST['stories/state_buttons'],
  render: function () {
    this.$el.html(this.template({
      story: this.model
    }));
    
    this.$('.story-buttons').append(this.buttonTemplate({
      story: this.model
    }));
    
    if (!this.model.id && !this.formView) { this.toggleForm(); }
    
    if (this.formView) { this.togglePreview(); }
    
    this.attachSubviews();
    
    return this;
  },
  initialize: function () {
    this.$el.addClass(this.model.get('story_state'));
    this.$el.attr('data-rank', this.model.get('story_rank'));
    this.$el.attr('data-iteration-id', this.model.get('iteration_id'));
    if(this.model.id) { this.$el.attr('data-id', this.model.id); }
    this.listenTo(this.model, 'sync', this.saveActions);
  },
  events: {
    'click .init-edit': 'expandForm',
    'click .cancel-edit': 'expandForm',
    'dblclick .story-preview': 'expandForm',
    'click .story-start': 'changeStateStart',
    'click .story-finish': 'changeStateFinish',
    'click .story-deliver': 'changeStateDeliver',
    'click .story-reject': 'changeStateReject',
    'click .story-accept': 'changeStateAccept',
    'click .story-restart': 'changeStateStart',
    'savedModel': 'saveActions',
    'click .story-point-assign': 'setPoints',
  },
  setPoints: function (event) {
    points = $(event.target).data('points');
    this.model.save({ story_points: points })
  },
  changeStateStart: function () {
    this.changeState('started');
  },
  changeStateFinish: function () {
    this.changeState('finished');
  },
  changeStateDeliver: function () {
    this.changeState('delivered');
  },
  changeStateReject: function () {
    this.changeState('rejected');
  },
  changeStateAccept: function () {
    this.changeState('accepted');
  },
  changeState: function (newState) {
    this.model.save({ story_state: newState });
  },
  saveActions: function () {
    this.$el.attr('data-id', this.model.id);
    this.$el.attr('data-rank', this.model.get('story_rank'));
    this.$el.attr('data-iteration-id', this.model.get('iteration_id'));
    if (this.formView) { this.expandForm(); }
    this.render();
  },
  expandForm: function () {
    this.togglePreview();
    this.toggleForm();
  },
  togglePreview: function () {
    this.$('.init-edit').toggleClass('glyphicon-chevron-right glyphicon-chevron-down');
    this.$('.story-preview').toggleClass('show hidden');
  },
  toggleForm: function () {
    if (!this.formView) {
      this.formView = new Tracker.Views.StoryForm({
        model: this.model,
        collection: this.collection
      });
      this.addSubview('.story-body', this.formView);
      this.listenTo(this.formView, 'removeStory', this.remove)
    } else {
      this.removeSubview('.story-body', this.formView);
      this.formView = undefined;
    }
    
    if (this.model.id === undefined) {
      this.trigger('cancelCreate', this)
    }
  }
  // addProject: function (project) {
  //   this.render();
  // },
  // removeProject: function (project) {
  //   var selector = 'li.project#' + project.id;
  //   $(this).find(selector).remove();
  //   this.render();
  // }
});